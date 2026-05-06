// Dimensions of the image (Initial placeholders)
let imgWidth = 2000;
let imgHeight = 1500;
let bounds = [[0, 0], [imgHeight, imgWidth]];

// Device Detection & Device Class Assignment
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

// Add device class to body for CSS targeting
document.body.classList.add(isMobile ? 'device-mobile' : 'device-pc');
if (isTouchDevice) document.body.classList.add('device-touch');

// Map Initialization
const map = L.map('map', {
    crs: L.CRS.Simple,
    minZoom: -3,
    maxZoom: 3,
    zoomSnap: 0.1,
    attributionControl: false
});

const mapImagePath = 'imagenes/mapa_principal.jpg';

// Definir dimensiones iniciales para que el mapa no esté "vacio"
const initialBounds = [[0, 0], [2000, 3000]];
const overlay = L.imageOverlay(mapImagePath, initialBounds).addTo(map);

// Cuando la imagen cargue, ajustar las dimensiones reales
const mapImage = new Image();
mapImage.onload = function() {
    imgWidth = this.width;
    imgHeight = this.height;
    bounds = [[0, 0], [imgHeight, imgWidth]];
    
    overlay.setBounds(bounds);
    map.setMaxBounds(bounds.pad(0.1));
    map.fitBounds(bounds);
    map.invalidateSize();
    console.log("Mapa cargado con dimensiones reales:", imgWidth, "x", imgHeight);
};
mapImage.src = mapImagePath;

// Asegurar que el mapa se vea al cargar
window.addEventListener('load', () => {
    setTimeout(() => {
        map.invalidateSize();
    }, 500);
});

// Re-dimensionar mapa al cambiar el tamaño de ventana
window.addEventListener('resize', () => {
    map.invalidateSize();
});

// Register Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js?v=44');
    });
}

// Language and Favorites State
let currentLang = 'es';
let favorites = JSON.parse(localStorage.getItem('calarca_favs')) || [];

const translations = {
    es: {
        welcome: "¡Bienvenido!",
        explore: "Explora los tesoros de la Villa del Cacique.",
        clickMarker: "Haz clic en un marcador del mapa para conocer más detalles.",
        favorites: "Mi Pasaporte (Favoritos)",
        noFavs: "No has guardado lugares aún.",
        howToGet: "🚗 Cómo llegar",
        weatherLoading: "Cargando clima...",
        searchPlaceholder: "¿Qué buscas en Calarcá?",
        openNow: "🟢 Abierto Ahora",
        closed: "🔴 Cerrado",
        labelSearch: "Buscar Lugares",
        labelCategories: "Categorías",
        labelHighlighted: "Información Destacada",
        labelInstall: "Lleva el Mapa Contigo",
        labelShare: "Compartir Mapa",
        scanMe: "Escanea para abrir el mapa en tu móvil",
        copyLink: "Copiar Enlace",
        downloadQR: "Descargar QR (JPG)",
        installText: "Instala esta App en tu móvil para usarla sin conexión",
        installBtn: "📲 Descargar App Mapa Calarcá 2026",
        copied: "¡Copiado!"
    },
    en: {
        welcome: "Welcome!",
        explore: "Explore the treasures of the Villa del Cacique.",
        clickMarker: "Click on a map marker to see more details.",
        favorites: "My Passport (Favorites)",
        noFavs: "No places saved yet.",
        howToGet: "🚗 How to get there",
        weatherLoading: "Loading weather...",
        searchPlaceholder: "Search in Calarcá...",
        openNow: "🟢 Open Now",
        closed: "🔴 Closed",
        labelSearch: "Search Places",
        labelCategories: "Categories",
        labelHighlighted: "Featured Information",
        labelInstall: "Take the Map with You",
        labelShare: "Share Map",
        scanMe: "Scan to open the map on your mobile",
        copyLink: "Copy Link",
        downloadQR: "Download QR (JPG)",
        installText: "Install this App on your mobile for offline use",
        installBtn: "📲 Download Calarcá 2026 Map App",
        copied: "Copied!"
    }
};

