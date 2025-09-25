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

    async updateUserProfile(userId, updateData) {
        try {
            // Validate user exists
            const user = await User.findById(userId);
            if (!user) {
                throw new CustomError('User not found', 404);
            }

            // Update only allowed fields
            const allowedFields = ['name', 'bio', 'avatar'];
            const filteredData = {};
            
            allowedFields.forEach(field => {
                if (updateData[field] !== undefined) {
                    filteredData[field] = updateData[field];
                }
            });

            // Check if there's actually data to update
            if (Object.keys(filteredData).length === 0) {
                throw new CustomError('No valid fields to update', 400);
            }

            const updatedUser = await User.findByIdAndUpdate(
                userId, 
                filteredData, 
                { new: true, runValidators: true }
            ).lean();

            // Remove sensitive data
            delete updatedUser.password;
            delete updatedUser.googleId;

            return updatedUser;
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw new CustomError('Error updating user profile', 500);
        }
    }

    async getCurrentUserProfile(userId) {
        try {
            const user = await User.findById(userId)
                .populate('wallet', 'balance')
                .populate('organization', 'name')
                .lean();
            
            if (!user) {
                throw new CustomError('User not found', 404);
            }

            // Remove sensitive data
            delete user.password;
            delete user.googleId;

            return user;
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw new CustomError('Error fetching user profile', 500);
        }
    }
}

module.exports = new UserService();