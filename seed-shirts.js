require('dotenv').config();
const mongoose = require('mongoose');
const Menu = require('./app/models/menu');

const shirtItems = [
    {
        name: "Classic White Shirt",
        image: "shirt1.png",
        price: 899,
        size: "M"
    },
    {
        name: "Blue Denim Shirt",
        image: "shirt2.png", 
        price: 1299,
        size: "L"
    },
    {
        name: "Black Formal Shirt",
        image: "shirt3.png",
        price: 1199,
        size: "M"
    },
    {
        name: "Checkered Casual Shirt",
        image: "shirt4.png",
        price: 999,
        size: "L"
    },
    {
        name: "Red Polo Shirt",
        image: "shirt5.png",
        price: 799,
        size: "S"
    },
    {
        name: "Green Cotton Shirt", 
        image: "shirt6.png",
        price: 1099,
        size: "M"
    },
    {
        name: "Grey Business Shirt",
        image: "shirt7.png",
        price: 1399,
        size: "L"
    },
    {
        name: "Navy Blue Shirt",
        image: "shirt8.png",
        price: 1149,
        size: "M"
    },
    {
        name: "Striped Casual Shirt",
        image: "shirt9.png",
        price: 949,
        size: "S"
    },
    {
        name: "Maroon Party Shirt",
        image: "shirt10.png",
        price: 1599,
        size: "L"
    },
    {
        name: "Light Blue Shirt",
        image: "shirt11.png",
        price: 899,
        size: "M"
    },
    {
        name: "Brown Casual Shirt",
        image: "shirt12.png",
        price: 1199,
        size: "L"
    },
    {
        name: "Pink Formal Shirt",
        image: "shirt13.png",
        price: 1099,
        size: "M"
    },
    {
        name: "Yellow Summer Shirt",
        image: "shirt14.png",
        price: 849,
        size: "S"
    },
    {
        name: "Orange Casual Shirt",
        image: "shirt15.png",
        price: 999,
        size: "M"
    },
    {
        name: "Purple Party Shirt",
        image: "shirt16.png",
        price: 1499,
        size: "L"
    },
    {
        name: "Teal Cotton Shirt",
        image: "shirt17.png",
        price: 1199,
        size: "M"
    },
    {
        name: "Beige Linen Shirt",
        image: "shirt18.png",
        price: 1399,
        size: "L"
    },
    {
        name: "Coral Summer Shirt",
        image: "shirt19.png",
        price: 899,
        size: "S"
    },
    {
        name: "Olive Casual Shirt",
        image: "shirt20.png",
        price: 1249,
        size: "M"
    },
    {
        name: "Mint Green Shirt",
        image: "shirt21.png",
        price: 1049,
        size: "L"
    },
    {
        name: "Salmon Dress Shirt",
        image: "shirt22.png",
        price: 1349,
        size: "M"
    },
    {
        name: "Cream Formal Shirt",
        image: "shirt23.png",
        price: 1199,
        size: "L"
    }
];

async function seedDatabase() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_CONNECTION_URL);
        console.log('Connected to MongoDB');

        // Clear existing menu items
        await Menu.deleteMany({});
        console.log('Cleared existing menu items');

        // Insert new shirt items
        await Menu.insertMany(shirtItems);
        console.log(`✅ Successfully added ${shirtItems.length} shirt items to the database`);

        // Verify the data
        const count = await Menu.countDocuments();
        console.log(`Total items in database: ${count}`);

    } catch (error) {
        console.error('❌ Error seeding database:', error);
    } finally {
        await mongoose.connection.close();
        console.log('Database connection closed');
    }
}

// Run the seeding
seedDatabase();