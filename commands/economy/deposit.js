const knex = require("../../knex");
const {
  SlashCommandBuilder,
  inlineCode,
  codeBlock,
} = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("deposit")
    .setDescription("Use this command to deposit coins in your bank account.")
    .addStringOption((str) =>
      str
        .setName("coins")
        .setDescription("Enter Number of coins")
        .setRequired(true)
    ),

  async execute(interaction) {
    await interaction.deferReply();
    const valueGiven = interaction.options.getString("coins", true);

    const id = interaction.user.id;

    knex
      .select("*")
      .from("users")
      .where("userId", id)
      .then(async (res) => {
        // Verify if the user has an account
        if (!res[0]) {
          await interaction.editReply({
            content:
              "Your account does not exist. Please open one using the `createaccount` slash command",
          });
          return;
        }

        let bankCapacity = parseFloat(res[0].bankLimit);
        let wallet = parseFloat(res[0].wallet);
        let bankBalance = parseFloat(res[0].bank);

        if (valueGiven === "all" || valueGiven === "max") {
          // If the bank is already full to its capacity
          if (bankCapacity === bankBalance) {
            await interaction.editReply({
              // prettier-ignore
              content: `
                You can only hold ${inlineCode(bankCapacity)} in your bank account.
              `,
            });
            return;
          }

          if (bankCapacity > bankBalance) {
            const emptyBankCapacity = bankCapacity - bankBalance;

            knex("users")
              .where("userId", id)
              .update({
                wallet: (wallet - emptyBankCapacity).toString(),
                bank: bankCapacity.toString(),
              })
              .then(async () => {
                await interaction.editReply({
                  // prettier-ignore
                  content: `
                    Deposited ${inlineCode(emptyBankCapacity)} in your bank account.
                  `,
                });
                return;
              })
              .catch((error) => {
                console.log(error.message);
              });
          }
        } else {
          if (isNaN(valueGiven)) {
            await interaction.editReply({
              content: `Please enter a valid value. For example:
                ${codeBlock("/deposit all\n/deposit 1234")}`,
            });
            return;
          }

          const coins = parseFloat(valueGiven);

          knex
            .select("*")
            .from("users")
            .where("userId", id)
            .then(async (res) => {
              let emptyBankCapacity = bankCapacity - bankBalance;

              if (coins > wallet || coins < 0) {
                await interaction.editReply({
                  content: "Please enter a valid number of coins",
                });
                return;
              }

              if (coins > emptyBankCapacity || bankCapacity === bankBalance) {
                await interaction.editReply({
                  // prettier-ignore
                  content: `
                    You can only hold ${inlineCode(bankCapacity)} in your bank account.
                  `,
                });
                return;
              }

              if (bankCapacity > bankBalance) {
                knex("users")
                  .where("userId", id)
                  .update({
                    wallet: (wallet - coins).toString(),
                    bank: (bankBalance + coins).toString(),
                  })
                  .then(async () => {
                    await interaction.editReply({
                      // prettier-ignore
                      content: `
                        Deposited ${inlineCode(coins)} in your bank account.
                      `,
                    });
                    return;
                  })
                  .catch((error) => {
                    console.log(error.message);
                  });
              }
            })
            .catch((error) => {
              console.log(error.message);
            });
        }
      })
      .catch((error) => {
        console.log(error.message);
      });
  },
};
