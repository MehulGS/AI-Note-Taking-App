# AI Note Sharing App

A production-ready MERN-style secure note sharing app built with Next.js 15, Hono.js, MongoDB, Mongoose, JWT authentication, bcryptjs, nanoid, React Hook Form, Zod, Axios, Tailwind CSS, shadcn-style UI primitives, and Sonner toasts.

## Features

- JWT register and login flow
- Protected note creation and note detail routes
- Secure share links generated with `nanoid`
- `ONE_TIME` links consumed atomically on first successful access
- `TIME_BASED` links valid until expiry
- `PUBLIC` links open directly
- `PASSWORD_PROTECTED` links use generated one-time display passwords
- bcryptjs hashing for user passwords and access keys
- Revoke link support
- View counts updated safely with MongoDB `$inc`
- Zod validation on frontend and backend
- Request logging, IP rate limiting, and password unlock lockouts
- Responsive recruiter-friendly UI

## Tech Stack

### Frontend

- Next.js 15 App Router
- TypeScript
- Tailwind CSS
- shadcn-style reusable components
- React Hook Form
- Zod
- Axios
- Sonner

### Backend

- Hono.js
- TypeScript
- MongoDB
- Mongoose
- JWT
- bcryptjs
- nanoid

## Folder Structure

```txt
backend/src
 ├── config
 ├── controllers
 ├── middleware
 ├── models
 ├── routes
 ├── services
 ├── types
 ├── utils
 └── validators

frontend/src
 ├── app
 ├── components
 ├── hooks
 ├── lib
 ├── providers
 ├── schemas
 ├── services
 └── types
```

## Setup Instructions

```bash
npm run install:all
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
npm run dev:backend
npm run dev:frontend
```

Backend runs on `http://localhost:5000` and frontend runs on `http://localhost:3000`.

## Environment Variables

### Backend

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/ai-note-sharing
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3000
```

### Frontend

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Database Schema

### User

```ts
{
  _id,
  name,
  email,
  passwordHash,
  createdAt,
  updatedAt
}
```

### Note

```ts
{
  _id,
  userId,
  title,
  content,
  shareType,
  accessType,
  expiresAt,
  shareToken,
  accessKey,
  viewCount,
  isRevoked,
  isUsed,
  createdAt,
  updatedAt
}
```

## Indexes

- `email: 1` unique
- `shareToken: 1` unique
- `userId: 1`
- `expiresAt: 1`
- `createdAt: -1`

## API Documentation

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`

### Notes

- `POST /api/notes`
- `GET /api/notes/:id`
- `DELETE /api/notes/:id/revoke`
- `GET /api/notes/my-notes`

### Share

- `GET /api/share/:token`
- `POST /api/share/:token/unlock`

Responses use:

```ts
{ success: true, data: {} }
{ success: false, message: string }
```

## Authentication Flow

Users register or login with email and password. Passwords are hashed with bcryptjs. The backend returns a JWT, which the frontend stores in `localStorage` and sends in the `Authorization` header for protected note APIs.

## Share Link Flow

When a note is created, the backend generates a secure `shareToken` using `nanoid(32)` and returns `/share/{token}`. Protected notes also generate a random password like `ABX9-MK2P-ZQ7L`, hash it with bcryptjs, and return the plain password only once.

## Expiry Logic

Every share request validates that the token exists, is not revoked, is not expired, and has not already been used for one-time links.

## Revocation Logic

Revoking sets `isRevoked = true`. All future accesses fail with a revoked message.

## View Count Logic

`viewCount` is increased only after successful public access or successful password unlock. It is not increased for invalid, expired, revoked, used, or wrong-password requests.

## How do you prevent two users from using a one-time link at the same time?

MongoDB atomic `findOneAndUpdate` ensures only one request can change `isUsed` from `false` to `true`. Only that request succeeds; later simultaneous requests fail automatically.

## How do you update view count safely?

MongoDB `$inc` updates `viewCount` atomically and prevents race conditions.

## How would this work if 1 million people opened the link?

Use MongoDB Atlas, replica sets, sharding, Redis for distributed rate limits/lockouts, load balancers, horizontal API scaling, CDN/static caching for frontend assets, and proper indexing.

## How would you prevent brute-force attempts on password-protected links?

Use IP and token-based rate limiting, 5-failure lockouts for 15 minutes, request logging, bcryptjs hashing, generic error messages, and CAPTCHA after repeated suspicious attempts.

## Security Measures

- JWT authentication
- bcryptjs password hashing
- bcryptjs access-key hashing
- secure token generation
- Zod validation
- protected APIs
- generic unlock errors
- rate limiting
- request logging
- secure headers

## Scalability Considerations

Move in-memory rate limits and lockouts to Redis for multi-instance deployments, use MongoDB Atlas with proper indexes, deploy the Hono API behind a load balancer, and serve the Next.js app through a CDN-backed platform.
