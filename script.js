document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".nav-buttons button");
  const memes = document.querySelectorAll(".meme-placeholder");
  const descriptionEl = document.getElementById("category-description");

  let currentFilter = "wszystkie"; // domyślna kategoria
  let filteredImages = [];

  function updateFilteredImages() {
    filteredImages = Array.from(document.querySelectorAll(`.meme-placeholder:not(.hidden) img`));
  }

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.dataset.filter;
      currentFilter = filter;

      memes.forEach((meme) => {
        const shouldShow = filter === "wszystkie" || meme.classList.contains(filter);
        meme.classList.toggle("hidden", !shouldShow);
      });

      // Pokaż opis tylko dla "szkolne"
      if (filter === "szkolne") {
        descriptionEl.textContent = "Część z memów poniżej odnosi się do osób i wydarzeń ściśle związanych z VLO w Warszawie. Jeśli ich nie zrozumiesz - nie przejmuj się :)";
        descriptionEl.classList.remove("hidden");
      } else {
        descriptionEl.classList.add("hidden");
        descriptionEl.textContent = "";
      }

      updateFilteredImages(); // zaktualizuj listę widocznych memów
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
    updateFilteredImages(); // upewnij się, że mamy aktualną listę
    currentIndex = index;
    updateModalImage();
    modal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    modal.classList.add("hidden");
    modalImage.src = "";
    document.body.style.overflow = "";
  }

  function updateModalImage() {
    if (filteredImages.length === 0) return;
    modalImage.src = filteredImages[currentIndex].src;
    leftArrow.classList.toggle("hidden", currentIndex === 0);
    rightArrow.classList.toggle("hidden", currentIndex === filteredImages.length - 1);
  }

  function showNext(offset) {
    const newIndex = currentIndex + offset;
    if (newIndex >= 0 && newIndex < filteredImages.length) {
      currentIndex = newIndex;
      updateModalImage();
    }
  }

  // Obsługa kliknięcia w miniatury
  memes.forEach((meme) => {
    const img = meme.querySelector("img");
    if (!img) return;

    img.addEventListener("click", () => {
      updateFilteredImages();
      const index = filteredImages.indexOf(img);
      if (index !== -1) {
        openModal(index);
      }
    });
  });

  closeButton.addEventListener("click", closeModal);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  // Rozszerzone obszary kliknięcia dla strzałek
  function isArrowClick(target, arrowElement) {
    return (
      target === arrowElement ||
      arrowElement.contains(target) ||
      target.closest(".modal-arrow") === arrowElement
    );
  }

  modal.addEventListener("click", (e) => {
    if (isArrowClick(e.target, leftArrow)) {
      showNext(-1);
    } else if (isArrowClick(e.target, rightArrow)) {
      showNext(1);
    } else if (e.target === modal) {
      closeModal();
    }
  });

  leftArrow.addEventListener("click", () => showNext(-1));
  rightArrow.addEventListener("click", () => showNext(1));

  // Klawiatura
  document.addEventListener("keydown", (e) => {
    if (modal.classList.contains("hidden")) return;

    if (e.key === "Escape") closeModal();
    else if (e.key === "ArrowLeft") showNext(-1);
    else if (e.key === "ArrowRight") showNext(1);
  });

  // Inicjalna lista obrazów
  updateFilteredImages();
});
