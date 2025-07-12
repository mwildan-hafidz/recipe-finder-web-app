const recipeNameInput = document.querySelector('#recipe-name-input');
const searchBtn = document.querySelector('#search-btn');
const recipesContainer = document.querySelector('#recipes-container');

const modal = document.querySelector('#recipe-detail-modal');
const modalCloseBtn = modal.querySelector('#modal-close-btn');
const detailName = modal.querySelector('#detail-name');
const detailCategory = modal.querySelector('#detail-category');
const detailArea = modal.querySelector('#detail-area');
const detailTags = modal.querySelector('#detail-tags');
const detailIngredients = modal.querySelector('#detail-ingredients');
const detailInstructions = modal.querySelector('#detail-instructions');

const alertContainer = document.querySelector('#alert-container');

searchBtn.addEventListener('click', async () => {
    const search = recipeNameInput.value;
    if (search.trim() === '') return;

    try {
        const recipes = await getRecipes(search);
        renderRecipes(recipes);
    }
    catch (err) {
        addAlert(err);
    }
});

document.body.addEventListener('click', async (e) => {
    const recipeCard = e.target.closest('.recipe-card');
    if (!recipeCard) return;

    const id = recipeCard.dataset.recipeid;
    const recipeDetail = await getRecipeDetail(id);
    renderRecipeDetail(recipeDetail);
});

modalCloseBtn.addEventListener('click', () => {
    setTimeout(() => {
        detailName.innerHTML = '<span class="placeholder col-6"></span>';
        detailCategory.innerHTML = '<span class="placeholder col-8"></span>';
        detailArea.innerHTML = '<span class="placeholder col-5"></span>';
        detailTags.innerHTML = '<span class="placeholder col-3"></span><span class="placeholder col-2"></span><span class="placeholder col-4"></span>';
        detailIngredients.innerHTML = '<span class="placeholder col-7"></span><span class="placeholder col-10"></span><span class="placeholder col-9"></span><span class="placeholder col-6"></span><span class="placeholder col-10"></span>';
        detailInstructions.innerHTML = '<span class="placeholder col-11"></span><span class="placeholder col-12"></span><span class="placeholder col-9"></span><span class="placeholder col-12"></span><span class="placeholder col-8"></span>';
    }, 100);
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
                    ${getTags(recipe)}
                </div>
            </div>
        </div>`;
    });
    recipesContainer.innerHTML = contents;
}

function renderRecipeDetail(recipeDetail) {
    detailName.innerHTML = recipeDetail.strMeal;
    detailCategory.innerHTML = recipeDetail.strCategory;
    detailArea.innerHTML = recipeDetail.strArea;
    detailTags.innerHTML = getTags(recipeDetail);
    detailIngredients.innerHTML = getIngredients(recipeDetail);
    detailInstructions.innerHTML = getInstructions(recipeDetail);
}


function getTags(recipeDetail) {
    let tags = '';
    try {
        const tagsArray = recipeDetail.strTags.split(',');
        tagsArray.forEach((tag) => {
            tags += `<span class="badge text-bg-warning">${tag}</span> `;
        });
    }
    catch {
        tags = '';
    }
    return tags;
}

function getIngredients(recipeDetail) {
    let ingredients = '<ol>';
    let i = 1;
    while (true) {
        const ingredient = recipeDetail[`strIngredient${i}`];
        const measure = recipeDetail[`strMeasure${i}`];

        if (ingredient === '' || measure === '') break;

        ingredients += `<li>${ingredient} (${measure})</li>`;
        i++;
    }
    ingredients += '</ol>';
    return ingredients;
}

function getInstructions(recipeDetail) {
    let instructions = '';
    const instructionsArray = recipeDetail.strInstructions.split('\r\n');
    instructionsArray.forEach((instruction) => {
        instructions += `<p>${instruction}</p>`;
    });
    return instructions;
}

function addAlert(msg) {
    alertContainer.innerHTML += `<div class="alert alert-danger alert-dismissible mb-2" role="alert">
        <div>${msg}</div>
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>`
}