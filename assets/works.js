/* Afficher les travaux */

import { getWorks, getCategories } from "./api.js";

const gallery = document.querySelector(".gallery");
const galleryModal = document.querySelector('.image-edit')
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
        createWorksModal(work);
    });
    deleteWork();
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
    const span = document.createElement("span");
    const trash = document.createElement("i");
    span.classList.add("delet");
    trash.classList.add("fa-solid","fa-trash-can");
    trash.id = figure.id;
    img.src = work.imageUrl;
    figure.id = work.id;
    figure.classList.add("fig");
    span.appendChild(trash);
    figure.appendChild(span);
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

/*Suppression*/

async function deleteWork(){
    const trashAll = document.querySelectorAll(".fa-trash-can");

    trashAll.forEach(trash => {
        trash.addEventListener("click",(e) => {
            const id = trash.id;
            const init ={
                method:"DELETE",
                headers: {
                    "Content-Type":"application/json"
                },
            }
            fetch("http://localhost:5678/api-docs/works/" +id,init)
            .then((response)=>{
                if (!response.ok){
                    console.log("delete marche pas");
                }
            })
        })
    })
}

/*Préview*/

const previewImg = document.querySelector(".containerFile img");
const inputFile = document.querySelector(".containerFile input");
const labelFile = document.querySelector(".containerFile label");
const iconFile = document.querySelector(".containerFile .fa-image");
const pFile = document.querySelector("containerFile p");


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

form.addEventListener("submit",async (e)=>{
    e.preventDefault();
    const formData = {
        title:title.value,
        imageUrl:previewImg.src,
        categoryId:{
            id:category.value,
            name:category.options[category.selectedIndex].textContent,
        },
    };
    fetch("http://localhost:5678/api/works",{
        method:"POST",
        body:JSON.stringify(formData),
        headers:{
            "content-Type":"application/json"
        },
    })
    .then(response => response.json())
    .then(data =>{
        console.log(data);
        displayWorks();
        back();
    })
})

/*Vérifier si tous les champs sont remplis*/

function verifyForm(){
    const validButton = document.querySelector(".btn-submit");
    form.addEventListener("input",()=>{
        if (title.value !== "" && category.value !== "" && inputFile.value !== ""){
            validButton.classList.add("btn-submit-valid");
            validButton.disabled = false;
        }
        else{
            validButton.classList.remove("btn-submit-valid");
            validButton.disabled = true;
        }
    })
    


}
verifyForm();