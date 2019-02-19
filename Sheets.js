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

function SheetBase(spreadSheetProperty, sheetName, useMapped){
  if(null != spreadSheetProperty && null != sheetName){
    this.useMapped = useMapped;
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
      row = new this.Row();
      var firstRow = this.sheet.getRange(1, 1, 1, row.numColumns);
      header = new Array();
      header.push(row.getHeaderArray())
      firstRow.setValues(header);
    }
  }

  if(null !== this.sheet){
    this.startingRow = this.sheet.getFrozenRows() + 1;
  }
};

SheetBase.prototype.rowIsValid = function(rowBase){
  return false;
}

SheetBase.prototype.refreshRows = function (useMapped) {
  var sheetDataRange = this.sheet.getDataRange();
  var numSheetRows = sheetDataRange.getLastRow() + 1 - this.startingRow;
  var numColumns = sheetDataRange.getLastColumn()
  var fullRange = this.sheet.getRange(this.startingRow, 1, numSheetRows, numColumns);
  var rawArrays = fullRange.getValues();
  this.rows = new Array();
  for(var i = 0; i < rawArrays.length; ++i){
    var row = new this.Row();
    if(this.useMapped){
      row.fromMappedArray(rawArrays[i]);
    }
    else{
      row.fromArray(rawArrays[i]);
    }
    if(this.rowIsValid(row)){
      this.rows.push(row);
    }
  }
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

SheetBase.prototype.addRow = function(row){
  if(null === this.sheet){
      throw {'name': 'Error',
      'message': 'SheetBase.addRow: There is currenly no sheet available'};

  }
  this.sheet.appendRow(row.columnValues);
  var range = sheet.getRange(sheet.getLastRow(), 1, 1, row.columnItems.length);
  range.setNumberFormats(this.formatStrings);
};


SheetBase.prototype.updateRow = function(newRow) {
  var row = this.findRow(newRow);
  if(null !== row){
      row.update(newRow);
      var range = this.getRowRange(row.index);
      row.updateRange(range);
  }
  else {
      this.addRow(newRow);
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
}


PerformerSheet.prototype.findPerformerByName = function(name) {
  var performer = null;
  var NameRow = new PerformerRow();
  var nameParts = name.split(" ");
  NameRow.firstName = nameParts[0];
  NameRow.lastName = nameParts[1];
  for(var i = 0; i < this.rows.length && null === performer; ++i){
    if(this.rows[i].matchesTemplateRow(NameRow)) {
      performer = this.rows[i];
    }
  }
  if(null === performer) {
    Logger.log("findPerformer was unable to locate " + name);
  }
  return performer;
};


function testFindPerformer(){
  var performerName = 'Alan Plotkin';

  var performerSheet = new PerformerSheet();
  var performer = performerSheet.findPerformerByName(performerName);
  if(null !== performer){
    performer.toLog();
  }
  else{
    Logger.log("Performer not found");
  }
}


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
  }

  /* create a new shift row if needed for the given preformer
   * return: true if row was added else false
   */
  this.processRow = function(performerRow){
      if(   performerRow.flightArrivalNum != null
         && !(performerRow.flightArrivalisShiftEntered)
         && performerRow.flightArrivalNum !== ""
         && performerRow.needsPickUp()){
          this.createShift(performerRow, true);
          performerRow.flightArrivalisShiftEntered = true;
      }

      if(   performerRow.flightDepartNum !== null
         && !(performerRow.flightDepartIsShiftEntered)
         && performerRow.flightDepartNum !== ""
         && performerRow.needsDropOff()){
            this.createShift(performerRow, false);
            performerRow.flightDepartIsShiftEntered = true;
      }
      Logger.log("Updating");
      performerRow.toLog();
    }




