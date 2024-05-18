const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

//Ensure table name matches the actual table name in the database
const Item = sequelize.define('Item', {
  item_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'items', 
  timestamps: false,
});

module.exports = Item;