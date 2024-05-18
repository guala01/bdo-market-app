"""
When Items are registered in the Black Desert Online marketplace and are of 10b silver or more value they are placed in a waiting list. 

This scrippt will scrape the waiting list and return the items that are currently in the waiting list.

The `fetch_and_parse_market_data()` function retrieves the market waiting list data from the game's API, parses the response, and returns a list of dictionaries containing the item details.

The `save_to_json()` function takes the parsed market data and saves it to a JSON file named "market_data.json".

The `main()` function calls `fetch_and_parse_market_data()` and then saves the resulting data to a JSON file using `save_to_json()`.
"""

import requests
import datetime
import json
import logging

logging.basicConfig(filename='wlist.log', filemode='a', format='%(asctime)s - %(levelname)s - %(message)s', level=logging.INFO)

def fetch_and_parse_market_data():
    url = "https://eu-trade.naeu.playblackdesert.com/Trademarket/GetWorldMarketWaitList"
    headers = {
        'Content-Type': 'application/json',
        'User-Agent': 'BlackDesert'
    }

    response = requests.post(url, headers=headers)

    if response.status_code == 200:
        data = response.json()
        return parse_data(data['resultMsg'])
    else:
        logging.error(f"Error: Received status code {response.status_code}")
        return None

def parse_data(data):
    if data == '0':
        logging.info("No items in the market waiting list.")
        return []

    items = data.split('|')
    parsed_items = []

    for item in items:
        if item:
            details = item.split('-')
            if len(details) == 4:
                timestamp = int(details[3])
                readable_timestamp = datetime.datetime.fromtimestamp(timestamp).strftime('%Y-%m-%d %H:%M:%S')
                item_dict = {
                    'Item ID': details[0],
                    'Enhancement Level': details[1],
                    'Price': details[2],
                    'Timestamp': readable_timestamp
                }
                parsed_items.append(item_dict)
            else:
                logging.error(f"Skipping malformed item: {item}")

    return parsed_items

def save_to_json(data, filename="market_data.json"):

    with open(filename, 'w') as json_file:
        json.dump(data, json_file, indent=4)
        logging.info(f"Market data successfully saved to {filename}.")
def main():
    market_data = fetch_and_parse_market_data()
    if market_data is not None and market_data:  
        save_to_json(market_data)


main()
