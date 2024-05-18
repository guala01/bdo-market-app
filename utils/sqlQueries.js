const { QueryTypes } = require('sequelize');
const sequelize = require('../config/database');

async function fetchDashboardData(days) {
  try {
    console.log(`Executing SQL query for the past ${days} days`);

    const query = `

      WITH LatestTimestamp AS (
      SELECT MAX(timestamp) AS latest_timestamp
      FROM MarketSnapshots
  ),
  ClosestSevenDaysAgo AS (
      SELECT 
          timestamp,
          ABS(EXTRACT(EPOCH FROM (timestamp - (SELECT latest_timestamp FROM LatestTimestamp) + INTERVAL '${days} days'))) AS time_diff
      FROM MarketSnapshots
      ORDER BY time_diff ASC
      LIMIT 1
  ),
  SalesLatest AS (
      SELECT 
          it.item_id,
          SUM(it.total_trades) AS sales_latest,
          SUM(it.amount_of_orders) AS orders_latest
      FROM ItemTrades it
      JOIN MarketSnapshots ms ON it.snapshot_id = ms.snapshot_id
      JOIN LatestTimestamp lt ON ms.timestamp = lt.latest_timestamp
      GROUP BY it.item_id
  ),
  SalesSevenDaysAgo AS (
      SELECT 
          it.item_id,
          SUM(it.total_trades) AS sales_seven_days_ago,
          SUM(it.amount_of_orders) AS orders_seven_days_ago
      FROM ItemTrades it
      JOIN MarketSnapshots ms ON it.snapshot_id = ms.snapshot_id
      JOIN ClosestSevenDaysAgo csda ON ms.timestamp = csda.timestamp
      GROUP BY it.item_id
  )
  SELECT 
      i.name,
      COALESCE(sl.sales_latest, 0) - COALESCE(ss.sales_seven_days_ago, 0) AS sales_difference,
      CASE
          WHEN sl.orders_latest > 0 AND (COALESCE(sl.sales_latest, 0) - COALESCE(ss.sales_seven_days_ago, 0)) > 0 THEN
              CASE
                  WHEN ((${days} * 24.0) / (COALESCE(sl.sales_latest, 0) - COALESCE(ss.sales_seven_days_ago, 0))) * sl.orders_latest > 24 THEN
                      ROUND((((${days} * 24.0) / (COALESCE(sl.sales_latest, 0) - COALESCE(ss.sales_seven_days_ago, 0))) * sl.orders_latest) / 24, 2) || ' days'
                  ELSE
                      ROUND(((${days} * 24.0) / (COALESCE(sl.sales_latest, 0) - COALESCE(ss.sales_seven_days_ago, 0))) * sl.orders_latest, 2) || ' hours'
              END
          ELSE 'N/A'
      END AS estimated_preorder_time
  FROM Items i
  LEFT JOIN SalesLatest sl ON i.item_id = sl.item_id
  LEFT JOIN SalesSevenDaysAgo ss ON i.item_id = ss.item_id
  ORDER BY sales_difference DESC
  LIMIT 10;
    `;

    const data = await sequelize.query(query, { type: QueryTypes.SELECT });
    console.log(`Query executed successfully, fetched ${data.length} records`);
    return data;
  } catch (error) {
    console.error('Error executing SQL query:', error.message, error.stack);
    throw new Error('Internal Server Error');
  }
}

module.exports = {
  fetchDashboardData,
};
