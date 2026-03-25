import { Op } from 'sequelize';
import { Book, Borrow, Category, Member } from '../models/index.js';

export const getBookStats = async (req, res) => {
    try {
        // Total books
        const totalBooks = await Book.count();

        // Total available
        const totalAvailableResult = await Book.sum('available_quantity');
        const totalAvailable = totalAvailableResult || 0;

        // Total borrowed
        const totalBorrowed = await Borrow.count({
            where: { status: 'Borrowed' }
        });

        // By category
        const byCategory = await Book.findAll({
            attributes: [
                'category_id',
                [Book.sequelize.fn('COUNT', Book.sequelize.col('Book.id')), 'count']
            ],
            include: [
                {
                    model: Category,
                    attributes: ['name']
                }
            ],
            group: ['Book.category_id', 'Category.id'],
            raw: true
        });

        // Transform to match the format
        const formattedByCategory = byCategory.map(item => ({
            category_id: item.category_id,
            count: parseInt(item.count),
            category: { name: item['Category.name'] }
        }));

        res.status(200).json({
            totalBooks,
            totalAvailable,
            totalBorrowed,
            byCategory: formattedByCategory
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getMemberStats = async (req, res) => {
    try {
        const totalMembers = await Member.count();
        const activeMembers = await Member.count({ where: { status: 'Active' } });
        const inactiveMembers = await Member.count({ where: { status: 'Inactive' } });

        res.status(200).json({
            totalMembers,
            activeMembers,
            inactiveMembers
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};