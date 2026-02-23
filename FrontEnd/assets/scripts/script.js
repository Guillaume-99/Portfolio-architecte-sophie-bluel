// appel API categories
const apiCategories = 'http://localhost:5678/api/categories';

// appel API categories pour conversion en json
async function getCategories() {
    const response = await fetch(apiCategories);
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

    const buttons = document.querySelectorAll('.filtersBtn');
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            buttons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
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


// appel API travaux
const api = 'http://localhost:5678/api/works';

// appel API travaux pour conversion en json
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



//appel API login
const apiLogin = 'http://localhost:5678/api/users/login';

// appel API login pour conversion en json
async function login(email, password) {
    const response = await fetch(apiLogin, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
        alert('Email ou mot de passe incorrect');
        return;
    }

    const data = await response.json();
    return data;
}

// Récupérer le formulaire et envoyer le submit
const form = document.querySelector('.login_page form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = emailInput.value;
    const password = passwordInput.value;
    const data = await login(email, password);

    localStorage.setItem('token', data.token);
    loginPage();

});




// Suppresion de la page de login SI valide
async function loginPage() {
    const loginPage = document.querySelector('.login');
    loginPage.classList.add('hidden');
    const main = document.querySelector('main');
    main.classList.remove('hidden');

}






async function init() {
    // appel de la fonction d'affichage categories
    displayCategories();
    // appel de la fonction d'affichage travaux
    displayWorks();
    // appel de la fonction d'affichage login

}

init();