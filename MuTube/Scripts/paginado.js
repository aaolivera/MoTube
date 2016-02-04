$(document).ready(function () {
    $('.centro-pantalla').css({
        position: 'fixed',
        left: ($(window).width() - $('.centro-pantalla').outerWidth() )/ 2,
        top: ($(window).height() - $('.centro-pantalla').outerHeight())  / 3
    });

    $(document).on("click", "#prev", function () {
        pagina($('#prev').data().id, $('#prev').data().filtro, $('#prev').data().pagina, false);
    });

    $(document).on("click", '#next', function () {
        pagina($('#next').data().id, $('#next').data().filtro, $('#next').data().pagina, true);
    });

    $(document).on("click", '#todos', function () {
        if ($('#todos').is(":checked")) {
            $("input.checkDescargar").prop('checked', true).trigger("change");
        } else {
            $("input.checkDescargar").prop('checked', false).trigger("change");
        }
    });
    
    $(document).on("change", "input.checkDescargar", function () {
        var tema = this;
        var id = $(tema).attr('id');
        var nombre = $(tema).data().nombre;
        if ($(this).is(":checked")) {
            seleccionados[id] = nombre;
        } else {
            delete seleccionados[id];
        }
    });

    $(document).on("click", '.descargar', function () {
        versionDeModal.n++;
        versionDeModal.a = true;
        $('.tablaDescargados').html('');
        if (Object.keys(seleccionados).length > 0) {
            var count = Object.keys(seleccionados).length;
            var oncomplete;
            Object.keys(seleccionados).forEach(function (id) {
                var nombre = seleccionados[id];
                $('.tablaDescargados').html($('.tablaDescargados').html() + "<tr><td class=\"sinBorde\" id=\"" + id + "modal\">" + cargando(nombre) + "</td></tr>");

                if (!--count) {
                    oncomplete = function () {
                        $("#myModal-cerrar").prop('disabled', false);
                    }
                }
                procesar(id, nombre, oncomplete);
            });
            
            $("#myModal").modal('show');            
        } else {
            MostrarAlertaError("Seleccione al menos un tema");
        }
    });
    setInterval(downloadAll, 3000);

    $(document).on("click", '.verVideo', function () {
        var item = $(this);
        var href = item.attr("href");
        $("#ytplayer").attr("src", href);
        $("#yttitle").html(item.data().name);
        $("#myModal2").modal('show');
        return false;
    });

    $('#myModal2').on('hidden.bs.modal', function () {
        $("#ytplayer").attr("src", "");
        $("#yttitle").html("Cargando...");
    })

    $('#myModal').on('hidden.bs.modal', function () {
        versionDeModal.a = false;
    })

    $(document).on("click", ".reintentar", function () {
        elemento = $(this);
        $("#" + elemento.data().id + "modal").html(cargando(elemento.data().nombre))
        procesar(elemento.data().id, elemento.data().nombre);
    })
});

var links = [];
var versionDeModal = {n : 1, a : false};

function procesar(id, nombre,onComplete) {
    var version = versionDeModal.n;
    $.getJSON('http://www.youtubeinmp3.com/fetch/?format=JSON&video=http://www.youtube.com/watch?v=' + id, function (data) {
        if (version == versionDeModal.n && versionDeModal.a) {
            links.push(data.link);
            ejecutarRetrasado(function () { $("#" + id + "modal").html("<i class=\"glyphicon glyphicon-ok\"></i>&nbsp;" + nombre) });
        }        
    }).fail(function () {
        if (version == versionDeModal.n && versionDeModal.a) {
            ejecutarRetrasado(function () { $("#" + id + "modal").html("<i class=\"glyphicon glyphicon-remove\"></i>&nbsp;" + nombre + "&nbsp;&nbsp;-&nbsp;&nbsp;<i style=\"cursor: pointer\" data-id=\"" + id + "\" data-nombre=\"" + nombre + "\" class=\"reintentar glyphicon glyphicon-repeat\"></i>&nbsp;Error al procesar") }, 700);
        }
    }).complete(function () {
        if (onComplete != null) {
            onComplete();
        }
    });
}

function downloadAll() {
    if (links.length > 0) {
        file = links.pop();
        var downloadLink = document.createElement("iframe");
        downloadLink.style.display = "none";
        downloadLink.src = file;
        document.body.appendChild(downloadLink);
    }
}

function MostrarAlertaError(data) {

    if (data != null) {
        $("#alertaError span").html(data);
    } else {
        $("#alertaError span").html($("#alertaError").data().mensaje);
    }
    $("#alertaError").show();
    $("#alertaError").delay(500).addClass("in").fadeOut(2500);
}

function pagina(id, filtro, pagina, direccion) {
    //
    var correccion = -1;
    if (direccion) {
        correccion = 1;
    }
    BloquearPantalla(filtro, pagina + correccion);
    //

    $.ajax({
        url: "\\",
        dataType: 'html',
        async: true,
        data: { paginaId: id, filtro: filtro,pagina : pagina, direccion: direccion },
        success: function (data) {
            $("#gridContainer").html(data);
            marcarSeleccionados();
        },
        complete: function(data) {
            $.unblockUI();
        }
    });
}

function marcarSeleccionados() {
    $("input.checkDescargar").each(function () {
        var tema = this;
        var id = $(tema).attr('id');
        if (seleccionados.hasOwnProperty(id)) {
            $(tema).prop('checked', true);
        }
    });
}