"use client"

import { useState } from "react"
import { Plus, Minus, Trash2, ShoppingCart, Phone, MapPin, CreditCard, User, ChevronRight, ArrowLeft } from "lucide-react"
import { OrderItem } from "@/app/pos/page"
import Image from "next/image"

interface POSOrderSummaryV2Props {
  items: OrderItem[]
  onUpdateQuantity: (id: string, quantity: number) => void
  onClearOrder: () => void
  onPlaceOrder: (orderDetails: any) => void
}

type OrderStep = "items" | "customer" | "source" | "details"
type OrderSource = "dine-in" | "takeaway" | "grab" | "shopee"

interface Customer {
  id?: string
  phone: string
  name?: string
  isNew: boolean
}

export function POSOrderSummaryV2({
  items,
  onUpdateQuantity,
  onClearOrder,
  onPlaceOrder
}: POSOrderSummaryV2Props) {
  const [currentStep, setCurrentStep] = useState<OrderStep>("items")
  const [customerPhone, setCustomerPhone] = useState("")
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [orderSource, setOrderSource] = useState<OrderSource | null>(null)
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
      setCurrentStep("customer")
    }
  }

  const handleCustomerLookup = () => {
    // Simulate customer lookup - in real app this would be an API call
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
    setCurrentStep("source")
  }

  const handleSourceSelection = (source: OrderSource) => {
    setOrderSource(source)
    setCurrentStep("details")
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
    setCurrentStep("items")
    setCustomerPhone("")
    setCustomer(null)
    setOrderSource(null)
    setOrderDetails({
      discount: "",
      paymentMethod: "cash",
      paymentStatus: "unpaid",
      tableNumber: "",
      amountAfterFee: "",
      note: ""
    })
  }

  const handleBack = () => {
    if (currentStep === "customer") setCurrentStep("items")
    else if (currentStep === "source") setCurrentStep("customer")
    else if (currentStep === "details") setCurrentStep("source")
  }

  const renderStepIndicator = () => (
    <div className="p-4 border-b">
      <div className="flex items-center justify-between">
        {currentStep !== "items" && (
          <button
            onClick={handleBack}
            className="p-1 rounded hover:bg-gray-100"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
        )}
        <div className="flex-1 flex items-center justify-center gap-2">
          <div className={`flex items-center gap-1 ${currentStep === "items" ? "text-purple-600" : "text-gray-400"}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              currentStep === "items" ? "bg-purple-600 text-white" : "bg-gray-200"
            }`}>
              1
            </div>
            <span className="text-xs">Items</span>
          </div>
          <ChevronRight className="h-4 w-4 text-gray-400" />
          <div className={`flex items-center gap-1 ${currentStep === "customer" ? "text-purple-600" : "text-gray-400"}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              currentStep === "customer" ? "bg-purple-600 text-white" : "bg-gray-200"
            }`}>
              2
            </div>
            <span className="text-xs">Customer</span>
          </div>
          <ChevronRight className="h-4 w-4 text-gray-400" />
          <div className={`flex items-center gap-1 ${currentStep === "source" ? "text-purple-600" : "text-gray-400"}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              currentStep === "source" ? "bg-purple-600 text-white" : "bg-gray-200"
            }`}>
              3
            </div>
            <span className="text-xs">Source</span>
          </div>
          <ChevronRight className="h-4 w-4 text-gray-400" />
          <div className={`flex items-center gap-1 ${currentStep === "details" ? "text-purple-600" : "text-gray-400"}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              currentStep === "details" ? "bg-purple-600 text-white" : "bg-gray-200"
            }`}>
              4
            </div>
            <span className="text-xs">Details</span>
          </div>
        </div>
        <div className="w-8" /> {/* Spacer for balance */}
      </div>
    </div>
  )

  const renderItemsStep = () => (
    <>
      <div className="flex-1 overflow-auto p-4">
        <div className="space-y-3">
          {items.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <ShoppingCart className="h-12 w-12 mx-auto mb-3" />
              <p>No items in cart</p>
              <p className="text-sm mt-1">Add items to continue</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <button
                  onClick={() => onUpdateQuantity(item.id, 0)}
                  className="p-2 bg-white rounded hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </button>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{item.name}</p>
                  <p className="text-xs text-gray-600">{item.price.toLocaleString()}₫</p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                    className="p-1 rounded hover:bg-gray-200"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <input
                    type="text"
                    value={item.quantity}
                    className="w-8 text-center border rounded px-1 py-1 text-sm"
                    readOnly
                  />
                  <button
                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    className="p-1 rounded hover:bg-gray-200"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
                <span className="text-sm font-medium w-20 text-right">
                  {(item.price * item.quantity).toLocaleString()}₫
                </span>
              </div>
            ))
          )}
        </div>
      </div>
      <div className="border-t p-4">
        <div className="space-y-2 mb-4">
          <div className="flex justify-between items-center">
            <span className="text-sm">Subtotal</span>
            <span className="text-sm font-medium">{subtotal.toLocaleString()}₫</span>
          </div>
        </div>
        <button
          onClick={handleContinueFromItems}
          disabled={items.length === 0}
          className="w-full px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-600 hover:to-purple-700 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue to Customer
        </button>
      </div>
    </>
  )

  const renderCustomerStep = () => (
    <>
      <div className="flex-1 p-4">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Customer Phone Number
            </label>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="Enter phone number"
                  className="w-full pl-10 pr-3 py-2 border rounded-lg text-sm focus:border-purple-500 focus:outline-none"
                />
              </div>
              <button
                onClick={handleCustomerLookup}
                disabled={!customerPhone}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 disabled:opacity-50"
              >
                Lookup
              </button>
            </div>
          </div>

          {customer && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  {customer.isNew ? (
                    <>
                      <p className="text-sm font-medium text-green-600">New Customer</p>
                      <p className="text-xs text-gray-600">Account will be created automatically</p>
                    </>
                  ) : (
                    <>
                      <p className="text-sm font-medium text-gray-900">{customer.name}</p>
                      <p className="text-xs text-gray-600">Existing customer</p>
                    </>
                  )}
                  <p className="text-xs text-gray-600">{customer.phone}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="border-t p-4">
        <button
          onClick={() => setCurrentStep("source")}
          disabled={!customer}
          className="w-full px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-600 hover:to-purple-700 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue to Source
        </button>
      </div>
    </>
  )

  const renderSourceStep = () => (
    <>
      <div className="flex-1 p-4">
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-700">Select Order Source</h3>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleSourceSelection("dine-in")}
              className="p-4 border-2 rounded-lg hover:border-purple-600 hover:bg-purple-50 transition-colors"
            >
              <MapPin className="h-6 w-6 mx-auto mb-2 text-purple-600" />
              <p className="text-sm font-medium">Dine In</p>
            </button>

            <button
              onClick={() => handleSourceSelection("takeaway")}
              className="p-4 border-2 rounded-lg hover:border-purple-600 hover:bg-purple-50 transition-colors"
            >
              <ShoppingCart className="h-6 w-6 mx-auto mb-2 text-purple-600" />
              <p className="text-sm font-medium">Takeaway</p>
            </button>

            <button
              onClick={() => handleSourceSelection("grab")}
              className="p-4 border-2 rounded-lg hover:border-purple-600 hover:bg-purple-50 transition-colors"
            >
              <div className="h-6 w-16 mx-auto mb-2 bg-green-500 rounded flex items-center justify-center">
                <span className="text-xs font-bold text-white">OISHI</span>
              </div>
              <p className="text-sm font-medium">OishiDelivery</p>
            </button>

            <button
              onClick={() => handleSourceSelection("shopee")}
              className="p-4 border-2 rounded-lg hover:border-purple-600 hover:bg-purple-50 transition-colors"
            >
              <div className="h-6 w-16 mx-auto mb-2 bg-orange-500 rounded flex items-center justify-center">
                <span className="text-xs font-bold text-white">Shopee</span>
              </div>
              <p className="text-sm font-medium">ShopeeFood</p>
            </button>
          </div>
        </div>
      </div>
    </>
  )

  const renderDetailsStep = () => (
    <>
      <div className="flex-1 overflow-auto p-4">
        <div className="space-y-4">
          {(orderSource === "dine-in" || orderSource === "takeaway") ? (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Discount Amount (₫)
                </label>
                <input
                  type="number"
                  value={orderDetails.discount}
                  onChange={(e) => setOrderDetails({...orderDetails, discount: e.target.value})}
                  placeholder="0"
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method
                </label>
                <select
                  value={orderDetails.paymentMethod}
                  onChange={(e) => setOrderDetails({...orderDetails, paymentMethod: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:border-purple-500 focus:outline-none"
                >
                  <option value="cash">Cash</option>
                  <option value="card">Card</option>
                  <option value="transfer">Bank Transfer</option>
                  <option value="momo">MoMo</option>
                  <option value="zalopay">ZaloPay</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Status
                </label>
                <select
                  value={orderDetails.paymentStatus}
                  onChange={(e) => setOrderDetails({...orderDetails, paymentStatus: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:border-purple-500 focus:outline-none"
                >
                  <option value="unpaid">Unpaid</option>
                  <option value="paid">Paid</option>
                  <option value="partial">Partial</option>
                </select>
              </div>

              {orderSource === "dine-in" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Table Number
                  </label>
                  <input
                    type="text"
                    value={orderDetails.tableNumber}
                    onChange={(e) => setOrderDetails({...orderDetails, tableNumber: e.target.value})}
                    placeholder="Enter table number"
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:border-purple-500 focus:outline-none"
                  />
                </div>
              )}
            </>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount After Platform Fee (₫)
              </label>
              <input
                type="number"
                value={orderDetails.amountAfterFee}
                onChange={(e) => setOrderDetails({...orderDetails, amountAfterFee: e.target.value})}
                placeholder="Enter amount after fee"
                className="w-full px-3 py-2 border rounded-lg text-sm focus:border-purple-500 focus:outline-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                Original: {total.toLocaleString()}₫
              </p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Order Notes
            </label>
            <textarea
              value={orderDetails.note}
              onChange={(e) => setOrderDetails({...orderDetails, note: e.target.value})}
              placeholder="Add any special instructions..."
              className="w-full px-3 py-2 border rounded-lg text-sm focus:border-purple-500 focus:outline-none resize-none"
              rows={3}
            />
          </div>
        </div>
      </div>

      <div className="border-t p-4">
        <div className="space-y-2 mb-4">
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
            <span className="text-lg font-semibold">Total</span>
            <span className="text-lg font-semibold">{total.toLocaleString()}₫</span>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onClearOrder}
            className="flex-1 px-4 py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600"
          >
            Cancel
          </button>
          <button
            onClick={handleFinalizeOrder}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-600 hover:to-purple-700 shadow-md"
          >
            Place Order
          </button>
        </div>
      </div>
    </>
  )

  return (
    <div className="h-full flex flex-col">
      {renderStepIndicator()}

      {currentStep === "items" && renderItemsStep()}
      {currentStep === "customer" && renderCustomerStep()}
      {currentStep === "source" && renderSourceStep()}
      {currentStep === "details" && renderDetailsStep()}
    </div>
  )
}