
function getWRsFromSH(currentObj) {
    var items = getItemsList(currentObj);
    var result = [];
    var WRs = [];
    var tempArr = [];
    var itemWRGUID = "";
    var itemWR = "";
    var a = [1,{}];
    var WR = {};
    var arrayWR = [WR];
    if (hasValue(items)) {
        enumerateItems(items, tempArr);
        forEachInArray(tempArr, function (item) {
            itemWRGUID = hasValue(item.WarehouseReceiptGUID) ? item.WarehouseReceiptGUID : "";
            if (itemWRGUID != "") {
                itemWR = item.WarehouseReceipt;
                WRs.push(itemWR);
            }
        });
    }

    var uniWRs = WRs.uniques();
    return uniWRs;
}



var curObj = dbx.Context.CurrentObject; //Shipment 
var dbClass = curObj.DbClassType;
var FreDays = curObj.CustomFields.FreeDaysStorage || 0;
var cargo = curObj.CustomFields.CargoStorage || 0;
var result = 0;
var Total = 0;
var resumen = {
    FreDays:FreDays,
    cargoDayAmount: "",
    dayDifference: "",
    Volume: "",
};
resumenString = "";
var out = dbClass == 5 ? new Date(curObj.CreatedOn) : new Date(curObj.ReleaseDate);

var uniWRs = getWRsFromSH(curObj); 
forEachInArray(uniWRs, function (uniWR) {
    var cantidad = uniWRs.length;
    var date = new Date(uniWR.CreatedOn);

    var Volume = (uniWR.TotalVolume.convertTo(dbx.Uom.Volume.CubicFoot).magnitude)
    resumen.Volume += `${Volume.toFixed(2)} - `;

    var dayDifference = Math.ceil((out - date)/(1000 * 60 * 60 * 24));
    resumen.dayDifference += `${dayDifference} - `;

    if(dayDifference > 15){
        var cargoStorage = cargo*Volume;
        var cargoDay = dayDifference-FreDays;
        resumen.cargoDayAmount += `${cargoDay} - `;
        Total += cargoStorage*cargoDay;
    } 
 //Verificar si el valor del cargo es 0, "el valor por cargo por pie cubico fue escablecido en 0"
    resumenString =
    " | Items: " + cantidad +
    " | Cargo * : " + Total.toFixed(2) + 
    " | Days free charge: " + resumen.FreDays +
    " | Days storage: " + resumen.dayDifference.slice(0, -2) +
    " | Days charge: " + resumen.cargoDayAmount.slice(0, -2) +
    " | Volume(ft^3): " + resumen.Volume.slice(0, -2) +
    " | Cargo storage($): " + Total.toFixed(2);

})
return resumenString;