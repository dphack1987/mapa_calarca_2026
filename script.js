// CRS.Simple allows using an image as a coordinate system
const map = L.map('map', {
    crs: L.CRS.Simple,
    minZoom: -2,
    maxZoom: 2,
    zoomSnap: 0.1,
    attributionControl: false
});

// Dimensions of the image
const imgWidth = 2000;
const imgHeight = 1500;
const bounds = [[0, 0], [imgHeight, imgWidth]];

// Add the image overlay
L.imageOverlay('imagenes/mapa calarca.jpg', bounds).addTo(map);
map.fitBounds(bounds);

// Tourist points of interest with Categories
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
let markers = [];

// Function to add markers to map
function displayMarkers(category = 'todos') {
    // Clear existing markers
    markers.forEach(m => map.removeLayer(m));
    markers = [];

    pointsOfInterest.forEach(point => {
        if (category === 'todos' || point.category === category) {
            const marker = L.marker(point.coords).addTo(map);
            marker.bindPopup(`<b>${point.name}</b><br><small>${point.category}</small>`);

            marker.on('click', () => {
                selectedInfo.innerHTML = `
                    <div class="selected-point animated fadeIn">
                        <h4>${point.name}</h4>
                        <p style="font-size: 0.8rem; color: #666; margin-bottom: 5px;">
                            <span style="background: #d4a373; color: white; padding: 2px 8px; border-radius: 10px;">${point.category}</span>
                        </p>
                        <p>${point.description}</p>
                        <img src="${point.photo}" alt="${point.name}">
                    </div>
                `;
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
        // UI Update
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        
        // Map Update
        displayMarkers(e.target.dataset.category);
    });
});

// Coordinate Helper
const coordsDiv = document.getElementById('coords');
map.on('click', (e) => {
    const coord = e.latlng;
    const lat = coord.lat.toFixed(1);
    const lng = coord.lng.toFixed(1);
    coordsDiv.innerText = `[${lat}, ${lng}]`;
});
