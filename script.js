/*
  ================================================================
  DEFAULT EXAM SCHEDULE
  ================================================================
  date   = YYYY-MM-DD format (example: 2026-08-04)
  code   = course code
  course = full course name
  ct     = CT number
  teacher = teacher/sir name (optional)
  topics  = exam topic list (optional)

  You can now change dates directly from the website by clicking
  "Manage CTs". This section is kept as the default/reset schedule.
*/
const DEFAULT_EXAM_SCHEDULE = [
  { date: "2026-08-04", code: "CSE-4103", course: "Cellular and Wireless Communication", ct: 1 },
  { date: "2026-08-11", code: "CSE-4107", course: "Computer and Cyber Security", ct: 1 },
  { date: "2026-08-16", code: "CSE-4101", course: "Digital Signal Processing", ct: 1 },
  { date: "2026-08-18", code: "CSE-4105", course: "Data Science and Applications", ct: 1 },
  { date: "2026-08-20", code: "CSE-4115", course: "Machine Learning", ct: 1 },
  { date: "2026-08-23", code: "CSE-4103", course: "Cellular and Wireless Communication", ct: 2 },
  { date: "2026-08-25", code: "CSE-4107", course: "Computer and Cyber Security", ct: 2 },
  { date: "2026-09-02", code: "CSE-4101", course: "Digital Signal Processing", ct: 2 },
  { date: "2026-09-20", code: "CSE-4103", course: "Cellular and Wireless Communication", ct: 3 },
  { date: "2026-09-23", code: "CSE-4105", course: "Data Science and Applications", ct: 2 },
  { date: "2026-09-27", code: "CSE-4101", course: "Digital Signal Processing", ct: 3 },
  { date: "2026-09-29", code: "CSE-4107", course: "Computer and Cyber Security", ct: 3 },
  { date: "2026-10-01", code: "CSE-4115", course: "Machine Learning", ct: 2 },
  { date: "2026-10-06", code: "CSE-4105", course: "Data Science and Applications", ct: 3 },
  { date: "2026-10-11", code: "CSE-4103", course: "Cellular and Wireless Communication", ct: 4 },
  { date: "2026-10-15", code: "CSE-4115", course: "Machine Learning", ct: 3 },
  { date: "2026-10-18", code: "CSE-4101", course: "Digital Signal Processing", ct: 4 },
  { date: "2026-10-26", code: "CSE-4107", course: "Computer and Cyber Security", ct: 4 },
  { date: "2026-10-29", code: "CSE-4115", course: "Machine Learning", ct: 4 },
  { date: "2026-11-04", code: "CSE-4105", course: "Data Science and Applications", ct: 4 }
].map((exam, index) => ({
  ...exam,
  id: `${exam.code}-${exam.ct}-${index}`,
  teacher: "",
  topics: []
}));

const STORAGE_KEY = "ct-dashboard-schedule-v2";
const THEME_STORAGE_KEY = "ct-dashboard-theme";

/* Optional: color and short-name settings for each course. */
const courseSettings = {
  "CSE-4101": { short: "DSP", color: "#d94c65", name: "Digital Signal Processing" },
  "CSE-4103": { short: "CWC", color: "#7158d9", name: "Cellular and Wireless Communication" },
  "CSE-4105": { short: "DSA", color: "#2f6fcc", name: "Data Science and Applications" },
  "CSE-4107": { short: "CCS", color: "#188a67", name: "Computer and Cyber Security" },
  "CSE-4115": { short: "ML",  color: "#b66a0a", name: "Machine Learning" }
};

/* ================================================================
   DASHBOARD CODE — normally you do not need to edit below this line
   ================================================================ */

const state = {
  course: "all",
  month: "all",
  view: "timeline"
};

function cloneDefaults() {
  return DEFAULT_EXAM_SCHEDULE.map((exam) => ({ ...exam, topics: [...exam.topics] }));
}

function normalizeTopics(value) {
  const source = Array.isArray(value) ? value : [value];
  return source.flatMap((item) => String(item || "").split(/[,\n]/)).map((topic) => topic.trim()).filter(Boolean);
}

