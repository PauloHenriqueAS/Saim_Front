function saveUserInformation(dataUser) {
  console.log(dataUser);
  //salvar o email o tipo de user e uma flag de autenticado

  sessionStorage.setItem("emailUser", JSON.stringify(dataUser.data.email_user));
  sessionStorage.setItem("typeUser", JSON.stringify(dataUser.data.id_user));
  sessionStorage.setItem("personId", JSON.stringify(dataUser.data.id_user));
  sessionStorage.setItem("isAuthenticated", true);
}

function getUserInformation() {
  return new Promise((resolve, reject) => {
    const dataSession = sessionStorage.getItem("dataUserAuthenticated");
    if (dataSession != null) {
      resolve(JSON.parse(dataSession));
    }
    reject(null);
  });
}

function getUserIdInformation() {
  const dataUserStr = sessionStorage.getItem("dataUserAuthenticated");
  console.log(JSON.parse(dataUserStr));
}
