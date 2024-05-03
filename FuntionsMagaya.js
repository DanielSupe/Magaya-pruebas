
function getCommodityType() {
    var currentObj = dbx.Context.CurrentObject;
    var brand = hasValue(currentObj.CustomFields.brand) ? currentObj.CustomFields.brand.toUpperCase() : "";
    var result;

    //Toys
    if (brand.indexOf("LEGO") != -1 || brand.indexOf("LOL") != -1) {
        result = "Toys";
    }

    //Footwear
    else if (brand == "TEVA" || brand == "TOMS" || brand == "HUSH PUPPIES"
        || brand == "TIMBERLAND" || brand == "ADIDAS" || brand == "XTRATUF"
        || brand == "BEARPAW" || brand == "ASICS" || brand == "ALTRA" || brand == "MERREL"
        || brand == "DR MARTENS" || brand == "NIKE" || brand == "HOKA" || brand == "CHACO") {
        result = "Footwear";
    }

    //Clothes & accessories
    else if (brand == "CHAMPION" || brand == "TOMMY HILFIGER" || brand == "HELLY HANSEN" || brand == "LACOSTE"
        || brand == "MCM" || brand == "MICHAEL KORS" || brand == "TORY BURCH" || brand == "COACH"
        || brand == "KATE SPADE" || brand == "NEW ERA" || brand == "BALLY") {
        result = "Clothes & Accessories";
    }


    //Watches
    else if (brand == "ANNE KLEIN" || brand == "TISSOT" || brand == "GUESS"
        || brand == "BRAUN" || brand == "TIMEX" || brand == "SEIKO"
        || brand == "CASIO" || brand == "BREITLING " || brand == "BREITLING"
        || brand == "INGRESOLL" || brand == "INGERSOLL" || brand == "KLASSE14" || brand == "OMEGA") {
        result = "Watches";
    }

    //Sunglasses
    else if (brand == "SPY") {
        result = "Sunglasess";
    }


    //Bottles
    else if (brand == "HYDROFLASK" || brand == "HYDRO FLASK") {
        result = "Bottles";
    }


    //Writing Instruments
    else if (brand == "FABER CASTELL") {
        result = "Writing Instruments";
    }


    //Backpacks
    else if (brand == "THULE" || brand == "TUMI" || brand == "OSPREY") {
        result = "Backpack";
    }

    //Technology
    else if (brand == "AFTERSHOKZ" || brand == "SENNHEISER") {
        result = "Technology";
    }

    //Lighters
    else if (brand == "ZIPPO") {
        result = "Lighters";
    }

    //Jewerly
    else if (brand == "APM" || brand == "TIFANNY") {
        result = "Jewerly";
    }

    //Supplements
    else if (brand == "GOLI") {
        result = "Supplements";
    }

    return result;
}



Array.prototype.uniques = function (callback) {
    var result = new Array();
    var callback = (
        typeof callback !== 'undefined' && typeof callback === 'function' ?
            callback :
            function (val, idx) {
                return val == idx;
            }//default callback function
    );

    for (var i = 0; i < this.length; i++) {
        if (!result.contains(this[i], callback)) {
            result.push(this[i]);
        }
    }
    return result;
}

