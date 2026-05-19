const header = document.querySelector("[data-header]");
const filters = [...document.querySelectorAll("[data-filter]")];
const cards = [...document.querySelectorAll("[data-category]")];
const categoryLinks = [...document.querySelectorAll("[data-filter-link]")];
const lightbox = document.querySelector("[data-lightbox]");
const lightboxImage = document.querySelector("[data-lightbox-image]");
const lightboxTitle = document.querySelector("[data-lightbox-title]");
const lightboxMeta = document.querySelector("[data-lightbox-meta]");
const closeButton = document.querySelector("[data-close]");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const canAnimate = !prefersReducedMotion;

if (canAnimate) {
  document.body.classList.add("has-motion");
}

const setHeader = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 24);
};

const setFilter = (category) => {
  filters.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.filter === category);
  });

  cards.forEach((card) => {
    const shouldShow = category === "all" || card.dataset.category === category;
    card.hidden = !shouldShow;

    if (canAnimate && shouldShow) {
      card.classList.remove("is-visible");
      window.setTimeout(() => card.classList.add("is-visible"), 35);
    }
  });
};

const revealItems = [
  ...document.querySelectorAll(".section-heading, .filters, .work-card, .about-text, .contact-content"),
];

if (canAnimate && "IntersectionObserver" in window) {
  revealItems.forEach((item, index) => {
    item.classList.add("reveal");
    item.style.setProperty("--reveal-delay", `${Math.min(index * 45, 260)}ms`);
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.14,
      rootMargin: "0px 0px -8% 0px",
    },
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

window.addEventListener("scroll", setHeader, { passive: true });
setHeader();

filters.forEach((button) => {
  button.addEventListener("click", () => setFilter(button.dataset.filter));
});

categoryLinks.forEach((link) => {
  link.addEventListener("click", () => {
    setFilter(link.dataset.filterLink);
  });
});

cards.forEach((card) => {
  const button = card.querySelector("button");
  button.addEventListener("click", () => {
    lightboxImage.src = button.dataset.full;
    lightboxImage.alt = button.querySelector("img").alt;
    lightboxTitle.textContent = button.dataset.title;
    lightboxMeta.textContent = button.dataset.meta;
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
  });
});

const closeLightbox = () => {
  lightbox.hidden = true;
  lightboxImage.src = "";
  document.body.style.overflow = "";
};

closeButton.addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !lightbox.hidden) closeLightbox();
});
