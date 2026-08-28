export function initNav() {
  const toggle = document.getElementById("menuToggle");
  const menu = document.getElementById("navLinks");
  const header = document.querySelector("header");
  if (!toggle || !menu) return;

  function setOpen(open) {
    menu.classList.toggle("hidden", !open);
    menu.classList.toggle("flex", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Đóng menu" : "Mở menu");
    document.body.classList.toggle("overflow-hidden", open);
  }

  toggle.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    setOpen(!isOpen);
  });

  // ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
      setOpen(false);
      toggle.focus();
    }
  });

  // Click ngoài
  document.addEventListener("click", (e) => {
    if (
      toggle.getAttribute("aria-expanded") === "true" &&
      !header.contains(e.target)
    ) {
      setOpen(false);
    }
  });

  // Resize về desktop
  window.addEventListener("resize", () => {
    if (window.innerWidth >= 768) setOpen(false);
  });
}

export function initHeaderOnScroll() {
  const header = document.querySelector("header");
  const sentinel = document.getElementById("nav-sentinel");
  if (!header || !sentinel) return;

  const observer = new IntersectionObserver(([entry]) => {
    const scrolled = !entry.isIntersecting;
    header.classList.toggle("shadow-lg", scrolled);
    header.classList.toggle("border-b", scrolled);
  });
  observer.observe(sentinel);
}

export function initToTop() {
  const btn = document.getElementById("toTop");
  if (!btn) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 400) {
      btn.classList.remove("opacity-0", "pointer-events-none");
      btn.classList.add("opacity-100");
    } else {
      btn.classList.add("opacity-0", "pointer-events-none");
      btn.classList.remove("opacity-100");
    }
  });

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}