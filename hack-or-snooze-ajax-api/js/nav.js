"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  evt.preventDefault();
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  evt.preventDefault();
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  hidePageComponents();
  putStoriesOnPage();
  $navLogin.hide();
  $navLogOut.show();
  $navSubmit.show();
  $navFavorites.show();
  $navMyStories.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}



/** Show submit story form on click on "submit" */

function navSubmitClick(evt) {
  console.debug('navSubmitClick');
  evt.preventDefault();
  hidePageComponents();
  $submitForm.show();
  $allStoriesList.show();
}

$navSubmit.on('click', navSubmitClick);

/**Update Dom with user Favorites */

function navFavoritesClick(evt) {
  console.debug('navFavoritesClick');
  evt.preventDefault();
  hidePageComponents();
  putFavoritesOnPage();
}

$navFavorites.on('click', navFavoritesClick);