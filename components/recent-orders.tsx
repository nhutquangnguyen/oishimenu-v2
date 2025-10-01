"use client"

export function RecentOrders() {
  const recentOrders = [
    {
      id: "#12345",
      customer: "Nguyễn Văn A",
      items: "Phở Bò, Cà Phê",
      total: "₫125,000",
      status: "completed"
    },
    {
      id: "#12344",
      customer: "Trần Thị B",
      items: "Bún Chả, Chả Cá",
      total: "₫180,000",
      status: "preparing"
    },
    {
      id: "#12343",
      customer: "Lê Văn C",
      items: "Bánh Mì, Trà Đá",
      total: "₫65,000",
      status: "pending"
    }
  ]

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h3>
      <div className="space-y-4">
        {recentOrders.map((order, index) => (
          <div key={index} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
            <div>
              <p className="font-medium text-gray-900">{order.id}</p>
              <p className="text-sm text-gray-600">{order.customer}</p>
              <p className="text-sm text-gray-500">{order.items}</p>
            </div>
            <div className="text-right">
              <p className="font-medium text-gray-900">{order.total}</p>
              <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                order.status === 'completed' ? 'bg-green-100 text-green-700' :
                order.status === 'preparing' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                {order.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}