function loadSchedule() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return cloneDefaults();
    const saved = JSON.parse(raw);
    if (!Array.isArray(saved)) return cloneDefaults();
    const normalized = saved
      .filter((exam) => exam && /^\d{4}-\d{2}-\d{2}$/.test(exam.date) && courseSettings[exam.code] && Number(exam.ct) > 0)
      .map((exam, index) => ({
        id: exam.id || `${exam.code}-${exam.ct}-${index}`,
        date: exam.date,
        code: exam.code,
        course: courseSettings[exam.code].name,
        ct: Number(exam.ct),
        teacher: String(exam.teacher || "").trim(),
        topics: normalizeTopics(exam.topics)
      }));
    return normalized.length ? normalized : cloneDefaults();
  } catch (error) {
    return cloneDefaults();
  }
}

let examSchedule = loadSchedule();
let sortedExams = [];
let managerDraft = [];
let managerCourse = "all";

function refreshSortedExams() {
  sortedExams = [...examSchedule].sort((a, b) =>
    a.date.localeCompare(b.date) || a.code.localeCompare(b.code) || a.ct - b.ct
  );
}

refreshSortedExams();

const escapeHtml = (value) => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#039;");

function parseDate(date) {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function todayKey() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Dhaka",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(new Date());

  const get = (type) => parts.find((part) => part.type === type)?.value;
  return `${get("year")}-${get("month")}-${get("day")}`;
}

function dateInfo(date) {
  const parsed = parseDate(date);
  return {
    day: new Intl.DateTimeFormat("en-US", { day: "2-digit" }).format(parsed),
    weekday: new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(parsed),
    month: new Intl.DateTimeFormat("en-US", { month: "short" }).format(parsed),
    full: new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    }).format(parsed)
  };
}

function monthTitle(monthKey) {
  const [year, month] = monthKey.split("-").map(Number);
  return new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" })
    .format(new Date(year, month - 1, 1));
}

function daysBetween(from, to) {
  const start = parseDate(from);
  const end = parseDate(to);
  return Math.round((end - start) / 86400000);
}

function courseMeta(exam) {
  return courseSettings[exam.code] || { short: exam.code, color: "#61716b" };
}

function uniqueCourses() {
  const map = new Map();
  sortedExams.forEach((exam) => {
    if (!map.has(exam.code)) map.set(exam.code, { code: exam.code, name: exam.course });
  });
  return [...map.values()];
}

function uniqueMonths() {
  return [...new Set(sortedExams.map((exam) => exam.date.slice(0, 7)))];
}

function renderSummary() {
  const today = todayKey();
  const completed = sortedExams.filter((exam) => exam.date < today).length;
  const nextDate = sortedExams.find((exam) => exam.date >= today)?.date;
  const nextExams = nextDate ? sortedExams.filter((exam) => exam.date === nextDate) : [];
  const progress = sortedExams.length ? Math.round((completed / sortedExams.length) * 100) : 0;

  document.getElementById("progressText").textContent = `${progress}% complete`;
  document.getElementById("progressBar").style.width = `${progress}%`;
  document.getElementById("doneCount").textContent = `${completed} done`;
  document.getElementById("remainingCount").textContent = `${sortedExams.length - completed} remaining`;

  const target = document.getElementById("nextExamContent");
  document.getElementById("nextLabelText").textContent = nextExams.length > 1 ? "Next class tests" : "Next class test";

  if (!nextExams.length) {
    target.innerHTML = `
      <div class="semester-done">
        <span>✓</span><h2>All CTs completed!</h2>
        <p>You made it through the full schedule.</p>
      </div>`;
    return;
  }

  const info = dateInfo(nextDate);
  const remainingDays = daysBetween(today, nextDate);
  target.innerHTML = `
    <div class="countdown-row">
      <div><strong>${remainingDays}</strong><span>${remainingDays === 1 ? "day" : "days"}<br>to go</span></div>
      <span class="same-day-badge">${nextExams.length} CT${nextExams.length === 1 ? "" : "s"}${nextExams.length > 1 ? " · same day" : ""}</span>
    </div>
    <div class="next-exam-stack">
      ${nextExams.map((exam) => {
        const meta = courseMeta(exam);
        return `
          <div class="next-exam-item" style="--course-color:${meta.color}">
            <div>
              <span class="subject-code" style="color:${meta.color}">${escapeHtml(exam.code)}</span>
              <h2>${escapeHtml(exam.course)}</h2>
              ${exam.teacher ? `<p class="next-teacher">👤 ${escapeHtml(exam.teacher)}</p>` : ""}
            </div>
            <span class="ct-badge" style="background:${meta.color}">CT ${String(exam.ct).padStart(2, "0")}</span>
          </div>`;
      }).join("")}
    </div>
    <div class="next-date">
      <div class="mini-calendar"><b>${info.month}</b><strong>${info.day}</strong></div>
      <div><b>${remainingDays === 0 ? "Today" : info.weekday}</b><span>${info.full}</span></div>
    </div>`;
}

