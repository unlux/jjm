# Admin Content Management System

This document describes the admin UI system for managing external database tables (blogs, hero slides, testimonials, offers, and affiliate coupons) directly from the Medusa Admin dashboard.

## Overview

All external tables stored in the `DRIZZLE_DATABASE_URL` database are now accessible and manageable through the Medusa Admin UI. The system provides full CRUD (Create, Read, Update, Delete) functionality for:

- **Blogs** - Blog posts with categories, authors, and content
- **Hero Slides** - Homepage carousel/slider images
- **Testimonials** - Customer testimonials with ratings
- **Offers** - Marquee banner offers/announcements
- **Affiliate Coupons** - Coupon usage tracking

## Architecture

### Database Schema (`/backend/src/db/schema/`)

All external table schemas have been consolidated into the backend:

- `affiliate-coupons.ts` - Coupon tracking table
- `blogs.ts` - Blog posts table
- `hero-slides.ts` - Hero slider images table
- `testimonials.ts` - Customer testimonials table
- `offers.ts` - Marquee offers table
- `index.ts` - Exports all schemas

These schemas are used by Drizzle ORM to interact with the external database.

### API Routes (`/backend/src/api/admin/`)

Each table has a dedicated API route with full CRUD operations:

#### `/admin/blogs`
- **GET** - List/search blogs (supports filtering by id, search term, category)
- **POST** - Create new blog
- **PUT** - Update existing blog (requires `?id=` query param)
- **DELETE** - Delete blog (requires `?id=` query param)

#### `/admin/hero-slides`
- **GET** - List slides (supports filtering by id, isForMobile)
- **POST** - Create new slide
- **PUT** - Update existing slide (requires `?id=` query param)
- **DELETE** - Delete slide (requires `?id=` query param)

#### `/admin/testimonials`
- **GET** - List testimonials (supports filtering by id, isFeatured)
- **POST** - Create new testimonial
- **PUT** - Update existing testimonial (requires `?id=` query param)
- **DELETE** - Delete testimonial (requires `?id=` query param)

#### `/admin/offers`
- **GET** - List offers (supports filtering by id, isActive)
- **POST** - Create new offer
- **PUT** - Update existing offer (requires `?id=` query param)
- **DELETE** - Delete offer (requires `?id=` query param)

#### `/admin/affiliate-coupons`
- **GET** - List coupons (supports filtering by code)
- **POST** - Create/update coupon (increments usage count if exists)

### Admin UI Pages (`/backend/src/admin/routes/content/`)

Each table has a beautiful, functional admin page:

#### Blogs Page (`/content/blogs`)
Features:
- List all blogs in a table view
- Create new blogs with full form (title, category, author, content, etc.)
- Edit existing blogs
- Delete blogs with confirmation
- Search and filter capabilities

#### Hero Slides Page (`/content/hero-slides`)
Features:
- List all slides ordered by sort order
- Create new slides with image URL, alt text, link, duration
- Toggle mobile-only flag
- Edit existing slides
- Delete slides with confirmation
- Sort order management

#### Testimonials Page (`/content/testimonials`)
Features:
- List all testimonials ordered by sort order
- Create new testimonials with quote, author, role, rating
- Toggle featured flag
- Edit existing testimonials
- Delete testimonials with confirmation
- Visual rating display (stars)

#### Offers Page (`/content/offers`)
Features:
- List all offers ordered by sort order
- Create new offers with message and optional link
- Toggle active/inactive status
- Edit existing offers
- Delete offers with confirmation
- Visual status indicators

#### Affiliate Coupons Page (`/content/affiliate-coupons`)
Features:
- List all coupons with usage statistics
- Add new coupons or increment existing usage counts
- View creation and update timestamps
- Read-only display (no delete to preserve tracking data)

## Access in Admin Dashboard

After starting your Medusa backend, navigate to the admin dashboard. You'll find a new "Content" section in the sidebar with the following pages:

- Blogs
- Hero Slides
- Testimonials
- Offers
- Affiliate Coupons

## Technical Details

### Database Connection
The system uses the existing Drizzle connection configured in `/backend/src/lib/drizzle.ts`, which connects to `DRIZZLE_DATABASE_URL` (or falls back to `DATABASE_URL`).

### State Management
- Uses `@tanstack/react-query` for data fetching and caching
- Automatic cache invalidation after mutations
- Optimistic UI updates with loading states

### UI Components
All pages use official Medusa UI components from `@medusajs/ui`:
- `Container`, `Heading` - Layout
- `Table` - Data display
- `Input`, `Label`, `Textarea`, `Switch` - Form controls
- `Button` - Actions
- `toast` - Notifications

### Form Validation
- Required fields are enforced
- Type validation (numbers, dates)
- Client-side validation before submission

## Usage Examples

### Creating a Blog Post
1. Navigate to "Blogs" in the admin sidebar
2. Click "Create Blog"
3. Fill in all required fields (ID, title, category, author, etc.)
4. Click "Create"
5. Blog will appear in the list immediately

### Managing Hero Slides
1. Navigate to "Hero Slides"
2. Create slides with different sort orders
3. Toggle "Mobile Only" for responsive designs
4. Set custom durations for each slide
5. Slides will be ordered by sort order in the list

### Tracking Affiliate Coupons
1. Navigate to "Affiliate Coupons"
2. Click "Add/Update Coupon"
3. Enter coupon code and usage count to add
4. If coupon exists, usage count will be incremented
5. View all coupons with their usage statistics

## Notes

- All IDs are slugs (text) for SEO-friendly URLs
- Timestamps are automatically managed
- Sort orders allow custom ordering of items
- Boolean flags (isActive, isFeatured, isForMobile) provide filtering options
- All operations include error handling with user-friendly toast notifications
- Delete operations require confirmation to prevent accidental data loss

## Future Enhancements

Potential improvements:
- Bulk operations (delete multiple items)
- Image upload integration
- Rich text editor for blog content
- Drag-and-drop reordering
- Export/import functionality
- Advanced search and filtering
- Pagination for large datasets
