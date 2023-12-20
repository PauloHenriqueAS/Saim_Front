function jsLoading(isOpen) {
    if (isOpen) {
        $('#loaderDiv').removeClass('d-none');
        $('#loaderDiv').fadeIn();
    } else {
        $('#loaderDiv').addClass('d-none');
        $('#loaderDiv').fadeOut();
    }
}

//local storage 
//infos = nome usuario, tipo de usuario,  flag autenticado
function recordStorageUser(dataLogin){
    const userInfo =  new localStorage();
    console.log('data de infos = ', userInfo, 'infos recebidas = ', dataLogin);
    userInfo.setItem(dataLogin);
}