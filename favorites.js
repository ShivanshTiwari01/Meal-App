document.addEventListener("DOMContentLoaded", () => {
    // Function to retrieve favorite items from local storage
    const getFavoriteItems = () => {
        return JSON.parse(localStorage.getItem("favouritesList")) || [];
    };

    // Function to fetch item details by ID (Replace with your data source logic)
    const fetchItemDetails = async (itemId) => {
        try {
            // Replace this with your actual API endpoint or data source URL
            const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${itemId}`);
            const data = await response.json();
            return data.meals[0]; // Return the item details
        } catch (error) {
            console.error("Error fetching item details:", error);
            return null;
        }
    };

    // Function to display favorite items
    const displayFavoriteItems = async () => {
        const favoritesList = getFavoriteItems();
        const favoritesListContainer = document.getElementById("favorites-list");

        if (favoritesList.length === 0) {
            favoritesListContainer.innerHTML = "<p>No favorite items yet.</p>";
        } else {
            // Clear the previous content
            favoritesListContainer.innerHTML = "";

            // Loop through the favorite items and display them
            for (const itemId of favoritesList) {
                const itemDetails = await fetchItemDetails(itemId);
                if (itemDetails) {
                    // Create HTML elements for each favorite item (e.g., a card with an image and a title)
                    const itemCard = document.createElement("div");
                    itemCard.classList.add("card");

                    // Create an image element for the item
                    const itemImage = document.createElement("img");
                    itemImage.src = itemDetails.strMealThumb; // Replace with the actual image URL property
                    itemImage.alt = itemDetails.strMeal; // Replace with the actual item name property
                    itemImage.classList.add("card-img-top");

                    // Create a card body element
                    const cardBody = document.createElement("div");
                    cardBody.classList.add("card-body");

                    // Create a title element for the item
                    const itemTitle = document.createElement("h5");
                    itemTitle.classList.add("card-title");
                    itemTitle.textContent = itemDetails.strMeal; // Replace with the actual item name property

                    // Append the image and title elements to the card body
                    cardBody.appendChild(itemImage);
                    cardBody.appendChild(itemTitle);

                    // Append the card body to the item card
                    itemCard.appendChild(cardBody);

                    // Append the item card to the favorites list container
                    favoritesListContainer.appendChild(itemCard);
                }
            }
        }
    };

    // Call the function to display favorite items when the page loads
    displayFavoriteItems();
});
