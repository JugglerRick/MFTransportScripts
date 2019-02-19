/* eslint-disable eqeqeq */
/*global Utilities: false */
/*global Logger: false */
/*global mergeDateTime: false */

'use strict';


ColumnItem.prototype.constructor = ColumnItem;
ColumnItem.prototype.header = "";
ColumnItem.prototype.name = null;
ColumnItem.prototype.format = "@";
ColumnItem.prototype.mapIndex = 0;

function ColumnItem(name, header, format, mapIndex) {
  this.name = name;
  this.header = header;
  this.format = format;
  this.mapIndex = mapIndex;
}



ColumnItem.prototype.isStringFormat = function () {
  return this.format === ColumnItem.prototype.format;
};


// RowBase properties that are required
//  derived classes should provide all these properties
RowBase.prototype.constructor = RowBase;
RowBase.prototype.columnItems = null;
RowBase.prototype.sheetIndex = 0;
RowBase.prototype.numColumns = function(){return this.columnItems.length;};

/**
 * RowBase object constructor
 * The prototype of the derived object calling this must contain the following
 * properties;
 * columnItems - an array of ColumnItem objects
 *
 */
function RowBase() {
  if (null !== this.columnItems && this.columnItems.length > 0) {
    this.columnValues = new Array(this.columnItems.length);
    this.formatStrings = new Array();
    var rowFormatStr = new Array();
    for (var i = 0; i < this.columnItems.length; ++i) {
      // define the column value indexs
      Object.defineProperty(this, this.columnItems[i].name, { value: i, writable: false, enumerable: false });
      rowFormatStr.push(this.columnItems[i].format);
            //this.formatStrings.push(this.columnItems[i].format);
    }
    this.formatStrings.push(rowFormatStr);
  }
}
/**
 * Get the array of Column Header Names
 * @returns {String[]} the array of Column Names
 */
RowBase.prototype.getHeaderArray = function () {
  var retArray = new Array();

  this.columnItems.forEach(function(item) {
    retArray.push(item.header);
  });
  return retArray;
};

/**
 * Find the first column item for this row that does not equal the given row
 * @param {RowBase} row - the row to compare to
 * @returns {int} The index of the column in this row that does NOT equal the
 *                given row or -1 if the Rows are equal
 */
RowBase.prototype.findDifference = function (row) {
  var found = false;
  var ret = 0;
  while(ret < this.columnValues.length && !found) {
    found = this.columnValues[ret] === row.columnValues[ret];
    ++ret;
  }
  if(!found){
      ret = -1;
  }
  return ret;
};

/**
 * Test if the given row fits this template instance
 * @param {RowBase} templateRow - The row object that defines the compare
 * @returns {Bool} True this row matches the template Row
 * @description Template Rows are RowBase objects that only contain data in
 * fields that you wish to compare, if a field is not set in the templateRow
 * the field is ignored in the compare
 */
RowBase.prototype.matchesTemplateRow = function (templateRow) {
  var match = true;
  var index = 0;
  while(index < this.columnItems.length && match) {
    var testValue = templateRow.columnValues[index];
    if(null != testValue && testValue !== ""){
      match = this.columnValues[index] === testValue;
    }
    ++index;

  }
  return match;
};

/**
 * Update this RowBase with the columns from the given RowBase
 * @param {RowBase} row - the row to update from
 */
RowBase.prototype.copy = function(row){this.fromArray(row.columnValues);};

/**
 * Set the array of column values to the values given in the Arra
 * @param {Array}sourceArray - the array to set the column values from
 */
RowBase.prototype.fromArray = function (sourceArray) {
  for (var i = 0; i < this.columnItems.length; ++i) {
    var sourceIndex = i
    var item = sourceArray[i];
    if ( "@" === this.formatStrings[i]) {
      item = String(item).trim();
    }
    this.columnValues[i] = item;
  }
};

RowBase.prototype.toArray = function (destinationArray) {
  for (var i = 0; i < this.columnItems.length; ++i) {
    destinationArray[i] = this.columnValues[i];
  }
};


