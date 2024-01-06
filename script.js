const baseURL = "https://www.themealdb.com/api/json/v1/1/";

const fetchSearchSuggestions = async (searchKeyword) => {
  try {
    const response = await fetch(`${baseURL}search.php?s=${searchKeyword}`);
    const data = await response.json();
    return data.meals;
  } catch (error) {
    console.error("Error fetching search suggestions:", error);
    return [];
  }
};

// Function to update search suggestions
async function updateSearchSuggestions() {
  const searchKeyword = document.getElementById("my-search").value.trim();
  const suggestionsContainer = document.getElementById("search-suggestions");

  if (searchKeyword) {
    const suggestions = await fetchSearchSuggestions(searchKeyword);

    let html = ``;

    if (suggestions.length > 0) {
      suggestions.forEach((suggestion) => {
        html += `<div class="suggestion">${suggestion.strMeal}</div>`;
      });
    } else {
      html = `<div class="suggestion">No suggestions found.</div>`;
    }

    suggestionsContainer.innerHTML = html;
  } else {
    suggestionsContainer.innerHTML = ""; // Clear suggestions if search bar is empty
  }
}

// Add an event listener to the search input for real-time updates
document.getElementById("my-search").addEventListener("input", updateSearchSuggestions);



// Function to fetch Indian meals
const fetchIndianMeals = async () => {
  try {
    const response = await fetch(`${baseURL}filter.php?a=Indian`);
    const data = await response.json();
    return data.meals;
  } catch (error) {
    console.error("Error fetching Indian meals:", error);
    return [];
  }
};

// Function to fetch meals by search keyword
const fetchMealsBySearch = async (searchKeyword) => {
  try {
    const response = await fetch(`${baseURL}search.php?s=${searchKeyword}`);
    const data = await response.json();
    return data.meals;
  } catch (error) {
    console.error("Error fetching meals by search:", error);
    return [];
  }
};

// Function to display Indian meals initially
async function showIndianMeals() {
  const meals = await fetchIndianMeals();

  let html = ``;

  if (meals.length > 0) {
    meals.forEach((meal) => {
      html += `
        <div id="card" class="card mb-3" style="width: 20rem;">
          <img src="${meal.strMealThumb}" class="card-img-top" alt="${meal.strMeal}">
          <div class="card-body">
            <h5 class="card-title">${meal.strMeal}</h5>
            <div class="d-flex justify-content-between mt-5">
              <button type="button" class="btn btn-outline-light" onclick="showMealDetails(${meal.idMeal})">More Details</button>
              <button id="main${meal.idMeal}" class="btn btn-outline-light" onclick="addRemoveToFavList(${meal.idMeal})" style="border-radius:50%"><i class="fa-solid fa-heart"></i></button>
            </div>
          </div>
        </div>
      `;
    });
  } else {
    html = `
      <div class="page-wrap d-flex flex-row align-items-center">
        <div class="container">
          <div class="row justify-content-center">
            <div class="col-md-12 text-center">
              <span class="display-1 d-block">Not Found</span>
              <div class="mb-4 lead">
                No Indian meals found.
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  document.getElementById("main-card").innerHTML = html;
}

// Function to display meals by search
async function showMealsBySearch() {
  const searchKeyword = document.getElementById("my-search").value.trim();

  if (searchKeyword) {
    const meals = await fetchMealsBySearch(searchKeyword);

    let html = ``;

    if (meals.length > 0) {
      meals.forEach((meal) => {
        html += `
          <div id="card" class="card mb-3" style="width: 20rem;">
            <img src="${meal.strMealThumb}" class="card-img-top" alt="${meal.strMeal}">
            <div class="card-body">
              <h5 class="card-title">${meal.strMeal}</h5>
              <div class="d-flex justify-content-between mt-5">
                <button type="button" class="btn btn-outline-light" onclick="showMealDetails(${meal.idMeal})">More Details</button>
                <button id="main${meal.idMeal}" class="btn btn-outline-light" onclick="addRemoveToFavList(${meal.idMeal})" style="border-radius:50%"><i class="fa-solid fa-heart"></i></button>
              </div>
            </div>
          </div>
        `;
      });
    } else {
      html = `
        <div class="page-wrap d-flex flex-row align-items-center">
          <div class="container">
            <div class="row justify-content-center">
              <div class="col-md-12 text-center">
                <span class="display-1 d-block">Not Found</span>
                <div class="mb-4 lead">
                  No meals found matching "${searchKeyword}".
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    document.getElementById("main-card").innerHTML = html;
  } else {
    // Show Indian meals if the search keyword is empty
    showIndianMeals();
  }
}

// Function to fetch meal details by ID
const fetchMealDetails = async (id) => {
  try {
    const response = await fetch(`${baseURL}lookup.php?i=${id}`);
    const data = await response.json();
    return data.meals[0];
  } catch (error) {
    console.error("Error fetching meal details:", error);
    return null;
  }
};

// Function to add or remove a meal from the favorites list
function addRemoveToFavList(id) {
  let arr = JSON.parse(localStorage.getItem("favouritesList")) || [];
  let contain = arr.includes(id);

  if (contain) {
    arr = arr.filter((mealId) => mealId !== id);
    alert("Removed from favorites");
  } else {
    arr.push(id);
    alert("Added to favorites");
  }

  localStorage.setItem("favouritesList", JSON.stringify(arr));
  showMealsBySearch(); // Refresh the displayed meals after adding/removing from favorites
}

// Function to display meal details
async function showMealDetails(id) {
  const meal = await fetchMealDetails(id);

  if (meal) {
    let html = `
      <div id="meal-details" class="mb-5">
        <div id="meal-header" class="d-flex justify-content-around flex-wrap">
          <div id="meal-thumbnail">
            <img class="mb-2" src="${meal.strMealThumb}" alt="${meal.strMeal}" srcset="">
          </div>
          <div id="details">
            <h3>${meal.strMeal}</h3>
            <h6>Category : ${meal.strCategory}</h6>
            <h6>Area : ${meal.strArea}</h6>
          </div>
        </div>
        <div id="meal-instruction" class="mt-3">
          <h5 class="text-center">Instructions:</h5>
          <p>${meal.strInstructions}</p>
        </div>
        <div class="text-center">
          <a href="${meal.strYoutube}" target="_blank" class="btn btn-outline-light mt-3">Watch Video</a>
        </div>
      </div>
    `;

    document.getElementById("main-card").innerHTML = html;
  }
}

// Call showIndianMeals to display Indian meals on page load
showIndianMeals();
