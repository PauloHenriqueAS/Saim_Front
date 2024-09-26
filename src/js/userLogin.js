// $(function() {
//   jsLoading(false);
// });
// $(document).ready(function() {
// jsLoading(false);
// });

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

function Autehenticate() {
  jsLoading(true);
  event.preventDefault();
  verifyUserLoginFields()
    .then(async (result) => {
      if (result) {
        try {
          console.log('inicio envio de request')
          //jsLoading(true);
          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(result),
          };
          
          const res = await fetch(`${URL_API_BASE}/user/AutenticateUser`, requestOptions);
          const resData = await res.json();
          
          if (resData.success == true) {
            //recordStorageUser(resData)
            jsLoading(false);
            Swal.fire({
              icon: 'success',
              title: 'Sucesso',
              text: `${resData.message}`,
            }).then(() => {
              saveUserInformation(resData);
              window.location.href = 'index.html';
            });
          } else {
            jsLoading(false);
            Swal.fire({
              icon: 'error',
              title: 'Erro no Login',
              text: `${resData.detail}`,
              allowOutsideClick: false,
            });
          }
        } catch (err) {
          jsLoading(false);
          Swal.fire({
            icon: 'error',
            title: 'Erro',
            text: `Login Inválido!`,
            allowOutsideClick: false,
          });
        }
      }
    })
    .catch((error) => {
      jsLoading(false);
      Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: `Login Inválido!`,
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