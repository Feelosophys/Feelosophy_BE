// src/seed/walletSeeder.js
const Wallet = require('../models/Wallet');
const User = require('../models/User');

async function seedWallets() {
    // Get existing users
    const users = await User.find({}).limit(5);

    if (users.length === 0) {
        console.log('Warning: No users found. Seed users first.');
        return;
    }

    const walletsData = [{
            balance: 1000,
            transactions: [{
                amount: 1000,
                type: 'credit',
                reason: 'Initial deposit',
                date: new Date()
            }]
        },
        {
            balance: 500,
            transactions: [{
                amount: 500,
                type: 'credit',
                reason: 'Welcome bonus',
                date: new Date()
            }]
        },
        {
            balance: 0,
            transactions: []
        }
    ];

    for (let i = 0; i < Math.min(users.length, walletsData.length); i++) {
        const user = users[i];
        const walletData = walletsData[i];

        const exists = await Wallet.findOne({
            userId: user._id
        });
        if (!exists) {
            walletData.userId = user._id;
            await Wallet.create(walletData);
            console.log(`Created wallet for user: ${user.email}`);
        } else {
            console.log(`Wallet exists for user: ${user.email}`);
        }
    }
}

module.exports = {
    seedWallets
};