async function getCustomFieldDefinitionOf(objType, internalName) {
    let definitionsList = dbx.CustomField.Definition.Lists.at(objType);

    const customFieldDefExists = definitionsList && await algorithm.find(dbx.using(definitionsList))
        .where(function (obj) {
            return obj.InternalName === internalName;
        });

    return customFieldDefExists;
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

function forEach(list, callback) {
    dbx.using(list).iterate(function (obj) {
        callback(obj);
    });
}

function forEachInArray(arr, callback) {
    for (var index = 0; index < arr.length; index++) {
        callback(arr[index]);
    }
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

function GetCargoReleaseByFilters(status, carrierName, number, WhLocation, Brand, OrderStatus, CommodityType) {

	let trans = dbx.Context.CurrentObject;
        let transStatus = dbx.Warehousing.CargoRelease.Status[status];

         var response = true;
         if (status != ""){
            let arrayStatus = status.split(",");

            if(arrayStatus.length > 1){
               if( !arrayStatus.includes(trans.Status.toString())){ 
                response = false;
            }
            } else {
                response  = (trans.Status === transStatus);
            }
         }
         if (response && carrierName != "" ){
            let arrayCarrierName = carrierName.split(",");

            if(arrayCarrierName.length > 1){
               if( !arrayCarrierName.includes(trans.CarrierName.toString())){ 
                response = false;
            }
            } else {
                response  = (trans.CarrierName === carrierName);
            }
         }
         if(response && number != ""){
            response = (trans.Number === number);
         }
         if(response && WhLocation != ""){
            let arrayWhLocation = WhLocation.split(",");

            if(arrayWhLocation.length > 1){
               if( !arrayWhLocation.includes(trans.CustomFields.wh_location.toString())){ 
                response = false;
            }
            } else {
                response = (trans.CustomFields.wh_location === WhLocation);
            }
         }
         if(response && Brand != ""){
            let arrayBrand = Brand.split(",");

            if(arrayBrand.length > 1){
               if( !arrayBrand.includes(trans.CustomFields.brand.toString())){ 
                response = false;
            }
            } else {
                response = (trans.CustomFields.brand === Brand);
            }
         }
         if(response && OrderStatus != ""){
            let arrayOrderStatus = OrderStatus.split(",");

            if(arrayOrderStatus.length > 1){
               if( !arrayOrderStatus.includes(trans.CustomFields.order_status.toString())){ 
                response = false;
            }
            } else {
                response = (trans.CustomFields.order_status === OrderStatus);
            }
         }
         if(response && CommodityType != ""){
            let arrayCommodityType = CommodityType.split(",");

            if(arrayCommodityType.length > 1){
               if( !arrayCommodityType.includes(trans.CustomFields.commodity_type.toString())){ 
                response = false;
            }
            } else {
                response = (trans.CustomFields.commodity_type === CommodityType);
            }
         }
	return response ;
}

function GetWarehouseReceiptByFilters(status, carrierName, number, WhLocation, Brand, OrderStatus, CommodityType) {

    let trans = dbx.Context.CurrentObject;
    let transStatus = dbx.Commerce.PurchaseOrder.Status[status];

	var response = true;
         
        if (status != ""){
            let arrayStatus = status.split(",");

            if(arrayStatus.length > 1){
                if( !arrayStatus.includes(trans.Status.toString())){ 
                    response = false;
                }
            } else {
                response  = (trans.Status === transStatus);
            }
        }

        if (response && carrierName != "" ){
            let arrayCarrierName = carrierName.split(",");

            if(arrayCarrierName.length > 1){
                if( !arrayCarrierName.includes(trans.CarrierName)){
                    response = false;
                }
             } else {
                    response  = (trans.CarrierName === carrierName);
                }
        }

        if(response && number != ""){
            let arraynumber = number.split(",");

            if(arraynumber.length > 1){
                if( !arraynumber.includes(trans.Number)){ 
                    response = false;
                }
             } else {
                    response = (trans.Number === number);
                }
        }

        if(response && WhLocation != ""){
            let arrayWhLocation = WhLocation.split(",");

            if(arrayWhLocation.length > 1){
                if( !arrayWhLocation.includes(trans.CustomFields.wh_location )){ 
                    response = false;
                }
             } else {
                    response = (trans.CustomFields.wh_location === WhLocation);
                }
        }

        if(response && Brand != ""){
            let arrayBrand = Brand.split(",");

            if(arrayBrand.length > 1){
                if( !arrayBrand.includes(trans.CustomFields.brand)){ 
                    response = false;
                }
            } else {
                    response = (trans.CustomFields.brand === Brand);
                }
        }

        if(response && OrderStatus != ""){
            let arrayOrderStatus = OrderStatus.split(",");

            if(arrayOrderStatus.length > 1){
                if( !arrayOrderStatus.includes(trans.CustomFields.order_status)){ 
                    response = false;
                }
            } else {
                    response = (trans.CustomFields.order_status === OrderStatus);
                }
        }

        if(response && CommodityType != ""){
            let arraycommoditype = CommodityType.split(",");

            if(arraycommoditype.length > 1){
                if( !arraycommoditype.includes(trans.CustomFields.commodity_type)){ 
                    response = false;
                }
            } else {
                    response = (trans.CustomFields.commodity_type === CommodityType);
                }
        }
	return response ;
}

function GetItemDefinitionsByFilters(itemType, inventoryType, costingMethod, partNumber, isInactive) {

    let trans = dbx.Context.CurrentObject;
    var response = true;
   
        if (trans.Pieces != 0 && trans.Pieces != "" && trans.ArrivingPieces != 0 && trans.ArrivingPieces != "" && trans.PiecesInCompoundItems != 0 && trans.PiecesInCompoundItems != "" && trans.ArrivingPiecesInCompoundItems != 0 && trans.ArrivingPiecesInCompoundItems != ""){
            response = true;
        }
        if (itemType != ""){
            let arrayItemType = itemType.split(",");

            if(arrayItemType.length > 1){
               if( !arrayItemType.includes(trans.ItemType.toString())){ 
                response = false;
            }
            } else {
               response  = (trans.ItemType === Number(itemType));
            }
        }
        if (response && inventoryType != ""){
            let arrayInventoryType = inventoryType.split(",");
            
            if(arrayInventoryType.length > 1){
               if( !arrayInventoryType.includes(trans.InventoryType.toString())){ 
                response = false;
            }
            } else {
                response  = (trans.InventoryType === Number(inventoryType));
            }
        }
        if (response && costingMethod != ""){
            let arrayCostingMethod = costingMethod.split(",");
            
            if(arrayCostingMethod.length > 1){
               if( !arrayCostingMethod.includes(trans.CostingMethod.toString())){ 
                response = false;
            }
            } else {
                response  = (trans.CostingMethod === Number(costingMethod));
            }
        }
        if (response && partNumber != "" ){
            response  = (trans.PartNumber === partNumber);
        }
        if (response && isInactive != "" ){
            response  = (trans.IsInactive === Number(isInactive));
        }

	return response;
}

function GetPurchaseOrderByFilters(status, number, seller, buyer, Brand, CommodityType) {

    let trans = dbx.Context.CurrentObject;
    let transStatus = dbx.Commerce.PurchaseOrder.Status[status];
    /*
    let trans = {
        Status : "Loading",
        Number : "",//PO1676
        SellerName : "SENNHEISER",//DUTY FREE DYNAMICS US CORP
        shipper : "FIT LOGISTICS",
        BuyerName   : "DUTY FREE DYNAMICS US CORP",//FIT LOGISTICS     
        CustomFields : { 
            WhLocation : "Miami",
            brand : "SENNHEISER",
            commodity_type : "Technology",
        },
    };
    let transStatus = "Loading";
    */
    var response = true;

    if (status != ""){
        let arrayStatus = status.split(",");

        if(arrayStatus.length > 1){
            
            if( !arrayStatus.includes(trans.Status.toString())){ 

                response = false;
            }
        } else {
            response  = (trans.Status === transStatus);
        }
    }
    if(response && number != ""){
       response = (trans.Number === number);
    }
    if (response && seller != "" ){
        let arraySeller = seller.split(",");

        if(arraySeller.length > 1){
            if( !arraySeller.includes(trans.SellerName)){ 
                response = false;
            }
        } else {
            response  = (trans.SellerName === seller);
        }
    }
    if(response && buyer != ""){
        let arrayBuyer = buyer.split(",");

        if(arrayBuyer.length > 1){
            if( !arrayBuyer.includes(trans.BuyerName)){ 
                response = false;
            }
        } else {
            response = (trans.BuyerName === buyer);
        }
    }
    if(response && Brand != ""){
        let arrayBrand = Brand.split(",");

        if(arrayBrand.length > 1){
            if( !arrayBrand.includes(trans.CustomFields.brand)){ 
                response = false;
            }
        } else {
            response = (trans.CustomFields.brand === Brand);
        }
    }
    if(response && CommodityType != ""){
        let arraycommoditype = CommodityType.split(",");

        if(arraycommoditype.length > 1){
            if( !arraycommoditype.includes(trans.CustomFields.commodity_type)){ 
                response = false;
            }
        } else {
            response = (trans.CustomFields.commodity_type === CommodityType);
        }
    }
     return response;
 }

function GetComodityListByFilters(status, carrierName, number, WhLocation, Brand, OrderStatus, CommodityType) {
   let trans = dbx.Context.CurrentObject;
   var response = true;
}

function getDbClassType(hyperionObj) {
    //var hyperionObj = dbx.Context.CurrentObject;
    var typeArr = [
        'Unknown',                          //0
        'Quotation',                        //1
        'PickupOrder',                      //2
        'WarehouseReceipt',                 //3
        'CargoRelease',                     //4
        'Shipment',                         //5
        'Invoice',                          //6
        'CreditMemo',                       //7
        'Bill',                             //8
        'Credit',                           //9
        'Check',                            //10
        'Payment',                          //11
        'Deposit',                          //12
        'JournalEntry',                     //13
        'WarehouseItem',                    //15
        'Container',                        //16
        'Booking',                          //17
        'Job',                              //18
        'PurchaseOrder',                    //19
        'SalesOrder',                       //20
        'Folder',                           //21
        'Document',                         //22
        'Entity',                           //23
        'Location',                         //24
        'Message',                          //25
        'Notes',                            //26
        'ShipmentFolder',                   //27
        'Charge',                           //28
        'ChargeDefinition',                 //29
        'Carrier',                          //30
        'Client',                           //31
        'Employee',                         //32
        'Company',                          //33
        'Division',                         //34
        'Salesperson',                      //35
        'Vendor',                           //36
        'WarehouseProvider',                //37
        'Account',                          //38
        'Task',                             //39
        'TaskType',                         //40
        'WarehouseZone',                    //41
        'CargoMovement',                    //42
        'ItemDefinition',                   //43
        'CargoCount',                       //44
        'CountSession',                     //45
        'Rate',                             //46
        'Clause',                           //47
        'ScheduleB',                        //48
        'Port',                             //49
        'Country',                          //50
        'Package',                          //51
        'EntityContact',                    //52
        'ItemDefinitionCategory',           //56
        'Attachment',                       //54
        'Contract',                         //55
        'ContractAmendment',                //56
        'AccountTransaction',               //57
        'CargoMovementItemReference',       //58
        'RemoteUser',                       //59
        'CourierShipment',                  //60
        'Route',                            //61
        'RouteSegment',                     //62
        'ModeOfTransportation',             //63
        'CustomCharge',                     //64
        'Vessel',                           //65
        'CloseOfDay',                       //66
        'EntityGroup',                      //67
        'PricingRule',                      //68
        'PricingTier',                      //69
        'HTS',                              //70
        'LogItem'                           //71
    ];
    return typeArr[hyperionObj.DbClassType];
}


function getCustomFieldOf(obj, field) {
    var result = (hasValue(obj) && hasValue(obj.CustomFields) && hasValue(obj.CustomFields[field])) ?
        obj.CustomFields[field] :
        null;
    return result;
}

function getChargesList(obj) {
    var result = hasValue(obj) && hasValue(obj.Charges) ? obj.Charges : null;
    return result;
}

function isIncomeCharge(charge) {
    var chargeDef = charge.ChargeDefinition;
    if (chargeDef == null) {
        return false;
    }

    var accountDef = chargeDef.AccountDefinition;
    if (accountDef == null) {
        return true;
    }

    switch (accountDef.Type) {
        case dbx.Accounting.Account.Type.AccountsReceivable:
        case dbx.Accounting.Account.Type.Income:
            return true;

        case dbx.Accounting.Account.Type.AccountsPayable:
        case dbx.Accounting.Account.Type.Expense:
        case dbx.Accounting.Account.Type.CostOfGoodSold:
            return false;
    }

    return true;
}

function copyToArray(list) {
    var arr = new Array(list.Count);
    var position = 0;
    forEach(list, function (obj) {
        arr[position++] = obj;
    });
    return arr;
}

function getItemsList(obj) {
    var result = null;
    if (hasValue(obj)) {
        result = hasValue(obj.PackingList) && hasValue(obj.PackingList.Items) ? obj.PackingList.Items :
            (hasValue(obj.Items) ? obj.Items : null);
    }
    return result;
}


function forEachRelatedObject(transaction, callback) {
    if (transaction == null) {
        return;
    }
    // the first RelatedObject is a reference to the object itself
    var firstRelatedObject = transaction.RelatedObject;
    if (firstRelatedObject != null) {
        callback(firstRelatedObject);
    }

    var restOfRelatedObject = transaction.RelatedObjects;
    if (restOfRelatedObject == null) {
        return;
    }
    // the rest of the related objects are found in this list of CRelatedObject
    forEach(restOfRelatedObject, function (relatedObject) {
        callback(relatedObject.RelatedObject);
    });
}


Date.prototype.diffWith1 = function (date2, diffAs) {
    var result = undefined;
    var date1 = this;
    var date2 = (typeof date2 !== 'undefined' && date2 instanceof Date ? date2 : new Date());
    var diffAs = (typeof diffAs !== 'undefined' ? diffAs : 'asSeconds');
    var oneSecond = 1000;//milliseconds
    var oneMinute = oneSecond * 60;
    var oneHour = oneMinute * 60;
    var oneDay = oneHour * 24;
    var datediff = Math.ceil(date1.getTime() - date2.getTime());

    switch (diffAs) {
        case 'asSeconds': {
            result = parseInt(datediff / (oneSecond), 10);
            break;
        }
        case 'asMinutes': {
            result = parseInt(datediff / (oneMinute), 10);
            break;
        }
        case 'asHours': {
            result = parseInt(datediff / (oneHour), 10);
            break;
        }
        case 'asDays': {
            date1.setHours(0);
            date1.setMinutes(0, 0, 0);
            date2.setHours(0);
            date2.setMinutes(0, 0, 0);
            datediff = Math.ceil(date1.getTime() - date2.getTime());
            result = parseInt(datediff / (oneDay), 10);
            break;
        }
    }
    return result;
}

Date.prototype.diffWith = function (date2, diffAs) {
    var result = undefined;
    var date1 = this;
    var date2 = (typeof date2 !== 'undefined' && date2 instanceof Date ? date2 : new Date());
    var diffAs = (typeof diffAs !== 'undefined' ? diffAs : 'asSeconds');
    var oneSecond = 1000;//milliseconds
    var oneMinute = oneSecond * 60;
    var oneHour = oneMinute * 60;
    var oneDay = oneHour * 24;
    var datediff = Math.abs(date1.getTime() - date2.getTime());

    switch (diffAs) {
        case 'asSeconds': {
            result = parseInt(datediff / (oneSecond), 10);
            break;
        }
        case 'asMinutes': {
            result = parseInt(datediff / (oneMinute), 10);
            break;
        }
        case 'asHours': {
            result = parseInt(datediff / (oneHour), 10);
            break;
        }
        case 'asDays': {
            date1.setHours(0);
            date1.setMinutes(0, 0, 0);
            date2.setHours(0);
            date2.setMinutes(0, 0, 0);
            datediff = Math.abs(date1.getTime() - date2.getTime());
            result = parseInt(datediff / (oneDay), 10);
            break;
        }
    }
    return result;
}

function daysBetweenDates(date1, date2) {
    var result = -1;

    if (date1 != -1 && date2 != -1) {
        result = date1.diffWith(date2, 'asDays')
    }
    return result;
}


function daysBetweenDatesReal(date1, date2) {
    var result = -1;

    if (date1 != -1 && date2 != -1) {
        result = date1.diffWith1(date2, 'asDays')
    }
    return result;
}

Number.prototype.asDate = function () {
    var date = new Date(this);
    return date;
}

//Adding Date.format() prototypal function.
Date.prototype.format = function (format) {
    var returnStr = '';
    var replace = Date.replaceChars;
    for (var i = 0; i < format.length; i++) {
        var curChar = format.charAt(i);
        if (i - 1 >= 0 && format.charAt(i - 1) == "\\") {
            returnStr += curChar;
        }
        else if (replace[curChar]) {
            returnStr += replace[curChar].call(this);
        } else if (curChar != "\\") {
            returnStr += curChar;
        }
    }
    return returnStr;
};

//Format options to the Date.format() function.
Date.replaceChars = {
    shortMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    longMonths: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    shortDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    longDays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],

    // Day
    d: function () { return (this.getDate() < 10 ? '0' : '') + this.getDate(); },
    D: function () { return Date.replaceChars.shortDays[this.getDay()]; },
    j: function () { return this.getDate(); },
    l: function () { return Date.replaceChars.longDays[this.getDay()]; },
    N: function () { return this.getDay() + 1; },
    S: function () { return (this.getDate() % 10 == 1 && this.getDate() != 11 ? 'st' : (this.getDate() % 10 == 2 && this.getDate() != 12 ? 'nd' : (this.getDate() % 10 == 3 && this.getDate() != 13 ? 'rd' : 'th'))); },
    w: function () { return this.getDay(); },
    z: function () { var d = new Date(this.getFullYear(), 0, 1); return Math.ceil((this - d) / 86400000); },
    // Week
    W: function () { var d = new Date(this.getFullYear(), 0, 1); return Math.ceil((((this - d) / 86400000) + d.getDay() + 1) / 7); },
    // Month
    F: function () { return Date.replaceChars.longMonths[this.getMonth()]; },
    m: function () { return (this.getMonth() < 9 ? '0' : '') + (this.getMonth() + 1); },
    M: function () { return Date.replaceChars.shortMonths[this.getMonth()]; },
    n: function () { return this.getMonth() + 1; },
    t: function () { var d = new Date(); return new Date(d.getFullYear(), d.getMonth(), 0).getDate() },
    // Year
    L: function () { var year = this.getFullYear(); return (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0)); },
    o: function () { var d = new Date(this.valueOf()); d.setDate(d.getDate() - ((this.getDay() + 6) % 7) + 3); return d.getFullYear(); },
    Y: function () { return this.getFullYear(); },
    y: function () { return ('' + this.getFullYear()).substr(2); },
    // Time
    a: function () { return this.getHours() < 12 ? 'am' : 'pm'; },
    A: function () { return this.getHours() < 12 ? 'AM' : 'PM'; },
    B: function () { return Math.floor((((this.getUTCHours() + 1) % 24) + this.getUTCMinutes() / 60 + this.getUTCSeconds() / 3600) * 1000 / 24); },
    g: function () { return this.getHours() % 12 || 12; },
    G: function () { return this.getHours(); },
    h: function () { return ((this.getHours() % 12 || 12) < 10 ? '0' : '') + (this.getHours() % 12 || 12); },
    H: function () { return (this.getHours() < 10 ? '0' : '') + this.getHours(); },
    i: function () { return (this.getMinutes() < 10 ? '0' : '') + this.getMinutes(); },
    s: function () { return (this.getSeconds() < 10 ? '0' : '') + this.getSeconds(); },
    u: function () {
        var m = this.getMilliseconds(); return (m < 10 ? '00' : (m < 100 ?
            '0' : '')) + m;
    },
    // Timezone
    e: function () { return "Not Yet Supported"; },
    I: function () {
        var DST = null;
        for (var i = 0; i < 12; ++i) {
            var d = new Date(this.getFullYear(), i, 1);
            var offset = d.getTimezoneOffset();
            if (DST === null) DST = offset;
            else if (offset < DST) { DST = offset; break; }
            else if (offset > DST) break;
        }
        return (this.getTimezoneOffset() == DST) | 0;
    },
    O: function () { return (-this.getTimezoneOffset() < 0 ? '-' : '+') + (Math.abs(this.getTimezoneOffset() / 60) < 10 ? '0' : '') + (Math.abs(this.getTimezoneOffset() / 60)) + '00'; },
    P: function () { return (-this.getTimezoneOffset() < 0 ? '-' : '+') + (Math.abs(this.getTimezoneOffset() / 60) < 10 ? '0' : '') + (Math.abs(this.getTimezoneOffset() / 60)) + ':00'; },
    T: function () { var m = this.getMonth(); this.setMonth(0); var result = this.toTimeString().replace(/^.+ \(?([^\)]+)\)?$/, '$1'); this.setMonth(m); return result; },
    Z: function () { return -this.getTimezoneOffset() * 60; },
    // Full Date/Time
    c: function () { return this.format("Y-m-d\\TH:i:sP"); },
    r: function () { return this.toString(); },
    U: function () { return this.getTime() / 1000; }
};


