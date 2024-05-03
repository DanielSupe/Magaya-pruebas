var currentObj = dbx.Context.CurrentObject;
var volumen = currentObj.Volume.convertTo(dbx.Uom.Volume.CubicFoot).magnitude;
return volumen;
