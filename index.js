const fs = require("fs");
const path = require("path");
// Require the necessary discord.js classes
const { Client, Collection, Events, GatewayIntentBits } = require("discord.js");

//HELP LOGS
const getChannelsIds = require('./helpLogs/getChannelIds.js');

//en el caso que queramos guardarlo en una variable
//const { token } = require('./config.json');

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

//Collection se utiliza para administrar colecciones de objetos.
//EJ: collection.set('key', 'value');
client.commands = new Collection();

// Define la ruta de la carpeta que contiene todos los archivos de comandos
const foldersPath = path.join(__dirname, "commands");

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

// When the client is ready, run this code (only once).
// The distinction between `client: Client<boolean>` and `readyClient: Client<true>` is important for TypeScript developers.
// It makes some properties non-nullable.
client.once(Events.ClientReady, (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
  getChannelsIds(client);
});

// ESCUCHA EL EVENTO InteractionCreate, que se dispara cuando se crea una interacción (por ejemplo, cuando se ejecuta un comando de entrada de chat)
client.on(Events.InteractionCreate, async (interaction) => {
  // Verifica si la interacción no es un comando de entrada de chat, y si lo es, devuelve inmediatamente
  if (!interaction.isChatInputCommand()) return;

  // Obtiene el comando correspondiente utilizando el nombre del comando de la interacción
  const command = interaction.client.commands.get(interaction.commandName);

  console.log(`
  ----------
  Nombre del comando: ${interaction.commandName}
  Descripción del comando: ${interaction.commandName}
  Ejecutado por: ${interaction.user.tag}
  ----------
  `);

  // Verifica si no se encontró un comando con el nombre especificado, y si no lo hizo, registra un error en la consola y devuelve
  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  // Intenta ejecutar el comando
  try {
    // Ejecuta el comando utilizando el método execute del comando
    await command.execute(interaction);
  } catch (error) {
    // Si ocurre un error durante la ejecución, registra el error en la consola
    console.error(error);

    // Verifica si la interacción ya ha sido respondida o deferida, y si lo ha sido, envía una respuesta ephemeral (que solo el autor de la interacción puede ver)
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    } else {
      // Si la interacción no ha sido respondida o deferida, envía una respuesta ephemeral (que solo el autor de la interacción puede ver)
      await interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    }
  }
});

// Log in to Discord with your client's token
client.login(process.env["TOKEN"]);
