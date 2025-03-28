$(document).ready(function () {
  const idImage = getQueryParam("idImage");
  showImage(idImage);
});

var img_processed = "";

function processSobelXY() {
  const sizeX = $("#inputKernelX").val();
  const sizeY = $("#inputKernelY").val();

  if ((sizeX == null || sizeX === "" || sizeX == 0) ||
      (sizeY == null || sizeY === "" || sizeY == 0)) {
    Swal.fire({
      icon: "warning",
      title: "Alerta",
      text: "Preencha os filtros do sobel XY corretamente para prosseguir!",
      allowOutsideClick: false,
    });
  } else if(validateRulesSobelXY(sizeX, sizeY)){
    Swal.fire({
      icon: "warning",
      title: "Valores inválidos",
      text: "Para executar o Sobel XY o valor deve ser ímpar e entre 1 e 7!",
      allowOutsideClick: false,
    });
  }
  else{
    const idImage = getQueryParam("idImage");
    process_sobelXY(idImage, sizeX, sizeY);
  }
}

async function process_sobelXY(idImage, sizeX, sizeY) {
  jsLoading(true);

  try {
    console.log("ulr", `${URL_API_BASE}/process/SobelXY`);
    const requestBody = {
      id_image: idImage,
      kernel_size_X: sizeX,
      kernel_size_Y: sizeY,
    };

    console.log("requestr", requestBody);
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

    // Tratamento da resposta
    if (resData.success) {
      jsLoading(false);
      Swal.fire({
        icon: "success",
        title: "Sucesso",
        text: "Sobel XY realizada com sucesso!",
      }).then(() => {
        console.log("processado", resData.data);
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
  console.log(isOddNumber(size))
  if ((sizeX <= 0 || !isOddNumber(sizeX) || sizeX > 7) || 
      (sizeY <= 0 || !isOddNumber(sizeY) || sizeY > 7)) return true;
  return false;
}