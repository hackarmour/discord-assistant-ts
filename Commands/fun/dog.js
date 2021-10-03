const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const Axios = require("axios");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("dog")
    .setDescription("Sends an image of a dog in chat!")
    .addStringOption((string) =>
      string
        .setName("breed")
        .setDescription("Enter a name of dog breed")
        .setRequired(false)
    ),
  async execute(interaction) {
    await interaction.deferReply();
    const breed = interaction.options._hoistedOptions[0]
      ? interaction.options._hoistedOptions[0].value
      : false;
    try {
      if (breed) {
        const res = await Axios.get(
          `https://dog.ceo/api/breed/${breed.toLowerCase()}/images/random`
        );
        const emb = new MessageEmbed()
          .setTitle(`Dog Breed: ${breed}`)
          .setImage(res.data.message)
          .setColor("RANDOM");
        await interaction.editReply({ embeds: [emb] });
      } else {
        const res = await Axios.get("https://dog.ceo/api/breeds/image/random");
        const breed = res.data.message.split("/")[4];
        const emb = new MessageEmbed()
          .setTitle(`Dog Breed: ${breed}`)
          .setImage(res.data.message)
          .setColor("RANDOM");
        await interaction.editReply({ embeds: [emb] });
      }
    } catch (err) {
      await interaction.editReply({
        embeds: [
          new MessageEmbed()
            .setTitle("Error")
            .setDescription(`${err.message}`)
            .setColor("RED"),
        ],
      });
    }
  },
};
