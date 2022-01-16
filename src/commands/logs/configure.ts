import { SlashCommandBuilder } from "@discordjs/builders";
import {
  CommandInteraction,
  GuildMember,
  Permissions,
  TextChannel,
} from "discord.js";
import { logs } from "../../models/logs.model";

module.exports = {
  command: new SlashCommandBuilder()
    .setName("logs")
    .setDescription("Configure logs for your server.")
    .addSubcommand((enableCommand) => {
      return enableCommand
        .setName("enable")
        .setDescription("Enable logging for the current channel.")
        .addChannelOption((channel) => {
          return channel
            .setName("channel")
            .setDescription("The channel to log to.")
            .setRequired(true);
        });
    })
    .addSubcommand((disableCommand) => {
      return disableCommand
        .setName("disable")
        .setDescription("Disable logging for the current channel.");
    }),
  async run(interaction: CommandInteraction) {
    await interaction.deferReply({ ephemeral: true });
    if (
      !(interaction.member as GuildMember).permissions.has([
        Permissions.FLAGS.MANAGE_GUILD,
      ])
    ) {
      return interaction.editReply({
        content: "You don't have enough permission to configure logs!",
      });
    }
    const guildConfig = await logs.findOne({
      guildId: interaction.guild.id,
    });
    const commandUsed = interaction.options.getSubcommand();
    if (commandUsed == "enable") {
      if (!guildConfig) {
        try {
          const msg = await (
            interaction.options.getChannel("channel") as TextChannel
          ).send({
            content:
              "This message is to check permissions. You can delete this message.",
          });
          await msg.delete();
        } catch {
          return interaction.editReply({
            content:
              "I don't have permission to send messages in that channel!",
          });
        }
        const newConfig = new logs({
          guildId: interaction.guild.id,
          channelId: interaction.options.getChannel("channel").id,
          enabled: true,
        });
        newConfig.save();

        return await interaction.editReply({
          content: `Logs have been enabled for your server!`,
        });
      }
      if (guildConfig.enabled) {
        return interaction.editReply({
          content: `Logs are already enabled for your server!`,
        });
      }
      if (!guildConfig.enabled) {
        try {
          const msg = await (
            interaction.options.getChannel("channel") as TextChannel
          ).send({
            content:
              "This message is to check permissions. You can delete this message.",
          });
          await msg.delete();
        } catch {
          return interaction.editReply({
            content:
              "I don't have permission to send messages in that channel!",
          });
        }
        await logs.findOneAndUpdate(
          {
            guildId: interaction.guild.id,
          },
          {
            channelId: interaction.options.getChannel("channel").id,
            enabled: true,
          }
        );
        return await interaction.editReply({
          content: `Logs have been enabled for your server!`,
        });
      }
    }
    if (commandUsed == "disable") {
      if (!guildConfig) {
        return interaction.editReply({
          content: `Logs are not configured for your server!`,
        });
      }
      if (!guildConfig.enabled) {
        return interaction.editReply({
          content: `Logs are already disabled for your server!`,
        });
      }
      await logs.findOneAndUpdate(
        { guildId: interaction.guild.id },
        { enabled: false }
      );
      return await interaction.editReply({
        content: `Logs have been disabled for your server!`,
      });
    }
  },
};
