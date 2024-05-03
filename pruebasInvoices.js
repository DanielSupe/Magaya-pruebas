var currentObject = dbx.Context.CurrentObject;
var masterGuid = hasValue(currentObject.MasterGUID) ? currentObject.MasterGUID : "";
var guid = hasValue(currentObject.GUID) ? currentObject.GUID : "";
var createdOn = hasValue(currentObject.CreatedOn) ? currentObject.CreatedOn : "";
var date = new Date(createdOn);

date.setDate(date.getDate() - 1);
var date2 = new Date(createdOn);
date2.setDate(date2.getDate() + 1);

var guidOperation = masterGuid ? masterGuid:guid;//MasterGuid en caso de shipment master, guid para house

var shipments = getHouseShipmentByDATE(date,date2,guidOperation);
var master = masterGuid != "" ? getMasterShipmentByDATE(date,date2,masterGuid):"";
var result = "";

if(masterGuid != ""){
    if(master && shipments.length != 0){
        var nameMaster = master.Name;
        var contador = 0;
        forEachInArray(shipments, function (house) {
            contador += 1;
            var Number = `${house.Name}-${contador}`
            if(house.GUID == guid){
                return result = Number;
            }
        });
        return result;
    }

}else{
   if(shipments.length != 0){
        return result = currentObject.Name;
   }
   return result;
}




function getHouseShipmentByDATE(date, date2, guid) {
    var result = [];
    var shipments = dbx.Shipping.Shipment.ListByTime;
    var contador = 0;
    if (date != '') {
        dbx.using(shipments).from(date).to(date2).iterate(function (shipment) {
             if(shipment.MasterGUID == guid){
                result.push(shipment);
             }
        });
    }

    return result;
}


function getMasterShipmentByDATE(date, date2, masterGuid) {
    var result = [];
    var shipments = dbx.Shipping.Shipment.ListByTime;

    if (date != '') {
        dbx.using(shipments).from(date).to(date2).iterate(function (shipment) {
             if(shipment.GUID == masterGuid){
                    return result = shipment
             }
        });
    }

    return result;
}