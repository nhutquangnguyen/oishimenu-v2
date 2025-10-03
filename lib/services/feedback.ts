import {
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit as firestoreLimit
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { Feedback, FeedbackFilter } from '@/lib/types/feedback'

/**
 * Fetch feedback with optional filtering
 */
export async function getFeedback(filter?: FeedbackFilter): Promise<Feedback[]> {
  try {
    if (!db) {
      console.warn('Firestore not available, returning mock feedback')
      return getMockFeedback()
    }

    let feedbackQuery = collection(db, 'feedback')
    let queryConstraints: any[] = []

    // Apply filters
    if (filter?.rating) {
      queryConstraints.push(where('rating', '==', filter.rating))
    }

    if (filter?.status) {
      queryConstraints.push(where('status', '==', filter.status))
    }

    if (filter?.category) {
      queryConstraints.push(where('category', '==', filter.category))
    }

    if (filter?.customerId) {
      queryConstraints.push(where('customerId', '==', filter.customerId))
    }

    if (filter?.orderId) {
      queryConstraints.push(where('orderId', '==', filter.orderId))
    }

    // Apply sorting
    queryConstraints.push(orderBy('createdAt', 'desc'))

    // Apply limit
    if (filter?.limit) {
      queryConstraints.push(firestoreLimit(filter.limit))
    }

    const finalQuery = queryConstraints.length > 0
      ? query(feedbackQuery, ...queryConstraints)
      : query(feedbackQuery, orderBy('createdAt', 'desc'))

    const snapshot = await getDocs(finalQuery)
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.() || new Date(),
      respondedAt: doc.data().respondedAt?.toDate?.() || undefined,
    } as Feedback))
  } catch (error) {
    console.error('Error fetching feedback:', error)
    return getMockFeedback()
  }
}

/**
 * Get a single feedback by ID
 */
export async function getFeedbackById(id: string): Promise<Feedback | null> {
  try {
    if (!db) {
      console.warn('Firestore not available')
      return null
    }

    const docRef = doc(db, 'feedback', id)
    const snapshot = await getDoc(docRef)

    if (snapshot.exists()) {
      return {
        id: snapshot.id,
        ...snapshot.data(),
        createdAt: snapshot.data().createdAt?.toDate?.() || new Date(),
        respondedAt: snapshot.data().respondedAt?.toDate?.() || undefined,
      } as Feedback
    }

    return null
  } catch (error) {
    console.error('Error fetching feedback:', error)
    return null
  }
}

/**
 * Add new feedback
 */
export async function addFeedback(feedback: Omit<Feedback, 'id' | 'createdAt'>): Promise<string | null> {
  try {
    if (!db) {
      throw new Error('Firestore not available')
    }

    const feedbackData = {
      ...feedback,
      createdAt: new Date(),
    }

    const docRef = await addDoc(collection(db, 'feedback'), feedbackData)
    return docRef.id
  } catch (error) {
    console.error('Error adding feedback:', error)
    return null
  }
}

/**
 * Update feedback status
 */
export async function updateFeedbackStatus(
  id: string,
  status: 'pending' | 'published' | 'hidden'
): Promise<boolean> {
  try {
    if (!db) {
      throw new Error('Firestore not available')
    }

    const docRef = doc(db, 'feedback', id)
    await updateDoc(docRef, {
      status,
      updatedAt: new Date(),
    })

    return true
  } catch (error) {
    console.error('Error updating feedback status:', error)
    return false
  }
}

/**
 * Respond to feedback
 */
export async function respondToFeedback(
  id: string,
  response: string,
  respondedBy: string
): Promise<boolean> {
  try {
    if (!db) {
      throw new Error('Firestore not available')
    }

    const docRef = doc(db, 'feedback', id)
    await updateDoc(docRef, {
      response,
      respondedBy,
      respondedAt: new Date(),
      status: 'published', // Auto-publish when responded
    })

    return true
  } catch (error) {
    console.error('Error responding to feedback:', error)
    return false
  }
}

/**
 * Delete feedback
 */
