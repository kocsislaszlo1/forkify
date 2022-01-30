import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import bookmarksView from './views/bookmarksView.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import paginationView from './views/paginationView.js';
import addRecipeView from './views/addRecipeView.js';
// if (module.hot) {
//   module.hot.accept();
// }
// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////
const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();

    //0 Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());

    //Updating bookmarks view

    bookmarksView.update(model.state.bookmarks);
    // 1. Loading recipe

    await model.loadRecipe(id);

    //2. rendering recipe

    recipeView.render(model.state.recipe);
  } catch (error) {
    recipeView.renderError();
    console.error(error);
  }
};
const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    //1 get search query

    const query = searchView.getQuery();
    if (!query) return;

    //2 Load search results

    await model.loadSearchResults(query);
    //3 render results

    //resultsView.render(model.state.search.result);
    resultsView.render(model.getSearchResultsPage());

    //4 render intial pag buttons

    paginationView.render(model.state.search);
    //
  } catch (error) {
    console.error(error);
  }
};
const controlPagination = function (goToPage) {
  //1 render NEW results

  resultsView.render(model.getSearchResultsPage(goToPage));

  //2 render NEW pag buttons

  paginationView.render(model.state.search);
};
const controlServing = function (newServings) {
  //Update the recipe servings in state

  model.updateServings(newServings);

  //Update the recipe view

  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};
const controlAddBookmark = function () {
  // Add/remove bookmark

  if (!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe);
  } else {
    model.deleteBookmark(model.state.recipe.id);
  }
  //Update recipe view

  recipeView.update(model.state.recipe);

  //render bookmark

  bookmarksView.render(model.state.bookmarks);
};
const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};
const controlAddRecipe = async function (newRecipe) {
  try {
    //Show loading spinner
    addRecipeView.renderSpinner();

    //Upload recipe

    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);
    //Render recipe

    recipeView.render(model.state.recipe);

    //Succes message
    addRecipeView.renderMessage();

    //Render bookmark view
    bookmarksView.render(model.state.bookmarks);
    //Change ID in URL

    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    //Close form window
    setTimeout(() => {
      addRecipeView.toogleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (error) {
    console.error(error);
    addRecipeView.renderError(error.message);
  }
  //Upload the recipes
};
const newFeature = function () {
  console.log(`Welcome to the application!`);
};
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServing);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  newFeature();
};
init();
