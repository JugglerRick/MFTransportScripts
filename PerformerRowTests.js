/*global PerformerSheet: false */
/*global Logger: false */
/*global mergeDateTime: false */

function testPerformerRow() {
  var errorMessage = null;
  var performerSheet = new PerformerSheet();
  var performerRow = performerSheet.findPerformerByName("Al Simmons");
  if (null === performerRow) {
    errorMessage = 'Transport Row Test:no data in row 1';
  }
  performerRow.toLog();
  if (null === errorMessage && !performerRow.isValidForArrival) {
    errorMessage = Utilities.formatString('Transport Row Test:: There is currently no arrival data for %s', performerRow.toString());
  }
  if (null === errorMessage && !performerRow.isValidForDeparture) {
    errorMessage = Utilities.formatString("Transport Row Test:: There is currently no departure data for %s\n%s", performerRow.actName, performerRow.toString());
  }
  if (null === errorMessage && !performerRow.hasHousingAddress) {
    errorMessage = Utilities.formatString("Transport Row Test: There is currently no housing available for %s\n%s", performerRow.actName, performerRow.toString());
  }
  if (null === errorMessage) {
    Logger.log("Test Passed");
  }
  else {
    Logger.log(errorMessage);
  }

}

function testUpdateRow() {
  var errorMessage = null;
  var performerSheet = new PerformerSheet();
  var performerRow = performerSheet.getPerformerRow(1);
  if (null === performerRow) {
    errorMessage = 'Transport Row Test:no data in row 1';
  }
  if (null === errorMessage && !performerRow.hasHousingAddress()) {
    errorMessage = Utilities.formatString("Transport Row Test: There is currently no housing available for %s\n%s", performerRow.actName, performerRow.toString());
  }
  if (null === errorMessage && !performerRow.isValidForArrival()) {
    errorMessage = Utilities.formatString('Transport Row Test:: There is currently no arrival data for %s', performerRow.toString());
  }
  if (null === errorMessage && !performerRow.isValidForDeparture) {
    errorMessage = Utilities.formatString("Transport Row Test:: There is currently no departure data for %s\n%s", performerRow.actName, performerRow.toString());
  }
  if (null === errorMessage) {
    performerRow.flightArrivalDriver = "NO BODY";
    performerRow.flightDepartDriver = "NO BODY";
    performerRow.updateRow();

    Logger.log("Test Passed");
  }
  else {
    Logger.log(errorMessage);
  }
}

function testMergeSubject() {
  var errorMessage = null;
  var performerSheet = new PerformerSheet();
  var performerRow = performerSheet.getPerformerRow(1);
  if (null === performerRow) {
    errorMessage = 'Transport Row Test:no data in row 1';
  }
  if (null === errorMessage) {
    Logger.log(performerRow.mergeSubject());
  }
}

function testNeedPickupAndDropoff() {
  var performerSheet = new PerformerSheet();

  var t = 0;
  while (t < performerSheet.rowCount) {
    var performerRow = new PerformerRow(performerSheet.getRowRange(t));

    Logger.log("Act: %s Performer: %s %s ", performerRow.actName, performerRow.firstName, performerRow.lastName);
    if (performerRow.needsPickUp()) {
      Logger.log("Needs a Pickup");
    }
    else {
      Logger.log("Does not need Pickup");
    }

    if (performerRow.needsDropOff()) {
      Logger.log("Needs Dropoff");
    }
    else {
      Logger.log("Does not need Dropoff");
    }

    t++;
  }
}

