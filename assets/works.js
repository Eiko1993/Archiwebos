/*Variables*/

const id = target.dataset.id;
const gallery = document.querySelector(".gallery");

/*Récuperer les données*/

async function getWorks(){
    const works = await fetch("http://localhost:5678/api/works");
    return worksJson = await works.json();
}
 getWorks();

/*Affichage*/

async function displayWorks(){
    const arrayWorks = await getWorks();
    arrayWorks.array.forEach(work => {
        const figure = document.createElement("figure");
        const img = document.createElement("img");
        const figcaption = document.createElement("figcaption");
        img.src = work.imageUrl;
        figcaption.innerHTML = work.title;
        figure.classList.add("figure");
        figure.appendChild(img);
        figure.appendChild(figcaption);
        figcaption.classList.add("figcaption");
        gallery.appendChild(figure);
    });
}

displayWorks();