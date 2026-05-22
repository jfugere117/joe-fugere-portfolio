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
  ".case-preview__header, .case-page__header, .about-preview__header, .skills-preview__header, .contact-preview-cta__header",
);

function revealHashTargetHeader() {
  if (!window.location.hash || window.location.hash === "#") return;

  const targetSection = document.getElementById(
    decodeURIComponent(window.location.hash.slice(1)),
  );
  if (!targetSection) return;

  const targetHeader = targetSection.querySelector(
    ".case-preview__header, .case-page__header, .about-preview__header",
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
