const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Checks the bot's ping time"),

  async execute(interaction, client) {
    await interaction.reply(
      `:ping_pong: Pong! \`${Math.round(client.ws.ping)}ms\``
    );
  },
};
