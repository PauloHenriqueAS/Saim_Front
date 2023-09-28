function readUploadFiles() {
  var inputElement = $("#dragImagem")[0];

  if (inputElement.files.length > 0) {
    Swal.fire({
      title: 'Deseja fazer o upload da imagem?',
      showCancelButton: false,
      confirmButtonText: 'Confirmar',
      showDenyButton: true,
      denyButtonText: `Cancelar`,
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        getBase64FromImage(inputElement)

      } else if (result.isDenied) {
        cleanUpload()
      }
    })
  } else {
    Swal.fire({
      icon: 'warning',
      title: 'Selecione um arquivo antes.',
      allowOutsideClick: false,
    });
  }
}

function getBase64FromImage(inputElement) {
  var selectedImage = inputElement.files[0];

  if (selectedImage) {
    var reader = new FileReader();
    reader.onload = function (e) {
      var base64Data = e.target.result.split(",")[1]; // Remove o cabeçalho 'data:image/jpeg;base64,'

      // Exiba o resultado na página ou faça o que desejar com o base64Data
      console.log(base64Data);
    };

    reader.readAsDataURL(selectedImage); // Inicia a leitura do arquivo
  }
}

function cleanUpload() {
  $('#dragImagem').val("")
}
