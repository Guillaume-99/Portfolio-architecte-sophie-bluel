// appel API 
const apiUrl = 'http://localhost:5678/api/';






// appel API categories pour conversion en json
async function getCategories() {
    const response = await fetch(apiUrl + 'categories');
    const categories = await response.json();
    return categories;
}

// affichage de bouttons filtres par categories
async function displayCategories() {
    const categories = await getCategories();
    const filters = document.querySelector('.filters');
    categories.forEach(category => {
        const button = document.createElement('button');
        button.textContent = category.name;
        button.setAttribute('data-category', category.id);
        button.classList.add('filtersBtn');
        filters.appendChild(button);
    });


    // appel des filtres
    worksFilters()
}


function worksFilters() {
    // filtres des travaux par categories
    const buttons = document.querySelectorAll('.filtersBtn');

    buttons.forEach(button => {
        button.addEventListener('click', () => {

            const category = button.getAttribute('data-category');
            const works = document.querySelectorAll('.works');

            buttons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            works.forEach(work => {
                if (category === '0') {
                    work.style.display = 'block';
                } else if (work.classList.contains(category)) {
                    work.style.display = 'block';
                } else {
                    work.style.display = 'none';
                }
            });
        });
    });
}




// appel API travaux pour conversion en json
async function getWorks() {
    const response = await fetch(apiUrl + 'works');
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
        figure.classList.add(work.categoryId);
        figure.classList.add('works');
        img.src = work.imageUrl;
        img.alt = work.title;
        title.textContent = work.title;
        gallery.appendChild(figure);
        figure.appendChild(img);
        figure.appendChild(title);
    });
}



// mode admin lorsque le token est donné
async function admin() {
    if (localStorage.getItem('token')) {
        // affichage du bouton logout
        const logout = `<a id="logout" href="index.html">logout</a>`;
        const login = document.getElementById('login');
        login.innerHTML = logout;

        document.getElementById('logout').addEventListener('click', () => {
            localStorage.removeItem('token');
        });


        // affichage bandeau mode édition
        const edit = document.querySelector('.edit_banner');
        edit.classList.remove('hidden');
        edit.classList.add('edit');

        // modification header
        const header = document.querySelector('header');
        header.classList.add('edit_mod');

        // affichage boutton modif
        const linkModify = document.querySelector('.link_modify');
        linkModify.classList.remove('hidden');

        // masquer boutton filtres
        const filters = document.querySelector('.filters');
        filters.classList.add('hidden');

        // augmentation margin gallery
        const gallery = document.querySelector('.gallery');
        gallery.classList.add('edit_mod');



    }

}










async function init() {
    // appel de la fonction d'affichage categories
    displayCategories();
    // appel de la fonction d'affichage travaux
    displayWorks();

    admin();
}

init();