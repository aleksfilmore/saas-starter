import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  return NextResponse.json({ message: 'Wall comments endpoint' })
}

export async function POST(request: NextRequest) {
  return NextResponse.json({ message: 'Create wall comment endpoint' })
}