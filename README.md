# PropRent - Property Rental Platform

A modern, full-featured property rental application built with Next.js, React, and MongoDB. PropRent enables users to browse, list, and rent properties with ease. The platform supports multiple user roles (Admin, Owner, Tenant) with customized dashboards, secure authentication, and integrated payment processing.

# Live url - https://property-rent-client.vercel.app

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [Running the Application](#running-the-application)
- [Environment Variables](#environment-variables)
- [Key Features](#key-features)
- [User Roles & Permissions](#user-roles--permissions)
- [Project Architecture](#project-architecture)
- [API Routes](#api-routes)
- [Components](#components)
- [Styling & Design](#styling--design)
- [Authentication](#authentication)
- [Payment Integration](#payment-integration)
- [Deployment](#deployment)
- [Contributing](#contributing)

## ✨ Features

### General Features
- 🏠 Browse all available properties with detailed information
- 🔍 View popular cities and recent property listings
- 📱 Responsive design for mobile, tablet, and desktop
- 🔐 Secure user authentication with multi-role support
- 🌟 Customer reviews and ratings display
- 📊 Rental statistics and analytics
- 🔗 Google OAuth integration for social authentication
- 💳 Stripe payment integration for bookings
- 🎨 Smooth animations and transitions
- 🔔 Toast notifications for user feedback

### Owner/Landlord Features
- ➕ Add new properties to the platform
- 📋 View and manage all listed properties
- 📅 Track and manage booking requests
- 👤 Profile management and account settings
- 📊 Property analytics and statistics
- ✏️ Edit and delete property listings

### Tenant Features
- ❤️ Save properties to favorites
- 📅 View and manage bookings
- 👤 Profile management
- 🔍 Browse all available properties
- 💬 View property details and reviews
- 💳 Complete booking transactions

### Admin Features
- 👥 Manage user accounts
- 🏢 Manage property listings
- 📊 View platform statistics
- 👤 Profile management
- 🔧 System administration tools

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js 16.2.9](https://nextjs.org/) - React-based framework with server-side rendering
- **React**: 19.2.4 - Latest React with concurrent rendering
- **Styling**:
  - [Tailwind CSS 4](https://tailwindcss.com/) - Utility-first CSS framework
  - [Styled Components 6.4.2](https://styled-components.com/) - CSS-in-JS styling
  - [PostCSS 4](https://postcss.org/) - CSS transformation
- **UI Components**: 
  - [HeroUI 3.2.1](https://www.heroui.com/) - Beautiful React component library
  - [Gravity UI Icons 2.18.0](https://www.gravity-ui.com/) - Icon library

### Backend & Database
- **Database**: [MongoDB 7.3.0](https://www.mongodb.com/) - NoSQL database
- **Authentication**: 
  - [Better Auth 1.6.20](https://better-auth.vercel.app/) - Simple authentication framework
  - [MongoDB Adapter 1.6.20](https://better-auth.vercel.app/) - MongoDB integration for Better Auth
  - JWT (JSON Web Tokens) - For session management

### Payment Processing
- [Stripe 22.2.2](https://stripe.com/) - Payment processing and checkout
- [@stripe/stripe-js 9.8.0](https://stripe.com/docs/js) - Stripe JavaScript library

### Animation & Effects
- [Framer Motion 12.40.0](https://www.framer.com/motion/) - React animation library
- [Animate.css 4.1.1](https://animate.style/) - Pre-built CSS animations

### Data Visualization
- [Recharts 3.8.1](https://recharts.org/) - Composable charting library

### User Notifications
- [React Toastify 11.1.0](https://fkhadra.github.io/react-toastify) - Toast notifications

### Development Tools
- **Compiler**: 
  - [React Compiler (Babel Plugin 1.0.0)](https://react.dev/compiler) - React experimental compiler
  - [ESLint 9](https://eslint.org/) - JavaScript linter
  - [ESLint Config Next 16.2.9](https://nextjs.org/docs/app/building-your-application/configuring/eslint) - Next.js ESLint configuration

## 📁 Project Structure

```
proprent-client/
├── src/
│   ├── app/                           # Next.js app directory (App Router)
│   │   ├── api/                       # API routes
│   │   │   ├── auth/[...all]/         # Dynamic authentication routes
│   │   │   └── checkout_sessions/     # Stripe checkout routes
│   │   ├── authentication/            # Auth pages
│   │   │   ├── login/                 # Login page
│   │   │   └── signup/                # Signup page
│   │   ├── dashboard/                 # Role-based dashboards
│   │   │   ├── admin/                 # Admin dashboard
│   │   │   │   ├── profile/           # Admin profile
│   │   │   │   ├── properties/        # Property management
│   │   │   │   └── users/             # User management
│   │   │   ├── owner/                 # Owner/Landlord dashboard
│   │   │   │   ├── add-properties/    # Add new property
│   │   │   │   ├── my-properties/     # View owned properties
│   │   │   │   ├── owner-bookings/    # Manage bookings
│   │   │   │   └── profile/           # Owner profile
│   │   │   ├── tenant/                # Tenant dashboard
│   │   │   │   ├── my-bookings/       # View bookings
│   │   │   │   └── profile/           # Tenant profile
│   │   │   └── layout.jsx             # Dashboard layout with sidebar
│   │   ├── allproperties/             # Browse all properties
│   │   │   ├── page.jsx               # Properties listing
│   │   │   └── [id]/                  # Individual property detail
│   │   ├── services/                  # Services page
│   │   ├── success/                   # Payment success page
│   │   ├── layout.js                  # Root layout
│   │   ├── page.js                    # Home page
│   │   ├── globals.css                # Global styles
│   │   └── not-found.jsx              # 404 page
│   ├── assets/                        # Static assets (images, etc.)
│   ├── component/                     # Reusable React components
│   │   ├── BannerSection.jsx          # Hero banner component
│   │   ├── CustomerReview.jsx         # Customer reviews section
│   │   ├── EditModal.jsx              # Edit modal component
│   │   ├── Footer.jsx                 # Footer component
│   │   ├── Navbar.jsx                 # Navigation bar
│   │   ├── NavLink.jsx                # Navigation links
│   │   ├── PopulerCity.jsx            # Popular cities section
│   │   ├── RecentProp.jsx             # Recent properties section
│   │   ├── RentalStatistics.jsx       # Statistics display
│   │   └── WhyChooseSection.jsx       # Why choose us section
│   └── lib/                           # Utility functions and configurations
│       ├── auth.js                    # Authentication configuration
│       ├── auth-client.js             # Client-side auth utilities
│       └── stripe.js                  # Stripe configuration
├── public/                            # Public static files
├── next.config.mjs                    # Next.js configuration
├── tailwind.config.js                 # Tailwind CSS configuration
├── postcss.config.mjs                 # PostCSS configuration
├── eslint.config.mjs                  # ESLint configuration
├── jsconfig.json                      # JavaScript path aliases
├── package.json                       # Project dependencies
├── AGENTS.md                          # AI agent configuration
└── README.md                          # This file
```

## ⚙️ Installation & Setup

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** or **yarn** package manager
- **MongoDB** (local or cloud instance via MongoDB Atlas)
- **Stripe Account** (for payment processing)
- **Google OAuth Credentials** (for social authentication)

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd proprent-client
```

### Step 2: Install Dependencies
```bash
npm install
# or
yarn install
```

### Step 3: Set Up Environment Variables
Create a `.env.local` file in the root directory with the following variables:

```env
# MongoDB Configuration
PropRentClient_URL=mongodb+srv://username:password@cluster.mongodb.net/PropRentClient?retryWrites=true&w=majority

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Better Auth Configuration (Optional)
BETTER_AUTH_SECRET=your_random_secret_key
BETTER_AUTH_URL=http://localhost:3000
```

### Step 4: Configure MongoDB
- Set up a MongoDB database (local or MongoDB Atlas cloud)
- Update `PropRentClient_URL` with your connection string
- The database name should be `PropRentClient`

### Step 5: Set Up Stripe
1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Get your API keys from the Stripe dashboard
3. Add them to your `.env.local` file

### Step 6: Set Up Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials (Web application)
5. Add authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`
6. Add your credentials to `.env.local`

## 🚀 Running the Application

### Development Mode
```bash
npm run dev
```
The application will start on [http://localhost:3000](http://localhost:3000)

Open your browser and navigate to the development server. The page will auto-update when you make changes.

### Production Build
```bash
npm run build
npm run start
```

### Linting
```bash
npm run lint
```

## 🔐 Environment Variables

| Variable | Purpose | Example |
|----------|---------|---------|
| `PropRentClient_URL` | MongoDB connection string | `mongodb+srv://...` |
| `STRIPE_SECRET_KEY` | Stripe secret API key | `sk_test_...` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe public key | `pk_test_...` |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | `xxx.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | Google OAuth secret | `GOCSPX-...` |

## 🎯 Key Features Explained

### Multi-Role Authentication System
The platform supports three user roles with different permissions:

**Admin**
- Manage user accounts
- Moderate property listings
- View platform-wide statistics
- System administration

**Owner/Landlord**
- Create and manage property listings
- View tenant booking requests
- Manage availability and pricing
- Track earnings and analytics

**Tenant**
- Browse and search properties
- Save favorite properties
- Book properties
- Manage personal bookings
- Leave reviews

### Property Management
- Owners can add properties with details, images, and pricing
- Properties display with rich information and customer reviews
- Search and filter functionality
- Popular cities showcase
- Recent property listings on homepage

### Booking System
- Secure booking flow with validation
- Stripe integration for payment processing
- Booking confirmation and tracking
- Owner notification system
- Tenant booking history

### Dashboard Interface
- Role-specific sidebars with navigation menus
- Mobile-responsive design with hamburger menu
- Real-time session management
- Protected routes requiring authentication
- Loading states and error handling

## 👥 User Roles & Permissions

### Admin Dashboard
```
/dashboard/admin/
  ├── Overview
  ├── Users Management
  ├── Properties Management
  └── Profile
```

### Owner Dashboard
```
/dashboard/owner/
  ├── Overview
  ├── Add Properties
  ├── My Properties
  ├── Bookings
  └── Profile
```

### Tenant Dashboard
```
/dashboard/tenant/
  ├── Overview
  ├── Saved Properties
  ├── My Bookings
  └── Profile
```

## 🏗️ Project Architecture

### Frontend Architecture
- **App Router**: Next.js 16 uses the modern App Router (in `src/app/`)
- **Component-Based**: Reusable React components in `src/component/`
- **Client-Side State**: React hooks and authentication context
- **Server-Side Rendering**: Some pages use Next.js SSR for better performance

### Authentication Flow
1. User signs up or logs in via email or Google OAuth
2. Better Auth creates a session with JWT
3. Session stored in MongoDB
4. Client-side `authClient` manages session state
5. Protected routes check authentication before rendering
6. Role-based access control (RBAC) determines dashboard access

### Data Flow
```
User Action → Component → API Route → MongoDB
                 ↓
         Response (JSON)
                 ↓
             State Update
                 ↓
          UI Re-render
```

## 🔗 API Routes

### Authentication Routes
- `/api/auth/[...all]` - Dynamic authentication endpoints
  - Sign up
  - Login
  - Sign out
  - Google OAuth callback

### Payment Routes
- `/api/checkout_sessions` - Create Stripe checkout sessions

## 🧩 Components

| Component | Purpose | Location |
|-----------|---------|----------|
| `Navbar` | Navigation header | `component/Navbar.jsx` |
| `Footer` | Footer component | `component/Footer.jsx` |
| `BannerSection` | Hero banner | `component/BannerSection.jsx` |
| `RecentProp` | Recent properties display | `component/RecentProp.jsx` |
| `PopulerCity` | Popular cities showcase | `component/PopulerCity.jsx` |
| `CustomerReview` | Review section | `component/CustomerReview.jsx` |
| `WhyChooseSection` | Value proposition | `component/WhyChooseSection.jsx` |
| `RentalStatistics` | Statistics display | `component/RentalStatistics.jsx` |
| `EditModal` | Property/profile edit modal | `component/EditModal.jsx` |
| `NavLink` | Custom navigation link | `component/NavLink.jsx` |

## 🎨 Styling & Design

### Tailwind CSS 4
- Utility-first CSS framework
- Responsive design with breakpoints
- Dark mode support (configurable)
- Custom theme colors (orange and blue gradient for branding)

### Styled Components
- CSS-in-JS for component-scoped styling
- Dynamic styling based on props
- Server-side rendering support

### Animations
- **Framer Motion**: For complex React animations
- **Animate.css**: For pre-built CSS animations
- Smooth page transitions
- Element entrance animations

### Design System
- **Color Scheme**: Orange (#ef8e38) and Blue (#108dc7) gradient
- **Font**: Roboto font family
- **Spacing**: Consistent padding and margins
- **Components**: HeroUI components for consistency

## 🔐 Authentication

### Features
- Email and password authentication
- Google OAuth integration
- JWT-based sessions
- MongoDB session persistence
- Client-side session management
- Role-based access control (RBAC)
- Protected routes and endpoints

### Better Auth Configuration
```javascript
- Email & Password: Enabled
- Database: MongoDB with dedicated adapter
- Social Providers: Google OAuth
- Plugins: JWT for token-based auth
```

## 💳 Payment Integration

### Stripe Integration
- Product and pricing management
- Checkout session creation
- Payment processing
- Webhook handling (optional)
- Success/failure handling

### Checkout Flow
1. User initiates booking
2. API creates Stripe checkout session
3. User redirected to Stripe Checkout
4. Payment processing
5. Success page on completion
6. Booking confirmed in database

## 🚀 Deployment

### Deployment Options

#### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```
- Zero-config deployment
- Automatic CI/CD
- Edge Functions for APIs
- Environment variables support

#### Other Platforms
- **Netlify**: Supports Next.js deployments
- **AWS Amplify**: AWS-based hosting
- **Docker**: Containerized deployment
- **Custom VPS**: Self-hosted option

### Pre-deployment Checklist
- [ ] All environment variables configured
- [ ] MongoDB connection verified
- [ ] Stripe keys configured
- [ ] Google OAuth redirect URIs updated
- [ ] Build succeeds (`npm run build`)
- [ ] No linting errors (`npm run lint`)
- [ ] Environment-specific configs updated

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/YourFeature`
3. **Commit your changes**: `git commit -m 'Add YourFeature'`
4. **Push to the branch**: `git push origin feature/YourFeature`
5. **Open a Pull Request**

### Development Guidelines
- Follow ESLint rules
- Write descriptive commit messages
- Test changes locally before pushing
- Update documentation for new features
- Keep components reusable and modular

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Better Auth Docs](https://better-auth.vercel.app/)
- [Stripe Documentation](https://stripe.com/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [HeroUI Components](https://www.heroui.com/)

## 📞 Support & Contact

For questions, issues, or suggestions:
1. Check existing GitHub issues
2. Create a new issue with detailed description
3. Contact the development team

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Version**: 0.1.0  
**Last Updated**: 2026-06-24  
**Status**: In Active Development
