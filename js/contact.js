// CONTACT FORM FEEDBACK
// Provides local validation and inline success feedback; submission is not sent to a server.
const setupContactForm = () => {
  const form = document.querySelector("[data-contact-form]");
  const status = document.querySelector("[data-contact-form-status]");
  if (!form || !status) return;

  // Keep native validation UI while preventing a page reload in this static portfolio.
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    form.reset();
    status.textContent = "✓ Viesti lähetetty. Kiitos viestistä!";
    status.classList.add("is-success");
  });

  // Clear stale confirmation as soon as the visitor starts a new message.
  form.addEventListener("input", () => {
    if (!status.textContent) return;
    status.textContent = "";
    status.classList.remove("is-success");
  });
};


// Public module initializer called by main.js.
export const initContact = setupContactForm;
