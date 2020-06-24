const input = document.querySelector('.search-form__input');
const divResult = document.querySelector('.search-result');
const container = document.querySelector('.container');
const singleElementContainer = document.querySelector('.single-element-container');
const btnSearch = document.querySelector('.search-form__button-search');
const btnRandom = document.querySelector('.search-form__button-random');
const popup = document.querySelector('.popup');

const apiURL = 'https://www.thecocktaildb.com/api/json/v1/1/';

async function getDrink(e) {
    e.preventDefault();

    if (input.value.trim()) {
        const res = await fetch(`${apiURL}search.php?s=${input.value}`);
        const data = await res.json();
        divResult.innerHTML = `<h2 class="search-result__heading">Result for <span class="search-result__heading search-result__heading--color">'${input.value}'</span>:</h2>`;
        singleElementContainer.innerHTML = '';

        if (data.drinks === null) {
            divResult.innerHTML = `<h2 class="search-result__heading">Not result for '${input.value.toLowerCase()}'. Enter other drink!</h2>`;
            container.innerHTML = '';
            singleElementContainer.innerHTML = '';
        } else {
            addElementToDOM(data)
        }
        input.value = ''
    } else {
        showPopup();
    }
}
async function getRandomDrink(e) {
    e.preventDefault();
    const res = await fetch(`${apiURL}random.php`);
    const data = await res.json();
    singleElementContainer.innerHTML = '';
    divResult.innerHTML = `<h2 class="search-result__heading">Your random drink:</h2>`;
    addElementToDOM(data)
}
async function getDrinkByID(drinkID) {
    const res = await fetch(`${apiURL}lookup.php?i=${drinkID}`);
    const data = await res.json();
    const drink = data.drinks[0];
    const containerInner = container.innerHTML;
    container.innerHTML = '';

    addSingleElement(drink);

    document.querySelector('.hide-details').addEventListener('click', () => {
        container.innerHTML = containerInner;
        singleElementContainer.innerHTML = '';
    })
}

function addSingleElement(drink) {
    const ingredients = [];

    for (let i = 1; i <= 15; i++) {
        if (drink[`strIngredient${i}`]) {
            ingredients.push(`${drink[`strIngredient${i}`]} ${drink[`strMeasure${i}`] ? `- ${drink[`strMeasure${i}`]}` : ''}`)
        }
    }
    singleElementContainer.innerHTML =
        `
        <div class="single-element-container__drink">
            <div class="single-element-container__drink-name">${drink.strDrink}</div>
            <div class="single-element-container__drink-category">${drink.strCategory}</div>
            <img src="${drink.strDrinkThumb}" class="single-element-container__drink-img" />
            <button class="hide-details">Hide details</button>
        </div>
        <div class="single-element-container__ingredients">
            <ul class="single-element-container__element-list">${ingredients.map(el => `<li class="single-element-container__element-list__single-element">${el}</li>`).join('')}</ul>
            <p class="single-element-container__instructions">${drink.strInstructions}</p>
        </div>
        `
}
function addElementToDOM(data) {
    container.innerHTML = data.drinks.map(drink =>
        `<div class="container__drinks" >
            <div class="container__drink-name">${drink.strDrink}</div>
            <div class="container__drink-category">${drink.strCategory}</div>
            <img src="${drink.strDrinkThumb}" class="container__drink-img" />
            <button class="show-details" data-drinkID="${drink.idDrink}">Show details</button>
        </div >
        `).join('');
}

function showPopup() {
    popup.classList.add('popup__info--visible');
    setTimeout(() => {
        popup.classList.remove('popup__info--visible');
    }, 1500)
}

container.addEventListener('click', e => {
    const drinkInfo = e.path.find(item => {
        if (item.classList) {
            return item.classList.contains('show-details')
        } else {
            return false;
        }
    });
    if (drinkInfo) {
        const drinkID = drinkInfo.getAttribute('data-drinkID');
        getDrinkByID(drinkID)
    }
})

btnSearch.addEventListener('click', getDrink);
btnRandom.addEventListener('click', getRandomDrink);