// Points of interest with multi-language support
const pointsOfInterest = [
    {
        id: 1,
        name: { es: "Plaza de Bolívar (Parque Principal)", en: "Bolivar Square (Main Park)" },
        coords: [3932.6, 4624.9],
        realCoords: "4.5302,-75.6418",
        phone: "+573100000000",
        description: { 
            es: "El corazón de la 'Villa del Cacique'. Un espacio vibrante rodeado de arquitectura cafetera tradicional, donde locales y turistas se reuniuen para disfrutar de un buen café, la brisa de la tarde y eventos culturales. Es el punto de partida ideal para explorar la ciudad.",
            en: "The heart of the 'Villa del Cacique'. A vibrant space surrounded by traditional coffee architecture, where locals and tourists gather to enjoy good coffee, the afternoon breeze, and cultural events. It is the ideal starting point to explore the city."
        },
        category: "Cultura",
        photo: "imagenes/LOGO CALARCA 2026.jpg",
        openHours: [0, 24]
    },
    {
        id: 2,
        name: { es: "Parroquia San José", en: "San Jose Parish" },
        coords: [3923.6, 4684.7],
        realCoords: "4.5308,-75.6415",
        phone: "+573100000000",
        description: {
            es: "Majestuoso templo católico ubicado frente a la Plaza de Bolívar. Un ícono de la fe y la arquitectura calarqueña, testigo de la historia del municipio.",
            en: "Majestic Catholic temple located in front of Bolivar Square. An icon of faith and Calarcá architecture, witness to the municipality's history."
        },
        category: "Cultura",
        photo: "imagenes/LOGO CALARCA 2026.jpg",
        openHours: [7, 19]
    },
    {
        id: 3,
        name: { es: "Casa de la Cultura Lucelly García", en: "Lucelly Garcia House of Culture" },
        coords: [3863.8, 4474.2],
        realCoords: "4.5320,-75.6425",
        phone: "+573100000000",
        description: {
            es: "Epicentro de las artes y la memoria histórica de Calarcá. Un espacio dedicado al fomento de la cultura, el teatro y la música en la 'Villa del Cacique'.",
            en: "Epicenter of arts and historical memory of Calarcá. A space dedicated to the promotion of culture, theater, and music in the 'Villa del Cacique'."
        },
        category: "Cultura",
        photo: "imagenes/LOGO CALARCA 2026.jpg",
        openHours: [8, 18]
    },
    {
        id: 4,
        name: { es: "Corregimiento La Virginia", en: "La Virginia Village" },
        coords: [750, 1420],
        realCoords: "4.5100,-75.6100",
        phone: "+573100000000",
        description: {
            es: "Pintoresco corregimiento que sirve de entrada a la zona de Peñas Blancas. Conocido por su tranquilidad y belleza rural.",
            en: "Picturesque village that serves as an entrance to the Peñas Blancas area. Known for its tranquility and rural beauty."
        },
        category: "Naturaleza",
        photo: "imagenes/LOGO CALARCA 2026.jpg",
        openHours: [0, 24]
    },
    {
        id: 5,
        name: { es: "Recuca (Cultura Cafetera)", en: "Recuca (Coffee Culture)" },
        coords: [380, 820],
        realCoords: "4.4850,-75.6800",
        phone: "+573108303779",
        description: {
            es: "Recorrido de la Cultura Cafetera. Vive la experiencia de ser caficultor por un día en una de las fincas más tradicionales de la región.",
            en: "Coffee Culture Tour. Live the experience of being a coffee farmer for a day in one of the most traditional farms in the region."
        },
        category: "Cultura",
        photo: "imagenes/pautas/pauta_recuca.jpg",
        openHours: [9, 17]
    },
    {
        id: 6,
        name: { es: "Hospital La Misericordia", en: "La Misericordia Hospital" },
        coords: [980, 1080],
        realCoords: "4.5320,-75.6380",
        phone: "+573100000000",
        description: {
            es: "Principal centro hospitalario del municipio, brindando servicios de salud a la comunidad de Calarcá.",
            en: "Main hospital center of the municipality, providing health services to the community of Calarcá."
        },
        category: "Servicios",
        photo: "imagenes/LOGO CALARCA 2026.jpg",
        openHours: [0, 24]
    },
    {
        id: 7,
        name: { es: "Galería Calarcá", en: "Calarca Gallery" },
        coords: [1080, 1030],
        realCoords: "4.5350,-75.6420",
        phone: "+573100000000",
        description: {
            es: "Centro de comercio local donde se encuentran productos frescos, artesanías y la esencia del mercado calarqueño.",
            en: "Local commerce center where you can find fresh products, crafts and the essence of the Calarcá market."
        },
        category: "Comercio",
        photo: "imagenes/LOGO CALARCA 2026.jpg",
        openHours: [6, 18]
    },
    {
        id: 10,
        name: { es: "Restaurante Fercho", en: "Fercho Restaurant" },
        coords: [920, 1050],
        realCoords: "4.5315,-75.6410",
        phone: "+573105025670",
        description: {
            es: "Deliciosa gastronomía local con el sabor auténtico de Calarcá. Un lugar tradicional para disfrutar en familia.",
            en: "Delicious local gastronomy with the authentic flavor of Calarcá. A traditional place to enjoy with family."
        },
        category: "Gastronomía Local",
        photo: "imagenes/pautas/pauta_fercho.jpg",
        openHours: [11, 22]
    },
    {
        id: 11,
        name: { es: "San Miguel Café", en: "San Miguel Coffee" },
        coords: [960, 1030],
        realCoords: "4.5308,-75.6425",
        phone: "+573104495532",
        description: {
            es: "Experiencia cafetera premium en el corazón de Calarcá. El mejor café de origen con un ambiente acogedor.",
            en: "Premium coffee experience in the heart of Calarcá. The best single-origin coffee with a cozy atmosphere."
        },
        category: "Gastronomía Local",
        photo: "imagenes/pautas/pauta_san_miguel.jpeg",
        openHours: [8, 21]
    },
    {
        id: 8,
        name: { es: "Bomberos Calarcá", en: "Calarca Firefighters" },
        coords: [930, 950],
        realCoords: "4.5290,-75.6440",
        phone: "+573100000000",
        description: {
            es: "Cuerpo de bomberos voluntarios de Calarcá, siempre listos para servir a la comunidad.",
            en: "Volunteer fire department of Calarcá, always ready to serve the community."
        },
        category: "Servicios",
        photo: "imagenes/LOGO CALARCA 2026.jpg",
        openHours: [0, 24]
    },
    {
        id: 9,
        name: { es: "Parador Gastronómico Balboa", en: "Balboa Gastronomic Stop" },
        coords: [300, 280],
        realCoords: "4.4750,-75.7100",
        phone: "+573100000000",
        description: {
            es: "Punto de parada obligatorio para disfrutar de la mejor gastronomía local en la vía principal.",
            en: "A mandatory stop to enjoy the best local gastronomy on the main road."
        },
        category: "Gastronomía Local",
        photo: "imagenes/LOGO CALARCA 2026.jpg",
        openHours: [7, 20]
    },
    {
        id: 12,
        name: { es: "Alcaldía de Calarcá", en: "Calarca City Hall" },
        coords: [3950, 4610],
        realCoords: "4.5305,-75.6415",
        phone: "+573100000000",
        description: {
            es: "Sede del gobierno municipal, ubicada en el centro histórico de la ciudad.",
            en: "Seat of the municipal government, located in the historic city center."
        },
        category: "Servicios",
        photo: "imagenes/pautas/pauta_alcaldia.jpg",
        openHours: [8, 16]
    },
    {
        id: 13,
        name: { es: "Quinti Café", en: "Quinti Coffee" },
        coords: [3900, 4700],
        realCoords: "4.5310,-75.6400",
        phone: "+573126815139",
        description: {
            es: "Sabor y tradición en cada taza. Disfruta de una experiencia cafetera única.",
            en: "Flavor and tradition in every cup. Enjoy a unique coffee experience."
        },
        category: "Gastronomía Local",
        photo: "imagenes/pautas/pauta_quinti.jpg",
        openHours: [8, 20]
    },
    {
        id: 14,
        name: { es: "Raíz Café", en: "Raiz Coffee" },
        coords: [3880, 4650],
        realCoords: "4.5300,-75.6410",
        phone: "+573115188564",
        description: {
            es: "Conectando con nuestras raíces a través del mejor café de origen.",
            en: "Connecting with our roots through the best single-origin coffee."
        },
        category: "Gastronomía Local",
        photo: "imagenes/pautas/pauta_raiz.jpg",
        openHours: [9, 21]
    },
    {
        id: 15,
        name: { es: "La Talanquera", en: "La Talanquera" },
        coords: [400, 350],
        realCoords: "4.4800,-75.7000",
        phone: "+573219598257",
        description: {
            es: "Tradición gastronómica en la vía principal, ideal para una parada deliciosa.",
            en: "Gastronomic tradition on the main road, ideal for a delicious stop."
        },
        category: "Gastronomía Local",
        photo: "imagenes/pautas/pauta_talanquera.jpg",
        openHours: [10, 22]
    },
    {
        id: 16,
        name: { es: "Comaparado", en: "Comaparado" },
        coords: [500, 400],
        realCoords: "4.4900,-75.6900",
        phone: "+573152721971",
        description: {
            es: "Servicios y atención de calidad para el viajero en Calarcá.",
            en: "Quality services and attention for the traveler in Calarcá."
        },
        category: "Comercio",
        photo: "imagenes/pautas/pauta_comaparado.jpg",
        openHours: [8, 18]
    },
    {
        id: 17,
        name: { es: "Albania", en: "Albania" },
        coords: [3960, 4650],
        realCoords: "4.5310,-75.6420",
        phone: "+573100000000",
        description: {
            es: "Deliciosa gastronomía local en un ambiente acogedor.",
            en: "Delicious local gastronomy in a cozy atmosphere."
        },
        category: "Gastronomía Local",
        photo: "imagenes/pautas/pauta_albania.jpg",
        openHours: [11, 21]
    },
    {
        id: 18,
        name: { es: "Alemania", en: "Alemania" },
        coords: [3940, 4670],
        realCoords: "4.5300,-75.6430",
        phone: "+573100000000",
        description: {
            es: "Sabor tradicional con un toque internacional.",
            en: "Traditional flavor with an international touch."
        },
        category: "Gastronomía Local",
        photo: "imagenes/pautas/pauta_alemania.jpg",
        openHours: [12, 22]
    },
    {
        id: 19,
        name: { es: "Amaranta", en: "Amaranta" },
        coords: [3920, 4690],
        realCoords: "4.5290,-75.6440",
        phone: "+573100000000",
        description: {
            es: "Café de origen y repostería artesanal.",
            en: "Single-origin coffee and artisanal pastries."
        },
        category: "Gastronomía Local",
        photo: "imagenes/pautas/pauta_amaranta.jpg",
        openHours: [8, 20]
    },
    {
        id: 20,
        name: { es: "Bendito", en: "Bendito" },
        coords: [3900, 4710],
        realCoords: "4.5280,-75.6450",
        phone: "+573100000000",
        description: {
            es: "El lugar perfecto para un buen café y una buena charla.",
            en: "The perfect place for a good coffee and a good chat."
        },
        category: "Gastronomía Local",
        photo: "imagenes/pautas/pauta_bendito.jpg",
        openHours: [9, 21]
    },
    {
        id: 21,
        name: { es: "Bisonte", en: "Bisonte" },
        coords: [3880, 4730],
        realCoords: "4.5270,-75.6460",
        phone: "+573100000000",
        description: {
            es: "Especialistas en carnes a la parrilla y platos típicos.",
            en: "Specialists in grilled meats and typical dishes."
        },
        category: "Gastronomía Local",
        photo: "imagenes/pautas/pauta_bisonte.jpg",
        openHours: [12, 23]
    },
    {
        id: 22,
        name: { es: "Chaparral", en: "Chaparral" },
        coords: [3860, 4750],
        realCoords: "4.5260,-75.6470",
        phone: "+573100000000",
        description: {
            es: "Tradición y sabor en cada plato.",
            en: "Tradition and flavor in every dish."
        },
        category: "Gastronomía Local",
        photo: "imagenes/pautas/pauta_chaparral.jpg",
        openHours: [11, 20]
    },
    {
        id: 23,
        name: { es: "Confía", en: "Confia" },
        coords: [3840, 4770],
        realCoords: "4.5250,-75.6480",
        phone: "+573100000000",
        description: {
            es: "Servicios financieros y atención personalizada.",
            en: "Financial services and personalized attention."
        },
        category: "Servicios",
        photo: "imagenes/pautas/pauta_confia.jpg",
        openHours: [8, 17]
    },
    {
        id: 24,
        name: { es: "Coomocal", en: "Coomocal" },
        coords: [3820, 4790],
        realCoords: "4.5240,-75.6490",
        phone: "+573100000000",
        description: {
            es: "Transporte seguro y confiable para toda la región.",
            en: "Safe and reliable transport for the entire region."
        },
        category: "Transporte",
        photo: "imagenes/pautas/pauta_coomocal.jpg",
        openHours: [5, 21]
    },
    {
        id: 25,
        name: { es: "Descanso", en: "Descanso" },
        coords: [3800, 4810],
        realCoords: "4.5230,-75.6500",
        phone: "+573100000000",
        description: {
            es: "Hospedaje acogedor con el mejor ambiente rural.",
            en: "Cozy lodging with the best rural atmosphere."
        },
        category: "Hospedaje Rural",
        photo: "imagenes/pautas/pauta_descanso.jpg",
        openHours: [0, 24]
    },
    {
        id: 26,
        name: { es: "Domo", en: "Domo" },
        coords: [3780, 4830],
        realCoords: "4.5220,-75.6510",
        phone: "+573100000000",
        description: {
            es: "Experiencia de glamping única en contacto con la naturaleza.",
            en: "Unique glamping experience in contact with nature."
        },
        category: "Hospedaje Rural",
        photo: "imagenes/pautas/pauta_domo.jpg",
        openHours: [0, 24]
    },
    {
        id: 27,
        name: { es: "Marta", en: "Marta" },
        coords: [3760, 4850],
        realCoords: "4.5210,-75.6520",
        phone: "+573100000000",
        description: {
            es: "Cocina casera con el amor de hogar.",
            en: "Home cooking with the love of home."
        },
        category: "Gastronomía Local",
        photo: "imagenes/pautas/pauta_marta.jpg",
        openHours: [11, 15]
    },
    {
        id: 28,
        name: { es: "Master", en: "Master" },
        coords: [3740, 4870],
        realCoords: "4.5200,-75.6530",
        phone: "+573100000000",
        description: {
            es: "Todo lo que necesitas para tu hogar en un solo lugar.",
            en: "Everything you need for your home in one place."
        },
        category: "Comercio",
        photo: "imagenes/pautas/pauta_master.jpg",
        openHours: [8, 19]
    },
    {
        id: 29,
        name: { es: "Origen", en: "Origen" },
        coords: [3720, 4890],
        realCoords: "4.5190,-75.6540",
        phone: "+573100000000",
        description: {
            es: "El verdadero sabor del café de origen.",
            en: "The true flavor of single-origin coffee."
        },
        category: "Gastronomía Local",
        photo: "imagenes/pautas/pauta_origen.jpg",
        openHours: [8, 20]
    },
    {
        id: 30,
        name: { es: "Peñas", en: "Peñas" },
        coords: [3700, 4910],
        realCoords: "4.5180,-75.6550",
        phone: "+573100000000",
        description: {
            es: "Aventura y naturaleza en las majestuosas Peñas Blancas.",
            en: "Adventure and nature in the majestic Peñas Blancas."
        },
        category: "Aventura",
        photo: "imagenes/pautas/pauta_peñas.jpg",
        openHours: [8, 17]
    },
    {
        id: 31,
        name: { es: "Quindío Travel", en: "Quindio Travel" },
        coords: [3680, 4930],
        realCoords: "4.5170,-75.6560",
        phone: "+573100000000",
        description: {
            es: "Tu agencia de viajes para explorar el Quindío.",
            en: "Your travel agency to explore Quindío."
        },
        category: "Transporte",
        photo: "imagenes/pautas/pauta_quindio_travel.jpg",
        openHours: [8, 18]
    },
    {
        id: 32,
        name: { es: "Quindus", en: "Quindus" },
        coords: [3660, 4950],
        realCoords: "4.5160,-75.6570",
        phone: "+573126336143",
        description: {
            es: "Café, comida rápida y el mejor ambiente.",
            en: "Coffee, fast food and the best atmosphere."
        },
        category: "Gastronomía Local",
        photo: "imagenes/pautas/pauta_quindus.jpg",
        openHours: [8, 21]
    },
    {
        id: 33,
        name: { es: "Río", en: "Rio" },
        coords: [3640, 4970],
        realCoords: "4.5150,-75.6580",
        phone: "+573100000000",
        description: {
            es: "Conexión natural junto al río.",
            en: "Natural connection by the river."
        },
        category: "Naturaleza",
        photo: "imagenes/pautas/pauta_rio.jpg",
        openHours: [0, 24]
    },
    {
        id: 34,
        name: { es: "Tertulia", en: "Tertulia" },
        coords: [3620, 4990],
        realCoords: "4.5140,-75.6590",
        phone: "+573100000000",
        description: {
            es: "Un espacio para compartir y disfrutar del buen café.",
            en: "A space to share and enjoy good coffee."
        },
        category: "Gastronomía Local",
        photo: "imagenes/pautas/pauta_tertulia.jpg",
        openHours: [10, 22]
    },
    {
        id: 35,
        name: { es: "Ticlan", en: "Ticlan" },
        coords: [3600, 5010],
        realCoords: "4.5130,-75.6600",
        phone: "+573100000000",
        description: {
            es: "Gastronomía con identidad propia.",
            en: "Gastronomy with its own identity."
        },
        category: "Gastronomía Local",
        photo: "imagenes/pautas/pauta_ticlan.jpg",
        openHours: [12, 21]
    },
    {
        id: 36,
        name: { es: "Mapa Calarcá 2026", en: "Calarca Map 2026" },
        coords: [3580, 5030],
        realCoords: "4.5120,-75.6610",
        phone: "+573100000000",
        description: {
            es: "Información general y mapa detallado de la región.",
            en: "General information and detailed map of the region."
        },
        category: "Cultura",
        photo: "imagenes/pautas/pauta_mapa.jpg",
        openHours: [0, 24]
    }
];

