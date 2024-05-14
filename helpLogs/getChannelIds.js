function getChannelsIds (client) {
  // Obtenemos el objeto del servidor usando su ID
  const guild = client.guilds.cache.get(process.env['GUILD_ID']);
  // Verificamos si el servidor existe antes de obtener la lista de ID de canales
  if (guild) {
    // Obtenemos la lista de ID de canales usando el método map()
    const channelIds = guild.channels.cache.map(channel => ({id: channel.id, nombre: channel.name}));
    // Imprimimos la lista de ID de canales en la consola
    console.log(channelIds);
  } else {
    // Si el servidor no existe, imprimimos un mensaje de error en la consola
    console.log('No se encontró el servidor especificado.');
  }
  //client.channels.cache.get('general').send('Estoy conectado');
}

module.exports = getChannelsIds;