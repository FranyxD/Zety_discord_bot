const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");

async function buscarPokemon(pokemon) {
  try {
    const url = `https://pokeapi.co/api/v2/pokemon/${pokemon}`;
    const response = await axios.get(url);
    //console.log("buscarPokemon", response.data)
    return response.data;
  } catch (error) {
    console.log("error al buscar el pokemon");
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
    //console.log(interaction.options)
    const pokemonEncontrado = await buscarPokemon(pokemon);
    const datosPokemon = `
    Pokemon encontrado 
    ${pokemonEncontrado.id}
    ${pokemonEncontrado.name}
    ${pokemonEncontrado.types[0].type.name}
    `;
    await interaction.reply(datosPokemon);
  },
};
