// CONTACT FORM FEEDBACK
// Submits form data asynchronously to Formspree endpoint and provides inline feedback.
const setupContactForm = () => {
  const form = document.querySelector("[data-contact-form]");
  const status = document.querySelector("[data-contact-form-status]");
  const submitButton = form?.querySelector(".contact-submit");
  if (!form || !status) return;

  let statusTimeout = null;

  const clearStatus = () => {
    if (statusTimeout) {
      clearTimeout(statusTimeout);
      statusTimeout = null;
    }
    if (status.textContent) {
      status.textContent = "";
      status.classList.remove("is-success", "is-error");
    }
  };

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const endpoint = form.getAttribute("action");
    if (!endpoint || endpoint.includes("YOUR_FORMSPREE_ID")) {
      clearStatus();
      status.textContent = "Aseta Formspree-tunnus lomakkeeseen.";
      status.classList.add("is-error");
      return;
    }

    clearStatus();
    if (submitButton) submitButton.disabled = true;
    status.textContent = "Lähetetään viestiä...";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: new FormData(form),
        headers: {
          Accept: "application/json",
        },
      });

      if (response.ok) {
        form.reset();
        status.textContent = "✓ Viesti lähetetty. Kiitos viestistä!";
        status.classList.add("is-success");

        statusTimeout = setTimeout(() => {
          clearStatus();
        }, 3000);
      } else {
        const data = await response.json().catch(() => null);
        if (data && data.errors) {
          status.textContent = data.errors.map((err) => err.message).join(", ");
        } else {
          status.textContent = "Viestin lähetys epäonnistui. Yritä uudelleen myöhemmin.";
        }
        status.classList.add("is-error");
      }
    } catch (error) {
      status.textContent = "Verkkovirhe. Tarkista yhteys ja yritä uudelleen.";
      status.classList.add("is-error");
    } finally {
      if (submitButton) submitButton.disabled = false;
    }
  });

  // Clear stale confirmation as soon as the visitor starts a new message.
  form.addEventListener("input", () => {
    clearStatus();
  });
};


// Public module initializer called by main.js.
export const initContact = setupContactForm;
