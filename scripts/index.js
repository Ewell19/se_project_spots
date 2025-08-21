const editProfileBtn = document.querySelector(".profile__edit-btn");
const editProfileModal = document.querySelector("#edit-profile-modal");
const editProfileCloseBtn = editProfileModal.querySelector(".modal__close-btn");
const editProfileform = editProfileModal.querySelector(".modal__form");
const editProfileSubmitBtn =
  editProfileModal.querySelector(".modal__submit-btn");
const editProfileNameInput = editProfileModal.querySelector(
  "#profile-name-input"
);
const editProfileDescriptionInput = editProfileModal.querySelector(
  "#profile-description-input"
);

const newPostBtn = document.querySelector(".profile__add-btn");
const newPostModal = document.querySelector("#new-post-modal");
const newPostCloseBtn = newPostModal.querySelector(".modal__close-btn");
const newPostForm = newPostModal.querySelector(".modal__form");
const newPostLinkInput = newPostForm.querySelector("#card-image-input");
const newPostCaptionInput = newPostForm.querySelector("#card-caption-input");
const newPostSubmitBtn = newPostModal.querySelector(".modal__submit-btn");
const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");

editProfileBtn.addEventListener("click", function () {
  editProfileNameInput.value = profileName.textContent;
  editProfileDescriptionInput.value = profileDescription.textContent;
  editProfileModal.classList.add("modal_is-opened");
});

editProfileCloseBtn.addEventListener("click", function () {
  editProfileModal.classList.remove("modal_is-opened");
});

newPostBtn.addEventListener("click", function () {
  newPostModal.classList.add("modal_is-opened");
});

newPostCloseBtn.addEventListener("click", function () {
  newPostModal.classList.remove("modal_is-opened");
});

function handleEditProfileSubmit(evt) {
  evt.preventDefault();
  profileName.textContent = editProfileNameInput.value;
  editProfileModal.classList.remove("modal_is-opened");
  profileDescription.textContent = editProfileDescriptionInput.value;
}

function handleNewPostSubmit(evt) {
  evt.preventDefault();
  const newPostLink = newPostLinkInput.value;
  const newPostCaption = newPostCaptionInput.value;
  console.log("New post link:", newPostLink);
  console.log("New post caption:", newPostCaption);
  newPostModal.classList.remove("modal_is-opened");
}

editProfileform.addEventListener("submit", handleEditProfileSubmit);
newPostForm.addEventListener("submit", handleNewPostSubmit);
