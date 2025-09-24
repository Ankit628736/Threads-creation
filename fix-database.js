require('dotenv').config();
const mongoose = require('mongoose');

async function fixDatabase() {
    try {
        // Connect to MongoDB with fresh connection
        await mongoose.connect(process.env.MONGO_CONNECTION_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB');

        const db = mongoose.connection.db;
        
        // Check if the problematic index exists on users collection
        const collection = db.collection('users');
        
        // First, let's see what's in the users collection
        const userCount = await collection.countDocuments();
        console.log(`\nTotal users in collection: ${userCount}`);
        
        // Check for documents with username field
        const usersWithUsername = await collection.countDocuments({ username: { $exists: true } });
        console.log(`Users with username field: ${usersWithUsername}`);
        
        // Check current indexes
        const indexes = await collection.indexes();
        console.log('\nCurrent indexes on users collection:');
        indexes.forEach(index => {
            console.log('- ', index.name, ':', JSON.stringify(index.key));
        });

        // Try to drop any username-related indexes
        let droppedIndexes = [];
        for (const index of indexes) {
            if (index.key.username !== undefined) {
                try {
                    console.log(`\nDropping index: ${index.name}`);
                    await collection.dropIndex(index.name);
                    droppedIndexes.push(index.name);
                    console.log(`✅ Successfully dropped ${index.name} index`);
                } catch (err) {
                    console.log(`❌ Failed to drop ${index.name}: ${err.message}`);
                }
            }
        }

        if (droppedIndexes.length === 0) {
            console.log('\n❌ No username indexes found to drop');
        }

        // Clean up any documents that might have username fields
        console.log('\nCleaning up documents with username field...');
        const result = await collection.updateMany(
            { username: { $exists: true } },
            { $unset: { username: 1 } }
        );
        console.log(`✅ Cleaned up ${result.modifiedCount} documents`);

        // Also remove any documents that have null username values
        console.log('\nRemoving documents with null username...');
        const deleteResult = await collection.deleteMany({ username: null });
        console.log(`✅ Deleted ${deleteResult.deletedCount} documents with null username`);

        // Verify current indexes after cleanup
        const newIndexes = await collection.indexes();
        console.log('\nIndexes after cleanup:');
        newIndexes.forEach(index => {
            console.log('- ', index.name, ':', JSON.stringify(index.key));
        });

        // Also ensure the User model is properly registered
        console.log('\nRe-creating User collection with proper schema...');
        
        // Drop the entire users collection and recreate it
        console.log('Backing up existing users...');
        const existingUsers = await collection.find({ email: { $exists: true } }).toArray();
        console.log(`Found ${existingUsers.length} valid users to backup`);

        if (existingUsers.length > 0) {
            console.log('Recreating users collection...');
            await collection.drop();
            
            // Recreate with clean data
            const cleanUsers = existingUsers.map(user => ({
                name: user.name,
                email: user.email,
                password: user.password,
                role: user.role || 'customer',
                createdAt: user.createdAt || new Date(),
                updatedAt: user.updatedAt || new Date()
            }));
            
            await collection.insertMany(cleanUsers);
            console.log(`✅ Recreated users collection with ${cleanUsers.length} clean users`);
        }

        console.log('\n🎉 Database cleanup completed successfully!');

    } catch (error) {
        console.error('❌ Error during database cleanup:', error);
    } finally {
        await mongoose.connection.close();
        console.log('Database connection closed');
    }
}

// Run the fix
fixDatabase();