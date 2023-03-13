import { LoadingSpinner } from '@/components/presentational/tailwind/LoadingSpinner';
import { PricingModeToggle } from '@/components/presentational/tailwind/PricingModeToggle';
import H3 from '@/components/presentational/tailwind/Text/H3';
import { classNames } from '@/utils/classNames';
import {
  useCreateOrganizationCheckoutSessionMutation,
  useCreateOrganizationCustomerPortalMutation,
  useGetAllActiveProducts,
  useGetIsOrganizationAdmin,
  useGetOrganizationSubscription,
} from '@/utils/react-query-hooks';
import { getStripe } from '@/utils/stripe-client';
import { useMemo, useState } from 'react';
import { toast } from 'react-hot-toast';
import { FiCheck, FiExternalLink, FiX } from 'react-icons/fi';
import { useOrganizationIdLayoutContext } from '../../../../OrganizationIdLayoutContext';

function ChoosePricingTable({
  isOrganizationAdmin,
}: {
  isOrganizationAdmin: boolean;
}) {
  const { organizationId } = useOrganizationIdLayoutContext();
  const [pricingMode, setPricingMode] = useState<'month' | 'year'>('month');
  const {
    data,
    isLoading: isLoadingProducts,
    error,
  } = useGetAllActiveProducts();
  const { mutate, isLoading: isCreatingCheckoutSession } =
    useCreateOrganizationCheckoutSessionMutation({
      onSuccess: async (sessionId) => {
        const stripe = await getStripe();
        stripe?.redirectToCheckout({ sessionId });
      },
      onError: (error) => {
        toast.error(String(error));
      },
    });

  // supabase cannot sort by foreign table, so we do it here
  const productsSortedByPrice = useMemo(() => {
    if (!data) return [];
    const products = data.map((product) => {
      const prices = Array.isArray(product.prices)
        ? product.prices
        : [product.prices];
      const priceInSelectedInterval = prices.find((price) => {
        return price.interval === pricingMode;
      });
      if (!priceInSelectedInterval) return null;

      const priceString = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: priceInSelectedInterval.currency,
        minimumFractionDigits: 0,
      }).format((priceInSelectedInterval.unit_amount || 0) / 100);
      return {
        ...product,
        price: priceInSelectedInterval,
        priceString,
      };
    });

    return products
      .sort((a, b) => a.price.unit_amount - b.price.unit_amount)
      .filter(Boolean);
  }, [data, pricingMode]);

  if (isLoadingProducts)
    return (
      <div>
        <LoadingSpinner className="text-blue-500" />
      </div>
    );

  if (error) return <div>Error</div>;
  return (
    <div className="max-w-2xl space-y-4">
      {/* <Overline>Pricing table</Overline> */}
      <H3>Pricing table</H3>
      <div className="space-y-2">
        <PricingModeToggle mode={pricingMode} onChange={setPricingMode} />
        <div className="flex space-x-6">
          {productsSortedByPrice.map((product) => {
            return (
              <>
                <div
                  key={product.id + pricingMode}
                  className="w-full flex-1 mt-4 p-8 order-2 bg-white shadow-lg rounded-lg sm:w-96 lg:w-full lg:order-1 border"
                >
                  <div className="mb-7 pb-7 flex items-center border-b border-gray-200">
                    <div className="ml-5">
                      <span className="block text-lg text-gray-600 font-medium">
                        {' '}
                        {product.name}
                      </span>
                      <span>
                        <span
                          key={product.price.id}
                          className="text-2xl font-bold"
                        >
                          {' '}
                          {product.priceString}/{product.price.interval}{' '}
                        </span>
                      </span>
                    </div>
                  </div>
                  <ul className="mb-7 font-medium text-gray-500">
                    <li className="flex text-md items-center mb-2">
                      <FiCheck className="text-green-500" />
                      <span className="ml-3">{product.description}</span>
                    </li>
                    <li className="flex text-md items-center mb-2">
                      <FiCheck className="text-green-500" />
                      <span className="ml-3">A nice feature</span>
                    </li>
                    <li className="flex text-md items-center mb-2">
                      <FiCheck className="text-green-500" />
                      <span className="ml-3">Another nice feature</span>
                    </li>
                    <li className="flex text-md items-center mb-2">
                      {product.price.unit_amount > 0 ? (
                        <FiCheck className="text-green-500" />
                      ) : (
                        <FiX className="text-red-500" />
                      )}
                      <span className="ml-3">A premium feature</span>
                    </li>
                  </ul>
                  <div className="flex justify-center items-center rounded-xl py-1 text-center text-white text-xl">
                    {isOrganizationAdmin ? (
                      <button
                        className={classNames(
                          'flex w-full items-center justify-center rounded border border-transparent py-2 px-4 text-sm font-medium  shadow-sm focus:outline-none focus:ring-2  focus:ring-offset-2',
                          'bg-blue-500 focus:ring-blue-500 hover:bg-blue-600  text-white'
                        )}
                        onClick={() => {
                          mutate({
                            organizationId: organizationId,
                            priceId: product.price.id,
                          });
                        }}
                      >
                        {isCreatingCheckoutSession ? 'Loading...' : 'Choose'}
                      </button>
                    ) : (
                      <span className="text-sm bg-green-50 px-3 py-2 text-gray-900 rounded-lg">
                        Contact your administrator to upgrade plan
                      </span>
                    )}
                  </div>
                </div>
              </>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function OrganizationSubscripionDetails() {
  const { organizationId } = useOrganizationIdLayoutContext();
  const { data, isLoading, error } =
    useGetOrganizationSubscription(organizationId);
  const { mutate, isLoading: isLoadingCustomerPortalLink } =
    useCreateOrganizationCustomerPortalMutation({
      onSuccess: (url) => {
        window.location.assign(url);
      },
      onError: (error) => {
        toast.error(String(error));
      },
    });
  const { data: isOrganizationAdmin, isLoading: isOrganizationAdminLoading } =
    useGetIsOrganizationAdmin(organizationId);

  if (isLoading ?? isOrganizationAdminLoading)
    return (
      <div>
        <LoadingSpinner className="text-blue-500" />
      </div>
    );
  if (error) {
    return (
      <>
        <div className="space-y-1">
          <H3>Subscription</H3>
          <p className="text-gray-500 text-sm">
            This organization doesn't have any plan at the moment.
          </p>
        </div>
        <ChoosePricingTable isOrganizationAdmin={isOrganizationAdmin} />
      </>
    );
  }
  const prices = Array.isArray(data?.prices) ? data?.prices[0] : data?.prices;
  const products = Array.isArray(prices?.products)
    ? prices?.products[0]
    : prices?.products;
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <H3>Subscription</H3>
        <p className="text-gray-700 text-base">
          Subscription details You are currently on the{' '}
          <span className="text-blue-500">{products?.name} 🎉</span>.
        </p>
      </div>
      {isOrganizationAdmin ? (
        <div className="space-y-2">
          <button
            className={classNames(
              'inline-flex space-x-1 items-center  justify-center rounded border border-transparent py-2 px-4 text-sm font-medium  shadow-sm focus:outline-none focus:ring-2  focus:ring-offset-2',
              'bg-blue-500 focus:ring-blue-500 hover:bg-blue-600  text-white'
            )}
            disabled={isLoading}
            onClick={() => {
              mutate({
                organizationId: organizationId,
              });
            }}
          >
            <span>
              {isLoadingCustomerPortalLink
                ? 'Loading...'
                : 'Manage Subscription'}{' '}
            </span>
            <FiExternalLink aria-hidden="true" />{' '}
          </button>
          <p className="text-gray-500 text-xs">
            Manage your subscription. You can modify, upgrade or cancel your
            membership from here.
          </p>
        </div>
      ) : (
        <p className="text-gray-500 text-sm">
          Contact your administrator to upgrade plan.
        </p>
      )}
    </div>
  );
}
