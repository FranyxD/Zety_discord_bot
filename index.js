const fs = require("fs");
const path = require("path");
// Require the necessary discord.js classes
const { Client, Collection, Events, GatewayIntentBits } = require("discord.js");

const { joinVoiceChannel, createAudioPlayer, createAudioResource, entersState } = require ('@discordjs/voice');

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

//Collection se utiliza para administrar colecciones de objetos.
//EJ: collection.set('key', 'value');
client.commands = new Collection();

// Define la ruta de la carpeta que contiene todos los archivos de comandos
const foldersPath = path.join(__dirname, "commands");


//VOICE
const { generateDependencyReport } = require('@discordjs/voice');

console.log(generateDependencyReport());




// Lee el contenido de la carpeta 'commands' y almacena los nombres de todas las subcarpetas en una matriz (array)
const commandFolders = fs.readdirSync(foldersPath);

// Iterar sobre cada subcarpeta en la carpeta 'commands'
for (const folder of commandFolders) {
  // Define la ruta de la carpeta actual
  const commandsPath = path.join(foldersPath, folder);

  // Lee el contenido de la carpeta actual y filtra los resultados para incluir solo archivos con extensión '.js'
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));

  // Iterar sobre cada archivo JavaScript en la carpeta actual
  for (const file of commandFiles) {
    // Define la ruta del archivo actual
    const filePath = path.join(commandsPath, file);

    // Importa el archivo JavaScript y almacena el módulo exportado en la variable 'command'
    const command = require(filePath);

    // Verifica si el módulo exportado tiene tanto las propiedades 'data' como 'execute'
    if ("data" in command && "execute" in command) {
      // Si ambas propiedades existen, agrega el módulo exportado a la colección 'client.commands' con la clave como el nombre del comando
      client.commands.set(command.data.name, command);
    } else {
      // Si alguna propiedad falta, registra un mensaje de advertencia
      console.log(
        `[ADVERTENCIA] El comando en ${filePath} está faltando una propiedad requerida "data" o "execute".`,
      );
    }
  }
}


//LEER EVENTOS
// Crea una variable 'eventsPath' que almacena la ruta completa de la carpeta 'events'
const eventsPath = path.join(__dirname, 'events'); // ./events

// Lee el contenido de la carpeta 'events' y filtra los resultados para incluir solo archivos con extensión '.js'
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js')); // ['ready.js']

// Iterar sobre cada archivo JavaScript en la variable 'eventFiles'
for (const file of eventFiles) { // 'ready.js'
  // Crea una variable 'filePath' que almacena la ruta completa del archivo actual
  const filePath = path.join(eventsPath, file); // ./events/ready.js

  // Importa el archivo JavaScript actual y almacena el módulo exportado en la variable 'event'
  const event = require(filePath); // require('./events/ready.js')

  // Verifica si el módulo exportado tiene una propiedad 'once'
  if (event.once) { 
    // Si el evento debe ser ejecutado una sola vez, registra el evento utilizando el método 'client.once'
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    // Si el evento no debe ser ejecutado una sola vez, registra el evento utilizando el método 'client.on'
    client.on(event.name, (...args) => event.execute(...args));
  }
}

// Log in to Discord with your client's token
client.login(process.env["TOKEN"]);
