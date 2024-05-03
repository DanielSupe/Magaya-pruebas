function getDateNumber() {
    var list = [];
    var response = {};
    response.dates = [];

    var curObj = dbx.Context.CurrentObject;
    var charges = getChargesList(curObj);
    enumerateItems(charges, list);
    if (list.length != 0) {
        forEachInArray(list, function (charge) {
            if (charge.IsThirdPartyCharge) {
                if (isIncomeCharge(charge) && hasValue(charge.Parent.CreatedOn)) {
                    var date = new Date(charge.Parent.CreatedOn);
                    var format = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`


                    if (!response.dates.includes(format)) {
                        response.dates.push(format);
                    }
                }
            }
        });

    }
    var datesAsString = response.dates.join(', ');
    return datesAsString;
}
return getDateNumber();