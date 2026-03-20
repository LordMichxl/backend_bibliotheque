import { Member, Book, Borrow } from '../models/index.js';

export const getStats = async (req, res) => {
  Promise.all([
    Member.count(),
    Member.count({ where: { status: 'Active' } }),
    Member.count({ where: { status: 'Inactive' } }),
    Book.count(),
    Book.sum('available_quantity'),
    Borrow.count({ where: { status: 'Borrowed' } }),
    Borrow.count({ where: { status: 'Returned' } }),
    Borrow.count({ where: { status: 'Overdue' } }),
    Borrow.count(),
  ])
    .then(([
      totalMembers,
      activeMembers,
      inactiveMembers,
      totalBooks,
      totalAvailableBooks,
      totalBorrowedBooks,
      totalReturnedBooks,
      totalOverdueBooks,
      totalBorrows,
    ]) => {
      res.status(200).json({
        members: { total: totalMembers, active: activeMembers, inactive: inactiveMembers },
        books: { total: totalBooks, available: totalAvailableBooks || 0 },
        borrows: { total: totalBorrows, borrowed: totalBorrowedBooks, returned: totalReturnedBooks, overdue: totalOverdueBooks },
      });
    })
    .catch((err) => {
      res.status(400).json({ message: 'Erreur stats', error: err.message });
    });
};