export async function deleteFeedback(id: string): Promise<boolean> {
  try {
    if (!db) {
      throw new Error('Firestore not available')
    }

    const docRef = doc(db, 'feedback', id)
    await deleteDoc(docRef)

    return true
  } catch (error) {
    console.error('Error deleting feedback:', error)
    return false
  }
}

/**
 * Get feedback statistics
 */
export async function getFeedbackStats(): Promise<{
  totalFeedback: number
  averageRating: number
  ratingDistribution: { [rating: number]: number }
  responseRate: number
  pendingCount: number
}> {
  try {
    const feedback = await getFeedback()

    const totalFeedback = feedback.length
    const averageRating = totalFeedback > 0
      ? feedback.reduce((sum, item) => sum + item.rating, 0) / totalFeedback
      : 0

    const ratingDistribution: { [rating: number]: number } = {}
    for (let i = 1; i <= 5; i++) {
      ratingDistribution[i] = feedback.filter(item => item.rating === i).length
    }

    const respondedCount = feedback.filter(item => item.response).length
    const responseRate = totalFeedback > 0 ? (respondedCount / totalFeedback) * 100 : 0

    const pendingCount = feedback.filter(item => item.status === 'pending').length

    return {
      totalFeedback,
      averageRating,
      ratingDistribution,
      responseRate,
      pendingCount
    }
  } catch (error) {
    console.error('Error calculating feedback stats:', error)
    return {
      totalFeedback: 0,
      averageRating: 0,
      ratingDistribution: {},
      responseRate: 0,
      pendingCount: 0
    }
  }
}

/**
 * Get recent feedback (last 7 days)
 */
export async function getRecentFeedback(): Promise<Feedback[]> {
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  try {
    if (!db) {
      return getMockFeedback()
    }

    const recentQuery = query(
      collection(db, 'feedback'),
      where('createdAt', '>=', sevenDaysAgo),
      orderBy('createdAt', 'desc')
    )

    const snapshot = await getDocs(recentQuery)
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.() || new Date(),
      respondedAt: doc.data().respondedAt?.toDate?.() || undefined,
    } as Feedback))
  } catch (error) {
    console.error('Error fetching recent feedback:', error)
    return []
  }
}

/**
 * Mock data for development
 */
function getMockFeedback(): Feedback[] {
  return [
    {
      id: 'feedback-1',
      customerId: 'customer-1',
      customerName: 'Nguyễn Văn Quang',
      orderId: 'order-1',
      rating: 5,
      comment: 'Matcha latte rất ngon, vị đậm đà và không quá ngọt. Nhân viên phục vụ nhiệt tình!',
      category: 'service',
      status: 'published',
      response: 'Cảm ơn anh Quang đã ủng hộ! Chúng tôi sẽ tiếp tục cải thiện chất lượng phục vụ.',
      respondedBy: 'employee-2',
      respondedAt: new Date('2024-10-01T10:00:00'),
      createdAt: new Date('2024-09-30T20:00:00'),
    },
    {
      id: 'feedback-2',
      customerId: 'customer-2',
      customerName: 'Trần Thị Mai',
      orderId: 'order-2',
      rating: 4,
      comment: 'Trà sữa ngon, giao hàng đúng giờ. Chỉ có điều muốn có thêm lựa chọn topping.',
      category: 'product',
      status: 'published',
      response: 'Cảm ơn chị Mai! Chúng tôi sẽ bổ sung thêm nhiều loại topping trong thời gian tới.',
      respondedBy: 'employee-2',
      respondedAt: new Date('2024-10-01T11:00:00'),
      createdAt: new Date('2024-09-30T21:30:00'),
    },
    {
      id: 'feedback-3',
      customerId: 'customer-3',
      customerName: 'Lê Minh Hoàng',
      rating: 3,
      comment: 'Americano ổn nhưng hơi nhạt. Không gian quán đẹp, phù hợp làm việc.',
      category: 'product',
      status: 'pending',
      createdAt: new Date('2024-10-01T12:00:00'),
    },
  ]
}