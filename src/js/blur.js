$(document).ready(function () {
  const idImage = getQueryParam("idImage");
  showImage(idImage);
});

var img_processed = "";

function processBlur() {
  const size = $("#inputMatriz").val();

  if (size == null || size === "" || size == 0) {
    Swal.fire({
      icon: "warning",
      title: "Alerta",
      text: "Preencha os filtros da média corretamente para prosseguir!",
      allowOutsideClick: false,
    });
  } else if (validateRulesBlur(size)) {
    Swal.fire({
      icon: "warning",
      title: "Valor inválido",
      text: "Para executar a media o valor deve ser ímpar e recomendado entre 3 e 15!",
      allowOutsideClick: false,
    });
  } else {
    const idImage = getQueryParam("idImage");
    process_blur(idImage, size);
  }
}

async function process_blur(idImage, size) {
  jsLoading(true);

  try {
    console.log("ulr", `${URL_API_BASE}/process/Blur`);
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
      `${URL_API_BASE}/process/Blur`,
      requestOptions
    );

    const resData = await response.json();

    // Tratamento da resposta
    if (resData.success) {
      jsLoading(false);
      Swal.fire({
        icon: "success",
        title: "Sucesso",
        text: "Média realizada com sucesso!",
      }).then(() => {
        console.log("processado", resData.data);
        updateImageProcessed(resData.data);
      });
    } else {
      jsLoading(false);
      Swal.fire({
        icon: "error",
        title: "Erro na média",
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

function validateRulesBlur(size) {
  console.log(isOddNumber(size));
  if (size <= 0 || !isOddNumber(size)) return true;
  return false;
}
