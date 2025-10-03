import { NextRequest, NextResponse } from 'next/server'
import { generateSampleOrdersForMonth } from '@/scripts/generate-sample-orders'

export async function POST() {
  try {
    console.log('Starting order generation via API...')

    await generateSampleOrdersForMonth()

    return NextResponse.json({
      success: true,
      message: 'Sample orders generated successfully'
    })
  } catch (error) {
    console.error('Error generating orders:', error)

    return NextResponse.json({
      success: false,
      message: 'Failed to generate orders',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Use POST method to generate sample orders',
    endpoint: '/api/generate-orders',
    method: 'POST'
  })
}