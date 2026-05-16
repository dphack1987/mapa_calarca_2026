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
    zoomControl: true,
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

// Pautas publicitarias - Todas visibles con información detallada
const pautasPublicitarias = [
    { 
        id: 13, 
        photo: "imagenes/pautas/pauta_quindus.jpg",
        nombre: "Quindus Café",
        ubicacion: "km 4 via al valle la Bella",
        contacto: "312 633 61 43",
        categoria: "Restaurantes, Comidas Rápidas y Asados"
    },
    { 
        id: 14, 
        photo: "imagenes/pautas/pauta_raiz.jpg",
        nombre: "Coma parado",
        ubicacion: "calle 41 nro 25-37 Calarcá",
        contacto: "305 353 59 59",
        categoria: "Restaurantes, Comidas Rápidas y Asados"
    },
    { 
        id: 17, 
        photo: "imagenes/pautas/pauta_origen.jpg",
        nombre: "Café Origen Bar y Restaurante",
        ubicacion: "Carrera 25 Nro 40-25 Calarcá",
        contacto: "301 857 2792",
        categoria: "Restaurantes, Comidas Rápidas y Asados"
    },
    { 
        id: 24, 
        photo: "imagenes/pautas/pauta_amaranta.jpg",
        nombre: "Amaranta libros Café",
        ubicacion: "calle 40 Nro. 22-16 Calarcá",
        contacto: "320 6590103",
        categoria: "Libros y Café"
    },
    { 
        id: 18, 
        photo: "imagenes/pautas/pauta_raiz.jpg",
        nombre: "Café Raiz Coffee",
        ubicacion: "Cra 24 Nro. 41-29",
        contacto: "311 518 8564",
        categoria: "Restaurantes, Comidas Rápidas y Asados"
    },
    { 
        id: 5, 
        photo: "imagenes/pautas/pauta_recuca.jpg",
        nombre: "RECUCA - Recorrido de la cultura cafetera",
        ubicacion: "Vía Vda. Calle Larga, Calarcá",
        contacto: "3108303779",
        categoria: "Atractivos Turísticos"
    },
    { 
        id: 10, 
        photo: "imagenes/pautas/pauta_fercho.jpg",
        nombre: "Comidas rapidas Donde fercho",
        ubicacion: "calle 37 nro 24-52 Calarcá",
        contacto: "310 502 5670",
        categoria: "Restaurantes, Comidas Rápidas y Asados"
    },
    { 
        id: 28, 
        photo: "imagenes/pautas/pauta_master.jpg",
        nombre: "Master Rancho Gourmet",
        ubicacion: "calle 42 nro. 23 -43 Calarcá",
        contacto: "310 8052860",
        categoria: "Restaurantes, Comidas Rápidas y Asados"
    },
    { 
        id: 11, 
        photo: "imagenes/pautas/pauta_san_miguel.jpeg",
        nombre: "Finca hotel San Miguel",
        ubicacion: "Vereda la Bella, Vía quebrada Negra, Calarcá",
        contacto: "310 4495532",
        categoria: "Alojamiento"
    },
    { 
        id: 12, 
        photo: "imagenes/pautas/pauta_alcaldia.jpg",
        nombre: "Alcaldía de Calarcá",
        ubicacion: "Centro de Calarcá",
        contacto: "",
        descripcion: "Calarca - Capital Mundial de las Mariposas",
        categoria: "Servicios"
    },
    { 
        id: 32, 
        photo: "imagenes/pautas/pauta_alemania.jpg",
        nombre: "La Alemania Chalet",
        ubicacion: "Vereda Calle Larga, Calarcá",
        contacto: "323 444 4450",
        categoria: "Alojamiento"
    },
    { 
        id: 33, 
        photo: "imagenes/pautas/pauta_chaparral.jpg",
        nombre: "Hotel el Gran Chaparral",
        ubicacion: "Vereda la Bella Km 4 Calarcá",
        contacto: "315 313 0782",
        categoria: "Alojamiento"
    },
    { 
        id: 34, 
        photo: "imagenes/pautas/pauta_descanso.jpg",
        nombre: "Finca Hotel el Descanso",
        ubicacion: "Vereda Puerto Rico Km 3 Calarcá",
        contacto: "315 343 3602",
        categoria: "Alojamiento"
    },
    { 
        id: 15, 
        photo: "imagenes/pautas/pauta_talanquera.jpg",
        nombre: "Asadero la Talanquera Carne a la llanera",
        ubicacion: "Carrera 24 Nro 42- 15",
        contacto: "321 9598257",
        categoria: "Parrillas"
    },
    { 
        id: 16, 
        photo: "imagenes/pautas/pauta_comaparado.jpg",
        nombre: "Comaparado",
        ubicacion: "Calarcá",
        contacto: "315 272 1971",
        categoria: "Comercio"
    },
    { 
        id: 20, 
        photo: "imagenes/pautas/pauta_bendito.jpg",
        nombre: "Bendito Pekado",
        ubicacion: "Cra 24 nro 40-65 Calarcá",
        contacto: "321 354 3541",
        categoria: "Pizzerías"
    },
    { 
        id: 19, 
        photo: "imagenes/pautas/pauta_bisonte.jpg",
        nombre: "Bisonte Parrilla Bar",
        ubicacion: "Carrera 24 Nro 44-10 Calarcá",
        contacto: "314 4618 773",
        categoria: "Parrillas"
    },
    { 
        id: 22, 
        photo: "imagenes/pautas/pauta_chaparral.jpg",
        nombre: "Chaparral",
        ubicacion: "Calarcá",
        contacto: "",
        categoria: "Restaurantes"
    },
    { 
        id: 23, 
        photo: "imagenes/pautas/pauta_confia.jpg",
        nombre: "Confía",
        ubicacion: "Calarcá",
        contacto: "",
        categoria: "Servicios"
    },
    { 
        id: 40, 
        photo: "imagenes/pautas/pauta_coomocal.jpg",
        nombre: "COOMOCAL",
        ubicacion: "calle 40 nro. 25- 61 calarcá",
        contacto: "315 755 43 43",
        categoria: "Transporte y Taxis"
    },
    { 
        id: 25, 
        photo: "imagenes/pautas/pauta_descanso.jpg",
        nombre: "Descanso",
        ubicacion: "Calarcá",
        contacto: "",
        categoria: "Alojamiento"
    },
    { 
        id: 26, 
        photo: "imagenes/pautas/pauta_domo.jpg",
        nombre: "El Domo aves y café",
        ubicacion: "la Bella, Calarcá",
        contacto: "323 4086 675",
        categoria: "Atractivos Turísticos"
    },
    { 
        id: 27, 
        photo: "imagenes/pautas/pauta_marta.jpg",
        nombre: "Finca Turística Martha Cecilia",
        ubicacion: "km 3 Alto del Río Calarcá",
        contacto: "312 721 4550",
        categoria: "Alojamiento"
    },
    { 
        id: 29, 
        photo: "imagenes/pautas/pauta_tertulia.jpg",
        nombre: "La Tertulia Café",
        ubicacion: "Calle 40 Cra 25 Esquina Plaza de Bolívar",
        contacto: "3154053802",
        categoria: "Escuela de Café y Tostadora"
    },
    { 
        id: 30, 
        photo: "imagenes/pautas/pauta_peñas.jpg",
        nombre: "Ecoparque Peñas Blancas",
        ubicacion: "Corregimiento de La Virginia, Calarcá",
        contacto: "310 396 7951",
        categoria: "Atractivos Turísticos"
    },
    { 
        id: 31, 
        photo: "imagenes/pautas/pauta_quindio_travel.jpg",
        nombre: "Quindío Travel",
        ubicacion: "Calarcá",
        contacto: "",
        categoria: "Transporte"
    },
    { 
        id: 6, 
        photo: "imagenes/pautas/pauta_albania.jpg",
        nombre: "Centro Recreativo La Nueva Albania",
        ubicacion: "KM 6 Vía Calarca - Barcelona",
        contacto: "3117179148",
        horario: "Lunes a Domingo: 9:00 AM a 5:00 PM",
        categoria: "Atractivos Turísticos"
    },
    { 
        id: 7, 
        photo: "imagenes/pautas/pauta_rio.jpg",
        nombre: "Mirador Café del Río",
        ubicacion: "Variante Chaguala, Km 2, Vereda Buenos Aires Bajo, Calarcá",
        contacto: "315 291 79 14",
        categoria: "Atractivos Turísticos"
    },
    { 
        id: 35, 
        photo: "imagenes/pautas/pauta_ticlan.jpg",
        nombre: "San Juan de Ticlán",
        ubicacion: "Vía Barcelona, Calarcá",
        contacto: "310 468 0227",
        categoria: "Alojamiento"
    },
    { 
        id: 36, 
        photo: "imagenes/pautas/pauta_mapa.jpg",
        nombre: "Mapa Calarcá 2026",
        ubicacion: "Calarcá",
        contacto: "",
        categoria: "Información"
    }
];