RowBase.prototype.fromMappedArray = function (sourceArray) {
  for (var i = 0; i < this.columnItems.length; ++i) {
    var item = sourceArray[this.columnItems[i].mapIndex];
    if ("@" === this.formatStrings[i]) {
      item = String(item).trim();
    }
    this.columnValues[i] = item;
  }
  var array = this.columnValues;
};

RowBase.prototype.toMappedArray = function (destinationArray) {
  for (var i = 0; i < this.columnItems.length; ++i) {
    destinationArray[this.columnItems[i].mapIndex] = this.columnValues[i];
  }
};


//---------------------- PerformerRow -----------------------------------------

PerformerRow.prototype.constructor = PerformerRow;
PerformerRow.prototype = new RowBase();
PerformerRow.prototype.columnItems = [
  { name: "ACT_TYPE"              , header: "" , mapIndex:    0, format: "#"},
  { name: "ACT_NAME"              , header: "" , mapIndex:    1, format: "@"},
  { name: "NUMBER_IN_ACT"         , header: "" , mapIndex:    2, format: "@"},
  { name: "FIRST_NAME"            , header: "" , mapIndex:    3, format: "@"},
  { name: "LAST_NAME"             , header: "" , mapIndex:    4, format: "@"},
  { name: "MOBILE"                , header: "" , mapIndex:    5, format: "@"},
  { name: "EMAIL"                 , header: "" , mapIndex:    6, format: "@"},
  { name: "METHOD"                , header: "" , mapIndex:    7, format: "@"},
  { name: "NEEDS_RIDES"           , header: "" , mapIndex:   13, format: "@"},
  { name: "NEEDS_SHUTTLE"         , header: "" , mapIndex:   14, format: "@"},
  { name: "TRAVEL_NOTES"          , header: "" , mapIndex:   23, format: "@"},
  { name: "COMING_FROM"           , header: "" , mapIndex:   25, format: "@"},
  { name: "ARRIVING_AT"           , header: "" , mapIndex:   26, format: "@"},
  { name: "ARRIVAL_DATE"          , header: "" , mapIndex:   27, format: "mm-dd-yyyy"},
  { name: "ARRIVAL_TIME"          , header: "" , mapIndex:   28, format: "hh:mm"},
  { name: "ARRIVAL_NUM"           , header: "" , mapIndex:   29, format: "@"},
  { name: "ARRIVAL_NOTES"         , header: "" , mapIndex:   30, format: "@"},
  { name: "NEEDS_PICKUP"          , header: "" , mapIndex:   31, format: "@"},
  { name: "ARRIVAL_SHIFT_ENTERED" , header: "" , mapIndex:   32, format: "@"},
  { name: "ARRIVAL_DRIVER"        , header: "" , mapIndex:   33, format: "@"},
  { name: "ARRIVAL_PHONE"         , header: "" , mapIndex:   34, format: "@"},
  { name: "GOING_TO"              , header: "" , mapIndex:   36, format: "@"},
  { name: "DEPART_FROM"           , header: "" , mapIndex:   37, format: "@"},
  { name: "DEPART_DATE"           , header: "" , mapIndex:   38, format: "mm-dd-yyyy"},
  { name: "DEPART_TIME"           , header: "" , mapIndex:   39, format: "hh:mm"},
  { name: "DEPART_NUM"            , header: "" , mapIndex:   40, format: "@"},
  { name: "DEPART_NOTES"          , header: "" , mapIndex:   41, format: "@"},
  { name: "NEEDS_DROPOFF"         , header: "" , mapIndex:   42, format: "@"},
  { name: "DEPART_SHIFT_ENTERED"  , header: "" , mapIndex:   43, format: "@"},
  { name: "DEPART_DRIVER"         , header: "" , mapIndex:   44, format: "@"},
  { name: "DEPART_PHONE"          , header: "" , mapIndex:   45, format: "@"},
  { name: "HOUSING_HOST"          , header: "" , mapIndex:   49, format: "@"},
  { name: "HOUSING_PHONE"         , header: "" , mapIndex:   50, format: "@"},
  { name: "HOUSING_ADDDRESS"      , header: "" , mapIndex:   51, format: "@"},
  { name: "HOUSING_EMAIL"         , header: "" , mapIndex:   52, format: "@"}
];

