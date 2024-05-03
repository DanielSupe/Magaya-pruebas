// function getDateNumber() {
//     //Creamos un objeto de respuesta para responder los diferentes tipos de respuesta que se necesita.
//     var list = [];
//     var response = {};
//     response.dates = [];
//     response.numbers = [];

//     var curObj = dbx.Context.CurrentObject;
//     var charges = getChargesList(curObj);
//     if (hasValue(charges)) {
//         enumerateItems(charges, list);
//         return list.length;

//     }
//     forEach(charges, function (charge) {
//         if (charge.IsThirdPartyCharge) {
//             if (isIncomeCharge(charge)) {
//                 //  charge Aca podriamos acceder al parent Obejct del Charge, pusshearlo al array
//                 //  https://dev.magaya.com/index.php/Class_CChargeEx
//                 //  Parent  —   CAccountItemEx  —   Reference to the parent accounting transaction of this charge
//                 response.dates.push(charge.parent.date);//verificar la propiedad.
//                 response.numbers.push(charge.parent.number);//Verificar la propiedad.
//             }
//             //if (isIncomeCharge(charge) == false) {
//             // response.notIncomeCharges.push(charge);
//             //}
//         }
//     });
//     return response;
// }
// return getDateNumber();
//----------------------------------------Number-------------------------
function getDateNumber() {
    var list = [];
    var response = {};
    response.dates = [];
    response.numbers = [];

    var curObj = dbx.Context.CurrentObject;
    var charges = getChargesList(curObj);
    enumerateItems(charges, list);
    if (list.length != 0) {
        forEachInArray(list, function (charge) {
            //if (charge.IsThirdPartyCharge) {
                if (isIncomeCharge(charge) && hasValue(charge.Parent.Number)) {
                    if(!response.numbers.includes(charge.Parent.Number)){
                        response.numbers.push(charge.Parent.Number);
                    }
                }
            //}
        });

    }
    var numbersAsString = response.numbers.join(', ');
    return numbersAsString;
}
return getDateNumber();

//-----------------------------------------Date-----------------------------
function getDateNumber() {
    var list = [];
    var response = {};
    response.dates = [];

    var curObj = dbx.Context.CurrentObject;
    var charges = getChargesList(curObj);
    enumerateItems(charges, list);
    if (list.length != 0) {
        forEachInArray(list, function (charge) {
            //if (charge.IsThirdPartyCharge) {
                if (isIncomeCharge(charge) && hasValue(charge.Parent.CreatedOn)) {
                    var date = new Date(charge.Parent.CreatedOn);
                    var format = `${date.getMonth() +1}/${date.getDay()}/${date.getFullYear()}`


                    if(!response.dates.includes(format)){
                        response.dates.push(format);
                    }
                }
            //}
        });

    }
    var datesAsString = response.dates.join(', ');
    return datesAsString;
}
return getDateNumber();
