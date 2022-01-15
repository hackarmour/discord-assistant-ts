import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, GuildMember, Permissions } from "discord.js";
import { warning } from "types";
import { warnModel } from "../../models/warn.model";

module.exports = {
  command: new SlashCommandBuilder()
    .setName("clearwarn")
    .setDescription("Clear Warning for A user")
    .addUserOption((user) => {
      return user
        .setName("user")
        .setDescription("Mention a user")
        .setRequired(true);
    }),
  async run(interaction: CommandInteraction) {
    await interaction.deferReply();
    if (
      !(interaction.member as GuildMember).permissions.has([
        Permissions.FLAGS.KICK_MEMBERS,
        Permissions.FLAGS.BAN_MEMBERS,
      ])
    ) {
      return await interaction.editReply({
        content: "You don't have enough permission to clear warnings!",
      });
    }
    const user = interaction.options.getUser("user");
    const guildRecord = await warnModel.findOne({
      guildId: interaction.guild.id,
    });
    if (!guildRecord || !guildRecord.warnings) {
      return await interaction.editReply({
        content: "No User Is Warned In This Server",
      });
    }
    const warnings: warning[] = guildRecord.warnings;
    const warningsCleared: warning[] = [];
    warnings.forEach((warn, index) => {
      if (warn.user == user.tag) {
        warningsCleared.push(warn);
        warnings.splice(index, 1);
      }
    });
    if (!warningsCleared.length) {
      return interaction.editReply({
        content: "No Warnings For Specified User!",
      });
    }
    await warnModel.findOneAndUpdate(
      { guildId: interaction.guildId },
      { warnings: warnings }
    );
    await interaction.editReply({
      content: `**Cleared ${warningsCleared.length} warning for ${user.tag}**`,
    });
  },
};
