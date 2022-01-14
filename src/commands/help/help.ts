import { SlashCommandBuilder } from "@discordjs/builders";
import {
  CommandInteraction,
  MessageActionRow,
  MessageEmbed,
  MessageSelectMenu,
  SelectMenuInteraction,
} from "discord.js";
module.exports = {
  command: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Stop it Get some help"),
  async run(interaction: CommandInteraction) {
    await interaction.deferReply();
    const row = new MessageActionRow().addComponents(
      new MessageSelectMenu()
        .setCustomId("helpMenu")
        .setOptions([
          {
            value: "mod",
            label: "Moderation",
          },
          {
            label: "Fun",
            value: "fun",
          },
          {
            label: "Utils",
            value: "utils",
          },
          {
            label: "Logs",
            value: "logs",
          },
        ])
        .setPlaceholder("Select An Option")
    );
    const mainEmbed = new MessageEmbed()
      .setTimestamp()
      .setColor("RANDOM")
      .setTitle("Help Menu")
      .addFields([
        {
          name: "Moderation",
          value: `\` Select Moderation Option \``,
          inline: true,
        },
        {
          name: "Fun",
          value: `\` Select Fun Option \``,
          inline: true,
        },
        {
          name: "Utils",
          value: `\` Select Utils Option \``,
          inline: true,
        },
        {
          name: "Logs",
          value: `\` Select Logs Option \``,
          inline: true,
        },
      ]);
    const options = {
      mod: new MessageEmbed()
        .setColor("RANDOM")
        .setTimestamp()
        .setTitle("Moderation")
        .addFields([
          {
            name: "ban",
            value: `\` Ban A User \``,
            inline: true,
          },
          {
            name: "kick",
            value: `\` Kick A User \``,
            inline: true,
          },
          {
            name: "mute",
            value: `\` Mute A User \``,
            inline: true,
          },
          {
            name: "unmute",
            value: `\` Unmute A User \``,

            inline: true,
          },
          {
            name: "warn",
            value: `\` Warn A User \``,
            inline: true,
          },
          {
            name: "warnings",
            value: `\` Get Warnings for Mentioned User \``,
            inline: true,
          },
          {
            name: "clearwarns",
            value: `\` Clear Warnings for Mentioned User \``,
            inline: true,
          },
        ]),
      fun: new MessageEmbed()
        .setColor("RANDOM")
        .setTimestamp()
        .setTitle("Fun")
        .addFields([
          {
            name: "meme",
            value: `\` Get A Meme \``,
            inline: true,
          },
        ]),
      logs: new MessageEmbed().setTitle("Logs").setColor("RANDOM").addFields(
        {
          name: "logs enable",
          value: "Enable Logs For Your Server",
          inline: true,
        },
        {
          name: "logs disable",
          value: "Disable Logs For Your Server",
          inline: true,
        }
      ),
      utils: new MessageEmbed()
        .setTitle("Utils")
        .setColor("RANDOM")
        .addFields([
          {
            name: "ping",
            value: "`Get The Bot's Ping`",
            inline: true,
          },
          {
            name: "membercount",
            value: "`Get The Member Count`",
            inline: true,
          },
        ]),
    };
    await interaction.editReply({ components: [row], embeds: [mainEmbed] });
    const collector = interaction.channel.createMessageComponentCollector({
      time: 60000,
    });
    collector.on("collect", async (msg: SelectMenuInteraction) => {
      await msg.deferReply({ ephemeral: true });
      const embed = options[msg.values[0]];
      await msg.editReply({ embeds: [embed] });
    });
    collector.on("end", async () => {
      row.components.forEach((c) => c.setDisabled(true));
      await interaction.editReply({ components: [row] });
    });
  },
};
