function getTotalCases() {
    var currentObject = dbx.Context.CurrentObject;
    return currentObject.CustomFields.total_cases;
}

function getTotalPieces() {
    var currentObject = dbx.Context.CurrentObject;
    return currentObject.TotalPieces;
}

function getItemsList(obj) {
    var result = null;
    if (hasValue(obj)) {
        result = hasValue(obj.PackingList) && hasValue(obj.PackingList.Items) ? obj.PackingList.Items :
            (hasValue(obj.Items) ? obj.Items : null);
    }
    return result;
}

function hasValue(obj) {
    return (obj != undefined && obj != null && obj != "");
}

function enumerateItems(itemList, callback) {
    if (itemList == null) {
        return;
    }
    forEach(itemList, function(item) {
        callback.push(item);
        enumerateItems(item.ContainedItems, callback);
    });
}

function forEach(list, callback) {
    dbx.using(list).iterate(function (obj) {
        callback(obj);
    });
}

function forEachInArray(arr, callback){
        for(var index = 0; index < arr.length; index++){
            callback(arr[index]);
        }
}

function getMostRelevantItemOperation(item) {
    if (item.OutShipment != null) {
        return item.OutShipment;
    }
    if (item.InShipment != null) {
        return item.InShipment;
    }
    if (item.CargoRelease != null) {
        return item.CargoRelease;
    }
    if (item.SalesOrder != null) {
        return item.SalesOrder;
    }
    if (item.WarehouseReceipt != null) {
        return item.WarehouseReceipt;
    }
    if (item.PickupOrder != null) {
        return item.PickupOrder;
    }
    if (item.PurchaseOrder != null) {
        return item.PurchaseOrder;
    }
    
    return null;
}

function getItemOperationVolumeWeightData(item) {
    var operation = getMostRelevantItemOperation(item);
    if (operation != null) {
        return {
            volumeWeightFactor: operation.VolumeWeightFactor,
            targetUnit: operation.VolumeWeightUnit
        };
    }
    return {
        volumeWeightFactor: 0.0,
        targetUnit: dbx.Uom.VolumeWeight.CubicMeter
    };
}

function getItemVolumeWeight(item) {
    var volume = item.Volume.valueOf();
    var data = getItemOperationVolumeWeightData(item);
    var factor = 1.0;
    if (data.volumeWeightFactor > 0.0) {
        factor = data.volumeWeightFactor;
    }
        
    var unit = new dbx.VolumeWeight(volume * factor);
    return unit.convertTo(data.targetUnit);
}

function SOPallets(){
	var currentObject = dbx.Context.CurrentObject;
	return currentObject.CustomFields.so_pallets;
}


//Cargo Release Table V 3.0
function itemsTable() {
    var currentObject = dbx.Context.CurrentObject;
    var items = getItemsList(currentObject);
    var result = [];
    var resultObj = {};
    if (hasValue(items)) {
        //Recorro los items de primer nivel, y con printItemLine tengo [0] = location key, [1] = row del item, [2] = ContainedItems
        forEach(items, function (item) {
            var objectItems = printItemLine(item, true, true);
            resultObj[objectItems[0]] = [objectItems[1], objectItems[2]];
        });
        //ordenatedKeys es el array con keys de resultObj ordenadas
        var ordenatedKeys = ordenateKeys(resultObj);

        //Recorro el array de keys para obtener en su respectivo orden los elementos del objeto 
        for (let i = 0; i <= ordenatedKeys.length - 1; i++) {
            var key = ordenatedKeys[i];
            //resultObj[key] tiene un array de dos elementos [0] tiene el row y [1] tiene ContainedItems
            result.push(resultObj[key][0]);
            if (resultObj[key][1]) {
                forEach(resultObj[key][1], function (item1) {
                    var objectItems2 = printItemLine(item1, false);
                    result.push(objectItems2);
                    if (hasValue(item1.ContainedItems)) {
                        forEach(item1.ContainedItems, function (item2) {
                            var objectItems3 = printItemLine(item2, false);
                            result.push(objectItems3);
                        });
                    }
                });
            }
        }
    }
    return result.join("\r\n");
}


function getItemDimensionsFormat(item) {
    var lenght = item.Length.magnitude.toFixed(1);
    var Width = item.Width.magnitude.toFixed(1);
    var Height = item.Height.magnitude.toFixed(1);
    return `${lenght}x${Width}x${Height}`;
}

//Recibe un item, extrae los datos y segun showDimAndWeight tambien retorna dim y weigth.
//si returnObject es true, retorna un array con [0] = location + GUID, si no hay location usa el guid y zz al comienzo para que sea el ultimo
function printItemLine(item, showDimAndWeight = true, returnObject = false) {
    var guid = item.GUID;
    var pcs = hasValue(item.Pieces) ? item.Pieces : "";
    pcs = hasValue(item.ContainedItems) ? "[+]" : pcs;
    var pack = hasValue(item.Package) ? item.Package.Name : "";
    var dim = getItemDimensionsFormat(item);//item.Length.magnitude.toFixed(1) + "x" + item.Width.magnitude.toFixed(1) + "x" + item.Height.magnitude.toFixed(1);
    var location = hasValue(item.Location) ? item.Location.Code : "";
    var description = hasValue(item.Description) ? item.Description : "";
    while (description.indexOf("\n") != -1) {
        description = description.replace("\n", "");
    }
    var weigth = hasValue(item.Weight) ? item.Weight.toString(2) : "0.00 lb";
    var prevLoc = hasValue(item.LastLocation) ? item.LastLocation.Code : "";
    var whReceipt = hasValue(item.WarehouseReceipt) ? item.WarehouseReceipt.Number : "";
    var packId =  hasValue(item.IsContainer) ? (hasValue(item.PalletID) ? item.PalletID:"no pallet id"):(hasValue(item.PartNumber) ? item.PartNumber:"");
    if (!showDimAndWeight) {
        weigth = "";
        dim = "";
    }
    var containedItems = hasValue(item.ContainedItems) ? item.ContainedItems : "";
    var row = pcs + "\t" + pack + "\t" + packId + "\t" +  description + "\t" + dim + "\t" + weigth + "\t";
    if (returnObject) {
        return [location == "" ? "zz" + guid : location + guid, row, containedItems];
    } else {
        return row;
    }
}

//Recibe el objeto de printItemLine creado en la funcion principal.
//Extrae los keys y los ordena alfabeticamente, luego retorna
function ordenateKeys(object) {
    var keys = Object.keys(object);
    keys = keys.sort();
    return keys;
}
