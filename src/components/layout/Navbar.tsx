import { useAuthContext } from '../auth/AuthProvider';
import { Link } from 'react-router-dom';
import { LogOut, ShoppingCart, User, FileText } from 'lucide-react';
import { toast } from 'react-hot-toast';

export function Navbar() {
  const { user, signOut } = useAuthContext();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link
              to="/"
              className="flex items-center px-2 py-2 text-gray-700 hover:text-gray-900"
            >
              <ShoppingCart className="h-6 w-6 mr-2" />
              <span className="font-bold text-xl">SnapGrocery</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {user && (
              <Link
                to="/api-docs"
                className="flex items-center px-3 py-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100"
              >
                <FileText className="h-5 w-5 mr-1" />
                API Docs
              </Link>
            )}
            {user ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/profile"
                  className="flex items-center text-gray-700 hover:text-gray-900"
                >
                  <User className="h-5 w-5 mr-1" />
                  <span>{user.email}</span>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center px-3 py-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                >
                  <LogOut className="h-5 w-5 mr-1" />
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                className="flex items-center px-3 py-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100"
              >
                <User className="h-5 w-5 mr-1" />
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}