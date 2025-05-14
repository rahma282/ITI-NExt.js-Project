import { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'
import prisma from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  const token = authHeader?.split(' ')[1]

  if (!token) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  }

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!)
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    })

    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 })
    }

    return new Response(JSON.stringify(user), { status: 200 })
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid token' }), { status: 401 })
  }
}
export async function PUT(req: Request) {
    const authHeader = req.headers.get('authorization')
    const token = authHeader?.split(' ')[1]
    if (!token) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  
    const { userId }: any = jwt.verify(token, process.env.JWT_SECRET!)
  
    const { name, email } = await req.json()
  
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { name, email },
    })
  
    return new Response(JSON.stringify(updatedUser), { status: 200 })
  }
  
