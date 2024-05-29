/*Variables*/

const email = document.querySelector("form #email");
const password = document.querySelector("form #password");
const form = document.querySelector("form");


/*Connexion*/

async function logIn(){
    form.addEventListener("submit",function(e) {
        e.preventDefault();
        const logUser = {
            email:e.target.querySelector("[name=email]").value,
            password:e.target.querySelector("[name=password]").value,
        };

        
        const login = JSON.stringify(logIn);

        fetch("http://localhost:5678/api/users/login", {
            method: "POST" ,
            headers: {"Content-Type": "application/json"},
            body: logU
        });
        
        if (logUser.email.value === "" || logUser.password.value === ""){
 
            throw new Error(`L'un des deux champs est vide`)
        
        };


        }
        
    )
    /*window.localStorage.setItem("form", logU);*/
}

logIn();