/*
                                     INSTRUCTIONS
 - Is not mandatory, but is recommended to use a Custom Field for Shipments to
   define if it will be certified by Importer, Exporter or Producer. This
   Custom Field can be created as Type: Pick List, and their values should be:
   IMPORTER, EXPORTER, PRODUCER. If a different information is used, these values
   should be updated in the code on functions: 
   - getCertifiedByEntity()
   - showProducerBtn()
   - showExporterBtn()
   - showImporterBtn()
   
 - The variable "certifiedByCustomFieldInternalName" contains the internal name
   of the Custom Field described in the previous explanation
   
 - The variable "addEmptyRowInTable" determines if you want to add an empty row below
   each line of items at the items table.
   Example:
   var addEmptyRowInTable = false; //Does not populate the empty row.
   var addEmptyRowInTable = true; // Populates the empty row below every line of items.
   
   In order to toogle the value, just change the false/true value.
   
 - It can be exchanged the priority of the Entities to be populated in the document.
   Just change the order of the elements in the array for the variables:
   importerPriority, exporterPriority, producerPriority
   The priority will be the first element of the array but if it doesn't exist, the document
   will try to populate the second element you passed to the array and will continue until the
   last element of the array.
   
   The options available for this document are:
   - 'Shipper'
   - 'IssuedBy'
   - 'Consignee'
   - 'NotifyParty'
   - 'DestinationAgent'
   
   The entities will be taken from the shipment.
   
 - Blanket Period requires two Custom Fields at Shipment level, those should be
   of type: Date
   - One custom field will be for FROM and the second one for TO
   - Keep in mind that internal names for those custom fields should be updated
     on variables: blanketPeriodFrom, blanketPeriodTo, by default the document uses:
     "blanketperiodfrom" and "blanketperiodto"
     
 - The Harmonized Tariff of the item is being taken from the AMS tab information 
   of the items loaded into the shipment. Keep in mind that containers / pallets are not
   included on the Description of Goods table.
 - The pieces are being group by Part Number, Description and Harmonized Tariff.
 - The rest of the fields remains with no information so it can be entered / added manually.
 
 - The tableDefinition variable is an array that defines the structure of the Items Table.
   Every subarray represents a row on the table and the elements inside the subarray represets
   the columns. If no information is required in any of the columns for an specific row/column you can pass
   the element as an empty string "".
   Example:
   [['column1-row1', 'column2-row1', 'column3-row1;], ['column1-row2', 'column2-row2', 'column3-row2']]
   - When you call an element in the array, the string value passed needs to match with the definition of
     the attribute while creating the object Item.
     Example:
     - If we want to add the Status information of the item, we need to add the status attribute to the item
       object in the function setItem(), then we will be able to call it in the array "tableDefinition" to be printed
       in the items table on the column and row that corresponds to the position of the element in the subarray.
       
 - You can choose to see the Items grouped or not by toggling the value of the variable "viewElementsGrouped"
   Example:
   var viewElementsGrouped = true;
   
 - You can define the set of elements to take in cosideration at the time of grouping the list of Items
   through the array called "elementsToGroupBy"
   Example:
   var elementsToGroupBy = ['partNumber']; // Will group only objects with the same part number
   var elementsToGroupBy = ['partNumber', 'description']; // Will group objects with the same part number and
                                                        the same description at the same time.

 - The variable "addEmptyRowInTable" determines if you want to add an empty row below of
   each line of charges at the charges table.
   Example:
   var addEmptyRowInTable = true; // Populates the empty row below every line of charges.
   
   In order to toggle the value, just change the false/true value.
*/
// Set the priority of the Entities to be displayed 
var shipperPriority 	 = ['Shipper'];
var consigneePriority 	 = ['Consignee'];
var issuedByPriority 	 = ['IssuedBy'];

// This value is used to populate the items based on the index of it in the Database,
var sortElementsBy = 'index';

// Use this variable to set the level of the items displayed in the document
// Use 1 by default.
var itemsLevel = 1;

// Set this variable to true if you want to see the level of the item displayed
var showItemsLevel = true;
 
// Toogle this variable value (false/true) to remove/add an empty row below every line of charges at the Charges Table.
var addEmptyRowInTable = true;

