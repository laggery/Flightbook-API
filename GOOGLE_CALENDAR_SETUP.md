# Google Calendar Integration Setup

This document describes how to set up the Google Calendar integration for Flightbook.

## Google Cloud Console Setup

### 1. Create OAuth 2.0 Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Google Calendar API**:
   - Navigate to "APIs & Services" → "Library"
   - Search for "Google Calendar API"
   - Click "Enable"

4. Create OAuth 2.0 credentials:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth 2.0 Client ID"
   - Choose "Web application" as application type
   - Configure the OAuth consent screen if prompted

5. Add authorized redirect URIs:
   - Add your backend callback URL: `https://api.flightbook.com/schools/google-calendar/callback`
   - Note: We use a single redirect URI for all schools. The school ID is passed via the OAuth `state` parameter

6. Copy the **Client ID** and **Client Secret**

## Backend Environment Variables

Add the following environment variables to your `.env` file:

```bash
# Google OAuth Credentials (from Google Cloud Console)
GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret-here

# Backend API URL (where OAuth callbacks are received)
API_URL=https://api.flightbook.com

# Frontend URL (where users are redirected after OAuth)
INSTRUCTOR_APP_URL=https://instructor-app.flightbook.com
```

### Variable Descriptions

- **GOOGLE_CLIENT_ID**: Your Google OAuth 2.0 client ID (public, can be shared with frontend)
- **GOOGLE_CLIENT_SECRET**: Your Google OAuth 2.0 client secret (keep secure, backend only)
- **API_URL**: The base URL of your backend API
- **INSTRUCTOR_APP_URL**: The URL of your Instructor-App frontend

## Frontend Environment Variables

Add the following to your frontend environment configuration:

**File**: `/Flightbook-InstructorApp/src/environments/environment.ts`

```typescript
export const environment = {
  production: false,
  baseUrl: 'http://localhost:8282',
  googleClientId: 'your-client-id-here.apps.googleusercontent.com'
};
```

**File**: `/Flightbook-InstructorApp/src/environments/environment.prod.ts`

```typescript
export const environment = {
  production: true,
  baseUrl: 'https://api.flightbook.com',
  googleClientId: 'your-client-id-here.apps.googleusercontent.com'
};
```

## OAuth Flow

1. User clicks "Connect Google Calendar" in school settings
2. Frontend redirects to Google OAuth URL with backend callback
3. User authenticates and grants calendar permissions
4. Google redirects to backend: `GET /schools/:id/google-calendar/callback?code=AUTH_CODE`
5. Backend exchanges code for tokens and stores them encrypted
6. Backend redirects to frontend: `https://instructor-app.com/settings?google_calendar=success`
7. Frontend detects success and updates UI

## Database Migration

Run the migration to add the `google_calendar_event_id` column:

```bash
npm run migration:run
```

## Testing

After setup, test the integration:

1. Log in to Instructor-App as a school admin
2. Navigate to School Settings
3. Click "Connect Google Calendar"
4. Authenticate with Google
5. Verify connection status shows "Connected"
6. Create an appointment and check it appears in Google Calendar

## Security Notes

- OAuth tokens are stored encrypted in the database
- `GOOGLE_CLIENT_SECRET` must never be exposed to the frontend
- Each school authenticates with their own Google account
- Tokens are automatically refreshed before expiry

## Troubleshooting

### "Redirect URI mismatch" error
- Ensure the redirect URI in Google Cloud Console exactly matches: `{API_URL}/schools/google-calendar/callback`
- Check for trailing slashes

### "Invalid client" error
- Verify `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are correct
- Ensure the OAuth consent screen is configured

### Appointments not syncing
- Check backend logs for errors
- Verify the school has a valid Google Calendar connection
- Ensure tokens haven't expired (they auto-refresh)
