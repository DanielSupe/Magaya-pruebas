var currentObject = dbx.Context.CurrentObject;
var masterGuid = hasValue(currentObject.MasterGUID) ? currentObject.MasterGUID : "";
var guid = hasValue(currentObject.GUID) ? currentObject.GUID : "";
var createdOn = hasValue(currentObject.CreatedOn) ? currentObject.CreatedOn : "";
var date = new Date(createdOn);

date.setDate(date.getDate() - 1);
var date2 = new Date(createdOn);
date2.setDate(date2.getDate() + 1);

var shipments = getHouseShipmentByDATE(date,date2,guid);
var result = "";

if(masterGuid != ""){
    return result =  currentObject.Name +" - " +"https://transtrack.magaya.net/TransTracking?ID=37370&SH=" + currentObject.GUID + "&LG=es&XM=0";
}else{
   if(shipments.length != 0){
        result += currentObject.Name +" - " + "https://transtrack.magaya.net/TransTracking?ID=37370&SH=" + currentObject.GUID + "&LG=es&XM=0" + " - ";
        forEachInArray(shipments, function (house) {
            result += house.Name +" - " + "https://transtrack.magaya.net/TransTracking?ID=37370&SH=" + house.GUID + "&LG=es&XM=0" + " - ";
        });
        return result;
   }
   return result;
}


function getHouseShipmentByDATE(date, date2, guid) {
    var result = [];
    var shipments = dbx.Shipping.Shipment.ListByTime;

    if (date != '') {
        dbx.using(shipments).from(date).to(date2).iterate(function (shipment) {
             if(shipment.MasterGUID == guid){
                  result.push(shipment);
             }
        });
    }

    return result;
}