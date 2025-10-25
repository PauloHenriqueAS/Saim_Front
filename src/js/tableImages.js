let selectedId = null;

$(document).ready(function () {
  //GetIdPageFromURL();
  renderDatasDataTable();

  const id = getQueryParam("idFilter");
checkImageInDB()
  // Exemplo de uso: Exibir no console
  console.log("ID recebido:", id);

});

// function getQueryParam(param) {
//   const urlParams = new URLSearchParams(window.location.search);
//   return urlParams.get(param);
// }

async function renderDatasDataTable() {
  const personId = sessionStorage.getItem("personId");
  console.log(personId, "id da pessoa");
  const dataImages = await getImagesDataByPerson(personId);
  console.log("data images", dataImages);
  if (
    dataImages.length === 0 ||
    dataImages === undefined ||
    dataImages === null
  ) {
    Swal.fire({
      icon: "info",
      title: "Nenhuma imagem encontrada.",
      text: "Deseja adicionar uma nova imagem?",
      allowOutsideClick: true,
      showCancelButton: true,
      confirmButtonText: "Adicionar Imagem",
      confirmButtonColor: "#007BFF",
      cancelButtonText: "Cancelar",
      cancelButtonColor: "#6A0DAD",
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = `arquivos.html`;
      }
    });
  }
  fillImageDataTable(dataImages);
}

function verifyExistIndexDb() {}

async function showDetails(idImage) {
  const dataRequest = await getImageByIdImage(idImage);
  const dataImage = dataRequest.data;
  Swal.fire({
    title: `${dataImage.name_image}`,
    html: `<img alt="${dataImage.name_image}" width="100%" height="auto" src='data:image/jpeg;base64,${dataImage.image}'>`,
    showCloseButton: true,
    showCloseButton: false,
    allowOutsideClick: false,
  });
}

function getImagesColumns() {
  return [
    {
      data: "id_image",
      title: " ",
      className: "text-center",
      render: (data, row) => {
        return `<button style="border: none; background: none" onclick="showDetails('${data}')" ><i class="icon ion-eye" style="font-size: 24px; display: block; margin: 0 auto; border: none; background: none"></i></button>`;
      },
    },
    {
      data: "id_image",
      title: "Número de Identificação",
      className: "text-center",
      render: (data) => {
        if (data === null || data === undefined || data === "") return "-";
        else return `${data}`;
      },
      width: "20%",
    },
    {
      data: "name_image",
      title: "Nome da Imagem",
      className: "text-center",
      render: (data) => {
        if (data === null || data === undefined || data === "")
          return "Não encontrado!";
        else return `${data}`;
      },
    },
    {
      data: "date_image",
      title: "Data da Upload",
      className: "text-center",
      render: (data) => {
        if (data === null || data === undefined || data === "") return "-";
        else {
          const [year, month, day] = data.split("-");
          return `${day}/${month}/${year}`;
        }
      },
    },
    {
      data: "id_image",
      title: "Excluir",
      className: "text-center",
      render: (data, row) => {
        return `<button style="border: none; background: none" onclick="deleteImage('${data}')" ><i class="fa fa-trash" style="font-size: 24px; display: block; margin: 0 auto; border: none; background: none"></i></button>`;
      },
    },
  ];
}

function fillImageDataTable(dataImages) {
  $("#imagesDataTable").DataTable({
    dom: '<"table-top d-flex justify-content-between align-items-end mb-3"f>rt<"table-bottom d-flex justify-content-between align-items-center mt-3"l<"pagination-container"p>>',
    scrollX: true,
    responsive: true,
    buttons: [
      {
        extend: "excel",
        text: '<img class="excel-icon">',
        titleAttr: "Exportar para excel",
      },
    ],
    language: {
      url: "https://cdn.datatables.net/plug-ins/1.11.5/i18n/pt-BR.json",
      search: "",
      searchPlaceholder: "Buscar",
      lengthMenu: "Mostrar _MENU_ resultados",
      zeroRecords: "Nenhum Resultado encontrado!",
      info: "Página _PAGE_ de _PAGES_",
      infoEmpty: "Nenhum dado válido",
      infoFiltered: "(Filtrado de _MAX_ resultados)",
      paginate: {
        previous: "Anterior",
        next: "Próximo",
      },
    },
    initComplete: function () {
      let searchInput = $("#imagesDataTable_filter input");

      // Estilizando a pesquisa
      searchInput.attr("placeholder", "Buscar...");
      searchInput.css({
        "border-radius": "5px",
        padding: "5px 10px",
        border: "1px solid #ccc",
      });

      // Adicionando espaçamento entre a pesquisa e o cabeçalho
      $("#imagesDataTable_filter").css({
        "margin-bottom": "10px",
      });

      // Adicionando espaçamento entre a tabela e o seletor "Mostrar X resultados"
      $("#imagesDataTable_length").css({
        "margin-top": "20px",
      });
    },
    data: dataImages,
    columns: getImagesColumns(),
    createdRow(row, data) {
      $(row).click(function (evt) {
        evt.preventDefault();
        evt.stopPropagation();

        selectedId = data.id_image;
        $("tr").css("background-color", "");
        $(this).css("background-color", "#66CDAA");
      });

      $(row).hover(
        function () {
          $(this).css("transform", "scale(1.008)");
          $(this).css("cursor", "pointer");
        },
        function () {
          $(this).css("transform", "scale(1)");
        }
      );
    },
    columnDefs: [
      {
        defaultContent: "-",
        targets: "_all",
      },
    ],
  });
}

