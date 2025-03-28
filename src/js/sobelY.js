$(document).ready(function () {
  const idImage = getQueryParam("idImage");
  showImage(idImage);
});

var img_processed = "";

function processSobelY() {
  const size = $("#inputKernel").val();

  if (size == null || size === "" || size == 0) {
    Swal.fire({
      icon: "warning",
      title: "Alerta",
      text: "Preencha os filtros do sobel Y corretamente para prosseguir!",
      allowOutsideClick: false,
    });
  } else if (validateRulesSobelY(size)) {
    Swal.fire({
      icon: "warning",
      title: "Valor inválido",
      text: "Para executar o Sobel X o valor deve ser ímpar e entre 1 e 7!",
      allowOutsideClick: false,
    });
  } else {
    const idImage = getQueryParam("idImage");
    process_sobelY(idImage, size);
  }
}

async function process_sobelY(idImage, size) {
  jsLoading(true);

  try {
    console.log("ulr", `${URL_API_BASE}/process/SobelY`);
    const requestBody = {
      id_image: idImage,
      kernel_size: size,
    };

    console.log("requestr", requestBody);
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    };

    const response = await fetch(
      `${URL_API_BASE}/process/SobelY`,
      requestOptions
    );

    const resData = await response.json();

    // Tratamento da resposta
    if (resData.success) {
      jsLoading(false);
      Swal.fire({
        icon: "success",
        title: "Sucesso",
        text: "Sobel Y realizada com sucesso!",
      }).then(() => {
        console.log("processado", resData.data);
        updateImageProcessed(resData.data);
      });
    } else {
      jsLoading(false);
      Swal.fire({
        icon: "error",
        title: "Erro na execução do Sobel Y",
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

function validateRulesSobelY(size) {
  console.log(isOddNumber(size));
  if (size <= 0 || !isOddNumber(size) || size > 7) return true;
  return false;
}
