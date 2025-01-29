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
    if (blockAccessPage()) 
      window.location.href = "unauthorized.html";
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
    { text: "Afinamento", href: "#" },
    { text: "Dilatação", href: "#" },
    { text: "Erosão", href: "#" },
    { text: "Laplaciano", href: "#" },
    { text: "Limiar", href: "../pages/filtroLimiarizacao.html" },
    { text: "Média", href: "#" },
    { text: "Sobel X", href: "#" },
    { text: "Sobel Y", href: "#" },
    { text: "Sobel XY", href: "#" },
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
      .data("id", index + 1) 
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
