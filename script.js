document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".nav-buttons button");
  const memes = document.querySelectorAll(".meme-placeholder");

  let visibleImageElements = [];

  // Zbiera tylko widoczne (przefiltrowane) obrazki
  function updateVisibleImages() {
    visibleImageElements = Array.from(document.querySelectorAll(".meme-placeholder:not(.hidden) img"));
  }

  // Filtrowanie memów
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.dataset.filter;

      memes.forEach((meme) => {
        const shouldShow = filter === "wszystkie" || meme.classList.contains(filter);
        meme.classList.toggle("hidden", !shouldShow);
      });

      updateVisibleImages(); // aktualizacja widocznych obrazków
    });
  });

  // Modal
  const modal = document.getElementById("image-modal");
  const modalImage = document.getElementById("modal-image");
  const closeButton = document.querySelector(".close-button");
  const leftArrow = document.querySelector(".modal-arrow.arrow-left");
  const rightArrow = document.querySelector(".modal-arrow.arrow-right");

  if (!modal || !modalImage || !closeButton || !leftArrow || !rightArrow) {
    console.warn("Brak elementów modala w DOM. Skrypt przerwany.");
    return;
  }

  let currentIndex = 0;

  function openModal(index) {
    updateVisibleImages(); // zaktualizuj listę widocznych memów
    currentIndex = index;
    updateModalImage();
    modal.classList.remove("hidden");
    document.body.style.overflow = "hidden";  // blokuj scrollowanie strony
  }

  function closeModal() {
    modal.classList.add("hidden");
    modalImage.src = "";
    document.body.style.overflow = "";  // przywróć scrollowanie
  }

  function updateModalImage() {
    if (!visibleImageElements[currentIndex]) return;
    modalImage.src = visibleImageElements[currentIndex].src;

    leftArrow.classList.toggle("hidden", currentIndex === 0);
    rightArrow.classList.toggle("hidden", currentIndex === visibleImageElements.length - 1);
  }

  function showNext(offset) {
    const newIndex = currentIndex + offset;
    if (newIndex >= 0 && newIndex < visibleImageElements.length) {
      currentIndex = newIndex;
      updateModalImage();
    }
  }

  // Kliknięcie w obrazek otwiera modal z odpowiednim indeksem
  memes.forEach((meme) => {
    const img = meme.querySelector("img");
    if (img) {
      img.addEventListener("click", () => {
        updateVisibleImages(); // aktualizuj aktualnie widoczne memy
        const index = visibleImageElements.indexOf(img);
        if (index !== -1) {
          openModal(index);
        }
      });
    }
  });

  // Zamknięcie modala
  closeButton.addEventListener("click", closeModal);

  // Klik poza obrazkiem zamyka modal
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  // Strzałki
  leftArrow.addEventListener("click", () => showNext(-1));
  rightArrow.addEventListener("click", () => showNext(1));

  // Klawiatura
  document.addEventListener("keydown", (e) => {
    if (modal.classList.contains("hidden")) return;

    if (e.key === "Escape") closeModal();
    else if (e.key === "ArrowLeft") showNext(-1);
    else if (e.key === "ArrowRight") showNext(1);
  });

  // Domyślnie na starcie: wszystkie memy są widoczne
  updateVisibleImages();
});
