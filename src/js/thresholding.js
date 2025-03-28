$(document).ready(function () {
  const idImage = getQueryParam("idImage");
  showImage(idImage);
});

var img_processed = "";

function processThersholding() {
  const max = $("#inputMax").val();
  const min = $("#inputMin").val();
  console.log("max", max, "min", min);

  if (max == null || max === "" || min == null || min === "" || min > max) {
    Swal.fire({
      icon: "warning",
      title: "Alerta",
      text: "Preencha os filtros de limiarização corretamente para prosseguir!",
      allowOutsideClick: false,
    });
  } else if (validateRulesThresholding(min, max)) {
    Swal.fire({
      icon: "warning",
      title: "Valores inválidos",
      text: "Para executar o limiarização os valores devem estar entre 0 e 255!",
      allowOutsideClick: false,
    });
  } else {
    const idImage = getQueryParam("idImage");
    process_threshold(idImage, min, max);
  }
}

async function process_threshold(idImage, min, max) {
  jsLoading(true);

  try {
    console.log("ulr", `${URL_API_BASE}/process/Thresholding`);
    const requestBody = {
      id_image: idImage,
      val_min: min,
      val_max: max,
    };

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
