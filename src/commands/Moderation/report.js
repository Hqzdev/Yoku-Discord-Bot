const { SlashCommandBuilder, EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');

const userReports = new Map();

module.exports = {
    name: 'report',
    description: 'Report other member',
    options: [
        {
            name: 'member',
            description: 'The user you want to write a report on',
            type: ApplicationCommandOptionType.User,
            required: true
        },
        {
            name: 'reason',
            description: 'Write a reason',
            type: ApplicationCommandOptionType.String,
            required: false    
        },
    ],
    callback: async (client, interaction) => {
        const targetUser = interaction.options.getUser('member');
        const guildMember = interaction.guild.members.cache.get(targetUser.id);
        const reason = interaction.options.getString('reason') || 'No reason provided.';

        if (!guildMember) {
            const embed = new EmbedBuilder()
                .setTitle('Error')
                .setDescription('<:20943crossmark:1268557997349797899> | The user **is not found** on the server.')
                .setColor('#303135');
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }


        let reports = userReports.get(targetUser.id) || 0;


        reports += 1;
        userReports.set(targetUser.id, reports);

        if (reports >= 3) {
            await guildMember.ban({ reason: `The user received **3** reports. Reason: **${reason}**` });
            userReports.delete(targetUser.id); 

            const banEmbed = new EmbedBuilder()
                .setTitle('User blocked')
                .setDescription(`<:37667checkmark:1268558027364106416> | **${targetUser.username}**  received **3** reports and was blocked. Reason: ${reason}`)
                .setColor('#303135');
            return interaction.reply({ embeds: [banEmbed] });
        } else {
            const reportEmbed = new EmbedBuilder()
                .setTitle('Report send')
                .setDescription(`<:7824member:1268590978768441437> | **${targetUser.username}** recived **${reports}** report(s) Reason: **${reason}**`)
                .setColor('#303135');
            return interaction.reply({ embeds: [reportEmbed] });
        }
    }
};
