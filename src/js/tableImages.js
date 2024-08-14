$(document).ready(function () {
  //GetIdPageFromURL();
  renderDatasDataTable();
});

async function renderDatasDataTable() {
  const personId = 2;
  // update

  const dataImages = await getImagesDataByPerson(personId)
  fillImageDataTable(dataImages)
}

async function showDetails(idImage) {
  const dataRequest = await getImageByIdImage(idImage);
  const dataImage = dataRequest.data;
  Swal.fire({
    title: `${dataImage.name_image}`,
    html:
      `<img alt="${dataImage.name_image}" width="100%" height="auto" src='data:image/jpeg;base64,${dataImage.image}'>`,
    showCloseButton: true,
    showCloseButton: false,
    allowOutsideClick: false,
  })
}

function getImagesColumns() {
  return [
    {
      'data': 'id_image',
      'title': ' ',
      'className': 'text-center',
      'render': (data, row) => {
        return `<button style="border: none; background: none" onclick="showDetails('${data}')" ><i class="icon ion-eye" style="font-size: 24px; display: block; margin: 0 auto; border: none; background: none"></i></button>`;
      }
    },
    {
      'data': 'id_image',
      'title': 'Número de Identificação',
      'className': 'text-center',
      'render': (data) => {
        return (`${data}`);
      },
      'width': '20%'
    },
    {
      'data': 'name_image',
      'title': 'Nome da Imagem',
      'className': 'text-center',
      'render': (data) => {
        return (`${data}`);
      }
    },
    {
      'data': 'date_image',
      'title': 'Data da Upload',
      'className': 'text-center',
      'render': (data) => {
        return (`${data}`);
      }
    },
  ];
}

function fillImageDataTable(dataImages) {
  $('#imagesDataTable').DataTable({
    dom: '<"table-top"fB>rt<"table-bottom"lp>',
    scrollX: true,
    responsive: true,
    buttons: [
      {
        extend: 'excel',
        text: '<img class="excel-icon">',
        titleAttr: 'Exportar para excel'
      }
    ],
    language: {
      url: 'https://cdn.datatables.net/plug-ins/1.11.5/i18n/pt-BR.json',
      search: '',
      searchPlaceholder: 'Buscar',
      lengthMenu: 'Mostrar _MENU_ resultados',
      zeroRecords: 'Nenhum Resultado encontrado!',
      info: 'Página _PAGE_ de _PAGES_',
      infoEmpty: 'Nenhum dado válido',
      infoFiltered: '(Filtrado de _MAX_ resultados)',
    },
    initComplete: function () {
      $('#imagesDataTable label').append('<i class="uil uil-search"></i>');
      $('#imagesDataTable label');

      $('#imagesDataTable label').addClass('label-table-search');
      $('#imagesDataTable label input').addClass('input-table-search');
    },
    data: dataImages,
    columns: getImagesColumns(),
    createdRow(row, data) {
      const idShow = `showMore_${data.id_image}`;
      $(`#${idShow}`).click(function (evt) {
        evt.preventDefault();
        evt.stopPropagation();
        evt.stopImmediatePropagation();
      });
      $(row).click(function (evt) {
        evt.preventDefault();
        evt.stopPropagation();

        $('tr').css('background-color', '');
        $(this).css('background-color', '#66CDAA');
      });
      $(row).hover(
        function () {
          $(this).css('transform', 'scale(1.008)');
          //$(this).children().first().children().css('display', 'block');
        },
        function () {
          $(this).css('transform', 'scale(1)');
          //$(this).children().first().children().css('display', 'none');
          $(this).css('cursor', 'pointer');
        }
      );
    },
    columnDefs: [{
      'defaultContent': '-',
      'targets': '_all'
    }],
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
        icon: 'error',
        title: 'Erro ao buscar imagens salvas.',
        text: `${resData.message}`,
        allowOutsideClick: false,
      });
    }
  } catch (error) {
    jsLoading(false);
    Swal.fire({
      icon: 'error',
      title: 'Erro',
      text: `${error.message}`,
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
        icon: 'error',
        title: 'Erro ao buscar detalhes das imagens.',
        text: `${resData.message}`,
        allowOutsideClick: false,
      });
    }
  } catch (error) {
    jsLoading(false);
    Swal.fire({
      icon: 'error',
      title: 'Erro',
      text: `${error.message}`,
      allowOutsideClick: false,
    });
  }
}

$('#btnContinue').click(function () {
  RedirectPage()
});

function GetIdPageFromURL() {
  let queryString = window.location.search;
  let parametros = new URLSearchParams(queryString);
  let idDaUrl = parametros.get('idPage');
  console.log(parseInt(idDaUrl, 10));
  return parseInt(idDaUrl, 10);
}

function RedirectPage() {
  // $('.dropdown-item').on('click', function () {
  //   // Obtém o valor do atributo 'data-index'
  //   var index = $(this).data('index');
  var index = GetIdPageFromURL();
    var linkPageRedirect = '';

    switch (index) {
      case 1:
        linkPageRedirect = `${PageFiltersEnum.AFINAMENTO}`
        break;
      case 2:
        linkPageRedirect = `${PageFiltersEnum.DILATACAO}`
        break;
      case 3:
        linkPageRedirect = `${PageFiltersEnum.EROSAO}`
        break;
      case 4:
        linkPageRedirect = `${PageFiltersEnum.LAPLACIANO}`
        break;
      case 5:
        linkPageRedirect = `${PageFiltersEnum.LIMIAR}`
        break;
      case 6:
        linkPageRedirect = `${PageFiltersEnum.MEDIA}`
        break;
      case 7:
        linkPageRedirect = `${PageFiltersEnum.SOBEL_X}`
        break;
      case 8:
        linkPageRedirect = `${PageFiltersEnum.SOBEL_Y}`
        break;
      case 9:
        linkPageRedirect = `${PageFiltersEnum.SOBEL_XY}`
        break;
    }

    // Redireciona para o destino específico
    window.location.href = linkPageRedirect;
  // });
}