async function getImagesDataByPerson(personId) {
  try {
    jsLoading(true);
    const apiUrl = `${URL_API_BASE}/image/GetImageByPerson?id_pessoa=${personId}`;
    const res = await fetch(apiUrl);
    if (res.ok) {
      const returnApi = await res.json();
      jsLoading(false);
      return returnApi.data;
    } else {
      jsLoading(false);
      Swal.fire({
        icon: "error",
        title: "Erro ao buscar imagens salvas.",
        text: `${returnApi.message}`,
        allowOutsideClick: false,
      });
    }
  } catch (error) {
    jsLoading(false);
    Swal.fire({
      icon: "error",
      title: "Erro",
      text: `Erro ao buscar imagens salvas!`,
      allowOutsideClick: false,
    });
  }
}

async function deleteImage(imageId) {
  try {
    jsLoading(true);
    const personId = sessionStorage.getItem("personId");
    const apiUrl = `${URL_API_BASE}/image/DeleteImage?id_image=${imageId}&id_person=${personId}`;
    const res = await fetch(apiUrl, {
      method: "DELETE",
    });

    if (res.ok) {
      const returnApi = await res.json();
      jsLoading(false);

      Swal.fire({
        icon: "success",
        title: "Exclusão realizada com sucesso!",
        allowOutsideClick: false,
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.reload();
        }
      });
    } else {
      jsLoading(false);
      Swal.fire({
        icon: "error",
        title: "Erro ao excluir a imagem selecionada.",
        text: `${returnApi.message}`,
        allowOutsideClick: false,
      });
    }
  } catch (error) {
    jsLoading(false);
    Swal.fire({
      icon: "error",
      title: "Erro",
      text: `Erro ao excluir imagem!`,
      allowOutsideClick: false,
    });
  }
}

async function getImageByIdImage(idImage) {
  try {
    jsLoading(true);
    const apiUrl = `${URL_API_BASE}/image/GetImageByCode?id_image=${idImage}`;
    const res = await fetch(apiUrl);
    if (res.ok) {
      const returnApi = res.json().catch();
      jsLoading(false);
      return returnApi;
    } else {
      jsLoading(false);
      Swal.fire({
        icon: "error",
        title: "Erro ao buscar detalhes das imagens.",
        text: `${returnApi.message}`,
        allowOutsideClick: false,
      });
    }
  } catch (error) {
    jsLoading(false);
    Swal.fire({
      icon: "error",
      title: "Erro",
      text: `Erro ao buscar detalhes das imagens.`,
      allowOutsideClick: false,
    });
  }
}

function redirectFilterPage() {
  const idDest = getQueryParam("idFilter");
  console.log("pagina Filtro selecionado:", idDest);
  const pageName = PageFilterEnum[idDest];
  console.log("pagina :", pageName);
  const urlDestino = `${pageName}?idImage=${selectedId}`;

  window.location.href = urlDestino;
}

function redirectWithImgSaved() {
  const idDest = getQueryParam("idFilter");
  const pageName = PageFilterEnum[idDest];
  const urlDestino = `${pageName}?idImage=null&idSaved=True`;

  window.location.href = urlDestino;
}

async function checkImageInDB() {
  const request = indexedDB.open("ImageDB", 1);

  request.onsuccess = function (event) {
    const db = event.target.result;
    const tx = db.transaction("images", "readonly");
    const store = tx.objectStore("images");
    const getAllRequest = store.getAll();

    getAllRequest.onsuccess = function (event) {
      const result = event.target.result;

      console.log("resultado ", result)
      if (result.length > 0) {
        // Existem imagens → habilitar e exibir o botão
        $("#btnContinueWithSave").removeClass("d-none");
      }

      db.close();
    };

    getAllRequest.onerror = function (event) {
      console.error("Erro ao acessar o IndexedDB:", event.target.error);
      db.close();
    };
  };

  request.onerror = function (event) {
    console.error("Erro ao abrir o IndexedDB:", event.target.error);
  };
}
