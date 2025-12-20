# ZEEDIE Portfolio - Setup Guide

This guide explains how to set up and deploy your portfolio application.

## Prerequisites

- A PostgreSQL database (Neon, Supabase, or any PostgreSQL provider)
- Node.js 18+ installed (if running locally)

## Environment Variables

The application requires the following environment variables:

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `ADMIN_USERNAME` | Admin panel username | `codecaptain` |
| `ADMIN_PASSWORD` | Admin panel password | `your-secure-password` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `SESSION_SECRET` | Session encryption key | Auto-generated |

## Setup Instructions

### 1. On Replit (Recommended)

1. **Fork this Repl** or create a new one from this template
2. **Database**: Click the "Database" tab in the Tools panel to provision a PostgreSQL database. The `DATABASE_URL` will be automatically set.
3. **Admin Credentials**: Go to the "Secrets" tab and add:
   - `ADMIN_USERNAME`: Your desired admin username
   - `ADMIN_PASSWORD`: Your desired admin password
4. **Run the app**: Click the Run button. The database will auto-migrate.

### 2. Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd portfolio
   npm install
   ```

2. **Create a `.env` file** in the root directory:
   ```env
   DATABASE_URL=postgresql://username:password@localhost:5432/portfolio
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=your-secure-password
   ```

3. **Run database migrations**
   ```bash
   npm run db:push
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

### 3. Production Deployment

1. Set all required environment variables in your hosting platform
2. Run `npm run build` to build the application
3. Run `npm start` to start the production server

## Database Migrations

The application uses Drizzle ORM for database management.

### Automatic Migration
On startup, the application automatically attempts to run pending migrations.

### Manual Migration Commands

```bash
# Push schema changes to database (development)
npm run db:push

# Generate migration files
npx drizzle-kit generate

# Run migrations
npx drizzle-kit migrate
```

## Admin Panel

Access the admin panel at `/admin` to manage:
- **Profile**: Your name, title, bio, and location
- **Projects**: Portfolio projects with images and links
- **Blog Posts**: Articles and content
- **Experience**: Work history timeline
- **Skills**: Technical skills by category
- **Social Links**: Contact and social media links
- **LinkedIn Posts**: Showcase your LinkedIn activity
- **Settings**: Sync GitHub contributions

## GitHub Integration

GitHub contributions are synced automatically via the Replit GitHub connector:
1. Connect your GitHub account in Replit settings
2. Go to Admin > Settings > Sync GitHub Contributions

## Troubleshooting

### "Invalid credentials" on admin login
- Ensure `ADMIN_USERNAME` and `ADMIN_PASSWORD` are set in Replit Secrets (not .env file on Replit)
- Restart the application after changing secrets

### Database connection errors
- Verify `DATABASE_URL` is correctly set
- Check if your database allows connections from your IP
- Ensure the database exists and is accessible

### Missing tables
- Run `npm run db:push` to create tables
- Or restart the application to trigger auto-migration

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Express.js, Node.js
- **Database**: PostgreSQL with Drizzle ORM
- **Styling**: Swiss minimal design with 1.5rem border radius
