const getUserLoginFields = () => {
  return {
    email_user: $("#userEmailLogin").val().trim(),
    password_user: $("#userPasswordLogin").val().trim(),
  };
};

const verifyUserLoginFields = () => {
  return new Promise((resolve, reject) => {
    const user = getUserLoginFields();
    if (user && user.password_user && user.password_user.length > 0) {
      resolve(user);
    }
    reject("Senha Inválida!");
  });
};

const handleSubmit = () => {
  event.preventDefault();
  verifyUserLoginFields()
    .then(async (result) => {
      if (result) {
        try {
          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(result),
          };
          const res = await fetch(`${URL_API_BASE}/user/AutenticateUser`, requestOptions);

          const resData = await res.json();
          console.log(resData)
          if(resData.success == true){
            //recordStorageUser(resData)
            saveUserInformation(resData)
            Swal.fire({
              icon: 'success',
              title: 'Sucesso',
              text: `${resData.message}`,
            }).then(() => {
              
              window.location.href = 'index.html';
            });
          }else{
            Swal.fire({
              icon: 'error',
              title: 'Erro no Login',
              text: `${resData.message}`,
              allowOutsideClick: false,
            });
          }
        } catch (err) {
          Swal.fire({
            icon: 'error',
            title: 'Erro',
            text: `${err.message}`,
            allowOutsideClick: false,
          });
        }
      }
    })
    .catch((error) => {
      Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: `${error.message}`,
        allowOutsideClick: false,
      });
    });
};

function validateEmail() {
  const email_user = $("#userEmailLogin").val().trim();

  const regexEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

  if (regexEmail.test(email_user)) {
    $("#userEmailLogin").css("border-color", "green").css("box-shadow", "3px 3px 3px green");
    return true;
  } else {
    $("#userEmailLogin").css("border-color", "red").css("box-shadow", "3px 3px 3px red");
    return false;
  }
}