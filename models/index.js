const Item = require('./item');
const MarketSnapshot = require('./marketSnapshot');
const ItemTrade = require('./itemTrade');

//DB associations
MarketSnapshot.hasMany(ItemTrade, { foreignKey: 'snapshot_id' });
ItemTrade.belongsTo(MarketSnapshot, { foreignKey: 'snapshot_id' });

Item.hasMany(ItemTrade, { foreignKey: 'item_id' });
ItemTrade.belongsTo(Item, { foreignKey: 'item_id' });

module.exports = {
  Item,
  MarketSnapshot,
  ItemTrade,
};