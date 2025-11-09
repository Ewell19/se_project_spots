import "../pages/index.css";
import {
  enableValidation,
  settings,
  resetValidation,
} from "../scripts/validation.js";

import Api from "../utils/Api.js";

// const initialCards = [
//   {
//     name: "Golden Gate Bridge",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/7-photo-by-griffin-wooldridge-from-pexels.jpg",
//   },
//   {
//     name: "Val Thorens",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
//   },
//   {
//     name: "Restaurant terrace",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
//   },
//   {
//     name: "An outdoor cafe",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
//   },
//   {
//     name: "A very long bridge, over the forest and through the trees",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
//   },
//   {
//     name: "Tunnel with morning light",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
//   },
//   {
//     name: "Mountain house",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
//   },
// ];

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "c97b7091-6f31-4820-913f-122b7552848c",
    "Content-Type": "application/json",
  },
});
let currentUserId = null;
let selectedCard = null;
let selectedCardId = null;

const confirmDeleteModal = document.querySelector("#confirm-delete-modal");
const confirmDeleteForm = confirmDeleteModal
  ? confirmDeleteModal.querySelector(".modal__form")
  : null;

if (confirmDeleteModal) {
  const confirmClose = confirmDeleteModal.querySelector(".modal__close-btn");
  if (confirmClose) {
    confirmClose.addEventListener("click", () =>
      closeModal(confirmDeleteModal)
    );
  }
}
// initialization runs later after DOM queries

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
const profileAvatar = document.querySelector(".profile__avatar");

const newPreviewModal = document.querySelector("#new-preview-modal");
const newPreviewImage = newPreviewModal.querySelector(".modal__image");
const newPreviewCaption = newPreviewModal.querySelector(".modal__caption");
const imagePreviewCloseButton = newPreviewModal.querySelector(
  ".modal__close-btn_type_preview"
);
imagePreviewCloseButton.addEventListener("click", function () {
  closeModal(newPreviewModal);
});
// Avatar edit modal & wiring
const avatarEditBtn = document.querySelector(".profile__avatar-edit");
const editAvatarModal = document.querySelector("#edit-avatar-modal");
const avatarForm = editAvatarModal
  ? editAvatarModal.querySelector(".modal__form")
  : null;
const avatarInput = avatarForm
  ? avatarForm.querySelector("#avatar-link-input")
  : null;
const avatarSubmitBtn = avatarForm
  ? avatarForm.querySelector(".modal__submit-btn")
  : null;
if (editAvatarModal) {
  const avatarClose = editAvatarModal.querySelector(".modal__close-btn");
  if (avatarClose)
    avatarClose.addEventListener("click", () => closeModal(editAvatarModal));
}
if (avatarEditBtn && editAvatarModal) {
  avatarEditBtn.addEventListener("click", () => {
    if (avatarInput && profileAvatar)
      avatarInput.value = profileAvatar.src || "";
    if (avatarForm) resetValidation(avatarForm, settings);
    openModal(editAvatarModal);
  });
}
// save original submit button texts for UX toggling
const editProfileSubmitBtnText = editProfileSubmitBtn
  ? editProfileSubmitBtn.textContent
  : "save";
const newPostSubmitBtnText = newPostSubmitBtn
  ? newPostSubmitBtn.textContent
  : "save";
const avatarSubmitBtnText = avatarSubmitBtn
  ? avatarSubmitBtn.textContent
  : "save";
const confirmDeleteSubmitBtn = confirmDeleteForm
  ? confirmDeleteForm.querySelector(".modal__submit-btn")
  : null;
const confirmDeleteSubmitBtnText = confirmDeleteSubmitBtn
  ? confirmDeleteSubmitBtn.textContent
  : "Yes, delete";
const cardTemplate = document
  .querySelector("#card__template")
  .content.querySelector(".card");

