import jwt from "jsonwebtoken"
//verification  de l'authentification de l'utilisateur et de la validité du token
export const auth  = (req,res,next) =>{
   
    try{
        const authHead = req.headers.authorization;
        if(!authHead){
            return res.status(401).json({message:"Authorisation manquant"})
        }

        //formattage du bearer
        const token =authHead.split(" ")[1]
        if(!token){
            return res.status(401).json({message:"Token manquant"})
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.userId= decoded.id
        req.user= decoded
        next()
    }catch(error){
        return res.status(401).json({message: "Token Invalide",erreur: error.message})
    }
}

