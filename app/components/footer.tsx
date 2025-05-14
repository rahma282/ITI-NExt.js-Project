export default function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 shadow-[0_-4px_10px_rgba(0,0,0,0.15)] dark:shadow-[0_-4px_10px_rgba(255,255,255,0.05)] text-center text-sm text-gray-600 dark:text-gray-300 py-4 z-50 relative">
      <p>&copy; {new Date().getFullYear()} Nextjs. All rights reserved.</p>
    </footer>
  )
}
