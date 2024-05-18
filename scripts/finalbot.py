"""
This module provides a Discord bot that allows users to register and monitor the market for specific items and enhancement levels. The bot has the following commands:

- `!register <item_id> <enhancement_level>`: Registers the user for the specified item and enhancement level.
- `!remove <item_id> <enhancement_level>`: Removes the user's registration for the specified item and enhancement level.
- `!listall`: Lists all the items the user is registered for.

The bot also periodically checks the market data and sends notifications to users when their registered items are listed.
"""

import discord
from discord.ext import commands
import json
import requests
import asyncio
import aiohttp
#from compute import compute_sales


intents = discord.Intents.all()
intents.messages = True
intents.guilds = True
client = discord.Client(intents=intents)

bot = commands.Bot(command_prefix='!', intents=intents)


def load_registrations():
    try:
        with open('registrations.json', 'r') as file:
            return json.load(file)
    except FileNotFoundError:
        return {}

def save_registrations(data):
    with open('registrations.json', 'w') as file:
        json.dump(data, file, indent=4)

async def register_user(user_id, item_id, enhancement_level):
    registrations = load_registrations()
    user_id_str = str(user_id)

    item_name = await fetch_item_name(item_id, enhancement_level) or "Unknown Item"

    if user_id_str not in registrations:
        registrations[user_id_str] = []

    if not any(reg['item_id'] == item_id and reg['enhancement_level'] == enhancement_level for reg in registrations[user_id_str]):
        registrations[user_id_str].append({'item_id': item_id, 'enhancement_level': enhancement_level, 'item_name': item_name})

    save_registrations(registrations)

def remove_user_registration(user_id, item_id, enhancement_level):
    registrations = load_registrations()
    user_id_str = str(user_id)

    if user_id_str in registrations:
        registrations[user_id_str] = [reg for reg in registrations[user_id_str] if not (reg['item_id'] == item_id and reg['enhancement_level'] == enhancement_level)]

        if not registrations[user_id_str]:
            del registrations[user_id_str]

        save_registrations(registrations)
        return True

    return False

async def fetch_item_name(item_id, enhancement_level):
    async with aiohttp.ClientSession() as session:
        async with session.get(f"https://api.arsha.io/v2/eu/item?id={item_id}&lang=en") as response:
            if response.status == 200:
                items = await response.json()
                for item in items:
                    if str(item.get('maxEnhance', 0)) == enhancement_level:
                        return item.get('name')
    return None

async def check_market_data():
    while True:
        try:
            with open('market_data.json', 'r') as file:
                market_data = json.load(file)

            registrations = load_registrations()

            for user_id, user_regs in registrations.items():
                for reg in user_regs:
                    for item in market_data:
                        if item.get('Item ID') == reg.get('item_id') and item.get('Enhancement Level') == reg.get('enhancement_level'):
                            item_name = await fetch_item_name(reg['item_id'], reg['enhancement_level']) or "Item"
                            user = await bot.fetch_user(int(user_id))
                            await user.send(f"{item_name} with enhancement level {reg['enhancement_level']} has been listed at {item['Timestamp']}")
        except Exception as e:
            print(f"An error occurred: {e}")

        await asyncio.sleep(420)  #Check every 7 minutes


@bot.command(name='register')
async def on_register(ctx, item_id: str, enhancement_level: str):
    await register_user(ctx.author.id, item_id, enhancement_level)
    await ctx.send(f"{ctx.author.mention}, you're now registered for item ID {item_id} with enhancement level {enhancement_level}.")

@bot.command(name='remove')
async def on_remove(ctx, item_id: str, enhancement_level: str):
    if remove_user_registration(ctx.author.id, item_id, enhancement_level):
        await ctx.send(f"{ctx.author.mention}, your registration for item ID {item_id} with enhancement level {enhancement_level} has been removed.")
    else:
        await ctx.send(f"{ctx.author.mention}, no registration found for item ID {item_id} with enhancement level {enhancement_level}.")

@bot.command(name='listall')
async def on_listall(ctx):
    user_id_str = str(ctx.author.id)
    registrations = load_registrations()

    if user_id_str in registrations:
        registered_items = registrations[user_id_str]
        if registered_items:
            response = "You're registered for the following items:\n"
            for reg in registered_items:
                response += f"Item Name: {reg['item_name']}, ID: {reg['item_id']}, Enhancement Level: {reg['enhancement_level']}\n"
        else:
            response = "You have no registered items."
    else:
        response = "You have no registered items."

    await ctx.send(f"{ctx.author.mention}, {response}")




#Main loop
@bot.event
async def on_ready():
    print(f'We have logged in as {bot.user}')
    bot.loop.create_task(check_market_data())


bot.run('TOKEN')