// Set the structure for your table definition, each array represents a new row, the elements inside the arrays represents the columns
var tableDefinition = [['pieces', 'packageType', 'dimensions', 'description', '', '', 'weight', 'volume'],
 					   ['location', '', 'invoiceNumber', 'notes', '', '', 'weightKg', 'volumeWeight'],
 					   ['quantity', '', 'poNumber', 'partNumber', 'model', 'serialNumber', '', '']];
 
 
//==================================================================================================
//                                             MAIN
//==================================================================================================
var hypObj;
var itemsArray = [];
var itemLevel = 1;
var shipperEntity = null;
var consigneeEntity = null;
var issuedByEntity = null;
 
 function OnInitializeDocument()
 {
 	hypObj = dbx.Context.CurrentObject;
 	processItems();
 }
 
 // Create the Entity object
 function setEntity(arrayOfPriorities){
 	if(!arrayOfPriorities.length > 0)
 		return;
 		
 	var entity = null;
 	var addressObj = null;
 	var entityObj = null;
 		
 	for(var i = 0; i < arrayOfPriorities.length; i++){
 		entityObj = hypObj[arrayOfPriorities[i]] || null;
 		addressObj = hypObj[arrayOfPriorities[i] + "Address"] || null;
 		
 		if(entityObj){
 			entity = {
            	name: entityObj.Name || "",
            	taxId: entityObj.ExporterID
        	};
        	
        	if(addressObj){
        		entity.address = {
        			description: addressObj.Description || "",
					street: addressObj.Street || "",
					city: addressObj.City || "",
					state: addressObj.State || "",
					zipCode: addressObj.ZipCode || "",
					countryName: addressObj.CountryName || "",
					contactName: addressObj.ContactName ? ("Contact: " + addressObj.ContactName) : "",
					contactPhone: addressObj.ContactPhone ? ("Phone: " + addressObj.ContactPhone) : "",
					contactFax: addressObj.ContactFax ? ("Fax: " + addressObj.ContactFax) : "",
					contactEmail: addressObj.ContactEmail ? ("Email: " + addressObj.ContactEmail) : "",
                	setAddress: function() {
                    	var result = "";
                    	
                    	if(!(this.street || this.city || this.state || this.zipCode || this.countryName)){
							result = (this.description) +
					 				 (this.contactName ? (this.description ? ("\n" + this.contactName) : this.contactName) : "") +
    				 				 (this.contactPhone ? (this.description || this.contactName ? ("\n" + this.contactPhone) : this.contactPhone) : "") +
    				 				 (this.contactFax ? (this.description || this.contactName || this.contactPhone ? ("\n" + this.contactFax) : this.contactFax) : "") +
    				 				 (this.contactEmail ? (this.description || this.contactName || this.contactPhone || this.contactFax ? ("\n" + this.contactEmail) : this.contactEmail) : "");
						}
						else {
    						if(addressObj.CountryName === "United States"){
    							result = (this.street) + 
    				 					 (this.city ? (this.street ? ("\n" + this.city) : this.city) : "") + 
    				 					 (this.state ? (this.city ? (", " + this.state) : (this.street ? ("\n" + this.state) : this.state)) : "") + 
    				 					 (this.zipCode ? (this.city || this.state ? (" " + this.zipCode) : (this.street ? ("\n" + this.zipCode) : this.zipCode)) : "") + 
    				 					 (this.countryName ? (this.city || this.state || this.zipCode ? (", " + this.countryName) : (this.street ? ("\n" + this.countryName) : this.countryName)) : "") + 
    				 					 (this.contactName ? (this.street || this.city || this.state || this.zipCode || this.countryName ? ("\n" + this.contactName) : this.contactName) : "") +
    				 					 (this.contactPhone ? (this.street || this.city || this.state || this.zipCode || this.countryName || this.contactName ? ("\n" + this.contactPhone) : this.contactPhone) : "") +
    				 					 (this.contactFax ? (this.street || this.city || this.state || this.zipCode || this.countryName || this.contactName || this.contactPhone ? ("\n" + this.contactFax) : this.contactFax) : "") +
    				 					 (this.contactEmail ? (this.street || this.city || this.state || this.zipCode || this.countryName || this.contactName || this.contactPhone || this.contactFax ? ("\n" + this.contactEmail) : this.contactEmail) : "");
    						}
    						else {
    							result = (this.street) + 
    				 					 (this.city ? (this.street ? (", " + this.city) : this.city) : "") + 
    				 					 (this.state ? (this.street || this.city ? ", " + this.state : this.state) : "") + 
    				 					 (this.zipCode ? (this.street || this.city || this.state ? (" " + this.zipCode) : this.zipCode) : "") + 
    				 					 (this.countryName ? (this.street || this.city || this.state || this.zipCode ? ", " + this.countryName : this.countryName) : "") + 
    				 					 (this.contactName ? (this.street || this.city || this.state || this.zipCode || this.countryName ? ("\n" + this.contactName) : this.contactName) : "") +
    				 					 (this.contactPhone ? (this.street || this.city || this.state || this.zipCode || this.countryName || this.contactName ? ("\n" + this.contactPhone) : this.contactPhone) : "") +
    				 					 (this.contactFax ? (this.street || this.city || this.state || this.zipCode || this.countryName || this.contactName || this.contactPhone ? ("\n" + this.contactFax) : this.contactFax) : "") +
    				 					 (this.contactEmail ? (this.street || this.city || this.state || this.zipCode || this.countryName || this.contactName || this.contactPhone || this.contactFax ? ("\n" + this.contactEmail) : this.contactEmail) : "");
							}
						}
                    	
                    	return result;
                	}
        		};
        	}
        	
 			break;
 		}
 	}
 	
 	return entity;
 }
 
