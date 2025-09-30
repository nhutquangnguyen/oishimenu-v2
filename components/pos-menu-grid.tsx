"use client"

import { useState } from "react"
import { Search, Plus } from "lucide-react"
import Image from "next/image"

interface MenuItem {
  id: string
  name: string
  price: number
  category: string
  image?: string
}

interface POSMenuGridProps {
  onAddItem: (item: MenuItem) => void
}

const categories = [
  { id: "all", name: "All Items", icon: "🍽️" },
  { id: "iced-drinks", name: "ẤM THỨC XỬ DỪA", icon: "🥥" },
  { id: "hot-drinks", name: "NƯỚC NGỌT", icon: "🥤" },
  { id: "coffee", name: "COFFEE & COCOCA", icon: "☕" },
  { id: "matcha", name: "MATCHA", icon: "🍵" },
  { id: "iced-blend", name: "ICED BLEND", icon: "🧊" },
  { id: "tea", name: "TEA", icon: "🫖" },
  { id: "milk-tea", name: "TRÀ SỮA - MILK TEA", icon: "🧋" },
  { id: "fresh-fruit", name: "NGUYÊN VẬT LIỆU", icon: "🍓" },
  { id: "topping", name: "TOPPING", icon: "🍮" },
  { id: "fast-food", name: "FAST FOOD", icon: "🍔" }
]

const menuItems: MenuItem[] = [
  { id: "1", name: "Matcha Latte", price: 29000, category: "matcha", image: "/matcha-latte.jpg" },
  { id: "2", name: "Matcha Đá Xay - Matcha Blended", price: 32000, category: "matcha", image: "/matcha-blended.jpg" },
  { id: "3", name: "Cà Phê Caramel Kem Muối", price: 35000, category: "coffee", image: "/coffee-caramel.jpg" },
  { id: "4", name: "Dừa Tươi - Coconut Water", price: 29000, category: "iced-drinks", image: "/coconut-water.jpg" },
  { id: "5", name: "Bạc Xỉu - Vietnamese Iced Coffee", price: 22000, category: "coffee", image: "/bac-xiu.jpg" },
  { id: "6", name: "Cà Phê Đá Xay - Frappuccino", price: 29000, category: "iced-blend", image: "/frappuccino.jpg" },
  { id: "7", name: "Cà Phê Caramel Đá Xay", price: 39000, category: "iced-blend", image: "/caramel-frapp.jpg" },
  { id: "8", name: "Cà Phê Đá Xay Giòn Rum", price: 29000, category: "iced-blend", image: "/rum-coffee.jpg" },
  { id: "9", name: "Bánh Cookie Đá Xay", price: 39000, category: "iced-blend", image: "/cookie-frapp.jpg" },
  { id: "10", name: "Chanh Đá Xay - Blended Lemon", price: 29000, category: "iced-blend", image: "/lemon-blend.jpg" },
  { id: "11", name: "Đào Đá Xay - Blended Peach", price: 39000, category: "iced-blend", image: "/peach-blend.jpg" },
  { id: "12", name: "Trà Đào - Peach Tea", price: 29000, category: "tea", image: "/peach-tea.jpg" },
  { id: "13", name: "Trà Lài Vải - Jasmine Lychee", price: 30000, category: "tea", image: "/jasmine-lychee.jpg" },
  { id: "14", name: "Trà Chanh Mật Ong - Honey Lemon Tea", price: 19000, category: "tea", image: "/honey-lemon.jpg" },
  { id: "15", name: "Matcha Latte Kem Muối", price: 32000, category: "matcha", image: "/matcha-salt.jpg" },
  { id: "16", name: "Matcha Dừa Tươi", price: 35000, category: "matcha", image: "/matcha-coconut.jpg" },
  { id: "17", name: "Matcha Latte Sữa Hạt", price: 29000, category: "matcha", image: "/matcha-nut.jpg" },
  { id: "18", name: "Trà Ổi Hồng", price: 29000, category: "tea", image: "/guava-tea.jpg" },
  { id: "19", name: "Trà Dâu", price: 29000, category: "tea", image: "/strawberry-tea.jpg" },
  { id: "20", name: "CAFE DINH BARISTA RESERVE", price: 320000, category: "coffee", image: "/reserve-coffee.jpg" },
  { id: "21", name: "Trà Thanh Yên", price: 29000, category: "tea", image: "/yen-tea.jpg" },
  { id: "22", name: "TRÀ DỨA LƯỚI", price: 29000, category: "tea", image: "/pineapple-tea.jpg" },
  { id: "23", name: "TRÀ PHÚC BỒN TỬ", price: 29000, category: "tea", image: "/raspberry-tea.jpg" },
  { id: "24", name: "PHÚC BỒN TỬ ĐÁ XAY", price: 39000, category: "iced-blend", image: "/raspberry-blend.jpg" },
  { id: "25", name: "Trà Sữa DINH", price: 29000, category: "milk-tea", image: "/milk-tea.jpg" },
  { id: "26", name: "Trà Sữa Matcha", price: 32000, category: "milk-tea", image: "/matcha-milk-tea.jpg" },
  { id: "27", name: "Kem Matcha", price: 25000, category: "matcha", image: "/matcha-ice-cream.jpg" },
  { id: "28", name: "AMERICANO", price: 22000, category: "coffee", image: "/americano.jpg" }
]

export function POSMenuGrid({ onAddItem }: POSMenuGridProps) {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by Menu Item"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
              selectedCategory === category.id
                ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md"
                : "bg-gray-100 hover:bg-purple-50 text-gray-700"
            }`}
          >
            <span className="text-xl">{category.icon}</span>
            <span className="text-xs font-medium">{category.name}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-3">
        {filteredItems.map(item => (
          <div
            key={item.id}
            className="relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => onAddItem(item)}
          >
            <div className="aspect-square relative bg-gradient-to-br from-teal-700 to-teal-900">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 bg-gray-200 rounded-lg" />
              </div>
            </div>
            <div className="p-3">
              <h3 className="text-xs font-medium text-gray-900 line-clamp-2 mb-2 min-h-[2rem]">
                {item.name}
              </h3>
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-gray-900">
                  {item.price.toLocaleString()}₫
                </p>
                <button className="p-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700">
                  <span className="text-xs px-1">Add</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}