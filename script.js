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

// Function to add markers to map
function displayMarkers(category = 'todos') {
    markers.forEach(m => map.removeLayer(m));
    markers = [];

    pointsOfInterest.forEach(point => {
        if (category === 'todos' || point.category === category) {
            // Custom icon or colored circle marker for a more modern look
            const marker = L.circleMarker(point.coords, {
                radius: 10,
                fillColor: "#27ae60",
                color: "#fff",
                weight: 3,
                opacity: 1,
                fillOpacity: 0.8
            }).addTo(map);
            
            // Adjust popup for mobile
            const popupContent = `
                <div style="text-align: center; font-family: 'Poppins', sans-serif;">
                    <b style="display: block; margin-bottom: 5px; color: #27ae60; font-size: 1.1rem;">${point.name}</b>
                    <span style="background: #f1c40f; color: #1e272e; padding: 2px 8px; border-radius: 5px; font-size: 0.7rem; font-weight: 800; text-transform: uppercase;">${point.category}</span>
                </div>
            `;
            marker.bindPopup(popupContent, {
                closeButton: false,
                autoPanPadding: [50, 50],
                className: 'modern-popup'
            });

            marker.on('click', () => {
                // Add a small pulse effect or animation via CSS if needed
                selectedInfo.style.opacity = '0';
                
                setTimeout(() => {
                    selectedInfo.innerHTML = `
                        <div class="selected-point">
                            <h4>${point.name}</h4>
                            <div style="margin-bottom: 20px;">
                                <span class="category-badge">${point.category}</span>
                            </div>
                            <p>${point.description}</p>
                            <img src="${point.photo}" alt="${point.name}">
                        </div>
                    `;
                    selectedInfo.style.opacity = '1';
                }, 300);
                
                // On mobile, open the sidebar automatically
                if (window.innerWidth <= 900 && !adsSidebar.classList.contains('open')) {
                    toggleSidebar();
                }
            });

            // Hover effects
            marker.on('mouseover', function() {
                this.setStyle({
                    radius: 13,
                    fillOpacity: 1,
                    fillColor: "#f1c40f"
                });
            });
            marker.on('mouseout', function() {
                this.setStyle({
                    radius: 10,
                    fillOpacity: 0.8,
                    fillColor: "#27ae60"
                });
            });

            markers.push(marker);
        }
    });
}

// Initial display
displayMarkers();

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
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(currentUrl)}&color=27ae60`;
        qrContainer.innerHTML = `<img src="${qrUrl}" alt="Código QR del Mapa">`;
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
setupCopyLink();

// Initial Device Info in Console
console.log(`Device: ${isMobile ? 'Mobile' : 'PC'}, Touch: ${isTouchDevice}`);
