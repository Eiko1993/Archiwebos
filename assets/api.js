/* API Works */



export async function getWorks(){
    const works = await fetch("http://localhost:5678/api/works");
    return worksJson = await works.json();
}
getWorks();


/*Catégories*/

export async function getCategories(){
    const categories = await fetch("http://localhost:5678/api/categories");
    return categoriesJson = await categories.json();
}
getCategories();

