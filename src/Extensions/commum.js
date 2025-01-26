$(document).ready(function () {
    const isAuthenticated = verifyIsAuthenticated();
    if(isAuthenticated){
        $("#btnLoginPortal").addClass("d-none");
        $("#btnLogout").removeClass("d-none");

        //exibição dos filtros do portal
        $("#dropFiltrosGerais").removeClass("d-none");
        $("#dropFiltrosMadeira").removeClass("d-none");
    }

    $('#btnLogout').on('click', function(event) {
        event.preventDefault();
        LogoffSystem(); 
    });
});


function verifyIsAuthenticated(){
    return sessionStorage.getItem('isAuthenticated');
}


function jsLoading(isOpen) {
    if (isOpen) {
        $('#loaderDiv').removeClass('d-none');
        $('#loaderDiv').fadeIn();
    } else {
        $('#loaderDiv').addClass('d-none');
        $('#loaderDiv').fadeOut();
    }
}

function LogoffSystem(){
    sessionStorage.clear();
    localStorage.clear();

    $("#btnLoginPortal").removeClass("d-none");
    $("#btnLogout").addClass("d-none");

    window.location.href = 'index.html';
}

//local storage 
//infos = nome usuario, tipo de usuario,  flag autenticado
function recordStorageUser(dataLogin){
    //salvar no storage do navegador o jwt da api -> adicionar autenticação nos 
    const userInfo =  new localStorage();
    console.log('data de infos = ', userInfo, 'infos recebidas = ', dataLogin);
    userInfo.setItem(dataLogin);
}