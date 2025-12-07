# Vehicle Rental Backend

Live Link: https://vehicle-rental-system-eosin.vercel.app/

## Overview
Node.js + TypeScript backend for a vehicle rental system supporting Users, Vehicles, and Bookings with role-based auth (admin/customer).



##  API Overview

### Auth Endpoints

- `POST /api/v1/auth/signup`
- `POST /api/v1/auth/signin`

### Vehicle Endpoints

- `POST /api/v1/vehicles` (Admin only)
- `GET /api/v1/vehicles`
- `GET /api/v1/vehicles/:vehicleId`
- `PUT /api/v1/vehicles/:vehicleId` (Admin only)
- `DELETE /api/v1/vehicles/:vehicleId` (Admin only)

### User Endpoints

- `GET /api/v1/users` (Admin only)
- `PUT /api/v1/users/:userId`
- `DELETE /api/v1/users/:userId` (Admin only)

### Booking Endpoints

- `POST /api/v1/bookings`
- `GET /api/v1/bookings`
- `PUT /api/v1/bookings/:bookingId`

---

## Features
- User signup / signin (JWT)
- Role-based access (admin vs customer)
- Vehicle management (create/update/delete with constraints)
- Bookings: create with auto-price calculation and vehicle availability updates
- Booking lifecycle: active / cancelled / returned
- Transaction-safe operations for bookings

## Tech
- Node.js, TypeScript, Express
- PostgreSQL
- bcrypt for password hashing
- jsonwebtoken for auth

## Setup
1. Clone repo
2. cp .env.example .env and fill in values
3. Install: `npm install`
4. Start dev: `npm run dev`

### 3. Configure Environment Variables
```
Create a .env file in the root directory:
 
PORT=5000

DATABASE_URL=postgresql://username:password@localhost:5923/vehicle_rental_system

JWT_SECRET=your_jwt_secret_key
```

## Notes
- Passwords stored hashed (bcrypt).
- JWT_SECRET must be set in `.env`.
- Daily rent stored as integer (no floating numbers).

