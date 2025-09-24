# Threaded Creations 👔

**Threaded Creations** is a modern e-commerce platform specializing in shirts and apparel. Built with Node.js, Express, MongoDB, and EJS, it offers a complete shopping experience with user authentication, shopping cart, order management, and admin panel.

## ✨ Features

### Customer Features
- 🏠 **Product Catalog**: Browse through a wide variety of shirts
- 🛒 **Shopping Cart**: Add/remove items with real-time updates
- 👤 **User Authentication**: Secure login and registration
- 📦 **Order Tracking**: View order history and status
- 💳 **Multiple Payment Options**: Cash on Delivery (COD) support

### Admin Features
- 📊 **Order Management**: View and update all customer orders
- 📝 **Product Management**: Add, edit, delete menu items
- 👥 **User Management**: Manage customer accounts
- 📈 **Real-time Updates**: Live order status updates via Socket.IO

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: Passport.js with local strategy
- **Template Engine**: EJS with express-ejs-layouts
- **Real-time**: Socket.IO for live updates
- **Styling**: Tailwind CSS
- **Security**: bcrypt for password hashing

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB database
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Ankit628736/Threaded-Creations.git
   cd Threaded-Creations
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   COOKIE_SECRET=your_cookie_secret_here
   MONGO_CONNECTION_URL=your_mongodb_connection_string
   DB_HOST=localhost
   DB_NAME=threaded_creations
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   PORT=9876
   ```

4. **Start the application**
   ```bash
   npm start
   ```

5. **Visit the application**
   Open your browser and go to `http://localhost:9876`

## 👥 Default Users

### Admin Accounts
- **Email**: `ankit123@gmail.com` | **Password**: `password123`
- **Email**: `ram123@gmail.com` | **Password**: `password123`

### Customer Account  
- **Email**: `rohan123@gmail.com` | **Password**: `password123`

## 📱 Usage

### For Customers
1. Browse the product catalog on the home page
2. Add items to your cart
3. Register/Login to place orders
4. Track your orders in "My Orders"

### For Admins
1. Login with admin credentials
2. Access the Admin Panel to:
   - View and manage all orders
   - Add/edit/delete products
   - Update order status
   - Manage users

## 🌐 Deployment

### Vercel Deployment
This project is configured for easy deployment on Vercel:

1. Push your code to GitHub
2. Connect your GitHub repo to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy with one click

### Environment Variables for Production
```env
COOKIE_SECRET=your_production_cookie_secret
MONGO_CONNECTION_URL=your_production_mongodb_url
NODE_ENV=production
```

## 📂 Project Structure

```
threaded-creations/
├── app/
│   ├── config/          # Database and passport configuration
│   ├── http/
│   │   ├── controllers/ # Route controllers
│   │   └── middlewares/ # Authentication middlewares
│   └── models/          # MongoDB models
├── public/             # Static assets (CSS, JS, images)
├── resources/
│   └── views/          # EJS templates
├── routes/             # Application routes
├── server.js          # Main application file
└── vercel.json        # Vercel deployment config
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Ankit Singh**
- GitHub: [@Ankit628736](https://github.com/Ankit628736)

## 🙏 Acknowledgments

- Thanks to all contributors and users
- Built with ❤️ for the fashion community
