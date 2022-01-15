import { SlashCommandBuilder, time } from "@discordjs/builders";
import { CommandInteraction, MessageEmbed } from "discord.js";
import { warning } from "types";
import { warnModel } from "../../models/warn.model";

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
    let allWarnings: string[] = [];
    guildRecord.warnings.slice(pageStart, pageEnd).forEach((m: warning) => {
      if (m.user === `${user.username}#${user.discriminator}`) {
        allWarnings.push(
          `** ${m.moderator}** warned **${m.user}** ${
            m.reason &&
            `\n Reason: ${m.reason} \n Timestamp: ${time(
              Math.floor(m.timestamp / 1000),
              "R"
            )}`
          }`
        );
      }
    });
    const embed = new MessageEmbed();

    if (!allWarnings || allWarnings.length == 0) {
      await interaction.editReply({
        content: "No warnings for specified User",
      });
      return;
    }
    embed
      .setDescription(
        `${allWarnings.join("\n")} ${
          allWarnings.length > pageEnd
            ? `\n .. ${allWarnings.length - pageEnd} more records`
            : ""
        }`
      )
      .setColor("RANDOM")
      .setTimestamp()
      .setTitle(`Warnings for ${user.tag}`);
    await interaction.editReply({ embeds: [embed] });
  },
};
