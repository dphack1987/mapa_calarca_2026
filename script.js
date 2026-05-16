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
    minZoom: isMobile ? -2 : -1.5,
    maxZoom: 2,
    zoomSnap: 0,
    attributionControl: false,
    preferCanvas: true
});

const mapImagePath = 'imagenes/mapa/mapa_principal.jpg';

// Load the image to get its actual dimensions
const mapImage = new Image();
mapImage.onload = function() {
    imgWidth = this.width;
    imgHeight = this.height;
    bounds = [[0, 0], [imgHeight, imgWidth]];
    
    // Add the image overlay with actual dimensions
    L.imageOverlay(mapImagePath, bounds).addTo(map);
    
    map.setMaxBounds(bounds);
    map.fitBounds(bounds);
    
    console.log(`Mapa de carpeta 'mapa' cargado correctamente: ${imgWidth}x${imgHeight}px`);
    
    // Forzar redibujado para evitar que se vea cortado
    setTimeout(() => {
        map.invalidateSize();
        displayMarkers();
    }, 100);
};
mapImage.src = mapImagePath;

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

// Points of interest - Only numbers and coordinates from photos
const pointsOfInterest = [
    { id: 4, coords: [1621.4, 3732.5] },
    { id: 5, coords: [790.8, 1984.4] },
    { id: 6, coords: [538.0, 1696.1] },
    { id: 11, coords: [1986.8, 3868.5] },
    { id: 7, coords: [2565.1, 2574.1] },
    { id: 8, coords: [956.5, 1949.8] },
    { id: 9, coords: [2072.6, 2856.1] },
    { id: 10, coords: [4869.9, 1826.7] },
    { id: 12, coords: [2035.0, 2850.3] },
    { id: 13, coords: [791.9, 1704.5] },
    { id: 14, coords: [2085.3, 2705.3] },
    { id: 15, coords: [1909.2, 2701.0] },
    { id: 16, coords: [2103.3, 2809.3] },
    { id: 17, coords: [2062.5, 2715.5] },
    { id: 18, coords: [2098.5, 2771.8] },
    { id: 19, coords: [2210.8, 2825.0] },
    { id: 20, coords: [2128.5, 2777.8] },
    { id: 21, coords: [2060.5, 2759.8] },
    { id: 28, coords: [2077.5, 2720.0] },
    { id: 24, coords: [2017.5, 2827.5] },
    { id: 29, coords: [2087.0, 2766.0] },
    { id: 30, coords: [1974.7, 2731.2] },
    { id: 34, coords: [1537.7, 3170.5] },
    { id: 35, coords: [2075.0, 2671.5] },
    { id: 36, coords: [926.0, 2113.3] },
    { id: 38, coords: [2700.0, 2211.5] },
    { id: 32, coords: [470.0, 1483.5] },
    { id: 33, coords: [784.5, 1771.8] },
    { id: 39, coords: [614.1, 1595.8] },
    { id: 40, coords: [2041.0, 2768.5] }
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

// Initialize selected info
if (selectedInfo) {
    selectedInfo.innerHTML = `
        <div class="welcome-msg">
            <p style="font-weight: 600; color: var(--primary-color);">¡Bienvenido!</p>
            <p style="font-size: 0.9rem; color: #444;">Toca un punto numerado en el mapa para ver su información.</p>
        </div>
    `;
}

// Function to add markers with numbers to map
function displayMarkers() {
    markers.forEach(m => map.removeLayer(m));
    markers = [];

    pointsOfInterest.forEach(point => {
        // Create custom icon with number
        const numberIcon = L.divIcon({
            className: 'custom-number-marker',
            html: `<div style="
                background-color: #27ae60;
                color: white;
                width: 36px;
                height: 36px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: 800;
                font-size: 16px;
                border: 3px solid white;
                box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            ">${point.id}</div>`,
            iconSize: [36, 36],
            iconAnchor: [18, 18]
        });

        const marker = L.marker(point.coords, { icon: numberIcon }).addTo(map);

        marker.bindPopup(`
            <div style="text-align: center; font-family: 'Poppins', sans-serif; padding: 10px;">
                <b style="display: block; margin-bottom: 5px; color: #27ae60; font-size: 1.2rem;">Punto ${point.id}</b>
            </div>
        `, {
            closeButton: false,
            autoPanPadding: [50, 50],
            className: 'modern-popup'
        });

        marker.on('click', () => {
            if (selectedInfo) {
                selectedInfo.innerHTML = `
                    <div class="selected-point">
                        <h4 style="color: #27ae60; font-size: 1.6rem; font-weight: 800; margin-bottom: 15px;">Punto ${point.id}</h4>
                        <p style="font-size: 0.95rem; line-height: 1.7; color: #444; margin-bottom: 20px;">Espera a que se agreguen los detalles de este punto.</p>
                    </div>
                `;
            }
            
            // On mobile, open the sidebar automatically
            if (window.innerWidth <= 900 && adsSidebar && !adsSidebar.classList.contains('open')) {
                toggleSidebar();
            }
        });

        markers.push(marker);
    });
}

// Filter buttons (basic functionality)
const filterBtns = document.querySelectorAll('.filter-btn');
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    });
});

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
}

function updateFavoritesUI() {
    if (!favoritesContainer) return;
    
    if (favorites.length === 0) {
        favoritesContainer.innerHTML = `<p style="font-size: 0.8rem; color: #888;">No has guardado lugares aún.</p>`;
        return;
    }

    favoritesContainer.innerHTML = '';
    favorites.forEach(id => {
        const point = pointsOfInterest.find(p => p.id == id);
        if (point) {
            const div = document.createElement('div');
            div.className = 'fav-item';
            div.innerHTML = `
                <p style="font-weight: 600;">Punto ${point.id}</p>
            `;
            div.onclick = () => {
                map.flyTo(point.coords, 1);
            };
            favoritesContainer.appendChild(div);
        }
    });
}

updateFavoritesUI();

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

// Pautas publicitarias - Todas visibles
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

// Renderizar pautas publicitarias
function renderAdsBanner() {
    const banner = document.getElementById('ads-banner');
    if (!banner) return;
    
    banner.innerHTML = '';
    pautasPublicitarias.forEach(pauta => {
        const adItem = document.createElement('div');
        adItem.className = 'ad-item';
        adItem.innerHTML = `<img src="${pauta.photo}" alt="Pauta ${pauta.id}" loading="lazy">`;
        adItem.style.minHeight = '160px';
        banner.appendChild(adItem);
    });
}

// Llamar a renderizar pautas cuando la página cargue
window.addEventListener('load', renderAdsBanner);

// Service Worker Registration for PWA - Sin recarga automática
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(registration => {
                console.log('SW registrado con éxito:', registration.scope);
            })
            .catch(err => console.log('SW registro fallido:', err));
    });
}
