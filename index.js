require('dotenv').config();
const fs = require('node:fs');
const path = require('node:path');
const { Collection } = require('discord.js');
const { Client, Events, GatewayIntentBits, IntentsBitField } = require('discord.js');
const mongoose = require('mongoose'); 
const { token } = require('./config.json');
const { mongoDB } = require('./config.json');
const Level = require('./models/Level'); 

const client = new Client({ intents: [GatewayIntentBits.Guilds, IntentsBitField.Flags.GuildMembers, IntentsBitField.Flags.GuildMessages] });

client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

// Загружаем команды из папок
for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    // Проверяем наличие свойств "data" и "execute"
    if ('data' in command && 'execute' in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(`[WARNING] Команда в ${filePath} не содержит обязательные свойства "data" или "execute".`);
    }
  }
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);

  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

client.once(Events.ClientReady, async () => {
  console.log(` `);
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(mongoDB);
    console.log('✅ | Succesfully connected to mongoDB');
  } catch (error) {
    console.error(`Ошибка подключения к MongoDB: ${error}`);
  }

 
});

client.on(Events.GuildMemberAdd, async (member) => {
  try {
    const existingLevel = await Level.findOne({
      userId: member.id,
      guildId: member.guild.id
    });

    if (!existingLevel) {
      const newLevel = new Level({
        userId: member.id,
        guildId: member.guild.id,
        level: 1,
        xp: 0,
      });
      await newLevel.save();
    }
  } catch (error) {
    console.error('Error creating level for new member:', error);
  }
});




console.log('________________________')
console.log('| Adminisrtrative | ✅ |')
console.log('| Economy         | ✅ |')
console.log('| Main            | ✅ |')
console.log('| Moderation      | ✅ |')
console.log('| Music           | ✅ |')
console.log('| Settings        | ✅ |')
console.log('| Events          | ✅ |')
console.log('| MongoDB         | ✅ |')
console.log('________________________')
  client.login(token);
