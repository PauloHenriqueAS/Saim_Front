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

function processErosion() {
  const size = parseInt($("#inputMatriz").val(), 10);
  const iterations = parseInt($("#inputItera").val(), 10);

  if (size == null || size === "" || size == 0 || iterations == null || iterations === "" || iterations == 0 ) {
    Swal.fire({
      icon: "warning",
      title: "Alerta",
      text: "Preencha os filtros da erosão corretamente para prosseguir!",
      allowOutsideClick: false,
    });
  } else if (validateRulesErosion(size, iterations)) {
    Swal.fire({
      icon: "warning",
      title: "Valores inválidos",
      text: "Para executar a Erosão o valor deve ser ímpar a interação deve ser maior igual a 1 e valor recomendado entre 3 e 15!",
      allowOutsideClick: false,
    });
  } 
  
  const idImage = getQueryParam("idImage");
  const idSaved = getQueryParam("idSaved");

  if (idSaved === "True") {
    try {
      const base64 = getBase64FromImgTag();
      process_erosion(idImage, size, iterations, base64);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Erro",
        text: "Imagem não encontrada na tela.",
        allowOutsideClick: false,
      });
    }
  } else {
    process_erosion(idImage, size, iterations);
  }
}

async function process_erosion(idImage, size, iterations, base64) {
  jsLoading(true);

  try {
    let requestBody = {};
    if (idImage && idImage.trim() !== "" && Number(idImage) > 0) {
      requestBody = {
        id_image: idImage,
        kernel_size: size,
        num_iterations: iterations,
      };
    } else {
      requestBody = {
        kernel_size: size,
        num_iterations: iterations,
        image: base64,
      };
    }

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    };

    const response = await fetch(
      `${URL_API_BASE}/process/Erosion`,
      requestOptions
    );

    const resData = await response.json();
    if (resData.success) {
      jsLoading(false);
      Swal.fire({
        icon: "success",
        title: "Sucesso",
        text: "Erosão realizada com sucesso!",
      }).then(() => {
        updateImageProcessed(resData.data);
      });
    } else {
      jsLoading(false);
      Swal.fire({
        icon: "error",
        title: "Erro na Erosão",
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

function validateRulesErosion(size, iterations) {
  if (size <= 0 || !isOddNumber(size) || iterations <= 0) {
    return true;
  }
  return false;
}