function PerformerRow(){
  RowBase.call(this);
  Object.defineProperty(this, 'actName'             ,{get: function(){return this.columnValues[this.ACT_NAME        ];}, set: function(value){this.columnValues[this.ACT_NAME        ] = value;}, enumerable: true});
  Object.defineProperty(this, 'firstName'           ,{get: function(){return this.columnValues[this.FIRST_NAME      ];}, set: function(value){this.columnValues[this.FIRST_NAME      ] = value;}, enumerable: true});
  Object.defineProperty(this, 'lastName'            ,{get: function(){return this.columnValues[this.LAST_NAME       ];}, set: function(value){this.columnValues[this.LAST_NAME       ] = value;}, enumerable: true});
  Object.defineProperty(this, 'numberInAct'         ,{get: function(){return this.columnValues[this.NUMBER_IN_ACT   ];}, set: function(value){this.columnValues[this.NUMBER_IN_ACT   ] = value;}, enumerable: true});
  Object.defineProperty(this, 'mobile'              ,{get: function(){return this.columnValues[this.MOBILE          ];}, set: function(value){this.columnValues[this.MOBILE          ] = value;}, enumerable: true});
  Object.defineProperty(this, 'eMail'               ,{get: function(){return this.columnValues[this.EMAIL           ];}, set: function(value){this.columnValues[this.EMAIL           ] = value;}, enumerable: true});
  Object.defineProperty(this, 'needsRides'          ,{get: function(){return this.columnValues[this.NEEDS_RIDES     ];}, set: function(value){this.columnValues[this.NEEDS_RIDES     ] = value;}, enumerable: true});
  Object.defineProperty(this, 'needsShuttle'        ,{get: function(){return this.columnValues[this.NEEDS_SHUTTLE   ];}, set: function(value){this.columnValues[this.NEEDS_SHUTTLE   ] = value;}, enumerable: true});
  Object.defineProperty(this, 'travelMethod'        ,{get: function(){return this.columnValues[this.METHOD          ];}, set: function(value){this.columnValues[this.METHOD          ] = value;}, enumerable: true});
  Object.defineProperty(this, 'travelNotes'         ,{get: function(){return this.columnValues[this.TRAVEL_NOTES    ];}, set: function(value){this.columnValues[this.TRAVEL_NOTES    ] = value;}, enumerable: true});
  Object.defineProperty(this, 'comingFrom'          ,{get: function(){return this.columnValues[this.COMING_FROM     ];}, set: function(value){this.columnValues[this.COMING_FROM     ] = value;}, enumerable: true});
  Object.defineProperty(this, 'arrivingAt'          ,{get: function(){return this.columnValues[this.ARRIVING_AT     ];}, set: function(value){this.columnValues[this.ARRIVING_AT     ] = value;}, enumerable: true});
  Object.defineProperty(this, 'arriveDate'          ,{get: function(){return this.columnValues[this.ARRIVAL_DATE    ];}, set: function(value){this.columnValues[this.ARRIVAL_DATE    ] = value;}, enumerable: true});
  Object.defineProperty(this, 'arriveTime'          ,{get: function(){return this.columnValues[this.ARRIVAL_TIME    ];}, set: function(value){this.columnValues[this.ARRIVAL_TIME    ] = value;}, enumerable: true});
  Object.defineProperty(this, 'flightArrivalNum'    ,{get: function(){return this.columnValues[this.ARRIVAL_NUM     ];}, set: function(value){this.columnValues[this.ARRIVAL_NUM     ] = value;}, enumerable: true});
  Object.defineProperty(this, 'flightArrivalNotes'  ,{get: function(){return this.columnValues[this.ARRIVAL_NOTES   ];}, set: function(value){this.columnValues[this.ARRIVAL_NOTES   ] = value;}, enumerable: true});
  Object.defineProperty(this, 'flightArrivalDriver' ,{get: function(){return this.columnValues[this.ARRIVAL_DRIVER  ];}, set: function(value){this.columnValues[this.ARRIVAL_DRIVER  ] = value;}, enumerable: true});
  Object.defineProperty(this, 'flightArrivalPhone'  ,{get: function(){return this.columnValues[this.ARRIVAL_PHONE   ];}, set: function(value){this.columnValues[this.ARRIVAL_PHONE   ] = value;}, enumerable: true});
  Object.defineProperty(this, 'goingTo'             ,{get: function(){return this.columnValues[this.GOING_TO        ];}, set: function(value){this.columnValues[this.GOING_TO        ] = value;}, enumerable: true});
  Object.defineProperty(this, 'departForm'          ,{get: function(){return this.columnValues[this.DEPART_FROM     ];}, set: function(value){this.columnValues[this.DEPART_FROM     ] = value;}, enumerable: true});
  Object.defineProperty(this, 'departDate'          ,{get: function(){return this.columnValues[this.DEPART_DATE     ];}, set: function(value){this.columnValues[this.DEPART_DATE     ] = value;}, enumerable: true});
  Object.defineProperty(this, 'departTime'          ,{get: function(){return this.columnValues[this.DEPART_TIME     ];}, set: function(value){this.columnValues[this.DEPART_TIME     ] = value;}, enumerable: true});
  Object.defineProperty(this, 'flightDepartNum'     ,{get: function(){return this.columnValues[this.DEPART_NUM      ];}, set: function(value){this.columnValues[this.DEPART_NUM      ] = value;}, enumerable: true});
  Object.defineProperty(this, 'flightDepartNotes'   ,{get: function(){return this.columnValues[this.DEPART_NOTES    ];}, set: function(value){this.columnValues[this.DEPART_NOTES    ] = value;}, enumerable: true});
  Object.defineProperty(this, 'flightDepartDriver'  ,{get: function(){return this.columnValues[this.DEPART_DRIVER   ];}, set: function(value){this.columnValues[this.DEPART_DRIVER   ] = value;}, enumerable: true});
  Object.defineProperty(this, 'flightDepartPhone'   ,{get: function(){return this.columnValues[this.DEPART_PHONE    ];}, set: function(value){this.columnValues[this.DEPART_PHONE    ] = value;}, enumerable: true});
  Object.defineProperty(this, 'housingHost'         ,{get: function(){return this.columnValues[this.HOUSING_HOST    ];}, set: function(value){this.columnValues[this.HOUSING_HOST    ] = value;}, enumerable: true});
  Object.defineProperty(this, 'housingPhone'        ,{get: function(){return this.columnValues[this.HOUSING_PHONE   ];}, set: function(value){this.columnValues[this.HOUSING_PHONE   ] = value;}, enumerable: true});
  Object.defineProperty(this, 'housingAddress'      ,{get: function(){return this.columnValues[this.HOUSING_ADDDRESS];}, set: function(value){this.columnValues[this.HOUSING_ADDDRESS] = value;}, enumerable: true});
  Object.defineProperty(this, 'housingEmail'        ,{get: function(){return this.columnValues[this.HOUSING_EMAIL   ];}, set: function(value){this.columnValues[this.HOUSING_EMAIL   ] = value;}, enumerable: true});

  Object.defineProperty(this, 'flightArrivalDate', {
    enumerable: true,
    get: function() {
      return new mergeDateTime(this.arriveDate,this.arriveTime);
    },
    set: function(date){
      this.arriveDate = date.getDateString();
      this.arriveTime = date.getTimeString();
    }
  });

  Object.defineProperty(this, 'flightDepartDate', {
    enumerable: true,
    get: function() {
      return new mergeDateTime(this.departDate,this.departTime);
    },
    set: function(date){
      this.departDate = date.getDateString();
      this.departTime = date.getTimeString();
    }
  });

  //**
  //* Test if the row has an address
  //*
 Object.defineProperty(this, 'hasHousingAddress', {
    enumerable: true,
    get: function () {
      return this.housingAddress !== null && this.housingAddress !== "";
    }
  });

  Object.defineProperty(this, 'hasArrival', {
    enumerable: true,
    get: function () {
      return this.flightArrivalNum !== null && this.flightArrivalNum !== "";
    }
  });

  Object.defineProperty(this, 'hasDeparture', {
    enumerable: true,
    get: function () {
      return this.flightDepartNum !== null && this.flightDepartNum !== "";
    }
  });

  Object.defineProperty(this, 'isValidForArrival', {
    enumerable: true,
    get: function () {
      return this.hasHousingAddress && this.hasArrival;
    }
  });

  Object.defineProperty(this, 'isValidForDeparture', {
    enumerable: true,
    get: function () {
      return this.hasHousingAddress && this.hasDeparture;
    }
  });
 }

