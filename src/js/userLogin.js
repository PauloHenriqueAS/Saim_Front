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
          console.log("inicio envio de request");
          //jsLoading(true);
          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(result),
          };

          const res = await fetch(
            `${URL_API_BASE}/user/AutenticateUser`,
            requestOptions
          );
          const resData = await res.json();
          console.log(resData.data);

          if (resData.success == true) {
            //recordStorageUser(resData)
            jsLoading(false);
            Swal.fire({
              icon: "success",
              title: "Sucesso",
              text: `${resData.message}`,
            }).then(() => {
              saveUserInformation(resData);
              // let isUserActivated = JSON.stringify(resData.data.user_activated);
              // console.log("isUserActivated->", isUserActivated);
              // if (isUserActivated == true || isUserActivated == "true") {
                window.location.href = "index.html";
              // } else {
              //   ValidateUserAutenticated();
              // }
            });
          } else {
            jsLoading(false);
            Swal.fire({
              icon: "error",
              title: "Erro no Login",
              text: `${resData.detail}`,
              allowOutsideClick: false,
            });
          }
        } catch (err) {
          jsLoading(false);
          Swal.fire({
            icon: "error",
            title: "Erro",
            text: `Login Inválido!`,
            allowOutsideClick: false,
          });
        }
      }
    })
    .catch((error) => {
      jsLoading(false);
      Swal.fire({
        icon: "error",
        title: "Erro",
        text: `Login Inválido!`,
        allowOutsideClick: false,
      });
    });
}

function validateEmail() {
  const email_user = $("#userEmailLogin").val().trim();

  const regexEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

  if (regexEmail.test(email_user)) {
    $("#userEmailLogin")
      .css("border-color", "green")
      .css("box-shadow", "3px 3px 3px green");
    return true;
  } else {
    $("#userEmailLogin")
      .css("border-color", "red")
      .css("box-shadow", "3px 3px 3px red");
    return false;
  }
}

function ValidateUserAutenticated() {
  Swal.fire({
    icon: "warning",
    title: "Usuário não ativado",
    html: "Informe o token enviado no email para ativar a conta.<br><br><input type='text' id='tokenInput' class='swal2-input' placeholder='Digite o token aqui'>",
    showCancelButton: true,
    confirmButtonText: "Ativar",
    cancelButtonText: "Cancelar",
    focusConfirm: false,
    allowOutsideClick: false,
  }).then((result) => {
    if (result.isConfirmed) {
      const token = $("#tokenInput").val();
      console.log('token =', token)
      if (token == null || token == '') {
        Swal.fire({
          icon: "error",
          title: "Token inválido",
          text: "Por favor, insira um token válido.",
        }).then(() => {
          LogoffSystem();
        });
      } else {
        ativateUser(token);
      }
    }else{
      LogoffSystem();
      window.location.reload();
    }
  });
}

async function ativateUser(token) {
  jsLoading(true);
  console.log(`${URL_API_BASE}/user/AutenticateUser`,)
  console.log("ulr", `${URL_API_BASE}/user/ActivateUserAccess`);
  const usermail = sessionStorage.getItem("emailUser");
  console.log(usermail)
  const requestBody = {
    email_user: usermail.slice(1, -1),
    token_activate: token,
  };

  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestBody),
  };

  const response = await fetch(
    `${URL_API_BASE}/user/ActivateUserAccess`,
    requestOptions
  );

  const resData = await response.json();
  if (resData.success) {
    jsLoading(false);
    Swal.fire({
      icon: "success",
      title: "Sucesso",
      text: "Usuário ativado com sucesso.",
    }).then(() => {
      window.location.href = "index.html";
    });
  } else {
    jsLoading(false);
    Swal.fire({
      icon: "error",
      title: "Erro na ativação",
      text: resData.detail,
      allowOutsideClick: false,
    }).then(() => {
      LogoffSystem();
      window.location.reload();
    });
  }
}
