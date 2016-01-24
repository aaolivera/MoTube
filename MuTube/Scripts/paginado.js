$(document).ready(function() {
    $('.centro-pantalla').css({
        position: 'fixed',
        left: ($(window).width() - $('.centro-pantalla').outerWidth() )/ 2,
        top: ($(window).height() - $('.centro-pantalla').outerHeight())  / 3
    });

    $('#prev').click(function () {
        pagina($('#prev').data().id, $('#prev').data().filtro, $('#prev').data().pagina, false);
    });

    $('#next').click(function () {
        pagina($('#next').data().id, $('#next').data().filtro, $('#next').data().pagina, true);
    });
    
    var links = [];
    $('.descargar').click(function () {
        $('.tablaDescargados').html('');
        if ($("input.checkDescargar:checked").length > 0) {
            $("input.checkDescargar:checked").each(function () {
                var tema = this;
                var id = $(tema).attr('id');
                $('.tablaDescargados').html($('.tablaDescargados').html() +

                    "<tr><td class=\"sinBorde\" id=\"" + id + "modal\"><img src=\"image/loading.gif\"/>" + $(tema).data().nombre + "</td></tr>");


                $.getJSON('http://www.youtubeinmp3.com/fetch/?format=JSON&video=http://www.youtube.com/watch?v=' + id, function (data) {
                    links.push(data.link);
                    ejecutarRetrasado(function () { $("#" + $(tema).attr('id') + "modal").html("<i class=\"glyphicon glyphicon-ok\"></i>&nbsp;" + $(tema).data().nombre) });
                }).fail(function () {
                    ejecutarRetrasado(function () { $("#" + $(tema).attr('id') + "modal").html("<i class=\"glyphicon glyphicon-remove\"></i>&nbsp;" + $(tema).data().nombre) });
                });

            });
            $(".bs-modal-lg").modal('show');
        } else {
            MostrarAlertaError("Seleccione al menos un tema");
        }

    });
    setInterval(downloadAll, 3000);
    
    function downloadAll() {
        if (links.length > 0) {//de dond saco data??
            file = links.pop();
            var downloadLink = document.createElement("iframe");
            downloadLink.style.display = "none";
            downloadLink.src = file;
            document.body.appendChild(downloadLink);
            //downloadLink.click();
            //document.body.removeChild(downloadLink);
        }        
    }
});

function MostrarAlertaError(data) {

    if (data != null) {
        $("#alertaError span").html(data);
    } else {
        $("#alertaError span").html($("#alertaError").data().mensaje);
    }
    $("#alertaError").show();
    $("#alertaError").delay(500).addClass("in").fadeOut(2500);
}

function ejecutarRetrasado(accion) {
    setTimeout( accion , 3000)
}

function pagina(id, filtro, pagina, direccion) {
    $.ajax({
        url: "\\",
        dataType: 'html',
        async: true,
        data: { paginaId: id, filtro: filtro,pagina : pagina, direccion: direccion },
        success: function (data) {
            $("#gridContainer").html(data);
        }
    });
}