const { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('interaction')
        .setDescription('Rp actions')
        .addUserOption(option => 
            option.setName('member')
        .setDescription('Choose a member for interactions.')
        .setRequired(true)
    ),
        
    async execute(interaction) {
        const member = interaction.options.getUser('member'); // Получаем выбранного участника
        if (!member) {
            return interaction.reply('Choose a member for interactions.');
        }

        const embed = new EmbedBuilder()
            .setTitle('<:22915developer:1268595567668494356>Choose **RP** actions')
            .setColor(0x343434)
            .setTimestamp();

        const select = new StringSelectMenuBuilder()
            .setCustomId('reaction')
            .setPlaceholder('Choose actions')
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel('kill')
                    .setDescription('Kill a member')
                    .setValue('kill')
                    .setEmoji('<:black_pontoMDE:1012702425481756693>'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('kiss')   
                    .setDescription('Kiss a member')
                    .setValue('kiss')
                    .setEmoji('<:black_pontoMDE:1012702425481756693>'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('hit')   
                    .setDescription('Hit a member')
                    .setValue('hit')
                    .setEmoji('<:black_pontoMDE:1012702425481756693>'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('no')
                    .setDescription('Say no member')
                    .setValue('no')
                    .setEmoji('<:black_pontoMDE:1012702425481756693>'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('yes')
                    .setDescription('Say yes member')
                    .setValue('yes')
                    .setEmoji('<:black_pontoMDE:1012702425481756693>'),
            );

        const row = new ActionRowBuilder()
            .addComponents(select);

        await interaction.reply({
            embeds: [embed],
            components: [row],
        });

        const filter = i => i.customId === 'actions' && i.user.id === interaction.user.id;

        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

        collector.on('collect', async i => {
            let responseEmbed = new EmbedBuilder();
            let gifUrl = '';

            switch (i.values[0]) {
                case 'kill':
                    responseEmbed.setColor('#343434')
                      
                        .setTitle(`${interaction.user.username} kills ${member.username}`)
                        .setTimestamp();
                    gifUrl = 'https://tenor.com/view/kill-me-gif-19956322'; // Замените URL на реальную гифку
                    break;
                case 'kiss':
                    responseEmbed.setColor('#343434')
                        .setTitle(`${interaction.user.username} kisses ${member.username}`)
                        .setTimestamp();

                    gifUrl = 'https://tenor.com/view/no-spamming-gif-18687985'; // Замените URL на реальную гифку
                    break;
                case 'hit':
                    responseEmbed.setColor('#343434')
                        .setTitle(`${interaction.user.username} hits ${member.username}`)
                        .setTimestamp();
                    gifUrl = 'https://tenor.com/view/hitting-someone-with-a-bat-hitting-a-guy-into-a-screen-hitting-and-breaking-the-screen-gif-24414471'; // Замените URL на реальную гифку
                    break;
                case 'no':
                    responseEmbed.setColor('#343434')
                        .setTitle(`${interaction.user.username} says no`)
                        .setTimestamp();                        
                    gifUrl = 'https://tenor.com/view/byuntear-meme-reaction-emoji-nops-gif-15657180555152423963'; // Замените URL на реальную гифку
                    break;
                case 'yes':
                    responseEmbed.setColor('#343434')
                        .setTitle(`${interaction.user.username} says yes`)
                        .setTimestamp();
                    gifUrl = 'https://tenor.com/view/yay-yes-yes-yes-gif-386207701122306006'; // Замените URL на реальную гифку
                    break;
            }

            responseEmbed.setImage(gifUrl); // Добавление гифки в embed
      
            await i.reply({ embeds: [responseEmbed], ephemeral: false });
        });
      
        collector.on('end', collected => {
            if (collected.size === 0) {
                interaction.followUp('Время выбора истекло!');
            }
        });
    },
};

