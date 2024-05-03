// function getInShipment() {
//     var currentObj = dbx.Context.CurrentObject;
//     var result = 0;
//     var tempArr = [];
//     var x = 0;
//     var items = getItemsList(currentObj);
//     result += hasValue(items);
//     if (hasValue(items)) {
//         enumerateItems(items, tempArr);
//         if (tempArr.length != 0) {
//             x = tempArr.length;
//             forEachInArray(tempArr, function (item) {
//                 if (item.Status != 4) {
//                     result += 1;
//                 }
//             });
//         }else{
//             return result;
//         }
//     }
//     return x;
// }
// return getInShipment();   

function getInShipment() {
    var currentObj = dbx.Context.CurrentObject;
    var result = '';
    var tempArr = [];
    var x = 0;
    var items = getItemsList(currentObj);
    if (hasValue(items)) {
        enumerateItems(items, tempArr);
        if (tempArr.length != 0) {
            x = tempArr.length;
            forEachInArray(tempArr, function (item) {
                if (item.Status != 4) {
                    result += `${item.Status}...`;
                }
            });
        }else{
            return result;
        }
    }
    return result;
}
return getInShipment();   