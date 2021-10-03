const axios = require("axios");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("food")
    .setDescription("Send an image from r/food"),
  async execute(interaction) {
    await interaction.deferReply();
    axios
      .get("https://api.gillsaab.repl.co/food")
      .then(async (res) => {
        const emb = new MessageEmbed()
          .setColor("RANDOM")
          .setTitle(`${res.data.title}`)
          .setImage(`${res.data.link}`);
        await interaction.editReply({ embeds: [emb] });
      })
      .catch(async (err) => {
        await interaction.editReply({ content: `${err.message}` });
      });
  },
};
