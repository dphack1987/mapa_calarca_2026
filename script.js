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
            // Navegar al punto en el mapa
            map.flyTo(casilla.coords, 1.5, {
                duration: 1.5
            });
            
            // También abrir la imagen en el modal
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
