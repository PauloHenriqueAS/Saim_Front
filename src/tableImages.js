$(document).ready(function() {
  renderDatasDataTable()
});

async function renderDatasDataTable(){
  const dataImages = await getImagesDataByPerson()
  fillImageDataTable(dataImages)
}

function getImagesColumns() {
  console.log('obtendo data')
  return [
      {
          'data': '',
          'title': ' ',
          'className': 'd-none',
          'render': (data) => {
            return (`${data}`);
        }
      },
      {
          'data': 'id_image',
          'title': 'Número de Identificação',
          'className': 'text-center',
          'render': (data) => {
              return (`${data}`);
          }
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
  console.log('infos tabela', dataImages)
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
      // initComplete: function () {
      //     $('#imagesDataTable label').append('<i class="uil uil-search"></i>');
      //     $('#imagesDataTable label');

      //     $('#imagesDataTable label').addClass('label-table-search');
      //     $('#imagesDataTable label input').addClass('input-table-search');
      // },
      data: dataImages,
      columns: getImagesColumns(),
      createdRow(row, data) {
          $(row).click(function (evt) {
              evt.preventDefault();
              evt.stopPropagation();

              $(`#imgCheckbox_${data.num_contrato}`).parent().parent().css('background-color', '#E3F4F4');
          });
          
          $(row).hover(
              function () { $(this).css('cursor', 'pointer'); },
          );
      },
      columnDefs: [{
          'defaultContent': '-',
          'targets': '_all'
      }],
  });
}

async function getImagesDataByPerson() {
  console.log('consultando data')
  try {
      const personId = 2;
      const apiUrl = `${URL_API_BASE}/image/GetImageByPerson?id_pessoa=${personId}`;

      const res = await fetch(apiUrl);
      if (res.ok) {
        const returnApi = await res.json();
        console.log(returnApi.data)
        return returnApi.data;
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Erro ao buscar imagens salvas',
          text: `${resData.message}`,
          allowOutsideClick: false,
        });
      }
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Erro',
      text: `${error.message}`,
      allowOutsideClick: false,
    });
  }
}
