$(document).ready(function () {
    const isAuthenticated = verifyIsAuthenticated();
    console.log("isAuthenticated.js", isAuthenticated);
    if (isAuthenticated) {
    $("#btnLoginPortal").addClass("d-none");
    $("#btnLogout").removeClass("d-none");

    //exibição dos filtros do portal
    $("#uploadFilesItem").removeClass("d-none");
    $("#dropFiltrosGerais").removeClass("d-none");
    $("#dropFiltrosMadeira").removeClass("d-none");

    generateFiltersProcess();
    generateFiltersWood();
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
  // Lista de itens para o dropdown
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
      .addClass("dropdown-item") // Adiciona a classe do Bootstrap
      .attr("href", item.href) // Define o atributo href
      .text(item.text) // Define o texto do item
      .data("id", index + 1) // Adiciona o número do filtro começando por 1
      .on("click", function (e) {
        e.preventDefault(); // Evita o comportamento padrão do link
        const id = $(this).data("id"); // Obtém o número do filtro
        redirecionaTela(id); // Chama a função com o número do filtro
      })
      .appendTo($dropdownContainer); // Adiciona ao contêiner
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
      .addClass("dropdown-item") // Adiciona a classe do Bootstrap
      .attr("href", item.href) // Define o atributo href
      .text(item.text) // Define o texto do item
      .data("id", index + 1) // Adiciona o número do filtro começando por 1
      .on("click", function (e) {
        e.preventDefault(); // Evita o comportamento padrão do link
        const id = $(this).data("id"); // Obtém o número do filtro
        redirecionaTela(id); // Chama a função com o número do filtro
      })
      .appendTo($dropdownContainer); // Adiciona ao contêiner
  });
}

function redirecionaTela(id) {
    console.log("Filtro selecionado:", id);
    const urlDestino = `selecaoImagens.html?idFilter=${id}`; // Define a URL com o parâmetro id
    window.location.href = urlDestino; 
  // Aqui você pode adicionar a lógica desejada, como redirecionar ou manipular algo
}
