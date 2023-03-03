import { createClient } from '@supabase/supabase-js';
import { stripe } from './stripe';
import { toDateTime } from './helpers';
import Stripe from 'stripe';
import { Database } from '@/lib/database.types';
import { View } from '@/types';
import {
  ADMIN_ORGANIZATION_LIST_VIEW_PAGE_SIZE,
  ADMIN_USER_LIST_VIEW_PAGE_SIZE,
} from '@/constants';
import { errors } from './errors';

/**
 * IMPORTANT!! supabaseAdmin uses the SERVICE_ROLE_KEY which you must only use in a secure server-side context
 * as it has admin privileges and overwrites RLS policies!
 */
export const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

const upsertProductRecord = async (product: Stripe.Product) => {
  const { error } = await supabaseAdmin.from('products').upsert([
    {
      id: product.id,
      active: product.active,
      name: product.name,
      description: product.description ?? undefined,
      image: product.images?.[0] ?? null,
      metadata: product.metadata,
    },
  ]);
  if (error) throw error;
  console.log(`Product inserted/updated: ${product.id}`);
};

const upsertPriceRecord = async (price: Stripe.Price) => {
  const { error } = await supabaseAdmin.from('prices').upsert([
    {
      id: price.id,
      product_id: typeof price.product === 'string' ? price.product : '',
      active: price.active,
      currency: price.currency,
      description: price.nickname ?? undefined,
      type: price.type,
      unit_amount: price.unit_amount ?? undefined,
      interval: price.recurring?.interval,
      interval_count: price.recurring?.interval_count,
      trial_period_days: price.recurring?.trial_period_days,
      metadata: price.metadata,
    },
  ]);
  if (error) throw error;
  console.log(`Price inserted/updated: ${price.id}`);
};

const createOrRetrieveCustomer = async ({
  email,
  organizationId,
  organizationTitle,
}: {
  email?: string;
  organizationId: string;
  organizationTitle?: string;
}) => {
  const { data, error } = await supabaseAdmin
    .from('customers')
    .select('stripe_customer_id')
    .eq('organization_id', organizationId)
    .single();
  if (error || !data?.stripe_customer_id) {
    // No customer record found, let's create one.
    const customerData: {
      metadata: { supabaseOrganizationId: string };
      email?: string;
      description?: string;
    } = {
      metadata: {
        supabaseOrganizationId: organizationId,
      },
    };
    if (email) customerData.email = email;
    if (organizationTitle) customerData.description = organizationTitle;
    const customer = await stripe.customers.create(customerData);
    // Now insert the customer ID into our Supabase mapping table.
    const { error: supabaseError } = await supabaseAdmin
      .from('customers')
      .insert([
        { organization_id: organizationId, stripe_customer_id: customer.id },
      ]);
    if (supabaseError) throw supabaseError;
    console.log(`New customer created and inserted for ${organizationId}.`);
    return customer.id;
  }
  return data.stripe_customer_id;
};

/**
 * Copies the billing details from the payment method to the customer object.
 */
const copyBillingDetailsToCustomer = async (
  organizationId: string,
  payment_method: Stripe.PaymentMethod
) => {
  //Todo: check this assertion
  const customer = payment_method.customer as string;
  const { name, phone, address } = payment_method.billing_details;
  if (!name || !phone || !address) return;
  await stripe.customers.update(customer, { name, phone, address });
  const { error } = await supabaseAdmin
    .from('organizations_private_info')
    .update({
      billing_address: { ...address },
      payment_method: { ...payment_method[payment_method.type] },
    })
    .eq('id', organizationId);
  if (error) throw error;
};

