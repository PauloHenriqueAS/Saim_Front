function getUserRegistrationFields() {
  return {
    nome_pessoa: $("#inputNome").val().trim(),
    uf_pessoa: $("#inputUF").val().trim(),
    instituicao_pessoa: $("#inputInstituicao").val().trim(),
    email_user: $("#inputEmail").val().trim(),
    password_user: $("#inputSenha").val().trim(),
    password_confirmation: $("#inputConfirmSenha").val().trim(),
    tipo_pessoa: 'User',
  };
}

function verifyUserRegistrationFields() {
  return new Promise((resolve, reject) => {
    const user = getUserRegistrationFields();
    const areFieldsIncomplete =
      user.nome_pessoa == "" ||
      user.instituicao_pessoa == "" ||
      user.email_user == "" ||
      user.password_user == "" ||
      user.password_confirmation == "";

    if (!validateEmail()) {
      Swal.fire({
        icon: "error",
        title: "Erro",
        text: "Email Inválido!",
        allowOutsideClick: false,
      });
    }
    else if (!validadeAllUfInformations()) {
      Swal.fire({
        icon: "error",
        title: "Erro",
        text: "Dados da Institução Inválido!",
        allowOutsideClick: false,
      });
    }
    else if (!validadeAllPassword()) {
      Swal.fire({
        icon: "error",
        title: "Erro",
        text: "Senha Inválida!",
        allowOutsideClick: false,
      });
    }
    else if (user && user.password_user != user.password_confirmation) {
      Swal.fire({
        icon: "error",
        title: "Erro",
        text: "Senhas Inválidas!",
        allowOutsideClick: false,
      });
    } else if (areFieldsIncomplete) {
      Swal.fire({
        icon: "warning",
        title: "Alerta",
        text: "Preencha todos os campos!",
        allowOutsideClick: false,
      }).then(() => {
        reject("Campos incompletos!");
      });
    } else {
      resolve(user);
    }
  });
}

function finishUserRegistration() {
  event.preventDefault();
  verifyUserRegistrationFields()
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

          const res = await fetch(`${URL_API_BASE}/user/PostFullUser`, requestOptions);
          const resData = await res.json();

          if (resData.success == true) {
            Swal.fire({
              icon: 'success',
              title: 'Sucesso',
              text: `${resData.message}`,
            }).then(() => {
              window.location.href = 'login.html';
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Erro no Cadastro',
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
    .catch((error) => { });
}

function validateName() {
  const name_user = $("#inputNome").val();

  const haveLetters = /[a-zA-Z]/.test(name_user);

  if (haveLetters && name_user.length > 3) {
    $("#inputNome").css("border-color", "green").css("box-shadow", "3px 3px 3px green");
    return true;
  } else {
    $("#inputNome").css("border-color", "red").css("box-shadow", "3px 3px 3px red");
    return false;
  }
}

function validateEmail() {
  const email_user = $("#inputEmail").val().trim();

  const regexEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

  if (regexEmail.test(email_user)) {
    $("#inputEmail").css("border-color", "green").css("box-shadow", "3px 3px 3px green");
    return true;
  } else {
    $("#inputEmail").css("border-color", "red").css("box-shadow", "3px 3px 3px red");
    return false;
  }
}

function validadeAllPassword() {
  const password_user = $("#inputSenha").val().trim();
  const password_confirm_user = $("#inputConfirmSenha").val().trim();

  const isValidPassword1 = validatePassword(password_user, "#inputSenha")
  const isValidPassword2 = validatePassword(password_confirm_user, "#inputConfirmSenha")

  return isValidPassword1 && isValidPassword2
}

function validatePassword(password_user, field_name) {
  const minLegth = 8;
  const haveSpecialCaracter = /[@#$%^&+=]/.test(password_user);
  const haveNumber = /[0-9]/.test(password_user);
  const haveletterUppercase = /[A-Z]/.test(password_user);
  const haveletterLowercase = /[a-z]/.test(password_user);

  if (
    password_user.length >= minLegth &&
    haveSpecialCaracter &&
    haveNumber &&
    haveletterUppercase &&
    haveletterLowercase
  ) {
    $(field_name).css("border-color", "green").css("box-shadow", "3px 3px 3px green");
    return true;
  } else {
    $(field_name).css("border-color", "red").css("box-shadow", "3px 3px 3px red");
    return false;
  }
}

function validadeAllUfInformations() {
  const uf = $("#inputUF").val();
  const name_institution = $("#inputInstituicao").val();
  
  const isValidUF = validateUF(uf, "#inputUF")
  const isValidInstitution = validateUF(name_institution, "#inputInstituicao")

  return isValidUF && isValidInstitution
}

function validateUF(uf_name, field_name) {
  const minLegth = 2;
  const haveSpecialCaracter = /[a-zA-Z]/.test(uf_name);

  if (
    uf_name.length >= minLegth &&
    haveSpecialCaracter
  ) {
    $(field_name).css("border-color", "green").css("box-shadow", "3px 3px 3px green");
    return true;
  } else {
    $(field_name).css("border-color", "red").css("box-shadow", "3px 3px 3px red");
    return false;
  }
}