PerformerRow.prototype.isArrivalShiftEntered = function(){
  var ret = false;
  var shiftEntered = this.columnValues[this.ARRIVAL_SHIFT_ENTERED];
  if(null != shiftEntered){
    shiftEntered = shiftEntered.trim().toUpperCase();
    ret = shiftEntered === "YES";
  }
  return  ret;
};

PerformerRow.prototype.arrivalShiftEntered = function(isShiftEntered) {

  this.columnValues[this.ARRIVAL_SHIFT_ENTERED] = isShiftEntered ? "Yes" : "";
};


PerformerRow.prototype.isDepartureShiftEntered = function(){
  var ret = false;
  var shiftEntered = this.columnValues[this.DEPART_SHIFT_ENTERED];
  if(null != shiftEntered){
    shiftEntered = shiftEntered.trim().toUpperCase();
    ret = shiftEntered === "YES";
  }
  return  ret;
};

PerformerRow.prototype.departureShiftEntered = function(isShiftEntered) {
  this.columnValues[this.DEPART_SHIFT_ENTERED] = isShiftEntered ? "Yes" : "";
};

// needsPickUp
PerformerRow.prototype.needsPickUp = function() {
  var ret = false;
  var needPickup = this.columnValues[this.NEEDS_PICKUP];
  var needRides = this.columnValues[this.NEEDS_RIDES];
  if(null != needPickup && null != needRides){
    needPickup = needPickup.trim().toUpperCase();
    needRides = needRides.trim().toUpperCase();
    ret = needPickup === "NEEDS" || ride === "NEEDS";
  }
  return ret;
};

  // needsDropOff
