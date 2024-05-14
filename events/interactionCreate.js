const { Events } = require('discord.js');

// ESCUCHA EL EVENTO InteractionCreate, que se dispara cuando se crea una interacción (por ejemplo, cuando se ejecuta un comando de entrada de chat)
module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
      console.error(`No command matching ${interaction.commandName} was found.`);
      return;
    }

    console.log(`
    ----------
    Nombre del comando: ${interaction.commandName}
    Descripción del comando: ${interaction.commandName}
    Ejecutado por: ${interaction.user.tag}
    ----------
    `);

    try {
      // Ejecuta el comando
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
      } else {
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
      }
    }
  },
};