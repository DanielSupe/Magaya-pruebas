const calcularInpuesto= (edad,ingresos)=>{
    if(edad >= 18 && ingresos >= 1000){
        return (ingresos*40)/100
    }
}
console.log(calcularInpuesto(18,1000));