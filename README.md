# BDMarket

BDMarket is a single-page application (SPA) designed to display Pearl Items (Real money value items) transaction data from the Black Desert Online marketplace. The application fetches data from a PostgreSQL database and is accessible only to whitelisted users through Discord OAuth authentication.

The second goal is to provide access to the marketplace registration queue that happens when items of value over 10b silvers are registered on the market. Using a discord bot users can register for an item and get notified ahead when the item is registered so they have 10~ minutes to place an order on it. The registration data can be added and removed via the discord bot and viewed on the SPA dashboard.

## Overview

The project employs a modern tech stack to deliver a responsive and secure user experience. Below are the primary technologies and architecture components used:

- **Backend**: Node.js with Express framework, Python for API scraping
- **Database**: PostgreSQL
- **ORM**: Sequelize
- **Frontend**: Vanilla JavaScript with Bootstrap
- **View Engine**: EJS
- **Authentication**: Discord OAuth

The project structure includes separate modules for routes, models, configuration, and views, ensuring a modular and maintainable codebase.

## Features

- **Login Page**: Authenticate users via Discord OAuth. Only whitelisted users can access the application.
- **Main Dashboard/Table View**: Displays the top 10 items with the most sales in the last 24 hours. The table includes columns for Item Name, Sales in Days, and Estimated Waiting Time.
- **Logout Functionality**: Allows users to log out from the application and refreshes to de-authorize them.
- **User Registrations**: Displays a table of items the user is registered for based on the `registrations.json` file. This data is dynamically reloaded whenever the user refreshes the page.
- **Customizable Sales Data**: Users can choose to see sales data for the last 7 days, 3 days, or 24 hours using buttons on the dashboard.
- **API Scraping**: Uses a Python script to scrape the BDO marketplace API for sales data.
- **Discord Bot**: A bot that allows users to register for an item and get notified ahead when the item is registered.

## Getting started with the SPA

### Requirements

Ensure you have the following installed on your computer:

- Node.js (v14.x or later)
- PostgreSQL
- Discord Developer Account
- Python 3.10+

### Quickstart


1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd bdmarket
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up the environment variables:**

   Create a `.env` file in the root directory and add the following variables:

   ```plaintext
   PORT=3000
   SESSION_SECRET=your_session_secret
   DB_HOST=localhost
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_NAME=market_data_db
   DB_DIALECT=postgres
   DB_PORT=5432
   DISCORD_CLIENT_ID=your_discord_client_id
   DISCORD_CLIENT_SECRET=your_discord_client_secret
   DISCORD_CALLBACK_URL=http://localhost:3000/auth/callback
   WHITELISTED_USERS=comma_separated_list_of_discord_user_ids
   NODE_ENV=development
   ```

4. **Create the PostgreSQL database:**

   ```bash
   sudo -u postgres psql -c
   CREATE DATABASE market_data_db;
   \c market_data_db;
   ```
   
   Use the query provided in `db/query.sql` to create the required tables.

5. **Populate the PostgreSQL db:**

   ```bash
   cd ./scripts/
   pip install -r requirements.txt
   ```

   Run the `scripts/scrape.py` script to create the base market data json file. This script needs to be ran if the game adds new Pearl Items to the marketplace.

   Fill in the database data in the `scripts/newmain.py` script and run it to populate the database with the market data, this script should be ran as often as you want to have more data points and more accurate sales overtime and preorder time estimations.

   (if you have less than a few days worth of snapshots the query to retrieves salves might fail)

   Run the `scripts/waitinglist.py` to to create the json containing the current waiting list data, this script should be ran very often to always have the most up to date waiting list data to be able to notify the user in time.

6. **Run Discord bot:**

   Run the `scripts/finalbot.py` script to start the discord bot. Using this bot commands you can create and remove items registrations.

7. **Start the application:**

   ```bash
   npm start
   ```

   The application will be available at `http://localhost:3000`.

