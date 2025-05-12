# SmartText Connect - Authentication & Dashboard

A Next.js 13+ App Router application with Supabase Auth and a customer dashboard. This project demonstrates a complete authentication flow using magic links (email OTP) and a protected dashboard for business management.

## Features

- **Next.js 13+ App Router** architecture
- **Supabase Auth** with email magic links (no passwords, no OAuth)
- **Protected Routes** with middleware
- **Row Level Security** for data protection
- **Business Dashboard** for managing business information
- **Responsive Design** with Tailwind CSS
- **TypeScript** for type safety
- **Debugging Utilities** for easier development

## Project Structure

```
/app                           # Next.js App Router
  /(auth)                      # Auth group routes
    /login                     # Login page
    /signup                    # Signup page
    /check-email               # Email verification page
  /(protected)                 # Protected routes
    /dashboard                 # Dashboard pages
      /settings                # Business settings
    /onboarding                # Onboarding flow
  /auth/callback               # Auth callback route
/contexts                      # React contexts
  /AuthContext.tsx             # Authentication context
/lib                           # Utility functions
  /debug.ts                    # Debugging utilities
  /supabase                    # Supabase clients
    /client.ts                 # Browser client
    /server.ts                 # Server client
/middleware.ts                 # Route protection
/supabase                      # Supabase configuration
  /schema.sql                  # Database schema and RLS
/types                         # TypeScript types
  /database.types.ts           # Supabase database types
```

## Prerequisites

- Node.js 18+ and npm/yarn
- [Supabase](https://supabase.com) account

## Setup Instructions

### 1. Clone the repository

```bash
git clone <repository-url>
cd smarttext-connect
```

### 2. Install dependencies

You can install dependencies using the provided script:

```bash
npm run install:deps
# or
yarn install:deps
```

This script will guide you through the process of installing dependencies with your preferred package manager.

Alternatively, you can install dependencies directly:

```bash
npm install
# or
yarn install
```

### 3. Set up Supabase

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the SQL commands from `supabase/schema.sql`
3. Go to Authentication → Settings and:
   - Enable "Email OTP" provider
   - Disable "Email + Password" provider
   - Set up SMTP settings for email delivery (or use Supabase's default)
   - Add your site URL to the "Site URL" field
   - Add redirect URLs for authentication callbacks

### 4. Configure environment variables

Create a `.env.local` file in the root directory with the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

You can find these values in your Supabase project settings → API.

### 5. Test your Supabase connection

You can test your Supabase connection using the provided script:

```bash
npm run test:connection
# or
yarn test:connection
```

This script will verify that your environment variables are set up correctly and that you can connect to your Supabase project.

### 6. Apply the database schema

You can apply the database schema to your Supabase project using the provided script:

```bash
npm run apply:schema
# or
yarn apply:schema
```

This script will guide you through the process of applying the schema to your Supabase project.

### 7. Run the development server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### 8. Generate TypeScript types

You can generate TypeScript types from your Supabase database schema using the provided script:

```bash
npm run generate:types
# or
yarn generate:types
```

This script will generate TypeScript types based on your Supabase database schema and save them to `types/database.types.ts`.

### 9. Test the authentication flow

You can test the authentication flow using the provided script:

```bash
npm run test:auth
# or
yarn test:auth
```

This script will create a test user and business in your Supabase project and verify that the authentication flow works correctly.

## Authentication Flow

1. User enters their email on the signup/login page
2. Supabase sends a magic link to the user's email
3. User clicks the magic link and is redirected to the callback route
4. The callback route exchanges the code for a session
5. If the user has a business, they are redirected to the dashboard
6. If the user doesn't have a business, they are redirected to the onboarding page

## Security Features

### Row Level Security (RLS)

The application uses Supabase's Row Level Security to ensure users can only access their own data. The RLS policies are defined in `supabase/schema.sql`.

### Protected Routes

Routes under the `/(protected)` group are protected by middleware that checks for a valid session. If a user tries to access a protected route without being authenticated, they are redirected to the login page.

### Email-Only Authentication

The application uses email magic links for authentication, eliminating the security risks associated with passwords.

## Debugging

The application includes a debugging utility in `lib/debug.ts` that provides:

- Structured logging with different log levels
- Performance measurement for functions
- Error handling utilities

To enable debug logs in production, set the `NEXT_PUBLIC_DEBUG` environment variable to `true`.

## Customization

### Styling

The application uses Tailwind CSS for styling. You can customize the design by modifying the Tailwind configuration in `tailwind.config.js`.

### Business Fields

To add or modify business fields:

1. Update the `businesses` table schema in `supabase/schema.sql`
2. Update the `Database` type in `types/database.types.ts`
3. Update the form fields in `app/(protected)/dashboard/settings/page.tsx`
4. Update the display in `app/(protected)/dashboard/page.tsx`

## Deployment

### Deploy on Vercel

The easiest way to deploy the application is to use the [Vercel Platform](https://vercel.com).

You can deploy the application to Vercel using the provided script:

```bash
npm run deploy
# or
yarn deploy
```

This script will guide you through the process of deploying to Vercel, including:

1. Checking if you have the Vercel CLI installed
2. Verifying your Git repository status
3. Offering to commit any uncommitted changes
4. Deploying to Vercel with your chosen environment (production or preview)
5. Reminding you to set up environment variables in the Vercel dashboard

Alternatively, you can deploy manually:

1. Push your code to a Git repository (GitHub, GitLab, BitBucket)
2. Import the project in Vercel
3. Add the environment variables
4. Deploy

### Other Deployment Options

You can also deploy the application to any platform that supports Next.js, such as:

- [Netlify](https://netlify.com)
- [AWS Amplify](https://aws.amazon.com/amplify/)
- [DigitalOcean App Platform](https://www.digitalocean.com/products/app-platform/)

## License

This project is licensed under the MIT License - see the LICENSE file for details.
