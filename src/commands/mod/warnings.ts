import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageEmbed } from "discord.js";
import { warnModel } from "../../models/warn.model";
type param = {
  moderator: string;
  reason: string;
  timestamp: string;
  user: string;
};
module.exports = {
  command: new SlashCommandBuilder()
    .setName("warnings")
    .setDescription("Get warnings for a user")
    .addUserOption((user) => {
      return user.setName("user").setDescription("user").setRequired(true);
    })
    .addIntegerOption((pageNumber) => {
      return pageNumber
        .setName("page")
        .setDescription("Specify Page Number")
        .setRequired(false);
    }),
  async run(interaction: CommandInteraction) {
    await interaction.deferReply();
    const user = interaction.options.getUser("user");
    const pageStart = interaction.options.getInteger("page")
      ? interaction.options.getInteger("page")
      : 0;
    const pageEnd = pageStart + 10;
    const guildRecord = await warnModel.findOne({
      guildId: interaction.guildId,
    });
    if (!guildRecord) {
      await interaction.editReply({
        content: "No warning Record for this guild",
      });
      return;
    }
    const warnings = guildRecord.warnings
      .slice(pageStart, pageEnd)
      .map((m: param) => {
        if (m.user === `${user.tag}`) {
          return `** ${m.moderator}** warned **${m.user}** ${
            m.reason && `\n Reason: ${m.reason}`
          }`;
        }
      });

    const embed = new MessageEmbed();

    if (warnings.length == 0) {
      await interaction.editReply({
        content: "No warnings for specified User",
      });
      return;
    }
    embed
      .setDescription(
        `${warnings.join("\n")} ${
          guildRecord.warnings.length > pageEnd
            ? `\n .. ${guildRecord.warnings.length - pageEnd} more records`
            : ""
        }`
      )
      .setColor("RANDOM")
      .setTimestamp()
      .setTitle(`Warnings for ${user.tag}`);
    await interaction.editReply({ embeds: [embed] });
  },
};