const selectedInfo = document.getElementById('selected-info');
const favoritesContainer = document.getElementById('favorites-container');
const adsSidebar = document.getElementById('ads-sidebar');
const adsBanner = document.getElementById('ads-banner');
const sidebarOverlay = document.getElementById('sidebar-overlay');
const menuToggle = document.getElementById('menu-toggle');

let markers = [];

// Sidebar Toggle Logic
const toggleSidebar = () => {
    adsSidebar.classList.toggle('open');
    sidebarOverlay.classList.toggle('active');
};

if (menuToggle) menuToggle.addEventListener('click', toggleSidebar);
if (sidebarOverlay) sidebarOverlay.addEventListener('click', toggleSidebar);

// Favorites Logic
function toggleFavorite(id) {
    const index = favorites.indexOf(id);
    if (index === -1) {
        favorites.push(id);
    } else {
        favorites.splice(index, 1);
    }
    localStorage.setItem('calarca_favs', JSON.stringify(favorites));
    updateFavoritesUI();
    // Re-render current point if visible
    const currentPointId = document.querySelector('.selected-point')?.dataset.id;
    if (currentPointId == id) {
        const point = pointsOfInterest.find(p => p.id == id);
        renderPointDetails(point);
    }
}

function updateFavoritesUI() {
    if (!favoritesContainer) return;
    
    if (favorites.length === 0) {
        favoritesContainer.innerHTML = `<p style="font-size: 0.8rem; color: #888;">${translations[currentLang].noFavs}</p>`;
        return;
    }

    favoritesContainer.innerHTML = '';
    favorites.forEach(id => {
        const point = pointsOfInterest.find(p => p.id == id);
        if (point) {
            const div = document.createElement('div');
            div.className = 'fav-item animated fadeIn';
            div.innerHTML = `
                <img src="${point.photo}" alt="${point.name[currentLang]}">
                <p>${point.name[currentLang]}</p>
            `;
            div.onclick = () => {
                const zoomLevel = isMobile ? 0 : 1;
                map.flyTo(point.coords, zoomLevel);
                renderPointDetails(point);
            };
            favoritesContainer.appendChild(div);
        }
    });
}

