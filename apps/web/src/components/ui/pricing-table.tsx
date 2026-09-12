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

export interface PricingTableProps
  extends React.HTMLAttributes<HTMLDivElement> {
  features: PricingFeature[]
  plans: PricingPlan[]
  onPlanSelect?: (plan: PlanLevel) => void
  defaultPlan?: PlanLevel
  defaultInterval?: "monthly" | "yearly"
  containerClassName?: string
  buttonClassName?: string
}

export function PricingTable({
  features,
  plans,
  onPlanSelect,
  defaultPlan = "pro",
  defaultInterval = "monthly",
  className,
  containerClassName,
  buttonClassName,
  ...props
}: PricingTableProps) {
  const [isYearly, setIsYearly] = React.useState(defaultInterval === "yearly")
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

        <div className="mb-8 flex flex-col gap-4 sm:flex-row">
          {plans.map((plan) => {
            const isActive = selectedPlan === plan.level

            return (
              <button
                key={plan.name}
                type="button"
                onClick={() => handlePlanSelect(plan.level)}
                className="relative flex-1 rounded-xl border border-zinc-200 p-4 text-left dark:border-zinc-800"
              >
                {isActive ? (
                  <motion.span
                    layoutId="pricing-plan-select"
                    className="pointer-events-none absolute inset-0 rounded-xl ring-2 ring-blue-500 dark:ring-blue-400"
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
                      <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-600 dark:bg-blue-900 dark:text-blue-300">
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
                    <span className="text-sm font-normal text-zinc-500">
                      /{isYearly ? "year" : "month"}
                    </span>
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <div className="min-w-[640px] divide-y divide-zinc-200 dark:divide-zinc-800">
              <div className="flex items-center p-4 bg-zinc-50 dark:bg-zinc-900">
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
                    "bg-blue-50/50 dark:bg-blue-900/20",
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
                              className="text-blue-500"
                              active={plan.level === selectedPlan}
                              activationKey={selectedPlan}
                            />
                          ) : (
                            <CheckIcon
                              size={20}
                              className="text-blue-500"
                              active={plan.level === selectedPlan}
                              activationKey={selectedPlan}
                            />
                          )
                        ) : (
                          <span className="text-zinc-300 dark:text-zinc-700">
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
            className={cn(
              "group w-full sm:w-auto bg-blue-500 hover:bg-blue-600 px-8 py-2 rounded-xl",
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
