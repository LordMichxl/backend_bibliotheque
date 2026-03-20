import { Borrow, Member, Book } from '../models/index.js';

//récupérer tous les emprunts
export const getBorrows = async (req, res) => {
  try {
    const { status, member_id, book_id, page = 1, limit = 10 } = req.query;
    const where = {};

    if (status) where.status = status;
    if (member_id) where.member_id = member_id;
    if (book_id) where.book_id = book_id;

    const result = await Borrow.findAndCountAll({
      where,
      limit: Number(limit),
      offset: (Number(page) - 1) * Number(limit),
      order: [['id', 'DESC']],
      include: [Member, Book],
    });

    res.status(200).json({
      borrows: result.rows,
      meta: {
        total: result.count,
        page: Number(page),
        limit: Number(limit),
      },
    });
  } catch (err) {
    res.status(400).json({
      message: 'Erreur de récupération des emprunts',
      error: err.message,
    });
  }
};

//rrecuperer un emprunt
export const getBorrow = async (req, res) => {
  try {
    const { id } = req.params;

    const borrow = await Borrow.findByPk(id, {
      include: [Member, Book],
    });

    if (!borrow) {
      return res.status(404).json({ message: "emprunt n'existe pas" });
    }

    res.status(200).json(borrow);
  } catch (err) {
    res.status(400).json({
      message: "Erreur de récupération de l'emprunt",
      error: err.message,
    });
  }
};

//creer un emprunt
export const addBorrow = async (req, res) => {
  try {
    const { member_id, book_id, borrow_date, due_date } = req.body;

    if (!member_id || !book_id || !borrow_date || !due_date) {
      return res.status(400).json({
        message: 'member_id, book_id, borrow_date, due_date sont obligatoires',
      });
    }

    const member = await Member.findByPk(member_id);
    if (!member) throw new Error('membre non trouvé');

    const book = await Book.findByPk(book_id);
    if (!book) throw new Error('livre non trouvé');

    if (book.available_quantity <= 0) {
      throw new Error('Aucune copie disponible');
    }

    //pour enviter les emprunts multiples du même livre sans retour
    const existingBorrow = await Borrow.findOne({
      where: {
        book_id,
        status: 'Borrowed',
      },
    });

    if (existingBorrow) {
      throw new Error('Ce livre est déjà emprunté');
    }

    const borrow = await Borrow.create({
      member_id,
      book_id,
      borrow_date,
      due_date,
      return_date: null,
      status: 'Borrowed',
    });

    // décrémentation du stock
    await book.update({
      available_quantity: book.available_quantity - 1,
    });

    res.status(201).json({
      message: 'emprunt enregistré',
      borrow,
    });
  } catch (err) {
    res.status(400).json({
      message: 'Erreur création emprunt',
      error: err.message,
    });
  }
};

// retiurne un emprunt
export const returnBorrow = async (req, res) => {
  try {
    const { id } = req.params;

    const borrow = await Borrow.findByPk(id);

    if (!borrow) {
      return res.status(404).json({ message: "emprunt n'existe pas" });
    }

    //déjà retourné
    if (borrow.status === 'Returned') {
      return res.status(400).json({
        message: 'Cet emprunt est déjà retourné',
      });
    }

    const book = await Book.findByPk(borrow.book_id);

    borrow.return_date = new Date();
    borrow.status = 'Returned';

    await borrow.save();

    // incrémentation du stock
    await book.update({
      available_quantity: book.available_quantity + 1,
    });

    res.status(200).json({
      message: 'Livre retourné avec succès',
      borrow,
    });
  } catch (err) {
    res.status(400).json({
      message: 'Erreur retour emprunt',
      error: err.message,
    });
  }
};

//effacer un emprunt
export const deleteBorrow = async (req, res) => {
  try {
    const { id } = req.params;

    const borrow = await Borrow.findByPk(id);

    if (!borrow) {
      return res.status(404).json({ message: "emprunt n'existe pas" });
    }

    await borrow.destroy();

    res.status(200).json({ message: 'emprunt supprimé' });
  } catch (err) {
    res.status(400).json({
      message: 'Erreur suppression emprunt',
      error: err.message,
    });
  }
};