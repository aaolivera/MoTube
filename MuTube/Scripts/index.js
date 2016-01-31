$(document).ready(function () {
    var flag = true;
    $('#filtro').keydown(function () {
        removerValid();
        flag = false;
    });

    $(document).keydown(function (e) {
        var code = e.keyCode || e.which;
        if (code == 37 && flag) {
            $('#prev').trigger("click");
        }
        if (code == 39 && flag) {
            $('#next').trigger("click");
        }
        flag = true;
    });
    

});
var interval;
function isValid() {
    if ($('#filtro').val() == 0) {
        $('#filtrogroup').addClass('has-error');
        $('#helpBlock').show();
        $('#filtro').focus();
        $('#filtrogroup').css('margin-bottom', '0px');
        interval = setTimeout(removerValid, 5000);
        return false;
    }
    BloquearPantalla($('#filtro').val())
    return true;
}

function removerValid() 
{
    clearTimeout(interval);
    $('#filtrogroup').removeClass('has-error');
    $('#helpBlock').hide();
    $('#filtrogroup').css('margin-bottom', '20px');
}

function BloquearPantalla(filtro, pagina) {
    var mensaje = 'Buscando ' + filtro;
    if (pagina != null) {
        mensaje += ' - Pagina ' + pagina;
    }
    $.blockUI({ message: '<h5>' + cargando(mensaje) + '</h5>' });
}

function cargando(nombre) {
    return "<img src=\"" + $('#loading').val() + "\"/>" + nombre;
}