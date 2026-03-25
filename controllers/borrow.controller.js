import Borrow from '../models/borrow.model.js';
import Book from '../models/book.model.js';
import Member from '../models/member.model.js';
import { Op } from 'sequelize';

// ─────────────────────────────────────────
// GET /api/borrows
// ─────────────────────────────────────────
export const getBorrows = async (req, res) => {
    try {
        // 1. Récupérer les paramètres de la query
        const { status, page = 1, limit = 10 } = req.query;

        // 2. Construire le filtre dynamiquement
        const where = {};
        if (status) {
            where.status = status === 'borrowed' ? 'Borrowed' : status === 'returned' ? 'Returned' : 'Overdue';
        }

        // 3. Calculer l'offset pour la pagination
        const offset = (page - 1) * limit;

        // 4. Requête avec filtres + pagination + jointures
        const { count, rows } = await Borrow.findAndCountAll({
            where,
            include: [
                {
                    model: Member,
                    as: 'member',
                    attributes: ['id', 'first_name', 'last_name'] // uniquement les champs utiles
                },
                {
                    model: Book,
                    as: 'book',
                    attributes: ['id', 'title', 'author'] // uniquement les champs utiles
                }
            ],
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['createdAt', 'DESC']] // plus récent en premier
        });

        return res.status(200).json({
            total: count,                         // nombre total d'emprunts
            page: parseInt(page),                 // page actuelle
            totalPages: Math.ceil(count / limit), // nombre de pages
            borrows: rows.map(borrow => ({
                ...borrow.toJSON(),
                status: borrow.status.toLowerCase()
            }))                         // emprunts de la page courante
        });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// ─────────────────────────────────────────
// POST /api/borrows
// ─────────────────────────────────────────
export const addBorrow = async (req, res) => {
    try {
        const { member_id, book_id, due_date } = req.body;

        // 1. Vérifier que le membre existe et est actif
        const member = await Member.findByPk(member_id);
        if (!member) {
            return res.status(404).json({ message: "Membre introuvable" });
        }
        if (member.status !== 'Active') {
            return res.status(400).json({ message: "Le membre n'est pas actif" });
        }

        // 2. Vérifier que le livre existe et est disponible
        const book = await Book.findByPk(book_id);
        if (!book) {
            return res.status(404).json({ message: "Livre introuvable" });
        }
        if (book.available_quantity < 1) {
            return res.status(400).json({ message: "Aucun exemplaire disponible" });
        }

        // 3. Créer l'emprunt
        const borrow = await Borrow.create({
            member_id,
            book_id,
            due_date,
            borrow_date: new Date(),  // date du jour automatiquement
            status: 'Borrowed'        // statut par défaut
        });

        // 4. Décrémenter available_quantity du livre
        await book.update({
            available_quantity: book.available_quantity - 1
        });

        // 5. Recharger l'emprunt avec les relations
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

// ─────────────────────────────────────────
// PUT /api/borrows/return/:id
// ─────────────────────────────────────────
export const returnBorrow = async (req, res) => {
    try {
        const { id } = req.params;

        // 1. Vérifier que l'emprunt existe
        const borrow = await Borrow.findByPk(id, {
            include: [
                { model: Book, as: 'book' },
                { model: Member, as: 'member', attributes: ['id', 'first_name', 'last_name'] }
            ]
        });
        if (!borrow) {
            return res.status(404).json({ message: "Emprunt introuvable" });
        }

        // 2. Vérifier que le livre n'est pas déjà retourné
        if (borrow.status === 'Returned') {
            return res.status(400).json({ message: "Ce livre a déjà été retourné" });
        }

        // 3. Mettre à jour l'emprunt
        await borrow.update({
            status: 'Returned',
            return_date: new Date() // date du jour automatiquement
        });

        // 4. Incrémenter available_quantity du livre
        await borrow.book.update({
            available_quantity: borrow.book.available_quantity + 1
        });

        await borrow.reload(); // recharger les données à jour

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