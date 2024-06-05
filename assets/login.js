/*Variables*/
const log = document.querySelector("#login")
const form = document.querySelector("form");
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
            console.log('ok');
            window.localStorage.setItem("login",user);
            window.location.href = "index.html";
        } else {
            console.log('erreur');
            const error = document.createElement("p");
            error.innerText ="Erreur dans l’identifiant ou le mot de passe";
            error.appendChild(log);
        }
    })
    .catch(error =>
        console.log('error: ' + error)
    );
})