const cardList = document.querySelector(".cards__list");
function getCardElement(data) {
  const cardElement = cardTemplate.cloneNode(true);
  const cardTitle = cardElement.querySelector(".card__title");
  const cardImage = cardElement.querySelector(".card__image");

  cardImage.src = data.link;
  cardImage.alt = data.name;
  cardTitle.textContent = data.name;
  // attach id for future operations
  if (data._id) cardElement.dataset.id = data._id;

  // show like state if provided
  const cardLikeBtn = cardElement.querySelector(".card__like-button");
  if (data.isLiked) {
    cardLikeBtn.classList.add("card__like-button_active");
  }

  cardImage.addEventListener("click", () => {
    newPreviewImage.src = data.link;
    newPreviewImage.alt = data.name;
    newPreviewCaption.textContent = data.name;
    openModal(newPreviewModal);
  });

  // like / unlike via API
  cardLikeBtn.addEventListener("click", () => {
    const cardId = cardElement.dataset.id;
    if (!cardId) return;
    const shouldLike = !cardLikeBtn.classList.contains(
      "card__like-button_active"
    );
    api
      .changeLikeStatus(cardId, shouldLike)
      .then(() => {
        cardLikeBtn.classList.toggle("card__like-button_active", shouldLike);
      })
      .catch((err) => console.error("Failed to change like status:", err));
  });

  const cardDeleteBtn = cardElement.querySelector(".card__delete-button");
  // hide delete button if current user isn't the owner
  if (data.owner && currentUserId && data.owner !== currentUserId) {
    cardDeleteBtn.style.display = "none";
  }
  // instead of deleting immediately, open confirmation modal
  cardDeleteBtn.addEventListener("click", () => {
    handleDeleteCard(cardElement, data);
  });

  return cardElement;
}

function handleEscClose(evt) {
  if (evt.key === "Escape") {
    const openedModal = document.querySelector(".modal__is-opened");
    if (openedModal) closeModal(openedModal);
  }
}

function handleOverlayClick(evt) {
  if (evt.target.classList.contains("modal")) {
    closeModal(evt.target);
  }
}

function openModal(modal) {
  modal.classList.add("modal__is-opened");
  document.addEventListener("keydown", handleEscClose);
  modal.addEventListener("mousedown", handleOverlayClick);
}

function closeModal(modal) {
  modal.classList.remove("modal__is-opened");
  document.removeEventListener("keydown", handleEscClose);
  modal.removeEventListener("mousedown", handleOverlayClick);
}

editProfileBtn.addEventListener("click", function () {
  editProfileNameInput.value = profileName.textContent;
  editProfileDescriptionInput.value = profileDescription.textContent;
  resetValidation(editProfileform, settings);
  openModal(editProfileModal);
});

editProfileCloseBtn.addEventListener("click", function () {
  closeModal(editProfileModal);
});

newPostBtn.addEventListener("click", function () {
  resetValidation(newPostForm, settings);
  openModal(newPostModal);
});

newPostCloseBtn.addEventListener("click", function () {
  closeModal(newPostModal);
});

function handleEditProfileSubmit(evt) {
  evt.preventDefault();
  const name = editProfileNameInput.value;
  const about = editProfileDescriptionInput.value;
  if (editProfileSubmitBtn) {
    editProfileSubmitBtn.textContent = "Saving...";
    editProfileSubmitBtn.disabled = true;
  }
  api
    .setUserInfo({ name, about })
    .then((updatedUser) => {
      profileName.textContent = updatedUser.name;
      profileDescription.textContent = updatedUser.about;
      editProfileform.reset();
      closeModal(editProfileModal);
    })
    .catch((err) => console.error("Failed to update profile:", err))
    .finally(() => {
      if (editProfileSubmitBtn) {
        editProfileSubmitBtn.textContent = editProfileSubmitBtnText;
        editProfileSubmitBtn.disabled = false;
      }
    });
}

function handleNewPostSubmit(evt) {
  evt.preventDefault();
  const newPostLink = newPostLinkInput.value;
  const newPostCaption = newPostCaptionInput.value;
  const inputValues = {
    name: newPostCaption,
    link: newPostLink,
  };
  if (newPostSubmitBtn) {
    newPostSubmitBtn.textContent = "Saving...";
    newPostSubmitBtn.disabled = true;
  }
  api
    .addCard(inputValues)
    .then((card) => {
      const cardElement = getCardElement(card);
      cardList.prepend(cardElement);
      newPostForm.reset();
      closeModal(newPostModal);
    })
    .catch((err) => console.error("Failed to add card:", err))
    .finally(() => {
      if (newPostSubmitBtn) {
        newPostSubmitBtn.textContent = newPostSubmitBtnText;
        newPostSubmitBtn.disabled = false;
      }
    });
}