PerformerRow.prototype.needsDropOff = function() {
  var ret = false;
  var needDropOff = this.columnValues[this.NEEDS_DROPOFF];
  var needRides = this.columnValues[this.NEEDS_RIDES];
  if(null != needDropOff && null != needRides){
    needDropOff = needDropOff.trim().toUpperCase();
    needRides = needRides.trim().toUpperCase();
    ret = needDropOff === "NEEDS" || needRides === "NEEDS";
  }
  return ret;
};


/**
* Merge a tagged document with this row's information
* @param {String} docBody - In/Out string of the document to merge to
* @param {Bool} isArrival - set to true if the document is to use arrival
*                           information or false if to use departure information
*/
PerformerRow.prototype.mergeToDoc = function (docBody, isArrival) {
  var directionPickup = "pick up";
  var directionDropoff = "drop off";

  docBody.replaceText("<FirstName>", this.firstName);
  docBody.replaceText("<LastName>", this.lastName);
  docBody.replaceText("<Mobile>", this.mobile);
  docBody.replaceText("<Email>", this.eMail);
  var flightDate = this.flightArrivalDate;
  var directionStr = directionPickup;
  var flightDirectionStr = "Arriving";
  var flightNumStr = this.flightArrivalNum;
  if (!isArrival) {
    flightDate = this.flightDepartDate;
    directionStr = directionDropoff;
    flightDirectionStr = "Departing";
    flightNumStr = this.flightDepartNum;
  }
  docBody.replaceText("<Direction>", directionStr);
  docBody.replaceText("<FlightDate>", Utilities.formatDate(flightDate, "PST", "MMM dd"));
  docBody.replaceText("<FlightTime>", Utilities.formatDate(flightDate, "PST", "hh:mm a"));
  docBody.replaceText("<FlightDirection>", flightDirectionStr);
  docBody.replaceText("<FlightNum>", flightNumStr);

  docBody.replaceText("<HousingName>", this.housingHost);
  docBody.replaceText("<HousingPhone>", this.housingPhone);
  docBody.replaceText("<HousingAddress>", this.housingAddress);
  docBody.replaceText("<HousingEmail>", this.housingEmail);

  // Current data set has all notes in the arrival column
  //if(isArrival){
  docBody.replaceText("<Notes>", this.flightArrivalNotes);
  //}
  //else{
  //  docBody.replaceText("<Notes>", this.flightDepartNotes);
  //}
};
/**
* Given a template string replace the templated strings with row data and return the new string
* @param {String} subjectTemplate - String containing the subject template
* @param {Bool} forArrival - True to use arrival data, false for departure
* @return {String} a new string containing the formatted data
* example Template: "<SubjectDirection> <FirstName> <LastName> of <ActName>"
*/
PerformerRow.prototype.mergeSubject = function (subjectTemplate, forArrival) {
  var subjectPickup = "Picking up";
  var subjectDropoff = "Dropping off";

  var retText = subjectTemplate.replace("<FirstName>", this.firstName);
  retText = retText.replace("<LastName>", this.lastName);
  retText = retText.replace("<ActName>", this.actName);
  var dirStr = subjectPickup;
  if (!forArrival) {
    dirStr = subjectDropoff;
  }
  retText = retText.replace("<SubjectDirection>", dirStr);
  return retText;
};
/**
 * output the row to the system log
 */
