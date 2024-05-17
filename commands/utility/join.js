const { SlashCommandBuilder } = require("discord.js");
const { joinVoiceChannel } = require("@discordjs/voice");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("join")
    .setDescription(
      "Command to make the bot join a voice channel",
    ),
  async execute(interaction) {
    if (!interaction.inGuild()) {
      interaction.reply("This command can only be used in a server.");
      return;
    }

    const { member } = interaction;
    const channel = member.voice.channel;

    if (!channel) {
      interaction.reply("You need to be in a voice channel to play audio!");
      return;
    }

    if (!channel.permissionsFor(interaction.guild.members.me).has("CONNECT") ||
        !channel.permissionsFor(interaction.guild.members.me).has("SPEAK")) {
      interaction.reply("I don't have permission to connect or speak in this voice channel.");
      return;
    }

    const connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guild.id,
      adapterCreator: channel.guild.voiceAdapterCreator,
      selfDeaf: false,
    });

    const { execute } = require('./play');
    execute(interaction, connection);
  },
};