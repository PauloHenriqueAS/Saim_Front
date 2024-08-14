const URL_API_BASE  = "http://127.0.0.1:8000"

//ENUM PARA O REDIRECIONAMENTO DE PAGINAS DOS FILTROS
const PageFiltersEnum = {
    AFINAMENTO: 'Afinamento',
    DILATACAO: 'Dilatação',
    EROSAO: 'Erosão',
    LAPLACIANO: 'Laplaciano',
    LIMIAR: 'filtroLimiarizacao.html',
    MEDIA: 'Média',
    SOBEL_X: 'Sobel X',
    SOBEL_Y: 'Sobel Y',
    SOBEL_XY: 'Sobel XY',
};

const PageWoodEnum = {
    MENSURACAO: 'Mesuração',
    GRAFICO: 'Gráfico',
    AJUSTES_FINOS: 'Ajustes Finos'
};