PerformerRow.prototype.toLog = function () {
  Logger.log("Act Name: " + this.actName);
  Logger.log("Number in act: " + this.numberInAct);
  Logger.log("Fist Name: " + this.firstName);
  Logger.log("lastName: " + this.lastName);
  Logger.log("mobile: " + this.mobile);
  Logger.log("eMail: " + this.eMail);
  Logger.log("travelMethod: " + this.travelMethod);
  Logger.log("NeedsRides: " + this.needsRides);
  if (this.isValidForArrival) {
    Logger.log("comingFrom: " + this.comingFrom);
    Logger.log("arrivingAt: " + this.arrivingAt);
    Logger.log("flightArrivalDate: " + Utilities.formatDate(this.flightArrivalDate, "PST", "MMM dd"));
    Logger.log("flightArrivalTime: " + Utilities.formatDate(this.flightArrivalDate, "PST", "hh:mm a"));
    Logger.log("flightArrivalNum: " + this.flightArrivalNum);
    Logger.log("flightArrivalNotes: " + this.flightArrivalNotes);
    Logger.log("needsPickUp: " + this.needsPickUp());
    Logger.log("isArrivalShiftEntered: " + this.isArrivalShiftEntered());
    Logger.log("flightArrivalDriver: " + this.flightArrivalDriver);
    Logger.log("flightArrivalPhone: " + this.flightArrivalPhone);
  }
  if (this.isValidForDeparture) {
    Logger.log("goingTo: " + this.goingTo);
    Logger.log("departForm: " + this.departForm);
    Logger.log("flightDepartDate: " + this.flightDepartDate);
    Logger.log("flightDepartTime: " + this.flightDepartTime);
    Logger.log("flightDepartNum: " + this.flightDepartNum);
    Logger.log("flightDepartNotes: " + this.flightDepartNotes);
    Logger.log("needsDropOff: " + this.needsDropOff());
    Logger.log("isDepartureShiftEntered: " + this.isDepartureShiftEntered());
    Logger.log("flightDepartDriver: " + this.flightDepartDriver);
    Logger.log("flightDepartPhone: " + this.flightDepartPhone);
  }
  Logger.log("housingHost: " + this.housingHost);
  Logger.log("housingPhone: " + this.housingPhone);
  Logger.log("housingAddress: " + this.housingAddress);
  Logger.log("housingEmail: " + this.housingEmail);
};



function TestPerformerRowCreation()
{
  var testRowArray = [3,"Alan Plotkin",1,"Alan","Plotkin","512-632-9468","AL@i3eventmarketing.com","Fly","Festival buys","1/19/2019","Done","$264.00","MFest Paid","Needs","Needs","Needs","","1","","","","","","","","Austin, TX (change planes in Sacramento, CA)","SEA","3/13/2019","7:05 PM","SW#0445","","Needs","","He said Uncle Bucky always picks him up","","","AUS","SEA","4/8/2019","12:25 PM","SW#2222","","Needs","","","","","","","","","100 Fremont.ave","","Always stays with Kirby and Adrian he said","",""];
  var row = new PerformerRow();
  row.fromMappedArray(testRowArray);
  row.toLog();

}

