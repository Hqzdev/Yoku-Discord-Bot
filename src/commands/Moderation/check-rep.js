const { SlashCommandBuilder, EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const userReports = require('./report').userReports; // Подключаем хранилище репортов из команды report

module.exports = {
    name: 'check-report',
    description: 'Check how many reports a member has',
    options: [
        {
            name: 'member',
            description: 'The user you want to check reports on',
            type: ApplicationCommandOptionType.User,
            required: true
        },
    ],
    callback: async (client, interaction) => {
        const targetUser = interaction.options.getUser('member');
        const guildMember = interaction.guild.members.cache.get(targetUser.id);

        if (!guildMember) {
            const embed = new EmbedBuilder()
                .setTitle('Error')
                .setDescription('<:20943crossmark:1268557997349797899> | The user **is not found** on the server.')
                .setColor('#303135');
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }


        const reports = userReports.get(targetUser.id) || 0;

        const reportEmbed = new EmbedBuilder()
            .setTitle('Check Reports')
            .setDescription(`<:7824member:1268590978768441437> | **${targetUser.username}** has **${reports}** report(s).`)
            .setColor('#303135');

        return interaction.reply({ embeds: [reportEmbed] });
    }
};
