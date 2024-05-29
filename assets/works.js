/* Afficher les travaux */


const gallery = document.querySelector(".gallery");
const filters = document.querySelector(".filters");

/*Afficher traveaux*/

async function getWorks(){
    const works = await fetch("http://localhost:5678/api/works");
    return worksJson = await works.json();
}
getWorks();
/*import { getWorks } from "/api.js";*/

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
async function getCategories(){
    const categories = await fetch("http://localhost:5678/api/categories");
    return categoriesJson = await categories.json();
}
getCategories();
/*import {getCategories} from "/api.js";*/

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
            btnId = e.target.id; //Affiche l'id du bouton sur lequel on clique//
            gallery.innerHTML = "";
            if (btnId !== "0") {
                const projectsCategory = projects.filter((work) => {
                    return work.categoryId == btnId;
                });
                projectsCategory.forEach(work => {
                    createWorks(work);
                });
            }else{
                displayWorks();
            }


        })
    })
}
filterCategory();