const manageSubscriptionStatusChange = async (
  subscriptionId: string,
  customerId: string,
  createAction = false
) => {
  // Get organizations's UUID from mapping table.
  const { data: customerData, error: noCustomerError } = await supabaseAdmin
    .from('customers')
    .select('*')
    .eq('stripe_customer_id', customerId)
    .single();
  if (noCustomerError) throw noCustomerError;

  const { organization_id: organizationId } = customerData!;

  const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
    expand: ['default_payment_method'],
  });
  // Upsert the latest status of the subscription object.
  /* eslint-disable prettier/prettier */
  const subscriptionData: Database['public']['Tables']['subscriptions']['Insert'] =
  {
    id: subscription.id,
    organization_id: organizationId,
    metadata: subscription.metadata,
    status: subscription.status,
    price_id: subscription.items.data[0].price.id,
    //TODO check quantity on subscription
    quantity: subscription.items.data[0].quantity,
    cancel_at_period_end: subscription.cancel_at_period_end,
    cancel_at: subscription.cancel_at
      ? toDateTime(subscription.cancel_at).toISOString()
      : null,
    canceled_at: subscription.canceled_at
      ? toDateTime(subscription.canceled_at).toISOString()
      : null,
    current_period_start: toDateTime(
      subscription.current_period_start
    ).toISOString(),
    current_period_end: toDateTime(
      subscription.current_period_end
    ).toISOString(),
    created: toDateTime(subscription.created).toISOString(),
    ended_at: subscription.ended_at
      ? toDateTime(subscription.ended_at).toISOString()
      : null,
    trial_start: subscription.trial_start
      ? toDateTime(subscription.trial_start).toISOString()
      : null,
    trial_end: subscription.trial_end
      ? toDateTime(subscription.trial_end).toISOString()
      : null,
  };
  /* eslint-enable prettier/prettier */

  const { error } = await supabaseAdmin
    .from('subscriptions')
    .upsert([subscriptionData]);
  if (error) throw error;
  console.log(
    `Inserted/updated subscription [${subscription.id}] for organization [${organizationId}]`
  );

  // For a new subscription copy the billing details to the customer object.
  // NOTE: This is a costly operation and should happen at the very end.
  if (createAction && subscription.default_payment_method && organizationId)
    await copyBillingDetailsToCustomer(
      organizationId,
      subscription.default_payment_method as Stripe.PaymentMethod
    );
};

export const getUsersPaginated = async (
  pageNumber = 0,
  search?: string | undefined
): Promise<[number, Array<View<'app_admin_view_all_users'>>]> => {
  const from = pageNumber * ADMIN_USER_LIST_VIEW_PAGE_SIZE;
  const to = (pageNumber + 1) * ADMIN_USER_LIST_VIEW_PAGE_SIZE - 1;
  if (search) {
    const { data, error } = await supabaseAdmin
      .from('app_admin_view_all_users')
      .select('*')
      .order('created_at', { ascending: true })
      .like('email', `%${search}%`)
      .range(from, to);
    if (error) throw error;
    return [pageNumber, data];
  }
  const { data, error } = await supabaseAdmin
    .from('app_admin_view_all_users')
    .select('*')
    .order('created_at', { ascending: true })
    .range(from, to);
  if (error) throw error;
  return [pageNumber, data];
};

export const getOrganizationsPaginated = async (
  pageNumber = 0,
  search?: string | undefined
): Promise<[number, Array<View<'app_admin_view_all_organizations'>>]> => {
  const from = pageNumber * ADMIN_ORGANIZATION_LIST_VIEW_PAGE_SIZE;
  const to = (pageNumber + 1) * ADMIN_ORGANIZATION_LIST_VIEW_PAGE_SIZE - 1;
  if (search) {
    const { data, error } = await supabaseAdmin
      .from('app_admin_view_all_organizations')
      .select('*')
      .order('created_at', { ascending: true })
      .like('title', `%${search}%`)
      .range(from, to);
    if (error) throw error;
    return [pageNumber, data];
  }
  const { data, error } = await supabaseAdmin
    .from('app_admin_view_all_organizations')
    .select('*')
    .order('created_at', { ascending: true })
    .range(from, to);
  if (error) throw error;
  return [pageNumber, data];
};

export const enableMaintenanceMode = async () => {
  const { data, error } = await supabaseAdmin
    .rpc('enable_maintenance_mode')
    .single();

  if (error) {
    errors.add(error.message);
    throw error;
  }

  return data;
};

export const disableMaintenanceMode = async () => {
  const { data, error } = await supabaseAdmin
    .rpc('disable_maintenance_mode')
    .single();

  if (error) {
    errors.add(error.message);
    throw error;
  }

  return data;
};

export {
  upsertProductRecord,
  upsertPriceRecord,
  createOrRetrieveCustomer,
  manageSubscriptionStatusChange,
};
