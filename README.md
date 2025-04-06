# StreamIt - Lyric Generation App

A Next.js application for generating and streaming lyrics using various AI models.

## Current Status

🚨 **IMPORTANT**: The authentication system is currently not working. The application is unable to properly redirect to AWS Cognito for sign-in/sign-up. The main issues are:

1. Authentication redirects are failing with DNS errors
2. The application is trying to use an incorrect Cognito domain
3. The sign-up flow is not properly distinguishing between sign-in and sign-up

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── anthropic/     # Anthropic API endpoints
│   │   ├── deepgram/      # Deepgram API endpoints
│   │   ├── openai/        # OpenAI API endpoints
│   │   └── replicate/     # Replicate API endpoints
│   ├── auth/              # Authentication pages
│   │   ├── signin/        # Sign-in page
│   │   └── signup/        # Sign-up page
│   ├── components/        # React components
│   └── lib/               # Shared utilities
│       ├── contexts/      # React contexts
│       ├── firebase/      # Firebase configuration
│       └── hooks/         # Custom React hooks
```

## Development Setup

### Prerequisites

- Node.js 18+
- npm or yarn
- AWS Account with Cognito User Pool
- API keys for:
  - OpenAI
  - Anthropic
  - Replicate
  - Deepgram

### Environment Variables

Create the following environment files:

#### .env.local (Development)
```
NEXT_PUBLIC_AWS_REGION=us-east-1
NEXT_PUBLIC_COGNITO_USER_POOL_ID=your-user-pool-id
NEXT_PUBLIC_COGNITO_CLIENT_ID=your-client-id
NEXT_PUBLIC_COGNITO_DOMAIN=your-cognito-domain
NEXT_PUBLIC_REDIRECT_SIGN_IN=http://localhost:3000
NEXT_PUBLIC_REDIRECT_SIGN_OUT=http://localhost:3000/auth/signin

# API Keys
OPENAI_API_KEY=your-openai-key
ANTHROPIC_API_KEY=your-anthropic-key
REPLICATE_API_KEY=your-replicate-key
DEEPGRAM_API_KEY=your-deepgram-key
```

#### .env.production (Production)
```
NEXT_PUBLIC_AWS_REGION=us-east-1
NEXT_PUBLIC_COGNITO_USER_POOL_ID=us-east-1_3DG3dS2Yu
NEXT_PUBLIC_COGNITO_CLIENT_ID=1zrft632t0j7lnn9onijed8vb0
NEXT_PUBLIC_COGNITO_DOMAIN=us-east-13dg3ds2yu.auth.us-east-1.amazoncognito.com
NEXT_PUBLIC_REDIRECT_SIGN_IN=https://streamit2.me
NEXT_PUBLIC_REDIRECT_SIGN_OUT=https://streamit2.me/auth/signin

# API Keys
OPENAI_API_KEY=your-openai-key
ANTHROPIC_API_KEY=your-anthropic-key
REPLICATE_API_KEY=your-replicate-key
DEEPGRAM_API_KEY=your-deepgram-key
```

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Production Deployment

The application is deployed to AWS S3 and served through CloudFront.

### Build and Deploy

```bash
# Build the application
npm run build

# Deploy to S3
aws s3 sync out/ s3://ezzye-lyricai-n9
```

## Known Issues

1. **Authentication Issues**
   - DNS errors when redirecting to Cognito
   - Incorrect domain being used (`lyrical-t3imlf.auth.us-east-1.amazoncognito.com` instead of `us-east-13dg3ds2yu.auth.us-east-1.amazoncognito.com`)
   - Sign-up flow not properly distinguishing between sign-in and sign-up

2. **Environment Configuration**
   - Production environment variables not being properly loaded during build
   - Hardcoded values in some configuration files

3. **Next.js Export Issues**
   - Warnings about rewrites not working with "output: export"
   - Static generation limitations with edge runtime

## Next Steps

1. Fix authentication issues:
   - Verify Cognito User Pool configuration
   - Ensure correct domain is being used
   - Implement proper sign-up flow
   - Add error handling for authentication failures

2. Environment configuration:
   - Review environment variable loading
   - Remove hardcoded values
   - Implement proper configuration validation

3. Build and deployment:
   - Address Next.js export warnings
   - Optimize static generation
   - Implement proper caching strategy

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.