require('dotenv').config();
const { Client, IntentsBitField, Events, ActivityType, EmbedBuilder } = require('discord.js');
const mongoose = require('mongoose');
const eventHandler = require('./handlers/eventHandler');

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});
const LOG_CHANNEL_ID = '1014116819667259442'; 

let status = [
  {
    name: '⌨️ | Harmony Ai Bot',
    type: ActivityType.Playing,
  },
  {
    name: '💻 | Made by Haqz.dev',
    type: ActivityType.Playing,
  },
  {
    name: '🌙 | version 1.1 ',
    type: ActivityType.Playing,
  }
];

module.exports = {
  name: Events.ClientReady,
  once: true,
  execute(client) {
    console.log(`✅ | Yoku was made by Hqz.dev`);

    let currentStatusIndex = 0;

    setInterval(() => {
      const currentStatus = status[currentStatusIndex];
      client.user.setActivity(currentStatus.name, { type: currentStatus.type }); // Установка статуса
      currentStatusIndex = (currentStatusIndex + 1) % status.length; // Переход к следующему статусу
    }, 2500);
  },
};



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
      .setDescription(`📢| Created new channel by ${member.name}`)
      .setImage('https://media.discordapp.net/attachments/1014116819667259442/1114468611780784158/InShot_20230601_210530350.jpg?ex=66de0706&is=66dcb586&hm=2dd2199c9466aaf2e13089023f7c7ba612d1f3972b93eba5f1c941444a55f6bd&=&format=webp&width=1440&height=20');
      
  logChannel.send({ embeds: [embed] });
});

client.on('roleCreate', async (role) => {
  const logChannel = await client.channels.fetch(LOG_CHANNEL_ID);
  const embed = new EmbedBuilder()
  .setColor('#303135')  // Желтый цвет для создания роли
      .setTitle('Новая роль')
      .setDescription(`🆕 | Created new role by ${member.name}`)
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

(async () => {
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB.');

    eventHandler(client);

    client.login(process.env.TOKEN);
  } catch (error) {
    console.log(`Error: ${error}`);
  }
})();
