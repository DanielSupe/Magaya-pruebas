
function getDemora() {
    var curObj = dbx.Context.CurrentObject;
    var ultimoDiaLibre = new Date(curObj.Carrier.CustomFields.dias_libres);
    var retornadosVacios = new Date(curObj.CustomFields.retornadosVacios);
    var result = (Math.ceil((retornadosVacios - ultimoDiaLibre)/ (1000 * 3600 * 24))+1);
    return result <= 0 ? 0: result;
}
return getDemora();

function getChassis() {
    var curObj = dbx.Context.CurrentObject;
    var llegadaAlmacen = new Date(curObj.CustomFields.llegadaAlmacen);
    var movidoDescarga = new Date(curObj.CustomFields.MovidoDescarga) ;
    var result = (Math.ceil((movidoDescarga - llegadaAlmacen) / (1000 * 3600 * 24)) - 1);

    return result <= 0 ? 0: result;
}
return getChassis();

function getAddCharge(nombreServicio, tarifa){
    var curObj = dbx.Context.CurrentObject;
    switch(nombreServicio){
        case "DEMORA":
            return curObj.CustomFields.Demora * tarifa
        case "CHASSIS":
            return curObj.CustomFields.Chassis * tarifa
    }
}

return getAddCharge("DEMORA",50);





