// Codigo para Shipment List
function getWRsFromSH(currentObj) {
    var items = getItemsList(currentObj);
    var WRs = [];
    var tempArr = [];
    var itemWRGUID = "";
    var itemWR = "";

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

    return uniWRs;
}

var curObj = dbx.Context.CurrentObject;
var dbClass = curObj.DbClassType;
var FreDays = curObj.CustomFields.FreeDaysStorage || 0;
var cargo = curObj.CustomFields.CargoStorage || 0;
var Total = 0;
var resumen = {
    FreDays:FreDays,
    cargoDayAmount: "",
    dayDifference: "",
    Volume: "",
};
var resumenString = "";
var out = dbClass == 5 ? new Date(curObj.CreatedOn) : new Date(curObj.ReleaseDate);
var uniWRs = getWRsFromSH(curObj);

if (cargo == 0) {
    resumenString = "The charge per cubic foot has not been charged, therefore it was set at $0."
} else{
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
    
        resumenString =
        " | Items: " + cantidad +
        " | Days free charge: " + resumen.FreDays +
        " | Days storage: " + resumen.dayDifference.slice(0, -2) +
        " | Days charge: " + resumen.cargoDayAmount.slice(0, -2) +
        " | Volume(ft^3): " + resumen.Volume.slice(0, -2) +
        " | Cargo storage($): " + Total.toFixed(2);
     })
}

return resumenString;

//----------------------------------------------------------------------------------------------------
// Codigo para Commodity List
var curObj = dbx.Context.CurrentObject;  
var FreDays = curObj.CustomFields.FreeDays || 0;
var cargo = curObj.CustomFields.CargoStorage || 0;
var Total = 0;
var resumen = {
    FreDays:FreDays,
    cargoDayAmount: "",
    dayDifference: "",
    Volume: "",
};
var resumenString = "";
var out = Date.now();
var uniWRs = [curObj.WarehouseReceipt];

if (cargo == 0) {
    resumenString = "The charge per cubic foot has not been charged, therefore it was set at $0."
} else{
    forEachInArray(uniWRs, function (uniWR) {
        var cantidad = uniWRs.length;
        var date = uniWR.CreatedOn;
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
    
        resumenString =
        " | Items: " + cantidad +
        " | Days free charge: " + resumen.FreDays +
        " | Days storage: " + resumen.dayDifference.slice(0, -2) +
        " | Days charge: " + resumen.cargoDayAmount.slice(0, -2) +
        " | Volume(ft^3): " + resumen.Volume.slice(0, -2) +
        " | Cargo storage($): " + Total.toFixed(2);
    
    })
}

return resumenString;

//----------------------------------------------------------------------------------------------------