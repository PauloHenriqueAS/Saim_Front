$(document).ready(function () {
  const idImage = getQueryParam("idImage");
  showImage(idImage);
});

var img_processed = "";

function processDilate() {
  const size = $("#inputMatriz").val();
  const iterations = $("#inputItera").val();

  if ((size == null || size === "" || size == 0) || 
      (iterations == null || iterations === "" || iterations == 0)) {
    Swal.fire({
      icon: "warning",
      title: "Alerta",
      text: "Preencha os filtros da dilatação corretamente para prosseguir!",
      allowOutsideClick: false,
    });
  } else if(validateRulesDilate(size, iterations)){
    Swal.fire({
      icon: "warning",
      title: "Valores inválidos",
      text: "Para executar a dilatação o valor deve ser ímpar a interação deve ser maior igual a 1 e valor recomendado entre 3 e 15!",
      allowOutsideClick: false,
    });
  }else{
    const idImage = getQueryParam("idImage");
    process_dilate(idImage, size, iterations);
  }
}

async function process_dilate(idImage, size, iterations) {
  jsLoading(true);

  try {
    console.log("ulr", `${URL_API_BASE}/process/Dilate`);
    const requestBody = {
      id_image: idImage,
      kernel_size: size,
      num_iterations: iterations
    };

    console.log("requestr", requestBody);
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    };

    const response = await fetch(
      `${URL_API_BASE}/process/Dilate`,
      requestOptions
    );

    const resData = await response.json();

    // Tratamento da resposta
    if (resData.success) {
      jsLoading(false);
      Swal.fire({
        icon: "success",
        title: "Sucesso",
        text: "Dilatação realizada com sucesso!",
      }).then(() => {
        console.log("processado", resData.data);
        updateImageProcessed(resData.data);
      });
    } else {
      jsLoading(false);
      Swal.fire({
        icon: "error",
        title: "Erro na dilatação",
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

function validateRulesDilate(size, iterations) {
  console.log(isOddNumber(size));
  if (size <= 0 || !isOddNumber(size) || iterations <= 0 ) return true;
  return false;
}