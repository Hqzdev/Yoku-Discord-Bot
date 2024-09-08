require('dotenv').config();
const fs = require('node:fs');
const path = require('node:path');
const { Collection } = require('discord.js');
const { Client, Events, GatewayIntentBits, IntentsBitField, EmbedBuilder } = require('discord.js');
const mongoose = require('mongoose'); 
const {  mongoDB } = require('./config.json');
const client = new Client({ intents: [GatewayIntentBits.Guilds, IntentsBitField.Flags.GuildMembers, IntentsBitField.Flags.GuildMessages, IntentsBitField.Flags.MessageContent, IntentsBitField.Flags.GuildPresences] });


client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
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
  try {
      mongoose.set('strictQuery', false);
      await mongoose.connect(mongoDB);
      console.log('✅ | Succesfully connected to mongoDB');
  } catch (error) {
      console.error(`Ошибка подключения к MongoDB: ${error}`);
  }
});

const LOG_CHANNEL_ID = '1014116819667259442'; 



client.on('guildMemberAdd', async (member) => {
  const logChannel = await client.channels.fetch(LOG_CHANNEL_ID);
  const embed = new EmbedBuilder()
      .setColor('#303135') // Зеленый цвет для присоединения
      .setTitle('Harmony 🌙')
      .setDescription(`<:emoji_19:1011524159702048819>**Добро пожаловать ${member} на уникальный сервер ${member.guild.name}** 
**Твой статус** - ${member.status}
**Дата регистрации** - ${member.user.createdAt}
**К нам пришел** - ${member.joinedAt}
**Также прочитай наши [Правила](https://discord.gg/rP5EekXj) и [Роли](https://discord.gg/eZNjaQTA)**
__**Мы рады тебя видеть на нашем сервере**__`)
      .setImage('https://media.discordapp.net/attachments/1014116819667259442/1114468611780784158/InShot_20230601_210530350.jpg?ex=66de0706&is=66dcb586&hm=2dd2199c9466aaf2e13089023f7c7ba612d1f3972b93eba5f1c941444a55f6bd&=&format=webp&width=1440&height=20');
      
  logChannel.send({ embeds: [embed] });
});


client.on('guildMemberRemove', async (member) => {
  const logChannel = await client.channels.fetch(LOG_CHANNEL_ID);
  const embed = new EmbedBuilder()
      .setColor('#303135') // Красный цвет для ухода
      .setTitle('Harmony 🌙')
      .setDescription(` ${member}, Жаль что ты ушел с сервера
Если тебе станет скучно приходи(`)
.setImage('https://media.discordapp.net/attachments/1014116819667259442/1114468611780784158/InShot_20230601_210530350.jpg?ex=66de0706&is=66dcb586&hm=2dd2199c9466aaf2e13089023f7c7ba612d1f3972b93eba5f1c941444a55f6bd&=&format=webp&width=1440&height=20');
      
  logChannel.send({ embeds: [embed] });
});

client.on('channelCreate', async (channel) => {
  const logChannel = await client.channels.fetch(LOG_CHANNEL_ID);
  const embed = new EmbedBuilder()
  .setColor('#303135')  // Синий цвет для создания канала
      .setTitle('Новый канал')
      .setDescription(`📢| Created new channel: ${channel.name} by ${member}`)
      .setImage('https://media.discordapp.net/attachments/1014116819667259442/1114468611780784158/InShot_20230601_210530350.jpg?ex=66de0706&is=66dcb586&hm=2dd2199c9466aaf2e13089023f7c7ba612d1f3972b93eba5f1c941444a55f6bd&=&format=webp&width=1440&height=20');
      
  logChannel.send({ embeds: [embed] });
});

client.on('roleCreate', async (role) => {
  const logChannel = await client.channels.fetch(LOG_CHANNEL_ID);
  const embed = new EmbedBuilder()
  .setColor('#303135')  // Желтый цвет для создания роли
      .setTitle('Новая роль')
      .setDescription(`🆕 | Created new role: ${channel.name} by ${member}`)
      .setImage('https://media.discordapp.net/attachments/1014116819667259442/1114468611780784158/InShot_20230601_210530350.jpg?ex=66de0706&is=66dcb586&hm=2dd2199c9466aaf2e13089023f7c7ba612d1f3972b93eba5f1c941444a55f6bd&=&format=webp&width=1440&height=20');
      
  logChannel.send({ embeds: [embed] });
});

client.on('messageDelete', async (message) => {
  const logChannel = await client.channels.fetch(LOG_CHANNEL_ID);
  if (message.partial) await message.fetch(); // Получаем полное сообщение, если оно частичное
  const embed = new EmbedBuilder()
  .setColor('#303135')  // Фиолетовый цвет для удаления сообщения
      .setTitle('Сообщение удалено')
      .setDescription(`🗑 Message deleted from the ${message.author}: __${message.content}__`)
      .setImage('https://media.discordapp.net/attachments/1014116819667259442/1114468611780784158/InShot_20230601_210530350.jpg?ex=66de0706&is=66dcb586&hm=2dd2199c9466aaf2e13089023f7c7ba612d1f3972b93eba5f1c941444a55f6bd&=&format=webp&width=1440&height=20');
      
  logChannel.send({ embeds: [embed] });
});

client.on('guildMemberAdd', async (member) => {
 const logChannel = await client.channels.fetch(LOG_CHANNEL_ID); 
 if (member.user.bot) {
  const embed = new EmbedBuilder()
  .setColor('#303135') 
  .setTitle('Member Leave')
  .setDescription(`🤖 Bot added ${member}`)
  .setImage('https://media.discordapp.net/attachments/1014116819667259442/1114468611780784158/InShot_20230601_210530350.jpg?ex=66de0706&is=66dcb586&hm=2dd2199c9466aaf2e13089023f7c7ba612d1f3972b93eba5f1c941444a55f6bd&=&format=webp&width=1440&height=20');
      
  logChannel.send({emdebs: [emdeb]});
}});



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

client.login(process.env.token);
