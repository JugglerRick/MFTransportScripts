

// Form ID: 191XB7X7gc5IY9Vw5w8hVNNU9BOwSZK27Cqtr2BYQbI4
// Performer List ID:
var FormID = "191XB7X7gc5IY9Vw5w8hVNNU9BOwSZK27Cqtr2BYQbI4";
var PerformerListID = "1416032762";
var DriverListID = "1660266072";

function updateFormLists(){
  // call your form and connect to the drop-down item
  var form = FormApp.openById(FormID);
  var performerDropDown = form.getItemById(PerformerListID).asListItem();
  var driverDropDown = form.getItemById(DriverListID).asListItem();
  // identify the sheet where the data resides needed to populate the drop-down
  var performerSheet = new PerformerSheet();
  var names = performerSheet.getPerformerList(function (performerRow){
    var bret = performerRow.needsRides || performerRow.needsPickup || performerRow.needsDropOff; 
    return bret; 
  });
  names.sort();
  // populate the drop-down with the array data
  performerDropDown.setChoiceValues(names);
  var driverSheet = new DriverSheet();
  names = driverSheet.getDriverList();
  names.sort();
  driverDropDown.setChoiceValues(names);
}

