function getStorageCharges() {
    var curObj = dbx.Context.CurrentObject; // Shipment or CR Object
    var dbClass = curObj.DbClassType;
    var tempArr = [];
    var result = 0;
    var uniWRs = getWRsFromSH(curObj); // Array of unique WRs associated with a shipment
    var outDate = dbClass == 5 ? new Date(curObj.CreatedOn) : new Date(curObj.ReleaseDate);
    var total = 0;
    var formulaMinimum = hasValue(curObj.Division) ? curObj.Division.CustomFields.minima : 0; // This is the minimum price for total storage amounts
    var formulaPrice = hasValue(curObj.Division) ? curObj.Division.CustomFields.tarifa : 0; // This is the W/M Price for Storage 18 solo para CBM 120 para Ton
    var laxWeightPrice = hasValue(curObj.Division) ? curObj.Division.CustomFields.tarifa_kg : 0;
    var formulaFreeDays = hasValue(curObj.Division) ? curObj.Division.CustomFields.dias_libres : 0; // This is the total of Free Time in Days
    var formulaBillCycleDivisor = hasValue(curObj.Division) ? curObj.Division.CustomFields.ciclo_a_cobrar : 0; // This is how often storage is charged. For example, Miami is per month, LAX is per week. Month = 30, week = 7...
    
    /* Import Division Values */
    var heightPallet = hasValue(curObj.Division) ? curObj.Division.CustomFields.alto_minimo_inch : 0;  
    var widthPallet = hasValue(curObj.Division) ? curObj.Division.CustomFields.ancho_minimo_inch : 0;  
    var lengthPallet = hasValue(curObj.Division) ? curObj.Division.CustomFields.largo_minimo_inch : 0;    
    var poundPallet = hasValue(curObj.Division) ? curObj.Division.CustomFields.peso_minimo_pound : 0;    
    var laxDimensionsPound = hasValue(curObj.Division) ? curObj.Division.CustomFields.tarifa_adicional : 0;    
    
    var billableDays = 0;
    var billableCycles = 0;

    var summaryList = [];

    forEachInArray(uniWRs, function (uniWR) {
        var wrDate =  hasValue(uniWR.CreatedOn) ? new Date(uniWR.CreatedOn) : "";
        var volCBMS = uniWR.TotalVolume.convertTo(dbx.Uom.Volume.CubicMeter).magnitude;
        var wgtKg = uniWR.TotalWeight.convertTo(dbx.Uom.Weight.Kilogram);
        var items = getItemsList(uniWR);
        enumerateItems(items, tempArr);

        /* Verificacion de Height x Width x Length  + Weight on Pound*/
        var aditionalFee = 0
        var cantidad = 0 
        if ( hasValue(curObj.Division)  && heightPallet !== 0 ) {

            tempArr = tempArr.filter(function (item) {
                return (
                    item.InShipmentGUID === curObj.GUID ||
                    item.OutShipmentGUID === curObj.GUID ||
                    item.CargoReleaseGUID === curObj.GUID
                );
            });

            forEachInArray ( tempArr, function (item) {

                console = console + item.DbClassType
                var Height = (item.Height.convertTo(dbx.Uom.Length.Inch).magnitude).toFixed(0)
                var Width = (item.Width.convertTo(dbx.Uom.Length.Inch).magnitude).toFixed(0)
                var Length = (item.Length.convertTo(dbx.Uom.Length.Inch).magnitude).toFixed(0)
                var Weight =  (item.Weight.convertTo(dbx.Uom.Weight.Pound).magnitude).toFixed(0)


                if ( (Height >= heightPallet && Width >= widthPallet && Length >= lengthPallet) || (Weight >= poundPallet)) {
                    cantidad++
                    aditionalFee = laxDimensionsPound
                }
            })
        }
        /*  */

        var defaultObject = {
            aditionalFee: 0,
            wrNumber: 0,
            calculateFactor: 0,
            formulaMinimum: formulaMinimum,
            totalDays: 0,
            wrsVolume: 0,
            wrsWeight: 0,
            totalStorage: 0,
            formulaFreeDays: formulaFreeDays,
            billableCycles: 0,
            calculationMethod: '', // New property for calculation method
            toString: "",
        };
        total = daysBetweenDates(wrDate, outDate);
        billableDays = Math.max(total - formulaFreeDays, 0);
        billableCycles = Math.ceil(billableDays / formulaBillCycleDivisor);

        var costPerKg = 0.35 * wgtKg; //New tarifas 
        var costPerM3 = 25 * volCBMS;

        var calculateFactor = costPerKg > costPerM3 ? costPerKg: costPerM3;

        var factor = Math.max(calculateFactor, formulaMinimum);

        result = factor * billableCycles;

        /* Object with AditionalFee Change*/
        defaultObject.aditionalFee = aditionalFee * billableCycles || 0;

        defaultObject.totalStorage = result || 0;
        defaultObject.wrNumber = uniWR.Number;
        defaultObject.totalDays = total;
        defaultObject.wrsWeight = wgtKg.toFixed(2);
        defaultObject.wrsVolume = volCBMS.toFixed(2);
        defaultObject.formulaMinimum = formulaMinimum;
        defaultObject.formulaFreeDays = formulaFreeDays;
        defaultObject.billableCycles = billableCycles >= 0 ? billableCycles : 0;

        // Set the calculation method based on the calculateFactor
        defaultObject.calculationMethod = costPerKg > costPerM3 ? 'Weight' : 'Volume';

        defaultObject.toString =
            " WR#: " + defaultObject.wrNumber +
            " | Free Days: " + defaultObject.formulaFreeDays +
            " | Min: " + defaultObject.formulaMinimum +
            " | Days: " + defaultObject.totalDays +
            " | Cycles: " + defaultObject.billableCycles +
            " | V: " + defaultObject.wrsVolume + " cbm" +
            " | W: " + defaultObject.wrsWeight + " Kg" +
            " | Billed by: " + defaultObject.calculationMethod + // Include the calculation method in the string
            " | $" + defaultObject.totalStorage.toFixed(2) +
            " | Aditional Fee: $" + defaultObject.aditionalFee.toFixed(2);

        summaryList.push(defaultObject);
    });

    return summaryList;
}