function hasNoValue(obj) {
    return (obj == undefined && obj == null && obj == "");
}


function getObjName(array) {
    var result = [];
    if (hasValue(array)) {
        forEachInArray(array, function (items) {
            if (hasValue(items.Number)) {
                result.push(items.Number);
            }
        });
    }
    return result.uniques();
}

function receiving() {
  var currentObj = dbx.Context.CurrentObject;
  var items = getItemsList(currentObj);
  var result = [];
  var tempArr = [];

  if (hasValue(items)) {
    enumerateItems(items, tempArr);
    forEachInArray(tempArr, function (item) {
      if (hasValue(item.WarehouseReceipt)) {
        result.push(item.WarehouseReceipt);
      }
    });
  }
  result = result.uniques();
  result = result.length - 1 < 0 ? 0 : result.length - 1;
  var rate = currentObj.BillingClient.CustomFields.receiving;
  result = result * rate;
  return result;

}



function chargeCheck(chArr, checkIsIncomeCharge, checkisPrepaid) {
    var result = [];
    forEachInArray(chArr, function (charge) {
        var waybill = hasValue(charge.SourceObject.Name)
            ? charge.SourceObject.Name + ": " : "";
        var chDescription = charge.ChargeDefinition.Description;
        var amount = charge.AmountInCurrency.toString().split(' ');
        if (isIncomeCharge(charge) == checkIsIncomeCharge && charge.IsPrepaid == checkisPrepaid) {
            result.push(waybill + chDescription + " = " + amount[1] + " " + amount[0]);
        }
    });
    return result;
}

