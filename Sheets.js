/* eslint-disable eqeqeq */
/*global SpreadsheetApp: false */
/*global PropertiesService: false */
/*global Logger: false*/

// eslint-disable-next-line valid-jsdoc
/**
 *  This is an abstract basc class for the Sheets. It requires the following properties be present
 *  when the derived class calls it;
 *  this.Row: function - The constructor for the ActRow of the sheet
 * @param {String} spreadSheetProperty - name of the script property of the spreadSheetID
 * @param {String} sheetNameProperty - name of the script property of the sheetName
 */
SheetBase.prototype.constructor = SheetBase;
SheetBase.prototype.sheet = null;
SheetBase.prototype.Row = null;
SheetBase.prototype.startingRow = 1;
SheetBase.prototype.rows = null;

function SheetBase(spreadSheetProperty, sheetName){
  if(null != spreadSheetProperty && null != sheetName){
    this.loadSheet(spreadSheetProperty, sheetName);
    this.refreshRows();
  }
}

SheetBase.prototype.loadSheet = function(spreadSheetProperty, sheetName){
  // eslint-disable-next-line eqeqeq
  if(null != spreadSheetProperty && null != sheetName){
    var scriptProperties = PropertiesService.getScriptProperties();
    var spreadSheetID = scriptProperties.getProperty(spreadSheetProperty);
    var spreadSheet = SpreadsheetApp.openById(spreadSheetID);
    this.sheet = spreadSheet.getSheetByName(sheetName);

    if(null === this.sheet){
      this.sheet = spreadSheet.insertSheet(sheetName);
      this.sheet.insertRows(1);
      row = new this.Row(0);
      var firstRow = this.sheet.getRange(1, 1, 1, row.numColumns);
      header = new Array();
      header.push(row.getHeaderArray());
      firstRow.setValues(header);
    }
  }

  if(null !== this.sheet){
    this.startingRow = this.sheet.getFrozenRows() + 1;
  }
};

SheetBase.prototype.rowIsValid = function(rowBase){
  return true;
};

SheetBase.prototype.getFullRange = function() {
  var sheetDataRange = this.sheet.getDataRange();
  var numSheetRows = sheetDataRange.getLastRow() + 1 - this.startingRow;
  var numColumns = sheetDataRange.getLastColumn();
  var fullRange = this.sheet.getRange(this.startingRow, 1, numSheetRows, numColumns);
  return fullRange;
};

SheetBase.prototype.refreshRows = function () {
  var fullRange = this.getFullRange();
  var rawArrays = fullRange.getValues();
  this.rows = new Array();
  for(var i = 0; i < rawArrays.length; ++i){
    var row = new this.Row(i);
    row.fromSheetArray(rawArrays[i]);
    if(this.rowIsValid(row)){
      this.rows.push(row);
    }
  }
};


SheetBase.prototype.updateSheet = function() {
  var fullRange = this.getFullRange();
  var rawArrays = fullRange.getValues();
  for(var i = 0; i < this.rows.length; ++i){
    this.rows[i].toSheetArray(rawArrays[this.rows[i].sheetIndex]);
  }
  fullRange.setValues(rawArrays);
};

/**
* Given the index of row data in the this.rows
* @param {int} rowIndex - the 0 base index of the row desired
* @returns {int} the index of the row in the sheet
*/
SheetBase.prototype.getSheetRowIndex = function(rowIndex){
  return rowIndex + this.startingRow;
};

/*
* Get a spreadsheet range for the given row number
*/
SheetBase.prototype.getRowRange = function(rowNumber){
  var range = null;
  if(null !== this.sheet){
    range = this.sheet.getRange(this.getSheetRowIndex(rowNumber), 1, 1, this.sheet.getLastColumn());
  }
  return range;
};

/**
* get the Row by index
* @param {int} rowNumber the index of the row to get
* @returns {RowBase} the row of whatever type this sheet uses
*/
SheetBase.prototype.getRow = function(rowNumber){
  // var range = this.getRowRange(rowNumber);
  // var row = new (this.Row)();
  // row.updateFromRange(range)
  return this.rows[rowNumber];
};

