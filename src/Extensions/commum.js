$(document).ready(function () {
  const isAuthenticated = verifyIsAuthenticated();
  console.log("isAuthenticated.js", isAuthenticated);

  if (isAuthenticated) {
    $("#btnLoginPortal").addClass("d-none");
    $("#btnLogout").removeClass("d-none");

    $("#uploadFilesItem").removeClass("d-none");
    $("#dropFiltrosGerais").removeClass("d-none");
    $("#dropFiltrosMadeira").removeClass("d-none");

    generateFiltersProcess();
    generateFiltersWood();
  } else {
    if (blockAccessPage()) window.location.href = "unauthorized.html";
  }

  $("#btnLogout").on("click", function (event) {
    event.preventDefault();
    LogoffSystem();
  });
});

function verifyIsAuthenticated() {
  return sessionStorage.getItem("isAuthenticated");
}

function jsLoading(isOpen) {
  if (isOpen) {
    $("#loaderDiv").removeClass("d-none");
    $("#loaderDiv").fadeIn();
  } else {
    $("#loaderDiv").addClass("d-none");
    $("#loaderDiv").fadeOut();
  }
}

function LogoffSystem() {
  sessionStorage.clear();
  localStorage.clear();

  $("#btnLoginPortal").removeClass("d-none");
  $("#btnLogout").addClass("d-none");

  window.location.href = "index.html";
}

//local storage
//infos = nome usuario, tipo de usuario,  flag autenticado
function recordStorageUser(dataLogin) {
  //salvar no storage do navegador o jwt da api -> adicionar autenticação nos
  const userInfo = new localStorage();
  console.log("data de infos = ", userInfo, "infos recebidas = ", dataLogin);
  userInfo.setItem(dataLogin);
}

function generateFiltersProcess() {
  const dropdownItems = [
    { text: "Afinamento", href: "../pages/filtroAfinamento.html" },
    { text: "Dilatação", href: "../pages/filtroDilatacao.html" },
    { text: "Erosão", href: "../pages/filtroErosao.html" },
    { text: "Laplaciano", href: "../pages/filtroLaplaciano" },
    { text: "Limiar", href: "../pages/filtroLimiarizacao.html" },
    { text: "Média", href: "../pages/filtroMedia.html" },
    { text: "Sobel X", href: "../pages/filtroSobelX.html" },
    { text: "Sobel Y", href: "../pages/filtroSobelY.html" },
    { text: "Sobel XY", href: "../pages/filtroSobelXY.html" },
  ];

  const $dropdownContainer = $("#dropdownContainerFiltros");

  dropdownItems.forEach((item, index) => {
    $("<a>")
      .addClass("dropdown-item")
      .attr("href", item.href)
      .text(item.text)
      .data("id", index + 1)
      .on("click", function (e) {
        e.preventDefault();
        const id = $(this).data("id");
        redirecionaTela(id);
      })
      .appendTo($dropdownContainer);
  });
}

function generateFiltersWood() {
  const dropdownItems = [
    { text: "Mensuração", href: "#" },
    { text: "Gráfico", href: "#" },
    { text: "Ajustes Finos", href: "#" },
  ];

  const $dropdownContainer = $("#dropdownContainerWood");
  dropdownItems.forEach((item, index) => {
    $("<a>")
      .addClass("dropdown-item")
      .attr("href", item.href)
      .text(item.text)
      .data("id", index + 10)
      .on("click", function (e) {
        e.preventDefault();
        const id = $(this).data("id");
        redirecionaTela(id);
      })
      .appendTo($dropdownContainer);
  });
}

function redirecionaTela(id) {
  console.log("Filtro selecionado:", id);
  const urlDestino = `selecaoImagens.html?idFilter=${id}`;
  window.location.href = urlDestino;
}

function blockAccessPage() {
  var page = window.location.pathname.split("/").pop();

  if (!Object.values(PageAuthFreeEnum).includes(page)) {
    console.log(`A página "${page}" não pode ser acessada sem login.`);
    return true;
  } else return false;
}

function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

function backPage() {
  window.history.back();
}

// Remove 'async' e use promessa (then/catch) após a chamada da função de busca
function showImage(idImage) {
  getImageByIdImagePRC(idImage)
    .then((data) => {
      console.log("Retorno da API:", data);
      // A API deve retornar algo como { image: "..." } (sua base64)
      if (data && data.image) {
        // Ajuste o 'src' do <img> com base64
        document.getElementById(
          "imgProcess"
        ).src = `data:image/jpeg;base64,${data.image}`;
      } else {
        console.error("Não foi possível carregar a imagem Base64.");
      }
    })
    .catch((error) => {
      console.error("Erro ao mostrar a imagem:", error);
    });
}

// Também tire o 'async' daqui e use então/catch
function getImageByIdImagePRC(idImage) {
  jsLoading(true);
  const apiUrl = `${URL_API_BASE}/image/GetImageByCode?id_image=${idImage}`;
  return fetch(apiUrl)
    .then((res) => {
      if (!res.ok) {
        // Se não foi possível obter 200 OK
        jsLoading(false);
        Swal.fire({
          icon: "error",
          title: "Erro ao buscar detalhes das imagens.",
          text: "A chamada ao servidor retornou erro.",
          allowOutsideClick: false,
        });
        throw new Error("Erro de rede ou servidor.");
      }
      return res.json(); // Retorna a promessa do JSON
    })
    .then((returnApi) => {
      jsLoading(false);
      return returnApi.data; // Aqui você tem o objeto final, ex.: { image: "...", ... }
    })
    .catch((error) => {
      jsLoading(false);
      Swal.fire({
        icon: "error",
        title: "Erro",
        text: "Erro ao buscar detalhes das imagens.",
        allowOutsideClick: false,
      });
      throw error; // para que showImage() também capture o erro
    });
}

function updateImageProcessed(dataProcessed) {
  img_processed = dataProcessed;
  $("#btnDownload").removeClass("d-none");

  if (dataProcessed != null && dataProcessed !== "") {
    // Ajuste o 'src' do <img> com base64
    document.getElementById(
      "imgProcess"
    ).src = `data:image/png;base64,${dataProcessed}`;
  }
}

function downloadImageProcessed(nameImage) {
  if (!img_processed || img_processed.trim() === "") {
    Swal.fire({
      icon: "error",
      title: "Erro",
      text: "Erro ao obter imagem para download!",
      allowOutsideClick: false,
    });
    return;
  }

  // Adicionar o prefixo "data:image/png;base64," se não estiver presente
  let base64Data = img_processed;
  if (!img_processed.startsWith("data:image")) {
    base64Data = "data:image/png;base64," + img_processed;
  }

  // Criar um Blob a partir do Base64
  let byteCharacters = atob(base64Data.split(",")[1]); // Decodifica Base64
  let byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  let byteArray = new Uint8Array(byteNumbers);
  let blob = new Blob([byteArray], { type: "image/png" });

  // Criar URL para download
  let link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${nameImage}.png`; // Sempre salva como PNG
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Revogar o objeto URL após o download
  URL.revokeObjectURL(link.href);
}

function isOddNumber(number) {
  number = Number(number);
  if (isNaN(number)) {
      return false;
  }
  return number % 2 !== 0; // Retorna true se for ímpar, false se for par
}