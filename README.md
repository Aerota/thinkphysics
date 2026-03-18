# Physics Class Management System

A web app to manage students, tutes, invoices, and payments for A/L physics classes.

## Setup

1. Install Node.js
2. Run `npm install`
3. Set up a PostgreSQL database on Neon.tech and add the connection string to `.env.local`
4. Run `npx prisma migrate dev --name init`
5. Run `npm run dev` to start locally
6. Deploy to Vercel