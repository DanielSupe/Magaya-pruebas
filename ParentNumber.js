function getDateNumber() {
    var list = [];
    var response = {};
    response.numbers = [];

    var curObj = dbx.Context.CurrentObject;
    var charges = getChargesList(curObj);
    enumerateItems(charges, list);
    if (list.length != 0) {
        forEachInArray(list, function (charge) {
            if (charge.IsThirdPartyCharge) {
                if (isIncomeCharge(charge) && hasValue(charge.Parent.Number)) {
                    if (!response.numbers.includes(charge.Parent.Number)) {
                        response.numbers.push(charge.Parent.Number);
                    }
                }
            }
        });

    }
    var numbersAsString = response.numbers.join(', ');
    return numbersAsString;
}
return getDateNumber();