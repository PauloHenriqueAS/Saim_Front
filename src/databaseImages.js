function downloadImage(idImagem) {
    var imageUrl = `assets/img/bancoImagens/${idImagem}.jpg`;

    var link = document.createElement("a");
    link.href = imageUrl;
    link.download = `${idImagem}.jpg`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}