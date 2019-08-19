import {remove as removeDiacritics} from "diacritics";
import {MINIOR_COLOURS} from "../constants";

/* Non-export Helper functions */
function roundNum(num, place) {
  var mult = Math.pow(10, place);
  return Math.round(num * mult) / mult;
}

/* String functions */
export function preprocessPokemonName(pokemon) {
  var pokemonName = pokemon.toLowerCase().trim();
  var removeChars = new RegExp(/\./);
  var whiteSpace = new RegExp(/ +/);

  // First rearrange order of "mega" and "alola"
  pokemonName = pokemonName.replace(whiteSpace, " ");
  pokemonName = pokemonName.replace("alolan", "alola");

  var wordArr = pokemonName.split(" ");
  if (wordArr[0] === "mega" || wordArr[0] === "alola") {
    var newStart = wordArr.slice(0, 2).reverse();
    wordArr = newStart.concat(wordArr.slice(2));
  }

  // Replace white spaces with dashes and remove special characters
  pokemonName = wordArr.join("-");
  pokemonName = pokemonName.replace(removeChars, "");
  pokemonName = removeDiacritics(pokemonName);

  // Nidoran special case
  if (pokemonName.match(/^(nidoran-male|male-nidoran)$/)) {
    pokemonName = "nidoran-m";
  } else if (pokemonName.match(/^(nidoran-female|female-nidoran)$/)) {
    pokemonName = "nidoran-f";
  }

  // Minior special case
  var miniorPatternStr = `^(${MINIOR_COLOURS})-minior`;
  var miniorPattern = new RegExp(miniorPatternStr);

  if (pokemonName.match(miniorPattern)) {
    var colour = pokemonName.match(MINIOR_COLOURS)[0];
    pokemonName = `minior-${colour}`;
  }

  return pokemonName;
}
export function capitalize(str) {
  if (str) {
    return str[0].toUpperCase() + str.slice(1).toLowerCase();
  }

  return str;
}

/* Data functions */
export function getEnglish(dataArr) {
  var englishObj = dataArr.find(curr => curr.language.name === "en");

  return englishObj;
}

export function createSpriteUrl(pokemonName, pokedexNum) {
  const gen7_start = 722; // Start of gen 7 pokemon based on pokedex number

  var urlName = preprocessPokemonName(pokemonName);
  urlName = urlName.replace(/alola$/, "alolan");

  // Reformat name for minior
  if (urlName.match(/^minior.*meteor/)) {
    urlName = "minior-meteor";
  } else if (urlName.match(/^minior/)) {
    var colourPattern = new RegExp(`(${MINIOR_COLOURS})`);
    var colour = urlName.match(colourPattern)[0];
    urlName = `minior-${colour}-core`;
  }

  // reformat name for mimikyu
  if (urlName.match("^mimikyu")) {
    urlName = "mimikyu";
  }

  var game =
    pokedexNum < gen7_start && !urlName.match("alolan?") ? "x-y" : "sun-moon";

  return `https://img.pokemondb.net/sprites/${game}/normal/${urlName}.png`;
}

/* Conversion functions */
export function decimetersToInches(dec) {
  var inchesRaw = dec * 3.937;
  var inches = roundNum(inchesRaw, 0);
  return inches;
}

export function hectogramsToPounds(hect) {
  var poundsRaw = hect / 4.536;
  var pounds = roundNum(poundsRaw, 1);
  return pounds;
}

/* Pokemon Stat funcitons */
export function calcStat(statInfo) {
  if (!statInfo || Object.keys(statInfo).length === 0) {
    return 0;
  }

  const {stat, baseStat, iv, ev, level, natureMult} = statInfo;

  var numerator = (2 * baseStat + iv + Math.floor(ev / 4)) * level;
  const denom = 100;

  var quotient = Math.floor(numerator / denom);

  if (stat.toLowerCase() === "hp") {
    return quotient + level + 10;
  }

  return Math.floor((quotient + 5) * natureMult);
}

/* Sorting functions */
export function sortBySlot(a, b) {
  return a.slot - b.slot;
}
