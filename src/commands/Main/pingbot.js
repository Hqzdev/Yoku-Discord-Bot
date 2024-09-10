const { SlashCommandBuilder, Client } = require('discord.js');
module.exports = {
    
  data: new SlashCommandBuilder()
    .setName('ping-bot')
    .setDescription('Ping Yoky'),
  async execute(interaction) {
    const client = interaction.client;
    interaction.reply(`Websocket heartbeat: ${client.ws.ping}ms.`); 
  },
};
