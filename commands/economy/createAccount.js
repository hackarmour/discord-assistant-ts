const { SlashCommandBuilder } = require("@discordjs/builders");
const knex = require("../../knex");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("createaccount")
    .setDescription("Create an account"),

  async execute(interaction) {
    // Only the user can view the reply (ephemeral message)
    await interaction.deferReply({ ephemeral: true });

    knex
      .select("*")
      .from("users")
      .where("userId", `${interaction.user.id}`)
      .then(async (res) => {
        if (!res[0]) {
          await knex("users").insert({
            userId: `${interaction.user.id}`,
            wallet: 0,
            bank: 0,
            workingAs: null,
            lastWorked: `${new Date().getTime() - 3600000}`,
            bankLimit: 10000,
          });
          await interaction.editReply({
            content:
              "Created an account for you. Have fun using my economy system",
          });

          return;
        }
        await interaction.editReply({
          content: "Your account already exists!",
        });
      })
      // Log any error(s) to the console
      .catch((error) => {
        console.log(error.message);
      });
  },
};
