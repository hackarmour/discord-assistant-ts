const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");

const { token, clientId, guildId } = require("../config");

const rest = new REST({ version: "9" }).setToken(token);

module.exports = async (commands, isGlobal) => {
  try {
    if (isGlobal == true) {
      await rest.put(Routes.applicationCommands(clientId), {
        body: commands,
      });
    } else {
      await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
        body: commands,
      });
    }

    console.log("Successfully registered slash commands.");
  } catch (error) {
    console.error(error);
  }
};
