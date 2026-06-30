(function () {
  const body = document.body;
  const menuToggle = document.querySelector("[data-menu-toggle]");
  const navLinks = document.querySelector(".nav-links");

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      const isOpen = body.classList.toggle("menu-open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navLinks.addEventListener("click", (event) => {
      if (event.target instanceof HTMLAnchorElement) {
        body.classList.remove("menu-open");
        menuToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14 }
    );

    reveals.forEach((item) => observer.observe(item));
  } else {
    reveals.forEach((item) => item.classList.add("visible"));
  }

  const forms = document.querySelectorAll("[data-waitlist-form]");
  forms.forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = new FormData(form);
      const email = String(data.get("email") || "").trim();
      const postcode = String(data.get("postcode") || "").trim().toUpperCase();
      const role = String(data.get("role") || "").trim();
      const message = form.querySelector(".form-message");

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setMessage(message, "Enter a valid email address.", true);
        return;
      }

      if (!/^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/.test(postcode)) {
        setMessage(message, "Enter a valid UK postcode.", true);
        return;
      }

      if (!role) {
        setMessage(message, "Choose homeowner or trade partner.", true);
        return;
      }

      const submissions = JSON.parse(localStorage.getItem("homepassport_waitlist") || "[]");
      submissions.push({
        role,
        email,
        postcode,
        source: form.getAttribute("data-source") || document.title,
        createdAt: new Date().toISOString()
      });
      localStorage.setItem("homepassport_waitlist", JSON.stringify(submissions));
      form.reset();
      setMessage(message, "You're on the early access list. We'll be in touch.");
    });
  });

  const contactForm = document.querySelector("[data-contact-form]");
  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const message = contactForm.querySelector(".form-message");
      contactForm.reset();
      setMessage(message, "Thanks. Your message has been saved for follow-up.");
    });
  }

  function setMessage(element, text, isError) {
    if (!element) return;
    element.textContent = text;
    element.style.color = isError ? "var(--danger)" : "var(--green-700)";
  }
})();
