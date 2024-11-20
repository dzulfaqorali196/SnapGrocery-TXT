import { Code, Lock } from 'lucide-react';

export function ApiDocsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900">
            SnapGrocery API Documentation
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Complete API reference for SnapGrocery services
          </p>
        </div>

        <div className="mt-12 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg font-medium text-gray-900">Authentication</h2>
            <p className="mt-1 text-sm text-gray-500">
              All API endpoints require authentication using a Bearer token
            </p>
          </div>
          <div className="border-t border-gray-200">
            <dl>
              {endpoints.map((endpoint, index) => (
                <div
                  key={index}
                  className={`${
                    index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                  } px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6`}
                >
                  <dt className="text-sm font-medium text-gray-500">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          endpoint.method === 'POST'
                            ? 'bg-green-100 text-green-800'
                            : endpoint.method === 'GET'
                            ? 'bg-blue-100 text-blue-800'
                            : endpoint.method === 'PUT'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {endpoint.method}
                      </span>
                      <span>{endpoint.path}</span>
                    </div>
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <div>
                      <p className="mb-2">{endpoint.description}</p>
                      {endpoint.protected && (
                        <div className="flex items-center text-sm text-amber-600 mb-2">
                          <Lock className="h-4 w-4 mr-1" />
                          Requires authentication
                        </div>
                      )}
                      {endpoint.example && (
                        <div className="mt-2">
                          <p className="text-sm font-medium text-gray-500 mb-1">
                            Example Response:
                          </p>
                          <pre className="bg-gray-800 text-gray-100 p-3 rounded-md overflow-x-auto">
                            <code>
                              {JSON.stringify(endpoint.example, null, 2)}
                            </code>
                          </pre>
                        </div>
                      )}
                    </div>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}

const endpoints = [
  {
    method: 'POST',
    path: '/api/process-image',
    description: 'Process an image and generate product predictions',
    protected: true,
    example: {
      predictions: [
        {
          productId: 'prod_123',
          name: 'Milk',
          confidence: 0.95,
          quantity: 1,
        },
      ],
      shoppingListId: 'list_123',
    },
  },
  {
    method: 'GET',
    path: '/api/shopping-lists',
    description: 'Get all shopping lists for the authenticated user',
    protected: true,
    example: {
      lists: [
        {
          id: 'list_123',
          createdAt: '2024-02-25T12:00:00Z',
          items: [
            {
              productId: 'prod_123',
              name: 'Milk',
              quantity: 1,
            },
          ],
        },
      ],
    },
  },
  {
    method: 'POST',
    path: '/api/shopping-lists',
    description: 'Create a new shopping list',
    protected: true,
    example: {
      id: 'list_123',
      createdAt: '2024-02-25T12:00:00Z',
      items: [],
    },
  },
  {
    method: 'PUT',
    path: '/api/shopping-lists/:id',
    description: 'Update an existing shopping list',
    protected: true,
    example: {
      id: 'list_123',
      updatedAt: '2024-02-25T12:05:00Z',
      items: [
        {
          productId: 'prod_123',
          name: 'Milk',
          quantity: 2,
        },
      ],
    },
  },
  {
    method: 'DELETE',
    path: '/api/shopping-lists/:id',
    description: 'Delete a shopping list',
    protected: true,
    example: {
      success: true,
      message: 'Shopping list deleted successfully',
    },
  },
  {
    method: 'POST',
    path: '/api/orders',
    description: 'Create a new order from a shopping list',
    protected: true,
    example: {
      orderId: 'order_123',
      status: 'pending',
      total: 29.99,
      items: [
        {
          productId: 'prod_123',
          name: 'Milk',
          quantity: 2,
          price: 4.99,
        },
      ],
    },
  },
  {
    method: 'GET',
    path: '/api/orders',
    description: 'Get all orders for the authenticated user',
    protected: true,
    example: {
      orders: [
        {
          id: 'order_123',
          status: 'completed',
          total: 29.99,
          createdAt: '2024-02-25T12:00:00Z',
        },
      ],
    },
  },
  {
    method: 'GET',
    path: '/api/orders/:id',
    description: 'Get details of a specific order',
    protected: true,
    example: {
      id: 'order_123',
      status: 'completed',
      total: 29.99,
      items: [
        {
          productId: 'prod_123',
          name: 'Milk',
          quantity: 2,
          price: 4.99,
        },
      ],
      shipping: {
        address: '123 Main St',
        city: 'New York',
        status: 'delivered',
      },
    },
  },
  {
    method: 'POST',
    path: '/api/auth/signup',
    description: 'Mendaftarkan pengguna baru',
    protected: false,
    example: {
      email: "user@example.com",
      password: "password123",
      response: {
        user: {
          id: "user_123",
          email: "user@example.com",
          created_at: "2024-03-10T12:00:00Z"
        },
        session: {
          access_token: "eyJhbGciOiJIUzI1NiIs...",
          refresh_token: "IiwiZXhwIjoxNTE2M...",
          expires_at: 3600
        }
      }
    }
  },
  {
    method: 'POST',
    path: '/api/auth/signin',
    description: 'Login pengguna yang sudah terdaftar',
    protected: false,
    example: {
      email: "user@example.com",
      password: "password123",
      response: {
        user: {
          id: "user_123",
          email: "user@example.com"
        },
        session: {
          access_token: "eyJhbGciOiJIUzI1NiIs...",
          refresh_token: "IiwiZXhwIjoxNTE2M...",
          expires_at: 3600
        }
      }
    }
  },
  {
    method: 'POST',
    path: '/api/auth/signout',
    description: 'Logout pengguna',
    protected: true,
    example: {
      success: true,
      message: "Successfully signed out"
    }
  },
  {
    method: 'POST',
    path: '/api/auth/reset-password',
    description: 'Mengirim email reset password',
    protected: false,
    example: {
      email: "user@example.com",
      response: {
        success: true,
        message: "Password reset email sent"
      }
    }
  },
  {
    method: 'POST',
    path: '/api/auth/google',
    description: 'Login menggunakan Google OAuth',
    protected: false,
    example: {
      response: {
        user: {
          id: "user_123",
          email: "user@gmail.com",
          provider: "google"
        },
        session: {
          access_token: "eyJhbGciOiJIUzI1NiIs...",
          expires_at: 3600
        }
      }
    }
  },
];