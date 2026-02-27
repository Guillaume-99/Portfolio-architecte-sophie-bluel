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

        // click modifier => affichage modale
        linkModify.addEventListener('click', () => {
            const modalepop = document.querySelector('.modalePop');
            const modaleGallery = document.querySelector('.modale_gallery');

            modalepop.classList.remove('hidden');
            modalepop.classList.add('modale');
            modaleGallery.classList.add('activeModale');
        });



    };

};



// affichage modale Gallery
async function modale() {

    const works = await getWorks();
    const galleryImg = document.querySelector('.galleryImg');



    //Image pour modale gallery
    works.forEach(work => {
        const deleteIcon = document.createElement('i');
        deleteIcon.className = 'fa-solid fa-trash-can trash';
        const img = document.createElement('img');
        const figure = document.createElement('figure');
        img.src = work.imageUrl;
        img.alt = work.title;
        img.classList.add('modaleImg');
        figure.appendChild(deleteIcon);
        figure.appendChild(img);
        galleryImg.appendChild(figure);
    });

    // fermeture modale sur croix ou overlay + retour arriere
    const modalepop = document.querySelector('.modalePop');
    const modaleGallery = document.querySelector('.modale_gallery');
    const modaleWorks = document.querySelector('.modale_works');
    const back = document.querySelector('.back');

    modalepop.addEventListener('click', (event) => {

        if (event.target === modalepop || event.target.closest('.close')) {
            console.log(event.target);

            modalepop.classList.remove('modale');
            modalepop.classList.add('hidden');
            modaleWorks.classList.remove('activeModale');
        } // retour arriere
        else if (event.target === back) {
            modaleGallery.classList.add('activeModale');
            modaleWorks.classList.remove('activeModale');
        }

    });
    // affichage modale form works
    const addPicture = document.querySelector('.addPicture');
    addPicture.addEventListener('click', () => {
        modaleGallery.classList.remove('activeModale');
        modaleGallery.classList.add('hidden');
        modaleWorks.classList.add('activeModale');
    });

    modaleWorksCategory();

}


// function modale form works category
async function modaleWorksCategory() {
    const category = await getCategories();
    const categorySelect = document.querySelector('.categorySelect');
    category.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat.id;
        option.textContent = cat.name;
        categorySelect.appendChild(option);
    });
}






async function init() {
    // appel de la fonction d'affichage categories
    displayCategories();
    // appel de la fonction d'affichage travaux
    displayWorks();

    admin();
    modale();
}

init();