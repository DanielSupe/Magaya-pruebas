function extraerNumeros(cadena) {
    return cadena.match(/\d+/g).map(Number);
}

function getNumberInvoices(currentObject, Numero, listShiptmet) {//Recibe SIEMPRE UN MASTER y el guid del invoice que se esta ejecutando
    var flag = false;
    var contador = 0
    var contadorHouses = 0;
    var getNumberInvoices = extraerNumeros(currentObject.Name);
    var numberInvoices = getNumberInvoices[getNumberInvoices.length - 1];
    var result = "";
    if(getInvoicesFrom(currentObject).length > 0 && listShiptmet.length > 0){
        contador += 1;
        result = `${numberInvoices}-${contador}`
    }else{
        result = `${numberInvoices}`
    }
    for (var index1 = 0; index1 < listShiptmet.length; index1++) {
        contadorHouses += 1
        // if (!flag) {
            var invoices = getInvoicesFrom(listShiptmet[index1]);
            for (var index = 0; index < invoices.length; index++) {//Itera sobre las invoices del house
                contador += 1;
                if (invoices[index].GUID == Numero) {
                    flag = true;
                    result = `${numberInvoices}-${contador}`
                    // break;
                }
            }

        // } else {
        //     break;
        // }

    }

    if(contadorHouses == listShiptmet.length && contador == 1 ){
        result = `${numberInvoices}`
    }

    return result;

}


function getInvoicesFrom(hypObj) {
    var result = [];
    var uniqueGuids = {};

    var charges = hasValue(hypObj) ? hypObj.Charges : null;

    forEach(charges, function (charge) {
        if (hasValue(charge.Parent) && charge.Parent.DbClassType == 6 && !uniqueGuids[charge.Parent.GUID]) {
            result.push(charge.Parent);
            uniqueGuids[charge.Parent.GUID] = true;
        }
    });
    return result;
}


function getHouseShipmentByDATE(date, date2, guid) {
    var result = [];
    var shipments = dbx.Shipping.Shipment.ListByTime;
    var contador = 0;
    if (date != '') {
        dbx.using(shipments).from(date).to(date2).iterate(function (shipment) {
            if (shipment.MasterGUID == guid) {
                result.push(shipment);
            }
        });
    }

    return result;
}

function getMasterShipmentByDATE(date, date2, masterGuid) {
    var result = [];
    var shipments = dbx.Shipping.Shipment.ListByTime;

    if (date != '') {
        dbx.using(shipments).from(date).to(date2).iterate(function (shipment) {
            if (shipment.GUID == masterGuid) {
                return result = shipment
            }
        });
    }

    return result;
}


var currentObj = dbx.Context.CurrentObject;
var result = "";
var Numero = currentObj.GUID;
var dbClass = currentObj.DbClassType;
if(dbClass != 6){
    return ""
}
forEachRelatedObject(currentObj, function (currentRelatedObj) {
    switch (currentRelatedObj.DbClassType) {
        case 5: //sh

            //--------------------------------------------
            var masterGuid = hasValue(currentRelatedObj.MasterGUID) ? currentRelatedObj.MasterGUID : "";
            var guid = hasValue(currentRelatedObj.GUID) ? currentRelatedObj.GUID : "";
            var createdOn = hasValue(currentRelatedObj.CreatedOn) ? currentRelatedObj.CreatedOn : "";
            var date = new Date(createdOn);

            date.setDate(date.getDate() - 1);
            var date2 = new Date(createdOn);
            date2.setDate(date2.getDate() + 1);

            var guidOperation = masterGuid ? masterGuid : guid;//MasterGuid en caso de shipment master, guid para house

            var shipments = getHouseShipmentByDATE(date, date2, guidOperation);
            var master = masterGuid != "" ? getMasterShipmentByDATE(date, date2, masterGuid) : "";

            if (masterGuid != "") {//Cuando es un house 
                result = `${getNumberInvoices(master, Numero, shipments)}`
                break;
            } else {
                result = `${getNumberInvoices(currentRelatedObj, Numero, shipments)}`
                break;
            }


        //---------------------------------------------------------

        default://pk,WR,CR
            var NumberInvoicesList = extraerNumeros(currentRelatedObj.Number);
            var numberInvoices = NumberInvoicesList[NumberInvoicesList.length - 1];
            result = `${numberInvoices}`;
    }
});

return result;

