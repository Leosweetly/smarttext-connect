import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-center text-center">
        <h1 className="text-4xl sm:text-6xl font-bold mb-4">
          SmartText Connect
        </h1>
        <p className="text-xl sm:text-2xl mb-8 text-gray-600">
          Manage your business with our secure dashboard
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Link
            href="/login"
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Log In
          </Link>
          <Link
            href="/signup"
            className="px-6 py-3 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors"
          >
            Sign Up
          </Link>
        </div>
        
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-3">Secure Authentication</h2>
            <p className="text-gray-600">
              Passwordless login with magic links for enhanced security
            </p>
          </div>
          
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-3">Business Dashboard</h2>
            <p className="text-gray-600">
              Manage your business information and settings in one place
            </p>
          </div>
          
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-3">Data Protection</h2>
            <p className="text-gray-600">
              Row Level Security ensures your data is always protected
            </p>
          </div>
        </div>
        
        <footer className="mt-16 text-center text-gray-500 text-sm">
          <p>
            &copy; {new Date().getFullYear()} SmartText Connect. All rights reserved.
          </p>
          <div className="mt-2">
            <Link href="/terms" className="hover:text-gray-700 mr-4">
              Terms of Service
            </Link>
            <Link href="/privacy" className="hover:text-gray-700">
              Privacy Policy
            </Link>
          </div>
        </footer>
      </div>
    </main>
  )
}