function renderControls() {
  const courses = uniqueCourses();
  const courseFilters = document.getElementById("courseFilters");
  courseFilters.innerHTML = `
    <button type="button" data-course="all" class="${state.course === "all" ? "active" : ""}">All courses</button>
    ${courses.map((course) => {
      const meta = courseSettings[course.code] || { short: course.code, color: "#61716b" };
      return `<button type="button" data-course="${escapeHtml(course.code)}" class="${state.course === course.code ? "active" : ""}" style="--filter-color:${meta.color}" title="${escapeHtml(course.name)}"><i></i>${escapeHtml(meta.short)}</button>`;
    }).join("")}`;

  courseFilters.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      state.course = button.dataset.course;
      renderControls();
      renderSchedule();
    });
  });

  const monthFilter = document.getElementById("monthFilter");
  monthFilter.innerHTML = `<option value="all">All months</option>${uniqueMonths()
    .map((month) => `<option value="${month}">${monthTitle(month).replace(/ \d{4}$/, "")}</option>`)
    .join("")}`;
  monthFilter.value = state.month;
  monthFilter.onchange = () => {
    state.month = monthFilter.value;
    renderSchedule();
  };

  document.getElementById("timelineButton").classList.toggle("active", state.view === "timeline");
  document.getElementById("calendarButton").classList.toggle("active", state.view === "calendar");
}

function filteredExams() {
  return sortedExams.filter((exam) =>
    (state.course === "all" || exam.code === state.course) &&
    (state.month === "all" || exam.date.startsWith(state.month))
  );
}

function statusFor(exam, today, nextDate) {
  if (exam.date < today) return { key: "completed", label: "Completed" };
  if (exam.date === today) return { key: "today", label: "Today" };
  if (nextDate && exam.date === nextDate) return { key: "upcoming", label: "Next up" };
  return { key: "upcoming", label: "Upcoming" };
}

function renderTimeline(exams) {
  const today = todayKey();
  const nextDate = sortedExams.find((exam) => exam.date >= today)?.date;
  let previousMonth = "";

  return `<div class="timeline">${exams.map((exam) => {
    const month = exam.date.slice(0, 7);
    const showMonth = month !== previousMonth;
    previousMonth = month;
    const info = dateInfo(exam.date);
    const meta = courseMeta(exam);
    const status = statusFor(exam, today, nextDate);
    const isNext = exam.date === nextDate;
    const topics = normalizeTopics(exam.topics);

    return `
      ${showMonth ? `<h3 class="month-divider">${monthTitle(month)}</h3>` : ""}
      <article class="exam-row ${status.key} ${isNext ? "is-next" : ""}" style="--course-color:${meta.color}" data-exam-id="${escapeHtml(exam.id)}" role="button" tabindex="0" aria-expanded="false" aria-label="Show topics for ${escapeHtml(exam.code)} CT ${exam.ct}">
        <div class="exam-date"><strong>${info.day}</strong><span>${info.month} · ${info.weekday}</span></div>
        <div class="timeline-dot"><span></span></div>
        <div class="exam-subject"><span>${escapeHtml(exam.code)}</span><h4>${escapeHtml(exam.course)}</h4>${exam.teacher ? `<p class="teacher-name">👤 ${escapeHtml(exam.teacher)}</p>` : ""}</div>
        <div class="exam-meta"><b>CT ${String(exam.ct).padStart(2, "0")}</b><span class="status ${status.key}">${status.label}</span><span class="topic-hint">Topics <i>⌄</i></span></div>
        <div class="exam-details">
          <div class="topic-heading"><b>Exam topics</b><span>${topics.length} topic${topics.length === 1 ? "" : "s"}</span></div>
          ${topics.length ? `<ul>${topics.map((topic) => `<li>${escapeHtml(topic)}</li>`).join("")}</ul>` : `<p>No topics added yet. Open <b>Manage CTs</b> to add them.</p>`}
        </div>
      </article>`;
  }).join("")}</div>`;
}

