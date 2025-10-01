"use client"

import { useState } from "react"
import { Plus, Minus, Trash2, ShoppingCart, Phone, MapPin, CreditCard, User, Check, Edit } from "lucide-react"
import { OrderItem } from "@/app/pos/page"

interface POSOrderSummaryV3Props {
  items: OrderItem[]
  onUpdateQuantity: (id: string, quantity: number) => void
  onClearOrder: () => void
  onPlaceOrder: (orderDetails: any) => void
}

type OrderSource = "dine-in" | "takeaway" | "grab" | "shopee"

interface Customer {
  id?: string
  phone: string
  name?: string
  isNew: boolean
}

export function POSOrderSummaryV3({
  items,
  onUpdateQuantity,
  onClearOrder,
  onPlaceOrder
}: POSOrderSummaryV3Props) {
  const [itemsLocked, setItemsLocked] = useState(false)
  const [customerPhone, setCustomerPhone] = useState("")
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [customerLocked, setCustomerLocked] = useState(false)
  const [orderSource, setOrderSource] = useState<OrderSource | null>(null)
  const [sourceLocked, setSourceLocked] = useState(false)
  const [orderDetails, setOrderDetails] = useState({
    discount: "",
    paymentMethod: "cash",
    paymentStatus: "unpaid",
    tableNumber: "",
    amountAfterFee: "",
    note: ""
  })

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const discount = parseFloat(orderDetails.discount) || 0
  const total = subtotal - discount

  const handleContinueFromItems = () => {
    if (items.length > 0) {
      setItemsLocked(true)
    }
  }

  const handleEditItems = () => {
    setItemsLocked(false)
    setCustomer(null)
    setCustomerLocked(false)
    setOrderSource(null)
    setSourceLocked(false)
  }

  const handleCustomerLookup = () => {
    // Simulate customer lookup
    if (customerPhone === "0344270427") {
      setCustomer({
        id: "1",
        phone: customerPhone,
        name: "Nguyen Quang",
        isNew: false
      })
    } else if (customerPhone) {
      setCustomer({
        phone: customerPhone,
        isNew: true
      })
    }
  }

  const handleContinueFromCustomer = () => {
    if (customer) {
      setCustomerLocked(true)
    }
  }

  const handleEditCustomer = () => {
    setCustomerLocked(false)
    setOrderSource(null)
    setSourceLocked(false)
  }

  const handleSourceSelection = (source: OrderSource) => {
    setOrderSource(source)
    setSourceLocked(true)
  }

  const handleEditSource = () => {
    setSourceLocked(false)
  }

  const handleFinalizeOrder = () => {
    const fullOrderDetails = {
      items,
      customer,
      source: orderSource,
      ...orderDetails,
      subtotal,
      discount,
      total
    }
    onPlaceOrder(fullOrderDetails)
    // Reset all states
    setItemsLocked(false)
    setCustomerPhone("")
    setCustomer(null)
    setCustomerLocked(false)
    setOrderSource(null)
    setSourceLocked(false)
    setOrderDetails({
      discount: "",
      paymentMethod: "cash",
      paymentStatus: "unpaid",
      tableNumber: "",
      amountAfterFee: "",
      note: ""
    })
  }

  const renderItemsSection = () => (
    <div className={`border-b ${itemsLocked ? 'bg-gray-50' : ''}`}>
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-900">Order Items</h3>
          {itemsLocked && (
            <button
              onClick={handleEditItems}
              className="text-xs text-purple-600 hover:text-purple-700 flex items-center gap-1"
            >
              <Edit className="h-3 w-3" />
              Edit
            </button>
          )}
        </div>

        {itemsLocked ? (
          // Compact view when locked
          <div className="space-y-2">
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between text-sm">
                <span className="text-gray-700">{item.quantity}x {item.name}</span>
                <span className="font-medium">{(item.price * item.quantity).toLocaleString()}₫</span>
              </div>
            ))}
            <div className="pt-2 border-t flex justify-between items-center">
              <span className="text-sm font-semibold">Subtotal</span>
              <span className="text-sm font-semibold">{subtotal.toLocaleString()}₫</span>
            </div>
          </div>
        ) : (
          // Editable view
          <div className="space-y-3">
            {items.length === 0 ? (
              <div className="text-center py-4 text-gray-400">
                <ShoppingCart className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm">No items in cart</p>
              </div>
            ) : (
              <>
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-2">
                    <button
                      onClick={() => onUpdateQuantity(item.id, 0)}
                      className="p-1.5 bg-gray-100 rounded hover:bg-red-100"
                    >
                      <Trash2 className="h-3 w-3 text-red-500" />
                    </button>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-gray-900 line-clamp-1">{item.name}</p>
                      <p className="text-xs text-gray-600">{item.price.toLocaleString()}₫</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        className="p-1 rounded hover:bg-gray-200"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="text-sm w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="p-1 rounded hover:bg-gray-200"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <span className="text-xs font-medium w-16 text-right">
                      {(item.price * item.quantity).toLocaleString()}₫
                    </span>
                  </div>
                ))}
                <div className="pt-2 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Subtotal</span>
                    <span className="text-sm font-medium">{subtotal.toLocaleString()}₫</span>
                  </div>
                </div>
                <button
                  onClick={handleContinueFromItems}
                  className="w-full px-3 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg text-sm font-medium hover:from-indigo-600 hover:to-purple-700"
                >
                  Continue to Customer
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )

  const renderCustomerSection = () => {
    if (!itemsLocked) return null

    return (
      <div className={`border-b ${customerLocked ? 'bg-gray-50' : ''}`}>
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-900">Customer Information</h3>
            {customerLocked && (
              <button
                onClick={handleEditCustomer}
                className="text-xs text-purple-600 hover:text-purple-700 flex items-center gap-1"
              >
                <Edit className="h-3 w-3" />
                Edit
              </button>
            )}
          </div>

          {customerLocked && customer ? (
            // Compact view when locked
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                {customer.isNew ? (
                  <p className="text-sm text-green-600">New Customer</p>
                ) : (
                  <p className="text-sm font-medium text-gray-900">{customer.name}</p>
                )}
                <p className="text-xs text-gray-600">{customer.phone}</p>
              </div>
            </div>
          ) : (
            // Editable view
            <div className="space-y-3">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Phone className="absolute left-3 top-1/2 h-3 w-3 -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="Phone number"
                    className="w-full pl-8 pr-2 py-2 border rounded-lg text-sm focus:border-purple-500 focus:outline-none"
                  />
                </div>
                <button
                  onClick={handleCustomerLookup}
                  disabled={!customerPhone}
                  className="px-3 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 disabled:opacity-50"
                >
                  Lookup
                </button>
              </div>

              {customer && (
                <>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-purple-600" />
                      {customer.isNew ? (
                        <div>
                          <p className="text-sm font-medium text-green-600">New Customer</p>
                          <p className="text-xs text-gray-600">Will be created automatically</p>
                        </div>
                      ) : (
                        <div>
                          <p className="text-sm font-medium text-gray-900">{customer.name}</p>
                          <p className="text-xs text-gray-600">Existing customer</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={handleContinueFromCustomer}
                    className="w-full px-3 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg text-sm font-medium hover:from-indigo-600 hover:to-purple-700"
                  >
                    Continue to Source
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    )
  }

  const renderSourceSection = () => {
    if (!customerLocked) return null

    return (
      <div className={`border-b ${sourceLocked ? 'bg-gray-50' : ''}`}>
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-900">Order Source</h3>
            {sourceLocked && (
              <button
                onClick={handleEditSource}
                className="text-xs text-purple-600 hover:text-purple-700 flex items-center gap-1"
              >
                <Edit className="h-3 w-3" />
                Edit
              </button>
            )}
          </div>

          {sourceLocked && orderSource ? (
            // Compact view when locked
            <div className="flex items-center gap-2">
              <div className="px-3 py-1 bg-purple-100 rounded-full">
                <span className="text-sm font-medium text-purple-700 capitalize">
                  {orderSource === "dine-in" ? "Dine In" :
                   orderSource === "takeaway" ? "Takeaway" :
                   orderSource === "grab" ? "OishiDelivery" : "ShopeeFood"}
                </span>
              </div>
            </div>
          ) : (
            // Source selection
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleSourceSelection("dine-in")}
                className="p-3 border-2 rounded-lg hover:border-purple-600 hover:bg-purple-50 transition-colors"
              >
                <MapPin className="h-5 w-5 mx-auto mb-1 text-purple-600" />
                <p className="text-xs font-medium">Dine In</p>
              </button>

              <button
                onClick={() => handleSourceSelection("takeaway")}
                className="p-3 border-2 rounded-lg hover:border-purple-600 hover:bg-purple-50 transition-colors"
              >
                <ShoppingCart className="h-5 w-5 mx-auto mb-1 text-purple-600" />
                <p className="text-xs font-medium">Takeaway</p>
              </button>

              <button
                onClick={() => handleSourceSelection("grab")}
                className="p-3 border-2 rounded-lg hover:border-purple-600 hover:bg-purple-50 transition-colors"
              >
                <div className="h-5 w-12 mx-auto mb-1 bg-green-500 rounded flex items-center justify-center">
                  <span className="text-xs font-bold text-white">OISHI</span>
                </div>
                <p className="text-xs font-medium">OishiDelivery</p>
              </button>

              <button
                onClick={() => handleSourceSelection("shopee")}
                className="p-3 border-2 rounded-lg hover:border-purple-600 hover:bg-purple-50 transition-colors"
              >
                <div className="h-5 w-12 mx-auto mb-1 bg-orange-500 rounded flex items-center justify-center">
                  <span className="text-xs font-bold text-white">Shopee</span>
                </div>
                <p className="text-xs font-medium">ShopeeFood</p>
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  const renderDetailsSection = () => {
    if (!sourceLocked || !orderSource) return null

    return (
      <div className="flex-1 overflow-auto">
        <div className="p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Order Details</h3>

          <div className="space-y-3">
            {(orderSource === "dine-in" || orderSource === "takeaway") ? (
              <>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Discount (₫)
                  </label>
                  <input
                    type="number"
                    value={orderDetails.discount}
                    onChange={(e) => setOrderDetails({...orderDetails, discount: e.target.value})}
                    placeholder="0"
                    className="w-full px-2 py-1.5 border rounded text-sm focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Payment Method
                  </label>
                  <select
                    value={orderDetails.paymentMethod}
                    onChange={(e) => setOrderDetails({...orderDetails, paymentMethod: e.target.value})}
                    className="w-full px-2 py-1.5 border rounded text-sm focus:border-purple-500 focus:outline-none"
                  >
                    <option value="cash">Cash</option>
                    <option value="card">Card</option>
                    <option value="transfer">Bank Transfer</option>
                    <option value="momo">MoMo</option>
                    <option value="zalopay">ZaloPay</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Payment Status
                  </label>
                  <select
                    value={orderDetails.paymentStatus}
                    onChange={(e) => setOrderDetails({...orderDetails, paymentStatus: e.target.value})}
                    className="w-full px-2 py-1.5 border rounded text-sm focus:border-purple-500 focus:outline-none"
                  >
                    <option value="unpaid">Unpaid</option>
                    <option value="paid">Paid</option>
                    <option value="partial">Partial</option>
                  </select>
                </div>

                {orderSource === "dine-in" && (
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Table Number
                    </label>
                    <input
                      type="text"
                      value={orderDetails.tableNumber}
                      onChange={(e) => setOrderDetails({...orderDetails, tableNumber: e.target.value})}
                      placeholder="Enter table number"
                      className="w-full px-2 py-1.5 border rounded text-sm focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                )}
              </>
            ) : (
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Amount After Fee (₫)
                </label>
                <input
                  type="number"
                  value={orderDetails.amountAfterFee}
                  onChange={(e) => setOrderDetails({...orderDetails, amountAfterFee: e.target.value})}
                  placeholder="Enter amount"
                  className="w-full px-2 py-1.5 border rounded text-sm focus:border-purple-500 focus:outline-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Original: {total.toLocaleString()}₫
                </p>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Order Notes
              </label>
              <textarea
                value={orderDetails.note}
                onChange={(e) => setOrderDetails({...orderDetails, note: e.target.value})}
                placeholder="Special instructions..."
                className="w-full px-2 py-1.5 border rounded text-sm focus:border-purple-500 focus:outline-none resize-none"
                rows={2}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderFinalSection = () => {
    if (!sourceLocked || !orderSource) return null

    return (
      <div className="border-t p-4 bg-white">
        <div className="space-y-2 mb-3">
          <div className="flex justify-between items-center">
            <span className="text-sm">Subtotal</span>
            <span className="text-sm font-medium">{subtotal.toLocaleString()}₫</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-sm">Discount</span>
              <span className="text-sm text-red-600">-{discount.toLocaleString()}₫</span>
            </div>
          )}
          <div className="flex justify-between items-center pt-2 border-t">
            <span className="font-semibold">Total</span>
            <span className="font-semibold text-lg">{total.toLocaleString()}₫</span>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onClearOrder}
            className="flex-1 px-3 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600"
          >
            Cancel
          </button>
          <button
            onClick={handleFinalizeOrder}
            className="flex-1 px-3 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg text-sm font-medium hover:from-indigo-600 hover:to-purple-700"
          >
            Place Order
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="flex-1 overflow-auto">
        {renderItemsSection()}
        {renderCustomerSection()}
        {renderSourceSection()}
        {renderDetailsSection()}
      </div>
      {renderFinalSection()}
    </div>
  )
}