$(document).ready(function () {
    var flag = true;
    $('#filtro').keydown(function () {
        //Quita error al escribir algo
        removerValid();
        flag = false;
    });

    $(document).keydown(function (e) {
        //Cambia de pagina con flechitas
        var code = e.keyCode || e.which;
        if (code == 37 && flag) {
            $('#prev').trigger("click");
        }
        if (code == 39 && flag) {
            $('#next').trigger("click");
        }
        flag = true;
    });
    
    $('.accion').click(function () {
        var seleccionado = $(this);
        $('.accion i').each(function () {
            $(this).addClass('hide');            
        });
        seleccionado.find('i').removeClass('hide');

        $('#accionSeleccionada').html(seleccionado.data().accion + "&nbsp;");
        $('#accionSeleccionada').data().val = seleccionado.data().val;
        mensajepopover = seleccionado.data().help;
        $('#botonAccion').html(seleccionado.data().botonaccion);
        $('#filtro').attr("placeholder", seleccionado.data().textbox);
    })
    var mensajepopover = $('.accion').first().data().help;
    $('#help').popover('destroy').popover({ content: function () { return mensajepopover; } })
});
var interval;

function isValid() {
    if ($('#accionSeleccionada').data().val == 0) {
        if ($('#filtro').val() == 0) {
            mostrarError('#errorBusquedaBlanco');
            return false;
        }        
    } else if ($('#accionSeleccionada').data().val == 1) {
        if ($('#filtro').val() == 0) {
            mostrarError('#errorBusquedaBlanco');
            return false;
        }       
    } else if ($('#accionSeleccionada').data().val == 2) {
        if ($('#filtro').val() == 0) {
            mostrarError('#errorUrlEnBlanco');
        } else if (!validarUrl($('#filtro').val())) {
            mostrarError('#errorUrlInvalida');
        } else {
            var videoId = $('#filtro').val().split('v=')[1].split('?')[0];
            $.get($("#urlObtenerNombre").val(), { id: videoId }, function (data) {
                if (data.error == null) {
                    seleccionados = {};
                    seleccionados[videoId] = data.nombre;
                    $('#gridContainer').html('');
                    $('.descargar').trigger("click");
                    seleccionados = {};
                } else {
                    mostrarError('#errorUrlInvalida');
                }                
            });            
        }
        return false;
    }
    BloquearPantalla($('#filtro').val())
    seleccionados = {};
    return true;
}

function mostrarError(id) {
    $('#filtrogroup').addClass('has-error');
    $(id).show();
    $('#filtro').focus();
    $('#filtrogroup').css('margin-bottom', '0px');
    interval = setTimeout(removerValid, 5000);
}

function removerValid() 
{
    clearTimeout(interval);
    $('#filtrogroup').removeClass('has-error');
    $('#errorBusquedaBlanco').hide();
    $('#errorUrlEnBlanco').hide();
    $('#errorUrlInvalida').hide();
    $('#filtrogroup').css('margin-bottom', '20px');
}

function BloquearPantalla(filtro, pagina) {
    var mensaje = 'Buscando "' + filtro + '"';
    if (pagina != null) {
        mensaje += ' - Pagina ' + pagina;
    }
    $.blockUI({ message: '<h5>' + cargando(mensaje) + '</h5>' });
}

function cargando(nombre) {
    return "<img src=\"" + $('#loading').val() + "\"/>" + strip(nombre);
}

function ejecutarRetrasado(accion, tiempo) {
    if (tiempo == null) tiempo = 5000;
    setTimeout(accion, tiempo)
}

function strip(html) {
    var tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
}

function validarUrl(url) {
    var p = /^(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?(?=.*v=((\w|-){11}))(?:\S+)?$/;
    return (url.match(p)) ? RegExp.$1 : false;
}