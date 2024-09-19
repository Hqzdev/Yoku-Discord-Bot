const { SlashCommandBuilder, EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');

const userReports = new Map();

module.exports = {
    name: 'reset-report',
    description: 'Reset user\'s reports',
    devOnly: true,
    options: [
        {
            name: 'member',
            description: 'User whose reports you want to reset',
            type: ApplicationCommandOptionType.User,
            required: true
        },
    ],

    callback: async (client, interaction) => {
        const targetUser = interaction.options.getUser('member');

        if (userReports.has(targetUser.id)) {
            userReports.delete(targetUser.id);

            const resetEmbed = new EmbedBuilder()
                .setTitle('Reports Reset')
                .setDescription(`**${targetUser.username}'s** reports have been successfully reset.`)
                .setColor('#303135');

            return interaction.reply({ embeds: [resetEmbed] });
        } else {
            const noReportsEmbed = new EmbedBuilder()
                .setTitle('No Reports Found')
                .setDescription(`**${targetUser.username}** has no reports to reset.`)
                .setColor('#303135');

            return interaction.reply({ embeds: [noReportsEmbed], ephemeral: true });
        }
    }
};
