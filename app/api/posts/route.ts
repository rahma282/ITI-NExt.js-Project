import prisma from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    console.log("Fetching posts...");
    const posts = await prisma.post.findMany({
      include: { author: true },
    });
    console.log("Posts fetched successfully:", posts);
    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json({ error: "Error fetching posts" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const { title, content } = await req.json()

  const decoded = verifyToken(req)
  if (!decoded) return new Response("Unauthorized", { status: 401 })

  const authorId = decoded.userId

  try {
    const newPost = await prisma.post.create({
      data: { title, content, authorId },
    })
    return new Response(JSON.stringify(newPost), { status: 201 })
  } catch (error) {
    console.error(error)
    return new Response("Server error", { status: 500 })
  }
}
