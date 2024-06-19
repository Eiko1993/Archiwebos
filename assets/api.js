/* API Works */

export async function getWorks(){
    const works = await fetch("http://localhost:5678/api/works");
    return await works.json();
}

/*Catégories*/

export async function getCategories(){
    const categories = await fetch("http://localhost:5678/api/categories");
    return await categories.json();
}