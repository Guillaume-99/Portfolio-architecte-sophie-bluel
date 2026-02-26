// appel API 
const apiUrl = 'http://localhost:5678/api/';



// appel API login pour conversion en json
async function login(email, password) {

    const response = await fetch(apiUrl + 'users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });




    if (!response.ok) {
        const error = document.querySelector('span.hidden');
        error.classList.remove('hidden');
        return
    }

    const data = await response.json();
    return data;

}


// Récupérer le formulaire et envoyer le submit

async function checkLogin() {
    const form = document.querySelector('.login_page form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const email = emailInput.value;
        const password = passwordInput.value;
        const data = await login(email, password);

        if (!data) {
            return;
        }

        localStorage.setItem('token', data.token);
        window.location.href = 'index.html';
    });
}
// appel de la fonction de check login
checkLogin();





