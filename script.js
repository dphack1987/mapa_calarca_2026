// Dimensions of the image
const IMAGE_WIDTH = 6000;
const IMAGE_HEIGHT = 6000;

// Initialize the map
const map = L.map('map', {
    crs: L.CRS.Simple,
    minZoom: -2,
    maxZoom: 2,
    zoomControl: true
});

// Calculate the bounds
const bounds = [[0, 0], [IMAGE_HEIGHT, IMAGE_WIDTH]];
L.imageOverlay('imagenes/mapa_principal.jpg', bounds).addTo(map);

map.fitBounds(bounds, { padding: [20, 20] });

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
selectedInfo.innerHTML = `
    <div class="welcome-msg">
        <p style="font-weight: 600; color: #27ae60;">¡Bienvenido!</p>
        <p style="font-size: 0.9rem; color: #444;">Toca un punto numerado en el mapa para ver su información.</p>
    </div>
`;

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
                width: 32px;
                height: 32px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: 800;
                font-size: 14px;
                border: 3px solid white;
                box-shadow: 0 4px 12px rgba(0,0,0,0.25);
            ">${point.id}</div>`,
            iconSize: [32, 32],
            iconAnchor: [16, 16]
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
            selectedInfo.innerHTML = `
                <div class="selected-point">
                    <h4 style="color: #27ae60; font-size: 1.6rem; font-weight: 800; margin-bottom: 15px;">Punto ${point.id}</h4>
                    <p style="font-size: 0.95rem; line-height: 1.7; color: #444; margin-bottom: 20px;">Espera a que se agreguen los detalles de este punto.</p>
                </div>
            `;
            
            // On mobile, open the sidebar automatically
            if (window.innerWidth <= 900 && !adsSidebar.classList.contains('open')) {
                toggleSidebar();
            }
        });

        markers.push(marker);
    });
}

// Initialize markers
displayMarkers();

// Filter buttons (basic functionality)
const filterBtns = document.querySelectorAll('.filter-btn');
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    });
});
