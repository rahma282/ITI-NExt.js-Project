'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function EditPost() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isAuthor, setIsAuthor] = useState(false)
  const router = useRouter()
  const { id } = useParams()

  useEffect(() => {
    const fetchPost = async () => {
      const res = await fetch(`/api/posts/${id}`)
      const data = await res.json()

      if (data && data.authorId) {
        const token = localStorage.getItem('token')

        if (token) {
          const decoded: any = JSON.parse(atob(token.split('.')[1]))
          const userId = decoded.userId

          if (data.authorId === userId) {
            setIsAuthor(true)
          } else {
            setIsAuthor(false)
            toast.error('You are not authorized to edit this post.', {
              position: 'top-center',
            })
            setTimeout(() => {
              router.push('/')
            }, 1000)
          }
        }
      }

      setTitle(data.title)
      setContent(data.content)
    }

    if (id) fetchPost()
  }, [id, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isAuthor) {
      toast.error('You are not authorized to update this post.', {
        position: 'top-center',
      })
      return
    }

    const token = localStorage.getItem('token')
    const res = await fetch(`/api/posts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, 
      },
      body: JSON.stringify({ title, content }),
    })

    if (res.ok) {
      toast.success('Post updated successfully!', {
        position: 'top-center',
      })
      setTimeout(() => {
        router.push('/')
      }, 1000)
    } else {
      toast.error('Failed to update the post. Please try again later.', {
        position: 'top-center',
      })
    }
  }

  return (
    <>
      <ToastContainer />
      <div className="min-h-screen bg-gradient-to-r from-indigo-50 to-gray-100 dark:from-indigo-900 dark:to-gray-900 py-10 px-6 flex flex-col items-center">
        <div className="w-full max-w-lg space-y-8 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl">
          <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white">
            Edit Post
          </h1>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Title
              </label>
              <input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
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
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 h-32 resize-none shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-400 to-blue-600 text-white font-semibold py-2 px-4 rounded-lg transform hover:scale-105 transition duration-300"
              disabled={!isAuthor}
            >
              Update Post
            </button>
          </form>
        </div>
      </div>
    </>
  )
}