function renderPointDetails(point) {
    selectedInfo.style.opacity = '0';
    
    // Asegurar que el sidebar esté abierto para mostrar la información
    if (!adsSidebar.classList.contains('open')) {
        toggleSidebar();
    }

    setTimeout(() => {
        const currentUrl = window.location.href;
        const shareText = encodeURIComponent(`¡Mira este lugar en Calarcá! 📍 ${point.name[currentLang]}: ${currentUrl}`);
        
        const openStatus = isOpen(point.openHours);
        const statusLabel = openStatus ? 
            `<span class="status-badge open">${translations[currentLang].openNow}</span>` : 
            `<span class="status-badge closed">${translations[currentLang].closed}</span>`;

        const isFav = favorites.includes(point.id);
        
        // Botones de acción directos: WhatsApp y Cómo llegar
        const phoneHtml = point.phone ? `
            <div class="action-grid">
                <a href="https://wa.me/${point.phone.replace(/\+/g, '')}?text=${encodeURIComponent('Hola, vi su anuncio en el Mapa Turístico Calarcá 2026 y me gustaría obtener más información.')}" target="_blank" class="action-btn whatsapp-btn">
                    💬 WhatsApp Directo
                </a>
                <a href="tel:${point.phone}" class="action-btn call-btn">
                    📞 Llamar
                </a>
            </div>
        ` : '';

        selectedInfo.innerHTML = `
            <div class="selected-point" data-id="${point.id}">
                <div class="pauta-full-view">
                    <img src="${point.photo}" class="point-header-img pauta-img" alt="${point.name[currentLang]}">
                </div>
                <div class="point-content">
                    <div class="point-title-row">
                        <h4>${point.name[currentLang]}</h4>
                        <button class="fav-btn ${isFav ? 'active' : ''}" onclick="toggleFavorite(${point.id})">
                            ${isFav ? '❤️' : '🤍'}
                        </button>
                    </div>
                    <div style="margin-bottom: 15px; display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
                        <span class="category-badge">${point.category}</span>
                        ${statusLabel}
                    </div>
                    <p style="margin-bottom: 20px; line-height: 1.6;">${point.description[currentLang]}</p>
                    <div class="point-actions-elaborated">
                        <a href="https://www.google.com/maps/dir/?api=1&destination=${point.realCoords}" target="_blank" class="action-btn nav-btn-full">
                            📍 Cómo llegar (GPS)
                        </a>
                        ${phoneHtml}
                    </div>
                </div>
            </div>
        `;
        selectedInfo.style.opacity = '1';
        
        // Hacer scroll suave hacia la información destacada en el sidebar
        selectedInfo.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 300);
}

// Language Switcher
document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        currentLang = e.target.dataset.lang;
        document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        
        // Update all labels
        document.getElementById('label-favorites').innerText = translations[currentLang].favorites;
        document.getElementById('label-search').innerText = translations[currentLang].labelSearch;
        document.getElementById('label-categories').innerText = translations[currentLang].labelCategories;
        document.getElementById('label-highlighted').innerText = translations[currentLang].labelHighlighted;
        document.getElementById('label-install').innerText = translations[currentLang].labelInstall;
        document.getElementById('label-share').innerText = translations[currentLang].labelShare;
        
        document.getElementById('search-input').placeholder = translations[currentLang].searchPlaceholder;
        document.querySelector('.share-text').innerText = translations[currentLang].scanMe;
        document.getElementById('copy-link').innerText = translations[currentLang].copyLink;
        document.getElementById('download-qr').innerText = translations[currentLang].downloadQR;
        document.querySelector('.install-text').innerText = translations[currentLang].installText;
        document.getElementById('install-button').innerText = translations[currentLang].installBtn;
        
        updateFavoritesUI();
        displayMarkers();
        
        // If there's a welcome message or point details, update them
        const isWelcome = selectedInfo.querySelector('.welcome-msg');
        if (isWelcome) {
            renderWelcome();
        } else {
            const currentPointId = document.querySelector('.selected-point')?.dataset.id;
            if (currentPointId) {
                const point = pointsOfInterest.find(p => p.id == currentPointId);
                renderPointDetails(point);
            }
        }
    });
});