/////////////////////////// GET CHARGES START ///////////////////////////
function getAllCharges( checkIsIncomeCharge, checkisPrepaid) {
    var currentObject = dbx.Context.CurrentObject;
    var masterCharges = getChargesList(currentObject);
    var chArr = [];
    var guid = currentObject.GUID;
    var result = [];

    forEach(masterCharges, function (masterCharge) {
        chArr.push(masterCharge);
    });

    var createdOn = hasValue(currentObject.CreatedOn) ? currentObject.CreatedOn : "";
    var date = new Date(createdOn);
    date.setDate(date.getDate() - 1);
    var date2 = new Date(createdOn);
    date2.setDate(date2.getDate() + 1);
    var shipments = dbx.Shipping.Shipment.ListByGuid;
    if (guid != '') {
        dbx.using(shipments).from(date).to(date2).iterate(function (shipment) {
            if (shipment.MasterGUID == guid) {
                var houseCharges = getChargesList(shipment);
                forEach(houseCharges, function (houseCharge) {
                    chArr.push(houseCharge);
                });
            }
        });
    }
    result = chargeCheck(chArr, checkIsIncomeCharge, checkisPrepaid);
    return result.join(", ");
}

// Charge codes of the 8 charges usually billed to Logix (JS code)
function getLogixChargeCodes() { //Implement on JS config
    var logixCharges = [" ",
        "OCEFGT-INC", //1
        "DOC-BL", //2
        "HAN-INC", //3
        "INS-INC", //4
        "BKS-INC", //5
        "ORIGIN", //6
        "IMO-DOC", //7
        "DESTINATION" //7
    ];
    return logixCharges;
}

