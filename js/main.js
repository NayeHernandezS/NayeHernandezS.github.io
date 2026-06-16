(function () {
  // Obtén tu access_key gratis en https://web3forms.com (usa soporte@fusiondigital.com)
  const FORM_ACCESS_KEY = "70ae931a-9775-4917-8527-145b7de03d9f";

  const nav = document.querySelector(".nav");
  const toggle = document.querySelector(".nav__toggle");
  const links = document.querySelector(".nav__links");
  const form = document.getElementById("contact-form");
  const submitBtn = form?.querySelector('button[type="submit"]');
  const formStatus = document.getElementById("form-status");

  window.addEventListener("scroll", () => {
    nav.classList.toggle("scrolled", window.scrollY > 20);
  });

  toggle.addEventListener("click", () => {
    toggle.classList.toggle("active");
    links.classList.toggle("open");
  });

  links.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      toggle.classList.remove("active");
      links.classList.remove("open");
    });
  });

  const revealEls = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  revealEls.forEach((el) => observer.observe(el));

  function showFormStatus(message, type) {
    if (!formStatus) return;
    formStatus.textContent = message;
    formStatus.className = `form-status form-status--${type}`;
    formStatus.hidden = false;
  }

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      if (FORM_ACCESS_KEY === "REEMPLAZA_CON_TU_ACCESS_KEY") {
        showFormStatus(
          "Falta configurar la clave de envío. Revisa js/main.js (FORM_ACCESS_KEY).",
          "error"
        );
        return;
      }

      const data = new FormData(form);
      const nombre = data.get("nombre");
      const email = data.get("email");
      const servicio = data.get("servicio");
      const mensaje = data.get("mensaje");

      submitBtn.disabled = true;
      submitBtn.textContent = "Enviando...";
      if (formStatus) formStatus.hidden = true;

      try {
        const response = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            access_key: FORM_ACCESS_KEY,
            subject: `Consulta Fusion Digital — ${servicio}`,
            from_name: nombre,
            email,
            servicio,
            message: mensaje,
            replyto: email,
          }),
        });

        const result = await response.json();

        if (result.success) {
          form.reset();
          showFormStatus(
            "¡Consulta enviada! Te responderemos en menos de 24 horas.",
            "success"
          );
        } else {
          showFormStatus(
            result.message || "No se pudo enviar. Intenta de nuevo.",
            "error"
          );
        }
      } catch {
        showFormStatus(
          "Error de conexión. Revisa tu internet e intenta de nuevo.",
          "error"
        );
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = "Enviar consulta";
      }
    });
  }

  const bars = document.querySelectorAll(".hero__bar");
  bars.forEach((bar, i) => {
    const heights = [40, 55, 35, 70, 50, 80, 60, 75, 45, 65];
    bar.style.height = `${heights[i % heights.length]}%`;
  });
})();