function renderCalendarMonth(monthKey, exams) {
  const [year, month] = monthKey.split("-").map(Number);
  const firstDay = new Date(year, month - 1, 1).getDay();
  const totalDays = new Date(year, month, 0).getDate();
  const today = todayKey();
  const byDay = new Map();
  exams.forEach((exam) => {
    const day = Number(exam.date.slice(-2));
    if (!byDay.has(day)) byDay.set(day, []);
    byDay.get(day).push(exam);
  });

  const cells = [];
  for (let i = 0; i < firstDay; i += 1) cells.push(`<span class="calendar-day empty"></span>`);
  for (let day = 1; day <= totalDays; day += 1) {
    const key = `${monthKey}-${String(day).padStart(2, "0")}`;
    const dayExams = byDay.get(day) || [];
    const firstExam = dayExams[0];
    const meta = firstExam ? courseMeta(firstExam) : null;
    const labels = dayExams.map((exam) => {
      const itemMeta = courseMeta(exam);
      const ctNumber = String(exam.ct).padStart(2, "0");
      return `<b class="calendar-exam-label" style="--item-color:${itemMeta.color}" aria-label="${escapeHtml(exam.course)}, CT ${exam.ct}"><span>${escapeHtml(itemMeta.short)}</span><small>CT ${ctNumber}</small></b>`;
    }).join("");
    const title = dayExams.map((exam) => `${exam.code} — ${exam.course}, CT ${exam.ct}`).join(" | ");
    cells.push(`
      <div class="calendar-day ${dayExams.length ? "has-exam" : ""} ${key === today ? "is-today" : ""} ${key < today ? "is-past" : ""}"
           ${meta ? `style="--course-color:${meta.color}" title="${escapeHtml(title)}"` : ""}>
        <span>${day}</span>${labels}
      </div>`);
  }

  return `
    <article class="calendar-card">
      <div class="calendar-heading"><h3>${monthTitle(monthKey)}</h3><span>${exams.length} CT${exams.length === 1 ? "" : "s"}</span></div>
      <div class="calendar-weekdays" aria-hidden="true"><span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span></div>
      <div class="calendar-grid">${cells.join("")}</div>
    </article>`;
}

function emptyState() {
  return `<div class="empty-state"><span>⌁</span><h3>No CTs found</h3><p>Try another course or month filter.</p></div>`;
}

function renderSchedule() {
  const exams = filteredExams();
  const target = document.getElementById("scheduleContent");
  if (!exams.length) {
    target.innerHTML = emptyState();
    return;
  }

  if (state.view === "timeline") {
    target.innerHTML = renderTimeline(exams);
    bindExamCardToggles();
    return;
  }

  const months = state.month === "all" ? uniqueMonths() : [state.month];
  target.innerHTML = `<div class="calendar-list">${months.map((month) => {
    const items = exams.filter((exam) => exam.date.startsWith(month));
    return items.length ? renderCalendarMonth(month, items) : "";
  }).join("")}</div>`;
}

function bindExamCardToggles() {
  document.querySelectorAll(".exam-row[data-exam-id]").forEach((card) => {
    const toggle = () => {
      const expanded = card.classList.toggle("is-expanded");
      card.setAttribute("aria-expanded", String(expanded));
    };
    card.addEventListener("click", toggle);
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        toggle();
      }
    });
  });
}

function renderCourseKey() {
  document.getElementById("courseGrid").innerHTML = uniqueCourses().map((course) => {
    const meta = courseSettings[course.code] || { short: course.code, color: "#61716b" };
    const count = sortedExams.filter((exam) => exam.code === course.code).length;
    return `
      <article style="--course-color:${meta.color}">
        <span class="course-number">${escapeHtml(meta.short)}</span>
        <div><b>${escapeHtml(course.code)}</b><p>${escapeHtml(course.name)}</p></div>
        <strong>${String(count).padStart(2, "0")}</strong>
      </article>`;
  }).join("");
}

function renderAll() {
  refreshSortedExams();
  renderSummary();
  renderControls();
  renderSchedule();
  renderCourseKey();
}

