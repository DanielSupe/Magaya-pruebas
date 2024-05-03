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





function getInShipment() {
    var currentObj = dbx.Context.CurrentObject;
    var result = '';
    var tempArr = [];
    var items = getItemsList(currentObj);

    if (hasValue(items)) {
        enumerateItems(items, tempArr);
        forEachInArray(tempArr, function (item) {
            result = 5;
            var currentRelatedObj= getMostRelevantItemOperation(item);
            result = 10;
            switch (currentRelatedObj.DbClassType) {
                case 2: //PK
                case 3: //WR
                case 4: //CR
                    result = currentRelatedObj.Number;
                    break;
                case 5: //SH
                    result = hasValue(currentRelatedObj.AirWaybillNumber) ? currentRelatedObj.AirWaybillNumber : 
                    hasValue(currentRelatedObj.BillOfLadingNumber) ? currentRelatedObj.BillOfLadingNumber : currentRelatedObj.Name;
                    break;
                default:
                    result = currentRelatedObj.Number;
                    break;
            }
            return false;
        });
    }
    return result;
}
return getInShipment();


