const api = "https://api.spacexdata.com/v4/launches"
const contenedor = document.getElementById("Lanzamientos");
const dbtd = document.getElementById("Siguiente");
const dbtl = document.getElementById("Anterior");

let lanzamientos = [];
let currentIndex = 1;
const itemsPerPage = 6;

// Animation scroll
function animationScroll() {
    const cards = document.querySelectorAll(".launch-card")
    const triggerButton = window.innerHeight * 0.8
    cards.forEach( (card) => {
        const top = card.getBoundingClientRect().top
        if ( top < triggerButton) {
            card.classList.add("show")
        }
    })
}
window.addEventListener("scroll", animationScroll)

// Llamar los datos de la API
async function llamarDatos() {
    try{
        const respuesta = await fetch(api);
        lanzamientos = await respuesta.json();
        rederPage();
    } catch (error) {
        contenedor.innerHTML =  '<p class = "text-center text-red-500">Error al cargar los datos. Por favor, intentelo de nuevo mas tarde.</p> '
    }
    
}

function rederPage() {
    contenedor.innerHTML = "";
    const startIndex = (currentIndex - 1) * itemsPerPage;
    const pageData = lanzamientos.slice(startIndex, startIndex + itemsPerPage);

    pageData.forEach((lanzamiento) => {
        const card = document.createElement("div");
        card.className = "launch-card bg-gray-900 text-white p-4 shadow-lg";
        card.innerHTML = ` 
        <h2 class= "text-xl font-bold mb-2">${lanzamiento.name}</h2>
        <p class="mb-2">Fecha de lanzamiento: ${new Date(lanzamiento.date_utc).toLocaleDateString()}</p>
        ${
            lanzamiento.links.patch.small ?
            `<img src="${lanzamiento.links.patch.small}" alt="${lanzamiento.name} Patcj" class="mb-2 w-24 h-24">` :""
        }
        <p class="text-msm">${lanzamiento.details ? lanzamiento.details : "No hay detalles disponibles."}</p>

    `;
    contenedor.appendChild(card);
})


dbtl.disabled= currentIndex ===1
dbtd.disabled = currentIndex * itemsPerPage >= lanzamientos.length
setTimeout(animationScroll, 200)

}

// Eventos de los botones

dbtd.addEventListener("click", () => {
    if (currentIndex * itemsPerPage < lanzamientos.length) {
        currentIndex++
        rederPage()
        window.scrollTo({ top: 0 , behavior: `smooth`})
    }
});

dbtl.addEventListener("click", () => {
    if (currentIndex > 1) {
        currentIndex--
        rederPage()
        window.scrollTo({ top: 0 , behavior: `smooth`})
    }
});

llamarDatos();