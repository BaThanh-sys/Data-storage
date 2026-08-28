export function initSlider() {
  const root = document.getElementById("testimonial-slider");
  if (!root) return;

  const track = root.querySelector("[data-track]");
  const slides = [...root.querySelectorAll("[data-slide]")];
  const dotsContainer = root.querySelector("[data-dots]");
  const prevBtn = root.querySelector("[data-prev]");
  const nextBtn = root.querySelector("[data-next]");
  if (!track || slides.length === 0) return;

  let index = 0;
  let timer = null;

  // Tạo dots
  slides.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "w-2.5 h-2.5 rounded-full bg-white/30 transition";
    dot.setAttribute("aria-label", `Chuyển tới cảm nhận ${i + 1}`);
    dot.addEventListener("click", () => go(i));
    dotsContainer.appendChild(dot);
  });
  const dots = [...dotsContainer.children];

  function go(next) {
    index = (next + slides.length) % slides.length;
    track.style.transform = `translateX(-${index * 100}%)`;
    slides.forEach((s, i) => s.toggleAttribute("inert", i !== index));
    dots.forEach((d, i) => {
      d.classList.toggle("bg-accent-400", i === index);
      d.classList.toggle("bg-white/30", i !== index);
    });
  }

  function start() {
    stop();
    timer = setInterval(() => go(index + 1), 5000);
  }
  function stop() {
    if (timer) clearInterval(timer);
  }

  prevBtn?.addEventListener("click", () => go(index - 1));
  nextBtn?.addEventListener("click", () => go(index + 1));

  root.addEventListener("mouseenter", stop);
  root.addEventListener("mouseleave", start);
  root.addEventListener("focusin", stop);
  root.addEventListener("focusout", start);
  document.addEventListener("visibilitychange", () => {
    document.hidden ? stop() : start();
  });

  go(0);
  start();
}