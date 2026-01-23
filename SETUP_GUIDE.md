# Just-Emart - Setup Guide

## Backend & Database Connected! ✅

Your Just-Emart e-commerce platform is now connected to MongoDB and ready to use.

## What's Been Configured

### Backend (Port 5000)

- ✅ Express.js server running
- ✅ MongoDB connection established
- ✅ RESTful API endpoints created
- ✅ CORS enabled for frontend communication

### Frontend (Vite - Port 5173)

- ✅ API configuration added
- ✅ Products page updated to fetch from backend
- ✅ Home page updated with backend integration
- ✅ Environment variables configured

### Database (MongoDB)

- ✅ Database: `Final_Project`
- ✅ Collection: `products` (with 30 products)
- ✅ Collections ready: users, carts, wishlists, orders

## Running the Application

### 1. Start Backend Server

```bash
cd backend
npm start
```

Backend will run on: http://localhost:5000

### 2. Start Frontend (in new terminal)

```bash
npm run dev
```

Frontend will run on: http://localhost:5173

## API Endpoints Available

### Products

- **GET** `/api/products` - Get all products from MongoDB
- **GET** `/api/products/:id` - Get single product

### Cart Management

- **GET** `/api/cart/:email` - Get user's cart
- **POST** `/api/cart/:email` - Add item to cart
- **DELETE** `/api/cart/:email/:productId` - Remove from cart
- **PATCH** `/api/cart/:email/:productId` - Update quantity

### Wishlist

- **GET** `/api/wishlist/:email` - Get wishlist
- **POST** `/api/wishlist/:email` - Add to wishlist
- **DELETE** `/api/wishlist/:email/:productId` - Remove from wishlist

### Orders

- **GET** `/api/orders/:email` - Get user orders
- **POST** `/api/orders` - Create new order

### Users & Stats

- **POST** `/api/users/register` - Register user
- **GET** `/api/stats` - Platform statistics

## Testing the Connection

### Test Backend API

Open browser and visit:

- http://localhost:5000 - API info
- http://localhost:5000/api/products - View all products
- http://localhost:5000/api/stats - View statistics

### Test Frontend Integration

1. Visit http://localhost:5173
2. Go to Products page
3. Products should load from MongoDB database
4. Check browser console for any errors

## Environment Variables

### Backend (.env)

```env
PORT=5000
DB_USERNAME=finalProject
DB_PASSWORD=wToo9SX4OUz6CyAO
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:5000
```

## Database Collections Structure

### products

```javascript
{
  title: String,
  price: Number,
  description: String,
  image: String,
  category: String,
  seller: Object,
  rating: Number,
  tags: Array,
  stock: Number
}
```

### users

```javascript
{
  email: String,
  name: String,
  photoURL: String,
  createdAt: Date
}
```

### carts

```javascript
{
  userEmail: String,
  items: [{
    productId: String,
    quantity: Number,
    addedAt: Date
  }]
}
```

### orders

```javascript
{
  userEmail: String,
  items: Array,
  total: Number,
  status: String,
  createdAt: Date
}
```

## Next Steps

1. ✅ Backend server is running
2. ✅ Database connected
3. ✅ Products loaded in MongoDB
4. 🔄 Start frontend server
5. 🔄 Test the application
6. 🔄 Sign in with Firebase auth
7. 🔄 Test cart & wishlist features

## Troubleshooting

### Backend won't start

- Check if MongoDB credentials are correct in `.env`
- Ensure port 5000 is not in use

### Products not loading

- Verify backend is running on port 5000
- Check browser console for CORS errors
- Verify MongoDB has products in the collection

### CORS errors

- Backend already has CORS enabled
- Make sure frontend uses `http://localhost:5173`

## Development Tips

- Backend auto-reload: Use `npm run dev` (requires nodemon)
- Frontend hot reload: Vite automatically reloads
- Check terminal for backend logs
- Use browser DevTools Network tab to monitor API calls

## Production Deployment

For production:

1. Update `VITE_API_URL` to your production backend URL
2. Set MongoDB connection string securely
3. Use environment-specific `.env` files
4. Enable proper authentication middleware

---

**Status:** ✅ Backend Connected | ✅ Database Active | Ready to Use!
