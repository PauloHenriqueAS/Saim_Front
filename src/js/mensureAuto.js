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

function processMensureAuto() {
  const idImage = getQueryParam("idImage");
  const idSaved = getQueryParam("idSaved");

  if (idSaved === "True") {
    try {
      const base64 = getBase64FromImgTag();
      process_mensure_auto(idImage, base64);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Erro",
        text: "Imagem não encontrada na tela.",
        allowOutsideClick: false,
      });
    }
  } else {
    process_mensure_auto(idImage);
  }
}

async function process_mensure_auto(idImage, base64) {
  jsLoading(true);

  try {
    let requestBody = {};
    if (idImage && idImage.trim() !== "" && Number(idImage) > 0) {
      requestBody = {
        id_image: idImage,
      };
    } else {
      requestBody = {
        image: base64,
      };
    }

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    };

    const response = await fetch(
      `${URL_API_BASE}/process/MeasurementAuto`,
      requestOptions
    );

    const resData = await response.json();
    if (resData.success) {
      jsLoading(false);
      Swal.fire({
        icon: "success",
        title: "Sucesso",
        text: "Mensuração Automática realizado com sucesso!",
      }).then(() => {
        console.log(resData.data.image_processed)
        updateImageProcessed(resData.data.image_processed);
        renderRegionsTable(resData.data.regions)
      });
    } else {
      jsLoading(false);
      Swal.fire({
        icon: "error",
        title: "Erro no Mensuração Automática",
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

function renderRegionsTable(regions) {
  $('#idRegions').removeClass('d-none')
  console.log('reg', regions)
  const tbody = document.getElementById('regions-table-body');
  tbody.innerHTML = '';

  regions.forEach((region, index) => {
    const row = document.createElement('tr');
    row.className = "border-t";

    row.innerHTML = `
      <td class="px-4 py-2">${region.label}</td>
      <td class="px-4 py-2">${region.area_pixels}</td>
    `;

    tbody.appendChild(row);
  });
}
