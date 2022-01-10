import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { client } from "../..";
module.exports = {
  command: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Checks the bot's ping time"),

  async run(interaction: CommandInteraction) {
    await interaction.reply(
      `:ping_pong: Pong! \`${Math.round(client.ws.ping)}ms\``
    );
  },
};