// Renderizar pautas publicitarias
function renderAdsBanner() {
    const banner = document.getElementById('ads-banner');
    if (!banner) {
        console.log('No se encontró el banner de pautas');
        return;
    }
    
    console.log('Renderizando', pautasPublicitarias.length, 'pautas');
    
    banner.innerHTML = '';
    pautasPublicitarias.forEach((pauta, index) => {
        const adItem = document.createElement('div');
        adItem.className = 'ad-item';
        adItem.innerHTML = `<img src="${pauta.photo}" alt="Pauta ${pauta.id}" loading="lazy">`;
        adItem.style.minHeight = '160px';
        adItem.style.cursor = 'pointer';
        adItem.style.zIndex = '10';
        
        // Agregar evento de clic para abrir el modal
        adItem.addEventListener('click', (e) => {
            console.log('Clic en pauta', index + 1, ':', pauta.id);
            e.stopPropagation();
            abrirModalPauta(pauta);
        });
        
        banner.appendChild(adItem);
    });
}

// Función para abrir el modal con la información de la pauta
function abrirModalPauta(pauta) {
    console.log('Abriendo modal para pauta:', pauta);
    const modal = document.getElementById('pauta-modal');
    const modalBody = document.getElementById('pauta-modal-body');
    
    if (!modal || !modalBody) {
        console.log('No se encontró el modal o el cuerpo del modal');
        return;
    }
    
    // Construir el contenido del modal
    let contenido = `<img src="${pauta.photo}" alt="${pauta.nombre || 'Pauta'}" class="pauta-modal-image">`;
    
    if (pauta.categoria) {
        contenido += `<div style="display: inline-block; background: var(--primary-color); color: white; padding: 4px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: 600; margin-bottom: 15px;">${pauta.categoria}</div>`;
    }
    
    if (pauta.nombre) {
        contenido += `<h2 class="pauta-modal-title">${pauta.nombre}</h2>`;
    }
    
    if (pauta.ubicacion) {
        contenido += `
            <div class="pauta-modal-info">
                <span class="pauta-modal-info-label">📍 Ubicación:</span>
                <span class="pauta-modal-info-value">${pauta.ubicacion}</span>
            </div>
        `;
    }
    
    if (pauta.contacto) {
        contenido += `
            <div class="pauta-modal-info">
                <span class="pauta-modal-info-label">📞 Contacto:</span>
                <span class="pauta-modal-info-value">${pauta.contacto}</span>
            </div>
        `;
    }
    
    if (pauta.horario) {
        contenido += `
            <div class="pauta-modal-info">
                <span class="pauta-modal-info-label">⏰ Horario:</span>
                <span class="pauta-modal-info-value">${pauta.horario}</span>
            </div>
        `;
    }
    
    if (pauta.redes) {
        contenido += `
            <div class="pauta-modal-info">
                <span class="pauta-modal-info-label">📱 Redes:</span>
                <span class="pauta-modal-info-value">${pauta.redes}</span>
            </div>
        `;
    }
    
    if (pauta.codigoDescuento) {
        contenido += `
            <div class="pauta-modal-info">
                <span class="pauta-modal-info-label">🎁 Código:</span>
                <span class="pauta-modal-info-value" style="font-weight: 800; color: var(--primary-color);">${pauta.codigoDescuento}</span>
            </div>
        `;
    }
    
    if (pauta.descripcion) {
        contenido += `<p class="pauta-modal-descripcion">${pauta.descripcion}</p>`;
    }
    
    modalBody.innerHTML = contenido;
    modal.style.display = 'block';
    modal.style.zIndex = '5000';
    console.log('Modal abierto correctamente');
}

// Llamar a renderizar pautas y configurar eventos cuando la página cargue
window.addEventListener('load', () => {
    renderAdsBanner();
    
    // Cerrar modal al hacer clic en la X
    const closeModalBtn = document.querySelector('.pauta-modal-close');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            const modal = document.getElementById('pauta-modal');
            if (modal) modal.style.display = 'none';
        });
    }
    
    // Cerrar modal al hacer clic fuera
    window.addEventListener('click', (event) => {
        const modal = document.getElementById('pauta-modal');
        if (modal && event.target === modal) {
            modal.style.display = 'none';
        }
    });
});

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
