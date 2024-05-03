
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

function getItemVolume(item) {
    var volume = item.Volume;
    var data = getItemUnitVolumeData(item);

    return volume.convertTo(data.targetUnit);
}

function getItemWeight(item) {
    var Weight = item.Weight;
    var data = getItemUnitWeightData(item);

    return Weight.convertTo(data.targetUnit);
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

function getConsigneeName(item){
    var operation = getMostRelevantItemOperation(item);
    return operation.ConsigneeName;
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

function getItemUnitVolumeData(item) {
    var operation = getMostRelevantItemOperation(item);
    if (operation != null) {
        return {
            targetUnit: operation.VolumeUnit
        };
    }
    return {
        targetUnit: dbx.Uom.VolumeWeight.CubicMeter
    };
}

function getItemUnitWeightData(item) {
    var operation = getMostRelevantItemOperation(item);
    if (operation != null) {
        return {
            targetUnit: operation.WeightUnit
        };
    }
    return {
        targetUnit: dbx.Uom.VolumeWeight.VolumeKilogram
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

function forEachLenght(list) {
    var count = 0;
    dbx.using(list).iterate(function (obj) {
        count += 1;
    });
    return count;
};

function getHBOLorHAWB(item){
    var operation = getMostRelevantItemOperation(item);
    var type = operation.Type;
    switch(type){
        case 1:
            return `${operation.AirWaybillNumber}`;

        case 2:
            return`${operation.BillOfLadingNumber}`;

        default:
            return "no data";
    }
}

function getPCS(item){
    var operation = getMostRelevantItemOperation(item);
    var type = operation.Type;
    switch(type){
        case 1:
            var PackageName = item.PackageName;
            if (hasValue(PackageName)) {
                var code = PackageName.slice(0, 2);
                if(code == "20" || code == "40" || code == "45"){
                    return `${item.ContainedItems.Count}`;
                }else{
                    return hasValue(item.Pieces) ? `${item.Pieces}` : "";
                }
               
            }else{
                return hasValue(item.Pieces) ? `${item.Pieces}` : "";
            }

        case 2:
            return hasValue(item.Pieces) ? `${item.Pieces}` : "";

        default:
            return "no data";
    }
}



function getDataRow(item, returnString = false) {
	var currentObject = dbx.Context.CurrentObject;
    var result = "";
    var containedItems = "";
    var guid = item.GUID;

    var palletID = hasValue(item.PalletID) ? item.PalletID : "";
    var  HBOL =  getHBOLorHAWB(item);
    var whr = hasValue(item.WarehouseReceipt) ? item.WarehouseReceipt.Number :
    hasValue(palletID) ? palletID : "";
    var ConsigneeName = getConsigneeName(item);
    var pcs = getPCS(item);
    var prevLoc = hasValue(item.LastLocation) && hasValue(item.LastLocation.Code) ? item.LastLocation.Code : "! No Location";
    var loc = hasValue(item.Location) && hasValue(item.LocationCode) ? item.LocationCode : prevLoc;
    var dim = getItemDimensionsFormat(item);
    //var pac = hasValue(item.PackageName) ? item.PackageName : "";
    var des = hasValue(item.Description) ? item.Description : "";
    var wei = getItemWeight(item).toString(2);
    var vol = getItemVolume(item).toString(2);
    var vlw = getItemVolumeWeight(item).toString(2);//showVolumeWeight(getItemVolumeWeight(item), 2, dbx.Uom.VolumeWeight.VolumeKilogram);

    if (hasValue(item.ContainedItems)) {
        pcs = " [+]";
        var contador = 0;
        var len = forEachLenght(item.ContainedItems);
        forEach(item.ContainedItems, function (item1) {
            contador += 1;
            pcs = " [+]";
            containedItems += getDataRow(item1, true) + `\r${contador != len ? "\n":""}`; 
        });
    }
    containedItems = containedItems != "" ? "\r\n" + containedItems + "\r\n" : returnString ? "" : "\r\n";
    result = (HBOL + "\t" + whr + "\t" + ConsigneeName + "\t" + pcs + "\t" +  loc  + "\t"  + dim + "\t" + wei + "\t" + vol + "\t") + "" + containedItems;
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

    if (hasValue(items)) {
        forEach(items, function (item) {
            var itemArray = getDataRow(item);
            //result.push(getDataRow(item));
            resultObject[itemArray[0]] = itemArray[1];
        });
    }

    var ordenatedKeys = ordenateKeys(resultObject);

    //Recorro el array de keys para obtener en su respectivo orden los elementos del objeto 
    for (let i = 0; i <= ordenatedKeys.length - 1; i++) {
        var key = ordenatedKeys[i];
        result.push(resultObject[key]);
    }
    return result.join("");
}

//Extrae los keys y los ordena alfabeticamente, luego retorna
function ordenateKeys(object) {
    var keys = Object.keys(object);
    keys = keys.sort();
    return keys;
}

function getHouseNames(){
    var currentObject = dbx.Context.CurrentObject;
    var masterGuid = hasValue(currentObject.MasterGUID) ? currentObject.MasterGUID : "";
    var guid = hasValue(currentObject.GUID) ? currentObject.GUID : "";
    var createdOn = hasValue(currentObject.CreatedOn) ? currentObject.CreatedOn : "";
    var date = new Date(createdOn);   
    
    date.setDate(date.getDate() - 9);
    var date2 = new Date(createdOn);
    date2.setDate(date2.getDate() + 9);
    
    var shipments = getHouseShipmentByDATE(date,date2,guid);
    return shipments.join(" | ");
}
