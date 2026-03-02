// appel API 
const apiUrl = 'http://localhost:5678/api/';

const imgWorks = `<i class="fa-regular fa-image"></i>
             			<button class="addPicture">+ Ajouter une photo</button>
             			<p>jpg, png : 4mo max</p>`


let uploadedFile = null;

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
            const works = document.querySelectorAll('.gallery figure');

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
    gallery.innerHTML = '';
    works.forEach(work => {
        const figure = document.createElement('figure');
        const img = document.createElement('img');
        const title = document.createElement('figcaption');
        figure.classList.add(work.categoryId);
        figure.classList.add('works' + work.id);
        img.src = work.imageUrl;
        img.alt = work.title;
        figure.dataset.id = work.id;
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



// fermeture modale sur croix ou overlay + retour arriere
function closeModale() {

    const modalepop = document.querySelector('.modalePop');
    const modaleGallery = document.querySelector('.modale_gallery');
    const modaleWorks = document.querySelector('.modale_works');
    const back = document.querySelector('.back');
    const addWorks = document.querySelector('.addWorks');
    const picture = document.querySelector('.picture');

    modalepop.addEventListener('click', (event) => {

        if (event.target === modalepop || event.target.closest('.close')) {

            modalepop.classList.remove('modale');
            modalepop.classList.add('hidden');
            modaleWorks.classList.remove('activeModale');
            addWorks.reset();
            picture.innerHTML = imgWorks;
        } // retour arriere
        else if (event.target === back) {
            modaleGallery.classList.add('activeModale');
            modaleWorks.classList.remove('activeModale');
            addWorks.reset();
            picture.innerHTML = imgWorks;
        }

    });
}

// modale gallery avec suppression
async function modaleGallery() {

    const works = await getWorks();
    const galleryImg = document.querySelector('.galleryImg');
    galleryImg.innerHTML = '';


    //Image pour modale gallery
    works.forEach(work => {

        const figure = document.createElement('figure');
        const deleteIcon = document.createElement('i');
        const img = document.createElement('img');

        deleteIcon.className = 'fa-solid fa-trash-can trash';
        img.src = work.imageUrl;
        img.alt = work.title;
        img.classList.add(work.id);
        figure.dataset.id = work.id;
        img.classList.add('modaleImg');
        figure.appendChild(deleteIcon);
        figure.appendChild(img);
        figure.classList.add('modaleCategory');
        galleryImg.appendChild(figure);
    });

    deleteWork();
}

// Suppression des travaux via modale gallery
function deleteWork() {

    const trash = document.querySelectorAll('.trash');

    trash.forEach((trash) => {
        trash.addEventListener('click', async (event) => {

            const figure = event.target.closest('figure');
            const id = figure.dataset.id;
            const token = localStorage.getItem('token');
            const works = document.querySelector('.works' + id);

            const response = await fetch(apiUrl + 'works/' + id, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            figure.remove();

            if (works) {
                works.remove();
            }

        });
    });
}


// Affichage modale form works
async function modaleFormWorks() {

    // affichage modale form works
    const modaleGallery = document.querySelector('.modale_gallery');
    const modaleWorks = document.querySelector('.modale_works');
    const formWorks = document.querySelector('.formWorks');
    const picture = document.querySelector('.picture');

    formWorks.addEventListener('click', () => {
        modaleGallery.classList.remove('activeModale');
        modaleGallery.classList.add('hidden');
        modaleWorks.classList.add('activeModale');
        picture.innerHTML = imgWorks;
    });

    // modale form works category option déroulante
    const categories = await getCategories();
    const categorySelect = document.querySelector('.categorySelect');

    categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat.id;
        option.textContent = cat.name;
        categorySelect.appendChild(option);
    });

    updateValiderButton();

}

// Bouton valider modale 
function updateValiderButton() {
    const title = document.getElementById('title').value;
    const category = document.getElementById('category').value;
    const pictureImg = document.querySelector('.picture img');

    const isValide = title && category && pictureImg;

    const valider = document.getElementById('valider');
    valider.style.backgroundColor = isValide ? '#306685' : '#A7A7A7';
    valider.style.cursor = isValide ? 'pointer' : 'not-allowed';

    // Ecoute bouton si remplie
    const titleInput = document.getElementById('title');
    const categoryOption = document.getElementById('category');
    const pictureContener = document.querySelector('.picture');

    titleInput.addEventListener('input', updateValiderButton);
    categoryOption.addEventListener('input', updateValiderButton);
    pictureContener.addEventListener('input', updateValiderButton);
}

// Ajout work via modale form works
async function addWork() {

    // Ajout d'une photo
    const picture = document.querySelector('.picture');
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.style.display = 'none';
    document.body.appendChild(input);

    // selection de la photo
    picture.addEventListener('click', (e) => {
        if (e.target.matches('.addPicture'))
            input.click();
    });

    input.addEventListener('change', (event) => {
        // condition de la photo
        const file = event.target.files?.[0];
        const maxSize = 4 * 1024 * 1024
        if (file.size > maxSize || file.size === 0 || (file.type !== 'image/jpeg' && file.type !== 'image/png')) {
            event.target.value = '';
            const errorP = document.querySelector('.picture p');
            errorP.style.color = 'red';
            return;
        }

        // Previsualisation de la photo


        const picture = document.querySelector('.picture');
        picture.innerHTML = '';
        const reader = new FileReader();

        reader.readAsDataURL(file);

        reader.onload = () => {
            const img = document.createElement('img');
            img.src = reader.result;
            picture.appendChild(img);
        };
    });



    // Ecoute du submit du formulaire addWorks
    const form = document.querySelector('.addWorks');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const title = document.getElementById('title').value;
        const category = document.getElementById('category').value;
        const pictureImg = document.querySelector('.picture img');
        const picture = document.querySelector('.picture');
        uploadedFile = file;

        // Erreur si champs vides
        if (!title || !category || !uploadedFile) {
            const error = document.querySelector('.error');
            error.classList.remove('hidden');
            return
        }

        //envoie Api work
        const token = localStorage.getItem('token');
        const formData = new FormData();
        formData.append('title', title);
        formData.append('category', category);
        formData.append('image', uploadedFile);

        const response = await fetch(apiUrl + 'works', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        // reset du formulaire si ok + actualisation
        if (response.ok) {
            form.reset();
            const error = document.querySelector('.error');
            error.classList.add('hidden');
            uploadedFile = null;
            pictureImg.remove();
            picture.innerHTML = imgWorks;
            displayWorks();
            modaleGallery();
        }
    });


}

// affichage des modales 
function modale() {

    modaleGallery();
    modaleFormWorks();
    closeModale();
    addWork();


}



async function init() {
    // appel de la fonction d'affichage categories
    displayCategories();
    // appel de la fonction d'affichage travaux
    displayWorks();
    // appel de la fonction mode admin
    admin();
    // appel des fonctions lié aux modales
    modale();
}

init();