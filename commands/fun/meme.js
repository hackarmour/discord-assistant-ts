const {SlashCommandBuilder} = require('@discordjs/builders');
const axios = require('axios');
const { MessageEmbed } = require('discord.js');
module.exports={
    data: new SlashCommandBuilder().setName("meme").setDescription('Sends meme in the chat!'),
    async execute(interaction){
        await interaction.deferReply()
        try{
            const data = await axios.get('https://api.gillsaab.repl.co/memes')
            const emb = new MessageEmbed().setTitle(`${data.data.title}`).setImage(`${data.data.link}`).setTimestamp().setColor("RANDOM")
            await interaction.editReply({embeds:[emb]})
        }catch(error){
            const emb = new MessageEmbed().setTitle("Error").setDescription(`${error.message}`).setColor("RED").setTimestamp()
            await interaction.editReply({embeds:[emb]})
        }
    }
}