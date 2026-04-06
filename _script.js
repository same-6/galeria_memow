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

      updateFilteredImages(); // zaktualizuj listę widocznych memów
    });
  });

function policzElementy() {
  const wszystkie = document.getElementsByClassName("meme-placeholder");
  const wszystkie_ile = wszystkie.length;
  document.getElementById("wszystkie_button").textContent = "Wszystkie (" + wszystkie_ile + ")";
  const religijne = document.getElementsByClassName("religijne");
  const religijne_ile = religijne.length;
  document.getElementById("religijne_button").textContent = "Religijne (" + religijne_ile + ")";
  const szachowe = document.getElementsByClassName("szachowe");
  const szachowe_ile = szachowe.length;
  document.getElementById("szachowe_button").textContent = "Szachowe (" + szachowe_ile + ")";
  const polityczne = document.getElementsByClassName("polityczne");
  const polityczne_ile = polityczne.length;
  document.getElementById("polityczne_button").textContent = "Polityczne (" + polityczne_ile + ")";
  const szkolne = document.getElementsByClassName("szkolne");
  const szkolne_ile = szkolne.length;
  document.getElementById("szkolne_button").textContent = "Szkolne (" + szkolne_ile + ")";
  const angielski = document.getElementsByClassName("angielski");
  const angielski_ile = angielski.length;
  document.getElementById("angielski_button").textContent = "Po angielsku (" + angielski_ile + ")";
}

policzElementy();

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

  //Rozszerzone obszary kliknięcia dla strzałek
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