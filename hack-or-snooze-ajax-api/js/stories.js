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

async function getSubmitFormData(evt) {
  console.debug('getSubmitFormData')
  evt.preventDefault();
  const author = $authorInput.val();
  const title = $titleInput.val();
  const url = $urlInput.val();
  const storyFormData = {author, title, url};
  const newStory = await storyList.addStory(currentUser, storyFormData);
  const $newStory = generateStoryMarkup(newStory);
  $allStoriesList.prepend($newStory);
  $authorInput.val('');
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
async function favoritesToggle(evt) {
  evt.preventDefault();
  const selectedStoryID = $(evt.target).closest('li').attr('id');

  if ($(this).hasClass('bi bi-star')) {
    for (let story of storyList.stories) {
      if (story.storyId === selectedStoryID) {
        await currentUser.addFavorite(story); //TODO: think about re-favoriting
        // on favorites page when story not in main story list
        break;
      }
    }
  } else {
    for (let story of currentUser.favorites) {
      if (story.storyId === selectedStoryID) {
        await currentUser.removeFavorite(story);
        break;
      }
    }
  }

  $(evt.target)
  .toggleClass('bi bi-star')
  .toggleClass('bi bi-star-fill');
}

$allStoriesList.on('click', 'i', favoritesToggle);