ShiftRow.prototype = new RowBase();
ShiftRow.prototype.constructor = ShiftRow;
ShiftRow.prototype.columnItems = [
  { name: "SHIFT_DATE" , header: "Date"      , mapIndex:    0, format: "mm-dd-yyyy"},
  { name: "START_TIME" , header: "Start"     , mapIndex:    1, format: "hh:mm aa"},
  { name: "END_TIME"   , header: "End"       , mapIndex:    2, format: "hh:mm aa"},
  { name: "TEAM_NAME"  , header: "Team"      , mapIndex:    3, format: "@"},
  { name: "CREW_SIZE"  , header: "Quantity"  , mapIndex:    4, format: "@"},
  { name: "LOCATION" 	 , header: "Location"  , mapIndex:    5, format: "@"},
  { name: "ASSIGNED" 	 , header: "Assigned"  , mapIndex:    6, format: "@"},
  { name: "SUBJECT"    , header: "Subject"   , mapIndex:    7, format: "@"},
  { name: "DETAIL"     , header: "Detail"    , mapIndex:    8, format: "@"}
];

function ShiftRow(){
  RowBase.call(this);
  Object.defineProperty(this, 'shiftDate' ,{get: function(){return this.columnValues[this.SHIFT_DATE];}, set: function(value){this.columnValues[this.SHIFT_DATE] = value;}, enumerable: true});
  Object.defineProperty(this, 'startTime' ,{get: function(){return this.columnValues[this.START_TIME];}, set: function(value){this.columnValues[this.START_TIME] = value;}, enumerable: true});
  Object.defineProperty(this, 'endTime'   ,{get: function(){return this.columnValues[this.END_TIME  ];}, set: function(value){this.columnValues[this.END_TIME  ] = value;}, enumerable: true});
  Object.defineProperty(this, 'teamName'  ,{get: function(){return this.columnValues[this.TEAM_NAME ];}, set: function(value){this.columnValues[this.TEAM_NAME ] = value;}, enumerable: true});
  Object.defineProperty(this, 'crewSize'  ,{get: function(){return this.columnValues[this.CREW_SIZE ];}, set: function(value){this.columnValues[this.CREW_SIZE ] = value;}, enumerable: true});
  Object.defineProperty(this, 'location'  ,{get: function(){return this.columnValues[this.LOCATION  ];}, set: function(value){this.columnValues[this.LOCATION  ] = value;}, enumerable: true});
  Object.defineProperty(this, 'assigned'  ,{get: function(){return this.columnValues[this.ASSIGNED  ];}, set: function(value){this.columnValues[this.ASSIGNED  ] = value;}, enumerable: true});
  Object.defineProperty(this, 'subject'   ,{get: function(){return this.columnValues[this.SUBJECT   ];}, set: function(value){this.columnValues[this.SUBJECT   ] = value;}, enumerable: true});
  Object.defineProperty(this, 'Details'   ,{get: function(){return this.columnValues[this.DETAIL    ];}, set: function(value){this.columnValues[this.DETAIL    ] = value;}, enumerable: true});
  this.teamName = 'Drivers';
  this.crewSize = 1;
  this.assigned = "";
}


ShiftRow.prototype.fromPerformerRow = function(performerRow, isArrival){
  var date = isArrival ? performerRow.flightArrivalDate : performerRow.flightDepartDate;
  var time = isArrival ? performerRow.flightArrivalTime : performerRow.flightDepartTime;
  var shiftDateTime =  mergeDateTime(date, time);
  this.shiftDate = date;
  this.startTime = RoundTo5Minutes( isArrival ? Sub15Minutes(shiftDateTime) : Sub150Minutes(shiftDateTime) );
  this.endTime =  RoundTo5Minutes( isArrival ? Add90Minutes(shiftDateTime) : shiftDateTime );

  this.location = isArrival ? "Sea-Tac Airport" : "Performer's Housing";
  this.assigned = "";
  this.subject = performerRow.mergeSubject("<SubjectDirection> <FirstName> <LastName> (of <ActName>)", isArrival);
  this.details = this.subject + " at SeaTac Airport and deliver them to their arranged housing. Details will be sent once you have taken the shift and they are available.";
}


