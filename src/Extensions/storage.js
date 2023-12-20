
function saveUserInformation(dataUser)
{
    console.log(dataUser)
   sessionStorage.setItem('dataUser', JSON.stringify(dataUser));
}

function getUserInformation(){
    return sessionStorage.getItem('dataUser');
}

function getUserIdInformation(){
    const dataUserStr = sessionStorage.getItem('dataUser');
    console.log(JSON.parse(dataUserStr));
}