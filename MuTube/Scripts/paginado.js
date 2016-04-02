var seleccionados = {};
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
            $("#myModal").modal('show');
            var count = Object.keys(seleccionados).length;
            var oncomplete = function (tema) {
                if (!--count) {
                    $("#myModal-cerrar").prop('disabled', false);
                }
                $('#' + tema.id).prop('checked', false);
                delete seleccionados[tema.id];
            };
            Object.keys(seleccionados).forEach(function (id) {
                var nombre = seleccionados[id];
                $('.tablaDescargados').html($('.tablaDescargados').html() + "<tr><td class=\"sinBorde\" id=\"" + id + "modal\">" + cargando(nombre) + "</td></tr>");
                aProcesar.push({ id: id, nombre: nombre, oncomplete: oncomplete, versionn : versionDeModal.n })
            });
            
            $("#myModal").modal('show');            
        } else {
            MostrarAlertaError("Seleccione al menos un tema");
        }
    });

    setInterval(downloadAll, 3000);
    setInterval(procesarAll, 1000);

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
        $("#myModal-cerrar").prop('disabled', true);
    })

    $(document).on("click", ".reintentar", function () {
        elemento = $(this);
        $("#" + elemento.data().id + "modal").html(cargando(elemento.data().nombre))
        aProcesar.push({ id: elemento.data().id, nombre: elemento.data().nombre, oncomplete: null, version: versionDeModal.n })
    })
});

var links = [];
var aProcesar = [];
var versionDeModal = {n : 1, a : false};

var procesadores = [
    function (tema,dfd) {
        $.ajax({
            dataType: "json",
            url: 'http://www.youtubeinmp3.com/fetch/?format=JSON&video=http://www.youtube.com/watch?v=' + tema.id,
            success: function(data) {
                if (tema.versionn == versionDeModal.n && versionDeModal.a) {
                    links.push(data.link);
                    ejecutarRetrasado(function () { $("#" + tema.id + "modal").html("<i class=\"glyphicon glyphicon-ok\"></i>&nbsp;" + tema.nombre) });
                    
                    dfd.resolve(true);
                }
            }
        }).complete(function () {
            dfd.resolve(false);
        });
    },

    function (tema, dfd) {

        $.ajax({
            url: 'https://mp3skull.onl/api/youtube/frame/#/?id=' + tema.id,
            success: function (data) {
                if (tema.versionn == versionDeModal.n && versionDeModal.a) {
                    cargarurl();
                }
            }
        });

        function cargarurl() {
            $.ajax({
                dataType: "json",
                url: 'https://mp3skull.onl/api/youtube/state?id=' + tema.id,
                success: function (data) {
                    if (tema.versionn == versionDeModal.n && versionDeModal.a && data.error == 0 && data.finished) {
                        links.push('https://mp3skull.onl/api/youtube/convert/?id=' + tema.id);
                        ejecutarRetrasado(function () { $("#" + tema.id + "modal").html("<i class=\"glyphicon glyphicon-ok\"></i>&nbsp;" + tema.nombre) });
                        dfd.resolve(true);
                    } else if (tema.versionn == versionDeModal.n && versionDeModal.a && data.error == 0) {
                        setTimeout(cargarurl, 1000);
                    } else {
                        dfd.resolve(false);
                    }                    
                }
            });
        };
    },

    function (tema,dfd) {
        if (tema.versionn == versionDeModal.n && versionDeModal.a) {
            ejecutarRetrasado(function () { $("#" + tema.id + "modal").html("<i class=\"glyphicon glyphicon-remove\"></i>&nbsp;" + tema.nombre + "&nbsp;&nbsp;-&nbsp;&nbsp;<i style=\"cursor: pointer\" data-id=\"" + tema.id + "\" data-nombre=\"" + tema.nombre + "\" class=\"reintentar glyphicon glyphicon-repeat\"></i>&nbsp;Error al procesar") }, 700);
            dfd.resolve(true);
        }
    }


];

function downloadAll() {
    if (links.length > 0) {
        file = links.pop();
        var downloadLink = document.createElement("iframe");
        downloadLink.style.display = "none";
        downloadLink.src = file;
        document.body.appendChild(downloadLink);
    }
}

function procesarAll() {
    if (aProcesar.length > 0) {
        tema = aProcesar.pop();
        procesar(tema,0);
    }
}

function procesar(tema,i) { 
    var dfd = $.Deferred();
    dfd.done(function (n) {
        if (tema.versionn == versionDeModal.n && versionDeModal.a && !n) {
            procesar(tema, i + 1);
        };
        if (tema.oncomplete != null) tema.oncomplete(tema);
    });

    procesadores[i](tema,dfd);
}

function MostrarAlertaError(data) {

    if (data != null) {
        $(".alertaError span").html(data);
    } else {
        $(".alertaError span").html($("#alertaError").data().mensaje);
    }
    $(".alertaError").show();
    $(".alertaError").delay(500).addClass("in").fadeOut(2500);
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
    var seleccionadosEnPagina = 0;
    var checks = $("input.checkDescargar");
    var count = checks.length;
    checks.each(function () {
        var tema = this;
        var id = $(tema).attr('id');

        if (seleccionados.hasOwnProperty(id)) {
            seleccionadosEnPagina++;
            $(tema).prop('checked', true);
        }

        if (!--count && checks.length == seleccionadosEnPagina) {
            $('#todos').prop('checked', true)
        }
    });
}