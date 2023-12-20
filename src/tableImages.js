$(document).ready(function () {
  renderDatasDataTable()
});

async function renderDatasDataTable() {
  const dataImages = await getImagesDataByPerson()
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

async function getImagesDataByPerson() {
  try {
    jsLoading(true);
    const personId = 2;
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
        title: 'Erro ao buscar imagens salvas',
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

$('#btnContinue').click(function() {
  
});