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
 * A render method to render HTML for an individual Story instance empty star
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
        <span class="star">
          <i class="bi bi-star">
          </i>
        </span>
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/**
 * A render method to render HTML for an individual Story that adds a filled
 * star next to it
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */
function generateFavoritesStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
        <span class="star">
          <i class="bi bi-star-fill">
          </i>
        </span>
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}
/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  let $story;
  let isFavStory = false;
  for (let story of storyList.stories) {
    for (let favStory of currentUser.favorites) {
      if (story.storyId === favStory.storyId) {
        isFavStory = true;
      }
    }

    if (isFavStory) {
      $story = generateFavoritesStoryMarkup(story);
    } else {
      $story = generateStoryMarkup(story);
    }

    $allStoriesList.append($story);
    isFavStory = false;
  }
  $allStoriesList.show();
}

/** Gets info from submit form and calls methods to add story to API and
 * update DOM */

function getSubmitFormData(evt) {
  console.debug('getSubmitFormData')
  evt.preventDefault();
  const author = $authorInput.val();
  const title = $titleInput.val();
  const url = $urlInput.val();
  const storyFormData = {author, title, url};
  storyList.addStory(currentUser, storyFormData);
  $authorInput.val(''); //TODO: reset method
  $titleInput.val('');
  $urlInput.val('');
}

$submitForm.on('submit', getSubmitFormData);

/**Puts favorite stories on favorite "page" */
function putFavoritesOnPage() {
  console.debug("putFavoritesOnPage");
  $allStoriesList.empty();

  for (let story of currentUser.favorites) {
    const $story = generateFavoritesStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

/** Fills or unfills the star and calls favorite/unfavorite method */
function favoritesStarClick(evt) {
  evt.preventDefault();
  $(this)
    .toggleClass('bi bi-star')
    .toggleClass('bi bi-star-fill');
  const selectedStoryID = $(this).closest('li').attr('id');
  
  if ($(this).hasClass('bi bi-star-fill')) {
    for (let story of storyList.stories) {
      if (story.storyId === selectedStoryID) {
        currentUser.addFavorite(story);
        return;
      }
    }
  } else {
    for (let story of currentUser.favorites) {
      if (story.storyId === selectedStoryID) {
        currentUser.removeFavorite(story);
        return;
      }
    }
  }
}

$allStoriesList.on('click', 'i', favoritesStarClick);