/*Variables*/
const log = document.querySelector("#login");
const form = document.querySelector("form");
errorMessage = document.querySelector("#login p");
/*Connexion*/

form.addEventListener("submit", (e) => {
    e.preventDefault();

    let email = document.querySelector('form #email').value;
    let password = document.querySelector('form #password').value;

 const user = fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "email": email,
            "password": password,
        })
    })
    .then(function(response){
        if(response.ok){
            response.json().then(function(data){
                localStorage.setItem('token',data.token);
                window.location.href = "index.html";
            })
        } else {
            console.log('Erreur dans l’identifiant ou le mot de passe');
            errorMessage.textContent = 'Erreur dans l’identifiant ou le mot de passe';
        }
    })
    .catch(error =>
        console.log('error: ' + error)
    );
})