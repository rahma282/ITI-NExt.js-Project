'use client'

import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const fetchPosts = async () => {
    const res = await fetch("/api/posts");
    const data = await res.json();
    setPosts(data);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
    fetchPosts();
  }, []);

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must be logged in to delete posts.", {
        position: "top-center",
      });
      return;
    }

    const res = await fetch(`/api/posts/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      toast.success("Post deleted successfully!", {
        position: "top-center",
      });
      fetchPosts();
    } else {
      toast.error("Failed to delete post. You can delete only your own post.", {
        position: "top-center",
      });
    }
  };

  return (
    <>
      <ToastContainer />
      <main className="min-h-screen bg-gradient-to-r from-indigo-50 to-gray-100 dark:from-indigo-900 dark:to-gray-900 py-10 px-6 flex flex-col items-center">
        <div className="w-full max-w-4xl">
          {/* header section */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white tracking-tight">
              All Posts
            </h1>
            <a
              href="/posts/new"
              className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-5 py-2 rounded-lg font-medium shadow-md transform hover:scale-105 transition duration-300 ease-in-out"
            >
              + New Post
            </a>
          </div>

          {/* Posts Section */}
          {posts.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center text-lg">
              No posts found. Be the first to add one!
            </p>
          ) : (
            <ul className="space-y-6">
              {posts.map((post: any) => (
                <li
                  key={post.id}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-md transform hover:scale-105 hover:shadow-lg transition duration-300 ease-in-out"
                >
                  <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
                    {post.title}
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">{post.content}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 italic mb-4">
                    By {post.author?.name ?? "Unknown"}
                  </p>

                  <div className="flex gap-6">
                    {isLoggedIn ? (
                      <>
                        <a
                          href={`/posts/${post.id}`}
                          className="text-indigo-600 hover:text-indigo-700 font-medium transform hover:scale-105 transition duration-200 ease-in-out"
                        >
                          Edit
                        </a>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="text-red-600 hover:text-red-700 font-medium transform hover:scale-105 transition duration-200 ease-in-out"
                        >
                          Delete
                        </button>
                      </>
                    ) : (
                      <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                        Please log in to edit or delete posts.
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </>
  );
}
