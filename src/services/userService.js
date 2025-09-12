// src/services/userService.js
const User = require('../models/User');
const CustomError = require('../utils/customError');

class UserService {
    async getAllUsers(options = {}) {
        const {
            page = 1, limit = 10, search = ''
        } = options;
        const query = {};
        if (search) {
            query.$or = [{
                    name: {
                        $regex: search,
                        $options: 'i'
                    }
                },
                {
                    email: {
                        $regex: search,
                        $options: 'i'
                    }
                }
            ];
        }
        const skip = (page - 1) * limit;
        try {
            const [users, totalCount] = await Promise.all([
                User.find(query)
                .skip(skip)
                .limit(parseInt(limit))
                .lean(),
                User.countDocuments(query)
            ]);
            return {
                users,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(totalCount / limit),
                    totalCount,
                    hasNextPage: page < Math.ceil(totalCount / limit),
                    hasPrevPage: page > 1,
                    limit: parseInt(limit)
                }
            };
        } catch (error) {
            throw new CustomError('Error fetching users', 500);
        }
    }

    async getUserById(id) {
        try {
            const user = await User.findById(id).lean();
            if (!user) {
                throw new CustomError('User not found', 404);
            }
            return user;
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw new CustomError('Error fetching user', 500);
        }
    }
}

module.exports = new UserService();