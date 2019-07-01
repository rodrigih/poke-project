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
