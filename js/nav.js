"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

function navSubmitStory(){
  hidePageComponents();
  $submitForm.show();
}
$navSubmitForm.on("click", navSubmitStory);

function navFavoriteStories(){
  hidePageComponents();
  showFavorites();
  $favoritedStories.show();
  // showFavorites();
}
$body.on("click", "#nav-favorites", navFavoriteStories)

function navMyStories(){
  hidePageComponents();
  showMyStories();
  $ownStories.show();
}
$body.on("click", "#nav-my-stories", navMyStories)

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}
