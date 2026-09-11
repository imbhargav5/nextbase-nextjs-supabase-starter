import { PricingTableDemo } from "@/components/blocks/pricing-table-demo"

export default function PricingPage() {
  return (
    <div>
      <div className="border-b bg-muted/10 px-4 py-12 text-center sm:py-16">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Simple, transparent pricing
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          Choose the plan that fits your team. Switch between monthly and yearly
          billing anytime.
        </p>
      </div>
      <PricingTableDemo />
    </div>
  )
}
