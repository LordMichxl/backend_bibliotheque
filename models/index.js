import sequelize from "../config/database.js";
import Book from "./book.model.js";
import Borrow from "./borrow.model.js";
import User from "./user.model.js";
import Member from "./member.model.js";
import Category from "./category.model.js";
//definissons les associations
Category.hasMany(Book, { foreignKey: 'category_id' });
Book.belongsTo(Category, { foreignKey: 'category_id' });

Borrow.belongsTo(Member, { foreignKey: 'member_id', as: 'member' });
Member.hasMany(Borrow, { foreignKey: 'member_id', as: 'borrows' });

Borrow.belongsTo(Book, { foreignKey: 'book_id', as: 'book' });
Book.hasMany(Borrow, { foreignKey: 'book_id', as: 'borrows' });

export {sequelize, User, Category, Book, Member, Borrow};