// Avatar update handler
function handleAvatarSubmit(evt) {
  evt.preventDefault();
  if (!avatarForm || !avatarInput) return;
  if (avatarSubmitBtn) {
    avatarSubmitBtn.textContent = "Saving...";
    avatarSubmitBtn.disabled = true;
  }
  const avatar = avatarInput.value;
  // basic client-side URL validation
  try {
    new URL(avatar);
  } catch (e) {
    console.error("Avatar URL is invalid:", avatar);
    if (avatarSubmitBtn) {
      avatarSubmitBtn.textContent = avatarSubmitBtnText;
      avatarSubmitBtn.disabled = false;
    }
    return;
  }

  // optimistic UI: remember previous src so we can revert on failure
  const previousAvatar = profileAvatar ? profileAvatar.src : "";
  if (profileAvatar) {
    profileAvatar.src = avatar;
  }

  console.log("Sending avatar PATCH with payload:", { avatar });
  api
    .setUserAvatar({ avatar })
    .then((updatedUser) => {
      console.log("Avatar update response:", updatedUser);
      if (profileAvatar) {
        profileAvatar.src = updatedUser.avatar;
        profileAvatar.alt = updatedUser.name || profileName.textContent;
      }
      avatarForm.reset();
      closeModal(editAvatarModal);
    })
    .catch((err) => {
      console.error("Failed to update avatar:", err);
      // revert optimistic update
      if (profileAvatar) profileAvatar.src = previousAvatar;
      // show a user-visible message (non-blocking)
      try {
        alert(
          "Failed to update avatar. Please check the image URL and try again."
        );
      } catch (e) {
        /* ignore in non-browser env */
      }
    })
    .finally(() => {
      if (avatarSubmitBtn) {
        avatarSubmitBtn.textContent = avatarSubmitBtnText;
        avatarSubmitBtn.disabled = false;
      }
    });
}

if (avatarForm) {
  avatarForm.addEventListener("submit", handleAvatarSubmit);
}

// Delete flow: open confirmation and delete on submit
function handleDeleteCard(cardElement, data) {
  selectedCard = cardElement;
  selectedCardId = data && data._id ? data._id : cardElement.dataset.id;
  if (confirmDeleteModal) openModal(confirmDeleteModal);
}

function handleDeleteSubmit(evt) {
  evt.preventDefault();
  if (!selectedCardId) {
    console.warn("No card id selected for deletion");
    closeModal(confirmDeleteModal);
    return;
  }
  if (confirmDeleteSubmitBtn) {
    confirmDeleteSubmitBtn.textContent = "Deleting...";
    confirmDeleteSubmitBtn.disabled = true;
  }
  api
    .deleteCard(selectedCardId)
    .then(() => {
      if (selectedCard && selectedCard.remove) selectedCard.remove();
      selectedCard = null;
      selectedCardId = null;
      if (confirmDeleteModal) closeModal(confirmDeleteModal);
    })
    .catch((err) => console.error("Failed to delete card:", err))
    .finally(() => {
      if (confirmDeleteSubmitBtn) {
        confirmDeleteSubmitBtn.textContent = confirmDeleteSubmitBtnText;
        confirmDeleteSubmitBtn.disabled = false;
      }
    });
}

if (confirmDeleteForm) {
  confirmDeleteForm.addEventListener("submit", handleDeleteSubmit);
}

editProfileform.addEventListener("submit", handleEditProfileSubmit);
newPostForm.addEventListener("submit", handleNewPostSubmit);

enableValidation(settings);

// Initialize app data: load user profile and initial cards
Promise.all([api.getUserInfo(), api.getInitialCards()])
  .then(([user, cards]) => {
    console.log("App init - user:", user);
    if (profileAvatar) {
      profileAvatar.src = user.avatar;
      profileAvatar.alt = user.name;
    }
    if (profileName) profileName.textContent = user.name;
    if (profileDescription) profileDescription.textContent = user.about;
    currentUserId = user._id;

    if (Array.isArray(cards) && cardList) {
      cards.forEach((card) => {
        const cardElement = getCardElement(card);
        cardList.append(cardElement);
      });
    }
  })
  .catch((err) => console.error("Failed to initialize data:", err));
