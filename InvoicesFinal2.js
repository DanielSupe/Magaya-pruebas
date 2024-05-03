function extraerNumeros(cadena) {
    return cadena.match(/\d+/g).map(Number);
}

function getNumberInvoices(currentObject, Numero, listShiptmet) {//Recibe SIEMPRE UN MASTER y el guid del invoice que se esta ejecutando
    var flag = false;
    var contador = 0
    var contadorHouses = 0;
    var getNumberInvoices = extraerNumeros(currentObject.Name);
    var numberInvoices = getNumberInvoices[getNumberInvoices.length - 1];
    var invoicesMaster = getInvoicesFrom(currentObject);
    return invoicesMaster;
    var result = `${invoicesMaster.length}-`;
    if (invoicesMaster.length > 0) {
        return result = `entro invoices master ${invoicesMaster.length}`
        for (var index2 = 0; index2 < invoicesMaster.length; index2++) {//Itera sobre las invoices del master
            contador += 1;
            if (invoicesMaster[index2].GUID == Numero) {
                result = `${numberInvoices}-${contador}`
                // break;
            }
        }
    }

    if (listShiptmet.length > 0) {
        for (var index1 = 0; index1 < listShiptmet.length; index1++) {
            contadorHouses += 1

            var createdOn2 = hasValue(listShiptmet[index1].CreatedOn) ? listShiptmet[index1].CreatedOn : "";
            var date_1 = new Date(createdOn2);

            date_1.setDate(date_1.getDate() - 1);
            var date_2 = new Date(createdOn2);
            date_2.setDate(date_2.getDate() + 1);

            // if (!flag) {
            var invoices = getInvoicesFrom(listShiptmet[index1]);
            
            // if(getHouseShipmentByDATE(date_1,date_2,listShiptmet[index1].GUID)){
            //     result += `TIene house ${getHouseShipmentByDATE(date_1,date_2,listShiptmet[index1].GUID).length}-`
            // }

            // for (var index = 0; index < invoices.length; index++) {//Itera sobre las invoices del house
            //     contador += 1;
            //     if (invoices[index].GUID == Numero) {
            //         flag = true;
            //         result = `${numberInvoices}-${contador}`
            //         // break;
            //     }
            // }

            // } else {
            //     break;
            // }

        }
    }


    // if (contadorHouses == listShiptmet.length && contador == 1) {
    //     result = `${numberInvoices}`
    // }

    return result;

}


function getInvoicesFrom(hypObj) {
    var result = [];
    var uniqueGuids = {};
    var charges = hasValue(hypObj) ? hypObj.Charges : null;
    let contador = 0;
    forEach(charges, function (charge) {
        contador += 1;
        // if (hasValue(charge.Parent) && charge.Parent.DbClassType == 6 && !uniqueGuids[charge.Parent.GUID]) {
        //     result.push(charge.Parent);
        //     uniqueGuids[charge.Parent.GUID] = true;
        // }

    });
    return contador;
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
if (dbClass != 6) {
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

