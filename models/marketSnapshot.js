const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const config = require('../config/config');

//Ensure table name matches the actual table name in the database
const MarketSnapshot = sequelize.define('MarketSnapshot', {
  snapshot_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  tableName: 'marketsnapshots', 
  timestamps: false,
});

module.exports = MarketSnapshot;