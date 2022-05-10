const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection'); //You may have to adjust this depending on location of database configuration
//const bcrypt = require('bcrypt');
//The above should only be used if you require password encryption, meaning that this is a User model

class Lap extends Model {
    //checkPassword(inputPw) {
        //return bcrypt.compareSync(inputPw,this.password);
    //}
}

Lap.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
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
        dist_type_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        group_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        history_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "history",
                key: "id"
            }
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
        modelName: 'lap'
    }
);


module.exports = Lap;