document.documentElement.classList.add("js-enabled");

const menuToggle = document.getElementById("menuToggle");
const siteNav = document.getElementById("siteNav");
const contactForm = document.getElementById("contactForm");
const contactFormStatus = document.getElementById("contactFormStatus");

const setMenuOpen = (isOpen) => {
  if (!menuToggle || !siteNav) {
    return;
  }

  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
  siteNav.classList.toggle("is-open", isOpen);
};

if (menuToggle && siteNav) {
  menuToggle.addEventListener("click", () => {
    setMenuOpen(menuToggle.getAttribute("aria-expanded") !== "true");
  });

  siteNav.addEventListener("click", (event) => {
    if (event.target instanceof Element && event.target.closest("a")) {
      setMenuOpen(false);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
      setMenuOpen(false);
      menuToggle.focus();
    }
  });

  document.addEventListener("click", (event) => {
    if (
      menuToggle.getAttribute("aria-expanded") === "true" &&
      event.target instanceof Node &&
      !menuToggle.contains(event.target) &&
      !siteNav.contains(event.target)
    ) {
      setMenuOpen(false);
    }
  });

  window.matchMedia("(min-width: 1121px)").addEventListener("change", () => {
    setMenuOpen(false);
  });
}

if (contactForm instanceof HTMLFormElement && contactFormStatus) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const recipient = contactForm.dataset.recipient;
    if (!recipient) {
      contactFormStatus.textContent = "Email is not configured. Please use the email link above.";
      return;
    }

    const formData = new FormData(contactForm);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const message = String(formData.get("message") || "").trim();
    const subject = encodeURIComponent(`Portfolio message from ${name}`);
    const body = encodeURIComponent(`${message}\n\nFrom: ${name}\nEmail: ${email}`);

    contactFormStatus.textContent = "Opening your default email app...";
    window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
  });
}

const revealItems = document.querySelectorAll(".reveal");
const navigationLinks = document.querySelectorAll(".site-nav a");
const sections = document.querySelectorAll("main section[id]");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealItems.forEach((item) => revealObserver.observe(item));

  const navigationObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navigationLinks.forEach((link) => {
            const isCurrent = link.getAttribute("href") === `#${entry.target.id}`;
            link.classList.toggle("active", isCurrent);
            if (isCurrent) {
              link.setAttribute("aria-current", "location");
            } else {
              link.removeAttribute("aria-current");
            }
          });
        }
      });
    },
    { rootMargin: "-25% 0px -65% 0px" }
  );

  sections.forEach((section) => navigationObserver.observe(section));
} else {
  revealItems.forEach((item) => item.classList.add("visible"));
}
