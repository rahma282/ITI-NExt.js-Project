'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast, ToastContainer } from 'react-toastify'
import { jwtDecode } from 'jwt-decode'
import 'react-toastify/dist/ReactToastify.css'

type DecodedToken = {
  userId: number
  exp: number
}

export default function CreatePost() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [userId, setUserId] = useState<number | null>(null)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token)
        setUserId(decoded.userId)
      } catch (err) {
        console.error('Invalid token', err)
      }
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!userId) {
      toast.error('You must be logged in to create a post.', {
        position: "top-center",
      })
      return
    }

    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        body: JSON.stringify({
          title,
          content,
          authorId: userId,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (res.ok) {
        toast.success('Post created successfully!', {
          position: "top-center",
        })
        
        setTimeout(() => {
          router.push('/')
        }, 1000) 
      } else {
        throw new Error('Failed to create post.')
      }
    } catch {
      toast.error('An error occurred while creating the post. Please try again.', {
        position: "top-center",
      })
    }
  }

  return (
    <>
      <ToastContainer />
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl w-full space-y-6 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl">
          <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white">
            Create a New Post
          </h1>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Title
              </label>
              <input
                id="title"
                placeholder="Enter a title"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Content
              </label>
              <textarea
                id="content"
                placeholder="Write your content here..."
                value={content}
                onChange={e => setContent(e.target.value)}
                className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 h-32 resize-none shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300"
            >
              Create Post
            </button>
          </form>
        </div>
      </div>
    </>
  )
}
