export const EXPRESS_ENDPOINTS = {
  getPokemon: "/getPokemon",
  getSpecies: "/getSpecies",
  getMoves: "/getMoves",
  getItems: "/getItems",
  getBerries: "/getBerries",
  getAbility: "/getAbility",
  getType: "/getType",
  getEvolution: "/getEvolution",
  getResource: "/getResource"
};

export const TYPE_EFFECT_ABILITIES = {
  fluffy: [{type: "fire", mult: 2}],
  levitate: [{type: "ground", mult: 0}],
  filter: [{type: "super-effective", mult: 0.75}],
  "dry-skin": [{type: "water", mult: 0}, {type: "fire", mult: 1.25}],
  "flash-fire": [{type: "fire", mult: 0}],
  "lightning-rod": [{type: "electric", mult: 0}],
  "motor-drive": [{type: "electric", mult: 0}],
  "sap-sipper": [{type: "grass", mult: 0}],
  "storm-drain": [{type: "water", mult: 0}],
  "volt-absorb": [{type: "electric", mult: 0}],
  "water-absorb": [{type: "water", mult: 0}],
  "solid-rock": [{type: "super-effective", mult: 0.75}],
  "wonder-guard": [{type: "non super-effective", mult: 0}],
  "thick-fat": [{type: "ice", mult: 0.5}, {type: "fire", mult: 0.5}]
};

export const DEFAULT_QUERY = {
  wormadam: "wormadam-plant",
  nidoran: "nidoran-m"
};
