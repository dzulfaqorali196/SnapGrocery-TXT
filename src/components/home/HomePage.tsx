import { Camera, Upload, ShoppingCart } from 'lucide-react';
import { useAuthContext } from '../auth/AuthProvider';
import { Link } from 'react-router-dom';

export function HomePage() {
  const { user } = useAuthContext();

  return (
    <div className="min-h-screen bg-gray-50">
      <main>
        {/* Hero Section */}
        <div className="relative">
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gray-100" />
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="relative shadow-xl sm:rounded-2xl sm:overflow-hidden">
              <div className="absolute inset-0">
                <img
                  className="h-full w-full object-cover"
                  src="https://images.unsplash.com/photo-1543168256-418811576931?ixlib=rb-4.0.3&auto=format&fit=crop&w=2830&q=80"
                  alt="Fresh groceries"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-purple-800 to-indigo-700 mix-blend-multiply" />
              </div>
              <div className="relative px-4 py-16 sm:px-6 sm:py-24 lg:py-32 lg:px-8">
                <h1 className="text-center text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                  <span className="block text-white">Smart Grocery Shopping</span>
                  <span className="block text-indigo-200">
                    Powered by AI
                  </span>
                </h1>
                <p className="mt-6 max-w-lg mx-auto text-center text-xl text-indigo-200 sm:max-w-3xl">
                  Snap a photo of your fridge and let our AI create your shopping list automatically.
                </p>
                <div className="mt-10 max-w-sm mx-auto sm:max-w-none sm:flex sm:justify-center">
                  {user ? (
                    <div className="space-y-4 sm:space-y-0 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5">
                      <Link
                        to="/capture"
                        className="flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-indigo-700 bg-white hover:bg-indigo-50 sm:px-8"
                      >
                        <Camera className="h-5 w-5 mr-2" />
                        Capture Now
                      </Link>
                      <Link
                        to="/upload"
                        className="flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-500 bg-opacity-60 hover:bg-opacity-70 sm:px-8"
                      >
                        <Upload className="h-5 w-5 mr-2" />
                        Upload Photo
                      </Link>
                    </div>
                  ) : (
                    <Link
                      to="/auth"
                      className="flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-indigo-700 bg-white hover:bg-indigo-50 sm:px-8"
                    >
                      Get Started
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Section */}
        <div className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:text-center">
              <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">
                How it works
              </h2>
              <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                Smart grocery shopping made simple
              </p>
            </div>

            <div className="mt-10">
              <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
                <div className="relative">
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                    <Camera className="h-6 w-6" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">
                    Snap a Photo
                  </p>
                  <p className="mt-2 ml-16 text-base text-gray-500">
                    Take a picture of your fridge or pantry
                  </p>
                </div>

                <div className="relative">
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                    <Upload className="h-6 w-6" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">
                    AI Analysis
                  </p>
                  <p className="mt-2 ml-16 text-base text-gray-500">
                    Our AI identifies items you need to restock
                  </p>
                </div>

                <div className="relative">
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                    <ShoppingCart className="h-6 w-6" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">
                    Get Your List
                  </p>
                  <p className="mt-2 ml-16 text-base text-gray-500">
                    Receive a smart shopping list based on your needs
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}