'''
Im including 2 queries in this file, one for creating the tables and one for retrieving the amount of sales over $days and the average estimated time to win an order.
The second quey is used in sqlQueries.js to retrieve the data for the dashboard.
'''


'''DROP TABLE IF EXISTS ItemTrades;
DROP TABLE IF EXISTS MarketSnapshots;
DROP TABLE IF EXISTS Items;
CREATE TABLE Items (
    item_id INT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE MarketSnapshots (
    snapshot_id SERIAL PRIMARY KEY,
    timestamp TIMESTAMP NOT NULL
);

CREATE TABLE ItemTrades (
    trade_id SERIAL PRIMARY KEY,
    item_id INT NOT NULL,
    snapshot_id INT NOT NULL,
    total_trades INT NOT NULL,
    amount_of_orders INT NOT NULL,
    FOREIGN KEY (item_id) REFERENCES Items(item_id),
    FOREIGN KEY (snapshot_id) REFERENCES MarketSnapshots(snapshot_id)
);

'''


'''
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
  '''
  