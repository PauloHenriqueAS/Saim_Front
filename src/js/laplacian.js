$(document).ready(function () {
  const idImage = getQueryParam("idImage");
  showImage(idImage);
});

var img_processed = "";

function processLaplacian() {
  const size = $("#inputKernel").val();

  if (size == null || size === "" || size == 0) {
    Swal.fire({
      icon: "warning",
      title: "Alerta",
      text: "Preencha os filtros de laplaciano corretamente para prosseguir!",
      allowOutsideClick: false,
    });
  } else if (validateRulesLaplacian(size)) {
    Swal.fire({
      icon: "warning",
      title: "Valor inválido",
      text: "Para executar o laplaciano o valor deve ser ímpar e entre 1 e 7!",
      allowOutsideClick: false,
    });
  } else {
    const idImage = getQueryParam("idImage");
    process_laplacian(idImage, size);
  }
}

async function process_laplacian(idImage, size) {
  jsLoading(true);

  try {
    console.log("ulr", `${URL_API_BASE}/process/Laplacian`);
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
      `${URL_API_BASE}/process/Laplacian`,
      requestOptions
    );

    const resData = await response.json();

    // Tratamento da resposta
    if (resData.success) {
      jsLoading(false);
      Swal.fire({
        icon: "success",
        title: "Sucesso",
        text: "Laplaciano realizada com sucesso!",
      }).then(() => {
        console.log("processado", resData.data);
        updateImageProcessed(resData.data);
      });
    } else {
      jsLoading(false);
      Swal.fire({
        icon: "error",
        title: "Erro na execução do laplaciano.",
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

function validateRulesLaplacian(size) {
  console.log(isOddNumber(size))
  if (size <= 0 || !isOddNumber(size) || size > 7) return true;
  return false;
}
