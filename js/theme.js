export function initTheme() {
  const toggle = document.getElementById("themeToggle");
  if (!toggle) return;

  // Đồng bộ trạng thái nút với class hiện tại
  const isDark = document.documentElement.classList.contains("dark");
  toggle.setAttribute("aria-checked", String(isDark));

  toggle.addEventListener("click", () => {
    const dark = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
    toggle.setAttribute("aria-checked", String(dark));
  });
}