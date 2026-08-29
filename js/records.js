const STORAGE_KEY = "robotverse-records";

const state = {
  records: [],
  query: "",
  category: "all",
  status: "all",
  sort: "date-desc",
  loading: true,
  error: null,
};

const sorters = {
  "date-desc": (a, b) => b.date.localeCompare(a.date),
  "date-asc": (a, b) => a.date.localeCompare(b.date),
  "amount-desc": (a, b) => b.amount - a.amount,
  "amount-asc": (a, b) => a.amount - b.amount,
  "weight-desc": (a, b) => b.weight - a.weight,
  "weight-asc": (a, b) => a.weight - b.weight,
};

const statusLabel = {
  "da-chot": "Đã chốt",
  "dang-giao": "Đang giao",
  "cho-xac-nhan": "Chờ xác nhận",
  huy: "Hủy",
};

const dong = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0,
});

function debounce(fn, delay = 300) {
  let id;
  return (...args) => {
    clearTimeout(id);
    id = setTimeout(() => fn(...args), delay);
  };
}

function visibleRecords() {
  const q = state.query.trim().toLowerCase();
  return state.records
    .filter((r) => state.category === "all" || r.category === state.category)
    .filter((r) => state.status === "all" || r.status === state.status)
    .filter((r) => !q || r.trader.toLowerCase().includes(q) || r.id.toLowerCase().includes(q))
    .sort(sorters[state.sort] || sorters["date-desc"]);
}

function saveToStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.records));
}

async function loadRecords() {
  const cached = localStorage.getItem(STORAGE_KEY);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch {
    }
  }
  const res = await fetch("./data/records.json");
  if (!res.ok) throw new Error(`Máy chủ trả về ${res.status}`);
  const data = await res.json();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  return data;
}

function buildRow(record) {
  const tpl = document.getElementById("row-template");
  const row = tpl.content.firstElementChild.cloneNode(true);

  row.querySelector('[data-cell="id"]').textContent = record.id;
  row.querySelector('[data-cell="trader"]').textContent = record.trader;
  row.querySelector('[data-cell="category"]').textContent = record.category;
  row.querySelector('[data-cell="status"]').textContent = statusLabel[record.status] || record.status;
  row.querySelector('[data-cell="weight"]').textContent = record.weight.toLocaleString("vi-VN") + " kg";
  row.querySelector('[data-cell="amount"]').textContent = dong.format(record.amount);
  row.querySelector('[data-cell="date"]').textContent = record.date;

  const delBtn = row.querySelector("[data-delete]");
  delBtn.addEventListener("click", () => {
    if (!confirm(`Xóa bản ghi ${record.id}?`)) return;
    state.records = state.records.filter((r) => r.id !== record.id);
    saveToStorage();
    render();
  });

  return row;
}

function render() {
  const root = document.getElementById("records-app");
  if (!root) return;

  const loadingEl = root.querySelector("[data-state='loading']");
  const errorEl = root.querySelector("[data-state='error']");
  const emptyEl = root.querySelector("[data-state='empty']");
  const tableWrap = root.querySelector("[data-state='table']");
  const tbody = root.querySelector("[data-tbody]");
  const countEl = root.querySelector("[data-count]");

  // Ẩn hết
  [loadingEl, errorEl, emptyEl, tableWrap].forEach((el) => {
    if (el) el.hidden = true;
  });

  if (state.loading) {
    if (loadingEl) loadingEl.hidden = false;
    return;
  }

  if (state.error) {
    if (errorEl) {
      errorEl.hidden = false;
      errorEl.querySelector("[data-error-msg]").textContent = state.error;
    }
    return;
  }

  const list = visibleRecords();

  if (list.length === 0) {
    if (emptyEl) emptyEl.hidden = false;
    if (countEl) countEl.textContent = "0";
    return;
  }

  if (tableWrap) tableWrap.hidden = false;
  if (countEl) countEl.textContent = String(list.length);
  if (tbody) tbody.replaceChildren(...list.map(buildRow));
}

function bindControls() {
  const root = document.getElementById("records-app");
  if (!root) return;

  const search = root.querySelector("#search");
  const category = root.querySelector("#filter-category");
  const status = root.querySelector("#filter-status");
  const sort = root.querySelector("#sort");
  const form = root.querySelector("#add-form");
  const resetBtn = root.querySelector("#reset-data");

  if (search) {
    search.addEventListener(
      "input",
      debounce((e) => {
        state.query = e.target.value;
        render();
      }, 300)
    );
  }

  if (category) {
    category.addEventListener("change", (e) => {
      state.category = e.target.value;
      render();
    });
  }

  if (status) {
    status.addEventListener("change", (e) => {
      state.status = e.target.value;
      render();
    });
  }

  if (sort) {
    sort.addEventListener("change", (e) => {
      state.sort = e.target.value;
      render();
    });
  }

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const record = {
        id: "PC-" + Date.now().toString().slice(-6),
        trader: String(fd.get("trader") || "").trim(),
        category: String(fd.get("category") || "Xoài"),
        status: String(fd.get("status") || "cho-xac-nhan"),
        weight: Number(fd.get("weight") || 0),
        amount: Number(fd.get("amount") || 0),
        date: String(fd.get("date") || new Date().toISOString().slice(0, 10)),
      };
      if (!record.trader) return;
      state.records.unshift(record);
      saveToStorage();
      form.reset();
      render();
    });
  }
  

  if (resetBtn) {
    resetBtn.addEventListener("click", async () => {
      if (!confirm("Khôi phục dữ liệu mẫu? Mọi thay đổi sẽ mất.")) return;
      localStorage.removeItem(STORAGE_KEY);
      state.loading = true;
      state.error = null;
      render();
      try {
        state.records = await loadRecords();
      } catch (err) {
        state.error = `Không tải được dữ liệu: ${err.message}`;
      } finally {
        state.loading = false;
        render();
      }
    });
  }
}

export async function initRecords() {
  const root = document.getElementById("records-app");
  if (!root) return;

  bindControls();
  render(); 

  try {
    state.records = await loadRecords();
  } catch (err) {
    state.error = `Không tải được dữ liệu: ${err.message}`;
  } finally {
    state.loading = false;
    render();
  }
}