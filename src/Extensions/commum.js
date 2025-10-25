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
    generateFiltersWoodMensure();
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
  indexedDB.deleteDatabase("ImageDB");
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
    { text: "Mensuração", href: "#", hasSubmenu: true },
    { text: "Gráfico", href: "#", id: 12 },
    { text: "Ajustes Finos", href: "#", id: 13 },
  ];

  const $dropdownContainer = $("#dropdownContainerWood");
  $dropdownContainer.empty();

  dropdownItems.forEach((item, index) => {
     const $link = $("<a>")
    .addClass("dropdown-item")
    .attr("href", "#")
    .html('<span style="font-size: 14px; margin-right: 6px;">&#9666;</span>' + item.text);

    if (item.hasSubmenu) {
      $link
        .on("mouseenter", function () {
          const pos = $(this).offset();
          $("#dropdownContainerWoodMensure").css({
            top: pos.top + "px",
            right: "100%", // posiciona para a esquerda
            left: "auto",
            display: "block",
          });
        })
        .on("mouseleave", function () {
          setTimeout(() => {
            if (!$("#dropdownContainerWoodMensure").is(":hover")) {
              $("#dropdownContainerWoodMensure").hide();
            }
          }, 300);
        });
    } else {
      $link.data("id", item.id).on("click", function (e) {
        e.preventDefault();
        redirecionaTela($(this).data("id"));
      });
    }

    $link.appendTo($dropdownContainer);
  });

  $("#dropdownContainerWoodMensure").on("mouseleave", function () {
    $(this).hide();
  });
}

