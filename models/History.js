const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection'); //You may have to adjust this depending on location of database configuration
//const bcrypt = require('bcrypt');
//The above should only be used if you require password encryption, meaning that this is a User model

class History extends Model {
    //checkPassword(inputPw) {
        //return bcrypt.compareSync(inputPw,this.password);
    //}
}

History.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        title: {
            type: DataTypes.STRING(50),
            allowNull: false,
            validate: {
                len: [1,50]
            }
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
            defaultValue: ""
        },
        act_date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        distance: {
            type: DataTypes.DECIMAL(10,3),
            allowNull: false
        },
        duration: {
            type: DataTypes.DECIMAL(10,2),
            allowNull: false
        },
        effort_type_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        type_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        dist_type_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },
    {
        //hooks: {
            ////The following two hooks are used to encrypt a User password and encrypt any new password before saving - they can be deleted if not needed
            //async beforeCreate(newUserData) {
                //newUserData.password = await bcrypt.hash(newUserData.password, 10);
                //return newUserData;
            //},
            //async beforeUpdate(updatedUserData) {
                //updatedUserData.password = await bcrypt.hash(updatedUserData.password, 10);
                //return updatedUserData;
            //}
        //},
        //pass in our imported sequelize connection (the direct connection to our database)
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: 'history'
    }
);


module.exports = History;