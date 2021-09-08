const { Client, Intents } = require("discord.js");
const { token } = require("./config");

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.once("ready", () => {
  console.log(`I have logged in as ${client.user.tag} (${client.user.id})`);
});

client.login(token);
