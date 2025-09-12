// src/services/blogService.js
// Handles business logic for blog operations
const Blog = require('../models/Blog');
const CustomError = require('../utils/customError');

class BlogService {
    async getAllBlogs(options = {}) {
        const {
            page = 1,
                limit = 10,
                search = '',
                tags = '',
                isPublished = true,
                sortBy = 'createdAt',
                sortOrder = 'desc'
        } = options;

        // Build query
        const query = {};

        // Only show published blogs by default (can be overridden)
        if (isPublished !== undefined) {
            query.isPublished = isPublished;
        }

        // Search in title and content
        if (search) {
            query.$or = [{
                    title: {
                        $regex: search,
                        $options: 'i'
                    }
                },
                {
                    content: {
                        $regex: search,
                        $options: 'i'
                    }
                }
            ];
        }

        // Filter by tags
        if (tags) {
            const tagArray = tags.split(',').map(tag => tag.trim());
            query.tags = {
                $in: tagArray
            };
        }

        // Calculate pagination
        const skip = (page - 1) * limit;

        // Build sort object
        const sort = {};
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

        try {
            // Execute queries
            const [blogs, totalCount] = await Promise.all([
                Blog.find(query)
                .populate('authorId', 'name email avatar bio')
                .sort(sort)
                .skip(skip)
                .limit(parseInt(limit))
                .lean(),
                Blog.countDocuments(query)
            ]);

            // Calculate pagination info
            const totalPages = Math.ceil(totalCount / limit);
            const hasNextPage = page < totalPages;
            const hasPrevPage = page > 1;

            return {
                blogs,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages,
                    totalCount,
                    hasNextPage,
                    hasPrevPage,
                    limit: parseInt(limit)
                }
            };
        } catch (error) {
            throw new CustomError('Error fetching blogs', 500);
        }
    }

    async getBlogBySlug(slug) {
        try {
            const blog = await Blog.findOne({
                    slug,
                    isPublished: true
                })
                .populate('authorId', 'name email avatar bio')
                .populate('comments')
                .lean();

            if (!blog) {
                throw new CustomError('Blog post not found', 404);
            }

            // Increment view count
            await Blog.findByIdAndUpdate(blog._id, {
                $inc: {
                    views: 1
                }
            });

            return blog;
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw new CustomError('Error fetching blog', 500);
        }
    }

    async getBlogById(id) {
        try {
            console.log('Looking for blog with id:', id);
            const blog = await Blog.findById(id)
                .populate('authorId', 'name email avatar bio')
                .populate('comments')
                .lean();

            console.log('Blog found:', blog);

            if (!blog) {
                throw new CustomError('Blog post not found', 404);
            }

            return blog;
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw new CustomError('Error fetching blog', 500);
        }
    }

    async createBlog(blogData, authorId) {
        try {
            // Generate slug from title
            const slug = this.generateSlug(blogData.title);

            // Check if slug already exists
            const existingBlog = await Blog.findOne({
                slug
            });
            if (existingBlog) {
                throw new CustomError('Blog with this title already exists', 409);
            }

            // Create new blog
            const newBlog = new Blog({
                ...blogData,
                slug,
                authorId,
                views: 0,
                comments: []
            });

            const savedBlog = await newBlog.save();

            // Populate author information
            const populatedBlog = await Blog.findById(savedBlog._id)
                .populate('authorId', 'name email avatar bio')
                .lean();

            return populatedBlog;
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            if (error.code === 11000) {
                throw new CustomError('Blog with this title already exists', 409);
            }
            throw new CustomError('Error creating blog', 500);
        }
    }

    generateSlug(title) {
        return title
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '') // Remove special characters
            .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
            .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
    }
}

module.exports = new BlogService();