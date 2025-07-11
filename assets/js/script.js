const recipeNameInput = document.querySelector('#recipe-name-input');
const searchBtn = document.querySelector('#search-btn');
const recipesContainer = document.querySelector('#recipes-container');

searchBtn.addEventListener('click', async () => {
    const search = recipeNameInput.value;
    const recipes = await getRecipes(search);
    renderRecipes(recipes);
});

function getRecipes(name) {
    const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`;
    return fetch(url)
        .then((res) => {
            if (!res.ok) throw new Error(res.statusText);
            return res.json();
        })
        .then((json) => {
            return json.meals;
        })
        .catch((err) => {
            throw err;
        });
}

function renderRecipes(recipes) {
    if (!recipes) {
        recipesContainer.innerHTML = `<div class="col-12 text-center text-body-tertiary">
            <div class="h1 fw-bold">Recipe Not Found</div>
        </div>`;
        return;
    }
    
    let contents = '';
    recipes.forEach(recipe => {
        contents += `<div class="col-6 col-md-4 col-lg-3 col-xl-2">
            <div class="card h-100">
                <img src="${recipe.strMealThumb}" alt="mealthumb" class="card-img-top">
                <div class="card-body border-top">
                    <p class="card-text mb-0">${recipe.strMeal}</p>
                    <span class="badge text-bg-warning">${recipe.strCategory}</span>
                </div>
            </div>
        </div>`;
    });
    recipesContainer.innerHTML = contents;
}