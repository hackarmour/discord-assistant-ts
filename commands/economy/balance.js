const { SlashCommandBuilder, inlineCode } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const knex = require("../../knex");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("balance")
    .setDescription("Check your balance")
    .addUserOption((option) =>
      option.setName("user").setDescription("Mention a user")
    ),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: false });

    // Fetches the user option from the command
    // or else defaults to the author
    // Type: User
    const { id, username } = interaction.options.getUser("user")
      ? interaction.options.getUser("user")
      : interaction.user;

    // Type: GuildMember
    const member = interaction.guild.members.cache.get(id);

    knex
      .select("*")
      .from("users")
      .where("userId", id)
      .then(async (data) => {
        if (!data[0]) {
          await interaction.editReply({
            content: `The account of ${inlineCode(username)} does not exist.`,
          });
          return;
        }

        let { wallet, bank, bankLimit } = data[0];
        let bankLimitPercent = Math.round(
          (parseInt(bank) / parseInt(bankLimit)) * 100
        );

        const balanceEmd = new MessageEmbed()
          .setTitle(`Balance of ${username}`)
          .addFields(
            { name: "Wallet", value: inlineCode(wallet), inline: true },
            {
              name: "Bank",
              value: `
                ${inlineCode(bank)}/${inlineCode(bankLimit)}\
                ${inlineCode(bankLimitPercent + "%")}`,
              inline: true,
            }
          )
          // Gets the display color of the member (role color)
          .setColor(member.displayHexColor)
          .setTimestamp();

        await interaction.editReply({ embeds: [balanceEmd] });
      })
      // Log any error(s) to the console
      .catch((error) => {
        console.log(error.message);
      });
  },
};
