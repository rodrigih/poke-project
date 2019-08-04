import {EXPRESS_ENDPOINTS} from "../constants";

const {
  getPokemon,
  getSpecies,
  getAbility,
  getType,
  getEvolution,
  getResource
} = EXPRESS_ENDPOINTS;

export const getPokemonByName = async name => {
  const lowerCaseName = name.toLowerCase();
  const response = await fetch(`${getPokemon}/${lowerCaseName}`);
  const body = response.json();

  if (response.status !== 200) {
    throw Error(body.message);
  }

  return body;
};

export const getPokemonSpeciesByName = async name => {
  const lowerCaseName = name.toLowerCase();
  const response = await fetch(`${getSpecies}/${lowerCaseName}`);
  const body = response.json();

  if (response.status !== 200) {
    throw Error(body.message);
  }

  return body;
};

export const getAbilityByName = async name => {
  const lowerCaseName = name.toLowerCase();
  lowerCaseName.replace(" ", "-");

  const response = await fetch(`${getAbility}/${lowerCaseName}`);
  const body = response.json();

  if (response.status !== 200) {
    throw Error(body.message);
  }

  return body;
};

export const getTypeByName = async name => {
  const lowerCaseName = name.toLowerCase();

  const response = await fetch(`${getType}/${lowerCaseName}`);
  const body = response.json();

  if (response.status !== 200) {
    throw Error(body.message);
  }

  return body;
};

export const getEvolutionByUrl = async id => {
  const response = await fetch(`${getEvolution}/${id}`);
  const body = response.json();

  if (response.status !== 200) {
    throw Error(body.message);
  }

  return body;
};

export const getResourceByUrl = async url => {
  const paramUrl = encodeURIComponent(url);
  const response = await fetch(`${getResource}/${paramUrl}`);
  const body = response.json();

  if (response.status !== 200) {
    throw Error(body.message);
  }

  return body;
};
