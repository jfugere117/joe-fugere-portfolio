// Make mobile navigation work
const btnNavEl = document.querySelector(".mobile-nav");
const headerEl = document.querySelector(".header");

if (btnNavEl && headerEl) {
  btnNavEl.addEventListener("click", function () {
    headerEl.classList.toggle("nav-open");
  });
}

// Scroll to top button
const scrollTopBtn = document.createElement("button");
scrollTopBtn.className = "scroll-top";
scrollTopBtn.type = "button";
scrollTopBtn.setAttribute("aria-label", "Scroll to top");
scrollTopBtn.innerHTML = '<i class="fa-solid fa-arrow-up" aria-hidden="true"></i>';
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

// Animate case section headers when they enter the viewport
const caseHeaderEls = document.querySelectorAll(
  ".case-preview__header, .case-page__header"
);

const caseHeaderObserver = new IntersectionObserver(
  function (entries, observer) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.25,
  }
);

caseHeaderEls.forEach(function (caseHeaderEl) {
  caseHeaderObserver.observe(caseHeaderEl);
});
