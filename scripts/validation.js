const settings = {
  formSelector: ".modal__form",
  inputSelector: ".modal__input",
  submitButtonSelector: ".modal__submit-btn",
  inactiveButtonClass: "modal__input_submit_btn_disabled",
  errorClass: "modal__input_type_error",
  errorMessage: {
    valueMissing: "This field is required",
    tooShort: "Minimum length is 2 characters",
    tooLong: "Maximum length is 200 characters",
    typeMismatch: "Please enter a valid email address",
  },
};

const showInputError = (formElement, inputElement, errorMessage) => {
  const errorMsgElement = formElement.querySelector(
    `#${inputElement.id}-error`
  );
  inputElement.classList.add(settings.errorClass);
  errorMsgElement.textContent = errorMessage;
};

const hideInputError = (formElement, inputElement) => {
  const errorMsgElement = formElement.querySelector(
    `#${inputElement.id}-error`
  );
  inputElement.classList.remove(settings.errorClass);
  errorMsgElement.textContent = "";
};

const checkInputValidity = (formElement, inputElement) => {
  if (!inputElement.validity.valid) {
    showInputError(formElement, inputElement, inputElement.validationMessage);
  } else {
    hideInputError(formElement, inputElement);
  }
};

const hasInvalidInput = (inputList) => {
  return inputList.some((inputElement) => {
    return !inputElement.validity.valid;
  });
};

const toggleButtonState = (inputList, buttonElement) => {
  const isFormValid = inputList.every(
    (inputElement) => inputElement.validity.valid
  );
  buttonElement.forEach((btn) => {
    btn.disabled = !isFormValid;
  });

  if (!isFormValid) {
    buttonElement.forEach((btn) => {
      btn.classList.add("modal__input_submit_btn_disabled");
    });
  }
  if (isFormValid) {
    buttonElement.forEach((btn) => {
      btn.classList.remove("modal__input_submit_btn_disabled");
    });
  }
};

const resetValidation = (formElement) => {
  const inputList = Array.from(
    formElement.querySelectorAll(settings.inputSelector)
  );
  const buttonElement = Array.from(
    formElement.querySelectorAll(settings.submitButtonSelector)
  );
  inputList.forEach((inputElement) => {
    hideInputError(formElement, inputElement);
  });
  toggleButtonState(inputList, buttonElement, settings);
};

const setEventListeners = (formElement, config) => {
  const inputList = Array.from(
    formElement.querySelectorAll(config.inputSelector)
  );
  const buttonElement = Array.from(
    formElement.querySelectorAll(config.submitButtonSelector)
  );

  // Set initial button state
  toggleButtonState(inputList, buttonElement, config);

  inputList.forEach((inputElement) => {
    inputElement.addEventListener("input", function () {
      checkInputValidity(formElement, inputElement);
      toggleButtonState(inputList, buttonElement, config);
    });
  });
};

const enableValidation = (config) => {
  const formList = document.querySelectorAll(config.formSelector);
  formList.forEach((formElement) => {
    setEventListeners(formElement, config);
  });
};
enableValidation(settings);
