$(document).ready(function () {
  const idImage = getQueryParam("idImage");
  if (idImage && idImage.trim() !== "" && idImage !== "null") {
    showImage(idImage);
  } else {
    const idSaved = getQueryParam("idSaved");
    if (idSaved != null && idSaved == "True") {
      showImageFromDB("processedImage");
    } else
      Swal.fire({
        icon: "warning",
        title: "Alerta",
        text: "Não foi possível carregar a imagem, selecione outra!",
        allowOutsideClick: false,
      });
  }
});

var img_processed = "";

function processSobelX() {
  const size = parseInt($("#inputKernel").val(), 10);

  if (size == null || size === "" || size == 0) {
    Swal.fire({
      icon: "warning",
      title: "Alerta",
      text: "Preencha os filtros do sobel X corretamente para prosseguir!",
      allowOutsideClick: false,
    });
  } else if (validateRulesSobelX(size)) {
    Swal.fire({
      icon: "warning",
      title: "Valor inválido",
      text: "Para executar o Sobel X o valor deve ser ímpar e entre 1 e 7!",
      allowOutsideClick: false,
    });
  }

  const idImage = getQueryParam("idImage");
  const idSaved = getQueryParam("idSaved");

  if (idSaved === "True") {
    try {
      const base64 = getBase64FromImgTag();
      process_sobelX(idImage, size, base64);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Erro",
        text: "Imagem não encontrada na tela.",
        allowOutsideClick: false,
      });
    }
  } else {
    process_sobelX(idImage, size);
  }
}

async function process_sobelX(idImage, size, base64) {
  jsLoading(true);

  try {
    let requestBody = {};
    if (idImage && idImage.trim() !== "" && Number(idImage) > 0) {
      requestBody = {
        id_image: idImage,
        kernel_size: size,
      };
    } else {
      requestBody = {
        kernel_size: size,
        image: base64,
      };
    }

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    };

    const response = await fetch(
      `${URL_API_BASE}/process/SobelX`,
      requestOptions
    );

    const resData = await response.json();
    if (resData.success) {
      jsLoading(false);
      Swal.fire({
        icon: "success",
        title: "Sucesso",
        text: "Sobel X realizada com sucesso!",
      }).then(() => {
        updateImageProcessed(resData.data);
      });
    } else {
      jsLoading(false);
      Swal.fire({
        icon: "error",
        title: "Erro na execução do Sobel X",
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

function validateRulesSobelX(size) {
  if (size <= 0 || !isOddNumber(size) || size > 7) return true;
  return false;
}