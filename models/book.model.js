import sequelize from "../config/database.js" ;
import { DataTypes } from "sequelize" ;

const Book = sequelize.define("Book", {
    id: {
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true,

    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    author: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    isbn: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true,
    },
     description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    },
    available_quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    },
    cover_image: {
        type: DataTypes.STRING,
        allowNull: true,
    }
}, {
    timestamps: true
});

export default Book ;