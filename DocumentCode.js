
function getCustomFieldOf(obj, field) {
    var result = (hasValue(obj) && hasValue(obj.CustomFields) && hasValue(obj.CustomFields[field])) ?
        obj.CustomFields[field] :
        null;
    return result;
}

function hasValue(obj) {
    return (obj != undefined && obj != null);
}

function getBuyer(){
	return getCustomFieldOf(dbx.Context.CurrentObject, 'buyer');
}

function getReferenceNumber(){
	var currentObj = dbx.Context.CurrentObject;
	var jobNumber = getCustomFieldOf(currentObj, 'job_number');
	return jobNumber != null && jobNumber != "" ? jobNumber + " - " + currentObj.Number : currentObj.Number;
}

function getPONumber(){
	return getCustomFieldOf(dbx.Context.CurrentObject, 'po_number');
}

function getSONumber(){
	return getCustomFieldOf(dbx.Context.CurrentObject, 'so_number');
}

function getBrand(){
	return getCustomFieldOf(dbx.Context.CurrentObject, 'brand');
}

function getPieces(){
	return getCustomFieldOf(dbx.Context.CurrentObject, 'piece_count');
}

function getPallets(){
	return getCustomFieldOf(dbx.Context.CurrentObject, 'cr_pallets');
}

function getCartons(){
	return getCustomFieldOf(dbx.Context.CurrentObject, 'cr_cartons');
}

function getTotalWeight(){
	var currentObj = dbx.Context.CurrentObject;
	var weight = currentObj.TotalWeight.convertTo(dbx.Uom.Weight.Kilogram).toString(2);
	return weight;
}

function getTotalVol(){
	var currentObj = dbx.Context.CurrentObject;
	var vol = currentObj.TotalVolume.convertTo(dbx.Uom.Volume.CubicMeter).toString(2);
	return vol;
}

function getWarehouseAddress(){
var currentObject = dbx.Context.CurrentObject;
var attachments = copyToArray(currentObject.Attachments);
var result = "";
var GUID = currentObject.GUID;

forEachInArray(attachments, function (attachment) {
    key = attachment.id;
    result = "track.magaya.net/TransTracking/TransTracking.dll/?ID=37370&CR=" + GUID + "&TYPE=ATTACH&SDID=" + key + "\r\n";
});

return result;

    var codeWh = getCustomFieldOf(dbx.Context.CurrentObject, 'wh_code');
    var result = "";
    switch(codeWh){
    	case 'TW-CJ':
    	    result = "Flat 1-5,14/F, Cable TV Tower, 9 Hoi Shing Road, Tsuen Wan";
    		break;
    	case 'YL-CJ':
    	    result = "Section 1540-1541, Lot DD125, Ha Tsuen Road, Ha Tsuen, Yuen Long, Hong Kong";
    		break;
    	case 'ATL-PGS':
    	    result = "Unit 5012W – 5017W ATL Logistics Centre B, Kwai Chung, N. T.";
    		break;
    	case 'TM-PGS':
    	    result = "Unit 1202 Tins’ Centre III, No. 3 Hung Cheung Road, Tuen Mun, N. T.";
    		break;
    	case 'OSG':
    	    result = "Sony Music Solutions Hong Kong ltd.\n5/F YKK Building, Phase 3, 7 San Ping Circuit, Tuen Mun, N.T. Hong Kong.";
    		break;
    	default:
    		break;
    }
    return result;
}

function copyToArray(list) {
    var arr = new Array(list.Count);
    var position = 0;
    forEach(list, function(obj) {
        arr[position++] = obj;
    });
    return arr;
}
//------------------------------------------------------
function getAddressData(dato) {
	var list = [];
	var currentObject = dbx.Context.CurrentObject;
	var address = currentObject.IssuedBy.OtherAddresses;
	var codeWh = currentObject.CustomFields.wh_code;
	var result = "";
	enumerateItems(address, list);
	forEach(address, function (add) {
		if (add.Description == codeWh) {
			switch (dato) {
				case ("address"):
					result = add.Street;
					break;
				case ("dockHours"):
					result = add.City;
					break;
				case ("contact"):
					result = add.ContactName;
					break;
				case ("email"):
					result = add.ContactEmail;
					break;
				case ("phone"):
					result = add.ContactPhone;
					break;
			}
		}
	});
	return result;
}

function GETWAREHOUSEADDRESS_GetValue()
{
	return getAddressData("address");
}

function GETDOCKHOURS_GetValue()
{
	return getAddressData("dockHours");
}

function GETCONTACTSNAME_GetValue()
{
	return getAddressData("contact");
}

function GETEMAIL_GetValue()
{
	return getAddressData("email");
}

function GETPHONENUMBER_GetValue()
{
	return getAddressData("phone");
}