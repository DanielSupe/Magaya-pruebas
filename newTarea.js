
function isIncomeParent(charge) {
    var chargeDef = charge.ChargeDefinition;
    var type = charge.Parent.Type;
    if (chargeDef == null) {
        return false;
    }

    var accountDef = chargeDef.AccountDefinition;
    // if (accountDef == null) {
    //     return true;
    // }

    switch (type) {
       case 0:
        return true;

        case 1:
        return false;
    }

    return true;
}
//--------------------------------
function isCostParent(charge) {
    var chargeDef = charge.ChargeDefinition;
    var type = charge.Parent.Type;
    if (chargeDef == null) {
        return false;
    }

    var accountDef = chargeDef.AccountDefinition;
    // if (accountDef == null) {
    //     return true;
    // }

    switch (type) {
       case 2:
        return true;

        case 3:
        return false;
    }

    return true;
}
//-----------------------------------------------------------------------------
function get3rdIncone(){
    var currentObj = dbx.Context.CurrentObject;
    var result = 0;
    var charges = getChargesList(currentObj);

    forEach(charges, function(charge){
        if(charge.IsThirdPartyCharge && charge.Status != 0){
            if(isIncomeParent(charge)){
                result += charge.Amount;
            }else{
                result -= charge.Amount;
            }
        }
    });
    return result;
}
return get3rdIncone();

//-----------------------

function get3rdCost(){
    var currentObj = dbx.Context.CurrentObject;
    var result = 0;
    var charges = getChargesList(currentObj);

    forEach(charges, function(charge){
        if(charge.IsThirdPartyCharge && charge.Status != 0){
            if(isIncomeParent(charge)){
                result += charge.Amount;
            }else{
                result -= charge.Amount;
            }
        }
    });
    return result;
}
return get3rdCost();

//----------------------

function get3rdDifference(){
    var currentObj = dbx.Context.CurrentObject;
    var result = 0;
    var charges = getChargesList(currentObj);

    forEach(charges, function(charge){
        if(charge.IsThirdPartyCharge && charge.Status != 0){
            if(isIncomeCharge(charge)){
                result += charge.Amount;
            }

            if(isIncomeCharge(charge) == false){
                result -= charge.Amount;
            }
        }
    });

    return result;
}
return get3rdDifference();

//----------------------------zzz--------------------
function get3rdIncone(){
    var currentObj = dbx.Context.CurrentObject;
    var result = "";
    var tempArr = [];
    var charges = getChargesList(currentObj);
    enumerateItems(charges, tempArr);
    forEachInArray(tempArr, function(charge){
        if(charge.IsThirdPartyCharge && charge.Status != 0){
              result += charge.Parent.Type;
            
        }
    });
    return result;
}
return get3rdIncone();


//.....................anterior,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
var curObj = dbx.Context.CurrentObject;
    var result = 0;
    var charges = getChargesList(curObj);

    forEach(charges, function (charge) {
        if (charge.IsThirdPartyCharge) {
            if (isIncomeCharge(charge)) {
                result += charge.Amount;
            }
        }
    });

    return result;


    var curObj = dbx.Context.CurrentObject;
    var result = 0;
    var charges = getChargesList(curObj);

    forEach(charges, function (charge) {
        if (charge.IsThirdPartyCharge == true) {
            if (isIncomeCharge(charge) == false) {
                result += charge.Amount;
            }
        }
    });

    return result;

    //_______________________________bueno--------------------------------------------------------
    function isIncomeParent(charge) {
        var chargeDef = charge.ChargeDefinition;
        var type = charge.Parent.Type;
        if (chargeDef == null) {
            return false;
        }
    
        var accountDef = chargeDef.AccountDefinition;
        if (accountDef == null) {
            return true;
        }
    
        switch (type) {
           case 0:
            return true;
    
            case 1:
            return false;
        }
    
        return 0;
    }
    
    function get3rdIncone(){
        var currentObj = dbx.Context.CurrentObject;
        var result = "";
        var charges = getChargesList(currentObj);
    
        forEach(charges, function(charge){
            if(charge.IsThirdPartyCharge && charge.Status != 0 && charge.Amount != 0){
                switch (isIncomeParent(charge)) {
                    case true:
                    result += charge.Amount;
                    break;
                    case false:
                    result -= charge.Amount;
                    break;
                 }
            }
        });
        return result;
    }
    return get3rdIncone();

    //-------------------------------------------cost----------------------
    function isCostParent(charge) {
        var chargeDef = charge.ChargeDefinition;
        var type = charge.Parent.Type;
        if (chargeDef == null) {
            return false;
        }
    
        var accountDef = chargeDef.AccountDefinition;
        if (accountDef == null) {
            return true;
        }
    
        switch (type) {
           case 2:
            return true;
    
            case 3:
            return false;
        }
    
        return 0;
    }
    
    function get3rdCost(){
        var currentObj = dbx.Context.CurrentObject;
        var result = "";
        var charges = getChargesList(currentObj);
    
        forEach(charges, function(charge){
            if(charge.IsThirdPartyCharge && charge.Status != 0 && charge.Amount != 0){
                switch (isCostParent(charge)) {
                    case true:
                    result += charge.Amount;
                    break;
                    case false:
                    result -= charge.Amount;
                    break;
                 }
            }
        });
        return result;
    }
    return get3rdCost();