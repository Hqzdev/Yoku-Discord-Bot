const { SlashCommandBuilder } = require('discord.js');
const eco = require('C:/Users/wkeyq/OneDrive/Рабочий стол/Yoku/commands/Economy/app');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('balance')
    .setDescription('Check your current balance.'),
  async execute(interaction) {
    const balance = await eco.getBalance(interaction.user.id);
    await interaction.reply(`Your balance: ${balance}💰`);
  },
}; 