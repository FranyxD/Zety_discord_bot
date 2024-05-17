const { SlashCommandBuilder } = require("discord.js");
const {
  joinVoiceChannel,
  StreamDispatcher,
  createAudioPlayer,
  createAudioResource,
  VoiceConnection,
} = require("@discordjs/voice");
const fs = require("fs");
const path = require("path");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription(
      "Command to make the bot join a voice channel and play an mp3",
    ),
  async execute(interaction) {
    if (!interaction.inGuild()) {
      // Check if the command was used in a guild
      interaction.reply("This command can only be used in a server.");
      return;
    }

    const { member } = interaction; // Get the member who ran the command
    const channel = member.voice.channel; // Get the voice channel the member is in

    if (!channel) {
      // Check if the member is in a voice channel
      interaction.reply("You need to be in a voice channel to play audio!");
      return;
    }

    // Join the voice channel
    const connection = joinVoiceChannel({
      // Create a connection to the voice channel
      channelId: channel.id, // Use the ID of the voice channel
      guildId: channel.guild.id, // Use the ID of the guild
      adapterCreator: channel.guild.voiceAdapterCreator,
    });

    

    await interaction.reply("Playing mp3");
  },
};