// Gets the code of the charge in the array with the position (JS code)
function getLogixChargeCodeByIndex(index) {
    const logixCharges = getLogixChargeCodes();
    return logixCharges[index];
}

// Returns a charge amount by Code
function getChargeAmountByCode(index) {
    const logixCharges = getLogixChargeCodes();
    var code = getLogixChargeCodeByIndex(index);
    if (logixCharges.includes(code)) {
        var result = 0;
        var currentObject = dbx.Context.CurrentObject;
        var charges = getChargesList(currentObject);

        forEach(charges, function (charge) {
            var chCode = charge.ChargeDefinition.Code;
            var amount = charge.AmountInCurrency;
            if (chCode == code) {
                result += amount;
            }
        });
        return result.toFixed(2);
    }
}

// Gets all other charges not included in Logix charge array
function getOtherChargesAmount() {
    var result = 0;
    var currentObject = dbx.Context.CurrentObject;
    var charges = getChargesList(currentObject);
    const logixCharges = getLogixChargeCodes();

    forEach(charges, function (charge) {
        var chCode = charge.ChargeDefinition.Code;
        var amount = charge.AmountInCurrency;
        if (logixCharges.includes(chCode) == false) {
            result += amount;
        }
    });
    return result.toFixed(2);
}

// Determines if all the income charges are prepaid, collect or mixed
function getCollectOrPrepaid() {
    var currentObject = dbx.Context.CurrentObject;
    var charges = getChargesList(currentObject);
    var result = "";
    var prepaids = 0;
    var collects = 0;
    var count = 0;

    forEach(charges, function (charge) {
        var prepaid = charge.IsPrepaid;
        if (isIncomeCharge(charge) && prepaid) {
            prepaids++;
            count++;
        }
        else if (isIncomeCharge(charge) && prepaid == false) {
            collects++;
            count++;
        }
    });
    if (collects == count) {
        result = "Collect";
    } else if (prepaids == count) {
        result = "Prepaid";
    } else {
        result = "Mixed";
    }
    return result;
}


