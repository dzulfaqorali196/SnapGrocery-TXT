import { useEffect } from 'react'
import SwaggerUIBundle from 'swagger-ui-dist/swagger-ui-bundle'
import 'swagger-ui-dist/swagger-ui.css'

export function SwaggerDocs() {
  useEffect(() => {
    const ui = SwaggerUIBundle({
      dom_id: '#swagger-ui',
      spec: swaggerConfig,
      docExpansion: 'list',
      deepLinking: true
    })

    return () => {
      // Cleanup if needed
      if (ui && typeof ui.unmount === 'function') {
        ui.unmount()
      }
    }
  }, [])

  return <div id="swagger-ui" className="swagger-container" />
}

const swaggerConfig = {
  openapi: '3.0.0',
  info: {
    title: 'SnapGrocery API',
    version: '1.0.0',
    description: 'API dokumentasi untuk layanan SnapGrocery - AI-powered grocery shopping assistant',
    contact: {
      name: 'SnapGrocery Support',
      url: 'https://snap-grocery-txt.vercel.app',
      email: 'support@snapgrocery.com'
    }
  },
  servers: [
    {
      url: 'https://snap-grocery-txt.vercel.app/api-docs',
      description: 'Production server'
    },
    {
      url: 'http://localhost:5173/api-docs',
      description: 'Development server'
    }
  ],
  tags: [
    {
      name: 'Auth',
      description: 'Endpoint untuk autentikasi'
    },
    {
      name: 'Image Processing',
      description: 'Endpoint untuk pemrosesan gambar dan deteksi produk'
    },
    {
      name: 'Shopping Lists',
      description: 'Manajemen daftar belanja'
    },
    {
      name: 'Orders',
      description: 'Manajemen pesanan'
    },
    {
      name: 'User',
      description: 'Manajemen profil pengguna'
    },
    {
      name: 'Partner Integration',
      description: 'Integrasi dengan mitra toko'
    },
    {
      name: 'AI Recognition',
      description: 'Manajemen dan monitoring model AI'
    },
    {
      name: 'Notifications',
      description: 'Manajemen notifikasi dan preferensi'
    },
    {
      name: 'Reports',
      description: 'Laporan dan analytics'
    }
  ],
  paths: {
    '/auth/signup': {
      post: {
        tags: ['Auth'],
        summary: 'Mendaftar pengguna baru',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: {
                    type: 'string',
                    format: 'email',
                    example: 'user@example.com'
                  },
                  password: {
                    type: 'string',
                    format: 'password',
                    minLength: 8,
                    example: 'password123'
                  }
                },
                required: ['email', 'password']
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Registrasi berhasil',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    user: {
                      type: 'object',
                      properties: {
                        id: { type: 'string' },
                        email: { type: 'string' },
                        created_at: { type: 'string', format: 'date-time' }
                      }
                    },
                    session: {
                      type: 'object',
                      properties: {
                        access_token: { type: 'string' },
                        refresh_token: { type: 'string' },
                        expires_at: { type: 'number' }
                      }
                    }
                  }
                }
              }
            }
          },
          '400': {
            description: 'Bad Request',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    error: {
                      type: 'string',
                      example: 'Email sudah terdaftar'
                    }
                  }
                }
              }
            }
          },
          '500': {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    error: {
                      type: 'string',
                      example: 'Terjadi kesalahan server'
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/auth/signin': {
      post: {
        tags: ['Auth'],
        summary: 'Login pengguna',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: {
                    type: 'string',
                    format: 'email'
                  },
                  password: {
                    type: 'string',
                    format: 'password'
                  }
                },
                required: ['email', 'password']
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Login berhasil',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    user: {
                      type: 'object',
                      properties: {
                        id: { type: 'string' },
                        email: { type: 'string' }
                      }
                    },
                    session: {
                      type: 'object',
                      properties: {
                        access_token: { type: 'string' },
                        refresh_token: { type: 'string' },
                        expires_at: { type: 'number' }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/auth/google': {
      post: {
        tags: ['Auth'],
        summary: 'Login dengan Google',
        responses: {
          '200': {
            description: 'Login Google berhasil',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    user: {
                      type: 'object',
                      properties: {
                        id: { type: 'string' },
                        email: { type: 'string' },
                        provider: { type: 'string', example: 'google' }
                      }
                    },
                    session: {
                      type: 'object',
                      properties: {
                        access_token: { type: 'string' },
                        expires_at: { type: 'number' }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/process-image': {
      post: {
        tags: ['Image Processing'],
        summary: 'Upload dan proses gambar untuk deteksi produk',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {
                  image: {
                    type: 'string',
                    format: 'binary',
                    description: 'File gambar (JPG/PNG/JPEG)',
                    maxLength: 5242880 // 5MB dalam bytes
                  }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Gambar berhasil diproses',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    predictions: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          productId: { type: 'string' },
                          name: { type: 'string' },
                          confidence: { type: 'number' },
                          quantity: { type: 'integer' }
                        }
                      }
                    },
                    shoppingListId: { type: 'string' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/shopping-lists': {
      get: {
        tags: ['Shopping Lists'],
        summary: 'Mendapatkan semua daftar belanja',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Daftar belanja berhasil diambil',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    lists: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          id: { type: 'string' },
                          createdAt: { type: 'string', format: 'date-time' },
                          items: {
                            type: 'array',
                            items: {
                              type: 'object',
                              properties: {
                                productId: { type: 'string' },
                                name: { type: 'string' },
                                quantity: { type: 'integer' }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      post: {
        tags: ['Shopping Lists'],
        summary: 'Membuat daftar belanja baru',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Daftar belanja berhasil dibuat',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    createdAt: { type: 'string', format: 'date-time' },
                    items: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          productId: { type: 'string' },
                          name: { type: 'string' },
                          quantity: { type: 'integer' }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/orders': {
      get: {
        tags: ['Orders'],
        summary: 'Mendapatkan semua pesanan',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Pesanan berhasil diambil',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    orders: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          id: { type: 'string' },
                          status: { type: 'string' },
                          total: { type: 'number' },
                          createdAt: { type: 'string', format: 'date-time' }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      post: {
        tags: ['Orders'],
        summary: 'Membuat pesanan baru',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  shoppingListId: { type: 'string' }
                },
                required: ['shoppingListId']
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Pesanan berhasil dibuat',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    orderId: { type: 'string' },
                    status: { type: 'string' },
                    total: { type: 'number' },
                    items: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          productId: { type: 'string' },
                          name: { type: 'string' },
                          quantity: { type: 'integer' },
                          price: { type: 'number' }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/user/profile': {
      get: {
        tags: ['User'],
        summary: 'Mendapatkan profil pengguna',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Profil berhasil diambil',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    email: { type: 'string' },
                    name: { type: 'string' },
                    phone: { type: 'string' },
                    address: { type: 'string' },
                    created_at: { type: 'string', format: 'date-time' }
                  }
                }
              }
            }
          }
        }
      },
      put: {
        tags: ['User'],
        summary: 'Update profil pengguna',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  phone: { type: 'string' },
                  address: { type: 'string' }
                }
              }
            }
          }
        }
      }
    },
    '/feedback': {
      post: {
        tags: ['Feedback'],
        summary: 'Mengirim feedback untuk hasil deteksi produk',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  imageId: { type: 'string' },
                  accuracy: { type: 'boolean' },
                  missedProducts: {
                    type: 'array',
                    items: {
                      type: 'string'
                    }
                  },
                  comment: { type: 'string' }
                }
              }
            }
          }
        }
      }
    },
    '/analytics/shopping-patterns': {
      get: {
        tags: ['Analytics'],
        summary: 'Mendapatkan analisis pola belanja',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Analisis berhasil diambil',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    frequentItems: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          productId: { type: 'string' },
                          name: { type: 'string' },
                          purchaseFrequency: { type: 'string' },
                          averageQuantity: { type: 'number' }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/partner/inventory': {
      get: {
        tags: ['Partner Integration'],
        summary: 'Mendapatkan data inventaris dari toko mitra',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'storeId',
            in: 'query',
            description: 'ID toko mitra',
            required: false,
            schema: {
              type: 'string'
            }
          },
          {
            name: 'category',
            in: 'query',
            description: 'Kategori produk',
            required: false,
            schema: {
              type: 'string'
            }
          }
        ],
        responses: {
          '200': {
            description: 'Data inventaris berhasil diambil',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    products: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          productId: { type: 'string' },
                          name: { type: 'string' },
                          stock: { type: 'integer' },
                          price: { type: 'number' },
                          storeId: { type: 'string' },
                          category: { type: 'string' },
                          lastUpdated: { type: 'string', format: 'date-time' }
                        }
                      }
                    },
                    pagination: {
                      type: 'object',
                      properties: {
                        total: { type: 'integer' },
                        page: { type: 'integer' },
                        limit: { type: 'integer' }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      post: {
        tags: ['Partner Integration'],
        summary: 'Update stok produk toko mitra',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  storeId: { type: 'string' },
                  products: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        productId: { type: 'string' },
                        stock: { type: 'integer' },
                        price: { type: 'number' }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/ai/model-status': {
      get: {
        tags: ['AI Recognition'],
        summary: 'Mendapatkan status dan metrics model AI',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Status model berhasil diambil',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    version: { type: 'string' },
                    accuracy: { type: 'number' },
                    lastTraining: { type: 'string', format: 'date-time' },
                    totalPredictions: { type: 'integer' },
                    successRate: { type: 'number' },
                    metrics: {
                      type: 'object',
                      properties: {
                        precision: { type: 'number' },
                        recall: { type: 'number' },
                        f1Score: { type: 'number' }
                      }
                    },
                    recentUpdates: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          date: { type: 'string', format: 'date-time' },
                          description: { type: 'string' },
                          improvements: { type: 'array', items: { type: 'string' } }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/notifications/preferences': {
      get: {
        tags: ['Notifications'],
        summary: 'Mendapatkan preferensi notifikasi',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Preferensi notifikasi berhasil diambil',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    email: {
                      type: 'object',
                      properties: {
                        orderUpdates: { type: 'boolean' },
                        stockAlerts: { type: 'boolean' },
                        promotions: { type: 'boolean' },
                        frequency: { 
                          type: 'string',
                          enum: ['instant', 'daily', 'weekly']
                        }
                      }
                    },
                    push: {
                      type: 'object',
                      properties: {
                        orderUpdates: { type: 'boolean' },
                        stockAlerts: { type: 'boolean' },
                        quiet_hours: {
                          type: 'object',
                          properties: {
                            enabled: { type: 'boolean' },
                            start: { type: 'string', format: 'time' },
                            end: { type: 'string', format: 'time' }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/reports/analytics': {
      get: {
        tags: ['Reports'],
        summary: 'Mendapatkan laporan analitik',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'startDate',
            in: 'query',
            required: true,
            schema: {
              type: 'string',
              format: 'date'
            }
          },
          {
            name: 'endDate',
            in: 'query',
            required: true,
            schema: {
              type: 'string',
              format: 'date'
            }
          }
        ],
        responses: {
          '200': {
            description: 'Laporan berhasil diambil',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    orderMetrics: {
                      type: 'object',
                      properties: {
                        totalOrders: { type: 'integer' },
                        averageOrderValue: { type: 'number' },
                        topProducts: {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              productId: { type: 'string' },
                              name: { type: 'string' },
                              quantity: { type: 'integer' },
                              revenue: { type: 'number' }
                            }
                          }
                        }
                      }
                    },
                    aiMetrics: {
                      type: 'object',
                      properties: {
                        recognitionAccuracy: { type: 'number' },
                        averageProcessingTime: { type: 'number' },
                        totalProcessedImages: { type: 'integer' }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/shopping-lists/{id}': {
      patch: {
        tags: ['Shopping Lists'],
        summary: 'Update status daftar belanja',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string'
            }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: {
                    type: 'string',
                    enum: ['active', 'completed']
                  }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Status berhasil diupdate',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ShoppingList'
                }
              }
            }
          }
        }
      }
    }
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    },
    parameters: {
      RateLimit: {
        name: 'X-RateLimit-Limit',
        in: 'header',
        description: 'Jumlah request maksimal per jam',
        required: true,
        schema: {
          type: 'integer',
          default: 100
        }
      }
    }
  }
}; 