function renderWelcome() {
    selectedInfo.innerHTML = `
        <div class="welcome-msg" style="padding: 20px; text-align: center;">
            <p style="font-weight: 600; color: var(--primary-color); font-size: 1.4rem;">${translations[currentLang].welcome}</p>
            <p>${translations[currentLang].explore}</p>
            <small style="display: block; margin-top: 10px; color: #777;">${translations[currentLang].clickMarker}</small>
        </div>
    `;
}

// Function to get icon based on category
function getCategoryIcon(category) {
    let iconUrl;
    
    switch(category) {
        case 'Cultura':
            iconUrl = 'imagenes/casillas_info/casillas_atractivos.jpg';
            break;
        case 'Naturaleza':
            iconUrl = 'imagenes/casillas_info/casillas_atractivos.jpg';
            break;
        case 'Aventura':
            iconUrl = 'imagenes/casillas_info/casillas_agencias.jpg';
            break;
        case 'Hospedaje Rural':
            iconUrl = 'imagenes/casillas_info/casillas_alojamiento.jpg';
            break;
        case 'Hospedaje Urbano':
            iconUrl = 'imagenes/casillas_info/casillas_alojamiento.jpg';
            break;
        case 'Gastronomía Local':
            iconUrl = 'imagenes/casillas_info/casillas_restaurantes.jpg';
            break;
        case 'Gastronomía Internacional':
            iconUrl = 'imagenes/casillas_info/casillas_pizeria.jpg';
            break;
        case 'Gastronomía de Mar':
            iconUrl = 'imagenes/casillas_info/casillas_restaurantes.jpg';
            break;
        case 'Comercio':
            iconUrl = 'imagenes/casillas_info/casillas tiendas de cafe.jpg';
            break;
        case 'Transporte':
            iconUrl = 'imagenes/casillas_info/casillas_taxis.jpg';
            break;
        case 'Centros Comerciales':
            iconUrl = 'imagenes/casillas_info/casillas tiendas de cafe.jpg';
            break;
        case 'Servicios':
            iconUrl = 'imagenes/casillas_info/casillas_alcaldia.jpg';
            break;
        case 'Recreación':
            iconUrl = 'imagenes/casillas_info/casillas_atractivos.jpg';
            break;
        default:
            iconUrl = 'imagenes/LOGO CALARCA 2026.jpg';
    }

    return L.icon({
        iconUrl: iconUrl,
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40],
        className: 'custom-marker-icon'
    });
}

