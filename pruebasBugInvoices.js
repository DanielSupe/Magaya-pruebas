// getNumberInvoices


function extraerNumeros(cadena) {
    return cadena.match(/\d+/g).map(Number);
}

function getNumberInvoices(currentObject,Numero) {
    var masterGuid = hasValue(currentObject.MasterGUID) ? currentObject.MasterGUID : "";
    var guid = hasValue(currentObject.GUID) ? currentObject.GUID : "";
    var createdOn = hasValue(currentObject.CreatedOn) ? currentObject.CreatedOn : "";
    var date = new Date(createdOn);

    date.setDate(date.getDate() - 1);
    var date2 = new Date(createdOn);
    date2.setDate(date2.getDate() + 1);

    var guidOperation = masterGuid ? masterGuid : guid;//MasterGuid en caso de shipment master, guid para house

    var shipments = getHouseShipmentByDATE(date, date2, guidOperation);
    var master = masterGuid != "" ? getMasterShipmentByDATE(date, date2, masterGuid) : "";
    var result = "";
    var len = getInvoicesFrom(currentObject);


    var getNumberInvoices = extraerNumeros(master ? master.Name:currentObject.Name);
    var numberInvoices = getNumberInvoices[getNumberInvoices.length-1];

    if(len.length < 2){
        result =  numberInvoices;
    }else{
        var contador = 0;
    forEachInArray(len, function (invoice) {
        contador += 1;
        if (invoice.GUID == Numero) {
            return result = `${numberInvoices}-${contador}`;
        }
    });
    }
    return result;

    if (masterGuid != "") {
        if (master && shipments.length != 0) {
            return result = `House ${master.Name}`
            var nameMaster = master.Name;
            var contador = 0;
            forEachInArray(shipments, function (house) {
                contador += 1;
                var Number = `${house.Name}-${contador}`
                if (house.GUID == guid) {
                    return result = Number;
                }
            });
            return result;
        }

    } else {
        return result = `Master |${currentObject.Name}|${shipments.length}`
        if (shipments.length != 0) {
            return result = currentObject.Name;
        }
        return result;
    }
}


function getInvoicesFrom(hypObj) {
    var result = [];
    // var hypObj = (typeof hypObj !== 'undefined' ? hypObj : dbx.Context.CurrentObject);
    var charges = hasValue(hypObj) ? hypObj.Charges : null;

    forEach(charges, function (charge) {
        if (hasValue(charge.Parent) && charge.Parent.DbClassType == 6) {
            result.push(charge.Parent);
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
var Numero =  currentObj.GUID;
forEachRelatedObject(currentObj, function (currentRelatedObj) {
    switch (currentRelatedObj.DbClassType) {
        case 5: //sh
            result = `Shipment ${getNumberInvoices(currentRelatedObj,Numero)}`
            break;
        default://pk,WR,CR
            result = `${currentRelatedObj.Number}`;
    }
});

return result;