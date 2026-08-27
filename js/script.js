// Make mobile navigation work
document.body.classList.add("js-enabled");

const btnNavEl = document.querySelector(".mobile-nav");
const headerEl = btnNavEl
  ? btnNavEl.closest("header")
  : document.querySelector(".header, .resume-header");

if (btnNavEl && headerEl) {
  btnNavEl.addEventListener("click", function () {
    headerEl.classList.toggle("nav-open");
  });
}

// Switch the mobile menu icon once it scrolls past dark hero sections.
const navColorHeroEl = document.querySelector(
  ".section-hero, .about-page-hero",
);

function toggleMobileNavColor() {
  if (!btnNavEl || !navColorHeroEl) return;

  const heroPosition = navColorHeroEl.getBoundingClientRect();
  const navPosition = btnNavEl.getBoundingClientRect();
  const navCenterY = navPosition.top + navPosition.height / 2;

  document.body.classList.toggle(
    "mobile-nav-past-hero",
    heroPosition.bottom <= navCenterY,
  );
}

window.addEventListener("scroll", toggleMobileNavColor);
window.addEventListener("resize", toggleMobileNavColor);
window.addEventListener("load", toggleMobileNavColor);
toggleMobileNavColor();

// Scroll to top button

const scrollTopBtn = document.createElement("button");
scrollTopBtn.className = "scroll-top";
scrollTopBtn.type = "button";
scrollTopBtn.setAttribute("aria-label", "Scroll to top");
scrollTopBtn.innerHTML =
  '<i class="fa-solid fa-arrow-up" aria-hidden="true"></i>';
document.body.appendChild(scrollTopBtn);

function toggleScrollTopButton() {
  scrollTopBtn.classList.toggle("scroll-top--visible", window.scrollY > 400);
}

window.addEventListener("scroll", toggleScrollTopButton);
toggleScrollTopButton();

