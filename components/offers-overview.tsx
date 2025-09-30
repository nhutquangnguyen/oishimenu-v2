"use client"

export function OffersOverview() {
  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Offers overview</h2>
        <p className="text-sm text-gray-600">
          Offers-attributed sales insights, excluding Grab-funded offers, ads, and campaign packages.
        </p>
      </div>

      <div className="grid grid-cols-4 gap-6">
        <div>
          <p className="text-sm text-gray-600">Spend</p>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl font-bold text-gray-900">₫2.685.400</span>
          </div>
        </div>

        <div>
          <p className="text-sm text-gray-600">Net sales</p>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl font-bold text-gray-900">₫10.900.600</span>
          </div>
        </div>

        <div>
          <p className="text-sm text-gray-600">Number of transactions</p>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl font-bold text-gray-900">130</span>
          </div>
        </div>

        <div>
          <p className="text-sm text-gray-600">Sales-to-spend rate</p>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl font-bold text-gray-900">4.06 x</span>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-lg bg-blue-50 p-4">
        <div className="flex items-start gap-2">
          <div>
            <p className="text-sm font-medium text-gray-900">Net sales</p>
            <p className="mt-1 text-sm text-gray-600">
              The total sales from transactions with 1 or more offers applied. This is after deducting merchant-funded discounts, delivery charges, and GrabPay refunds.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}