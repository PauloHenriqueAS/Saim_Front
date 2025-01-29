async function readUploadFiles() {
  var inputElement = $("#dragImagem")[0];
  const personId = sessionStorage.getItem("personId");

  if (inputElement.files.length > 0) {
    try {
      var dataBase64 = await getBase64FromImage(inputElement);
      var nameFile = inputElement.files[0].name;

      Swal.fire({
        title: "Deseja fazer o upload da imagem?",
        showCancelButton: false,
        confirmButtonText: "Confirmar",
        confirmButtonColor: "#007BFF",
        showDenyButton: true,
        denyButtonText: `Cancelar`,
        denyButtonColor: "#6A0DAD",
        allowOutsideClick: false,
      }).then((result) => {
        if (result.isConfirmed) {
          console.log("dataBase64", dataBase64);
          uploadImageBase64(dataBase64, personId, nameFile);
        } else if (result.isDenied) {
          cleanUpload();
        }
      });
    } catch (error) {
      console.error("Erro ao converter a imagem:", error);
      Swal.fire({
        icon: "error",
        title: "Erro ao processar a imagem.",
        text: "Tente novamente.",
        confirmButtonColor: "#007BFF",
      });
    }
  } else {
    Swal.fire({
      icon: "warning",
      title: "Selecione um arquivo antes.",
      allowOutsideClick: false,
      confirmButtonColor: "#007BFF",
    });
  }
}

function getBase64FromImage(inputElement) {
  return new Promise((resolve, reject) => {
    var selectedImage = inputElement.files[0];

    if (selectedImage) {
      var reader = new FileReader();
      reader.onload = function (e) {
        var base64Data = e.target.result.split(",")[1]; // Remove o cabeçalho 'data:image/jpeg;base64,'
        resolve(base64Data);
      };
      reader.onerror = function (error) {
        reject(error);
      };
      reader.readAsDataURL(selectedImage);
    } else {
      reject("Nenhuma imagem selecionada");
    }
  });
}

function cleanUpload() {
  $("#dragImagem").val("");
}

function formatDateBr() {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0"); // Meses começam do 0
  const year = today.getFullYear();

  const formattedDate = `${day}-${month}-${year}`;
  console.log("data", formattedDate);
  return formattedDate;
}

async function uploadImageBase64(base64Data, personId, nameFile) {
  jsLoading(true);
  console.log("id", personId);
  console.log("element", nameFile);
  const today = new Date().toISOString().split('T')[0]; // Data no formato YYYY-MM-DD

  try {
    console.log("ulr", `${URL_API_BASE}/image/PostImage`);
    const requestBody = {
      date_image: today,
      name_image: nameFile,
      id_pessoa: personId,
      image: base64Data,
    };

    console.log("requestr", requestBody);
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    };
    console.log("options", requestOptions);

    console.log("Início do envio de request");

    const response = await fetch(
      `${URL_API_BASE}/image/PostImage`,
      requestOptions
    );

    const resData = await response.json();

    jsLoading(false);

    // Tratamento da resposta
    if (resData.success) {
      Swal.fire({
        icon: "success",
        title: "Sucesso",
        text: "Imagem enviada com sucesso!",
      }).then(() => {
        cleanUpload();
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Erro no Upload",
        text: resData.detail,
        allowOutsideClick: false,
      });
    }
  } catch (error) {
    jsLoading(false);
    Swal.fire({
      icon: "error",
      title: "Erro",
      text: "Ocorreu um erro no envio da imagem!",
      allowOutsideClick: false,
    });
  }
}
