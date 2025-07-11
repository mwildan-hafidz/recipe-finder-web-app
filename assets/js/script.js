const recipeNameInput = document.querySelector('#recipe-name-input');
const searchBtn = document.querySelector('#search-btn');
const recipesContainer = document.querySelector('#recipes-container');

searchBtn.addEventListener('click', async () => {
    const search = recipeNameInput.value;
    if (search.trim() === '') return;

    const recipes = await getRecipes(search);
    renderRecipes(recipes);
});

document.body.addEventListener('click', async (e) => {
    const recipeCard = e.target.closest('.recipe-card');
    if (!recipeCard) return;

    const id = recipeCard.dataset.recipeid;
    const recipeDetail = await getRecipeDetail(id);
    renderRecipeDetail(recipeDetail);
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

function getRecipeDetail(id) {
    const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`;
    return fetch(url)
        .then((res) => {
            if (!res.ok) throw new Error(res.statusText);
            return res.json();
        })
        .then((json) => {
            return json.meals[0];
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
            <div class="card h-100 recipe-card" data-bs-toggle="modal" data-bs-target="#recipe-detail-modal" data-recipeid="${recipe.idMeal}">
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

const modal = document.querySelector('#recipe-detail-modal');
const detailName = modal.querySelector('#detail-name');
const detailCategory = modal.querySelector('#detail-category');
const detailArea = modal.querySelector('#detail-area');
const detailTags = modal.querySelector('#detail-tags');
const detailInstructions = modal.querySelector('#detail-instructions');

function renderRecipeDetail(recipeDetail) {
    let tags = '';
    const tagsArray = recipeDetail.strTags.split(',');
    tagsArray.forEach((tag) => {
        tags += `<span class="badge text-bg-warning">${tag}</span> `;
    });

    let instructions = '';
    const instructionsArray = recipeDetail.strInstructions.split('\r\n');
    instructionsArray.forEach((instruction) => {
        instructions += `<p>${instruction}</p>`;
    })

    detailName.innerHTML = recipeDetail.strMeal;
    detailCategory.innerHTML = recipeDetail.strCategory;
    detailArea.innerHTML = recipeDetail.strArea;
    detailTags.innerHTML = tags;
    detailInstructions.innerHTML = instructions;
}