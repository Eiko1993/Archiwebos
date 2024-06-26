/* Afficher les travaux */

import { getWorks, getCategories } from "./api.js";

const gallery = document.querySelector(".gallery");
const galleryModal = document.querySelector('.image-edit')
const filters = document.querySelector(".filters");
const projectsNew = document.querySelector(".projects");
const logChange = document.querySelector(".login");
let user = window.localStorage.getItem("login");
const edit = document.querySelector(".edit");

if (!user) {
    console.log("Oups c'est vide");
}
/*Afficher traveaux*/

async function displayWorks(){

    const arrayWorks = await getWorks();

    arrayWorks.forEach(work => {
        createWorks(work);
        createWorksModal(work);
    });
    deleteWork();
    addWorks();
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

function createWorksModal(work){
    const figure = document.createElement("figure");
    const img = document.createElement("img");
    const button = document.createElement("button");
    const trash = document.createElement("i");

    button.classList.add("delet");
    button.setAttribute('data-id', work.id);
    trash.classList.add("fa-solid","fa-trash-can");
    
    img.src = work.imageUrl;
    figure.id = work.id;
    figure.classList.add("fig");
    button.appendChild(trash);
    figure.appendChild(button);
    figure.appendChild(img);
    galleryModal.appendChild(figure);

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

if (localStorage.getItem('token')) {
    logChange.innerText = "logout";
    const  projectsImg = document.createElement("i");
    projectsImg.classList.add("fa-regular", "fa-pen-to-square");
    projectsNew.appendChild(projectsImg);
    const projectChange = document.createElement("a");
    projectChange.innerText = "modifier";
    projectChange.setAttribute("href","#modal");
    projectChange.classList.add("js-modal");
    projectChange.classList.add("modify");
    projectsImg.classList.add("modify");
    projectsNew.appendChild(projectChange);
    filters.style.display = "none";
    edit.style.display = "flex";
    logChange.addEventListener("click", ()=>{
        localStorage.removeItem("token");
        window.location.href = "index.html";
    })

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

const modalGeneral = document.querySelector(".modal");
const btnAddWorks = document.querySelector('.button-edit');
const modalWorks = document.querySelector('.works-modal');
const formModal = document.querySelector('.form-modal');
const btnBack = document.querySelector('.btn-back');
const closeAdd = document.querySelector(".form-modal .fa-xmark");

btnAddWorks.addEventListener('click', () => {
    modalWorks.style.display = "none";
    formModal.style.display = "block";
})

function back(){
    modalWorks.style.display = "block";
    formModal.style.display = "none";
}

btnBack.addEventListener('click', () => {
    back();
})

closeAdd.addEventListener("click",() => {
    modalGeneral.style.display = "none";

})

/*Suppression DELETE*/

async function deleteWork(){

    const btnDeletes = document.querySelectorAll('.delet');
    const idGallery = document.querySelectorAll('.gallery figure');

    btnDeletes.forEach((btnDelete, index) => {
        btnDelete.addEventListener("click", async () => {

            const idDelete = btnDelete.dataset.id;
            const figure = btnDelete.parentNode;
            const token = localStorage.getItem('token');

            const init ={
                method:"DELETE",
                headers: {
                    "Accept": "application/json",
                    "Authorization": "Bearer " + token
                },
            }
            try {
                const response = await fetch(`http://localhost:5678/api/works/${idDelete}`, init);
                console.log(`Statut de la réponse: ${response.status}`);
                if (!response.ok) {
                    console.log("La suppression n'a pas réussi");
                } else {
                    console.log("La suppression a réussi");
                    figure.remove();
                    if (idGallery[index]) {
                        idGallery[index].remove();
                    }
                }
            } catch (error) {
                console.error("Erreur lors de la suppression:", error);
            }
        })
    })
}

/*Préview*/

const previewImg = document.querySelector(".containerFile img");
const inputFile = document.querySelector(".containerFile input");
const labelFile = document.querySelector(".containerFile label");
const iconFile = document.querySelector(".containerFile .fa-image");
const pFile = document.querySelector(".containerFile p");


inputFile.addEventListener("change",()=>{
    const file = inputFile.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e){
            previewImg.src = e.target.result;
            previewImg.style.display="flex";
            labelFile.style.display="none";
            iconFile.style.display="none";
            pFile.style.display="none";
        }
        reader.readAsDataURL(file);
    }
})

/*Liste Categories*/

async function displayCategoriesModal(){
    const select = document.querySelector(".form-modal select");
    const categories = await getCategories();
    categories.forEach(category => {
        const option = document.createElement("option");
        option.value = category.id;
        option.textContent = category.name;
        select.appendChild(option);
    })
}
displayCategoriesModal();

/*Ajouter travail POST*/

const form = document.querySelector(".form-modal form");
const title = document.querySelector(".form-modal #title");
const category = document.querySelector(".form-modal #category");
const file = document.querySelector('#file');


async function addWorks() {
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');
        const formWork = new FormData(form);

        try {
            const init = {
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + token,
                },
                body: formWork,
            };

            const response = await fetch("http://localhost:5678/api/works", init);
            if (!response.ok) {
                console.log("L'ajout n'a pas réussi");
            } else {
                console.log("L'ajout a réussi");
                const newWork = await response.json(); // Récupérer la réponse JSON

                // Assurez-vous que `displayWorks()` est bien implémenté pour ajouter le nouvel élément
                gallery.innerHTML="";
                galleryModal.innerHTML="";

                displayWorks(newWork); // Passer le nouvel élément à la fonction displayWorks
                file.innerHTML="";
            }
        } catch (error) {
            console.error("Erreur lors de l'ajout:", error);
        }
        back();
    });
}

/*Vérifier si tous les champs sont remplis*/

function verifyForm(){
    const validButton = document.querySelector(".btn-submit");
    form.addEventListener("input",()=>{
        if (title.value !== "" && category.value !== "" && inputFile.value !== ""){
            validButton.classList.add("btn-submit-valid");
            validButton.classList.remove("btn-submit");
            validButton.disabled = false;
        }else{
            validButton.classList.remove("btn-submit-valid");
            validButton.classList.add("btn-submit");
            validButton.disabled = true;
        }
    })

}
verifyForm();

