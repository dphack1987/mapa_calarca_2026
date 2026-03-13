// CRS.Simple allows using an image as a coordinate system
const map = L.map('map', {
    crs: L.CRS.Simple,
    minZoom: -2,
    maxZoom: 2,
    zoomSnap: 0.1
});

// Dimensions of the image (you can adjust these to match the real image size)
const imgWidth = 2000;
const imgHeight = 1500;

// Set bounds for the image
const bounds = [[0, 0], [imgHeight, imgWidth]];

// Add the image overlay
const image = L.imageOverlay('imagenes/mapa calarca.jpg', bounds).addTo(map);

// Set the map view to fit the image
map.fitBounds(bounds);

// Tourist points of interest (coordinates are relative to the image size [y, x])
// These will need to be adjusted to match the actual points on the image
const pointsOfInterest = [
    {
        name: "Plaza de Bolívar",
        coords: [750, 1000], // Example position on the image
        description: "El corazón de la ciudad.",
        category: "Cultura",
        photo: "imagenes/LOGO CALARCA 2026.jpg" // Placeholder for photos
    },
    {
        name: "Jardín Botánico",
        coords: [800, 1200],
        description: "Mariposario y biodiversidad.",
        category: "Naturaleza",
        photo: "imagenes/LOGO CALARCA 2026.jpg"
    }
];

// Sidebar element
const selectedInfo = document.getElementById('selected-info');

// Add markers
pointsOfInterest.forEach(point => {
    const marker = L.marker(point.coords).addTo(map);
    
    // Popup on marker
    marker.bindPopup(`<b>${point.name}</b>`);

    // Click event to show info in sidebar
    marker.on('click', () => {
        selectedInfo.innerHTML = `
            <div class="selected-point">
                <h4>${point.name}</h4>
                <p><strong>Categoría:</strong> ${point.category}</p>
                <p>${point.description}</p>
                <img src="${point.photo}" alt="${point.name}" style="width: 100%; border-radius: 4px; margin-top: 10px;">
            </div>
        `;
    });
});

// Event to help find coordinates for new points
const coordsDiv = document.getElementById('coords');
map.on('click', (e) => {
    const coord = e.latlng;
    const lat = coord.lat.toFixed(1);
    const lng = coord.lng.toFixed(1);
    coordsDiv.innerText = `Coordenadas: [${lat}, ${lng}]`;
    console.log(`Click en: [${lat}, ${lng}]`);
});
