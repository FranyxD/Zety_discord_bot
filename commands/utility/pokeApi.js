const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");

async function buscarPokemon(pokemon) {
  pokemon = pokemon.toLowerCase();
  try {
    const url = `https://pokeapi.co/api/v2/pokemon/${pokemon}`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.log("Error al buscar el pokemon:");
    return null;
  }
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("pokemon")
    .setDescription("Replies with the info of the pokemon")
    .addStringOption((option) =>
      option.setName("input").setDescription("Devuelve el nombre del pokemon"),
    ),
  async execute(interaction) {
    const pokemon = interaction.options.getString("input");
    //console.log(pokemon);
    const pokemonEncontrado = await buscarPokemon(pokemon);
    

    console.log("datos pokemon" , pokemonEncontrado);
    if (pokemonEncontrado !== null) {
      let datosPokemon = `
    Pokemon encontrado 
    ${pokemonEncontrado.id}
    ${pokemonEncontrado.name}
${pokemonEncontrado.types[0].type.name}
    `;
       await interaction.reply(datosPokemon);
    } else {
       await interaction.reply("No se encontro el pokemon");
    }
    
  },
};
