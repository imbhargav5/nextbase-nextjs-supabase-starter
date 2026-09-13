"use client"

import NumberFlow from "@number-flow/react"
import { motion } from "motion/react"
import * as React from "react"

import { ArrowRightIcon } from "@/components/icons/arrow-right"
import { CheckIcon } from "@/components/icons/check"
import { CheckCheckIcon } from "@/components/icons/check-check"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export type PlanLevel = "starter" | "pro" | "all" | string

export interface PricingFeature {
  name: string
  included: PlanLevel | null
}

export interface PricingPlan {
  name: string
  level: PlanLevel
  price: {
    monthly: number
    yearly: number
  }
  popular?: boolean
}

export type PricingBillingDisplay = "subscription" | "one-time"

export interface PricingTableProps
  extends React.HTMLAttributes<HTMLDivElement> {
  features: PricingFeature[]
  plans: PricingPlan[]
  onPlanSelect?: (plan: PlanLevel) => void
  defaultPlan?: PlanLevel
  defaultInterval?: "monthly" | "yearly"
  /** When `one-time`, hides the billing toggle and shows a single price per plan. */
  billingDisplay?: PricingBillingDisplay
  containerClassName?: string
  buttonClassName?: string
}

export function PricingTable({
  features,
  plans,
  onPlanSelect,
  defaultPlan = "pro",
  defaultInterval = "monthly",
  billingDisplay = "subscription",
  className,
  containerClassName,
  buttonClassName,
  ...props
}: PricingTableProps) {
  const isOneTime = billingDisplay === "one-time"
  const [isYearly, setIsYearly] = React.useState(
    isOneTime ? false : defaultInterval === "yearly",
  )
  const [selectedPlan, setSelectedPlan] = React.useState<PlanLevel>(defaultPlan)

  function handlePlanSelect(plan: PlanLevel) {
    setSelectedPlan(plan)
    onPlanSelect?.(plan)
  }

  return (
    <section
      className={cn(
        "bg-background text-foreground",
        "px-4 pb-12 sm:pb-16 md:pb-24",
        "fade-bottom overflow-hidden pb-0",
        className,
      )}
    >
      <div
        className={cn("w-full max-w-3xl mx-auto px-4", containerClassName)}
        {...props}
      >
        {isOneTime ? null : (
          <div className="mt-8 flex justify-end mb-4 sm:mt-10 sm:mb-8">
            <div
              role="tablist"
              aria-label="Billing interval"
              className="relative inline-flex items-center rounded-full border border-border bg-muted/50 p-1"
            >
              {(
                [
                  { label: "Monthly", value: false },
                  { label: "Yearly", value: true },
                ] as const
              ).map(({ label, value }) => {
                const isActive = isYearly === value

                return (
                  <button
                    key={label}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setIsYearly(value)}
                    className={cn(
                      "relative z-10 rounded-full px-4 py-1.5 text-xs font-medium transition-colors sm:text-sm",
                      isActive
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {isActive ? (
                      <motion.span
                        layoutId="pricing-billing-interval"
                        className="absolute inset-0 rounded-full bg-background shadow-sm ring-1 ring-border/60"
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 35,
                        }}
                      />
                    ) : null}
                    <span className="relative z-10">{label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        <div className="mb-8 flex flex-col gap-4 sm:flex-row">
          {plans.map((plan) => {
            const isActive = selectedPlan === plan.level

            return (
              <button
                key={plan.name}
                type="button"
                onClick={() => handlePlanSelect(plan.level)}
                className="relative flex-1 rounded-xl border border-border/80 p-4 text-left transition-colors hover:border-brand/30"
              >
                {isActive ? (
                  <motion.span
                    layoutId="pricing-plan-select"
                    className="pointer-events-none absolute inset-0 rounded-xl ring-2 ring-brand"
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 35,
                    }}
                  />
                ) : null}
                <div className="relative z-10">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium">{plan.name}</span>
                    {plan.popular ? (
                      <span className="rounded-full bg-brand-muted px-2 py-0.5 text-xs font-medium text-brand">
                        Popular
                      </span>
                    ) : null}
                  </div>
                  <div className="flex items-baseline gap-1">
                    <NumberFlow
                      format={{
                        style: "currency",
                        currency: "USD",
                        trailingZeroDisplay: "stripIfInteger",
                      }}
                      value={isYearly ? plan.price.yearly : plan.price.monthly}
                      className="text-2xl font-bold"
                    />
                    <span className="text-sm font-normal text-muted-foreground">
                      {isOneTime
                        ? " once"
                        : `/${isYearly ? "year" : "month"}`}
                    </span>
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        <div className="overflow-hidden rounded-xl border border-border/80">
          <div className="overflow-x-auto">
            <div className="min-w-[640px] divide-y divide-border/80">
              <div className="flex items-center bg-brand-muted/40 p-4">
                <div className="flex-1 text-sm font-medium">Features</div>
                <div className="flex items-center gap-8 text-sm">
                  {plans.map((plan) => (
                    <div
                      key={plan.level}
                      className="w-16 text-center font-medium"
                    >
                      {plan.name}
                    </div>
                  ))}
                </div>
              </div>
              {features.map((feature) => (
                <div
                  key={feature.name}
                  className={cn(
                    "group flex items-center p-4 transition-colors",
                    feature.included === selectedPlan &&
                    "bg-brand-muted/35",
                  )}
                >
                  <div className="flex-1 text-sm">{feature.name}</div>
                  <div className="flex items-center gap-8 text-sm">
                    {plans.map((plan) => (
                      <div
                        key={plan.level}
                        className={cn(
                          "w-16 flex justify-center",
                          plan.level === selectedPlan && "font-medium",
                        )}
                      >
                        {shouldShowCheck(feature.included, plan.level) ? (
                          isEnterprisePlan(plan.level) ? (
                            <CheckCheckIcon
                              size={20}
                              className="text-brand"
                              active={plan.level === selectedPlan}
                              activationKey={selectedPlan}
                            />
                          ) : (
                            <CheckIcon
                              size={20}
                              className="text-brand"
                              active={plan.level === selectedPlan}
                              activationKey={selectedPlan}
                            />
                          )
                        ) : (
                          <span className="text-muted-foreground/35">
                            -
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Button
            variant="brand"
            className={cn(
              "group w-full rounded-xl px-8 py-2 sm:w-auto",
              buttonClassName,
            )}
          >
            Get started with {plans.find((p) => p.level === selectedPlan)?.name}
            <ArrowRightIcon size={16} />
          </Button>
        </div>
      </div>
    </section>
  )
}

function isEnterprisePlan(level: PlanLevel): boolean {
  return level === "all" || level === "enterprise"
}

function shouldShowCheck(
  included: PricingFeature["included"],
  level: string,
): boolean {
  if (included === "all") return true
  if (included === "pro" && (level === "pro" || level === "all")) return true
  if (
    included === "starter" &&
    (level === "starter" || level === "pro" || level === "all")
  )
    return true
  return false
}