function generateFiltersWoodMensure() {
  const submenuItems = [
    { text: "Mensuração Manual", id: 20 },
    { text: "Mensuração Automática", id: 21 },
  ];

  const $submenu = $("#dropdownContainerWoodMensure");
  $submenu.empty();

  submenuItems.forEach((item) => {
    $("<a>")
      .addClass("dropdown-item")
      .attr("href", "#")
      .text(item.text)
      .data("id", item.id)
      .on("click", function (e) {
        e.preventDefault();
        redirecionaTela($(this).data("id"));
      })
      .appendTo($submenu);
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
// function showImage(idImage) {
//   getImageByIdImagePRC(idImage)
//     .then((data) => {
//       console.log("Retorno da API:", data);
//       // A API deve retornar algo como { image: "..." } (sua base64)
//       if (data && data.image) {
//         // Ajuste o 'src' do <img> com base64
//         document.getElementById("imgProcess").src = `data:image/jpeg;base64,${data.image}`;
//       } else {
//         console.error("Não foi possível carregar a imagem Base64.");
//       }
//     })
//     .catch((error) => {
//       console.error("Erro ao mostrar a imagem:", error);
//     });
// }
function showImage(idImage) {
  getImageByIdImagePRC(idImage)
    .then((data) => {
      if (data && data.image) {
        const img = document.getElementById("imgProcess");

        // Espera imagem carregar para aplicar o zoom
        img.onload = () => {
          imageZoom("imgProcess", "myresult");
        };

        img.src = `data:image/jpeg;base64,${data.image}`;
      } else {
        console.error("Imagem não encontrada.");
      }
    })
    .catch((error) => {
      console.error("Erro ao carregar imagem:", error);
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
  $("#btnSaveResult").removeClass("d-none");

  if (dataProcessed != null && dataProcessed !== "") {
    const img = document.getElementById("imgProcess");

    img.onload = () => {
      imageZoom("imgProcess", "myresult");
    };

    img.src = `data:image/png;base64,${dataProcessed}`;
  }
}

function saveImgResult() {
  console.log("imgSalva");
  const img = document.getElementById("imgProcess");
  if (img && img.src) {
    saveImageToDB("processedImage", img.src);
  } else {
    Swal.fire({
      icon: "error",
      title: "Erro",
      text: "Erro no salvamento da imagem processada!",
      allowOutsideClick: false,
    });
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

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("ImageDB", 1);

    request.onupgradeneeded = function (event) {
      const db = event.target.result;
      if (!db.objectStoreNames.contains("images")) {
        db.createObjectStore("images", { keyPath: "id" });
      }
    };

    request.onsuccess = function (event) {
      resolve(event.target.result);
    };

    request.onerror = function (event) {
      reject(event.target.error);
    };
  });
}

async function saveImageToDB(id, imgSrc) {
  const db = await openDB();
  const tx = db.transaction("images", "readwrite");
  const store = tx.objectStore("images");

  const imageData = {
    id: id,
    src: imgSrc,
    savedAt: new Date(),
  };

  const request = store.put(imageData);

  request.onsuccess = function () {
    Swal.fire({
      icon: "success",
      title: "Sucesso",
      text: "Imagem salva com sucesso!",
      allowOutsideClick: false,
    });
    console.log(`Imagem '${id}' salva com sucesso no IndexedDB.`);
  };

  request.onerror = function (event) {
    Swal.fire({
      icon: "error",
      title: "Erro",
      text: `Erro ao salvar a imagem:', ${event.target.error}`,
      allowOutsideClick: false,
    });
    console.error("Erro ao salvar a imagem:", event.target.error);
  };

  await tx.complete;
  db.close();
}

async function loadImageFromDB(id) {
  const db = await openDB();
  const tx = db.transaction("images", "readonly");
  const store = tx.objectStore("images");

  const request = store.get(id);

  request.onsuccess = function (event) {
    const result = event.target.result;
    if (result) {
      const img = document.getElementById("imgProcess");
      img.src = result.src;
      console.log(`Imagem '${id}' carregada com sucesso.`);
    } else {
      console.log(`Imagem '${id}' não encontrada no IndexedDB.`);
      Swal.fire({
        icon: "info",
        title: "Atenção",
        text: "Nenhuma imagem salva encontrada!",
        allowOutsideClick: false,
      });
    }
  };

  request.onerror = function (event) {
    console.error("Erro ao carregar a imagem:", event.target.error);
  };

  await tx.complete;
  db.close();
}

function imageZoom(imgID, resultID) {
  const img = document.getElementById(imgID);
  const result = document.getElementById(resultID);

  // Remove lente antiga
  const oldLens = img.parentElement.querySelector(".img-zoom-lens");
  if (oldLens) oldLens.remove();

  // Cria nova lente
  const lens = document.createElement("DIV");
  lens.setAttribute("class", "img-zoom-lens");
  img.parentElement.insertBefore(lens, img);

  const cx = result.offsetWidth / lens.offsetWidth;
  const cy = result.offsetHeight / lens.offsetHeight;

  result.style.backgroundImage = `url('${img.src}')`;
  result.style.backgroundRepeat = "no-repeat";

  // Eventos de movimento
  lens.addEventListener("mousemove", moveLens);
  img.addEventListener("mousemove", moveLens);

  lens.addEventListener("touchmove", moveLens);
  img.addEventListener("touchmove", moveLens);

  function moveLens(e) {
    e.preventDefault();

    const pos = getCursorPos(e);
    let x = pos.x - lens.offsetWidth / 2;
    let y = pos.y - lens.offsetHeight / 2;

    const bounds = img.getBoundingClientRect();

    if (x < 0) x = 0;
    if (y < 0) y = 0;
    if (x > bounds.width - lens.offsetWidth)
      x = bounds.width - lens.offsetWidth;
    if (y > bounds.height - lens.offsetHeight)
      y = bounds.height - lens.offsetHeight;

    lens.style.left = `${x}px`;
    lens.style.top = `${y}px`;

    result.style.backgroundSize = `${img.width * cx}px ${img.height * cy}px`;
    result.style.backgroundPosition = `-${x * cx}px -${y * cy}px`;
  }

  function getCursorPos(e) {
    e = e || window.event;
    const bounds = img.getBoundingClientRect();
    const x = e.pageX - bounds.left - window.pageXOffset;
    const y = e.pageY - bounds.top - window.pageYOffset;
    return { x, y };
  }
}

function showImageFromDB(idImage) {
  getImageFromDB(idImage)
    .then((data) => {
      if (data && data.src) {
        const img = document.getElementById("imgProcess");

        img.onload = () => {
          imageZoom("imgProcess", "myresult");
        };

        img.src = data.src; // Já está salvo como base64 no IndexedDB

        console.log(`Imagem '${idImage}' carregada do IndexedDB.`);
      } else {
        console.error("Imagem não encontrada no IndexedDB.");
        Swal.fire({
          icon: "error",
          title: "Erro",
          text: "Imagem não encontrada no banco local!",
          allowOutsideClick: false,
        });
      }
    })
    .catch((error) => {
      console.error("Erro ao carregar imagem do IndexedDB:", error);
      Swal.fire({
        icon: "error",
        title: "Erro",
        text: "Falha ao acessar o banco de imagens local.",
        allowOutsideClick: false,
      });
    });
}

function getImageFromDB(id) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("ImageDB", 1);

    request.onerror = function (event) {
      console.error("Erro ao abrir o IndexedDB:", event.target.error);
      reject(event.target.error);
    };

    request.onsuccess = function (event) {
      const db = event.target.result;
      const tx = db.transaction("images", "readonly");
      const store = tx.objectStore("images");

      const getRequest = store.get(id);

      getRequest.onsuccess = function (event) {
        const result = event.target.result;
        db.close();
        resolve(result);
      };

      getRequest.onerror = function (event) {
        console.error(
          "Erro ao buscar imagem no IndexedDB:",
          event.target.error
        );
        db.close();
        reject(event.target.error);
      };
    };
  });
}

function getBase64FromImgTag() {
  const img = document.getElementById("imgProcess");

  if (!img || !img.src) {
    throw new Error("Imagem não encontrada na tag imgProcess.");
  }

  // Extrai apenas a parte base64 (remove o prefixo data:image/png;base64,)
  const base64 = img.src.split(",")[1];
  return base64;
}
