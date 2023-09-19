// commandUpdater.js
const fs = require('fs');
const path = require('path');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { Collection } = require('discord.js');

function getCommands(dir, filter) {
  let files = [];

  fs.readdirSync(dir).forEach(file => {
    const filePath = path.join(dir, file);
    const fileStat = fs.statSync(filePath);

    if (fileStat.isDirectory()) {
      const subdirectoryFiles = getCommands(filePath, filter);
      files = files.concat(subdirectoryFiles);
    } else if (filter(file)) {
      files.push('../' + filePath);
    }
  });

  return files;
}

function loadCommands(client) {
  const commands = [];
  client.commands = new Collection();

  const commandFiles = getCommands('./commands', file => file.endsWith('.js'));

  for (const file of commandFiles) {
    const command = require(`${file}`);
    commands.push(command.data.toJSON());
    client.commands.set(command.data.name, command);
  }

  const rest = new REST().setToken(process.env.TOKEN);

  (async () => {
    try {
      console.log(`Started refreshing ${commands.length} application (/) commands.`);
      const data = await rest.put(
        Routes.applicationCommands('841018006124888123'),
        { body: commands },
      );
      console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
      console.error(error);
    }
  })();
}

module.exports = { loadCommands };
