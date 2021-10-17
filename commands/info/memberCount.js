const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder().setName("membercount").setDescription("Get the server member count."),

	async execute(interaction) {
		const emd = new MessageEmbed()
		.setColor(interaction.member.displayHexColor)
		.addField("Humans", `${interaction.guild.members.cache.filter((member) => !member.user.bot).size}`, true)
			.addField("Bots", `${interaction.guild.members.cache.filter((member) => member.user.bot).size}`, true)
			.addField("Total members", `${interaction.guild.members.cache.size}`, true)
			.setTimestamp();
		await interaction.reply({ embeds: [ emd ] });
	}
};
