$(document).ready(function () {
    $('#filtro').keypress(function () {
        removerValid();
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
    return true;
}

function removerValid() 
{
    clearTimeout(interval);
    $('#filtrogroup').removeClass('has-error');
    $('#helpBlock').hide();
    $('#filtrogroup').css('margin-bottom', '20px');
}