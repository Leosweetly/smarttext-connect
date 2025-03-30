# SmartText Connect

A business messaging platform that helps businesses communicate with their customers via text messaging.

## Project info

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Vercel API Routes
- Airtable Integration

## Development

To run the project locally:

```sh
# Install dependencies
npm install

# Start the development server
npm run dev
```

## Deployment

This project is configured for deployment on Vercel. The `vercel.json` file includes configuration for API routes and client-side routing.

### Environment Variables

The following environment variables need to be set in your Vercel project settings:

- `VITE_API_BASE_URL`: https://smarttext-ai.vercel.app
- `AIRTABLE_PAT`: patQey3tj5Jwilg6M.51a988866211150099fc779cb59e95446eb61584082b5ad8b73511f0d3ed3da3
- `AIRTABLE_BASE_ID`:appl19GgA8hdPkUR0

To set these in Vercel:

1. Go to your project in the Vercel dashboard
2. Navigate to Settings > Environment Variables
3. Add each variable with its corresponding value
4. Redeploy your application for the changes to take effect

## Project Structure

- `/src/components`: UI components
- `/src/hooks`: Custom React hooks
- `/src/pages`: Page components and API routes
- `/src/services`: Service modules for external APIs

## API Routes

The project includes serverless API routes in the `/src/pages/api` directory:

- `/api/update-business-info`: Updates business information in Airtable

## Onboarding Flow

The onboarding process consists of four steps:

1. Business Info: Collect basic business information
2. Communication Setup: Configure business hours and response preferences
3. Message Templates: Set up automated message templates
4. Feature Tour: Guide users through the platform features

Each step saves data to Airtable via the API routes.
