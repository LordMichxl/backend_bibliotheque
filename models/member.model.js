import sequelize from "../config/database.js" ;
import { DataTypes } from "sequelize" ;

const Member = sequelize.define("Member", {
    id: {
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true,

    },
    first_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    address: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    membership_date: {
        type: DataTypes.DATEONLY,
        defaultValue: DataTypes.NOW,
    },
    status:{
        type: DataTypes.ENUM('Active','Inactive'),
        defaultValue: "Active",

    }
}, {
    timestamps: true
});

export default Member ;