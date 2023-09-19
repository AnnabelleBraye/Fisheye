const contactModal = document.getElementById("contact_modal");
const form = document.getElementById("contact_form");
const formDatas = document.querySelectorAll(
  "#contact_form .form-data input, #contact_form .form-data textarea"
);
const closeModalBtn = document.querySelector(".contact_me_container img");
const headerElt = document.querySelector("header[role=banner]");
const bodyElt = document.querySelector("body");
const focusableContactModalElts = Array.from(
  contactModal.querySelectorAll(
    ".contact_me_container img, #contact_form .form_data input, #contact_form .form_data textarea, button"
  )
);
let photographerName = "";

// Call validate function on submit
form.addEventListener("submit", validate);

// Add close function on close modal btn
closeModalBtn.addEventListener("click", (e) => closeContactModal(e));

function validate(event) {
  event.preventDefault();

  try {
    const isValid = checkFieldsValidity();

    if (isValid) {
      formDatas.forEach((elt) => console.log(`${elt.name}: ${elt.value}`));
      closeContactModal(event);
    } else {
      return false;
    }
  } catch (e) {
    console.log(`error`, e);
  }
}

function checkFieldsValidity() {
  let isValid = false;
  const firstnameElt = form.firstname;
  const firstnameValue = firstnameElt.value.trim();
  let isFirstnameValid =
    /^[a-zA-Z]+[ \-']?[a-zA-Z]+$/.test(firstnameValue) &&
    firstnameValue.length >= 2;

  const lastnameElt = form.lastname;
  const lastnameValue = lastnameElt.value.trim();
  let isLastnameValid =
    /^[a-zA-Z]+[ \-']?[a-zA-Z]+$/.test(lastnameValue) &&
    lastnameValue.length >= 2;

  const mailElt = form.mail;
  const mailValue = mailElt.value.trim();
  let isMailValid = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(mailValue);

  const messageElt = form.message;
  let isMessageValid =
    form.message.value.trim() !== "" && messageElt.value.length >= 2;

  if (!isFirstnameValid) {
    handleDataError(
      firstnameElt,
      "Le prénom doit faire au moins 2 caractères, ne contenir que des lettres, avec espaces ou tirets."
    );
  } else {
    removeError(firstnameElt, true);
    if (!isLastnameValid) {
      handleDataError(
        lastnameElt,
        "Le nom doit faire au moins 2 caractères, ne contenir que des lettres, avec espaces ou tirets."
      );
    } else {
      removeError(lastnameElt, true);
      if (!isMailValid) {
        handleDataError(mailElt, "Le mail doit être au format XXX@XXX.XX");
      } else {
        removeError(mailElt, true);
        if (!isMessageValid) {
          handleDataError(
            messageElt,
            "Le message doit faire au moins 2 caractères."
          );
        } else {
          removeError(messageElt, true);
          isValid = true;
        }
      }
    }
  }
  return isValid;
}

/**
 * Handle data-error message and focus
 * @param {*} element form-data element
 * @param {*} errorMsg
 */
function handleDataError(element, errorMsg) {
  removeError(element);
  const spanError = document.createElement("span");
  spanError.id = `error-${element.name}`;
  spanError.classList.add("error-text");
  spanError.textContent = errorMsg;
  element.parentElement.append(spanError);
  element.ariaInvalid = true;
  element.setAttribute("aria-describedBy", spanError.id);

  element.focus();
}

function removeError(element, isFieldValid) {
  const child = element.parentElement.querySelector("span.error-text");
  if (child) {
    element.parentElement.removeChild(child);
  }

  if (isFieldValid) {
    element.ariaInvalid = false;
    element.removeAttribute("aria-describedBy");
  }
}

/**
 * Show form modal, set photographer name on open and reset data
 */
function openContactModal(photographerData) {
  trapFocusInContactModal();
  contactModal.classList.remove("hidden");
  handleAria();
  closeModalBtn.focus();
  const photographerNameElt = document.querySelector(".modal header > h2");
  photographerNameElt.textContent = photographerData.name;
  formDatas.forEach((field) => (field.value = ""));

  form.querySelectorAll(".form-data").forEach((elt) => {
    delete elt.dataset.error;
    delete elt.dataset.errorVisible;
  });
}

/**
 * Hide form modal
 */
function closeContactModal(e) {
  e.preventDefault();
  contactModal.removeEventListener("keydown", handleKeydown);
  contactModal.classList.toggle("hidden");
  handleAria();
  const contactMeButton = document.querySelector(".contact_button");
  contactMeButton.focus();
}

function handleAria() {
  contactModal.setAttribute(
    "aria-hidden",
    contactModal.getAttribute("aria-hidden") === "true" ? "false" : "true"
  );
  bodyElt.querySelectorAll("not[contact_modal]");
  mainElt.setAttribute(
    "aria-hidden",
    mainElt.getAttribute("aria-hidden") === "true" ? "false" : "true"
  );
  headerElt.setAttribute(
    "aria-hidden",
    headerElt.getAttribute("aria-hidden") === "true" ? "false" : "true"
  );
  bodyElt.classList.toggle("no-scroll");
}

function trapFocusInContactModal() {
  contactModal.addEventListener("keydown", handleKeydown);
}

function handleKeydown(e) {
  const keyCode = e.key;
  const firstFocusableElt = focusableContactModalElts[0];
  const lastFocusableElt =
    focusableContactModalElts[focusableContactModalElts.length - 1];

  if (
    keyCode === "Escape" ||
    (document.activeElement === closeModalBtn && keyCode === "Enter")
  ) {
    closeContactModal(e);
  } else if (keyCode === "Enter") {
    validate(e);
  } else if (keyCode === "Tab") {
    if (e.shiftKey) {
      if (document.activeElement === firstFocusableElt) {
        lastFocusableElt.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastFocusableElt) {
        firstFocusableElt.focus();
        e.preventDefault();
      }
    }
  }
}
