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
        },
        {
            balance: 2500,
            transactions: [{
                    amount: 2000,
                    type: 'credit',
                    reason: 'Company reimbursement',
                    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                },
                {
                    amount: 500,
                    type: 'debit',
                    reason: 'Course purchase',
                    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
                }
            ]
        },
        {
            balance: 750,
            transactions: [{
                    amount: 1000,
                    type: 'credit',
                    reason: 'Gift card',
                    date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
                },
                {
                    amount: 250,
                    type: 'debit',
                    reason: 'Workshop registration',
                    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
                }
            ]
        },
        {
            balance: 150,
            transactions: [{
                    amount: 300,
                    type: 'credit',
                    reason: 'Referral bonus',
                    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
                },
                {
                    amount: 150,
                    type: 'debit',
                    reason: 'Book purchase',
                    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
                }
            ]
        },
        {
            balance: 3200,
            transactions: [{
                    amount: 3000,
                    type: 'credit',
                    reason: 'Corporate wellness program',
                    date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                },
                {
                    amount: 200,
                    type: 'debit',
                    reason: 'Consultation fee',
                    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
                }
            ]
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