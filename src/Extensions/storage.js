function saveUserInformation(dataUser) {
  console.log(dataUser);
  //salvar o email o tipo de user e uma flag de autenticado
  let isUserActivated = JSON.stringify(dataUser.data.user_activated);
  console.log("isUserActivated->"), isUserActivated;
  sessionStorage.setItem("emailUser", JSON.stringify(dataUser.data.email_user));
  sessionStorage.setItem("typeUser", JSON.stringify(dataUser.data.id_user));
  sessionStorage.setItem("personId", JSON.stringify(dataUser.data.id_user));
  sessionStorage.setItem("isAuthenticated", true);
  // sessionStorage.setItem("teste", dataUser.data.user_activated);
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

// function saveImgProcessed(dataProcessed) {
//   const imgSave = sessionStorage.getItem("imgStorage");
//   if (imgSave != null) 
//     sessionStorage.removeItem("imgStorage", dataProcessed);
//   else 
//     sessionStorage.setItem("imgStorage", dataProcessed);
// }
