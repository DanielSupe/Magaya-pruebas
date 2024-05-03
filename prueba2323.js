var curObj = dbx.Context.CurrentObject; // Shipment 
var dbClass = curObj.DbClassType;
var AdditionalDayCost = 0.03;//Preguntar por el costo por dia
var FreDays = 15;
var cargo = 0.05;//cargo por cubic foot
var result = 0;
var resumen = {
    FreDays:FreDays,
    AdditionalDayCost:AdditionalDayCost,
    additionalDaysAmount: 0,
    dayDifference: 0,
    Volume:0,
    amountVolume: 0,
    Total:0
};
resumenString = "";
var out = dbClass == 5 ? new Date(curObj.CreatedOn) : new Date(curObj.ReleaseDate);
//result += `${out.getMonth()+1}/${out.getDate()}/${out.getFullYear()}` + "-";

var uniWRs = getWRsFromSH(curObj); 
forEachInArray(uniWRs, function (uniWR) {
        var cantidad = uniWRs.length;

       var date = new Date(uniWR.CreatedOn);
       var Volume = (uniWR.TotalVolume.convertTo(dbx.Uom.Volume.CubicFoot).magnitude)
        resumen.Volume += Volume;

       var amount = cargo/Volume; //preguntar *
       resumen.amountVolume += amount;
       resumen.Total += amount;

       var dayDifference = Math.ceil((out - date)/(1000 * 60 * 60 * 24));
       resumen.dayDifference += dayDifference;

       if(dayDifference > 15){
        var additional = (dayDifference-FreDays)*AdditionalDayCost;//preguntar
        resumen.Total += additional;
        resumen.additionalDaysAmount += additional;
       }
       //result += `${date.getMonth()+1}/${date.getDate()}/${date.getFullYear()}`


       resumenString =
       " | length" + cantidad +
       " | Free Days: " + resumen.FreDays +
       " | AdditionalDayCost: " + resumen.AdditionalDayCost +
       " | AdditionalDaysAmount: " + resumen.additionalDaysAmount +
       " | dayDifference: " + resumen.dayDifference+
       " | Volume: " + resumen.Volume + " cu ft" +
       " | AmountVolume" + resumen.amountVolume.toFixed(3) +
       " | Total$" + resumen.Total.toFixed(3);




       //result += new Date(uniWR.ReleaseDate);
//        var items = getItemsList(uniWR);
//        enumerateItems(items, tempArr);
//        if(tempArr.length != 0){
//         forEachInArray ( tempArr, function (item) {
//          //result += new Date(item.CreatedOn);
//          //result += "-" + new Date(item.ActualDepartureDate) +"-";
// })
// }
})
return resumenString;