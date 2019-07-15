/* Non-export Helper functions */
function roundNum(num, place) {
  var mult = Math.pow(10, place);
  return Math.round(num * mult) / mult;
}

/* Data functions */
export function getEnglish(dataArr) {
  var englishObj = dataArr.find(curr => curr.language.name === "en");

  return englishObj;
}

/* String functions */
export function capitalize(str) {
  if (str) {
    return str[0].toUpperCase() + str.slice(1).toLowerCase();
  }

  return str;
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