function setShipper(arrayOfPriorities){
 	shipperEntity = setEntity(arrayOfPriorities);
}
 
function setConsignee(arrayOfPriorities){
 	consigneeEntity = setEntity(arrayOfPriorities);
}
 
function setIssuedBy(arrayOfPriorities){
 	issuedByEntity = setEntity(arrayOfPriorities);
}
 
function showShipperName(){
	setShipper(shipperPriority);
 	 if(!shipperEntity)
 	 	return "";
 	 	
 	 return shipperEntity.name;
}

function showShipperAddress(){
	setShipper(shipperPriority);
 	 if(!shipperEntity)
 	 	return "";
 	 
 	 return shipperEntity.address.setAddress();
}

function showConsigneeName(){
	setConsignee(consigneePriority);
 	 if(!consigneeEntity)
 	 	return "";
 	 	
 	 return consigneeEntity.name;
}

function showConsigneeAddress(){
	setConsignee(consigneePriority);
 	 if(!consigneeEntity)
 	 	return "";
 	 
 	 return consigneeEntity.address.setAddress();
}
//=================================================================

 // Create the Item object definition
 function setItem(itemObj){
 	var item;
 	
 	if(!itemObj)
 		return;
 	
 	return	item = {
 				index: setItemIndex(itemObj),
 				level: setItemLevel(itemObj),
 				pieces: setItemPieces(itemObj),
 				packageType: setItemPackageType(itemObj),
 				dimensions: setItemDimensions(itemObj),
 				description: setItemDescription(itemObj),
 				weight: setItemWeight(itemObj),
 				weightKg: setItemWeightKg(itemObj),
 				volume: setItemVolume(itemObj),
 				location: setItemLocation(itemObj),
 				invoiceNumber: setItemInvoiceNumber(itemObj),
 				notes: setItemNotes(itemObj),
 				volumeWeight: setItemVolumeWeight(itemObj),
 				quantity: setItemQuantity(itemObj),
 				poNumber: setItemPONumber(itemObj),
 				partNumber: setItemPartNumber(itemObj),
 				model: setItemModel(itemObj),
 				serialNumber: setItemSerialNumber(itemObj)
 			};
 }
 
 function setItemIndex(itemObj){
 	if(!itemObj)
 		return "";
 	
 	var result = itemObj.Index || "";
 	
 	return result;
 }
 
 function setItemLevel(itemObj){
 	if(!itemObj)
 		return "";
 	
 	if(!showItemsLevel)
 		return "";
 		
 	itemLevel = 1;
 	
 	retrieveItemLevel(itemObj);
 	
 	return itemLevel + "L";
 }
 
 function setItemPieces(itemObj){
 	if(!itemObj)
 		return "";
 	
 	var result = "";
 
 	result = itemObj.Pieces || "";
 	
 	return result;
 }
 
 function setItemPackageType(itemObj){
 	if(!itemObj)
 		return "";
 	
 	var result = itemObj.PackageName || "";
 	
 	return result;
 }
 
 function setItemDimensions(itemObj){
 	if(!itemObj)
 		return "";
 	
 	var decimals = hypObj.LengthPrecision || 2;
 	var unitSymbol = hypObj.LengthUnit;
 	
 	var result = showDimensions(itemObj, decimals, unitSymbol) || "";
 	
 	return result;
 }
 
 function setItemDescription(itemObj){
 	if(!itemObj)
 		return "";
 	
 	var result = itemObj.Description || "";
 	
 	return result;
 }
 
 function setItemWeight(itemObj){
 	if(!itemObj)
 		return "";
 		
 	var result = calculateMeasurementUnits(itemObj, "");
 	
 	return result;
 }
 
 function setItemWeightKg(itemObj){
 	if(!itemObj)
 		return "";
 	
 	var result = calculateMeasurementUnits(itemObj, dbx.Uom.Weight.Kilogram);
 	
 	return result;
 }
 
 function setItemVolume(itemObj){
 	if(!itemObj)
 		return "";
 		 	
 	var result = "";
 	var volume = itemObj.Volume || null;
 	var decimals = hypObj.VolumePrecision || 2;
 	var unitSymbol = hypObj.VolumeUnit;
 	
 	if(volume)
 		result = showVolume(volume, decimals, unitSymbol);
 	
 	return result;
 }
 
 function setItemLocation(itemObj){
 	if(!itemObj)
 		return "";
 	
 	var result = itemObj.Location && itemObj.Location.Code || "";
 	
 	return result;
 }
 
 function setItemInvoiceNumber(itemObj){
 	if(!itemObj)
 		return "";
 	
 	var result = itemObj.SupplierInvoiceNumber || "";
 	
 	return result;
 }
 
 function setItemNotes(itemObj){
 	if(!itemObj)
 		return "";
 	
 	var result = itemObj.Notes ||"";
 	
 	return result;
 }
 
 function setItemVolumeWeight(itemObj){
 	if(!itemObj)
 		return "";
 		 	
 	var result = "";
 	var volumeWeight = getItemVolumeWeight(itemObj) || null;
 	var decimals = hypObj.VolumeWeightPrecision || 2;
 	var unitSymbol = hypObj.VolumeWeightUnit;
 	
 	if(volumeWeight)
 		result = showVolumeWeight(volumeWeight, decimals, unitSymbol);
 	
 	return result;
 }
 
 function setItemQuantity(itemObj){
 	if(!itemObj)
 		return "";
 	
 	var result = itemObj.PieceQuantity && (itemObj.PieceQuantity).toFixed(2) || "";
 	 	
 	return result;
 }
 
 function setItemPONumber(itemObj){
 	if(!itemObj)
 		return "";
 	
 	var result = itemObj.SupplierPONumber || "";
 	
 	return result;
 }
 
 function setItemPartNumber(itemObj){
 	if(!itemObj)
 		return "";
 		
 	var result = itemObj.PartNumber || "";
 	
 	return result;
 }
 
 function setItemModel(itemObj){
 	if(!itemObj)
 		return "";
 	
 	var result = itemObj.Model || "";
 	
 	return result;
 }
 
 function setItemSerialNumber(itemObj){
 	if(!itemObj)
 		return "";
 	
 	var result = itemObj.SerialNumber || "";
 	
 	return result;
 }
 
 //====================================================================== 
 function processItems(){
 	var items = hypObj.Items || null;
 	var tempItemsArray = [];
 	
 	if(items){ 	
 		retrieveItems(items, tempItemsArray);
 		itemsArray = sortObjectsInArray(tempItemsArray);
 	}
 }
 
 function retrieveItemsNoContainers(itemsList, callback){
 	if(itemsList){
 		dbx.using(itemsList).iterate(function(each){
 			if(!each.IsContainer){
 				callback.push(setItem(each));
 			}
 				
 			retrieveItemsNoContainers(each.ContainedItems, callback);
 		});
 	}
 }
 
 function retrieveItems(itemsList, callback){
 	if(!itemsList)
 		return;
 	
 	if(itemsList){
 		dbx.using(itemsList).iterate(function(each){
 			if(!each.UpItem){
 				itemLevel = 1;
 			}
 			else
 				itemLevel++;
 				
 			callback.push(setItem(each));
 			
 			if(itemsLevel > itemLevel)
 				retrieveItems(each.ContainedItems, callback);
 		});
 	}
 }
 
 function retrieveItemLevel(item){
 	if(!item)
 		return;
 	
 	if(item.UpItem)
 		itemLevel++;
 		
 	retrieveItemLevel(item.UpItem);
 }
 
 function sortObjectsInArray(arrayOfElements){
	if(!arrayOfElements)
		return;
		
	return arrayOfElements.sort(
				function(element, nextElement){					
					return element[sortElementsBy] - nextElement[sortElementsBy];
				}
		   );
}