// Function to check if a place is open
function isOpen(hours) {
    if (!hours) return true;
    const now = new Date();
    const hour = now.getHours();
    return hour >= hours[0] && hour < hours[1];
}

// Custom Elaborated Marker Icon with Category Image
function createElaboratedIcon(point) {
    const categoryIcon = getCategoryIcon(point.category).options.iconUrl;
    
    return L.divIcon({
        html: `
            <div class="elaborated-marker">
                <div class="marker-id">${point.id}</div>
                <div class="marker-thumb" style="background-image: url('${categoryIcon}')"></div>
                <div class="marker-pin"></div>
            </div>
        `,
        className: 'custom-marker-container',
        iconSize: [50, 60],
        iconAnchor: [25, 60],
        popupAnchor: [0, -60]
    });
}

// Helper function to add a single marker
function addMarker(point) {
    const icon = createElaboratedIcon(point);

    const marker = L.marker(point.coords, {
        icon: icon
    }).addTo(map);
    
    // Popup personalizado más elegante
    const popupContent = `
        <div class="modern-popup">
            <div class="popup-thumb" style="background-image: url('${point.photo}')"></div>
            <div class="popup-info">
                <b>${point.name[currentLang]}</b>
                <p>${point.category}</p>
            </div>
        </div>
    `;
    
    marker.bindPopup(popupContent, {
        closeButton: false,
        autoPanPadding: [50, 50],
        className: 'leaflet-custom-popup'
    });

    marker.on('click', () => {
        renderPointDetails(point);

        if (isMobile && !adsSidebar.classList.contains('open')) {
            toggleSidebar();
        }
    });
    markers.push(marker);
}

// Update displayMarkers to use addMarker
function displayMarkers(category = 'todos') {
    markers.forEach(m => map.removeLayer(m));
    markers = [];

    pointsOfInterest.forEach(point => {
        if (category === 'todos' || point.category === category) {
            addMarker(point);
        }
    });
}

// Function to get color based on category
function getCategoryColor(category) {
    switch(category) {
        case 'Cultura': return '#e67e22';
        case 'Naturaleza': return '#27ae60';
        case 'Aventura': return '#d35400';
        case 'Hospedaje Rural': return '#8e44ad';
        case 'Hospedaje Urbano': return '#2c3e50';
        case 'Gastronomía Local': return '#c0392b';
        case 'Gastronomía Internacional': return '#e74c3c';
        case 'Gastronomía de Mar': return '#3498db';
        case 'Comercio': return '#f39c12';
        case 'Transporte': return '#7f8c8d';
        case 'Centros Comerciales': return '#16a085';
        case 'Servicios': return '#2980b9';
        case 'Recreación': return '#f1c40f';
        default: return '#27ae60';
    }
}

