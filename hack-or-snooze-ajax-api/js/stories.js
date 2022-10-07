"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  /*make own function maybe */
  /*
  const unFavoriteStories = storyList.stories.filter(story => {
    for (let favStory of currentUser.favorites) {
      if (story.storyId === favStory.storyId) {
        return false;
      }
    }
    return true;
  });

  const numAddittionalStories = storyList.stories.length - unFavoriteStories.length;
*/
  /* Current problem:
      I CAN remove existing favorites from initial storyList and update it
      with the necessary amount of stories.
      If someone favorites one of the new stories that was added in addition,
      I CANNOT remove that one from the storyList
        - thinking of using recursion
        - not sure how to implement
        - maybe put functionality of checking for matching favorites inside
        getAdditionalStories
        - that way I can recursively call it (will try after LUNCH)
  */
/*
  //new code
  if (numAddittionalStories !== 0) {
    const additionalStoryList =
      await StoryList.getAdditionalStories(numAddittionalStories);
    storyList.stories = [...additionalStoryList, ...unFavoriteStories];
  }
*/
  // if (numAddittionalStories !== 0) {
  //   console.log('secondAxios');
  //   const additionalStoryList = await StoryList.getAdditionalStories(numAddittionalStories);
  //   console.log('new Story grabbed', additionalStoryList.stories);
  //   additionalStoryList.stories = additionalStoryList.stories.concat(unFavoriteStories);
  //   console.log('newStories', additionalStoryList.stories);
  //   storyList = additionalStoryList;
  // }

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
 * A render method to render HTML for an individual Story instance filled star
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
    console.log(isFavStory);
    if (isFavStory) {
      console.log('favorite');
      $story = generateFavoritesStoryMarkup(story);
    } else {
      console.log('notFav');
      $story = generateStoryMarkup(story);
    }
    $allStoriesList.append($story);
    isFavStory = false;
  }
  $allStoriesList.show();

  /* filter through storyList.stories only returning stories that don't match
  current favorites IDs
  get difference in length between 25-unfavoritedList
  send another getStories method but only calling for the difference in stories
  append the unfavoritedList and new list together.*/

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

/* TODO: make this a function specifically for storyList... will need another function
for favorites tab or i can make a function that takes in an array either
storyList or favoritesList*/


  if ($(this).hasClass('bi bi-star-fill')) {
    let selectedStory;
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