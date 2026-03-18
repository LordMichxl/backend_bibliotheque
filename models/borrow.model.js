import sequelize from "../config/database.js" ;
import { DataTypes } from "sequelize" ;

const Borrow = sequelize.define("Borrow", {
    id: {
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true,

    },
    borrow_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    due_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    return_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    status:{
        type: DataTypes.ENUM('Borrowed','Returned','Overdue'),
    } 
}, {
    timestamps: true
});

export default Borrow ;