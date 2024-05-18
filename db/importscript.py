'''
This script was used to move a large amount of json files I had used to dump data from the BDO marketplace API and move it into a PostgreSQL database.
Leaving it here for reference.
'''

import os
import json
import psycopg2
from datetime import datetime
from tqdm import tqdm  


DB_HOST = 'localhost'
DB_NAME = 'market_data_db'
DB_USER = 'postgres'
DB_PASSWORD = ''


conn = psycopg2.connect(
    dbname=DB_NAME,
    user=DB_USER,
    password=DB_PASSWORD,
    host=DB_HOST
)
conn.autocommit = True

def insert_item(item_id, item_name, cursor):
    cursor.execute("SELECT item_id FROM Items WHERE item_id = %s", (item_id,))
    if cursor.fetchone() is None:
        cursor.execute("INSERT INTO Items (item_id, name) VALUES (%s, %s)", (item_id, item_name))

def insert_market_snapshot(timestamp, cursor):
    cursor.execute("INSERT INTO MarketSnapshots (timestamp) VALUES (%s) RETURNING snapshot_id", (timestamp,))
    snapshot_id = cursor.fetchone()[0]
    return snapshot_id

def insert_item_trade(item_id, snapshot_id, total_trades, amount_of_orders, cursor):
    cursor.execute("""
        INSERT INTO ItemTrades (item_id, snapshot_id, total_trades, amount_of_orders)
        VALUES (%s, %s, %s, %s)
    """, (item_id, snapshot_id, total_trades, amount_of_orders))

def process_json_files(directory):
    files = [f for f in os.listdir(directory) if f.endswith('.json')]
    cursor = conn.cursor()

    with tqdm(total=len(files), desc="Processing JSON files") as pbar:
        for filename in files:
            file_path = os.path.join(directory, filename)
            timestamp_str = filename.split('.')[0]
            file_timestamp = datetime.strptime(timestamp_str, '%Y-%m-%d_%H-%M')

            with open(file_path, 'r') as file:
                data = json.load(file)
                snapshot_id = insert_market_snapshot(file_timestamp, cursor)

                for item in data:
                    insert_item(item['id'], item['name'], cursor)
                    insert_item_trade(item['id'], snapshot_id, item['total_trades'], item['amount_of_orders'], cursor)
            pbar.update(1)

    cursor.close()


json_dir = './'


process_json_files(json_dir)


conn.close()
