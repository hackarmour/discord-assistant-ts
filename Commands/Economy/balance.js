const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const knex = require("../../knex");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("balance")
    .setDescription("Check your balance")
    .addUserOption((option) =>
      option.setName("user").setDescription("Mention a user").setRequired(false)
    ),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: false });
    const userId = interaction.options._hoistedOptions[0]
      ? interaction.options._hoistedOptions[0].user.id
      : interaction.user.id;
    const userName = interaction.options._hoistedOptions[0]
      ? interaction.options._hoistedOptions[0].user.username
      : interaction.user.username;
    knex
      .select("*")
      .from("users")
      .where("userId", userId)
      .then(async (data) => {
        if (!data[0]) {
          await interaction.editReply({
            content: `The account of ${userName} does not exist`,
          });
          return;
        } else {
          const emb = new MessageEmbed()
            .setTitle(`Balance of ${userName}`)
            .setDescription(
              ` ** Wallet ** : \`${data[0].wallet}\`\n ** Bank ** : \`${
                data[0].bank
              }\`/\`${data[0].bankLimit}\` \t  \`${Math.round(
                (parseInt(data[0].bank) / parseInt(data[0].bankLimit)) * 100
              )}%\``
            )
            .setColor("RANDOM")
            .setTimestamp();
          await interaction.editReply({ embeds: [emb] });
        }
      })
      .catch((error) => {
        console.log(error.message);
      });
  },
};
