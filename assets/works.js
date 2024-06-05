/* Afficher les travaux */

import { getWorks, getCategories } from "./api.js";

const gallery = document.querySelector(".gallery");
const filters = document.querySelector(".filters");
const projectsNew = document.querySelector(".projects");
const logChange = document.querySelector(".login");
let user = window.localStorage.getItem("login");


if (!user) {
    console.log("Oups c'est vide");
}
/*Afficher traveaux*/

async function displayWorks(){

    const arrayWorks = await getWorks();

    arrayWorks.forEach(work => {
        createWorks(work);
    });
}
displayWorks();

function createWorks(work){
    const figure = document.createElement("figure");
    const img = document.createElement("img");
    const figcaption = document.createElement("figcaption");

    img.src = work.imageUrl;
    figcaption.innerHTML = work.title;

    figure.id = work.id;

    figure.appendChild(img);
    figure.appendChild(figcaption);
    figcaption.classList.add("figcaption");
    gallery.appendChild(figure);
}

/*Afficher categories*/

async function displayCategories() {
    const arrayCategories = await getCategories(); 
    arrayCategories.forEach(category => {
        const btn = document.createElement("button");
        btn.textContent = category.name;
        btn.id = category.id;
        btn.classList.add("button");
        filters.appendChild(btn);
    })
}
displayCategories();

/*filter par categories*/
async function filterCategory(){
    const projects = await getWorks();
    const buttons = document.querySelectorAll(".filters button");
    buttons.forEach(button => {
        button.addEventListener("click", (e) => {
            const btnId = e.target.id; //Affiche l'id du bouton sur lequel on clique//
            gallery.innerHTML = "";
            if (btnId !== "0") {
                const projectsCategory = projects.filter((work) => {
                    return work.categoryId == btnId;
                });
                projectsCategory.forEach(work => {
                    createWorks(work);
                });
            } else {
                displayWorks();
            }
        })
    })
}
filterCategory();

/*Modifier page*/

if (user !== null) {
    logChange.innerText = "logout";
    /*const  projectsImg = document.createElement("i");
    projectsImg.classList.add("fa-regular fa-pen-to-square");
    projectsNew.appendChild(projectsImg);*/
    const projectChange = document.createElement("a");
    projectChange.innerText = "modifier";
    projectChange.setAttribute("href","#modal");
    projectChange.classList.add("js-modal");
    projectsNew.appendChild(projectChange);

}

let modal = null;

const projectEdit = function (e) {
    e.preventDefault();
    const target = document.querySelector(e.target.getAttribute("href"));
    target.style.display = null;
    target.removeAttribute("aria-hidden");
    target.setAttribute("aria-modal","true");
    modal = target;
    modal.addEventListener("click", closeEdit);
    modal.querySelector(".js-modal-close").addEventListener("click",closeEdit);
    modal.querySelector(".js-modal-stop").addEventListener("click",stopPropagation);
}

const closeEdit = function (e) {
    if (modal === null) return;
    e.preventDefault();
    modal.style.display = "none";
    modal.setAttribute("aria-hidden","true");
    modal.removeAttribute("aria-modal");
    modal.removeEventListener("click", closeEdit);
    modal.querySelector(".js-modal-close").removeEventListener("click",closeEdit);
    modal.querySelector(".js-modal-stop").removeEventListener("click",stopPropagation);
    modal = null;
}

const stopPropagation = function(e){
    e.stopPropagation();
}

document.querySelectorAll(".js-modal").forEach(a => {
    a.addEventListener("click", projectEdit);

})
