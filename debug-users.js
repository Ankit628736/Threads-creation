require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./app/models/user');
const bcrypt = require('bcrypt');

async function debugUserIssues() {
    try {
        await mongoose.connect(process.env.MONGO_CONNECTION_URL);
        console.log('🔗 Connected to MongoDB');

        console.log('\n=== DEBUGGING USER AUTHENTICATION ISSUES ===\n');

        // 1. Check all users in database
        console.log('1️⃣ Checking all users in database:');
        const allUsers = await User.find({});
        console.log(`   📊 Total users found: ${allUsers.length}`);
        
        if (allUsers.length > 0) {
            allUsers.forEach((user, index) => {
                console.log(`   ${index + 1}. Name: ${user.name}`);
                console.log(`      Email: ${user.email}`);
                console.log(`      Role: ${user.role}`);
                console.log(`      Created: ${user.createdAt}`);
                console.log(`      Password Hash: ${user.password.substring(0, 20)}...`);
                console.log(`      User ID: ${user._id}`);
                console.log('   ────────────────────────────────');
            });
        } else {
            console.log('   ❌ No users found in database');
        }

        // 2. Test creating a new user with known credentials
        console.log('\n2️⃣ Creating a test user with known credentials:');
        const testEmail = 'debug@test.com';
        const testPassword = 'test123';
        
        // Remove existing test user
        await User.deleteOne({ email: testEmail });
        
        // Create new test user
        const hashedPassword = await bcrypt.hash(testPassword, 10);
        const testUser = new User({
            name: 'Debug Test User',
            email: testEmail,
            password: hashedPassword,
            role: 'customer'
        });
        
        const savedUser = await testUser.save();
        console.log(`   ✅ Test user created successfully:`);
        console.log(`      ID: ${savedUser._id}`);
        console.log(`      Email: ${savedUser.email}`);
        console.log(`      Password (plaintext): ${testPassword}`);
        console.log(`      Password (hashed): ${savedUser.password.substring(0, 30)}...`);

        // 3. Test password verification
        console.log('\n3️⃣ Testing password verification:');
        const foundUser = await User.findOne({ email: testEmail });
        if (foundUser) {
            const isPasswordValid = await bcrypt.compare(testPassword, foundUser.password);
            console.log(`   Password verification: ${isPasswordValid ? '✅ SUCCESS' : '❌ FAILED'}`);
        }

        // 4. Test with existing users (try common passwords)
        console.log('\n4️⃣ Testing common passwords with existing users:');
        const commonPasswords = ['password', 'password123', '123456', 'admin', 'test', 'user123'];
        
        for (const user of allUsers) {
            if (user.email !== testEmail) { // Skip our test user
                console.log(`   Testing passwords for ${user.email}:`);
                let foundPassword = false;
                
                for (const pwd of commonPasswords) {
                    try {
                        const isMatch = await bcrypt.compare(pwd, user.password);
                        if (isMatch) {
                            console.log(`      ✅ Password found: ${pwd}`);
                            foundPassword = true;
                            break;
                        }
                    } catch (error) {
                        console.log(`      ❌ Error testing password: ${error.message}`);
                    }
                }
                
                if (!foundPassword) {
                    console.log(`      ❓ No common password found (try the original registration password)`);
                }
            }
        }

        // 5. Provide login instructions
        console.log('\n5️⃣ Login Instructions:');
        console.log('   🔑 You can now login with:');
        console.log(`      Email: ${testEmail}`);
        console.log(`      Password: ${testPassword}`);
        console.log('');
        console.log('   📝 For existing users, if you don\'t remember the password:');
        console.log('      - Try common passwords like: password123, 123456, password');
        console.log('      - Or create a new account using the registration form');
        console.log('      - The server should be running on http://localhost:9876');

        console.log('\n=== DEBUG COMPLETE ===');

    } catch (error) {
        console.error('❌ Error during debugging:', error);
    } finally {
        await mongoose.connection.close();
        console.log('🔌 Database connection closed');
    }
}

debugUserIssues();