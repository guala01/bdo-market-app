"""
Scrapes data from BDO marketplace api and returns all the pearl items that exists in a json ready for main.py to process and parse.
This script is meant to be run after every maintenance to update if new items have been added.

Args:
    url (str): The URL of the website to scrape.
    selector (str): The CSS selector to use for scraping the data.

Returns:
    list: A list of the scraped data.
"""

import requests
import json
import logging


logging.basicConfig(filename='main.log', filemode='a', format='%(asctime)s - %(levelname)s - %(message)s', level=logging.INFO)


def fetch_and_save_data(region):
    api_url = f"https://api.arsha.io/v2/{region}/pearlItems"
    try:
        response = requests.get(api_url)
        if response.status_code == 200:
            data = response.json()
            excluded_ids = [18946, 290006] # Exclude special items you dont want to parse by ids
            cleaned_data = [
                {
                    "id": item["id"], "name": item["name"]
                } 
                for item in data 
                if ("set" in item["name"].lower() or "box" in item["name"].lower()) 
                and "horse" not in item["name"].lower() 
                and "donkey" not in item["name"].lower()
                and item["id"] not in excluded_ids
            ]            
            with open('cleaned_data.json', 'w') as json_file:
                json.dump(cleaned_data, json_file, indent=4)
            logging.info("Data successfully saved to 'cleaned_data.json'.")
        else:
            logging.error("Failed to fetch data from the API. Status Code: " + str(response.status_code))
    except Exception as e:
        logging.error(f"An error occurred: {str(e)}")


fetch_and_save_data("eu")
