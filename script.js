// Reference HTML elements
let recipeForm = document.getElementById('recipe-form');
let recipeName = document.getElementById('recipe-name');
let ingredients = document.getElementById('ingredients');
let steps = document.getElementById('steps');
let recipeImage = document.getElementById('recipe-image');
let displayArea = document.getElementById('recipes-container');

let currentEditIndex = null; // tracking the recipe being edited

// array - store recipes
let recipes = [];

// Loading recipes from local storage to the page 
document.addEventListener('DOMContentLoaded', function() {
    if (localStorage.getItem('recipes')) {
        recipes = JSON.parse(localStorage.getItem('recipes'));
        refreshDisplay();
    }
});

// Function - displays a single recipe
function displayRecipe(recipe, index) {
    // Create a div for the new recipe
    let recipeDiv = document.createElement('div');
    recipeDiv.className = 'recipe-card';

    // Add HTML structure for the recipe
    recipeDiv.innerHTML = `
        <h3>${recipe.name}</h3>
        <p><strong>Ingredients:</strong> ${recipe.ingredients}</p>
        <p><strong>Steps:</strong> ${recipe.steps}</p>
    `;

    // Add the recipe image if the URL is provided
    if (recipe.image) {
        let recipeImg = document.createElement('img');
        recipeImg.src = recipe.image;
        recipeImg.alt = recipe.name;
        recipeImg.className = 'recipe-image';
        recipeDiv.insertBefore(recipeImg, recipeDiv.firstChild);
    }

    // Create an edit button
    let editButton = document.createElement('button');
    editButton.textContent = "Edit";
    editButton.onclick = function() {
        enterEditMode(index);
    };

    // Create a delete button
    let deleteButton = document.createElement('button');
    deleteButton.textContent = "Delete";
    deleteButton.onclick = function() {
        deleteRecipe(index);
    };

    // Append the edit and delete buttons to the recipe div
    recipeDiv.appendChild(editButton);
    recipeDiv.appendChild(deleteButton);

    // Add the new recipe div to the display area
    displayArea.appendChild(recipeDiv);
}

// Function - enters edit mode
function enterEditMode(index) {
    currentEditIndex = index;
    let recipe = recipes[index];

    
    recipeName.value = recipe.name;
    ingredients.value = recipe.ingredients;
    steps.value = recipe.steps;
    recipeImage.value = recipe.image;

    
    recipeForm.querySelector('button').textContent = 'Update Recipe';
}

// Function - delete a recipe
function deleteRecipe(index) {
    // Remove the recipe from the array
    recipes.splice(index, 1);

    // Save the updated array to local storage
    localStorage.setItem('recipes', JSON.stringify(recipes));

    // Refresh the display
    refreshDisplay();
}

// Function to refresh the display area
function refreshDisplay() {
    // Clear the display area
    displayArea.innerHTML = '';

    // Display each recipe in the array
    recipes.forEach((recipe, index) => {
        displayRecipe(recipe, index);
    });
}

// Function - handles form submission
function addOrUpdateRecipe(event) {
    event.preventDefault(); // Prevent the form from submitting the default way 

    
    let enteredRecipeName = recipeName.value.trim();
    let enteredIngredients = ingredients.value.trim();
    let enteredSteps = steps.value.trim();
    let enteredImageURL = recipeImage.value.trim();

    // Ensure all fields are filled
    if (enteredRecipeName && enteredIngredients && enteredSteps) {
        if (currentEditIndex !== null) {
            // Update the existing recipe
            recipes[currentEditIndex] = {
                name: enteredRecipeName,
                ingredients: enteredIngredients,
                steps: enteredSteps,
                image: enteredImageURL // Add the image URL
            };
            currentEditIndex = null; // Reset the current edit index
            recipeForm.querySelector('button').textContent = 'Add Recipe'; // Change button text back to 'Add Recipe'
        } else {
            // Create a new recipe 
            let newRecipe = {
                name: enteredRecipeName,
                ingredients: enteredIngredients,
                steps: enteredSteps,
                image: enteredImageURL // Add the image URL
            };

            // Add the new recipe to the array
            recipes.push(newRecipe);
        }

        // Save the updated array to local storage
        localStorage.setItem('recipes', JSON.stringify(recipes));

        
        refreshDisplay();

        // Clear the input fields
        recipeForm.reset();
    }
}

// Add event listener to the form
recipeForm.addEventListener('submit', addOrUpdateRecipe);
