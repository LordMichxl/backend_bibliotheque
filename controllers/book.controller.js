import fs from "fs"
import {Op} from "sequelize"
import { Book, Category } from '../models/index.js'

export const getBooks = async (req, res) =>{
    try {
        const {search, category_id, page= 1,limit =10 } = req.query;
        const where  = {}
        if (search){
            where[Op.or] =[
            {title: {[Op.like]: `%${search}%`}},
            {author: {[Op.like]: `%${search}%`}}
            ]
        }

        if (category_id){
            where.category_id = category_id
        }
        const offset = (page - 1) * limit;

        const {count, rows} = await Book.findAndCountAll({
            where,
            include:[{
                model: Category,
                attributes:['id', 'name']
            }],
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['createdAt','DESC']]

        });
            return res.status(200).json({
            total: count,
            page: parseInt(page),
            totalPages: Math.ceil(count / limit),
            books: rows
        });

    } catch (error) {
        return res.status(500).json(error.message);
    }
}

export const addBook = async (req, res)=>{
    try {
        const {title, author, isbn, category_id, quantity,available_quantity, description} =req.body;
        const category =await Category.findByPk(category_id)
        if(!category){
            return res.status(404).json({message: "catégory n'existe pas "})
        }
        const book = await Book.create({
            title, 
            author,
            isbn, 
            category_id, 
            quantity,
            available_quantity, 
            description, 
            cover_image : req.file ? req.file.filename: null
        })
        return res.status(201).json({message:"Livre créé"})
    } catch (error) {
        return res.status(500).json(error.message)
       
    }
}
export const updateBook = async (req, res)=>{
    try {
        const {id} = req.params
        const {title, author, isbn, category_id, quantity,available_quantity, description} =req.body;
        const book = await Book.findByPk(id)
        if(!book){
            return res.status(404).json({message: "Livre non existant "})
        }
        await book.update({
            title, 
            author,
            isbn, 
            category_id, 
            quantity,
            available_quantity, 
            description, 
            cover_image : req.file ? req.file.filename: book.cover_image
        })
        await book.reload();
        return res.status(200).json({message:" Livre modifié"})
    } catch (error) {
        return res.status(500).json(error.message)
       
    }
}

export const deleteBook = async (req, res)=>{
    try {
        const {id} = req.params
        const book = await Book.findByPk(id)
        if(!book){
            return res.status(404).json({message: "Book n'existe pas "})
        }
        const path =`uploads/${book.cover_image}`
       if (fs.existsSync(path)){
            fs.unlinkSync(path)
       }
        await book.destroy()
        return res.status(200).json({message:"Livre supprimé"})
    } catch (error) {
        return res.status(500).json(error.message)
    }
}
