const { SlashCommandBuilder, EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");

module.exports = {
    name: "giveaway",
    description: 'Start a giveaway',
    options: [
        {
            name: 'duration',
            description: 'Set the duration of the giveaway (in minutes)',
            type: ApplicationCommandOptionType.Number,
            required: true
        },
        {
            name: 'name',
            description: 'Set the name of the giveaway',
            type: ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: 'prize-role',
            description: 'Set a prize for the giveaway (role)',
            type: ApplicationCommandOptionType.Role,
            required: false
        },
        {
            name: 'prize-money',
            description: 'Set a prize for the giveaway (money)',
            type: ApplicationCommandOptionType.Number,
            required: false
        },
    ],

    callback: async (client, interaction) => {
        const duration = interaction.options.getNumber('duration');
        const giveawayName = interaction.options.getString('name');
        const prizeRole = interaction.options.getRole('prize-role');
        const prizeMoney = interaction.options.getNumber('prize-money');

        // Создаем Embed для подтверждения старта розыгрыша
        const giveawayEmbed = new EmbedBuilder()
            .setTitle('🎉 Giveaway Started!')
            .setDescription(`**${giveawayName}** is now live!`)
            .addFields(
                { name: 'Duration', value: `${duration} minutes`, inline: true },
                { name: 'Prize', value: prizeRole ? `Role: ${prizeRole.name}` : `Money: ${prizeMoney || 'No prize set'}`, inline: true }
            )
            .setColor('#FFD700')
            .setTimestamp();

        // Отправляем эмбед сообщения
        await interaction.reply({ embeds: [giveawayEmbed] });

        // Логика для запуска отсчета времени
        setTimeout(async () => {
            const endEmbed = new EmbedBuilder()
                .setTitle('🎉 Giveaway Ended!')
                .setDescription(`The giveaway **${giveawayName}** has ended!`)
                .setColor('#FF4500')
                .setTimestamp();

            await interaction.followUp({ embeds: [endEmbed] });

           
        }, duration * 60 * 1000); 
    }
};
