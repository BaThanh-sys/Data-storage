export function initFaq() {
  const root = document.getElementById("faq");
  if (!root) return;

  const triggers = root.querySelectorAll("[data-faq-trigger]");

  function setOpen(trigger, open) {
    trigger.setAttribute("aria-expanded", String(open));
    const panel = document.getElementById(trigger.getAttribute("aria-controls"));
    if (panel) {
      panel.hidden = !open;
    }
  }

  root.addEventListener("click", (e) => {
    const trigger = e.target.closest("[data-faq-trigger]");
    if (!trigger) return;

    const willOpen = trigger.getAttribute("aria-expanded") !== "true";
    triggers.forEach((t) => setOpen(t, false));
    if (willOpen) setOpen(trigger, true);
  });
}