import { Op } from 'sequelize';
import { Book, Borrow, Category, Member } from '../models/index.js';

export const getBookStats = async (req, res) => {
    try {
        const totalBooks = await Book.count();

        const totalAvailableResult = await Book.sum('available_quantity');
        const totalAvailable = totalAvailableResult || 0;


        const totalBorrowed = await Borrow.count({
            where: { status: 'Borrowed' }
        });

        const byCategory = await Book.findAll({
            attributes: [
                'category_id',
                [Book.sequelize.fn('COUNT', Book.sequelize.col('Book.id')), 'count']
            ],
            include: [{
                model: Category,
                attributes: ['name']
            }],
            group: ['Book.category_id', 'Category.id'],
            raw: true
        });

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

export const getBorrowStats = async (req, res) => {
    try {
        const totalBorrows = await Borrow.count();


        const activeBorrows = await Borrow.count({
            where: { status: 'Borrowed' }
        });

        const returnedBorrows = await Borrow.count({
            where: { status: 'Returned' }
        });

        const overdueBorrows = await Borrow.count({
            where: {
                status: 'Borrowed',
                due_date: { [Op.lt]: new Date() }
            }
        });

        const mostBorrowed = await Borrow.findAll({
            attributes: [
                'book_id',
                [Borrow.sequelize.fn('COUNT', Borrow.sequelize.col('book_id')), 'borrow_count']
            ],
            include: [{
                model: Book,
                as: 'book',
                attributes: ['title', 'author']
            }],
            group: ['Borrow.book_id', 'book.id'],
            order: [[Borrow.sequelize.fn('COUNT', Borrow.sequelize.col('book_id')), 'DESC']],
            limit: 5,
            raw: true
        });

        const formattedMostBorrowed = mostBorrowed.map(item => ({
            book_id: item.book_id,
            borrow_count: item.borrow_count,
            book: {
                title: item['book.title'],
                author: item['book.author']
            }
        }));

        res.status(200).json({
            totalBorrows,
            activeBorrows,
            returnedBorrows,
            overdueBorrows,
            mostBorrowed: formattedMostBorrowed
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};