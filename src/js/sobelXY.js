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

function processSobelXY() {
  const sizeX = parseInt($("#inputKernelX").val(), 10);
  const sizeY = parseInt($("#inputKernelY").val(), 10);

  if (sizeX == null || sizeX === "" || sizeX == 0 || sizeY == null || sizeY === "" || sizeY == 0 ) {
    Swal.fire({
      icon: "warning",
      title: "Alerta",
      text: "Preencha os filtros do sobel XY corretamente para prosseguir!",
      allowOutsideClick: false,
    });
  } else if (validateRulesSobelXY(sizeX, sizeY)) {
    Swal.fire({
      icon: "warning",
      title: "Valores inválidos",
      text: "Para executar o Sobel XY o valor deve ser ímpar e entre 1 e 7!",
      allowOutsideClick: false,
    });
  } 
  
  const idImage = getQueryParam("idImage");
  const idSaved = getQueryParam("idSaved");

  if (idSaved === "True") {
    try {
      const base64 = getBase64FromImgTag();
      process_sobelXY(idImage, sizeX, sizeY, base64);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Erro",
        text: "Imagem não encontrada na tela.",
        allowOutsideClick: false,
      });
    }
  } else {
    process_sobelXY(idImage, sizeX, sizeY);
  }
}

async function process_sobelXY(idImage, sizeX, sizeY, base64) {
  jsLoading(true);

  try {
    let requestBody = {};
    if (idImage && idImage.trim() !== "" && Number(idImage) > 0) {
      requestBody = {
        id_image: idImage,
        kernel_size_X: sizeX,
        kernel_size_Y: sizeY,
      };
    } else {
      requestBody = {
        kernel_size_X: sizeX,
        kernel_size_Y: sizeY,
        image: base64,
      };
    }

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    };

    const response = await fetch(
      `${URL_API_BASE}/process/SobelXY`,
      requestOptions
    );

    const resData = await response.json();
    if (resData.success) {
      jsLoading(false);
      Swal.fire({
        icon: "success",
        title: "Sucesso",
        text: "Sobel XY realizada com sucesso!",
      }).then(() => {
        updateImageProcessed(resData.data);
      });
    } else {
      jsLoading(false);
      Swal.fire({
        icon: "error",
        title: "Erro na execução do Sobel XY",
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

function validateRulesSobelXY(sizeX, sizeY) {
  if (sizeX <= 0 || !isOddNumber(sizeX) || sizeX > 7 || sizeY <= 0 || !isOddNumber(sizeY) || sizeY > 7)
    return true;
  return false;
}