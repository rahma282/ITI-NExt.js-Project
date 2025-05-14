'use client'

import { useEffect, useState } from 'react'

export default function Home() {
  const [posts, setPosts] = useState([])

  const fetchPosts = async () => {
    const res = await fetch('/api/posts')
    const data = await res.json()
    setPosts(data)
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  const handleDelete = async (id: number) => {
    await fetch(`/api/posts/${id}`, { method: 'DELETE' })
    fetchPosts()
  }

  return (
    <main className="min-h-screen bg-gray-100 dark:bg-gray-900 py-10 px-6 flex flex-col items-center">
      <div className="w-full max-w-4xl">
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white">All Posts</h1>
          <a
            href="/posts/new"
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium shadow-md transition"
          >
            + New Post
          </a>
        </div>

        {posts.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400 text-center">
            No posts found. Be the first to add one!
          </p>
        ) : (
          <ul className="space-y-6">
            {posts.map((post: any) => (
              <li
                key={post.id}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm hover:shadow-lg transition"
              >
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">
                  {post.title}
                </h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">{post.content}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 italic mb-4">
                  By {post.author?.name ?? 'Unknown'}
                </p>
                <div className="flex gap-4">
                  <a
                    href={`/posts/${post.id}`}
                    className="text-green-600 hover:underline font-medium"
                  >
                    Edit
                  </a>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="text-red-600 hover:underline font-medium"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  )
}
