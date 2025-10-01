"use client"

export function TopMenuItems() {
  const topItems = [
    { name: "Phở Bò", orders: 156, revenue: "₫3,120,000" },
    { name: "Bún Chả", orders: 142, revenue: "₫2,840,000" },
    { name: "Bánh Mì", orders: 128, revenue: "₫1,920,000" },
    { name: "Cà Phê Sữa Đá", orders: 95, revenue: "₫950,000" }
  ]

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Menu Items</h3>
      <div className="space-y-4">
        {topItems.map((item, index) => (
          <div key={index} className="flex justify-between items-center py-2">
            <div>
              <p className="font-medium text-gray-900">{item.name}</p>
              <p className="text-sm text-gray-600">{item.orders} orders</p>
            </div>
            <div className="text-right">
              <p className="font-medium text-gray-900">{item.revenue}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}