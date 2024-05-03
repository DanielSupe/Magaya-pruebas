function getDateNumber() {
    //Creamos un objeto de respuesta para responder los diferentes tipos de respuesta que se necesita.
     var response =  {};
         response.dates = [];
         response.numbers = [];

    var curObj = dbx.Context.CurrentObject;
    var charges = getChargesList(curObj);

    forEach(charges, function (charge) {
        if (charge.IsThirdPartyCharge) {
            if (isIncomeCharge(charge)) {
                //  charge Aca podriamos acceder al parent Obejct del Charge, pusshearlo al array
                //  https://dev.magaya.com/index.php/Class_CChargeEx
                //  Parent  —   CAccountItemEx  —   Reference to the parent accounting transaction of this charge
                response.dates.push(charge.parent.date);//verificar la propiedad.
                response.numbers.push(charge.parent.number);//Verificar la propiedad.
            }
            //if (isIncomeCharge(charge) == false) {
               // response.notIncomeCharges.push(charge);
            //}
        }
    });
    return response;
}
return getDateNumber();

function getDateNumber() {
    //Creamos un objeto de respuesta para responder los diferentes tipos de respuesta que se necesita.
    var response =  '';
         response.dates = [];
         response.numbers = [];

    var chargesArray = [];
    var currentObject = dbx.Context.CurrentObject;
    var charges = getChargesList(currentObject);
    enumerateItems(charges, chargesArray);
    return typeof chargesArray;
    forEach(chargesArray, function (charge) {
        if (charge.IsThirdPartyCharge) {
            if (isIncomeCharge(charge)) {
               response += typeof charge.parent;
            }
            //if (isIncomeCharge(charge) == false) {
               // response.notIncomeCharges.push(charge);
            //}
        }
    });
    return response;
}
return getDateNumber();

