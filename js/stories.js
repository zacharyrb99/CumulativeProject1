"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story, deleteButton = false) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();

  const favStar = Boolean(currentUser);

  return $(`
      <li id="${story.storyId}">
        ${deleteButton ? deleteButtonHTML() : ""}
        ${favStar ? favStarHTML(story, currentUser) : ""}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

function deleteButtonHTML(){
  return `<span class="trash-can"> <i class="fas fa-trash-alt"></i> </span>`;
}

function favStarHTML(story, user){
  const isFavorite = user.isFavorite(story);
  let favStarType = "fas";

  if(isFavorite === false){
    favStarType = "far"
  }

  return `<span class="star"> <i class="${favStarType} fa-star"></i> </span>`;
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const Story = generateStoryMarkup(story);
    $allStoriesList.append(Story);
  }

  $allStoriesList.show();
}

async function deleteStory(e){
  const liToDelete = $(e.target).closest("li");
  const storyId = liToDelete.attr("id");

  await storyList.removeStory(currentUser, storyId);

  await showMyStories();
}
$ownStories.on("click", ".trash-can", deleteStory);

async function submitNewStory(e){
  e.preventDefault();

  const newStory = await storyList.addStory(currentUser, {
    title: $("#title").val(),
    author: $("#author").val(),
    url: $("#url").val(),
  });
  const story = generateStoryMarkup(newStory);
  $allStoriesList.prepend(story);

  $("#title").val("");
  $("#author").val("");
  $("#url").val("");
  $submitForm.hide();
}
$submitForm.on("submit", submitNewStory);

function showMyStories(){
  $ownStories.empty();

  if(currentUser.ownStories.length > 0){
    for (let story of currentUser.ownStories) {
      let Story = generateStoryMarkup(story, true);
      $ownStories.append(Story);
    }
  }else{
    $ownStories.append("<h3>You haven't created any stories yet</h3>");
  }

  $ownStories.show();
}

function showFavorites(){
  $favoritedStories.empty();

  if (currentUser.favorites.length === 0) {
    $favoritedStories.append("<h3>No favorites added!</h3>");
  } else {
    for (let story of currentUser.favorites) {
      const $story = generateStoryMarkup(story);
      $favoritedStories.append($story);
    }
  }

  $favoritedStories.show();
}

async function toggleFavorites(e) {
  const $target = $(e.target);
  const $targetLi = $target.closest("li");
  const storyId = $targetLi.attr("id");
  const story = storyList.stories.find(function(s){
    return s.storyId === storyId
  })

  if ($target.hasClass("fas")){
    await currentUser.removeFavorite(story);
    $target.closest("i").toggleClass("fas far");
  } else {
    await currentUser.addFavorite(story);
    $target.closest("i").toggleClass("fas far");
  }
}

$storiesLists.on("click", ".star", toggleFavorites);
