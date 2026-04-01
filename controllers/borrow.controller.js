import Borrow from '../models/borrow.model.js';
import Book from '../models/book.model.js';
import Member from '../models/member.model.js';
import { Op } from 'sequelize';


export const getBorrows = async (req, res) => {
    try {
        //récupérer les paramètres de requête pour le filtrage et la pagination
        const { status, page = 1, limit = 10 } = req.query;

        const where = {};
        if (status) {
            where.status = status === 'borrowed' ? 'Borrowed' : status === 'returned' ? 'Returned' : 'Overdue';
        }

        const offset = (page - 1) * limit;


        const { count, rows } = await Borrow.findAndCountAll({
            where,
            include: [
                {
                    model: Member,
                    as: 'member',
                    attributes: ['id', 'first_name', 'last_name']
                },
                {
                    model: Book,
                    as: 'book',
                    attributes: ['id', 'title', 'author']
                }
            ],
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['createdAt', 'DESC']]
        });

        return res.status(200).json({
            total: count,
            page: parseInt(page), 
            totalPages: Math.ceil(count / limit),
            borrows: rows.map(borrow => ({
                ...borrow.toJSON(),
                status: borrow.status.toLowerCase()
            }))
        });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};



export const addBorrow = async (req, res) => {
    try {
        const { member_id, book_id, due_date } = req.body;

        const member = await Member.findByPk(member_id);
        if (!member) {
            return res.status(404).json({ message: "Membre introuvable" });
        }
        if (member.status !== 'Active') {
            return res.status(400).json({ message: "Le membre n'est pas actif" });
        }


        const book = await Book.findByPk(book_id);
        if (!book) {
            return res.status(404).json({ message: "Livre introuvable" });
        }
        if (book.available_quantity < 1) {
            return res.status(400).json({ message: "Aucun exemplaire disponible" });
        }


        const borrow = await Borrow.create({
            member_id,
            book_id,
            due_date,
            borrow_date: new Date(),
            status: 'Borrowed'
        });

        await book.update({
            available_quantity: book.available_quantity - 1
        });


        const borrowWithRelations = await Borrow.findByPk(borrow.id, {
            include: [
                { model: Member, as: 'member', attributes: ['id', 'first_name', 'last_name'] },
                { model: Book, as: 'book', attributes: ['id', 'title', 'author'] }
            ]
        });

        const borrowData = {
            ...borrowWithRelations.toJSON(),
            status: borrowWithRelations.status.toLowerCase()
        };

        return res.status(201).json(borrowData);

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};


export const returnBorrow = async (req, res) => {
    try {
        const { id } = req.params;

        //verifie si l'emprunt existz 
        const borrow = await Borrow.findByPk(id, {
            include: [
                { model: Book, as: 'book' },
                { model: Member, as: 'member', attributes: ['id', 'first_name', 'last_name'] }
            ]
        });
        if (!borrow) {
            return res.status(404).json({ message: "Emprunt introuvable" });
        }


        if (borrow.status === 'Returned') {
            return res.status(400).json({ message: "Ce livre a déjà été retourné" });
        }


        await borrow.update({
            status: 'Returned',
            return_date: new Date()
        });

     
        await borrow.book.update({
            available_quantity: borrow.book.available_quantity + 1
        });

        await borrow.reload();

        const borrowData = {
            ...borrow.toJSON(),
            status: borrow.status.toLowerCase()
        };

        return res.status(200).json({
            message: "Livre retourné avec succès",
            borrow: borrowData
        });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};