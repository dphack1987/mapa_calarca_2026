// Dimensions of the image (Initial placeholders)
let imgWidth = 2000;
let imgHeight = 1500;
let bounds = [[0, 0], [imgHeight, imgWidth]];

// Device Detection
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

// Map Initialization with refined zoom
const map = L.map('map', {
    crs: L.CRS.Simple,
    minZoom: isMobile ? -2 : -1.5,
    maxZoom: 2, // Bajamos ligeramente para mantener la nitidez nativa
    zoomSnap: 0,
    wheelDebounceTime: 30,
    attributionControl: false,
    maxBoundsViscosity: 1.0,
    tap: !isMobile,
    dragging: !isMobile || (isMobile && !isTouchDevice),
    bounceAtZoomLimits: false,
    preferCanvas: true // Mejora el rendimiento general
});

// Load the image to get its actual dimensions
const mapImage = new Image();
mapImage.src = 'imagenes/calarca 2026 mapa cara 2.jpg';
mapImage.onload = function() {
    imgWidth = this.width;
    imgHeight = this.height;
    bounds = [[0, 0], [imgHeight, imgWidth]];
    
    // Add the image overlay with actual dimensions
    const overlay = L.imageOverlay(this.src, bounds, {
        interactive: true,
        className: 'high-res-layer'
    }).addTo(map);
    map.setMaxBounds(bounds);
    map.fitBounds(bounds);
    
    console.log(`Mapa cargado: ${imgWidth}x${imgHeight}px`);
     
     // Adjust dragging for mobile (double finger pan vs single finger)
     if (isMobile && isTouchDevice) {
         map.dragging.disable();
         map.dragging.enable();
     }
 };

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
        coords: [950, 1010],
        realCoords: "4.5302,-75.6418",
        description: { 
            es: "El corazón de la 'Villa del Cacique'. Un espacio vibrante rodeado de arquitectura cafetera tradicional, donde locales y turistas se reúnen para disfrutar de un buen café, la brisa de la tarde y eventos culturales. Es el punto de partida ideal para explorar la ciudad.",
            en: "The heart of the 'Villa del Cacique'. A vibrant space surrounded by traditional coffee architecture, where locals and tourists gather to enjoy good coffee, the afternoon breeze, and cultural events. It is the ideal starting point to explore the city."
        },
        category: "Cultura",
        photo: "imagenes/LOGO CALARCA 2026.jpg",
        openHours: [0, 24]
    },
    {
        id: 2,
        name: { es: "Jardín Botánico del Quindío", en: "Quindio Botanical Garden" },
        coords: [650, 880],
        realCoords: "4.5422,-75.6567",
        description: {
            es: "Hogar del famoso mariposario y una colección increíble de palmas y flora regional. Un lugar imperdible para los amantes de la naturaleza y la fotografía.",
            en: "Home to the famous butterfly garden and an incredible collection of palms and regional flora. A must-see for nature and photography lovers."
        },
        category: "Naturaleza",
        photo: "imagenes/LOGO CALARCA 2026.jpg",
        openHours: [9, 16]
    },
    {
        id: 3,
        name: { es: "Peñas Blancas", en: "White Rocks" },
        coords: [820, 1600],
        realCoords: "4.5150,-75.6000",
        description: {
            es: "Majestuosa formación rocosa para los amantes del senderismo y la escalada. Ofrece una de las mejores vistas panorámicas de Calarcá y el Quindío.",
            en: "Majestic rock formation for hiking and climbing lovers. It offers one of the best panoramic views of Calarcá and Quindio."
        },
        category: "Aventura",
        photo: "imagenes/LOGO CALARCA 2026.jpg",
        openHours: [6, 17]
    },
    {
        id: 4,
        name: { es: "Corregimiento La Virginia", en: "La Virginia Village" },
        coords: [750, 1420],
        realCoords: "4.5100,-75.6100",
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
        description: {
            es: "Recorrido de la Cultura Cafetera. Vive la experiencia de ser caficultor por un día en una de las fincas más tradicionales de la región.",
            en: "Coffee Culture Tour. Live the experience of being a coffee farmer for a day in one of the most traditional farms in the region."
        },
        category: "Cultura",
        photo: "imagenes/LOGO CALARCA 2026.jpg",
        openHours: [9, 17]
    },
    {
        id: 6,
        name: { es: "Hospital La Misericordia", en: "La Misericordia Hospital" },
        coords: [980, 1080],
        realCoords: "4.5320,-75.6380",
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
        description: {
            es: "Punto de parada obligatorio para disfrutar de la mejor gastronomía local en la vía principal.",
            en: "A mandatory stop to enjoy the best local gastronomy on the main road."
        },
        category: "Gastronomía Local",
        photo: "imagenes/LOGO CALARCA 2026.jpg",
        openHours: [7, 20]
    }
];

