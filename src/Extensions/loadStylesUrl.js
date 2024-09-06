const stylesheets = [
    '../../assets/bootstrap/css/bootstrap.min.css',
    'https://fonts.googleapis.com/css?family=Lato:300,400,700&display=swap',
    'https://fonts.googleapis.com/css?family=Allerta&display=swap',
    'https://fonts.googleapis.com/css?family=Angkor&display=swap',
    '../../assets/css/Simple-Slider-swiper-bundle.min.css',
    '../../assets/css/Drag-Drop-File-Input-Upload.css',
    '../../assets/css/Drag--Drop-Upload-Form.css',
    '../../assets/fonts/ionicons.min.css',
    '../../assets/css/Simple-Slider.css',
    '../../assets/css/swiper-icons.css',
    '../../assets/css/pikaday.min.css',
    '../css/icons.css',
    '../css/loader.css',
    '../css/style.css',
];

stylesheets.forEach(href => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
});