//Functions for Weight, Volume, VolumeWeight and Dimensions
//=============================================================
function showWeight(uomObj, decimals, asUOM){
    var result      = '';
    var decimals    = (typeof decimals !== 'undefined' ? decimals : 2);
    var uom         = (typeof asUOM !== 'undefined' ? asUOM : dbx.Uom.Weight.Kilogram);

    switch (uom){
        case dbx.Uom.Weight.Gram:
        case dbx.Uom.Weight.Kilogram:
        case dbx.Uom.Weight.Ounce:
        case dbx.Uom.Weight.Pound:
        case dbx.Uom.Weight.Ton:
        case dbx.Uom.Weight.TroyOunce:
            var uomInUOM  = uomObj.convertTo(uom);
            result = uomInUOM.toString(decimals);
            break;
    }
    return result;
}

function showVolume(uomObj, decimals, asUOM){
    var result      = '';
    var decimals    = (typeof decimals !== 'undefined' ? decimals : 2);
    var uom         = (typeof asUOM !== 'undefined' ? asUOM : dbx.Uom.Volume.CubicMeter);

    switch (uom){
        case dbx.Uom.Volume.CubicMeter:
        case dbx.Uom.Volume.CubicCentimeter:
        case dbx.Uom.Volume.CubicDecimeter:
        case dbx.Uom.Volume.CubicFoot:
        case dbx.Uom.Volume.CubicInch:
            var uomInUOM  = uomObj.convertTo(uom);
            result = uomInUOM.toString(decimals);
            break;
    }
    return result;
}