const selectedInfo = document.getElementById('selected-info');
const favoritesContainer = document.getElementById('favorites-container');
const adsSidebar = document.getElementById('ads-sidebar');
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
                map.flyTo(point.coords, 1);
                renderPointDetails(point);
            };
            favoritesContainer.appendChild(div);
        }
    });
}

function renderPointDetails(point) {
    selectedInfo.style.opacity = '0';
    setTimeout(() => {
        const currentUrl = window.location.href;
        const shareText = encodeURIComponent(`¡Mira este lugar en Calarcá! 📍 ${point.name[currentLang]}: ${currentUrl}`);
        const whatsappUrl = `https://wa.me/?text=${shareText}`;
        
        const openStatus = isOpen(point.openHours);
        const statusLabel = openStatus ? 
            `<span class="status-badge open">${translations[currentLang].openNow}</span>` : 
            `<span class="status-badge closed">${translations[currentLang].closed}</span>`;

        const isFav = favorites.includes(point.id);

        selectedInfo.innerHTML = `
            <div class="selected-point" data-id="${point.id}">
                <img src="${point.photo}" class="point-header-img" alt="${point.name[currentLang]}">
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
                    <p>${point.description[currentLang]}</p>
                    <div class="point-actions">
                        <a href="https://www.google.com/maps/dir/?api=1&destination=${point.realCoords}" target="_blank" class="action-btn nav-btn">
                            ${translations[currentLang].howToGet}
                        </a>
                        <a href="${whatsappUrl}" target="_blank" class="action-btn whatsapp-btn">
                            💬 WhatsApp
                        </a>
                    </div>
                </div>
            </div>
        `;
        selectedInfo.style.opacity = '1';
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
            iconUrl = 'https://cdn-icons-png.flaticon.com/512/2921/2921471.png';
            break;
        case 'Naturaleza':
            iconUrl = 'https://cdn-icons-png.flaticon.com/512/3222/3222800.png';
            break;
        case 'Aventura':
            iconUrl = 'https://cdn-icons-png.flaticon.com/512/3050/3050511.png';
            break;
        case 'Hospedaje Rural':
            iconUrl = 'https://cdn-icons-png.flaticon.com/512/2163/2163350.png'; // Icono de cabaña/casa rural
            break;
        case 'Hospedaje Urbano':
            iconUrl = 'https://cdn-icons-png.flaticon.com/512/2329/2329895.png'; // Icono de hotel/edificio
            break;
        case 'Gastronomía Local':
            iconUrl = 'https://cdn-icons-png.flaticon.com/512/2737/2737034.png'; // Icono de comida tradicional
            break;
        case 'Gastronomía Internacional':
            iconUrl = 'https://cdn-icons-png.flaticon.com/512/3075/3075977.png'; // Icono de hamburguesa/pasta
            break;
        case 'Gastronomía de Mar':
            iconUrl = 'https://cdn-icons-png.flaticon.com/512/2927/2927347.png'; // Icono de pescado
            break;
        case 'Comercio':
            iconUrl = 'https://cdn-icons-png.flaticon.com/512/2331/2331970.png'; // Icono de tienda/bolsa
            break;
        case 'Transporte':
            iconUrl = 'https://cdn-icons-png.flaticon.com/512/2898/2898588.png'; // Icono de bus/transporte
            break;
        case 'Centros Comerciales':
            iconUrl = 'https://cdn-icons-png.flaticon.com/512/2331/2331966.png'; // Icono de mall
            break;
        case 'Servicios':
            iconUrl = 'https://cdn-icons-png.flaticon.com/512/1067/1067561.png'; // Icono de servicios/ayuda
            break;
        case 'Recreación':
            iconUrl = 'https://cdn-icons-png.flaticon.com/512/1802/1802956.png';
            break;
        default:
            iconUrl = 'https://cdn-icons-png.flaticon.com/512/684/684908.png';
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

// Helper function to add a single marker
function addMarker(point) {
    let icon;
    
    // Si el punto tiene un ID, creamos un icono circular con número
    if (point.id) {
        icon = L.divIcon({
            html: `<div class="marker-number-container">${point.id}</div>`,
            className: 'custom-marker-icon',
            iconSize: [40, 40],
            iconAnchor: [20, 40],
            popupAnchor: [0, -40]
        });
    } else {
        icon = getCategoryIcon(point.category);
    }

    const marker = L.marker(point.coords, {
        icon: icon
    }).addTo(map);
    
    // Popup personalizado más elegante
    const popupContent = `
        <div class="modern-popup">
            <b style="color: var(--primary-color); font-size: 1.1rem;">${point.name[currentLang]}</b>
            <p style="margin: 5px 0; font-size: 0.8rem; font-weight: 700; color: var(--accent-color); text-transform: uppercase;">${point.category}</p>
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

// Initial display
displayMarkers();

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

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(reg => console.log('Service Worker registrado'))
            .catch(err => console.log('Error al registrar Service Worker', err));
    });
}
