export interface Feedback {
  id: string
  customerId?: string
  customerName: string
  orderId?: string
  rating: number
  comment: string
  category: 'service' | 'product' | 'delivery' | 'other'
  status: 'pending' | 'published' | 'hidden'
  response?: string
  respondedBy?: string
  respondedAt?: Date
  createdAt: Date
}

export interface FeedbackFilter {
  rating?: number
  status?: 'pending' | 'published' | 'hidden'
  category?: 'service' | 'product' | 'delivery' | 'other'
  customerId?: string
  orderId?: string
  limit?: number
  dateFrom?: Date
  dateTo?: Date
}