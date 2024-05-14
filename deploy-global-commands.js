// Importa los módulos necesarios de Discord.js, node.js y el archivo de configuración
const { REST, Routes } = require('discord.js');
const { TOKEN, CLIENT_ID, GUILD_ID } = process.env;
const fs = require('fs');
const path = require('path');

// Crea una matriz vacía para almacenar los comandos
const commands = [];

// Define la ruta del directorio de comandos
const foldersPath = path.join(__dirname, 'commands'); // ./commands

// Lee los nombres de las carpetas en el directorio de comandos
const commandFolders = fs.readdirSync(foldersPath); // ['utility', 'moderation']

// Iterar sobre cada carpeta en el directorio de comandos
for (const folder of commandFolders) {
  // Define la ruta del directorio de comandos para la carpeta actual
  const commandsPath = path.join(foldersPath, folder); // ./commands/utility

  // Lee los nombres de los archivos en el directorio de comandos para la carpeta actual
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js')); // ['ping.js', 'server.js']

  // Iterar sobre cada archivo en el directorio de comandos para la carpeta actual
  for (const file of commandFiles) { // 'ping.js'
    // Define la ruta del archivo de comandos para el archivo actual
    const filePath = path.join(commandsPath, file); // ./commands/utility/ping.js

    // Importa el módulo de comandos desde el archivo de comandos actual
    const command = require(filePath); // require('./commands/utility/ping.js')

    // Verifica si el módulo de comandos tiene las propiedades "data" y "execute"
    if ('data' in command && 'execute' in command) { 
      // Agrega el objeto JSON de los datos del comando a la matriz de comandos
      commands.push(command.data.toJSON()); // EJ: { name: 'ping', description: 'Replies with Pong!' }
    } else {
      // Si el módulo de comandos no tiene las propiedades "data" o "execute", registra un mensaje de advertencia en la consola
      console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
  }
}

// Crea una instancia del módulo REST de Discord.js y establece el token de autenticación
const rest = new REST().setToken(TOKEN); 

// Define una función asíncrona para cargar los comandos en Discord
const cargarComandos = async () => {
  try {
    // Registra un mensaje en la consola indicando que se están cargando los comandos
    console.log(`Started refreshing ${commands.length} application (/) commands.`);

    //Global application commands will be available in all the guilds your application has the applications.commands scope authorized in, and in direct messages by default.
    const data = await rest.put(
        Routes.applicationCommands(CLIENT_ID),
        { body: commands },
      );

    // Registra un mensaje en la consola indicando que se han cargado los comandos correctamente
    console.log(`Successfully reloaded ${data.length} application (/) commands.`);
  } catch (error) {
    // Registra un mensaje de error en la consola si ocurre un error durante el proceso de carga de comandos
    console.error(error);
  }
};

cargarComandos();