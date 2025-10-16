# Conexión Rural 360° - Full Stack Web Application

## Overview

This is a full-stack web application for "Conexión Rural 360°", a project focused on transforming rural communities through technology, education, and sustainable development. The application is built using modern web technologies with a React frontend and Express.js backend, featuring a comprehensive UI component library and database integration.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a monorepo structure with separate client and server directories, sharing common code through a shared folder. It uses a modern full-stack architecture with the following key characteristics:

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized production builds
- **UI Framework**: Shadcn/UI components built on top of Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Style**: RESTful API with `/api` prefix for all routes
- **Development**: Hot reloading with tsx and Vite middleware integration

### Database Layer
- **ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL (configured for Neon Database)
- **Migrations**: Drizzle Kit for schema migrations
- **Schema Location**: Shared between client and server in `/shared/schema.ts`

## Key Components

### Frontend Components
1. **UI Component Library**: Comprehensive set of reusable components from Shadcn/UI including:
   - Form controls (Button, Input, Select, Checkbox, etc.)
   - Layout components (Card, Dialog, Sheet, Tabs, etc.)
   - Data display (Table, Toast, Progress, etc.)
   - Navigation components (Navbar, Breadcrumb, Pagination, etc.)

2. **Pages**: 
   - Home page with rural project information
   - 404 Not Found page
   - Responsive design with mobile-first approach

3. **Custom Hooks**: 
   - `useIsMobile` for responsive design
   - `useToast` for notification management

### Backend Components
1. **Storage Layer**: Abstracted storage interface with in-memory implementation
2. **Route Registration**: Centralized route management system
3. **Middleware**: Request logging and error handling
4. **Development Tools**: Vite integration for SSR and HMR in development

### Database Schema
- **Users Table**: Basic user management with username/password authentication
- **Type Safety**: Zod schemas for validation and type inference
- **Insert Schemas**: Separate schemas for data insertion operations

## Data Flow

1. **Client Requests**: Frontend makes API calls using fetch with credentials
2. **Query Management**: TanStack Query handles caching, background updates, and loading states
3. **API Layer**: Express.js routes process requests and interact with storage
4. **Data Storage**: Drizzle ORM provides type-safe database operations
5. **Response Handling**: Standardized error handling and JSON responses

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Neon Database PostgreSQL driver
- **@tanstack/react-query**: Server state management
- **drizzle-orm**: Type-safe ORM
- **wouter**: Lightweight routing
- **zod**: Schema validation

### UI Dependencies
- **@radix-ui/***: Headless UI components
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Component variant management
- **lucide-react**: Icon library

### Development Dependencies
- **vite**: Build tool and dev server
- **typescript**: Type checking
- **tsx**: TypeScript execution
- **esbuild**: Fast bundling for production

## Deployment Strategy

### Development
- **Dev Server**: Vite dev server with Express.js middleware integration
- **Hot Reloading**: Automatic refresh for both client and server changes
- **Type Checking**: Continuous TypeScript checking

### Production Build
1. **Client Build**: Vite builds optimized React application to `dist/public`
2. **Server Build**: esbuild bundles server code to `dist/index.js`
3. **Static Assets**: Served from the built client directory
4. **Environment**: Production mode with optimized settings

### Database Management
- **Migrations**: `db:push` command for schema synchronization
- **Environment Variables**: `DATABASE_URL` required for database connection
- **Connection Pooling**: Configured through Neon Database serverless driver

### Key Features
- **Interactive Design**: Advanced animations, hover effects, and smooth transitions
- **Real-time Statistics**: Animated counters showing project impact metrics
- **Progress Tracking**: Interactive progress bars for project phases
- **Modern UI Elements**: Gradient backgrounds, badges, and animated components
- **Responsive Design**: Mobile-first approach with breakpoint-specific styling
- **Accessibility**: ARIA compliance through Radix UI components
- **SEO Optimization**: Proper meta tags and semantic HTML structure
- **Error Handling**: Comprehensive error boundaries and API error management
- **Performance**: Code splitting, lazy loading, and optimized builds

### Recent Updates (January 2025)
- Enhanced hero section with floating statistics cards and animated background elements
- Added interactive feature cards with expandable details and progress indicators
- Implemented animated project phases with circular progress rings and status badges
- Created interactive gallery with hover effects, play buttons, and navigation dots
- Enhanced contact section with quick contact form and animated contact cards
- Added comprehensive CSS animations including fade-in, slide-up, pulse-glow, and float effects
- Improved footer with social links and enhanced branding

### Recent Logo and Image Integration (July 2025)
- Integrated official "Conexión Rural 360" logo throughout the application (navigation and footer)
- Updated interactive gallery section with 11 real project images showing:
  - Territorial mapping workshops with students
  - Community murals and artistic expressions
  - Educational facilities and rural contexts
  - Research team activities and meetings
  - Content development sessions
  - Academic presentations and community engagement
- Enhanced location cards with background images for visual context
- Added team section photo showing actual research team members
- Maintained 6-item gallery layout while expanding content to 11 items with authentic project documentation