function renderManagerFilters() {
  const target = document.getElementById("managerCourseFilters");
  const summary = document.getElementById("managerFilterSummary");
  const availableCodes = [...new Set(managerDraft.map((exam) => exam.code))]
    .filter((code) => courseSettings[code]);

  if (managerCourse !== "all" && !availableCodes.includes(managerCourse)) {
    managerCourse = "all";
  }

  const visibleCount = managerCourse === "all"
    ? managerDraft.length
    : managerDraft.filter((exam) => exam.code === managerCourse).length;
  const activeMeta = courseSettings[managerCourse];

  summary.textContent = managerCourse === "all"
    ? `Showing all ${managerDraft.length} CTs`
    : `Showing ${visibleCount} ${activeMeta.short} CT${visibleCount === 1 ? "" : "s"}`;

  target.innerHTML = `
    <button type="button" data-manager-course="all" class="${managerCourse === "all" ? "active" : ""}">All courses</button>
    ${availableCodes.map((code) => {
      const meta = courseSettings[code];
      return `<button type="button" data-manager-course="${escapeHtml(code)}" class="${managerCourse === code ? "active" : ""}" style="--filter-color:${meta.color}" title="${escapeHtml(meta.name)}"><i></i>${escapeHtml(meta.short)}</button>`;
    }).join("")}`;

  target.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      managerCourse = button.dataset.managerCourse;
      renderManagerList();
    });
  });
}

function renderManagerList() {
  const target = document.getElementById("managerList");
  renderManagerFilters();

  const orderedDraft = managerDraft
    .filter((exam) => managerCourse === "all" || exam.code === managerCourse)
    .sort((a, b) =>
    a.date.localeCompare(b.date) || a.code.localeCompare(b.code) || a.ct - b.ct
  );

  target.innerHTML = orderedDraft.length ? orderedDraft.map((exam) => {
    const meta = courseMeta(exam);
    return `
      <div class="manager-row" style="--course-color:${meta.color}">
        <span class="manager-course-mark">${escapeHtml(meta.short)}</span>
        <div class="manager-exam-name">
          <b>${escapeHtml(exam.code)}</b>
          <span>${escapeHtml(exam.course)}</span>
          <small>CT ${String(exam.ct).padStart(2, "0")}</small>
        </div>
        <div class="manager-fields">
          <label>
            <span>Exam date</span>
            <input type="date" value="${escapeHtml(exam.date)}" data-field-id="${escapeHtml(exam.id)}" data-field="date">
          </label>
          <label>
            <span>Teacher / Sir</span>
            <input type="text" value="${escapeHtml(exam.teacher || "")}" placeholder="Add sir's name" data-field-id="${escapeHtml(exam.id)}" data-field="teacher">
          </label>
          <label class="manager-topics-field">
            <span>Exam topics</span>
            <textarea rows="2" placeholder="Separate topics with commas or new lines" data-field-id="${escapeHtml(exam.id)}" data-field="topics">${escapeHtml(normalizeTopics(exam.topics).join(", "))}</textarea>
          </label>
        </div>
        <button class="delete-exam" type="button" data-delete-id="${escapeHtml(exam.id)}" aria-label="Delete ${escapeHtml(exam.code)} CT ${exam.ct}">Delete</button>
      </div>`;
  }).join("") : `<div class="manager-empty"><b>No CT found for this course.</b><span>Choose another course, add a new CT below, or restore the default schedule.</span></div>`;

  target.querySelectorAll("[data-field-id]").forEach((input) => {
    input.addEventListener("input", () => {
      const value = input.dataset.field === "topics" ? normalizeTopics(input.value) : input.value;
      managerDraft = managerDraft.map((exam) => exam.id === input.dataset.fieldId
        ? { ...exam, [input.dataset.field]: value }
        : exam);
    });
  });

  target.querySelectorAll("button[data-delete-id]").forEach((button) => {
    button.addEventListener("click", () => {
      managerDraft = managerDraft.filter((exam) => exam.id !== button.dataset.deleteId);
      renderManagerList();
    });
  });
}

function openManager() {
  managerDraft = sortedExams.map((exam) => ({ ...exam }));
  managerCourse = "all";
  const courseSelect = document.getElementById("newCourse");
  courseSelect.innerHTML = Object.entries(courseSettings).map(([code, meta]) =>
    `<option value="${escapeHtml(code)}">${escapeHtml(code)} · ${escapeHtml(meta.short)}</option>`
  ).join("");
  renderManagerList();
  document.getElementById("managerModal").hidden = false;
  document.body.classList.add("manager-is-open");
  document.getElementById("closeManagerButton").focus();
}

