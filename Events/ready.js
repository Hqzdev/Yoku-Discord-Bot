const { Client, Events, ActivityType, } = require('discord.js');

let status = [
  {
    name: '⌨️ | Written in node js',
    type: ActivityType.Playing,
  },
  {
    name: '💻 | Made by Haqz.dev',
    type: ActivityType.Playing,
  },
  {
    name: '🌙 | version 1.1 (BETA)',
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
