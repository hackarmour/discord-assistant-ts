const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder().setName("membercount").setDescription("Get the server member and bot count."),

	async execute(interaction, client) {
		const guild = client.guilds.cache.get(`${interaction.guildId}`);
		const emd = new MessageEmbed()
			.setColor("RANDOM")
			.addField("**Humans**", `${interaction.guild.members.cache.filter((member) => !member.user.bot).size}`, true)
			.addField("**Bots**", `${interaction.guild.members.cache.filter((member) => member.user.bot).size}`, true)
			.addField("**Total members**", `${interaction.guild.members.cache.size}`, true)
			.setImage(
				"https://media.discordapp.net/attachments/616315208251605005/616319462349602816/Tw.gif?width=563&height=3"
			)
			.setTimestamp();
		await interaction.reply({ embeds: [ emd ] });
	}
};