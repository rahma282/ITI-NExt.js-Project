export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-indigo-600 to-blue-600 dark:from-indigo-900 dark:to-blue-800 text-center text-sm text-white py-4 z-50 relative">
      <p>&copy; {new Date().getFullYear()} PostHub. All rights reserved.</p>
      <p className="text-xs mt-2">Made with ❤️ by Rahma</p>
    </footer>
  )
}
