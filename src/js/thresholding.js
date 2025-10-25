$(document).ready(function () {
  const idImage = getQueryParam("idImage");
  console.log("idImage", idImage);
  if (idImage && idImage.trim() !== "" && idImage !== "null") {
    showImage(idImage);
  } else {
    const idSaved = getQueryParam("idSaved");
    console.log("info poso");
    if (idSaved != null && idSaved == "True") {
      console.log("info positica");
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

function processThersholding() {
  const max = parseInt($("#inputMax").val(), 10);
  const min = parseInt($("#inputMin").val(), 10);

  if (isNaN(max) || isNaN(min) || min > max) {
    Swal.fire({
      icon: "warning",
      title: "Alerta",
      text: "Preencha os filtros de limiarização corretamente para prosseguir!",
      allowOutsideClick: false,
    });
    return;
  }
  if (validateRulesThresholding(min, max)) {
    Swal.fire({
      icon: "warning",
      title: "Valores inválidos",
      text: "Para executar a limiarização, os valores devem estar entre 0 e 255!",
      allowOutsideClick: false,
    });
    return;
  }

  const idImage = getQueryParam("idImage");
  const idSaved = getQueryParam("idSaved");

  if (idSaved === "True") {
    try {
      const base64 = getBase64FromImgTag();
      process_threshold(idImage, min, max, base64);
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Erro",
        text: "Imagem não encontrada na tela.",
        allowOutsideClick: false,
      });
    }
  } else {
    process_threshold(idImage, min, max);
  }
}

async function process_threshold(idImage, min, max, base64) {
  jsLoading(true);

  try {
    console.log("ulr", `${URL_API_BASE}/process/Thresholding`);
    let requestBody = {};
    if (idImage && idImage.trim() !== "" && Number(idImage) > 0) {
       requestBody = {
        id_image: idImage,
        val_min: min,
        val_max: max,
      };
    } else {
       requestBody = {
        val_min: min,
        val_max: max,
        image: base64,
      };
    }

    console.log("requestr", requestBody);
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    };

    const response = await fetch(
      `${URL_API_BASE}/process/Thresholding`,
      requestOptions
    );

    const resData = await response.json();

    // Tratamento da resposta
    if (resData.success) {
      jsLoading(false);
      Swal.fire({
        icon: "success",
        title: "Sucesso",
        text: "Limiarização realizada com sucesso!",
      }).then(() => {
        console.log("processado", resData.data);
        updateImageProcessed(resData.data);
      });
    } else {
      jsLoading(false);
      Swal.fire({
        icon: "error",
        title: "Erro na limiarização",
        text: resData.detail,
        allowOutsideClick: false,
      });
    }
  } catch (error) {
    console.log('errorerror', error)
    jsLoading(false);
    Swal.fire({
      icon: "error",
      title: "Erro",
      text: "Ocorreu um erro no envio da imagem!",
      allowOutsideClick: false,
    });
  }
}

function validateRulesThresholding(val_min, val_max) {
  if (val_min < 0 || val_min > 255 || val_max < 0 || val_max > 255) return true;
  return false;
}