/////* EWS auxiliary code to exclude storage if the WR is created within the last 5 days of the month*/////
function getDatesFromNotes(notes) {
    return notes.substr(notes.length - 25).split("-");
}
function getLastDayOfDate(dateInput) {
    return new Date(dateInput.getFullYear(), dateInput.getMonth() + 1, 0).getDate();
}
function isLastDatyOfMonth(dateInput){
	var tempDate =  new Date (dateInput.toString());
	tempDate.setDate(getLastDayOfDate(dateInput));
	console.log(tempDate.getDate());
	console.log(tempDate.getDate()-4);
	if (dateInput.getDate() >= tempDate.getDate()-4 && dateInput.getDate() <= tempDate.getDate()) {
		return true;	
	}
	return false;
}
function dateDiffInDays(a, b) {
    const _MS_PER_DAY = 1000 * 60 * 60 * 24;
    // Discard the time and time-zone information.
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
    return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}
/////* EWS auxiliary code to exclude storage if the WR is created within the last 5 days of the month END*/////

function getWRsFromSH(currentObj) {
    var items = getItemsList(currentObj);
    var result = [];
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

function getStorageCharges() {
    var curObj = dbx.Context.CurrentObject; //Shipment Object
    var dbClass = curObj.DbClassType;
    var items = getItemsList(curObj);
    var tempArr = [];
    var testArr = [];
    var result = 0;
    var uniWRs = getWRsFromSH(curObj); //Array de unique WRs asociados a un embarque
    var outDate = dbClass == 5 ? new Date(curObj.CreatedOn) : new Date(curObj.ReleaseDate);
    var wrsVolume = 0;
    var wrsWeight = 0;
    var total = 0;
    var division = hasValue(curObj.Division) ? curObj.Division.Name : "";
    var formulaMinimum = division.includes("MIA") ? 50 : (division.includes("LAX") ? 55 : 0); // This is the minimum price for total storage amounts
    var formulaPrice = division.includes("MIA") ? 15 : (division.includes("LAX") ? 18 : 0);  // This is the W/M Price for Storage
    var formulaFreeDays = division.includes("MIA") ? 30 : (division.includes("LAX") ? 21 : 0);  // This is total of Free Time in Days
    var formulaBillCycleDivisor =division.includes("MIA") ? 30 : (division.includes("LAX") ? 7 : 0);  // This is how often storage is charged. For example Miami is per month, LAX is per week. Month = 30, week = 7...
    var billableDays = 0;
    var billableCycles = 0;
    var factorWM = 0;

    var summaryList = [];

    forEachInArray(uniWRs, function (uniWR) {
        var wrDate = new Date(uniWR.CreatedOn);
        var volCBMS = uniWR.TotalVolume.convertTo(dbx.Uom.Volume.CubicMeter).magnitude;
        var wgtTons = uniWR.TotalWeight.convertTo(dbx.Uom.Weight.Kilogram) / 1000;
        var defaultObject = {
            wrNumber: 0,
            calculateFactor: 0,
            formulaMinimum: 0,
            totalDays: 0,
            wrsVolume: 0,
            wrsWeight: 0,
            totalStorage: 0,
            toString: ""
        };
        total = daysBetweenDates(wrDate, outDate);
        if (total > formulaFreeDays) {
            billableDays = total - formulaFreeDays;
            billableCycles = Math.ceil(billableDays);
        } else {
            billableDays = 0;
            defaultObject.totalStorage = 0;
        }
        billableCycles = Math.ceil(billableDays / formulaBillCycleDivisor); // Billed monthly in advance, hence the Math.ceil...
        if (wgtTons > volCBMS) {
            defaultObject.calculateFactor = (wgtTons * formulaPrice).toFixed(2);
        } else {
            defaultObject.calculateFactor = (volCBMS * formulaPrice).toFixed(2);
        }
        var factor = (defaultObject.calculateFactor < formulaMinimum) ? formulaMinimum : defaultObject.calculateFactor;
        result = (factor * billableCycles);

        defaultObject.totalStorage = result || 0;
        defaultObject.formulaMinimum = formulaMinimum;
        defaultObject.wrNumber = uniWR.Number;
        defaultObject.totalDays = total;
        defaultObject.wrsWeight = wgtTons.toFixed(2);
        defaultObject.wrsVolume = volCBMS.toFixed(2);
        defaultObject.toString = " WR#: " + defaultObject.wrNumber + " | Days: " + defaultObject.totalDays +
            " | Vol: " + defaultObject.wrsVolume + " | Weight: " + defaultObject.wrsWeight +
            " | Min: " + defaultObject.formulaMinimum + " | Storage: " + defaultObject.totalStorage;
        summaryList.push(defaultObject);
    });

    return summaryList;
}

function printAddressVertical(address) {
    var result = '';
    var street = address.Street;
    if (street != '') {
        result += street + '\n';
    }
    var city = address.City;
    if (city != '') {
        result += city + '\n';
    }
    var state = address.State;
    if (state != '') {
        result += ', ' + state;
    }
    var zip = address.ZipCode;
    if (zip != '') {
        result += '. ' + zip;
    }
    var country = address.CountryName;
    if (country != '') {
        result += '.\n' + country;
    }
    return result;
}

// Retrieves the internal notes from the BK on a SH if the SH's name = the BK #
function getBookingByNumber(num) {
    var result = null;
    var bookings = dbx.Shipping.Booking.ListByNumber;

    dbx.using(bookings).from(num).iterate(function (booking) {
        if (booking.Name == num) {
            result = booking;
        }
    });
    return result;
}

function getExternalTNs(externalTracking_Numbers) {
  var result = [];
  forEach(externalTracking_Numbers, function (externalTN) {
    result.push(externalTN.TrackingNumber);
  });
  return result.join(" | ");
}
// This function receives an array of attachments and a type which can be either "image" or "doc"
// It returns an integer count per file type
function getAttachmentsInfo(Attachmentlist, type) {
    var attachments = copyToArray(Attachmentlist);
    var cantDocs = 0;
    var cantImgs = 0;
    forEachInArray(attachments, function (attachment) {
        var extension = attachment.Extension.toLowerCase();
        if (extension === "jpg" || extension === "jpeg" || extension === "bmp" || extension === "gif" || extension === "png" || extension === "raw") {
            cantImgs++;
        } else {
            cantDocs++;
        }
    });
    if (type == "image") {
        return cantImgs;
    } else if (type == "doc") {
        return cantDocs;
    }
}

function GetSalesOrderByFilters(status, seller, buyer, WhLocation, Brand, CommodityType) {
    let trans = dbx.Context.CurrentObject;
    let transStatus = dbx.Commerce.SalesOrder.Status[status];

    var response = true;

   if (status != ""){
    let arrayStatus = status.split(",");

            if(arrayStatus.length > 1){
               if( !arrayStatus.includes(trans.Status.toString())){ 
                response = false;
            }
            } else {
                response  = (trans.Status === transStatus);
            }
   }
   if (response && seller != "" ){
    let arraySeller= seller.split(",");

            if(arraySeller.length > 1){
               if( !arraySeller.includes(trans.SellerName.toString())){ 
                response = false;
            }
            } else {
                response  = (trans.SellerName === seller);
            }
   }
   if(response && buyer != ""){
    let arrayBuyer= buyer.split(",");

            if(arrayBuyer.length > 1){
               if( !arrayBuyer.includes(trans.BuyerName.toString())){ 
                response = false;
            }
            } else {
                response = (trans.BuyerName === buyer);
            }
   }
   if(response && WhLocation != ""){
    let arrayWhLocation = WhLocation.split(",");

            if(arrayWhLocation.length > 1){
               if( !arrayWhLocation.includes(trans.CustomFields.wh_location.toString())){ 
                response = false;
            }
            } else {
                response = (trans.CustomFields.wh_location === WhLocation);
            }
   }
   if(response && Brand != ""){
    let arrayBrand = Brand.split(",");

            if(arrayBrand.length > 1){
               if( !arrayBrand.includes(trans.CustomFields.brand.toString())){ 
                response = false;
            }
            } else {
                response = (trans.CustomFields.brand === Brand);
            }
   }
   if(response && CommodityType != ""){
    let arrayCommodityType = CommodityType.split(",");

            if(arrayCommodityType.length > 1){
               if( !arrayCommodityType.includes(trans.CustomFields.commodity_type.toString())){ 
                response = false;
            }
            } else {
                response = (trans.CustomFields.commodity_type === CommodityType);
            }
   }
	return response;
}

function GetPickupOrderByFilters(status, number, shipper, Brand, CommodityType) {
   let trans = dbx.Context.CurrentObject;
   var response = true;
   if (status != ""){
      response  = (trans.Status === dbx.Warehousing.PickupOrder.Status[status]);
   }
   if(response && number != ""){
      response = (trans.Number === number);
   }
   if(response && shipper != ""){
      response = (trans.ShipperName === shipper);
   }
   if(response && Brand != ""){
      response = (trans.CustomFields.brand === Brand);
   }
   if(response && CommodityType != ""){
      response = (trans.CustomFields.commodity_type === CommodityType);
   }
	return response;
}


function getLastInternalNote(obj) {
    var internal = obj.InternalNotes;
    var result = "";
    if (hasValue(internal)) {
        forEach(internal, function (note) {
            result = note.CreatedOn.asDate().format("M/d/Y") + " | " + note.CreatedBy.Name + " | " + note.Text;
        });
    }
    return result;
}

// Converts an item into a Object with Shipment data
function itemShipmentData(curObj) {
    var result = "";
    var shipment = hasValue(curObj.OutShipment) ? curObj.OutShipment : curObj.InShipment;
    var shipmentName = shipment.Name;
    var customer = shipment.Direction == 1 ? shipment.DestinationAgentName : shipment.IssuedByName;
    var executedBy = shipment.CreatedByName;
    var shInternalNote = getLastInternalNote(shipment);
    var direction = shipment.Direction == 1 ? "Export" : "Import";
    var obj = {
        shipmentName: shipmentName,
        customer: customer,
        executedBy: executedBy,
        shInternalNote: shInternalNote,
        direction: direction
    };
    return obj;
}

// Returns a Obj property from its name
function getFieldFromObject(obj, field) {
    return obj[field];
}

// This function retrieves the operation Object of an item when the item is passed as a paramenter.
function getOperationsFromItem(item) {
    var results = [];

    if (item.PickupOrder != null) {
        results.push(item.PickupOrder);
    }
    if (item.WarehouseReceipt != null) {
        results.push(item.WarehouseReceipt);
    }
    if (item.CargoRelease != null) {
        results.push(item.CargoRelease);
    }
    if (item.OutShipment != null) {
        results.push(item.OutShipment);
    }
    if (item.InShipment != null) {
        results.push(item.InShipment);
    }

    return results;
}

function getCurObj(){
    return dbx.Context.CurrentObject;
}


function getStorageChargesICTC() {
    var curObj = dbx.Context.CurrentObject; // Shipment or CR Object
    var dbClass = curObj.DbClassType;
    var tempArr = [];
    var result = 0;
    var uniWRs = getWRsFromSH(curObj); // Array of unique WRs associated with a shipment
    var outDate;
    if (dbClass == 5) {
        if (hasValue(curObj.AvailableDate)) {
            outDate = (curObj.AvailableDate);
        } else if (hasValue(curObj.MasterShipment) && hasValue(curObj.MasterShipment.AvailableDate)) {
            outDate = (curObj.MasterShipment.AvailableDate);
        } else {
            outDate = null; // Or set a default date if appropriate
        }
    } else {
        outDate = (curObj.ReleaseDate);
    }
    if (!hasValue(outDate) || outDate == 0) {
        return "Please update the Available Date at the Master level."; // This message will be returned if outDate is missing or 0
    } else {
        outDate = new Date(outDate);
    }
    var totalDays = 0;
    var formulaMinimum = 0; // This is the minimum price for total storage amounts
    var volPrice = 0.05; // This is the CFT Price for Storage
    var formulaFreeDays = 15; // This is the total of Free Time in Days
    var billableDays = 0;
    var summaryList = [];

    forEachInArray(uniWRs, function (uniWR) {
        var wrDate = hasValue(uniWR.CreatedOn) ? new Date(uniWR.CreatedOn) : "";
        var items = getItemsList(uniWR);
        enumerateItems(items, tempArr);

        tempArr = tempArr.filter(function (item) {
            return (
                item.InShipmentGUID === curObj.GUID ||
                item.OutShipmentGUID === curObj.GUID ||
                item.CargoReleaseGUID === curObj.GUID
            );
        });

        // Calcula el volumen total solo de los ?tems filtrados
        var totalFilteredVolume = 0;
        forEachInArray(tempArr, function (item) {
            totalFilteredVolume += item.Volume.convertTo(dbx.Uom.Volume.CubicFoot).magnitude;
        });

        var defaultObject = {
            wrNumber: 0,
            totalDays: 0,
            formulaFreeDays: formulaFreeDays,
            billableDays: 0,
            wrsVolume: totalFilteredVolume.toFixed(2),
            totalStorage: 0,
            startStorage: "",
            endStorage: "",
            toString: "",
        };
        totalDays = daysBetweenDates(wrDate, outDate);
        billableDays = Math.max(totalDays - formulaFreeDays, 0);

        var costPerM3 = volPrice * totalFilteredVolume;
        var factor = Math.max(costPerM3, formulaMinimum);

        result = factor * billableDays;

        defaultObject.wrNumber = uniWR.Number;
        defaultObject.startStorage = uniWR.CreatedOn;
        defaultObject.totalDays = totalDays;
        defaultObject.formulaFreeDays = formulaFreeDays;
        defaultObject.billableDays = billableDays >= 0 ? billableDays : 0;
        defaultObject.wrsVolume = totalFilteredVolume.toFixed(2); // Usa el volumen filtrado
        defaultObject.totalStorage = result || 0;


        defaultObject.toString =
            "- WR#: " + defaultObject.wrNumber +
            " | WR Date: " + defaultObject.startStorage.asDate().format("M/d/Y") +
            " | Days: " + defaultObject.totalDays +
            " | Free Days: " + defaultObject.formulaFreeDays +
            " | Billable Days: " + defaultObject.billableDays +
            " | V: " + defaultObject.wrsVolume + " cft" +
            " | $" + defaultObject.totalStorage.toFixed(2);

        summaryList.push(defaultObject);
    });

    return summaryList;
}


// Suma de valores de storage de la funci?n principal
function getStorageValueICTC() {
    var summaryList = [];
    summaryList = getStorageChargesICTC();
    var totalFinal = 0;
    forEachInArray(summaryList, function (item) {
        totalFinal += item.totalStorage;
    });
    return (totalFinal).toFixed(2);
}



//Detalle del storage a cobrar de la funci?n principal
function getStorageStringICTC() {
    var summaryList = getStorageChargesICTC();

    // Check if summaryList is a string, which means it's the error message
    if (typeof summaryList === 'string') {
        return summaryList; // Return the error message directly
    }

    if (!summaryList || summaryList.length === 0) {
        return 'getStorageChargesICTC returned empty or undefined.';
    }

    var totalFinal = "";
    forEachInArray(summaryList, function (item) {
        if (item.totalStorage !== 0) {
            totalFinal += item.toString + "\r\n";
        }
    });

    if (!totalFinal) {
        return 'No storage charges were calculated.';
    }
    return totalFinal;
}

