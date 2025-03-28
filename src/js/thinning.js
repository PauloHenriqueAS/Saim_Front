$(document).ready(function () {
  const idImage = getQueryParam("idImage");
  showImage(idImage);
});

var img_processed = "";

function processThinning() {
  const idImage = getQueryParam("idImage");
  process_thinning(idImage);
}

async function process_thinning(idImage) {
  jsLoading(true);

  try {
    console.log("ulr", `${URL_API_BASE}/process/Thinning`);
    const requestBody = {
      id_image: idImage
    };

    console.log("requestr", requestBody);
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    };

    const response = await fetch(
      `${URL_API_BASE}/process/Thinning`,
      requestOptions
    );

    const resData = await response.json();

    // Tratamento da resposta
    if (resData.success) {
      jsLoading(false);
      Swal.fire({
        icon: "success",
        title: "Sucesso",
        text: "Afinamento realizado com sucesso!",
      }).then(() => {
        console.log("processado", resData.data);
        updateImageProcessed(resData.data);
      });
    } else {
      jsLoading(false);
      Swal.fire({
        icon: "error",
        title: "Erro no afinamento",
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