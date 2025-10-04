"use client"

import { useState, useEffect } from "react"
import {
  Star,
  MessageSquare,
  Filter,
  Search,
  ThumbsUp,
  ThumbsDown,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  Calendar,
  Loader2,
  Reply
} from "lucide-react"
import { useTranslation } from "react-i18next"
import { getFeedback, respondToFeedback, updateFeedbackStatus } from "@/lib/services/feedback"
import type { Feedback } from "@/lib/types/feedback"

function StarRating({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" | "lg" }) {
  const starSize = size === "sm" ? "h-4 w-4" : size === "md" ? "h-5 w-5" : "h-6 w-6"

  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${starSize} ${
            star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"
          }`}
        />
      ))}
    </div>
  )
}

export function FeedbackManagement() {
  const [feedback, setFeedback] = useState<Feedback[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRating, setFilterRating] = useState<number | 'all'>('all')
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'pending' | 'hidden'>('all')
  const [filterCategory, setFilterCategory] = useState<'all' | 'service' | 'product' | 'delivery' | 'other'>('all')
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null)
  const [responseText, setResponseText] = useState("")
  const [submittingResponse, setSubmittingResponse] = useState(false)

  useEffect(() => {
    loadFeedback()
  }, [filterRating, filterStatus, filterCategory])

  async function loadFeedback() {
    try {
      setLoading(true)
      const feedbackData = await getFeedback({
        rating: filterRating === 'all' ? undefined : filterRating,
        status: filterStatus === 'all' ? undefined : filterStatus,
        category: filterCategory === 'all' ? undefined : filterCategory
      })
      setFeedback(feedbackData)
    } catch (error) {
      console.error('Error loading feedback:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleRespond(feedbackId: string, response: string) {
    try {
      setSubmittingResponse(true)
      const success = await respondToFeedback(feedbackId, response, 'current_user')
      if (success) {
        setSelectedFeedback(null)
        setResponseText("")
        await loadFeedback() // Refresh the list
      }
    } catch (error) {
      console.error('Error responding to feedback:', error)
    } finally {
      setSubmittingResponse(false)
    }
  }

  async function handleStatusChange(feedbackId: string, newStatus: 'published' | 'hidden') {
    try {
      const success = await updateFeedbackStatus(feedbackId, newStatus)
      if (success) {
        await loadFeedback() // Refresh the list
      }
    } catch (error) {
      console.error('Error updating feedback status:', error)
    }
  }

  const filteredFeedback = feedback.filter(item => {
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      return (
        item.customerName.toLowerCase().includes(searchLower) ||
        item.comment.toLowerCase().includes(searchLower) ||
        (item.response && item.response.toLowerCase().includes(searchLower))
      )
    }
    return true
  })

  const averageRating = feedback.length > 0
    ? feedback.reduce((sum, item) => sum + item.rating, 0) / feedback.length
    : 0

  const ratingCounts = [5, 4, 3, 2, 1].map(rating =>
    feedback.filter(item => item.rating === rating).length
  )

  function getRatingColor(rating: number): string {
    if (rating >= 4) return 'text-green-600'
    if (rating >= 3) return 'text-yellow-600'
    return 'text-red-600'
  }

  function getCategoryColor(category: string): string {
    switch (category) {
      case 'service': return 'bg-blue-100 text-blue-800'
      case 'product': return 'bg-green-100 text-green-800'
      case 'delivery': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  function getStatusColor(status: string): string {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'hidden': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
        <span className="ml-2 text-gray-600">Loading feedback...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Reviews</p>
              <p className="text-2xl font-bold text-gray-900">{feedback.length}</p>
            </div>
            <MessageSquare className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Rating</p>
              <div className="flex items-center gap-2">
                <p className={`text-2xl font-bold ${getRatingColor(averageRating)}`}>
                  {averageRating.toFixed(1)}
                </p>
                <StarRating rating={Math.round(averageRating)} size="md" />
              </div>
            </div>
            <Star className="h-8 w-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Positive Reviews</p>
              <p className="text-2xl font-bold text-green-600">
                {feedback.filter(item => item.rating >= 4).length}
              </p>
            </div>
            <ThumbsUp className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Needs Response</p>
              <p className="text-2xl font-bold text-orange-600">
                {feedback.filter(item => !item.response).length}
              </p>
            </div>
            <Clock className="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Rating Distribution */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Rating Distribution</h3>
        <div className="space-y-3">
          {[5, 4, 3, 2, 1].map((rating, index) => (
            <div key={rating} className="flex items-center gap-3">
              <div className="flex items-center gap-1 w-16">
                <span className="text-sm text-gray-700">{rating}</span>
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
              </div>
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-400 h-2 rounded-full"
                  style={{
                    width: feedback.length > 0 ? `${(ratingCounts[index] / feedback.length) * 100}%` : '0%'
                  }}
                />
              </div>
              <span className="text-sm text-gray-600 w-12 text-right">
                {ratingCounts[index]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search feedback..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>

        <select
          value={filterRating}
          onChange={(e) => setFilterRating(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
        >
          <option value="all">All Ratings</option>
          <option value={5}>5 Stars</option>
          <option value={4}>4 Stars</option>
          <option value={3}>3 Stars</option>
          <option value={2}>2 Stars</option>
          <option value={1}>1 Star</option>
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as any)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
        >
          <option value="all">All Status</option>
          <option value="published">Published</option>
          <option value="pending">Pending</option>
          <option value="hidden">Hidden</option>
        </select>

        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value as any)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
        >
          <option value="all">All Categories</option>
          <option value="service">Service</option>
          <option value="product">Product</option>
          <option value="delivery">Delivery</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Feedback List */}
      <div className="space-y-4">
        {filteredFeedback.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <MessageSquare className="h-8 w-8 mx-auto mb-2 text-gray-300" />
            <p>No feedback found</p>
            {searchTerm && (
              <p className="text-sm">Try adjusting your search or filters</p>
            )}
          </div>
        ) : (
          filteredFeedback.map((item) => (
            <div key={item.id} className="bg-white rounded-lg border p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{item.customerName}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <StarRating rating={item.rating} />
                      <span className="text-sm text-gray-500">
                        <Calendar className="h-4 w-4 inline mr-1" />
                        {item.createdAt.toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(item.category)}`}>
                    {item.category}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                </div>
              </div>

              <p className="text-gray-700 mb-4">{item.comment}</p>

              {item.orderId && (
                <p className="text-sm text-gray-500 mb-4">
                  Order: {item.orderId}
                </p>
              )}

              {item.response ? (
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Reply className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-medium text-purple-600">Response</span>
                    {item.respondedAt && (
                      <span className="text-sm text-gray-500">
                        • {item.respondedAt.toLocaleDateString('vi-VN')}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-700">{item.response}</p>
                </div>
              ) : (
                <div className="flex items-center gap-2 mb-4">
                  <AlertCircle className="h-4 w-4 text-orange-500" />
                  <span className="text-sm text-orange-600">Awaiting response</span>
                </div>
              )}

              <div className="flex items-center gap-2">
                {!item.response && (
                  <button
                    onClick={() => setSelectedFeedback(item)}
                    className="flex items-center gap-1 px-3 py-1 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  >
                    <Reply className="h-4 w-4" />
                    Respond
                  </button>
                )}

                {item.status === 'pending' && (
                  <button
                    onClick={() => handleStatusChange(item.id, 'published')}
                    className="flex items-center gap-1 px-3 py-1 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Publish
                  </button>
                )}

                {item.status === 'published' && (
                  <button
                    onClick={() => handleStatusChange(item.id, 'hidden')}
                    className="flex items-center gap-1 px-3 py-1 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Hide
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Response Modal */}
      {selectedFeedback && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Respond to Feedback</h3>

            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-medium">{selectedFeedback.customerName}</span>
                <StarRating rating={selectedFeedback.rating} />
              </div>
              <p className="text-gray-700">{selectedFeedback.comment}</p>
            </div>

            <textarea
              value={responseText}
              onChange={(e) => setResponseText(e.target.value)}
              placeholder="Type your response..."
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => {
                  setSelectedFeedback(null)
                  setResponseText("")
                }}
                className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRespond(selectedFeedback.id, responseText)}
                disabled={!responseText.trim() || submittingResponse}
                className="px-4 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {submittingResponse && <Loader2 className="h-4 w-4 animate-spin" />}
                Send Response
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}