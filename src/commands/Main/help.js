const { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, SlashCommandBuilder, EmbedBuilder } = require('discord.js');


module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Help about bot commands'),

  async execute(interaction) {
    const member = interaction.member; 

    const embed = new EmbedBuilder()
      .setColor(0x343434) 
      .setTitle('**List of available commands**')
      .setAuthor({ name: 'Yoku', iconURL: 'https://cdn.discordapp.com/attachments/1014116819667259442/1268179735050190889/IMG_20240731_171318_881.jpg?ex=66ab7bea&is=66aa2a6a&hm=896e072e4a5de221d567d2ca4593fd6c1e7c8fa15e249ed77d545f86572afc2c&' })
      .addFields(
        { name: '<:utilitybanhammer:1268981837951139841> **Administrative**', value:'\n/say /giveaway /add-money /reload /mutes /bans', inline: true },
        { name: '<:emoji_145:1268994497564377088> **Main**', value: '\n/level /reactions /avatar /help /info /invite /ping /ping-bot /profile /server /user', inline: true },
        { name: '<:80534discordserverdeveloper:1268557806848704604> **Moderation**', value: '\n/check-rep /unban /unmute /ban /clear /kick /mute /change-name /remove-name', inline: false },
        { name: '<:emoji_144:1268993835778707550> **Settings**', value: '\n/anti-crash /auto-mod/logs /settings /reset-lvl', inline: false },
        { name: '<:emoji_146:1268995016723009639> **Economy**', value: '\n/leaderboard /balance /timely /pay /convert /buy /shop', inline: false },
        { name: '<:emoji_145:1268994123831054417> **Music**', value: '\n/play /queue /set-music /next /stop /start', inline: false },
      )
      .setTimestamp()
      .setFooter({ text: `Запрос от ${member.user.username}`, iconURL: member.user.avatarURL() });
      const select = new StringSelectMenuBuilder()
      .setCustomId('starter')
      .setPlaceholder('Select the required one')
      .addOptions(
        new StringSelectMenuOptionBuilder()
          .setLabel('Administrative')
          .setValue('administrative')
          .setEmoji('<:utilitybanhammer:1268981837951139841>'),
        new StringSelectMenuOptionBuilder()
          .setLabel('Main')
          .setValue('main')
          .setEmoji('<:emoji_145:1268994497564377088>'),
          new StringSelectMenuOptionBuilder()
          .setLabel('Moderation')
          .setValue('moderation')
          .setEmoji('<:80534discordserverdeveloper:1268557806848704604>'),
        new StringSelectMenuOptionBuilder()
          .setLabel('Settings')
          .setValue('settings')
          .setEmoji('<:emoji_144:1268993835778707550>'),
          new StringSelectMenuOptionBuilder()
          .setLabel('Economy')
          .setValue('economy')
          .setEmoji('<:emoji_146:1268995016723009639>'),
          new StringSelectMenuOptionBuilder()
          .setLabel('Music')
          .setValue('music')
          .setEmoji('<:emoji_145:1268994123831054417>'),
      );

    const row = new ActionRowBuilder()
      .addComponents(select);

    await interaction.reply({
      embeds: [embed],
      components: [row],
    });

    const filter = i => i.customId === 'starter' && i.member.id === interaction.member.id;
    const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

    collector.on('collect', async i => {
      let responseEmbed = new EmbedBuilder();

      switch (i.values[0]) {
        case 'administrative':
  responseEmbed.setColor('#343434')
    .setDescription('**List of available commands**')
    .setDescription("<:utilitybanhammer:1268981837951139841>Administative\n\n/say - say from the Yoku's face\n/giveaway - start and control giveaway\n/add-money - add the money to user\n/reload - reload the command\n/mutes - check the mutes list\n/bans - check the band list")
    .setTimestamp()
      
      break;
      case 'main':
        responseEmbed.setColor('#343434')
          .setDescription('**List of available commands**')
          .setDescription("<:emoji_145:1268994497564377088>**Main**\n\n/level - check your level status\n/reactions - use RP interactions\n/avatar - check your avatar or avatar other user's\n/help - check all commands\n/info - info about Yoku\n/invite - invite the Yoku\n/ping - pong\n/ping-bot - check ping the Yoku's\n/profile - check your profile\n/server - check info about server\n/user - chack info about user")
          .setTimestamp()
            
            break;

      case 'moderation':
        responseEmbed.setColor('#343434')
          .setDescription('**List of available commands**')
          .setDescription(`<:80534discordserverdeveloper:1268557806848704604>**Moderation**\n\n/check-rep - check all report\n/unban - unban an user\n/unmute - unmute an user\n/ban - ban an user\n/clear - clear the chat\n/kick - kick an user\n/mute - mute an user\n/change-name - change name an user\n/remove-name - remove name an user`)
          .setTimestamp()
            
            break;
      
        case 'settings':
        responseEmbed.setColor('#343434')
          .setDescription('**List of available commands**')
          .setDescription(`<:emoji_144:1268993835778707550>**Settings**\n\n/auto-mod - on auto moderating\n/anti-crash - Protect your server\n/logs - on the logs\n/settings - bot setup\n/reset-lvl - reset lvl all user `)
          .setTimestamp()
            
            break;
            case 'economy':
                responseEmbed.setColor('#343434')
                  .setDescription('**List of available commands**')
                  .setDescription(`<:emoji_146:1268995016723009639>**Economy**\n\n/leaderboard - check leaderboard/balance - check your balance\n/timely - give a money every 3 hours\n/pay - pay money to other user\n/convert - convert common money to the donate money\n/buy - buy a role from the shop\n/shop - check the unusual roles`)
                  .setTimestamp()
                    
                    break;
                    case 'music':
  responseEmbed.setColor('#343434')
    .setDescription('**List of available commands**')
    .setDescription('<:emoji_145:1268994123831054417>**Music**\n\n/play - turns on music\n/queue - see the queue from the music\n/set-music - put any track\n/next - turn on the next track from the queue\n/stop - turn off the track\n/start - add the bot to the voice')
    .setTimestamp()
      break;

              
      }

      await i.reply({ embeds: [responseEmbed], ephemeral: true }); 
    });

    collector.on('end', collected => {
      if (collected.size === 0) {
        interaction.followUp({ content: 'Time for selection has expired!', ephemeral: true}); 
      }
    });
  },
};
