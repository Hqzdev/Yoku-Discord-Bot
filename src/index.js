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
    IntentsBitField.Flags.GuildPresences,
  ],
});



const LOG_CHANNEL_ID = '1011160636979429386'; 
const CRASH_CHANNEL_ID = '1014116819667259442'
const WELCOME = '1010967528723451996'
const goodbye = '1011160636979429386'

client.on('guildMemberUpdate', async (member) => {
  const logs = await client.channels.fetch(LOG_CHANNEL_ID);
  const embed = new EmbedBuilder()
    .setColor('303135')
    .setTitle('Harmony 🌙')
    .setDescription('**Successfully | ✅** Thank you so much for boosting the server!\nWhat does this give you?\n__1.__ You now have access to view the audit log\n__2.__ You can now create a custom role for **3 weeks**\n__3.__ You can also post your codes in the channel <#1010981292126511296>\n__4.__ Additionally, you have been given the role <@&1012034055346331659> with special permissions')
  logs.send({ embeds: [embed] });
});

client.on('guildMemberAdd', async (member) => {
  const welcome = await client.channels.fetch(WELCOME);
  const embed = new EmbedBuilder()
      .setColor('#303135') 
      .setTitle('Harmony 🌙')
      .setDescription(`<:emoji_19:1011524159702048819> **Welcome, ${member}, to the unique server ${member.guild.name}!** 
**Your status** - ${member.status}
**Account created on** - ${member.user.createdAt}
**Joined us on** - ${member.joinedAt}
**Also, check out our [Rules](https://discord.gg/rP5EekXj) and [Roles](https://discord.gg/eZNjaQTA)**
__**We're glad to see you on our server!**__`);
  welcome.send({ embeds: [embed] });
});

client.on('guildMemberRemove', async (member) => {
  const goodbyeID = await client.channels.fetch(goodbye);
  const embed = new EmbedBuilder()
      .setColor('#303135')
      .setTitle('Harmony 🌙')
      .setDescription(`${member}, we're sad to see you leave the server. 
If you ever feel bored, you're welcome to come back!`);
  goodbyeID.send({ embeds: [embed] });
});




/**const OWNER_ID = '1268562577080713282'; 
const BOT_ID = '1281304366153859125';
client.on('channelCreate', async (channel) => {
    const crash = await client.channels.fetch(CRASH_CHANNEL_ID);
    if (channel.createdBy && (channel.createdBy === OWNER_ID || channel.createdBy === BOT_ID)) {
        return; 
    }
    await channel.delete();
    const embed = new EmbedBuilder()
        .setColor('#303135')
        .setTitle('Protected crash by Yoku AI')
        .setDescription('🗞 | The **channel** has been deleted by Yoku Protect');
    await crash.send({ embeds: [embed] });
}); 

client.on('roleCreate' ,async (role) => {
  const crash = await client.channels.fetch(CRASH_CHANNEL_ID);
  await role.delete()
  const embed = new EmbedBuilder()
  .setColor('#303135')
  .setTitle('Protected crash by Yoku AI')
  .setDescription('🔫 | The **role** has been deleted by Yoku Protect')

  crash.send({ embeds: [embed]})
  
}) */

client.on('messageDelete', async (message) => {
  const logChannel = await client.channels.fetch(LOG_CHANNEL_ID);
  if (message.partial) await message.fetch(); 
  const embed = new EmbedBuilder()
  .setColor('#303135') 
      .setTitle('Harmony 🌙')
      .setDescription(`🗑 | Message deleted from the ${message.author}: __${message.content}__`);
      
  logChannel.send({ embeds: [embed] });
});

client.on('guildMemberAdd', async (member) => {
  const logChannel = await client.channels.fetch(LOG_CHANNEL_ID); 

  if (member.user.bot) {
    // Блокировка бота
    await member.ban({ reason: 'Bot automatically removed by Yoku Protect' });

    const embed = new EmbedBuilder()
      .setColor('#303135') 
      .setTitle('Protected crash by Yoku AI')
      .setDescription('🤖 | The **bot** has been banned by Yoku Protect');

    // Исправление опечатки: должно быть "embeds", а не "emdebs"
    logChannel.send({ embeds: [embed] });
  }
});



(async () => {
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ | Connected to DB.');

    eventHandler(client);

    client.login(process.env.TOKEN);
  } catch (error) {
    console.log(`Error: ${error}`);
  }
})();
