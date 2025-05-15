import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  if (!id) return new Response("Invalid post ID", { status: 400 });

  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: { author: true },
    });

    if (!post) return new Response("Post not found", { status: 404 });

    return new Response(JSON.stringify(post), { status: 200 });
  } catch (error) {
    console.error("Error fetching post:", error);
    return new Response(JSON.stringify({ error: "Error fetching post" }), {
      status: 500,
    });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  const { title, content } = await req.json();

  const decoded = verifyToken(req);
  if (!decoded) return new Response("Unauthorized", { status: 401 });

  const post = await prisma.post.findUnique({ where: { id } });
  if (!post || post.authorId !== decoded.userId) {
    return new Response("Forbidden", { status: 403 });
  }

  const updated = await prisma.post.update({
    where: { id },
    data: { title, content },
  });

  return new Response(JSON.stringify(updated), { status: 200 });
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);

  const decoded = verifyToken(req);
  if (!decoded) return new Response("Unauthorized", { status: 401 });

  const post = await prisma.post.findUnique({ where: { id } });
  if (!post || post.authorId !== decoded.userId) {
    return new Response("Forbidden", { status: 403 });
  }

  const deleted = await prisma.post.delete({ where: { id } });
  return new Response(JSON.stringify(deleted), { status: 200 });
}