scrollTopBtn.addEventListener("click", function () {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

// Animate section headers when they enter the viewport
const animatedHeaderEls = document.querySelectorAll(
  ".project-preview__header, .projects-page__header, .about-preview__header, .skills-preview__header, .contact-preview-cta__header",
);

function revealHashTargetHeader() {
  if (!window.location.hash || window.location.hash === "#") return;

  const targetSection = document.getElementById(
    decodeURIComponent(window.location.hash.slice(1)),
  );
  if (!targetSection) return;

  const targetHeader = targetSection.querySelector(
    ".project-preview__header, .projects-page__header, .about-preview__header",
  );

  if (targetHeader) {
    targetHeader.classList.add("is-visible");
  }
}

function revealAnimatedHeaders() {
  animatedHeaderEls.forEach(function (headerEl) {
    const headerPosition = headerEl.getBoundingClientRect();
    const revealPoint = window.innerHeight * 0.7;

    if (headerPosition.top <= revealPoint && headerPosition.bottom >= 0) {
      headerEl.classList.add("is-visible");
    } else {
      headerEl.classList.remove("is-visible");
    }
  });
}

function queueRevealHashTargetHeader() {
  window.requestAnimationFrame(function () {
    revealAnimatedHeaders();
    revealHashTargetHeader();
  });

  window.setTimeout(function () {
    revealAnimatedHeaders();
    revealHashTargetHeader();
  }, 150);
}

window.addEventListener("scroll", revealAnimatedHeaders);
window.addEventListener("resize", revealAnimatedHeaders);
window.addEventListener("load", queueRevealHashTargetHeader);
window.addEventListener("hashchange", queueRevealHashTargetHeader);
document.querySelectorAll('a[href^="#"]').forEach(function (anchorEl) {
  anchorEl.addEventListener("click", function () {
    window.setTimeout(queueRevealHashTargetHeader, 150);
  });
});
queueRevealHashTargetHeader();

/////////////////////////
// Image Preview

const imageButtons = document.querySelectorAll(
  ".design-system-preview-button, .granite-peak-outfitters-preview-button",
);
const imagePreview = document.querySelector(".image-preview");
const imagePreviewImage = document.querySelector(".image-preview__image");
const imagePreviewClose = document.querySelector(".image-preview__close");
const imagePreviewPrevious = document.querySelector(
  ".image-preview__arrow--previous",
);
const imagePreviewNext = document.querySelector(".image-preview__arrow--next");
let previewTrigger = null;
let previewIndex = 0;
let activeImageButtons = Array.from(imageButtons);

function showPreviewImage(index) {
  const button = activeImageButtons[index];
  const image = button?.querySelector(
    ".design-system-preview-image, .granite-peak-outfitters-preview-image",
  );
  if (!imagePreviewImage || !image) return;

  previewIndex = index;
  previewTrigger = button;
  imagePreviewImage.src = image.src;
  imagePreviewImage.alt = image.alt;
}

function changePreviewImage(direction) {
  if (!activeImageButtons.length) return;

  const nextIndex =
    (previewIndex + direction + activeImageButtons.length) %
    activeImageButtons.length;
  showPreviewImage(nextIndex);
}

imageButtons.forEach((button, index) => {
  button.addEventListener("click", () => {
    if (!imagePreview || !imagePreviewImage || !imagePreviewClose) {
      return;
    }

    const wireframeGallery = button.closest(
      ".granite-peak-outfitters-lofi-desktop__frames, .granite-peak-outfitters-lofi-mobile__frames",
    );

    activeImageButtons = wireframeGallery
      ? Array.from(
          wireframeGallery.querySelectorAll(
            ".granite-peak-outfitters-preview-button",
          ),
        )
      : Array.from(imageButtons);

    showPreviewImage(activeImageButtons.indexOf(button));
    imagePreview.hidden = false;
    document.body.style.overflow = "hidden";
    imagePreviewClose.focus();
  });
});

function closeImagePreview() {
  if (!imagePreview || imagePreview.hidden) return;

  imagePreview.hidden = true;
  document.body.style.overflow = "";

  if (previewTrigger) {
    previewTrigger.focus();
  }
}

if (imagePreview && imagePreviewClose) {
  imagePreviewClose.addEventListener("click", closeImagePreview);
  imagePreviewPrevious?.addEventListener("click", function () {
    changePreviewImage(-1);
  });
  imagePreviewNext?.addEventListener("click", function () {
    changePreviewImage(1);
  });

  imagePreview.addEventListener("click", (event) => {
    if (event.target === imagePreview) {
      closeImagePreview();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeImagePreview();
    }

    if (!imagePreview.hidden && event.key === "ArrowLeft") {
      changePreviewImage(-1);
    }

    if (!imagePreview.hidden && event.key === "ArrowRight") {
      changePreviewImage(1);
    }
  });
}

/////////////////////////
// Case Study Swipe Indicators

const caseStudySwipeRows = document.querySelectorAll(
  ".granite-peak-outfitters-design-process__steps, .granite-peak-outfitters-user-flow__steps, .granite-peak-outfitters-lofi-desktop__frames, .granite-peak-outfitters-lofi-mobile__frames",
);

caseStudySwipeRows.forEach((row) => {
  const indicator = document.createElement("div");
  indicator.className = "granite-peak-outfitters-scroll-indicator";
  indicator.setAttribute("aria-hidden", "true");

  const thumb = document.createElement("span");
  indicator.appendChild(thumb);
  row.insertAdjacentElement("afterend", indicator);

  function updateIndicator() {
    const maxScroll = row.scrollWidth - row.clientWidth;
    indicator.hidden = maxScroll <= 1;

    if (indicator.hidden) return;

    const trackWidth = indicator.clientWidth;
    const thumbWidth = Math.max(24, trackWidth * 0.3);
    const progress = row.scrollLeft / maxScroll;
    const thumbOffset = progress * (trackWidth - thumbWidth);

    thumb.style.width = `${thumbWidth}px`;
    thumb.style.transform = `translateX(${thumbOffset}px)`;
  }

  row.addEventListener("scroll", updateIndicator, { passive: true });
  window.addEventListener("resize", updateIndicator);
  window.addEventListener("load", updateIndicator);
  updateIndicator();
});

/////////////////////////
// Contact Form

const contactForm = document.querySelector("#contact-form");

if (contactForm) {
  const submitButton = contactForm.querySelector('button[type="submit"]');

  contactForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const originalText = submitButton.textContent;
    submitButton.textContent = "Sending...";
    submitButton.disabled = true;

    try {
      const response = await fetch(contactForm.action, {
        method: "POST",
        body: new FormData(contactForm),
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message);
      }

      alert("Success! Your message has been sent.");
      contactForm.reset();
    } catch (error) {
      alert("Something went wrong. Please try again.");
    } finally {
      submitButton.textContent = originalText;
      submitButton.disabled = false;
    }
  });
}