// Suma de valores de storage de la función principal
function getStorageValue() {
    var summaryList = [];
    summaryList = getStorageCharges();
    var totalFinal = 0;    
    var aditionalFee = 0;
    forEachInArray(summaryList, function (item) {
        totalFinal += item.totalStorage;
        if (item.aditionalFee !== 0) {
            aditionalFee = item.aditionalFee;
        }
    });
    return (totalFinal + aditionalFee).toFixed(2);
}
//return getStorageValue();


//Detalle del storage a cobrar de la función principal
function getStorageString() {
    var summaryList = [];
    summaryList = getStorageCharges();
    var totalFinal = "";
    forEachInArray(summaryList, function (item) {
        if (item.totalStorage !== 0) {
            totalFinal += item.toString + "\r\n";
        }
    });
    return totalFinal;
}

return getStorageString();


/* summary of charges
LAX OFFICE	"
 WR#: LAX6504 | Free Days: 21 | Min: 50 | Days: 26 | Cycles: 1 | V: 8.98 cbm | W: 0.89 ton | Billed by: Weight | $221.35
 WR#: LAX6506 | Free Days: 21 | Min: 50 | Days: 25 | Cycles: 1 | V: 16.15 cbm | W: 2.08 ton | Billed by: Weight | $519.14
 WR#: LAX6509 | Free Days: 21 | Min: 50 | Days: 25 | Cycles: 1 | V: 7.15 cbm | W: 0.88 ton | Billed by: Weight | $218.86
"

MIA OFFICE - DOMESTIC	" 
 WR#: 162605 | Free Days: 30 | Min: 50 | Days: 123 | Cycles: 4 | V: 0.49 cbm | W: 0.20 ton | Billed by: Volume | $200.00
 WR#: 162386 | Free Days: 30 | Min: 50 | Days: 140 | Cycles: 4 | V: 0.03 cbm | W: 0.01 ton | Billed by: Volume | $200.00
 WR#: 162521 | Free Days: 30 | Min: 50 | Days: 131 | Cycles: 4 | V: 0.07 cbm | W: 0.01 ton | Billed by: Volume | $200.00
"
*/