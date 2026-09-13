"use client"

import Link from "next/link"
import { useState } from "react"

import {
  PricingTable,
} from "@/components/ui/pricing-table"
import { Button } from "@/components/ui/button"
import {
  promptMarketPricingFeatures,
  promptMarketTiersToPricingPlans,
} from "@/lib/kits/pricing-plans"

export function PricingTableDemo() {
  const [useFoundingPrice, setUseFoundingPrice] = useState(true)
  const plans = promptMarketTiersToPricingPlans(useFoundingPrice)

  return (
    <div className="space-y-8">
      <div className="flex justify-center px-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/40 p-1 text-sm">
          <button
            type="button"
            className={`rounded-full px-4 py-2 font-medium transition-colors ${
              useFoundingPrice
                ? "bg-background shadow-sm ring-1 ring-border/60"
                : "text-muted-foreground"
            }`}
            onClick={() => setUseFoundingPrice(true)}
          >
            Founding price
          </button>
          <button
            type="button"
            className={`rounded-full px-4 py-2 font-medium transition-colors ${
              !useFoundingPrice
                ? "bg-background shadow-sm ring-1 ring-border/60"
                : "text-muted-foreground"
            }`}
            onClick={() => setUseFoundingPrice(false)}
          >
            Standard
          </button>
        </div>
      </div>

      <PricingTable
        features={promptMarketPricingFeatures}
        plans={plans}
        defaultPlan="pro"
        billingDisplay="one-time"
        buttonClassName="bg-primary hover:bg-primary/90"
      />

      <p className="mx-auto max-w-xl px-4 text-center text-sm text-muted-foreground">
        Per-kit checkout is live for Starter (pick a kit on{" "}
        <Link href="/kits" className="text-brand underline-offset-4 hover:underline">
          /kits
        </Link>
        ). Pro and Studio bundle checkout rolls out next—use tier CTAs to get on
        the list or email support.
      </p>

      <div className="flex justify-center pb-12">
        <Button asChild variant="outline">
          <Link href="/kits">Compare launch kits</Link>
        </Button>
      </div>
    </div>
  )
}
