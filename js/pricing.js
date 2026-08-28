export function initPricing() {
  const root = document.getElementById("pricing-toggle");
  if (!root) return;

  const switchBtn = root.querySelector('[role="switch"]');
  const prices = document.querySelectorAll("[data-price]");
  if (!switchBtn) return;

  const dong = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  });

  function updatePrices(yearly) {
    prices.forEach((el) => {
      const value = yearly ? el.dataset.yearly : el.dataset.monthly;
      el.textContent = dong.format(Number(value));
    });
  }

  switchBtn.addEventListener("click", () => {
    const yearly = switchBtn.getAttribute("aria-checked") !== "true";
    switchBtn.setAttribute("aria-checked", String(yearly));
    updatePrices(yearly);
  });
}