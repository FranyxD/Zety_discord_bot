const { Events } = require('discord.js');

//HELP LOGS
const getChannelsIds = require('../helpLogs/getChannelIds');

module.exports = {
  name: Events.ClientReady,
  once: true,
  execute(client) {
    console.log(`Ready! Logged in as ${client.user.tag}`);
    //sacamos por consola el id y el nombre de los canales
    getChannelsIds(client)
    const channel = client.channels.cache.get('1056214809189830728'); // Reemplaza 'ID_DEL_CANAL' con el ID del canal donde quieres que el bot envíe el mensaje
    if (channel) {
      channel.send('Zety listo para servir');
    }
  },
};