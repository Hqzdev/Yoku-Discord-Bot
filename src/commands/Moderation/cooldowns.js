const { EmbedBuilder } = require('discord.js');

const cooldowns = new Map();

module.exports = {
  name: 'cooldown',
  description: 'Set a cooldown for sending messages',
  options: [
    {
      name: 'time',
      description: 'Cooldown time in seconds',
      type: 4, // Integer
      required: true,
    },
  ],
  callback: async (client, interaction) => {
    const user = interaction.user; // Пользователь, который использует команду
    const cooldownTime = interaction.options.getInteger('time') * 1000; // Переводим секунды в миллисекунды

    // Проверяем, находится ли пользователь в кулдауне
    if (cooldowns.has(user.id)) {
      const expirationTime = cooldowns.get(user.id) + cooldownTime;

      if (Date.now() < expirationTime) {
        const timeLeft = (expirationTime - Date.now()) / 1000; // Время до истечения кулдауна
        const embed = new EmbedBuilder()
          .setColor('#FF0000')
          .setDescription(`⏳ | You are on cooldown! Please wait ${timeLeft.toFixed(1)} more seconds.`);
        
        return interaction.reply({ embeds: [embed], ephemeral: true });
      }
    }

    // Если пользователь не в кулдауне, ставим его
    cooldowns.set(user.id, Date.now());

    // Ваше действие, которое будет выполняться при использовании команды
    const embed = new EmbedBuilder()
      .setColor('#00FF00')
      .setDescription(`✅ | You can now use this command. Cooldown is set for ${interaction.options.getInteger('time')} seconds.`);
    
    interaction.reply({ embeds: [embed], ephemeral: true });

    // Удаляем пользователя из карты кулдауна по истечении времени
    setTimeout(() => {
      cooldowns.delete(user.id);
    }, cooldownTime);
  },
};
