/*global Logger: false */

/**
 * merge the given date and time into a single Date object
 * @param {Date} date - a Date to get the date value from
 * @param {Date} time - a Date to get the time value from
 * @return {Date} a Date object with the merged items or set to default
 */
function mergeDateTime(date, time) {
  var ret = null;
  if(null !== date && "" !== date) {
    ret = new Date(date);
  }
  if(null !== ret && null !== time && "" !== time) {
    time = new Date(time);
    ret.setHours(time.getHours());
    ret.setMinutes(time.getMinutes());
  }
  return ret;
}
// getRowsData iterates row by row in the input range and returns an array of objects.
// Each object contains all the data for a given row, indexed by its normalized column name.
// Arguments:
//   - sheet: the sheet object that contains the data to be processed
//   - range: the exact range of cells where the data is stored
//   - columnHeadersRowIndex: specifies the row number where the column names are stored.
//       This argument is optional and it defaults to the row immediately above range;
// Returns an Array of objects.
function getRowsData(sheet, range, columnHeadersRowIndex) {
  columnHeadersRowIndex = columnHeadersRowIndex || range.getRowIndex() - 1;
  var numColumns = range.getLastColumn() - range.getColumn() + 1;
  var headersRange = sheet.getRange(columnHeadersRowIndex, range.getColumn(), 1, numColumns);
  var headers = headersRange.getValues()[0];
  return getObjects(range.getValues(), normalizeHeaders(headers));
}
// For every row of data in data, generates an object that contains the data. Names of
// object fields are defined in keys.
// Arguments:
//   - data: JavaScript 2d array
//   - keys: Array of Strings that define the property names for the objects to create
function getObjects(data, keys) {
  var objects = [];
  for (var i = 0; i < data.length; ++i) {
    var object = {};
    var hasData = false;
    for (var j = 0; j < data[i].length; ++j) {
      var cellData = data[i][j];
      if (isCellEmpty(cellData)) {
        continue;
      }
      object[keys[j]] = cellData;
      hasData = true;
    }
    if (hasData) {
      objects.push(object);
    }
  }
  return objects;
}
// Returns an Array of normalized Strings.
// Arguments:
//   - headers: Array of Strings to normalize
function normalizeHeaders(headers) {
  var keys = [];
  for (var i = 0; i < headers.length; ++i) {
    var key = normalizeHeader(headers[i]);
    if (key.length > 0) {
      keys.push(key);
    }
  }
  return keys;
}
// Normalizes a string, by removing all alphanumeric characters and using mixed case
// to separate words. The output will always start with a lower case letter.
// This function is designed to produce JavaScript object property names.
// Arguments:
//   - header: string to normalize
// Examples:
//   "First Name" -> "firstName"
//   "Market Cap (millions) -> "marketCapMillions
//   "1 number at the beginning is ignored" -> "numberAtTheBeginningIsIgnored"
function normalizeHeader(header) {
  var key = "";
  var upperCase = false;
  for (var i = 0; i < header.length; ++i) {
    var letter = header[i];
    if (letter === " " && key.length > 0) {
      upperCase = true;
      continue;
    }
    if (!isAlnum(letter)) {
      continue;
    }
    if (key.length === 0 && isDigit(letter)) {
      continue; // first character must be a letter
    }
    if (upperCase) {
      upperCase = false;
      key += letter.toUpperCase();
    } else {
      key += letter.toLowerCase();
    }
  }
  return key;
}
// Returns true if the cell where cellData was read from is empty.
// Arguments:
//   - cellData: string
function isCellEmpty(cellData) {
  return typeof(cellData) === "string" && cellData === "";
}
// Returns true if the character char is alphabetical, false otherwise.
function isAlnum(char) {
  return char >= 'A' && char <= 'Z' ||
    char >= 'a' && char <= 'z' ||
    isDigit(char);
}

// Returns true if the character char is a digit, false otherwise.
function isDigit(char) {
  return char >= '0' && char <= '9';
}

// test if the given value is in the given array
function ArrayContains(array, value){
  var ret = false;
  for(var i = 0; i < array.length && !ret; ++i){
    ret = array[i] === value;
  }
  return ret;
}


function StringStartsWith(source, startsWith){
  var ret = true;
  var i = 0;
  while(ret && i < startsWith.length){
    ret = source.charAt(i) === startsWith.charAt(i);
    ++i;
  }

  return ret;
}


function Sub15Minutes(time){
  return new Date(time.getTime() - 900000);
}

function Sub150Minutes(time){
  return new Date(time.getTime() - 9000000);
}

function Add90Minutes(time){
  return new Date(time.getTime() + 5400000);
}

var coeff = 1000 * 60 * 5;
function RoundTo5Minutes(time){
	return new Date(Math.round(time.getTime() / coeff) * coeff)
}
