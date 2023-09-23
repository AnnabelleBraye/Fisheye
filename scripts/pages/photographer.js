let mediasSorted = [];
let currentFilter = 'likes';
let currentPhotographer = null;
const mainElt = document.querySelector('main');

function displayData(photographer, medias) {
  mediasSorted = medias;
  currentPhotographer = photographer;

  const photographerDetails = displayPhotographerData();

  const dropdownOptions = [
    {
      value: 'likes',
      text: 'Popularité',
      isSelected: true,
    },
    {
      value: 'title',
      text: 'Titre',
      isSelected: false,
    },
    {
      value: 'date',
      text: 'Date',
      isSelected: false,
    },
  ];
  const sortedByContainer = createDropdown(dropdownOptions);

  const mediasContainer = document.createElement('section');
  mediasContainer.ariaLabel = 'Médias du photographe';
  mediasContainer.classList.add('photograph_medias');

  mediasSorted = sortMedias(currentFilter);

  displayMedias(mediasContainer);

  mainElt.appendChild(photographerDetails);
  mainElt.appendChild(sortedByContainer);
  mainElt.appendChild(mediasContainer);
}

function displayPhotographerData() {
  const photographerModel = photographerTemplate(
    currentPhotographer,
    mediasSorted
  );
  const photographerDetails = photographerModel.getPhotographerDetails();

  return photographerDetails;
}

function displayMedias(mediasContainer) {
  mediasSorted.forEach((media, index, list) => {
    const mediaModel = mediaTemplate(media, currentPhotographer, list);
    const mediaDOM = mediaModel.mediaDOM();
    mediasContainer.appendChild(mediaDOM);
  });
}

async function init() {
  const params = new URL(document.location).searchParams;
  const id = parseInt(params.get('id'));

  try {
    const photographerData = await getPhotographerById(id);
    displayData(photographerData.photographer, photographerData.media);
  } catch (error) {
    console.log(`error`, error);
  }
}

init();