/**
* predicate to find the same row in the sheet
* @param {RowBase} currentRow - The current row under test
* @param {RowBase} searchRow - The row being searched for
* @returns {Bool} true if the row data is completely equal
*/
SheetBase.prototype.matchRows = function(currentRow, searchRow){
  return currentRow.matchesTemplateRow(searchRow);
};

/**
* Find the row for the given predicate
* @param {function} rowPredicate - function to test for true
* @param {Object} predicateParam - any parameter you want pasted to the predicate
* @returns {RowBase} reference to the first object found or null
*/
SheetBase.prototype.findBy = function(rowPredicate, predicateParam) {
  var row = null;
  for(var index = 0; this.rows.length > index && null === row; ++index){
      var currentRow = this.rows[index];
      if(rowPredicate(currentRow, predicateParam)){
          row = currentRow;
      }
  }
  if(null === row) {
      Logger.log("findBy was unable to locate row");
  }
  return row;
};

/**
* find a sheet row for the given data
* @param {Row} row - the row to find
* @return {RowBase} - the row that was found or null if not found
*/
SheetBase.prototype.findRow = function(row){
  return this.findBy(this.matchRows, row);
};


SheetBase.prototype.logRow = function(rowName, row){
  Logger.log(rowName + "{");
  Logger.log("   Act:" + row.actName);
  Logger.log("   TimeStamp:" + row.timeStamp);
  Logger.log("   FirstName:" + row.firstName);
  Logger.log("   LastName:" + row.lastName);
  Logger.log("};");
};

SheetBase.prototype.newSheetRowArray = function(row){
  var sheetDataRange = this.sheet.getDataRange();
  var numColumns = sheetDataRange.getLastColumn();
  var newSheetRowArray = new Array(numColumns);
  for(var i = 0; i < numColumns; ++i){
    newSheetRowArray[i] = "";
  }
  row.toSheetArray(newSheetRowArray);
  return newSheetRowArray;
};

SheetBase.prototype.addRow = function(row){
  if(null === this.sheet){
      throw {'name': 'Error',
      'message': 'SheetBase.addRow: There is currenly no sheet available'};

  }
  var newSheetArray = this.newSheetRowArray(row);
  this.sheet.appendRow(newSheetArray);
  //var range = sheet.getRange(sheet.getLastRow(), 1, 1, row.columnItems.length);
  //row.formatStringsToSheetArray(newSheetArray);
  //range.setNumberFormats(newSheetArray);
  //this.refreshRows();
};


SheetBase.prototype.updateRow = function(updatedRow) {
  if(updatedRow.sheetIndex == -1){
    this.addRow(updatedRow);
  }
  else{
    var sheetRowArray = this.newSheetRowArray(updatedRow);
    var rowsArray = [];
    rowsArray.push(sheetRowArray);
    var range = this.getRowRange(updatedRow.sheetIndex);
    range.setValues(rowsArray);
  }
};

//------------------------------ PerformerSheet -------------------------------------

PerformerSheet.prototype = new SheetBase();
PerformerSheet.prototype.constructor = PerformerSheet;
PerformerSheet.prototype.Row = PerformerRow;

function PerformerSheet()
{
  SheetBase.call(this,"PERFORMER_SHEET_ID", "ACTS", true);
}

PerformerSheet.prototype.rowIsValid = function(rowBase){
  return rowBase.numberInAct && rowBase.numberInAct !== "";
};


PerformerSheet.prototype.findByName = function(name) {
  var performer = null;
  var nameRow = new PerformerRow();
  var nameParts = name.split(" ");
  nameRow.firstName = nameParts[0];
  nameRow.lastName = nameParts[1];
  for(var i = 0; i < this.rows.length && null === performer; ++i){
    if(this.rows[i].matchesTemplateRow(nameRow)) {
      performer = this.rows[i];
    }
  }
  if(null === performer) {
    Logger.log("PerformerSheet.findByName was unable to locate " + name);
  }
  return performer;
};

