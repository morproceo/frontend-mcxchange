# MC Exchange - Motor Carrier Authority Marketplace

A modern, trust-based marketplace for buying and selling motor carrier (MC) authorities with a beautiful glass morphism design.

## Overview

MC Exchange is the first trusted exchange platform specifically built for trading carrier authorities. It provides:

- **Verified Trust Scores** - Every MC is scored and verified with compliance data
- **Complete Documentation** - Access to full history, safety records, and insurance
- **Secure Escrow** - Protected transactions with built-in escrow services
- **Reputation System** - Build your profile through verified deals and reviews

## Features

### For Sellers
- Create detailed MC listings with documentation
- Trust score and verification badges
- Offer management and negotiation tools
- Real-time analytics and views tracking
- Multi-step listing creation with document upload

### For Buyers
- Browse verified MC authorities with advanced filtering
- Save and compare listings
- Make offers with escrow protection
- Unlock detailed information on listings
- Track offer status and negotiations

### For Admins
- Moderate and verify new listings
- Review reported items
- User management tools
- Platform analytics and insights

## Tech Stack

- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first styling with glass morphism
- **Framer Motion** - Smooth animations
- **Lucide React** - Beautiful icon library
- **date-fns** - Date formatting utilities

## Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

Dependencies are already installed. If you need to reinstall:

\`\`\`bash
npm install
\`\`\`

### Development

Start the development server:

\`\`\`bash
npm run dev
\`\`\`

The application will be available at `http://localhost:5173`

### Build for Production

\`\`\`bash
npm run build
\`\`\`

### Preview Production Build

\`\`\`bash
npm run preview
\`\`\`

## Project Structure

\`\`\`
mc-xchange/
├── src/
│   ├── components/          # Reusable components
│   │   ├── ui/             # Design system components
│   │   │   ├── GlassCard.tsx
│   │   │   ├── TrustBadge.tsx
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   └── ...
│   │   ├── MCCard.tsx      # Listing card component
│   │   ├── Navbar.tsx      # Navigation bar
│   │   └── ProtectedRoute.tsx
│   │
│   ├── context/            # React context providers
│   │   └── AuthContext.tsx # Authentication state
│   │
│   ├── layouts/            # Layout components
│   │   └── MainLayout.tsx
│   │
│   ├── pages/              # Page components
│   │   ├── HomePage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   ├── MarketplacePage.tsx
│   │   ├── MCDetailPage.tsx
│   │   ├── SellerDashboard.tsx
│   │   ├── CreateListingPage.tsx
│   │   ├── BuyerDashboard.tsx
│   │   ├── AdminDashboard.tsx
│   │   └── ProfilePage.tsx
│   │
│   ├── types/              # TypeScript type definitions
│   │   └── index.ts
│   │
│   ├── utils/              # Utility functions
│   │   └── mockData.ts     # Mock data for development
│   │
│   ├── App.tsx             # Main app component with routing
│   ├── main.tsx            # Application entry point
│   └── index.css           # Global styles and Tailwind
│
├── public/                 # Static assets
├── index.html              # HTML template
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite configuration
├── tailwind.config.js      # Tailwind CSS configuration
└── postcss.config.js       # PostCSS configuration
\`\`\`

## User Roles

### Seller
- List MC authorities for sale
- Manage listings and offers
- Build reputation through deals
- Access: `/seller/dashboard`, `/seller/create-listing`

### Buyer
- Browse and search the marketplace
- Save listings and make offers
- View detailed MC information
- Access: `/buyer/dashboard`, `/marketplace`

### Admin
- Verify new listings
- Moderate reported content
- Manage users and platform
- Access: `/admin/dashboard`

## Key Components

### Glass Morphism Design System

The application uses a custom glass morphism design with:
- Frosted glass effects with backdrop blur
- Subtle borders and transparency layers
- Smooth hover animations
- Luminous accent colors

### Trust Badge System

Visual representation of trust levels:
- **High Trust** (80+) - Green badge
- **Medium Trust** (50-79) - Yellow badge
- **Low Trust** (<50) - Red badge

### MC Trust Cards

Each listing displays:
- Trust score and verification status
- Key metrics (years active, fleet size, safety rating)
- Operation types
- Price and engagement stats
- Quick actions (save, view details)

## Authentication

The app includes a mock authentication system. Use any email/password to login:

1. Select your role (Buyer, Seller, or Admin)
2. Enter any email and password
3. You'll be redirected to the appropriate dashboard

## Mock Data

The application includes mock data for development:
- 6 sample MC listings
- 2 seller profiles
- Sample offers and reviews

To modify mock data, edit `src/utils/mockData.ts`

## Features In Detail

### Marketplace Filtering
- Search by MC number, title, or description
- Filter by price range
- Filter by years active
- Filter by trust level
- Filter by verification status
- Sort by multiple criteria

### Listing Creation
- 3-step wizard flow
- Basic information
- Authority details with operation types
- Document upload interface

### Unlockable Details
- Public preview of listings
- Locked detailed information
- Unlock to view full MC data and documents
- Contact seller after unlocking

### Offer Management
- Make offers on listings
- Counter-offer system
- Offer expiration tracking
- Status indicators (pending, accepted, countered)

## Design Philosophy

### Glass Aesthetic
- Clean, transparent, and professional
- Conveys trust and clarity
- Modern frosted glass panels
- Floating card designs
- Soft gradients and subtle lighting

### Color System
- **Primary Blue** - Trust and professionalism
- **Trust Green** - High trust indicators
- **Warning Yellow** - Pending/Medium trust
- **Danger Red** - Low trust/Critical items
- **Purple Accents** - Premium features

## Future Enhancements

- Real backend API integration
- Live chat between buyers and sellers
- Escrow payment integration
- Document verification automation
- Email notifications
- Mobile app version
- Advanced analytics dashboard
- Multi-language support

## Development Notes

### Adding New Pages

1. Create the page component in `src/pages/`
2. Add the route in `src/App.tsx`
3. Add navigation links where needed

### Styling Guidelines

- Use Tailwind utility classes
- Apply glass morphism with `.glass`, `.glass-strong`, or `.glass-subtle`
- Use the color system defined in `tailwind.config.js`
- Animations should use Framer Motion for consistency

### Type Safety

All components use TypeScript. Key types are defined in `src/types/index.ts`:
- `User` - User account information
- `MCListing` - Listing details
- `Offer` - Offer information
- `Review` - Review/rating data

## Support

For questions or issues, refer to the project documentation or contact the development team.

## License

Version 2 for morpro360

---

Built with ❤️ for the trucking industry
