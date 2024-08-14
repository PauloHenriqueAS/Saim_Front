
function saveUserInformation(dataUser) {
    console.log(dataUser)
    sessionStorage.setItem('dataUserAuthenticated', JSON.stringify(dataUser.data));
}

function getUserInformation() {
    
    return new Promise((resolve, reject) => {
        const dataSession = sessionStorage.getItem('dataUserAuthenticated');
        if (dataSession != null) {
          resolve(JSON.parse(dataSession));
        }
        reject(null);
      });
}

function getUserIdInformation() {
    const dataUserStr = sessionStorage.getItem('dataUserAuthenticated');
    console.log(JSON.parse(dataUserStr));
}

function clearSession(){
    sessionStorage.clear();
}