// Pautas publicitarias para el banner superior - Incluimos todas las disponibles
const pautasPublicitarias = [
    { id: 5, photo: "imagenes/pautas/pauta_recuca.jpg" },
    { id: 10, photo: "imagenes/pautas/pauta_fercho.jpg" },
    { id: 11, photo: "imagenes/pautas/pauta_san_miguel.jpeg" },
    { id: 12, photo: "imagenes/pautas/pauta_alcaldia.jpg" },
    { id: 13, photo: "imagenes/pautas/pauta_quinti.jpg" },
    { id: 14, photo: "imagenes/pautas/pauta_raiz.jpg" },
    { id: 15, photo: "imagenes/pautas/pauta_talanquera.jpg" },
    { id: 16, photo: "imagenes/pautas/pauta_comaparado.jpg" },
    { id: 17, photo: "imagenes/pautas/pauta_albania.jpg" },
    { id: 18, photo: "imagenes/pautas/pauta_alemania.jpg" },
    { id: 19, photo: "imagenes/pautas/pauta_amaranta.jpg" },
    { id: 20, photo: "imagenes/pautas/pauta_bendito.jpg" },
    { id: 21, photo: "imagenes/pautas/pauta_bisonte.jpg" },
    { id: 22, photo: "imagenes/pautas/pauta_chaparral.jpg" },
    { id: 23, photo: "imagenes/pautas/pauta_confia.jpg" },
    { id: 24, photo: "imagenes/pautas/pauta_coomocal.jpg" },
    { id: 25, photo: "imagenes/pautas/pauta_descanso.jpg" },
    { id: 26, photo: "imagenes/pautas/pauta_domo.jpg" },
    { id: 27, photo: "imagenes/pautas/pauta_marta.jpg" },
    { id: 28, photo: "imagenes/pautas/pauta_master.jpg" },
    { id: 29, photo: "imagenes/pautas/pauta_origen.jpg" },
    { id: 30, photo: "imagenes/pautas/pauta_peñas.jpg" },
    { id: 31, photo: "imagenes/pautas/pauta_quindio_travel.jpg" },
    { id: 32, photo: "imagenes/pautas/pauta_quindus.jpg" },
    { id: 33, photo: "imagenes/pautas/pauta_rio.jpg" },
    { id: 34, photo: "imagenes/pautas/pauta_tertulia.jpg" },
    { id: 35, photo: "imagenes/pautas/pauta_ticlan.jpg" },
    { id: 36, photo: "imagenes/pautas/pauta_mapa.jpg" }
];

function renderAdsBanner() {
    const banner = document.getElementById('ads-banner');
    if (!banner) return;
    
    banner.innerHTML = '';
    
    // Botón de minimizar/maximizar
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'ads-banner-toggle';
    toggleBtn.innerHTML = '✕';
    toggleBtn.title = "Minimizar/Maximizar publicidad";
    toggleBtn.onclick = (e) => {
        e.stopPropagation();
        banner.classList.toggle('minimized');
        toggleBtn.innerHTML = banner.classList.contains('minimized') ? '➕' : '✕';
        
        // Si está minimizado, agregar texto guía
        if (banner.classList.contains('minimized')) {
            const guide = document.createElement('span');
            guide.className = 'banner-guide-text';
            guide.innerText = currentLang === 'es' ? ' Publicidad' : ' Ads';
            guide.style.fontSize = '12px';
            guide.style.marginLeft = '10px';
            banner.appendChild(guide);
        } else {
            renderAdsBanner(); // Re-renderizar para limpiar texto guía y mostrar items
        }
    };
    banner.appendChild(toggleBtn);

    pautasPublicitarias.forEach(pauta => {
        const point = pointsOfInterest.find(p => p.id === pauta.id);
        const div = document.createElement('div');
        div.className = 'ad-item';
        div.innerHTML = `<img src="${pauta.photo}" alt="Pauta ${pauta.id}" onerror="this.src='imagenes/LOGO CALARCA 2026.jpg'">`;
        
        div.onclick = () => {
            if (point) {
                map.flyTo(point.coords, isMobile ? 0 : 1, {
                    animate: true,
                    duration: 1.5
                });
                
                // Mostrar los detalles (ficha de información)
                renderPointDetails(point);
                
                // Abrir el sidebar para mostrar los detalles si está cerrado (especialmente en móvil)
                if (!adsSidebar.classList.contains('open')) {
                    toggleSidebar();
                }

                // Si hay un marcador asociado, abrir su popup para resaltar la ubicación
                const marker = markers.find(m => m.getLatLng().lat === point.coords[0] && m.getLatLng().lng === point.coords[1]);
                if (marker) {
                    marker.openPopup();
                }
            }
        };
        banner.appendChild(div);
    });

    // Activar scroll horizontal solo si es necesario (cuando el contenido excede el ancho)
    if (banner.scrollWidth > banner.clientWidth) {
        banner.style.overflowX = 'auto';
        banner.style.scrollbarWidth = 'thin'; // Restaurar scrollbar si desborda
    }
}

// Initial Render
renderWelcome();
updateFavoritesUI();
displayMarkers();
renderAdsBanner();

// Search Logic
function setupSearch() {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            markers.forEach(m => map.removeLayer(m));
            markers = [];

            pointsOfInterest.forEach(point => {
                const name = point.name[currentLang].toLowerCase();
                const desc = point.description[currentLang].toLowerCase();
                if (name.includes(term) || desc.includes(term)) {
                    addMarker(point);
                }
            });
        });
    }
}

setupSearch();

// Filter Logic
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        displayMarkers(e.target.dataset.category);
        
        // On mobile, close sidebar after selecting a category to see the map
        if (isMobile && adsSidebar.classList.contains('open')) {
            toggleSidebar(); 
        }
    });
});

