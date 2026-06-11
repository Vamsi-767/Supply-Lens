# Inventory Management System - Frontend

React + Vite frontend application for Inventory Management System

## Development Setup

### Prerequisites
- Node.js 18.x or higher
- npm or yarn

### Installation

```bash
cd frontend
npm install
```

### Environment Configuration

Create `.env.local` for development:
```
VITE_API_URL=http://localhost:8080/api
```

### Running Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Building for Production

```bash
npm run build
```

## Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard:
   - `VITE_API_URL`: Your Railway backend URL (e.g., `https://your-app.up.railway.app/api`)

4. Deploy:
```bash
vercel deploy
```

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| VITE_API_URL | Backend API endpoint | `http://localhost:8080/api` (dev) or `https://your-api.railway.app/api` (prod) |
| VITE_APP_NAME | Application name | Inventory Management System |
| VITE_APP_VERSION | App version | 1.0.0 |

## API Integration

The API service is configured in `src/services/api.js` and includes:
- Axios instance with base URL from environment
- JWT token management
- Request/response interceptors
- Error handling

### Using API Service

```javascript
import { apiCall } from '@/services/api';

// GET request
const data = await apiCall.get('/products');

// POST request
const response = await apiCall.post('/products', {
  name: 'Product Name',
  price: 100
});

// Error handling
try {
  const data = await apiCall.get('/products');
} catch (error) {
  console.error('API Error:', error.message);
}
```

## Project Structure

```
frontend/
├── src/
│   ├── components/       # Reusable React components
│   ├── pages/           # Page components (routes)
│   ├── services/        # API service and utilities
│   ├── hooks/           # Custom React hooks
│   ├── context/         # React Context for state management
│   ├── utils/           # Utility functions
│   └── main.jsx         # Entry point
├── public/              # Static files
├── index.html           # HTML template
├── vite.config.js       # Vite configuration
├── vercel.json          # Vercel deployment config
├── .env.local           # Development environment variables
├── .env.production      # Production environment variables
└── package.json         # Dependencies
```

## Troubleshooting

### API Connection Issues
- Ensure backend is running and accessible
- Check CORS configuration on backend
- Verify API URL in `.env.local` or Vercel dashboard

### Build Errors
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf dist && npm run build`

## Support

For issues related to the frontend, please check:
1. Environment variables are set correctly
2. Backend is running and accessible
3. Browser console for error messages
