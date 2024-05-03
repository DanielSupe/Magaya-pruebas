var curObj = dbx.Context.CurrentObject; //Shipment 
var FreDays = curObj.CustomFields.FreeDays;
var cargo = curObj.CustomFields.CargoStorage;
var result = 0;
var Total = 0;
var resumen = {
    FreDays:FreDays,
    cargoDayAmount: "",
    dayDifference: "",
    Volume: "",
};
resumenString = "";
var out = Date.now();

var uniWRs = [curObj.WarehouseReceipt];
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
return resumenString;