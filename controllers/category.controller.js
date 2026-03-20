import { Category } from '../models/index.js'; 
import { Book } from '../models/index.js';

export const getCategory = async (req, res) =>{
    try {
        const categories = await Category.findAll({
            include:[{
                model: Book,
                attributes: ['id'],
            }]
        });
        return res.status(200).json({categories:categories})
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
}

export const addCategory = async (req,res) =>{
    const {name, description } = req.body;
    await Category.create({
        name,
        description
    })
    .then(Category =>(
        res.status(201).json({message: "Catégorie crée", Categorie: Category})
    ))
    .catch(err=>{
        res.status(500).json({error:err.message})
    })
}

export const updateCategory = async(req,res) => {
    try{
        const id = req.params.id;
        const {name, description} = req.body;
        const category =await Category.findByPk(id);
        if (!category) {
            res.status(404).json({message:"catégorie n'existe pas"})
        }
    
      await category.update({name, description})
    return res.status(200).json({message: "catégorie mise à jour"})
    } catch(err){
        return res.status(500).json({message: "la mise à jour a échoué", error: err.message})
    }
}

export const deleteCategory = async(req,res) => {
    const{id} = req.params;
    const category =await Category.findByPk(id);
    if (!category) {
        res.status(404).json({message:"catégorie n'existe pas"})
    }
    try{
        await category.destroy()
        return res.status(200).json({message:"Catégorie supprimée"})
    } catch(error){
        return res.status(404).json({message: "la suprpession a echoué", erreur: error})
    }
}