function getInShipment() {
    var currentObj = dbx.Context.CurrentObject;
    var result = '';
    var tempArr = [];
    var items = getItemsList(currentObj);

    if (hasValue(items)) {
        enumerateItems(items, tempArr);
        forEachInArray(tempArr, function (item) {
           result += `${item.WHRItemID} `
        });
    }
    return result;
}
return getInShipment();