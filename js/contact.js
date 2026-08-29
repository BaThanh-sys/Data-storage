function messageFor(field) {
  const v = field.validity;
  if (v.valueMissing) return "Vui lòng điền mục này.";
  if (v.typeMismatch) {
    if (field.type === "email") return "Email chưa đúng dạng, ví dụ: chuvua@gmail.com";
    return "Định dạng không hợp lệ.";
  }
  if (v.patternMismatch) {
    if (field.name === "phone") return "Nhập 10 chữ số, bắt đầu bằng 0. Ví dụ: 0912345678";
    return "Định dạng không đúng.";
  }
  if (v.tooShort) return `Cần ít nhất ${field.minLength} ký tự.`;
  if (v.tooLong) return `Tối đa ${field.maxLength} ký tự.`;
  return "Dữ liệu không hợp lệ.";
}

function showError(field, message) {
  field.setAttribute("aria-invalid", "true");
  const box = field.parentElement.querySelector("[data-error]");
  if (box) {
    box.textContent = message;
    box.hidden = false;
  }
}

function clearError(field) {
  field.removeAttribute("aria-invalid");
  const box = field.parentElement.querySelector("[data-error]");
  if (box) {
    box.textContent = "";
    box.hidden = true;
  }
}

export function initContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  form.setAttribute("novalidate", "");

  const fields = [...form.querySelectorAll("input, select, textarea")].filter(
    (f) => f.willValidate
  );

  fields.forEach((field) => {
    field.addEventListener("blur", () => {
      if (!field.checkValidity()) showError(field, messageFor(field));
      else clearError(field);
    });
    field.addEventListener("input", () => {
      if (field.getAttribute("aria-invalid") === "true" && field.checkValidity()) {
        clearError(field);
      }
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    let firstInvalid = null;
    fields.forEach((field) => {
      if (!field.checkValidity()) {
        showError(field, messageFor(field));
        if (!firstInvalid) firstInvalid = field;
      } else {
        clearError(field);
      }
    });

    if (firstInvalid) {
      firstInvalid.focus();
      const summary = form.querySelector("[data-form-summary]");
      if (summary) {
        summary.hidden = false;
        summary.textContent = "Vui lòng sửa các mục bị lỗi trước khi gửi.";
      }
      return;
    }

    const summary = form.querySelector("[data-form-summary]");
    if (summary) summary.hidden = true;

    const success = document.getElementById("formSuccess");
    if (success) {
      success.classList.remove("hidden");
      form.reset();
      fields.forEach(clearError);
      setTimeout(() => success.classList.add("hidden"), 5000);
    }
  });
}
