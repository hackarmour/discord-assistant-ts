const { SlashCommandBuilder } = require("@discordjs/builders");
const knex = require("../../knex");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("createaccount")
    .setDescription("Create An Account for the command user."),
  async execute(interaction) {
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
            lastWorked: `${new Date().getTime()-3600000}`,
            bankLimit: 10000,
          });
          await interaction.editReply({
            content:
              "Created an account for you. Have fun using my economy system",
          });

          return;
        }
        await interaction.editReply({ content: "Your account already exist!" });
      })
      .catch((error) => {
        console.log(error.message);
      });
  },
};
