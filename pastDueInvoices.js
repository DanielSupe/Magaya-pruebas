

function extraerNumeros(cadena) {
    return cadena.match(/\d+/g).map(Number);
}

function formatearFecha(fecha) {
    var mes = (fecha.getMonth() + 1).toString().padStart(2, '0'); 
    var dia = fecha.getDate().toString().padStart(2, '0');
    var año = fecha.getFullYear();

    return `${mes}/${dia}/${año}`;
}


var curObj = dbx.Context.CurrentObject;
var IgnoreAraAlert = curObj.CustomFields.ignore_ar_alert;
var invoices = curObj.BillingClient.OpenAccountingItems;

var result = [];
//Iterate over the keys of the first item
if(!IgnoreAraAlert){//Ignore DASDAS IS FALSE
    forEach(invoices, function (invoice) {
        var date = new Date(invoice.DueDate);
        var today = new Date(); // Obtiene la fecha actual
        var diferenciaEnTiempo = today.getTime() - date.getTime();
        var diasTranscurridos = Math.round(diferenciaEnTiempo / (1000 * 60 * 60 * 24));
        if(diasTranscurridos >= 1 && invoice.DbClassType == 6){
            var getNumberInvoices = extraerNumeros(invoice.Number);
            var numberInvoices = getNumberInvoices[getNumberInvoices.length - 1];
            var openBalance =  invoice.TotalAmountInCurrency-invoice.AmountPaidInCurrency;
            result.push(`Invoice ${numberInvoices}: $${openBalance.toFixed(2)} open balance, due date ${formatearFecha(date)}, ${diasTranscurridos} days past due. \n`)
        }
        // return false;
    });
    
    if(result.length > 0){
        result.unshift(`CLIENT ${curObj.BillingClient.Name} has past due invoices \n \n`);
    }
}else{
    return ""
}



return result.join('');