////////AUXILIARY FUNCTIONS//////////
function forEachInArray(arr, callback) {
    for (var index = 0; index < arr.length; index++) {
        callback(arr[index]);
    }
}

Array.prototype.uniques = function (callback) {
    var result = new Array();
    var callback = (
        typeof callback !== 'undefined' && typeof callback === 'function' ?
            callback :
            function (val, idx) { return val == idx; }//default callback function
    );

    for (var i = 0; i < this.length; i++) {
        if (!result.contains(this[i], callback)) {
            result.push(this[i]);
        }
    }
    return result;
}

function copyToArray(list) {
    var arr = new Array(list.Count);
    var position = 0;
    forEach(list, function (obj) {
        arr[position++] = obj;
    });
    return arr;
}

Array.prototype.contains = function (obj, callback) {
    var obj = (typeof obj !== 'undefined' ? obj : null);
    var callback = (
        typeof callback !== 'undefined' && typeof callback === 'function' ?
            callback :
            function (val, idx) { return val == idx; }//default callback function
    );

    for (var i = 0; i < this.length; i++) {
        if (callback(obj, this[i])) return true;
    }

    return false;
}

function hasValue(obj) {
    return (obj != undefined && obj != null && obj != "");
}

function hasNoValue(obj) {
    return (obj == undefined && obj == null && obj == "");
}


function forEach(list, callback) {
    dbx.using(list).iterate(function (obj) {
        callback(obj);
    });
}


function enumerateItems(itemList, callback) {
    if (itemList == null) {
        return;
    }
    forEach(itemList, function (item) {
        callback.push(item);
        enumerateItems(item.ContainedItems, callback);
    });
}


function getItemsList(obj) {
    var result = null;
    if (hasValue(obj)) {
        result = hasValue(obj.PackingList) && hasValue(obj.PackingList.Items) ? obj.PackingList.Items :
            (hasValue(obj.Items) ? obj.Items : null);
    }
    return result;
}

///////////////// AUXILIARY CODE END///////////////////

//Shipper name
function getShipperName() {
    var currObj = dbx.Context.CurrentObject;

    var actualName = currObj.ShipperName;
    var descAdd = currObj.ShipperAddress.Description;
    if (descAdd == "Default Shipping Address" || descAdd == "Default Billing Address" || descAdd == "") { return actualName; }

    return descAdd;
}

//Consignee name
function getConsigneeName() {
    var currObj = dbx.Context.CurrentObject;
    var name = currObj.ConsigneeName;
    var descAdd = currObj.ConsigneeAddress.Description;

    if (descAdd == "Default Shipping Address" || descAdd == "Default Billing Address" || descAdd == "") {
        return name;
    }
    return descAdd;
}

//Bill of lading number
function getBillOfLading() {
    var currObj = dbx.Context.CurrentObject;
    var name = currObj.BillOfLadingNumber;

    return name;
}

//File number
function getFileNumber() {
    var currObj = dbx.Context.CurrentObject;
    var name = currObj.Name;

    return name;
}

//Booking number
function getBookingNumber() {
    var currObj = dbx.Context.CurrentObject;
    var name = currObj.BookingNumber;

    return name;
}

//Origin port
function getOriginPort() {
    var currObj = dbx.Context.CurrentObject;
    var name = currObj.OriginPort.Name;

    return name;
}

//Destination port
function getDestinationPort() {
    var currObj = dbx.Context.CurrentObject;
    var name = currObj.DestinationPort.Name;

    return name;
}


//Carrier name
function getCarrierName() {
    var currObj = dbx.Context.CurrentObject;
    var name = currObj.CarrierName;

    return name;
}


