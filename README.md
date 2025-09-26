# AliExpress Affiliate Website

A React + TailwindCSS affiliate website for managing and displaying AliExpress products with a separate admin panel for XLSX file uploads.

## Features

### Admin Panel (`/admin`)
- Upload AliExpress XLSX files
- Parse and deduplicate products by ProductId
- Add new products to existing inventory
- Delete individual products
- Delete all products
- Real-time notifications for all actions

### Home Page (`/`)
- Clean, customer-focused design
- Responsive product grid (3-4 per row on desktop, 1 per row on mobile)
- Product cards with:
  - Product images with fallback
  - Product descriptions
  - Original and discount prices with percentage off
  - "Buy Now" affiliate buttons
  - Commission rates, ratings, and coupon info
  - Optional video buttons
- Product count display
- Smooth hover effects and transitions

### State Management
- React useState for product management
- LocalStorage persistence (products persist after page reload)
- Real-time updates between admin and home pages
- React Router for navigation

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Usage

### Admin Panel (`/admin`)
1. Navigate to the admin panel using the navigation menu
2. Upload an XLSX file with product data
3. The system will automatically:
   - Parse the Excel file
   - Check for required columns
   - Deduplicate products by ProductId
   - Add new products to the inventory
4. Manage products by deleting individual items or clearing all

### Home Page (`/`)
- View all uploaded products in a responsive grid
- Click "Buy Now" to visit affiliate links
- Watch product videos if available
- Clean, customer-focused experience

## Required Excel Columns

Your XLSX file must include these columns:
- **ProductId** (required) - Unique identifier
- **Image Url** (required) - Product image URL
- **Product Desc** (required) - Product description
- **Promotion Url** (required) - Affiliate link

Optional columns:
- **Origin Price** - Original price
- **Discount Price** - Sale price
- **Commission Rate** - Commission percentage
- **Positive Feedback** - Rating percentage
- **Coupon Info** - Coupon code/info
- **Video Url** - Product video URL

## Sample Data

Use the included `sample-products.csv` file as a reference for the expected data format. You can convert this to XLSX format for testing.

## Technologies Used

- React 18
- React Router DOM
- TailwindCSS
- XLSX library for Excel parsing
- LocalStorage for data persistence

## Project Structure

```
src/
├── components/
│   ├── AdminPanel.js      # Admin interface for product management
│   ├── HomePage.js        # Public product display page
│   ├── ProductCard.js     # Reusable product card component
│   └── Notification.js    # Toast notification component
├── App.js                 # Main app with routing and state management
├── index.js              # React entry point
└── index.css             # TailwindCSS imports
```

## Features in Detail

### Product Card Features
- Responsive design with hover effects
- Image fallback for broken URLs
- Discount percentage calculation
- Video button for products with video URLs
- Delete button (admin only)
- Commission and rating display
- Coupon information

### Admin Features
- Drag and drop file upload
- File validation (XLSX/XLS only)
- Column validation
- Product deduplication
- Bulk operations
- Real-time notifications
- Product count display

### Responsive Design
- Mobile-first approach
- Grid layouts that adapt to screen size
- Touch-friendly buttons and interactions
- Optimized for all device sizes

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is for educational and commercial use.
