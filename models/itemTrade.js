const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

//Ensure table name matches the actual table name in the database
const ItemTrade = sequelize.define('ItemTrade', {
  trade_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  item_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'items', 
      key: 'item_id',
    },
    allowNull: false,
  },
  snapshot_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'marketsnapshots', 
      key: 'snapshot_id',
    },
    allowNull: false,
  },
  total_trades: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  amount_of_orders: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'itemtrades', 
  timestamps: false,
});


//console.log('ItemTrade model defined:', ItemTrade === sequelize.models.ItemTrade);

module.exports = ItemTrade;