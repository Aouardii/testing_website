"use strict";

const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".primary-navigation");
const menuLabel = menuToggle?.querySelector(".sr-only");

function closeMenu() {
  if (!menuToggle || !navigation || !menuLabel) {
    return;
  }

  menuToggle.setAttribute("aria-expanded", "false");
  menuLabel.textContent = "Ouvrir le menu";
  navigation.classList.remove("is-open");
  document.body.style.overflow = "";
}

if (menuToggle && navigation && menuLabel) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuLabel.textContent = isOpen ? "Ouvrir le menu" : "Fermer le menu";
    navigation.classList.toggle("is-open", !isOpen);
    document.body.style.overflow = isOpen ? "" : "hidden";
  });

  navigation.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });
}

const countdownElements = {
  days: document.querySelector("#countdown-days"),
  hours: document.querySelector("#countdown-hours"),
  minutes: document.querySelector("#countdown-minutes"),
  seconds: document.querySelector("#countdown-seconds"),
};
const openingDate = new Date("2027-01-01T00:00:00+01:00");

function updateCountdown() {
  const distance = openingDate.getTime() - Date.now();

  if (distance <= 0) {
    Object.values(countdownElements).forEach((element) => {
      if (element) {
        element.textContent = "00";
      }
    });
    return;
  }

  const values = {
    days: Math.floor(distance / 86_400_000),
    hours: Math.floor((distance % 86_400_000) / 3_600_000),
    minutes: Math.floor((distance % 3_600_000) / 60_000),
    seconds: Math.floor((distance % 60_000) / 1_000),
  };

  Object.entries(values).forEach(([unit, value]) => {
    const element = countdownElements[unit];
    if (element) {
      element.textContent = String(value).padStart(2, "0");
    }
  });
}

updateCountdown();
window.setInterval(updateCountdown, 1_000);

const revealElements = document.querySelectorAll(".reveal");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (prefersReducedMotion || !("IntersectionObserver" in window)) {
  revealElements.forEach((element) => element.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 },
  );

  revealElements.forEach((element) => revealObserver.observe(element));
}

const toast = document.querySelector(".toast");
let toastTimer;

document.querySelectorAll("[data-instagram-placeholder]").forEach((button) => {
  button.addEventListener("click", () => {
    closeMenu();

    if (!toast) {
      return;
    }

    window.clearTimeout(toastTimer);
    toast.classList.add("is-visible");
    toastTimer = window.setTimeout(() => {
      toast.classList.remove("is-visible");
    }, 4_000);
  });
});

const currentYear = document.querySelector("#current-year");
if (currentYear) {
  currentYear.textContent = String(new Date().getFullYear());
}
