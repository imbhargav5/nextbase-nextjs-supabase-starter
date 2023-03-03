import { createOrRetrieveCustomer } from '@/utils/supabase-admin';
import { withUserLoggedInApi } from '@/utils/api-routes/wrappers/withUserLoggedInApi';
import { NextApiRequest, NextApiResponse } from 'next';
import { AppSupabaseClient } from '@/types';
import { Session, User } from '@supabase/supabase-js';
import { getURL } from '@/utils/helpers';
import { stripe } from '@/utils/stripe';
import { errors } from '@/utils/errors';

async function createCheckoutSession(
  req: NextApiRequest,
  res: NextApiResponse,
  supabaseServerClient: AppSupabaseClient,
  _: Session,
  user: User
) {
  if (req.method === 'POST') {
    const { organizationId } = req.query;
    const { priceId } = req.body;
    if (typeof organizationId !== 'string') {
      return res.status(400).json({
        error: { statusCode: 400, message: 'Invalid organization id' },
      });
    }
    if (typeof priceId !== 'string') {
      return res
        .status(400)
        .json({ error: { statusCode: 400, message: 'Invalid price id' } });
    }
    try {
      const { data, error } = await supabaseServerClient
        .from('organizations')
        .select('id, title')
        .eq('id', organizationId)
        .single();

      if (!data) {
        return res.status(404).json({
          error: { statusCode: 404, message: 'Organization not found' },
        });
      } else if (error) {
        return res
          .status(500)
          .json({ error: { statusCode: 500, message: error.message } });
      }

      const customer = await createOrRetrieveCustomer({
        organizationId: organizationId,
        organizationTitle: data.title,
        email: user.email || '',
      });
      if (!customer) throw Error('Could not get customer');

      const stripeSession = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        billing_address_collection: 'required',
        customer,
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: 'subscription',
        allow_promotion_codes: true,
        subscription_data: {
          trial_from_plan: true,
          metadata: {},
        },
        success_url: `${getURL()}/organization/${organizationId}/settings/billing`,
        cancel_url: `${getURL()}/organization/${organizationId}/settings/billing`,
      });

      return res.status(200).json({ sessionId: stripeSession.id });
    } catch (error: unknown) {
      errors.add(error);
      if (error instanceof Error) {
        res
          .status(500)
          .json({ error: { statusCode: 500, message: error.message } });
      } else {
        res
          .status(500)
          .json({ error: { statusCode: 500, message: String(error) } });
      }
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}

export default withUserLoggedInApi(createCheckoutSession);
