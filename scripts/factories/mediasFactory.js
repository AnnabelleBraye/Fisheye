function mediaTemplate(media, photographer, mediasList) {
  // Index of selected Image
  let currentIndex = -1;
  // lightbox is opened or not
  let isLightboxOpened = false;
  let focusableLightboxElts = null;

  let mediaSrc = getMediaSrc(media, photographer);
  // Set here to add and remove event easily
  const likeCount = document.createElement("p");
  const icon = document.createElement("span");

  const lightboxModal = document.getElementById("lightbox_modal");
  // const lightbox = document.querySelector('.lightbox');
  /**
   * Create the media and title/likes container
   * @returns div
   */
  function mediaDOM() {
    const mediaContainer = document.createElement("article");

    const mediaElt = media.image ? createImage() : createVideo();
    mediaElt.classList.add("media");
    mediaElt.tabIndex = 0;
    mediaElt.addEventListener("keydown", openOnEnter);
    mediaElt.addEventListener("click", openLightbox);

    const mediaTitleAndLikeContainer = createMediaTitleAndLikeContainer();

    mediaContainer.appendChild(mediaElt);
    mediaContainer.appendChild(mediaTitleAndLikeContainer);

    return mediaContainer;
  }

  function openOnEnter(e) {
    if (e.key === "Enter") {
      openLightbox(media);
    }
  }

  function createImage() {
    const img = document.createElement("img");
    img.src = mediaSrc;
    img.alt = media.title;

    return img;
  }

  function createVideo(withControls = false) {
    const video = document.createElement("video");
    video.src = mediaSrc;
    video.ariaLabel = media.title;
    video.controls = withControls;

    if (withControls) {
      video.tabIndex = 3;
    }

    return video;
  }

  /**
   * Create the lightbox content with an image or a video
   * @param {*} media image or video
   */
  function showMedia(media) {
    // Set currentIndex with the selected media index
    currentIndex = mediasList.findIndex((med) => med.id === media.id);
    mediaSrc = getMediaSrc(media, photographer);

    const lightbox = document.querySelector(".lightbox");
    lightbox.innerHTML = "";

    // Create previous button
    const previousBtnContainer = createPreviousBtn();
    lightbox.appendChild(previousBtnContainer);

    // Create img or video
    const mediaElt = media.image ? createImage() : createVideo(true);
    lightbox.appendChild(mediaElt);

    // Create close and next button
    const nextAndCloseBtnContainer = createCloseAndNextBtn();
    lightbox.appendChild(nextAndCloseBtnContainer);

    // Media title
    const titleElt = document.createElement("h3");
    titleElt.textContent = media.title;
    lightbox.appendChild(titleElt);

    // const lightbox = document.querySelector('.lightbox');
    // lightbox.innerHTML = `
    //   <div class="previous_btn_container">
    //     <button id="previous" class="btn">
    //       <span class="fa-solid fa-chevron-left fa-2xl"></span>
    //     </button>
    //   </div>
    //   `

    //   const mediaElt = media.image ? createImage() : createVideo(true);
    //   lightbox.appendChild(mediaElt);

    //   lightbox.innerHTML += `
    //   <div class="close_and_btn_container">
    //     <div class="close_icon_container">
    //       <span class="fa-solid fa-xmark fa-2xl"></span>
    //     </div>
    //     <button id="next" class="btn">
    //       <span class="fa-solid fa-chevron-right fa-2xl"></span>
    //       <p class='sr-only'>Next</p>
    //     </button>
    //     <div class="empty"></div>
    //   </div>
    //   <h3>${media.title}</h3>
    // `

    const previousBtnElt = document.querySelector("#previous");
    previousBtnElt.addEventListener("click", showPreviousMedia);

    const closeBtn = document.querySelector(".close_icon_container");
    closeBtn.addEventListener("click", closeLightbox);

    const nextBtnElt = document.querySelector("#next");
    nextBtnElt.addEventListener("click", showNextMedia);
  }

  /**
   * Get previous media index to find the media to show, then call showMedia function
   */
  function showPreviousMedia() {
    const previousIndex =
      currentIndex === 0 ? mediasList.length - 1 : currentIndex - 1;
    const previousMedia = mediasList[previousIndex];

    showMedia(previousMedia);

    const previousButton = document.getElementById("previous");
    previousButton.focus();
  }

  /**
   * Get next media index to find the media to show, then call showMedia function
   */
  function showNextMedia() {
    const nextIndex =
      currentIndex === mediasList.length - 1 ? 0 : currentIndex + 1;
    const nextMedia = mediasList[nextIndex];

    showMedia(nextMedia);

    const nextButton = document.getElementById("next");
    nextButton.focus();
  }

  /**
   * Function which increment the likes number of a media,
   * and increment the total of photographer's likes
   * Remove event after click to avoid multiple click
   */
  function incrementLikesEvent() {
    likeCount.textContent = parseInt(likeCount.textContent) + 1;
    const totalLikesElt = document.querySelector(".likes_container p");
    totalLikesElt.textContent = parseInt(totalLikesElt.textContent) + 1;
    icon.removeEventListener("click", incrementLikesEvent);
  }

  /**
   * Create the container of media title and likes count
   * @returns div
   */
  function createMediaTitleAndLikeContainer() {
    const div = document.createElement("div");
    div.classList.add("media_title_and_like_container");
    const h3 = document.createElement("h3");
    h3.textContent = media.title;

    const likeCountContainer = document.createElement("div");
    likeCountContainer.classList.add("like_count_container");
    likeCount.textContent = media.likes;
    icon.className += "fa-solid fa-heart";
    icon.tabIndex = 0;
    icon.addEventListener("click", incrementLikesEvent);
    icon.addEventListener("keyup", handleKeyUp);

    likeCountContainer.appendChild(likeCount);
    likeCountContainer.appendChild(icon);

    div.appendChild(h3);
    div.appendChild(likeCountContainer);

    return div;
  }

  function handleKeyUp(e) {
    const keyCode = e.key;

    if (keyCode === "Enter") {
      incrementLikesEvent();
    }
  }

  /**
   * Create the div containing lightbox previous button
   * @returns div
   */
  function createPreviousBtn() {
    const previousBtnContainer = document.createElement("div");
    previousBtnContainer.classList.add("previous_btn_container");
    const previousBtn = document.createElement("button");
    previousBtn.id = "previous";
    previousBtn.classList.add("btn");
    previousBtn.tabIndex = 2;
    const btnIcon = document.createElement("span");
    btnIcon.className = "fa-solid fa-chevron-left fa-2xl";
    btnIcon.ariaHidden = true;
    const hiddenText = document.createElement("p");
    hiddenText.textContent = "Média précédent";
    hiddenText.classList.add("sr-only");
    previousBtn.appendChild(btnIcon);
    previousBtn.appendChild(hiddenText);
    previousBtnContainer.appendChild(previousBtn);

    return previousBtnContainer;
  }

  /**
   * Create the div containing lightbox close and next buttons
   * @returns div
   */
  function createCloseAndNextBtn() {
    const closeAndBtnContainer = document.createElement("div");
    closeAndBtnContainer.classList.add("close_and_btn_container");
    const closeIconContainer = document.createElement("div");
    closeIconContainer.classList.add("close_icon_container");
    closeIconContainer.id = "close-icon-container";
    closeIconContainer.tabIndex = 1;
    closeIconContainer.role = "button";
    closeIconContainer.ariaLabel = "Fermer le carrousel";
    const closeIcon = document.createElement("span");
    closeIcon.className = "fa-solid fa-xmark fa-2xl";
    closeIcon.ariaHidden = true;

    closeIconContainer.appendChild(closeIcon);

    const nextBtn = document.createElement("button");
    nextBtn.id = "next";
    nextBtn.classList.add("btn");
    nextBtn.tabIndex = 4;
    const btnIcon = document.createElement("span");
    btnIcon.className = "fa-solid fa-chevron-right fa-2xl";
    btnIcon.ariaHidden = true;
    const hiddenText = document.createElement("p");
    hiddenText.textContent = "Média suivant";
    hiddenText.classList.add("sr-only");

    nextBtn.appendChild(btnIcon);
    nextBtn.appendChild(hiddenText);

    const emptyDiv = document.createElement("div");
    emptyDiv.classList.add("empty");

    closeAndBtnContainer.appendChild(closeIconContainer);
    closeAndBtnContainer.appendChild(nextBtn);
    closeAndBtnContainer.appendChild(emptyDiv);

    return closeAndBtnContainer;
  }

  /**
   * Handle aria-hidden on lightbox and her back element
   */
  function handleLightboxAriaHidden() {
    lightboxModal.setAttribute(
      "aria-hidden",
      lightboxModal.getAttribute("aria-hidden") === "true" ? "false" : "true"
    );
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

  /**
   * Action on open lightbox
   */
  function openLightbox() {
    isLightboxOpened = true;
    lightboxModal.classList.remove("hidden");
    handleLightboxAriaHidden();

    const selectedMedia =
      document.querySelector(`img[src='${mediaSrc}'`) ??
      document.querySelector(`video[src='${mediaSrc}']`);
    selectedMedia.removeEventListener("keydown", openOnEnter);
    focusableLightboxElts = document.getElementById("close-icon-container");
    focusableLightboxElts = focusableLightboxElts.concat(
      document.querySelectorAll("#previous, #next")
    );
    trapFocusInLightbox();
    showMedia(media);
    const closeIcon = document.getElementById("close-icon-container");
    closeIcon.focus();
  }

  /**
   * Action on close lightbox
   */
  function closeLightbox() {
    isLightboxOpened = false;
    lightboxModal.classList.add("hidden");
    handleLightboxAriaHidden();

    lightboxModal.removeEventListener("keydown", handleKeydown);

    // On close, on redonne le focus à l'image liée au currentIndex
    const selectedMedia = document.querySelector(`img[src='${mediaSrc}'`);
    selectedMedia.addEventListener("keydown", openOnEnter);
    selectedMedia.focus();
  }

  function trapFocusInLightbox() {
    lightboxModal.addEventListener("keydown", handleKeydown);
  }

  /**
   * Handle keydown
   */
  function handleKeydown(e) {
    const keyCode = e.key;
    const firstFocusableElt = focusableLightboxElts[0];
    const lastFocusableElt = focusableLightboxElts[2];

    if (
      keyCode === "Escape" ||
      (document.activeElement.id === "close-icon-container" &&
        keyCode === "Enter")
    ) {
      closeLightbox();
      e.preventDefault();
    } else if (keyCode === "ArrowLeft") {
      showPreviousMedia();
      e.preventDefault();
    } else if (keyCode === "ArrowRight") {
      showNextMedia();
      e.preventDefault();
    } else if (keyCode === "Tab") {
      if (e.shiftKey) {
        if (document.activeElement.id === "close-icon-container") {
          lastFocusableElt.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement.id === "next") {
          firstFocusableElt.focus();
          e.preventDefault();
        }
      }
    }
  }

  return { mediaDOM };
}

/**
 * Get photographer firstname to create the source media
 * @param {*} media
 * @param {*} photographer
 * @returns string
 */
function getMediaSrc(media, photographer) {
  const photographerFirstname = photographer.name.split(" ")[0];
  return `assets/images/${photographerFirstname}/${
    media.image ? media.image : media.video
  }`;
}
