const { createAudioPlayer, createAudioResource, joinVoiceChannel, getVoiceConnection } = require('@discordjs/voice');
const ytdl = require('ytdl-core');

module.exports = {
  name: 'play',
  description: 'Play a song from YouTube',
  options: [
    {
      name: 'url',
      description: 'The YouTube URL of the song',
      type: 3, // String
      required: true,
    },
  ],
  callback: async (client, interaction) => {
    const url = interaction.options.getString('url');
    const channel = interaction.member.voice.channel;

    if (!channel) {
      return interaction.reply('You need to join a voice channel first!');
    }

    // Присоединяемся к голосовому каналу, если еще не присоединились
    let connection = getVoiceConnection(interaction.guild.id);
    if (!connection) {
      connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: interaction.guild.id,
        adapterCreator: interaction.guild.voiceAdapterCreator,
      });
    }

    try {
      const stream = ytdl(url, { filter: 'audioonly' });
      const resource = createAudioResource(stream);

      const player = createAudioPlayer();
      connection.subscribe(player);
      player.play(resource);

      interaction.reply(`Now playing: ${url}`);
    } catch (error) {
      console.log(error);
      interaction.reply('There was an error playing the song.');
    }
  },
};
