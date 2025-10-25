async function readUploadFiles() {
  var inputElement = $("#dragImagem")[0];
  const personId = sessionStorage.getItem("personId");

  if (inputElement.files.length > 0) {
    try {
      // Validar tipo de arquivo
      const file = inputElement.files[0];
      if (!file.type.startsWith('image/')) {
        Swal.fire({
          icon: "error",
          title: "Arquivo inválido",
          text: "Por favor, selecione apenas arquivos de imagem.",
          confirmButtonColor: "#007BFF",
        });
        return;
      }

      // Validar tamanho do arquivo (limite de 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        Swal.fire({
          icon: "error",
          title: "Arquivo muito grande",
          text: "O arquivo não pode ter mais de 10MB.",
          confirmButtonColor: "#007BFF",
        });
        return;
      }

      var dataBase64 = await getBase64FromImage(inputElement);
      
      // Extrair nome do arquivo sem extensão
      var nameFile = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
      
      // Extrair extensão do nome do arquivo
      var extension = file.name.substring(file.name.lastIndexOf('.') + 1) || 'jpg';
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
          uploadImageBase64(dataBase64, personId, nameFile, extension);
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
  return formattedDate;
}

async function uploadImageBase64(base64Data, personId, nameFile, extension) {
  jsLoading(true);
  const today = new Date().toISOString().split('T')[0]; // Data no formato YYYY-MM-DD

  try {
    const requestBody = {
      date_image: today,
      name_image: nameFile,
      id_pessoa: personId,
      image: base64Data,
      extension_image: extension,
    };

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    };

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
