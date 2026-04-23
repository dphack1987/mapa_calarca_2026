// Dimensions of the image
const imgWidth = 2000;
const imgHeight = 1500;
const bounds = [[0, 0], [imgHeight, imgWidth]];

// Device Detection
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

// Map Initialization
const map = L.map('map', {
    crs: L.CRS.Simple,
    minZoom: isMobile ? -1.5 : -1,
    maxZoom: 2,
    zoomSnap: 0.1,
    attributionControl: false,
    maxBounds: bounds,
    maxBoundsViscosity: 1.0,
    tap: !isMobile, // Disable tap for better mobile handling
    dragging: !isMobile || (isMobile && !isTouchDevice) // Initial dragging state
});

// Adjust dragging for mobile (double finger pan vs single finger)
if (isMobile && isTouchDevice) {
    map.dragging.disable();
    // Enable dragging only with two fingers to allow page scroll if needed, 
    // but here we have overflow hidden, so we can enable it normally or use a specific gesture.
    // For this full-screen app, let's enable it but with caution.
    map.dragging.enable();
}

// Add the image overlay
L.imageOverlay('imagenes/mapa calarca.jpg', bounds).addTo(map);
map.fitBounds(bounds);

// Tourist points of interest
const pointsOfInterest = [
    {
        name: "Plaza de Bolívar",
        coords: [750, 1000],
        description: "El corazón de Calarcá, un lugar lleno de historia y arquitectura tradicional cafetera.",
        category: "Cultura",
        photo: "imagenes/LOGO CALARCA 2026.jpg"
    },
    {
        name: "Jardín Botánico del Quindío",
        coords: [800, 1200],
        description: "Hogar del famoso mariposario y una colección increíble de palmas y flora regional.",
        category: "Naturaleza",
        photo: "imagenes/LOGO CALARCA 2026.jpg"
    },
    {
        name: "Peñas Blancas",
        coords: [400, 1600],
        description: "Majestuosa formación rocosa para los amantes del senderismo y la escalada.",
        category: "Aventura",
        photo: "imagenes/LOGO CALARCA 2026.jpg"
    },
    {
        name: "Casa de la Cultura",
        coords: [780, 950],
        description: "Epicentro de las artes y la memoria histórica de la 'Villa del Cacique'.",
        category: "Cultura",
        photo: "imagenes/LOGO CALARCA 2026.jpg"
    },
    {
        name: "Parque de la Vida",
        coords: [700, 1100],
        description: "Espacio recreativo para la familia con senderos y zonas verdes.",
        category: "Recreación",
        photo: "imagenes/LOGO CALARCA 2026.jpg"
    },
    {
        name: "Iglesia San José",
        coords: [760, 1020],
        description: "Arquitectura religiosa emblemática frente a la Plaza de Bolívar.",
        category: "Arquitectura",
        photo: "imagenes/LOGO CALARCA 2026.jpg"
    },
    {
        name: "Mirador de Calarcá",
        coords: [300, 1500],
        description: "Punto panorámico para observar todo el Valle del Quindío.",
        category: "Naturaleza",
        photo: "imagenes/LOGO CALARCA 2026.jpg"
    }
];

const selectedInfo = document.getElementById('selected-info');
const adsSidebar = document.getElementById('ads-sidebar');
const menuToggle = document.getElementById('menu-toggle');
const sidebarOverlay = document.getElementById('sidebar-overlay');
let markers = [];

// Sidebar Toggle Logic
function toggleSidebar() {
    adsSidebar.classList.toggle('open');
    sidebarOverlay.classList.toggle('active');
}

if (menuToggle) {
    menuToggle.addEventListener('click', toggleSidebar);
}

if (sidebarOverlay) {
    sidebarOverlay.addEventListener('click', toggleSidebar);
}

// Search Logic
const setupSearch = () => {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            
            // Si el término es corto, mostramos todos según la categoría activa
            if (term.length < 2) {
                const activeCat = document.querySelector('.filter-btn.active') ? document.querySelector('.filter-btn.active').dataset.category : 'todos';
                displayMarkers(activeCat);
                return;
            }

            // Filtrar puntos por nombre o descripción
            markers.forEach(m => map.removeLayer(m));
            markers = [];

            pointsOfInterest.forEach(point => {
                if (point.name.toLowerCase().includes(term) || point.description.toLowerCase().includes(term)) {
                    addMarker(point);
                }
            });
        });
    }
};

// Helper function to add a single marker
function addMarker(point) {
    const marker = L.circleMarker(point.coords, {
        radius: isMobile ? 12 : 10,
        fillColor: getCategoryColor(point.category),
        color: "#fff",
        weight: 3,
        opacity: 1,
        fillOpacity: 0.9
    }).addTo(map);
    
    marker.bindPopup(`<b>${point.name}</b><br><small>${point.category}</small>`, {
        closeButton: !isMobile,
        autoPanPadding: [50, 50]
    });

    marker.on('click', () => {
        selectedInfo.style.opacity = '0';
        setTimeout(() => {
            selectedInfo.innerHTML = `
                <div class="selected-point animated fadeIn">
                    <h4>${point.name}</h4>
                    <div style="margin-bottom: 15px;">
                        <span class="category-badge">${point.category}</span>
                    </div>
                    <p>${point.description}</p>
                    <img src="${point.photo}" alt="${point.name}" style="width: 100%; border-radius: 12px; margin-top: 15px; box-shadow: 0 5px 15px rgba(0,0,0,0.1); border: 3px solid white;">
                </div>
            `;
            selectedInfo.style.opacity = '1';
        }, 300);

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
        case 'Arquitectura': return '#2980b9';
        case 'Recreación': return '#f1c40f';
        default: return '#27ae60';
    }
}

// Initial display
displayMarkers();
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

// Generar QR Code dinámicamente
const generateQR = () => {
    const currentUrl = window.location.href;
    const qrContainer = document.getElementById('qrcode');
    if (qrContainer) {
        // QR en NEGRO y más grande para la web
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(currentUrl)}&color=000000&format=jpg`;
        qrContainer.innerHTML = `<img src="${qrUrl}" alt="Código QR del Mapa" id="qr-img">`;
    }
};

// Funcionalidad de descarga de QR
const setupQRDownload = () => {
    const downloadBtn = document.getElementById('download-qr');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            const qrImg = document.getElementById('qr-img');
            if (qrImg) {
                // Creamos un link temporal para la descarga
                const link = document.createElement('a');
                link.href = qrImg.src;
                link.download = 'QR-Mapa-Calarca-2026.jpg';
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
                copyBtn.innerText = '¡Copiado!';
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

// Inicializar funciones de compartir
generateQR();
setupQRDownload();
setupCopyLink();

// Initial Device Info in Console
console.log(`Device: ${isMobile ? 'Mobile' : 'PC'}, Touch: ${isTouchDevice}`);
