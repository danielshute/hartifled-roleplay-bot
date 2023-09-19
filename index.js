const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config()
const { loadCommands } = require('./loaders/slash')
const { loadEvents } = require('./loaders/event')
require('./db.js')

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildPresences, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildModeration ] });

loadCommands(client);
loadEvents(client);

client.login(process.env.TOKEN);