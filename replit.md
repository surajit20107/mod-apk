# APK Store Admin Panel

## Overview
A Next.js application for managing an APK/app store with admin authentication and CRUD operations for apps.

## Recent Changes (December 2025)
- Implemented complete admin authentication system with signin/signup
- Added JWT-based session management with HTTP-only cookies
- Created Next.js middleware to protect admin routes
- Added admin dashboard with app listing, search, and pagination
- Implemented full CRUD operations (Create, Read, Update, Delete) for apps
- Created edit app page for modifying existing applications

## Project Architecture

### Frontend (Next.js App Router)
- `/app/admin/signin` - Admin login page
- `/app/admin/signup` - Admin registration page
- `/app/admin/dashboard` - Admin dashboard with app management
- `/app/admin/create-app` - Create new app form
- `/app/admin/edit-app/[id]` - Edit existing app form

### API Routes
- `POST /api/admin/signin` - Admin authentication
- `POST /api/admin/register` - Admin registration
- `POST /api/admin/logout` - Admin logout
- `GET /api/v1/admin` - List all apps with pagination/search
- `POST /api/v1/admin` - Create new app
- `GET /api/v1/admin/apps/[id]` - Get single app
- `PUT /api/v1/admin/apps/[id]` - Update app
- `DELETE /api/v1/admin/apps/[id]` - Delete app

### Models
- `User` - Admin users with role-based access
- `Apk` - Application entries with metadata

### Authentication Flow
1. Admin signs in with email/username and password
2. Server validates credentials and checks admin role
3. JWT token is generated and stored in HTTP-only cookie
4. Middleware protects admin routes by checking cookie presence
5. API routes verify userId header against database

## Environment Variables Required
- `JWT_SECRET` - Secret key for JWT token signing
- `MONGODB_URI` or similar - Database connection string
- Cloudinary credentials for image uploads

## Tech Stack
- Next.js 15 with App Router
- TypeScript
- MongoDB with Mongoose
- Tailwind CSS
- Cloudinary for image uploads
- bcrypt for password hashing
- jsonwebtoken for JWT authentication
