$(document).ready(function () {
    $('#filtro').keypress(function () {
        $('#filtrogroup').removeClass('has-error');
        $('#helpBlock').hide();
        $('#filtrogroup').css('margin-bottom', '20px');
    });

});

function isValid() {
    if ($('#filtro').val() == 0) {
        $('#filtrogroup').addClass('has-error');
        $('#helpBlock').show();
        $('#filtro').focus();
        $('#filtrogroup').css('margin-bottom', '0px');
        return false;
    }
    return true;
}