function showVolumeWeight(uomObj, decimals, asUOM){
    var result      = '';
    var decimals    = (typeof decimals !== 'undefined' ? decimals : 2);
    var uom         = (typeof asUOM !== 'undefined' ? asUOM : dbx.Uom.VolumeWeight.VolumeKilogram);

    switch (uom){
        case dbx.Uom.VolumeWeight.VolumeKilogram:
        case dbx.Uom.VolumeWeight.CubicFoot:
        case dbx.Uom.VolumeWeight.CubicMeter:
        case dbx.Uom.VolumeWeight.VolumeGram:
        case dbx.Uom.VolumeWeight.VolumeOunce:
        case dbx.Uom.VolumeWeight.VolumeKilogram:
        case dbx.Uom.VolumeWeight.VolumePound:
        case dbx.Uom.VolumeWeight.VolumeTon:
        case dbx.Uom.VolumeWeight.VolumeTroyOunce:
            var uomInUOM  = uomObj.convertTo(uom);
            result = uomInUOM.toString(decimals);
            break;
    }
    return result;
}

function showDimensions(hypObj, decimals, asUOM){
        var result      = '';
        var decimals    = (typeof decimals !== 'undefined' ? decimals : 2);
        var uom         = (typeof asUOM !== 'undefined' ? asUOM : dbx.Uom.Length.Meter);
        var objLength   = hypObj.Length;
        var objHeight   = hypObj.Height;
        var objWidth    = hypObj.Width;

        switch (uom){
            case dbx.Uom.Length.Meter:
            case dbx.Uom.Length.Centimeter:
            case dbx.Uom.Length.Decimeter:
            case dbx.Uom.Length.Foot:
            case dbx.Uom.Length.Inch:
            case dbx.Uom.Length.Kilometer:
            case dbx.Uom.Length.Millimeter:
                var lengthInUOM = objLength.convertTo(uom);
                var heightInUOM = objHeight.convertTo(uom);
                var widthInUOM  = objWidth.convertTo(uom);
                var uomSymbol   = widthInUOM.unitSymbol;
                result =
                    lengthInUOM.magnitude.toFixed(decimals) + 'x' +
                    widthInUOM.magnitude.toFixed(decimals)  + 'x' +
                    heightInUOM.magnitude.toFixed(decimals) + ' ' +
                    uomSymbol;
                break;
        }
        return result;
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

function calculateMeasurementUnits(itemObj, unitSymbol){
 	var result = "";
 	var weight = [];
 	var decimals = hypObj.WeightPrecision || 2;
 	var totalWeight = 0;
 	var totalSymbol = "";
 	
 	if(itemObj.IsWeightCalculated){
 		weight.push(itemObj.ContainedWeight || null);
 		weight.push(itemObj.Weight || null);
 		if(!unitSymbol)
 			unitSymbol = hypObj.WeightUnit || itemObj.ContainedWeight.unit || "";
 	}
 	else {
 		weight.push(itemObj.Weight || null);
 		if(!unitSymbol)
 			unitSymbol = hypObj.WeightUnit || itemObj.Weight.unit || "";
 	}
 	
 	if(weight.length > 0){
 		for(var i = 0; i < weight.length; i++){
 			tempArray = (showWeight(weight[i], decimals, unitSymbol)).split(" ");
 			totalWeight += (parseFloat(tempArray[0]));
 			totalSymbol = tempArray[1];
 		}
 	}
 	
 	result = totalWeight.toFixed(2) + " " + totalSymbol;
 	
 	return result;
 }

// End functions for Measurement Units
//==========================================================
//                      END MAIN


//====================PROCESS TABLE===========================
 function setRecordDefinition(items, tableDef){
    var result = "";
    if(!items.length > 0 || !tableDef.length > 0)
        return "";
	
	// Loops the list of Items sent to the function
	for(var k = 0; k < items.length; k++){
		// Loops the Array passed to the function that contains the columns/rows structure in subarrays
    	for(var i = 0; i < tableDef.length; i++){
    		var tmpResult = "";
    		var controller = "";
    		//Loops the SubArrays to retrieve the properties of the items object to print
        	for(var j = 0; j < tableDef[i].length; j++){
        		var element = items[k] && items[k][tableDef[i][j]] || "";
        		
        		controller = controller || element;
        		
            	if(j === (tableDef[i].length) - 1){
                	tmpResult += element + '\r\n';	
                	break;
            	}
            	
            	tmpResult += element + '\t';
        	}
        	
        	if(controller)
        		result += tmpResult;
    	}
    	
    	if(addEmptyRowInTable)
    		result += '\r\n';
    }

    return result;
}
 
 //====================PRINT TABLE===========================
 function showItemsInTable(){
 	return setRecordDefinition(itemsArray, tableDefinition);
 }


 function TOTAL_VOLUME_CubicFoot(){
    var currentObj = dbx.Context.CurrentObject;
    var itemsListTotal = currentObj.Items || null;
    var VolumeTotal = 0;
    
    if(itemsListTotal){ 	
        dbx.using(itemsListTotal).iterate(function(each){
            var decimalsTotal = each.VolumePrecision || 3;
            // var unitSymbolTotal = each.VolumeUnit;      //"5.68" => 5.68
             VolumeTotal += Number(showVolume(each.Volume, decimalsTotal, dbx.Uom.Volume.CubicFoot).match(/\d+(\.\d+)?/g)[0]);
        });


    }else{
        return "no entro"
    }
    return `${VolumeTotal} ft³`
}