//Containers table
function getContainers() {
    var currentObject = dbx.Context.CurrentObject;
    var items = getItemsList(currentObject);
    var tempArr = [];
    var result = [];

    if (hasValue(items)) {
        enumerateItems(items, tempArr);
        forEachInArray(tempArr, function (item) {
            var isCont = item.IsContainer;
            var contName = hasValue(item.PackageName) ? item.PackageName : "";
            var contNumber = hasValue(item.SerialNumber) ? item.SerialNumber : "";
            var contSeal = hasValue(item.PartNumber) ? item.PartNumber : "";

            if (isCont) {
                result.push(contName + "\t" + contNumber + "\t" + contSeal + "\r\n");
            }

        });
    }

    return result.join("") + "\r\n";
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

function showVolumeWeight(uomObj, decimals, asUOM) {
    var result = '';
    var decimals = (typeof decimals !== 'undefined' ? decimals : 2);
    var uom = (typeof asUOM !== 'undefined' ? asUOM : dbx.Uom.VolumeWeight.VolumeKilogram);

    switch (uom) {
        case dbx.Uom.VolumeWeight.VolumeKilogram:
        case dbx.Uom.VolumeWeight.CubicFoot:
        case dbx.Uom.VolumeWeight.CubicMeter:
        case dbx.Uom.VolumeWeight.VolumeGram:
        case dbx.Uom.VolumeWeight.VolumeOunce:
        case dbx.Uom.VolumeWeight.VolumeKilogram:
        case dbx.Uom.VolumeWeight.VolumePound:
        case dbx.Uom.VolumeWeight.VolumeTon:
        case dbx.Uom.VolumeWeight.VolumeTroyOunce:
            var uomInUOM = uomObj.convertTo(uom);
            result = uomInUOM.toString(decimals);
            break;
    }
    return result;
}


function getItemDimensionsFormat(item) {
    var lenght = hasValue(item.Length) ? item.Length.toString(2) : "0.00 in";
    var Width = hasValue(item.Width) ? item.Width.toString(2) : "0.00 in";
    var Height = hasValue(item.Height) ? item.Height.toString(2) : "0.00 in";
    lenght = lenght.split(' ');
    Width = Width.split(' ');
    Height = Height.split(' ');
    return lenght[0] + "x" + Width[0] + "x" + Height[0] + lenght[1];
}

function getDataRow(item, returnString = false) {
    var result = "";
    var containedItems = "";
    var guid = item.GUID;
    var iid = hasValue(item.WHRItemID) ? item.WHRItemID : 0;
    var pcs = hasValue(item.Pieces) ? item.Pieces : 0;
    var whr = hasValue(item.WarehouseReceipt) ? item.WarehouseReceipt.Number : "";
    var loc = "p";//hasValue(item.LocationCode) ? item.LocationCode : "";
    var dim = "x";//getItemDimensionsFormat(item);
    var pac = hasValue(item.PackageName) ? item.PackageName : "";
    var des = hasValue(item.Description) ? item.Description : "";
    var wei = hasValue(item.Weight) ? item.Weight.toString(2) : "";
    var vol = hasValue(item.Volume) ? item.Volume.toString(2) : "0.00 m³";
    var vlw = showVolumeWeight(getItemVolumeWeight(item), 2, dbx.Uom.VolumeWeight.VolumeKilogram);

    if (hasValue(item.ContainedItems)) {
        forEach(item.ContainedItems, function (item1) {
            pcs = "[+]";
            containedItems += getDataRow(item1, true) + "\r\n";
        });
    }
    containedItems = containedItems != "" ? "\r\n" + containedItems + "\r\n" : returnString ? "" : "\r\n";
    result = ("iid" + "\t" + "pcs" + "\t" + "whr" + "\t" + "loc" + "\t" + "dim" + "\t" + "pac" + "\t" + "des" + "\t" + "wei" + "\t" + "vol" + "\t" + "vlw" + "\t") + "" + containedItems;
    if(returnString){
        return result;
    }
    
    return [loc == "" ? "zz" + guid : loc + guid, result];
}

function getDataRow(item, returnString = false) {
    var result = "";
    var containedItems = "";
    var guid = item.GUID;
    var iid = hasValue(item.WHRItemID) ? item.WHRItemID : "";
    var pcs = hasValue(item.Pieces) ? item.Pieces : "";
    var palletID = hasValue(item.PalletID) ? item.PalletID : "";
    var whr = hasValue(item.WarehouseReceipt) ? item.WarehouseReceipt.Number :
        hasValue(palletID) ? palletID : "";
    var prevLoc = hasValue(item.LastLocation) && hasValue(item.LastLocation.Code) ? item.LastLocation.Code : "! No Location";
    var loc = hasValue(item.Location) && hasValue(item.LocationCode) ? item.LocationCode : prevLoc;
    var waybillOut = getItemWaybillNumber(item);
    var dim = getItemDimensionsFormat(item);
    var pac = hasValue(item.PackageName) ? item.PackageName : "";
    var des = hasValue(item.Description) ? item.Description : "";
    var wei = hasValue(item.Weight) ? item.Weight.toString(2) : "";
    var vol = hasValue(item.Volume) ? item.Volume.toString(2) : "0.00 m³";
    var vlw = showVolumeWeight(getItemVolumeWeight(item), 2, dbx.Uom.VolumeWeight.VolumeKilogram);

    if (hasValue(item.ContainedItems)) {
        pcs = " [+]";
        forEach(item.ContainedItems, function (item1) {
            pcs = " [+]";
            containedItems += getDataRow(item1, true) + "\r\n";
        });
    }
    containedItems = containedItems != "" ? "\r\n" + containedItems + "\r\n" : returnString ? "" : "\r\n";
    result = (iid + "\t" + pcs + "\t" + whr + "\t" + loc + "\t"  + dim + "\t" + pac + "\t" + wei + "\t" + vol + "\t" + vlw + "\t") + "" + containedItems;
    if (returnString) {
        return result;
    }
    return [loc == "" ? "zz" + guid : loc + guid, result];
}
function getItemsTable() {
    var currentObject = dbx.Context.CurrentObject;
    var items = getItemsList(currentObject);
    var result = [];
    var resultObject = {};
    var console = "";
    
    if (hasValue(items)) {
        forEach(items, function (item) {
            var itemArray = getDataRow(item);
            resultObject[itemArray[0]] = itemArray[1];
        });
    }

    var ordenatedKeys = ordenateKeys(resultObject);

    //Recorro el array de keys para obtener en su respectivo orden los elementos del objeto 
    for (let i = 0; i <= ordenatedKeys.length - 1; i++) {
        var key = ordenatedKeys[i];
        result.push(resultObject[key]);
        console = JSON.stringify(resultObject);
    }

    return result.join("");
}

//Extrae los keys y los ordena alfabeticamente, luego retorna
function ordenateKeys(object) {
    var keys = Object.keys(object);
    keys = keys.sort();
    return keys;
}
