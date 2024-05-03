function getWABNumber(){
	var currObj = dbx.Context.CurrentObject;
	var awbNumber = currObj.AirWaybillNumber;
	
	return awbNumber;
}


function getCarrierName(){
	var currObj = dbx.Context.CurrentObject;
	var carrier = currObj.DeliveryAgentName;
	
	return carrier;
}


function getFile(){
	var currObj = dbx.Context.CurrentObject;
	var carrier = currObj.Name;
	
	return carrier;
}


function getHouseShipmentByDATE(date, date2, guid) {
    var result = [];
    var shipments = dbx.Shipping.Shipment.ListByTime;
    var master = false;

    if (date != '') {
        dbx.using(shipments).from(date).to(date2).iterate(function (shipment) {
            if(shipment.MasterGUID == guid){
                result.push(shipment.Name);
            }
        });
    }

    return result;
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


function getIssuedBy(){
    var currentObject = dbx.Context.CurrentObject;
    if(currentObject.DestinationAgentName.indexOf("KCE") != -1){
        return currentObject.DestinationAgentName;
    }else if(currentObject.DeliverToEntityName.indexOf("KCE") != -1){
        return currentObject.DeliverToEntityName;
    }else if(currentObject.IssuedByName.indexOf("KCE") != -1){
        return currentObject.IssuedByName;
    }
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

function printAddress(address){
	var result = address.Street;
	var city = address.City;
	if (result != ''){
		result += ' ';
	}
	result += city;
	var state = address.State;
	if (result != ''){
		result += ', ';
	}
	result +=  state;
	var zip = address.ZipCode;
	if (result != ''){
		result += ' ';
	}
	result += zip;
	var country = address.CountryName;
	if (result != ''){
		result += '. ';
	}
	result += country;
	var phone = address.ContactPhone;
    if (phone != '') {
        result += '. ' + "Tel: ";
    }

    result += phone;
	return result;
}

function getIssuedByAddress(){
    var currentObject = dbx.Context.CurrentObject;
    if(currentObject.DestinationAgentName.indexOf("KCE") != -1){
        return printAddress(currentObject.DestinationAgentAddress);
    }else if(currentObject.DeliverToEntityName.indexOf("KCE") != -1){
        return printAddress(currentObject.DeliverToEntityAddress);
    }else if(currentObject.IssuedByName.indexOf("KCE") != -1){
        return printAddress(currentObject.IssuedByAddress);
    }
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
    var iid = hasValue(item.WHRItemID) ? item.WHRItemID : "";
    var pcs = hasValue(item.Pieces) ? item.Pieces : "";
    var palletID = hasValue(item.PalletID) ? item.PalletID : "";
    var whr = hasValue(item.WarehouseReceipt) ? item.WarehouseReceipt.Number :
        hasValue(palletID) ? palletID : "";
    var prevLoc = hasValue(item.LastLocation) && hasValue(item.LastLocation.Code) ? item.LastLocation.Code : "! No Location";
    var loc = hasValue(item.Location) && hasValue(item.LocationCode) ? item.LocationCode : prevLoc;
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
    result = (iid + "\t" + pcs + "\t" + whr + "\t" + loc + "\t" + "\t" + "\t" + dim + "\t" + pac + "\t"+  des  + "\t"  + wei + "\t" + vol + "\t" + vlw + "\t") + "" + containedItems;
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