// Coordinate Helper
const coordsDiv = document.getElementById('coords');
const updateCoords = (e) => {
    const coord = isMobile ? (e.target.getLatLng ? e.target.getLatLng() : e.latlng) : e.latlng;
    if (coord) {
        const lat = coord.lat.toFixed(1);
        const lng = coord.lng.toFixed(1);
        coordsDiv.innerText = `[${lat}, ${lng}]`;
    }
};

map.on('click', updateCoords);
if (!isMobile) {
    map.on('mousemove', updateCoords);
}

// Funcionalidad de descarga de QR (ahora descarga la imagen estática pautaQR.jpg)
const setupQRDownload = () => {
    const downloadBtn = document.getElementById('download-qr');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            const qrImg = document.getElementById('qr-img');
            if (qrImg) {
                // Creamos un link temporal para la descarga
                const link = document.createElement('a');
                link.href = qrImg.src;
                link.download = 'QR-Calarca-2026.jpg';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        });
    }
};

// Funcionalidad de copiar enlace
const setupCopyLink = () => {
    const copyBtn = document.getElementById('copy-link');
    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            const currentUrl = window.location.href;
            navigator.clipboard.writeText(currentUrl).then(() => {
                const originalText = copyBtn.innerText;
                copyBtn.innerText = translations[currentLang].copied;
                copyBtn.style.background = '#2ecc71';
                
                setTimeout(() => {
                    copyBtn.innerText = originalText;
                    copyBtn.style.background = '';
                }, 2000);
            }).catch(err => {
                console.error('Error al copiar: ', err);
            });
        });
    }
};

// Inicializar funciones de compartir (generateQR removida)
setupQRDownload();
setupCopyLink();

// Función de Clima Real
const fetchWeather = async () => {
    try {
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=4.53&longitude=-75.64&current_weather=true`);
        const data = await response.json();
        const temp = Math.round(data.current_weather.temperature);
        const code = data.current_weather.weathercode;
        
        const weatherDesc = {
            0: "Cielo despejado",
            1: "Principalmente despejado", 2: "Parcialmente nublado", 3: "Nublado",
            45: "Niebla", 48: "Niebla escarchada",
            51: "Llovizna ligera", 53: "Llovizna moderada", 55: "Llovizna densa",
            61: "Lluvia ligera", 63: "Lluvia moderada", 65: "Lluvia fuerte",
            80: "Chubascos ligeros", 81: "Chubascos moderados", 82: "Chubascos violentos"
        };

        document.getElementById('weather-info').innerHTML = `
            <span class="weather-temp">${temp}°C</span>
            <span class="weather-desc">${weatherDesc[code] || "Calarcá, Quindío"}</span>
        `;
    } catch (error) {
        console.log("Error al cargar clima", error);
        document.getElementById('weather-info').innerHTML = `
            <span class="weather-temp">--°C</span>
            <span class="weather-desc">Sin conexión al clima</span>
        `;
    }
};

fetchWeather();
setInterval(fetchWeather, 600000); // Actualizar cada 10 min

// Logic for My Location
const locationBtn = document.getElementById('location-btn');
let userLocationMarker;

if (locationBtn) {
    locationBtn.addEventListener('click', () => {
        if (!navigator.geolocation) {
            alert("Tu navegador no soporta geolocalización");
            return;
        }

        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            // Nota: Aquí hay un reto, el mapa es una imagen (CRS.Simple), 
            // no podemos poner la ubicación GPS real directamente sin una conversión.
            // Por ahora, mostraremos un mensaje o intentaremos centrar si estuviéramos en coordenadas reales.
            // Como recomendación, esto funciona mejor en mapas con coordenadas geográficas.
            alert(`Tu ubicación real es: ${latitude}, ${longitude}. ¡Estás en Calarcá!`);
        }, () => {
            alert("No se pudo obtener tu ubicación");
        });
    });
}

// Logic for PWA Installation
let deferredPrompt;
const installSection = document.getElementById('install-section');
const installButton = document.getElementById('install-button');

// Detectar si es iOS
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

// Mostrar sección si es móvil o si se dispara el prompt
if (isMobile || isIOS) {
    if (installSection) installSection.style.display = 'block';
    if (isIOS && installButton) {
        installButton.innerText = "📲 ¿Cómo instalar?";
    }
}

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if (installSection) installSection.style.display = 'block';
    if (installButton) installButton.innerText = "📲 Descargar App Mapa Calarcá 2026";
});

if (installButton) {
    installButton.addEventListener('click', async () => {
        if (isIOS) {
            alert("Para instalar en iPhone/iPad:\n1. Toca el botón 'Compartir' (el cuadro con flecha arriba).\n2. Desliza hacia abajo y toca 'Añadir a la pantalla de inicio'.");
            return;
        }

        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            console.log(`Usuario eligió instalar: ${outcome}`);
            deferredPrompt = null;
            if (installSection) installSection.style.display = 'none';
        } else {
            alert("Tu navegador ya tiene la App instalada o no soporta descarga directa. Busca la opción 'Instalar' en el menú de tu navegador.");
        }
    });
}

window.addEventListener('appinstalled', () => {
    console.log('App instalada con éxito');
    if (installSection) installSection.style.display = 'none';
});

// Initial Device Info in Console
console.log(`Versión: 2.0 - Device: ${isMobile ? 'Mobile' : 'PC'}, Touch: ${isTouchDevice}`);

// Service Worker Registration for PWA with enhanced update logic
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js?v=42')
            .then(registration => {
                console.log('SW registrado con éxito:', registration.scope);
                
                // Detectar actualizaciones de SW
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            // Nueva versión disponible
                            console.log('Nueva versión disponible. Recargando...');
                            if (confirm('Nueva versión del mapa disponible. ¿Deseas actualizar ahora?')) {
                                window.location.reload();
                            }
                        }
                    });
                });
            })
            .catch(err => console.log('SW registro fallido:', err));
    });
}
