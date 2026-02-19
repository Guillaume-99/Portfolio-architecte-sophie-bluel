// appel API travaux
const api = 'http://localhost:5678/api/works';

// appel API pour conversion en json
async function getWorks() {
    const response = await fetch(api);
    const works = await response.json();
    return works;
}

// affichage des travaux
async function displayWorks() {
    const works = await getWorks();
    const gallery = document.querySelector('.gallery');
    works.forEach(work => {
        const figure = document.createElement('figure');
        const img = document.createElement('img');
        const title = document.createElement('figcaption');
        img.src = work.imageUrl;
        img.alt = work.title;
        title.textContent = work.title;
        gallery.appendChild(figure);
        figure.appendChild(img);
        figure.appendChild(title);
    });
}

// appel de la fonction d'affichage travaux
displayWorks();