PerformerSheet.prototype.getPerformerList = function(filter) {
  var performers = [];
  if( undefined === filter || null === filter){
    filter = function(item) {return true;};
  }
  for(var i = 0; i < this.rows.length; ++i){
    if(this.rows[i].firstName != "" && this.rows[i].lastName != "" && filter(this.rows[i])){
      performers.push(this.rows[i].firstName + ' ' + this.rows[i].lastName);
    }
  }
  return performers;
};

/*
 * Get a list of the Acts
 */
PerformerSheet.prototype.getActList = function(){
  var list = [];
  for(var i = 0; i < this.rows.length; ++i){
    if(this.rows[i].actName != "" && !ArrayContains(list, this.rows[i].actName)){
        list.push(this.rows[i].actName);
    }
  }
  return list.sort();
};



function testFindPerformer(){
  var performerName = 'Alan Plotkin';

  var performerSheet = new PerformerSheet();
  var performer = performerSheet.findByName(performerName);
  if(null !== performer){
    performer.toLog();
  }
  else{
    Logger.log("Performer not found");
  }
}

//---------------------- Shift Sheet ---------------------------------

ShiftSheet.prototype = new SheetBase();
ShiftSheet.prototype.constructor = ShiftSheet;
ShiftSheet.prototype.Row = ShiftRow;


function ShiftSheet(){
  SheetBase.call("SHIFT_SHEET_ID", "Sheet1", false);
}

ShiftSheet.prototype.createShift = function(performerRow, isArrival){
    var rowNum = this.getNumRows();
    if(rowNum > 1)
      ++rowNum;
    var shiftRow = new SimpleShiftRow(this.getShiftRowRange(this.getNumRows() + 1));
    shiftRow.fromPerformerRow(performerRow, isArrival);
  };

/* create a new shift row if needed for the given preformer
  * return: true if row was added else false
  */
 ShiftSheet.prototype.processRow = function(performerRow){
  if(   performerRow.flightArrivalNum != null
    && !performerRow.flightArrivalisShiftEntered
    && performerRow.flightArrivalNum !== ""
    && performerRow.needsPickUp)
  {
    this.createShift(performerRow, true);
    performerRow.flightArrivalisShiftEntered = true;
  }

  if(   performerRow.flightDepartNum !== null
    && !performerRow.flightDepartIsShiftEntered
    && performerRow.flightDepartNum !== ""
    && performerRow.needsDropOff)
  {
    this.createShift(performerRow, false);
    performerRow.flightDepartIsShiftEntered = true;
  }
  Logger.log("Updating");
  performerRow.toLog();
};


function testShiftSheet(){

  var shiftSheet = new ShiftSheet();
  var performerSheet = new PerformerSheet();

  for(var row in performerSheet.rows) {
    shiftSheet.ProcessRow(row);
  }

  shiftSheet.updateSheet();
}

//---------------------- Driver Sheet ---------------------------------

DriverSheet.prototype = new SheetBase();
DriverSheet.prototype.constructor = DriverSheet;
DriverSheet.prototype.Row = DriverRow;

function DriverSheet()
{
  SheetBase.call(this,"DRIVER_SHEET_ID", "Sheet1");
}

DriverSheet.prototype.findByName = function(name) {
  var driverRow = null;
  var nameRow = new DriverRow();
  nameRow.screenName = name;
  for(var i = 0; i < this.rows.length && null === driverRow; ++i){
    if(this.rows[i].matchesTemplateRow(nameRow)) {
      driverRow = this.rows[i];
    }
  }
  if(null === driverRow) {
    Logger.log("DriverSheet.findByName was unable to locate " + name);
  }
  return driverRow;
};

DriverSheet.prototype.getDriverList = function () {
  var drivers = [];
  for(var i = 0; i < this.rows.length; ++i){
    drivers.push(this.rows[i].screenName);
  }
  return drivers;
};
