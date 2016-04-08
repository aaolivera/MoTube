var suggestCallBack;
$(document).ready(function () {
    var flag = true;
    $('#filtro').keydown(function () {
        //Quita error al escribir algo
        removerValid();
        flag = false;
    });

    
 $("#filtro").autocomplete({
     source: function (request, response) {

            suggestCallBack = function (data) {
                var suggestions =[];
                $.each(data[1], function (key, val) {
                    suggestions.push(val[0]);
                });
                if (suggestions.length > 5) suggestions.length = 5; // prune suggestions list to only 5 items
                response(suggestions);
            };
            var d = new Date();
            $.getJSON("http://suggestqueries.google.com/complete/search?callback=?",
                    {
                    "hl": "es", // Language                  
                    "jsonp": "suggestCallBack", // jsonp callback function name
                    "q": request.term, // query term
                    "client": "youtube", // force youtube style response, i.e. jsonp
                    "pp": d.getMilliseconds()
                    });
     },
     select: function (event, ui) {
         $('#filtro').val(ui.item.label);
         $('#filtroForm').submit();
     }
 });

 $(document).on('submit', '#filtroForm', function () { $('ul.ui-autocomplete').hide()});

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

        $('#accionSeleccionada').html(seleccionado.data().accion.split(" ")[2] + "&nbsp;");
        $('#accionSeleccionada').data().val = seleccionado.data().val;
        mensajepopover = seleccionado.data().help;
        $('#botonAccion').html(seleccionado.data().botonaccion);
        $('#filtro').attr("placeholder", seleccionado.data().textbox);
    })
    var mensajepopover = $('.accion').first().data().help;
    $('#help').popover('destroy').popover({ content: function () { return mensajepopover; } })

    $('#bender').tooltip();
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
    BloquearPantalla()
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

function BloquearPantalla() {
    $.blockUI({
        blockMsgClass: 'blocuiBox',
        message: '<h5>' + cargandoGif() + 'Buscando</h5>'
    });
}

function cargandoGif() {
    return "<img src=\"" + $('#loading').val() + "\"/>";
}

function cargando(nombre) {
    return cargandoGif() + strip(nombre);
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