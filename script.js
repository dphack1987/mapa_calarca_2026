// Dimensions of the image
const imgWidth = 2000;
const imgHeight = 1500;
const bounds = [[0, 0], [imgHeight, imgWidth]];

// CRS.Simple allows using an image as a coordinate system
const map = L.map('map', {
    crs: L.CRS.Simple,
    minZoom: -1,
    maxZoom: 2,
    zoomSnap: 0.1,
    attributionControl: false,
    maxBounds: bounds, // Restringe el movimiento al área de la imagen
    maxBoundsViscosity: 1.0 // Hace que el rebote sea rígido
});

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
                        <div style="margin-bottom: 15px;">
                            <span class="category-badge">${point.category}</span>
                        </div>
                        <p>${point.description}</p>
                        <img src="${point.photo}" alt="${point.name}" style="width: 100%; border-radius: 12px; margin-top: 15px; box-shadow: 0 5px 15px rgba(0,0,0,0.1); border: 3px solid white;">
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
