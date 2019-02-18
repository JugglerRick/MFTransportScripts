/*global Logger: false */


function testStartsWith(){
  var str = "Shuttle performers between theaters and/or lodging, pick-up equipment or other items, etc.  Plan to spend this shift at Hale's Palladium on call to drive.";
  var passStart = "Shuttle"
  var failStart = "Pickup"
   var passed = StringStartsWith(str, passStart);
   if(passed){
     Logger.log("The pass passed");
     }
  passed = StringStartsWith(str, failStart);
  if(!passed){
    Logger.log("The fail passed");
  }
}
