import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, GuildMember, MessageEmbed } from "discord.js";

module.exports = {
  command: new SlashCommandBuilder()
    .setName("membercount")
    .setDescription("Get the server member count."),

  async run(interaction: CommandInteraction) {
    const emd = new MessageEmbed()
      .setColor((interaction.member as GuildMember).displayHexColor)
      .addField(
        "Humans",
        `${
          interaction.guild.members.cache.filter((member) => !member.user.bot)
            .size
        }`,
        true
      )
      .addField(
        "Bots",
        `${
          interaction.guild.members.cache.filter((member) => member.user.bot)
            .size
        }`,
        true
      )
      .addField(
        "Total members",
        `${interaction.guild.members.cache.size}`,
        true
      )
      .setTimestamp();
    await interaction.reply({ embeds: [emd] });
  },
};
