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
    
    // Evento para mostrar coordenadas al hacer clic en el mapa
    map.on('click', function(e) {
        const x = e.latlng.lng.toFixed(1);
        const y = e.latlng.lat.toFixed(1);
        console.log(`Coordenadas (click): [${x}, ${y}]`);
        alert(`Coordenadas (x, y): [${x}, ${y}]`);
    });

    // Evento para mostrar coordenadas en tiempo real al mover el cursor
    map.on('mousemove', function(e) {
        const x = e.latlng.lng.toFixed(1);
        const y = e.latlng.lat.toFixed(1);
        const coordsElement = document.getElementById('coords');
        if (coordsElement) {
            coordsElement.textContent = `Coordenadas: [${x}, ${y}]`;
        }
        console.log(`Coordenadas (mover): [${x}, ${y}]`);
    });
    
    // Forzar redibujado para evitar que se vea cortado
    setTimeout(() => {
        map.invalidateSize();
        displayMarkers();
        // Ajustar zoom para que se vean los primeros 5 puntos
        const group = L.featureGroup(markers);
        if (markers.length > 0) {
            map.fitBounds(group.getBounds().pad(0.2));
        }
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

// Points of interest - PRIMEROS 5 PUNTOS (tarea 1)
const pointsOfInterest = [
    { 
        id: 1, 
        nombre: "Recuca - Recorrido de la cultura cafetera", 
        coords: [1716.8, 504.0],
        foto: "imagenes/pautas/pauta_recuca.jpg",
        ubicacion: "Vía Vda. Calle Larga, Calarcá",
        contacto: "3108303779"
    },
    { 
        id: 2, 
        nombre: "Ruta del Cacao", 
        coords: [1724.9, 469.1],
        foto: null,
        ubicacion: "Vía Vda. Calle Larga, Calarcá",
        contacto: "3108303779"
    },
    { 
        id: 3, 
        nombre: "Parque de la Montaña Quinti", 
        coords: [2370.2, 256.2],
        foto: null,
        ubicacion: "Cordoba, Quindío",
        contacto: "3126815139"
    },
    { 
        id: 4, 
        nombre: "Eco Parque Peñas Blancas", 
        coords: [4104.0, 1806.6],
        foto: null,
        ubicacion: "Corregimiento de La Virginia, Calarcá",
        contacto: "310 396 7951"
    },
    { 
        id: 5, 
        nombre: "El Domo Aves y Café", 
        coords: [2062.3, 849.4],
        foto: null,
        ubicacion: "La Bella, Calarcá",
        contacto: "323 4086 675"
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

// Initialize selected info
if (selectedInfo) {
    selectedInfo.innerHTML = `
        <div class="welcome-msg">
            <p style="font-weight: 600; color: var(--primary-color);">¡Bienvenido!</p>
            <p style="font-size: 0.9rem; color: #444;">Toca un punto numerado en el mapa para ver su información.</p>
        </div>
    `;
}

// Funciones para el Bottom Sheet
function abrirBottomSheet(point) {
    const bottomSheet = document.getElementById('bottom-sheet');
    const bottomSheetContent = document.getElementById('bottom-sheet-content');
    const overlay = document.getElementById('bottom-sheet-overlay');
    
    if (!bottomSheet || !bottomSheetContent || !overlay) return;
    
    const queryUbicacion = encodeURIComponent(`${point.nombre || 'Punto ' + point.id}, Calarcá, Quindío, Colombia`);
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${queryUbicacion}`;
    
    let contenidoHTML = `
        <div style="text-align: left;">
            <h2 style="color: #27ae60; font-size: 1.6rem; font-weight: 800; margin-bottom: 20px; text-align: center;">${point.nombre || 'Punto ' + point.id}</h2>
    `;
    
    if (point.foto) {
        contenidoHTML += `
            <div style="margin-bottom: 20px; text-align: center;">
                <img src="${point.foto}" alt="${point.nombre}" style="width: 100%; max-height: 250px; border-radius: 15px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);">
            </div>
        `;
    }
    
    if (point.ubicacion) {
        contenidoHTML += `
            <p style="font-size: 0.95rem; line-height: 1.8; color: #555; margin-bottom: 15px;">
                <strong>📍 Ubicación:</strong> ${point.ubicacion}
            </p>
        `;
    }
    
    if (point.contacto) {
        contenidoHTML += `
            <p style="font-size: 0.95rem; line-height: 1.8; color: #555; margin-bottom: 20px;">
                <strong>📞 Contacto:</strong> <a href="tel:${point.contacto}" style="color: #27ae60; text-decoration: none; font-weight: 700;">${point.contacto}</a>
            </p>
        `;
    }
    
    contenidoHTML += `
        <div style="text-align: center; margin-top: 20px;">
            <a href="${googleMapsUrl}" target="_blank" rel="noopener noreferrer" style="
                display: inline-block;
                background: #4285F4;
                color: white;
                border: none;
                padding: 12px 30px;
                border-radius: 25px;
                font-size: 1rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                text-decoration: none;
                margin-bottom: 15px;
            ">🚗 Cómo llegar (Google Maps)</a>
            <br>
            <button onclick="cerrarBottomSheet()" style="
                background: #27ae60;
                color: white;
                border: none;
                padding: 12px 30px;
                border-radius: 25px;
                font-size: 1rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
            ">Cerrar</button>
        </div>
    `;
    
    bottomSheetContent.innerHTML = contenidoHTML;
    
    bottomSheet.classList.add('open');
    overlay.classList.add('active');
}

function cerrarBottomSheet() {
    const bottomSheet = document.getElementById('bottom-sheet');
    const overlay = document.getElementById('bottom-sheet-overlay');
    
    if (bottomSheet) bottomSheet.classList.remove('open');
    if (overlay) overlay.classList.remove('active');
}

// Function to add markers with numbers to map (sin Marker Clustering para probar)
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

        const marker = L.marker(point.coords, { icon: numberIcon });

        marker.on('click', (e) => {
            e.originalEvent.stopPropagation();
            abrirBottomSheet(point);
            
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

        marker.addTo(map);
        markers.push(marker);
    });
}

// Función para abrir modal con imagen grande
function abrirModalImagenGrande(imagenPath, categoria) {
    const modal = document.getElementById('modal-nuevo');
    const contenido = document.getElementById('contenido-modal');
    
    if (!modal || !contenido) return;
    
    contenido.innerHTML = `
        <div style="text-align: center;">
            <h2 style="font-size: 1.4rem; font-weight: 800; color: #007A5E; margin-bottom: 20px;">${categoria}</h2>
            <img src="${imagenPath}" style="width: 100%; border-radius: 15px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);">
        </div>
    `;
    
    modal.style.display = 'block';
}

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
        nombre: "Información de turismo de Calarcá",
        ubicacion: "Centro de Calarcá",
        contacto: "57 (606) 7430300",
        categoria: "Alcaldía de Calarcá"
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
        nombre: "Quindío travel",
        ubicacion: "Calarcá",
        contacto: "317 44 260 44",
        categoria: "Agencia de Viajes"
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

// Renderizar pautas publicitarias - 100% NUEVO y SIMPLE
function renderAdsBanner() {
    const banner = document.getElementById('ads-banner');
    if (!banner) {
        console.log('❌ ERROR: No se encontró el banner de pautas');
        return;
    }
    
    console.log('✅ Renderizando', pautasPublicitarias.length, 'pautas');
    
    banner.innerHTML = '';
    pautasPublicitarias.forEach((pauta, index) => {
        const adItem = document.createElement('div');
        adItem.style.cssText = 'width: 100%; min-height: 350px; height: 350px; border-radius: 18px; border: 1px solid #f0f0f0; background: white; cursor: pointer; display: flex; align-items: flex-start; justify-content: center; flex-shrink: 0; position: relative; z-index: 10000;';
        adItem.setAttribute('data-pauta-id', pauta.id);
        
        const img = document.createElement('img');
        img.src = pauta.photo;
        img.alt = `Pauta ${pauta.id}`;
        img.style.cssText = 'width: 100%; height: auto; object-fit: contain; object-position: top; pointer-events: none;';
        
        adItem.appendChild(img);
        
        // Evento de clic - SUPER SIMPLE y MUY SEGURO
        adItem.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('🖱️ CLIC en pauta:', index + 1, '-', pauta.nombre);
            console.log('📄 Datos completos de la pauta:', pauta);
            abrirModalNuevo(pauta);
        }, true);
        
        banner.appendChild(adItem);
    });
    console.log('✅ Pautas renderizadas');
}

// Llamar inmediatamente a renderizar pautas - NO ESPERAR A NADA
console.log('🚀 Iniciando renderizado de pautas...');
renderAdsBanner();

// Función para abrir el modal NUEVO - SUPER SIMPLE y SEGURO
function abrirModalNuevo(pauta) {
    console.log('🪟 Abriendo modal para:', pauta);
    
    const modal = document.getElementById('modal-nuevo');
    const contenido = document.getElementById('contenido-modal');
    
    if (!modal || !contenido) {
        console.log('❌ ERROR: No se encontró el modal NUEVO');
        console.log('modal-nuevo:', modal);
        console.log('contenido-modal:', contenido);
        alert('ERROR: Por favor actualiza la página completamente!');
        return;
    }
    
    // Generar URL de Google Maps con la ubicación
    const queryUbicacion = encodeURIComponent(`${pauta.nombre || ''}, ${pauta.ubicacion || ''}, Calarcá, Quindío, Colombia`);
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${queryUbicacion}`;
    
    // Construir contenido - 100% directo y seguro
    let html = '';
    html += `<img src="${pauta.photo}" style="width: 100%; border-radius: 15px; margin-bottom: 20px;">`;
    
    if (pauta.categoria) {
        html += `<div style="display: inline-block; background: #007A5E; color: white; padding: 5px 15px; border-radius: 20px; font-size: 0.85rem; font-weight: bold; margin-bottom: 15px;">${pauta.categoria}</div>`;
    }
    
    if (pauta.nombre) {
        html += `<h2 style="font-size: 1.6rem; font-weight: 800; color: #007A5E; margin-bottom: 15px; margin-top: 10px;">${pauta.nombre}</h2>`;
    }
    
    if (pauta.ubicacion) {
        html += `<div style="margin-bottom: 12px; font-size: 1rem;"><strong>📍 Ubicación:</strong> ${pauta.ubicacion}</div>`;
    }
    
    if (pauta.contacto) {
        html += `<div style="margin-bottom: 12px; font-size: 1rem;"><strong>📞 Contacto:</strong> ${pauta.contacto}</div>`;
    }
    
    if (pauta.horario) {
        html += `<div style="margin-bottom: 12px; font-size: 1rem;"><strong>⏰ Horario:</strong> ${pauta.horario}</div>`;
    }
    
    // Botón de Cómo llegar
    html += `<a href="${googleMapsUrl}" target="_blank" rel="noopener noreferrer" style="
        display: block;
        background: #4285F4;
        color: white;
        border: none;
        padding: 15px 20px;
        border-radius: 15px;
        font-size: 1rem;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.3s ease;
        text-decoration: none;
        text-align: center;
        margin-top: 20px;
        box-shadow: 0 4px 15px rgba(66, 133, 244, 0.3);
    ">🚗 Cómo llegar (Google Maps)</a>`;
    
    contenido.innerHTML = html;
    modal.style.display = 'block';
    console.log('✅ Modal NUEVO abierto exitosamente!');
}

// Cerrar modal nuevo - SUPER SEGURO
document.addEventListener('click', function(e) {
    console.log('🖱️ Click en documento:', e.target.id, e.target.className);
    if (e.target.id === 'cerrar-modal' || e.target.id === 'modal-nuevo') {
        const modal = document.getElementById('modal-nuevo');
        if (modal) {
            modal.style.display = 'none';
            console.log('❌ Modal cerrado');
        }
    }
}, true);

console.log('✅ Todo listo! Puedes hacer clic en las pautas.');

// Casillas de Información - con coordenadas en el mapa
const casillasInfo = [
    {
        id: 'atractivos',
        nombre: 'Atractivos',
        imagen: 'imagenes/casillas_info/casillas_atractivos.jpg',
        coords: [1000, 2000]
    },
    {
        id: 'agencias',
        nombre: 'Agencias de Viajes',
        imagen: 'imagenes/casillas_info/casillas_agencias.jpg',
        coords: [1500, 2500]
    },
    {
        id: 'alcaldia',
        nombre: 'Alcaldía',
        imagen: 'imagenes/casillas_info/casillas_alcaldia.jpg',
        coords: [1800, 2800]
    },
    {
        id: 'alojamiento',
        nombre: 'Alojamiento',
        imagen: 'imagenes/casillas_info/casillas_alojamiento.jpg',
        coords: [2000, 3000]
    },
    {
        id: 'escuela',
        nombre: 'Escuela de Café',
        imagen: 'imagenes/casillas_info/casillas_escuela.jpg',
        coords: [2100, 2900]
    },
    {
        id: 'libros',
        nombre: 'Libros y Café',
        imagen: 'imagenes/casillas_info/casillas_libros.jpg',
        coords: [1900, 2700]
    },
    {
        id: 'parrillas',
        nombre: 'Parrillas',
        imagen: 'imagenes/casillas_info/casillas_parrillas.jpg',
        coords: [2200, 3100]
    },
    {
        id: 'pizeria',
        nombre: 'Pizzerías',
        imagen: 'imagenes/casillas_info/casillas_pizeria.jpg',
        coords: [2300, 3200]
    },
    {
        id: 'restaurantes',
        nombre: 'Restaurantes',
        imagen: 'imagenes/casillas_info/casillas_restaurantes.jpg',
        coords: [2400, 3300]
    },
    {
        id: 'taxis',
        nombre: 'Taxis y Transporte',
        imagen: 'imagenes/casillas_info/casillas_taxis.jpg',
        coords: [1700, 2600]
    },
    {
        id: 'tiendas',
        nombre: 'Tiendas de Café',
        imagen: 'imagenes/casillas_info/casillas_tiendas_de_cafe.jpg',
        coords: [2500, 3400]
    }
];

// Función para renderizar las casillas de información en la barra inferior
function renderizarCasillas() {
    const container = document.getElementById('casillas-bottom-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    casillasInfo.forEach(casilla => {
        const item = document.createElement('div');
        item.className = 'casilla-bottom-item';
        item.innerHTML = `
            <img src="${casilla.imagen}" alt="${casilla.nombre}">
            <p>${casilla.nombre}</p>
        `;
        
        item.addEventListener('click', () => {
            // Solo abrir la imagen en el modal - deshabilitado redireccionamiento al mapa
            abrirModalImagenGrande(casilla.imagen, casilla.nombre);
        });
        
        container.appendChild(item);
    });
    
    console.log('✅ Casillas de información renderizadas en la barra inferior');
}

// Renderizar casillas después de que el mapa esté listo
setTimeout(() => {
    renderizarCasillas();
}, 500);

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

// Event listeners para el Bottom Sheet
document.addEventListener('DOMContentLoaded', function() {
    const overlay = document.getElementById('bottom-sheet-overlay');
    const handle = document.querySelector('.bottom-sheet-handle');
    
    if (overlay) {
        overlay.addEventListener('click', cerrarBottomSheet);
    }
    
    if (handle) {
        handle.addEventListener('click', cerrarBottomSheet);
    }
});