function closeManager() {
  document.getElementById("managerModal").hidden = true;
  document.body.classList.remove("manager-is-open");
  document.getElementById("openManagerButton").focus();
}

function addExamFromManager() {
  const code = document.getElementById("newCourse").value;
  const ct = Number(document.getElementById("newCt").value);
  const date = document.getElementById("newDate").value;
  const teacher = document.getElementById("newTeacher").value.trim();
  const topics = normalizeTopics(document.getElementById("newTopics").value);
  const meta = courseSettings[code];
  if (!meta || !date || ct < 1) return;

  managerDraft.push({
    id: `${code}-${ct}-${Date.now()}`,
    date,
    code,
    course: meta.name,
    ct,
    teacher,
    topics
  });
  document.getElementById("newDate").value = "";
  document.getElementById("newTeacher").value = "";
  document.getElementById("newTopics").value = "";
  document.getElementById("newCt").value = String(ct + 1);
  managerCourse = code;
  renderManagerList();
}

function saveManagerChanges() {
  const cleaned = managerDraft
    .filter((exam) => /^\d{4}-\d{2}-\d{2}$/.test(exam.date) && courseSettings[exam.code] && Number(exam.ct) > 0)
    .map((exam) => ({
      ...exam,
      course: courseSettings[exam.code].name,
      ct: Number(exam.ct),
      teacher: String(exam.teacher || "").trim(),
      topics: normalizeTopics(exam.topics)
    }));
  if (!cleaned.length) return;

  examSchedule = cleaned;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(examSchedule));
  } catch (error) {
    // The dashboard still updates for this session when browser storage is unavailable.
  }
  state.course = "all";
  state.month = "all";
  closeManager();
  renderAll();
}

function applyTheme(theme, savePreference = false) {
  const safeTheme = theme === "dark" ? "dark" : "light";
  document.documentElement.dataset.theme = safeTheme;

  const button = document.getElementById("themeToggleButton");
  const nextTheme = safeTheme === "dark" ? "light" : "dark";
  button.setAttribute("aria-label", `Switch to ${nextTheme} theme`);
  button.setAttribute("title", `Switch to ${nextTheme} theme`);
  button.setAttribute("aria-pressed", String(safeTheme === "dark"));
  button.querySelector(".theme-toggle-icon").textContent = safeTheme === "dark" ? "☀" : "☾";
  button.querySelector(".theme-toggle-text").textContent = safeTheme === "dark" ? "Light" : "Dark";

  if (savePreference) {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, safeTheme);
    } catch (error) {
      // The selected theme still works for this session when storage is unavailable.
    }
  }
}

function initializeTheme() {
  const currentTheme = document.documentElement.dataset.theme;
  const preferredTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  applyTheme(currentTheme === "dark" || currentTheme === "light" ? currentTheme : preferredTheme);
}

document.getElementById("timelineButton").addEventListener("click", () => {
  state.view = "timeline";
  renderControls();
  renderSchedule();
});

document.getElementById("calendarButton").addEventListener("click", () => {
  state.view = "calendar";
  renderControls();
  renderSchedule();
});

document.getElementById("themeToggleButton").addEventListener("click", () => {
  const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  applyTheme(nextTheme, true);
});

document.getElementById("openManagerButton").addEventListener("click", openManager);
document.getElementById("closeManagerButton").addEventListener("click", closeManager);
document.getElementById("cancelManagerButton").addEventListener("click", closeManager);
document.getElementById("addExamButton").addEventListener("click", addExamFromManager);
document.getElementById("saveScheduleButton").addEventListener("click", saveManagerChanges);
document.getElementById("resetScheduleButton").addEventListener("click", () => {
  managerDraft = cloneDefaults();
  managerCourse = "all";
  renderManagerList();
});
document.getElementById("managerModal").addEventListener("mousedown", (event) => {
  if (event.target.id === "managerModal") closeManager();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !document.getElementById("managerModal").hidden) closeManager();
});

initializeTheme();
renderAll();

/* Refresh "Next CT" automatically if the page remains open overnight. */
setInterval(() => {
  renderSummary();
  renderSchedule();
}, 60000);
