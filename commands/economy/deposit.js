const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const knex = require("../../knex");
const { SlashCommandBuilder } = require("@discordjs/builders");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("deposit")
    .setDescription("Use this command to deposit coins in yorr bank account.")
    .addStringOption((str) =>
      str
        .setName("coins")
        .setDescription("Enter Number of coins")
        .setRequired(true)
    ),
  async execute(interaction) {
    await interaction.deferReply();
    const valueGiven = interaction.options._hoistedOptions[0].value;
    if (valueGiven === "all") {
      knex
        .select("*")
        .from("users")
        .where("userId", `${interaction.user.id}`)
        .then(async (res) => {
          if (!res[0]) {
            await interaction.editReply({
              content: "Your account does not exist. Please Open one first.",
            });
            return;
          }
          const bankCapacity = parseFloat(res[0].bankLimit);
          const wallet = parseFloat(res[0].wallet);
          const bank = parseFloat(res[0].bank);
          if (bankCapacity === bank) {
            await interaction.editReply({
              content: `You can only hold ** ${bankCapacity} ** in your bankaccount.`,
            });
            return;
          }
          if (bankCapacity > bank) {
            const emptyBank = bankCapacity - bank;
            knex("users")
              .where("userId", `${interaction.user.id}`)
              .update({
                wallet: (wallet - emptyBank).toString(),
                bank: bankCapacity.toString(),
              })
              .then(async (response) => {
                await interaction.editReply({
                  content: `Deposited ${emptyBank} in your bank account.`,
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
    } else {
      if(isNaN(valueGiven)){
        await interaction.editReply({content:"Please Enter a valid value. For example:\n```/deposit all\n/deposit 1234```"})
        return
      }
      const coins = parseFloat(valueGiven);
      knex
        .select("*")
        .from("users")
        .where("userId", `${interaction.user.id}`)
        .then(async (res) => {
          if (!res[0]) {
            await interaction.editReply({
              content: "Your account does not exist. Please Open one first.",
            });
            return;
          }
          const bankCapacity = parseFloat(res[0].bankLimit);
          const wallet = parseFloat(res[0].wallet);
          const bank = parseFloat(res[0].bank);
          const emptyBankCapacity = bankCapacity - bank;
          if (coins > wallet || coins < 0) {
            await interaction.editReply({
              content: "Please Enter a valid number of coins",
            });
            return;
          }
          if (coins > emptyBankCapacity) {
            await interaction.editReply({
              content: `You can only hold ** ${bankCapacity} ** in your bank account!`,
            });
            return;
          }
          if (bankCapacity === bank) {
            await interaction.editReply({
              content: `You can only hold ** ${bankCapacity} ** in your bankaccount.`,
            });
            return;
          }
          if (bankCapacity > bank) {
            const emptyBank = bankCapacity - bank;
            knex("users")
              .where("userId", `${interaction.user.id}`)
              .update({
                wallet: (wallet - coins).toString(),
                bank: (bank + coins).toString(),
              })
              .then(async (response) => {
                await interaction.editReply({
                  content: `Deposited ** ${coins} ** in your bank account.`,
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
  },
};
