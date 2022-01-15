import { SlashCommandBuilder } from "@discordjs/builders";
import {
  CommandInteraction,
  GuildMember,
  MessageEmbed,
  Permissions,
} from "discord.js";
import { warnModel } from "../../models/warn.model";

module.exports = {
  command: new SlashCommandBuilder()
    .setName("warn")
    .setDescription("warn a user")
    .addUserOption((user) => {
      return user
        .setName("user")
        .setDescription("Mention A User To Warn")
        .setRequired(true);
    })
    .addStringOption((reason) => {
      return reason
        .setName("reason")
        .setDescription("Reason to Warn this user")
        .setRequired(false);
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
        content: "You don't have enough permission to warn a user!",
      });
    }
    const user = interaction.options.getUser("user");
    const reason = interaction.options.getString("reason");
    const guildRecord = await warnModel.findOne({
      guildId: interaction.guildId,
    });
    if (!guildRecord) {
      const newWarningRecord = [
        {
          user: user.tag,
          reason: reason ? reason : "No Reason Specified",
          moderator: interaction.user.tag,
          timestamp: new Date().getTime(),
        },
      ];
      const newGuildRecord = new warnModel({
        guildId: interaction.guildId,
        warnings: newWarningRecord,
      });
      await newGuildRecord.save();
      try {
        await (
          await user.createDM()
        ).send({
          embeds: [
            new MessageEmbed()
              .setColor("RED")
              .setAuthor({
                name: interaction.user.tag,
                iconURL: interaction.user.displayAvatarURL(),
              })
              .setDescription(
                `**You Have Been Warned in ${interaction.guild.name}\nReason: ${
                  reason ? reason : "No Reason Specified"
                }**`
              ),
          ],
        });
      } catch {}
      const successEmbed = new MessageEmbed()
        .setColor("GREEN")
        .setDescription(
          `**Warned ${user.tag}\nReason: ${
            reason ? reason : "No Reason Specified"
          }**`
        );
      await interaction.editReply({ embeds: [successEmbed] });
    } else {
      const newWarning = {
        user: user.tag,
        reason: reason ? reason : "No Reason Specified",
        moderator: interaction.user.tag,
        timestamp: new Date().getTime(),
      };
      guildRecord.warnings.push(newWarning);
      await warnModel.updateOne(
        { guildId: interaction.guildId },
        {
          warnings: guildRecord.warnings,
        }
      );
      try {
        await (
          await user.createDM()
        ).send({
          embeds: [
            new MessageEmbed()
              .setColor("RED")
              .setAuthor({
                name: interaction.user.tag,
                iconURL: interaction.user.displayAvatarURL(),
              })
              .setDescription(
                `**You Have Been Warned in ${interaction.guild.name}\nReason: ${
                  reason ? reason : "No Reason Specified"
                }**`
              ),
          ],
        });
      } catch {}
      const successEmbed = new MessageEmbed()
        .setColor("GREEN")
        .setDescription(
          `**Warned ${user.tag}\nReason: ${
            reason ? reason : "No Reason Specified"
          }**`
        );
      await interaction.editReply({ embeds: [successEmbed] });
    }
  },
};
