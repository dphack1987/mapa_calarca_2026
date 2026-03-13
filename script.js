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
            const marker = L.marker(point.coords).addTo(map);
            
            // Adjust popup for mobile
            const popupContent = `<b>${point.name}</b><br><small>${point.category}</small>`;
            marker.bindPopup(popupContent, {
                closeButton: !isMobile,
                autoPanPadding: [50, 50]
            });

            marker.on('click', () => {
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
                
                // On mobile, open the sidebar automatically to show info when a marker is clicked
                if (isMobile && !adsSidebar.classList.contains('open')) {
                    toggleSidebar();
                }
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
    const coord = e.latlng;
    const lat = coord.lat.toFixed(1);
    const lng = coord.lng.toFixed(1);
    coordsDiv.innerText = `[${lat}, ${lng}]`;
};

map.on('click', updateCoords);
if (!isMobile) {
    map.on('mousemove', updateCoords);
}

// Initial Device Info in Console
console.log(`Device: ${isMobile ? 'Mobile' : 'PC'}, Touch: ${isTouchDevice}`);
