import swaggerUi from 'swagger-ui-express';

const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'StudyMate API',
    version: '1.0.0',
    description: 'API documentation for StudyMate backend',
  },
  servers: [
    {
      url: 'http://localhost:8000',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      ErrorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          error: { type: 'string', example: 'Bad request' },
          statusCode: { type: 'number', example: 400 },
        },
      },
      SuccessMessage: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string', example: 'Operation successful' },
        },
      },
    },
  },
  tags: [
    { name: 'Auth' },
    { name: 'Documents' },
    { name: 'Flashcards' },
    { name: 'AI' },
    { name: 'Quizzes' },
    { name: 'Progress' },
  ],
  paths: {
    '/api/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Register a new user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['username', 'email', 'password'],
                properties: {
                  username: { type: 'string', example: 'john_doe' },
                  email: { type: 'string', format: 'email', example: 'john@example.com' },
                  password: { type: 'string', example: 'secret123' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'User registered successfully' },
          400: { description: 'Validation error' },
        },
      },
    },
    '/api/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Login user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', format: 'email', example: 'john@example.com' },
                  password: { type: 'string', example: 'secret123' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Login successful' },
          401: { description: 'Invalid credentials' },
        },
      },
    },
    '/api/auth/profile': {
      get: {
        tags: ['Auth'],
        summary: 'Get current user profile',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Profile fetched' },
          401: { description: 'Unauthorized' },
        },
      },
      put: {
        tags: ['Auth'],
        summary: 'Update current user profile',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  username: { type: 'string' },
                  email: { type: 'string', format: 'email' },
                  profileImage: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Profile updated' },
          401: { description: 'Unauthorized' },
        },
      },
    },
    '/api/auth/change-password': {
      post: {
        tags: ['Auth'],
        summary: 'Change user password',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['currentPassword', 'newPassword'],
                properties: {
                  currentPassword: { type: 'string' },
                  newPassword: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Password updated' },
          401: { description: 'Unauthorized or invalid current password' },
        },
      },
    },
    '/api/documents/upload': {
      post: {
        tags: ['Documents'],
        summary: 'Upload PDF document',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                required: ['file', 'title'],
                properties: {
                  title: { type: 'string' },
                  file: { type: 'string', format: 'binary' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Document uploaded' },
          400: { description: 'Invalid upload payload' },
        },
      },
    },
    '/api/documents': {
      get: {
        tags: ['Documents'],
        summary: 'Get all user documents',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Documents fetched' },
          401: { description: 'Unauthorized' },
        },
      },
    },
    '/api/documents/{id}': {
      get: {
        tags: ['Documents'],
        summary: 'Get one document by id',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          200: { description: 'Document fetched' },
          404: { description: 'Document not found' },
        },
      },
      delete: {
        tags: ['Documents'],
        summary: 'Delete one document by id',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          200: { description: 'Document deleted' },
          404: { description: 'Document not found' },
        },
      },
    },
    '/api/flashcards': {
      get: {
        tags: ['Flashcards'],
        summary: 'Get all flashcard sets for current user',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Flashcard sets fetched' },
        },
      },
    },
    '/api/flashcards/{documentId}': {
      get: {
        tags: ['Flashcards'],
        summary: 'Get flashcards by document id',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'documentId',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          200: { description: 'Flashcards fetched' },
        },
      },
    },
    '/api/flashcards/{cardId}/review': {
      post: {
        tags: ['Flashcards'],
        summary: 'Mark a flashcard as reviewed',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'cardId',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          200: { description: 'Flashcard reviewed' },
          404: { description: 'Card not found' },
        },
      },
    },
    '/api/flashcards/{cardId}/star': {
      put: {
        tags: ['Flashcards'],
        summary: 'Toggle star on a flashcard',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'cardId',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          200: { description: 'Flashcard star toggled' },
          404: { description: 'Card not found' },
        },
      },
    },
    '/api/flashcards/{id}': {
      delete: {
        tags: ['Flashcards'],
        summary: 'Delete flashcard set',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          200: { description: 'Flashcard set deleted' },
          404: { description: 'Set not found' },
        },
      },
    },
    '/api/ai/generate-flashcards': {
      post: {
        tags: ['AI'],
        summary: 'Generate flashcards from a document',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['documentId'],
                properties: {
                  documentId: { type: 'string' },
                  count: { type: 'number', example: 10 },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Flashcards generated' },
          404: { description: 'Document not found or not ready' },
        },
      },
    },
    '/api/ai/generate-quiz': {
      post: {
        tags: ['AI'],
        summary: 'Generate quiz from a document',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['documentId'],
                properties: {
                  documentId: { type: 'string' },
                  numQuestions: { type: 'number', example: 5 },
                  title: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Quiz generated' },
          404: { description: 'Document not found or not ready' },
        },
      },
    },
    '/api/ai/generate-summary': {
      post: {
        tags: ['AI'],
        summary: 'Generate summary from a document',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['documentId'],
                properties: {
                  documentId: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Summary generated' },
          404: { description: 'Document not found or not ready' },
        },
      },
    },
    '/api/ai/chat': {
      post: {
        tags: ['AI'],
        summary: 'Chat with a document',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['documentId', 'question'],
                properties: {
                  documentId: { type: 'string' },
                  question: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Answer generated' },
          404: { description: 'Document not found or not ready' },
        },
      },
    },
    '/api/ai/explain-concept': {
      post: {
        tags: ['AI'],
        summary: 'Explain a concept from a document',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['documentId', 'concept'],
                properties: {
                  documentId: { type: 'string' },
                  concept: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Explanation generated' },
          404: { description: 'Document not found or not ready' },
        },
      },
    },
    '/api/ai/chat-history/{documentId}': {
      get: {
        tags: ['AI'],
        summary: 'Get chat history for a document',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'documentId',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          200: { description: 'Chat history fetched' },
        },
      },
    },
    '/api/quizzes/{documentId}': {
      get: {
        tags: ['Quizzes'],
        summary: 'Get all quizzes for a document',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'documentId',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          200: { description: 'Quizzes fetched' },
        },
      },
    },
    '/api/quizzes/quiz/{id}': {
      get: {
        tags: ['Quizzes'],
        summary: 'Get single quiz by id',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          200: { description: 'Quiz fetched' },
          404: { description: 'Quiz not found' },
        },
      },
    },
    '/api/quizzes/{id}/submit': {
      post: {
        tags: ['Quizzes'],
        summary: 'Submit quiz answers',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['answers'],
                properties: {
                  answers: {
                    type: 'array',
                    items: {
                      type: 'object',
                      required: ['questionIndex', 'selectedAnswer'],
                      properties: {
                        questionIndex: { type: 'number' },
                        selectedAnswer: { type: 'string' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Quiz submitted' },
          400: { description: 'Invalid answers or already completed' },
          404: { description: 'Quiz not found' },
        },
      },
    },
    '/api/quizzes/{id}/results': {
      get: {
        tags: ['Quizzes'],
        summary: 'Get quiz results',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          200: { description: 'Quiz results fetched' },
          400: { description: 'Quiz not completed yet' },
          404: { description: 'Quiz not found' },
        },
      },
    },
    '/api/quizzes/{id}': {
      delete: {
        tags: ['Quizzes'],
        summary: 'Delete quiz',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          200: { description: 'Quiz deleted' },
          404: { description: 'Quiz not found' },
        },
      },
    },
    '/api/progress/dashboard': {
      get: {
        tags: ['Progress'],
        summary: 'Get user dashboard statistics',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Dashboard data fetched' },
          401: { description: 'Unauthorized' },
        },
      },
    },
  },
};

export { swaggerUi, swaggerSpec };
