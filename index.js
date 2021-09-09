const { Client, Collection, Intents } = require("discord.js");
const { join } = require("path");

const { token } = require("./config");

const registerSlashCommands = require("./src/registerSlashCommands");
const getJSFiles = require("./src/getJSFiles");

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// Create a `Collection` of commands - for executing
// and an array for registering the slash commands
client.commands = new Collection();
const commands = [];

// Get all the `.js` files in the `commands` directory
const commandFiles = getJSFiles(join(__dirname, "commands"));

// Import all command files and
// add them to the `client.commands` collection
commandFiles.forEach((file) => {
  const command = require(file);

  // Add the values to the array and `Collection`
  commands.push(command.data.toJSON());

  // Sets the name of the command as the key
  client.commands.set(command.data.name, command);
});

// Registers the slash commands
// NOTE: isGlobal value is set to false because the bot is still under development phase
registerSlashCommands(commands, false);

// Logs to the console once the bot is ready
client.once("ready", () => {
  console.log(`I have logged in as ${client.user.tag} (${client.user.id})`);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  // Try to get the command from our `client.commands` Collection
  // Ignore if the command is not found
  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  // Try to execute the command
  // If an error occurs, log the error to the console
  // and display a message to the user
  try {
    await command.execute(interaction, client);
  } catch (error) {
    console.error(error);

    await interaction.reply({
      content: "There was an error while executing this command!",
      ephemeral: true, // if true the message will be visible only to the user
    });
  }
});

client.login(token);
