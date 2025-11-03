// ---------- State helpers ----------
const el = (id) => document.getElementById(id);

// Containers
const educationList = el("educationList");
const experienceList = el("experienceList");
const projectList = el("projectList");

// Buttons
const addEduBtn = el("addEdu");
const addExpBtn = el("addExp");
const addProjBtn = el("addProj");
const clearBtn = el("clearBtn");
const downloadBtn = el("downloadBtn");

// Skills system
let customSkills = [];

// ---------- Skills System ----------
function initializeSkillsSystem() {
  const checkboxGroup = el("skillsCheckboxGroup");
  const customSkillInput = el("customSkillInput");

  // Add event listeners to all checkboxes
  checkboxGroup
    .querySelectorAll('input[type="checkbox"]')
    .forEach((checkbox) => {
      checkbox.addEventListener("change", updatePreview);
    });

  // Custom skills input
  customSkillInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const skill = customSkillInput.value.trim();
      if (skill && !customSkills.includes(skill)) {
        customSkills.push(skill);
        customSkillInput.value = "";
        updatePreview();

        // Add animation to new skill
        animateNewSkill(skill);
      }
    }
  });
}

function removeCustomSkill(skill) {
  customSkills = customSkills.filter((s) => s !== skill);
  updatePreview();
}

function animateNewSkill(skill) {
  const skillElements = document.querySelectorAll(".skill-tag");
  const newSkillElement = Array.from(skillElements).find(
    (el) => el.textContent === skill
  );
  if (newSkillElement) {
    newSkillElement.style.animation = "none";
    void newSkillElement.offsetWidth;
    newSkillElement.style.animation = "fadeInUp 0.5s ease-out";
  }
}

// ---------- Helpers to create fields ----------
function makeInput(placeholder, type = "text", name = "") {
  const input = document.createElement("input");
  input.type = type;
  input.placeholder = placeholder;
  if (name) input.name = name;
  input.addEventListener("input", updatePreview);
  return input;
}

function makeTextarea(placeholder, name = "") {
  const ta = document.createElement("textarea");
  ta.placeholder = placeholder;
  if (name) ta.name = name;
  ta.addEventListener("input", updatePreview);
  return ta;
}

function makeSelect(options = []) {
  const s = document.createElement("select");
  options.forEach((opt) => {
    const o = document.createElement("option");
    o.value = opt;
    o.textContent = opt || "—";
    s.appendChild(o);
  });
  s.addEventListener("change", updatePreview);
  return s;
}

function makeRemoveButton(onclick) {
  const b = document.createElement("button");
  b.type = "button";
  b.className = "btn ghost";
  b.textContent = "Remove";
  b.addEventListener("click", onclick);
  return b;
}

// ---------- Add Education / Experience / Project ----------
function addEducation(prefill = {}) {
  const item = document.createElement("div");
  item.className = "item";
  const deg = makeInput("Degree / Class (e.g. 10th, 12th, B.Tech)");
  const inst = makeInput("School / College Name");
  const board = makeInput("Board / University");
  const location = makeInput("Location (City, State)");
  const result = makeInput("Result / Percentage / CGPA");

  if (prefill.degree) deg.value = prefill.degree;
  if (prefill.inst) inst.value = prefill.inst;
  if (prefill.board) board.value = prefill.board;
  if (prefill.location) location.value = prefill.location;
  if (prefill.result) result.value = prefill.result;

  const remove = makeRemoveButton(() => {
    educationList.removeChild(item);
    updatePreview();
  });

  [deg, inst, board, location, result, remove].forEach((el) =>
    item.appendChild(el)
  );
  educationList.appendChild(item);
  updatePreview();
}

function addExperience(prefill = {}) {
  const item = document.createElement("div");
  item.className = "item";
  const company = makeInput("Company Name", "text");
  const role = makeInput("Role / Position (e.g. Intern, Developer)");
  const loc = makeInput("Company Location", "text");
  const mode = makeSelect(["", "Onsite", "Remote", "Hybrid"]);
  const duration = makeInput("Duration (e.g. 6 months, 1 year 3 months)");
  const desc = makeTextarea("Description (multi-line allowed)", "desc");

  if (prefill.company) company.value = prefill.company;
  if (prefill.role) role.value = prefill.role;
  if (prefill.loc) loc.value = prefill.loc;
  if (prefill.mode) mode.value = prefill.mode;
  if (prefill.duration) duration.value = prefill.duration;
  if (prefill.desc) desc.value = prefill.desc;

  const remove = makeRemoveButton(() => {
    experienceList.removeChild(item);
    updatePreview();
  });

  [company, role, loc, mode, duration, desc, remove].forEach((el) =>
    item.appendChild(el)
  );
  experienceList.appendChild(item);
  updatePreview();
}

function addProject(prefill = {}) {
  const item = document.createElement("div");
  item.className = "item";
  const title = makeInput("Project Title", "text");
  const live = makeInput("Live Link (optional)", "url");
  const git = makeInput("GitHub Link (optional)", "url");
  const desc = makeTextarea("Description (multi-line allowed)", "desc");

  if (prefill.title) title.value = prefill.title;
  if (prefill.live) live.value = prefill.live;
  if (prefill.git) git.value = prefill.git;
  if (prefill.desc) desc.value = prefill.desc;

  const remove = makeRemoveButton(() => {
    projectList.removeChild(item);
    updatePreview();
  });

  [title, live, git, desc, remove].forEach((el) => item.appendChild(el));
  projectList.appendChild(item);
  updatePreview();
}

// ---------- Escape helpers ----------
function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
function escapeHtmlAttr(str) {
  return escapeHtml(str).replaceAll("&amp;", "&");
}

// ---------- Animation helpers ----------
function animateResumeSections() {
  const sections = document.querySelectorAll(".resume-section");
  sections.forEach((section, index) => {
    // Remove animation class first
    section.classList.remove("new-content");

    // Force reflow
    void section.offsetWidth;

    // Add animation class with delay
    setTimeout(() => {
      section.classList.add("new-content");
    }, index * 100);
  });
}

// ---------- Preview update ----------
function updatePreview() {
  const name = el("fullName").value.trim();
  const email = el("email").value.trim();
  const phone = el("phone").value.trim();
  const github = el("githubLink").value.trim();
  const coding = el("codingLink").value.trim();
  const linkedin = el("linkedinLink").value.trim();

  // Contacts (combined + clickable)
  let contactHTML = "";
  if (email)
    contactHTML += `<a href="mailto:${escapeHtmlAttr(email)}">${escapeHtml(
      email
    )}</a>`;
  if (phone) contactHTML += (contactHTML ? " | " : "") + escapeHtml(phone);
  if (github)
    contactHTML +=
      (contactHTML ? " | " : "") +
      `<a href="${escapeHtmlAttr(
        github
      )}" target="_blank" rel="noopener">GitHub</a>`;
  if (coding)
    contactHTML +=
      (contactHTML ? " | " : "") +
      `<a href="${escapeHtmlAttr(
        coding
      )}" target="_blank" rel="noopener">LeetCode / GFG</a>`;
  if (linkedin)
    contactHTML +=
      (contactHTML ? " | " : "") +
      `<a href="${escapeHtmlAttr(
        linkedin
      )}" target="_blank" rel="noopener">LinkedIn</a>`;

  el("rName").textContent = name || "Your Name";
  el("rContact").innerHTML =
    contactHTML || "Email | Phone | Links will appear here.";

  // Summary
  const summaryText = el("summary").value || "";
  el("rSummary").innerHTML =
    escapeHtml(summaryText).replace(/\n/g, "<br>") ||
    "Your profile summary will appear here.";

  // Skills - Checkbox system + custom tags
  const selectedSkills = Array.from(
    document.querySelectorAll(
      '#skillsCheckboxGroup input[type="checkbox"]:checked'
    )
  ).map((cb) => cb.value);

  const allSkills = [...selectedSkills, ...customSkills];
  const rSkills = el("rSkills");
  rSkills.innerHTML = "";

  allSkills.forEach((s) => {
    const span = document.createElement("span");
    span.className = "chip skill-tag";
    span.textContent = s;

    // Add remove functionality for custom skills
    if (customSkills.includes(s)) {
      span.style.cursor = "pointer";
      span.title = "Click to remove";
      span.addEventListener("click", () => removeCustomSkill(s));
    }

    rSkills.appendChild(span);
  });

  // Education
  const rEdu = el("rEducation");
  rEdu.innerHTML = "";
  const eduItems = educationList.querySelectorAll(".item");
  eduItems.forEach((item) => {
    const inputs = item.querySelectorAll("input");
    const degree = inputs[0].value.trim();
    const inst = inputs[1].value.trim();
    const board = inputs[2].value.trim();
    const location = inputs[3].value.trim();
    const result = inputs[4].value.trim();
    if (degree || inst) {
      const p = document.createElement("p");
      p.innerHTML = `<strong>${escapeHtml(degree)}</strong> - ${escapeHtml(
        inst
      )}${board ? ", " + escapeHtml(board) : ""}${
        location ? ", " + escapeHtml(location) : ""
      }${result ? " <em>(" + escapeHtml(result) + ")</em>" : ""}`;
      rEdu.appendChild(p);
    }
  });

  // Experience
  const rExp = el("rExperience");
  rExp.innerHTML = "";
  const expItems = experienceList.querySelectorAll(".item");
  expItems.forEach((item) => {
    const company = item.children[0].value.trim();
    const role = item.children[1].value.trim();
    const loc = item.children[2].value.trim();
    const mode = item.children[3].value.trim();
    const duration = item.children[4].value.trim();
    const desc = item.children[5].value || "";

    if (company || role) {
      const wrapper = document.createElement("div");
      wrapper.innerHTML = `<p><strong>${escapeHtml(company)}</strong>${
        role ? " - " + escapeHtml(role) : ""
      } ${mode ? " | " + escapeHtml(mode) : ""}${
        loc ? " | " + escapeHtml(loc) : ""
      } ${duration ? " | " + escapeHtml(duration) : ""}</p>
        <p>${escapeHtml(desc).replace(/\n/g, "<br>")}</p>`;
      rExp.appendChild(wrapper);
    }
  });

  // Projects
  const rProj = el("rProjects");
  rProj.innerHTML = "";
  const projItems = projectList.querySelectorAll(".item");
  projItems.forEach((item) => {
    const title = item.children[0].value.trim();
    const live = item.children[1].value.trim();
    const git = item.children[2].value.trim();
    const desc = item.children[3].value || "";
    if (title) {
      const p = document.createElement("div");
      p.innerHTML = `<p><strong>${escapeHtml(title)}</strong> ${
        live
          ? ' | <a href="' +
            escapeHtmlAttr(live) +
            '" target="_blank" rel="noopener">Live</a>'
          : ""
      } ${
        git
          ? ' | <a href="' +
            escapeHtmlAttr(git) +
            '" target="_blank" rel="noopener">GitHub</a>'
          : ""
      }</p>
        <p>${escapeHtml(desc).replace(/\n/g, "<br>")}</p>`;
      rProj.appendChild(p);
    }
  });

  // Add animations
  animateResumeSections();
  updateProgress();
}

// ---------- Progress calculation ----------
function updateProgress() {
  const allInputs = Array.from(
    document.querySelectorAll(
      "#resumeForm input, #resumeForm textarea, #resumeForm select"
    )
  );
  const relevant = allInputs.filter(
    (i) => i.type !== "button" && i.style.display !== "none"
  );
  const filled = relevant.filter(
    (i) => i.value && i.value.trim() !== ""
  ).length;
  const percent = relevant.length
    ? Math.round((filled / relevant.length) * 100)
    : 0;
  el("progressBar").style.width = percent + "%";
}

// ---------- Clear form ----------
function clearAll() {
  el("resumeForm").reset();
  educationList.innerHTML = "";
  experienceList.innerHTML = "";
  projectList.innerHTML = "";
  customSkills = [];

  // Clear checkboxes
  document
    .querySelectorAll('#skillsCheckboxGroup input[type="checkbox"]')
    .forEach((cb) => {
      cb.checked = false;
    });

  updatePreview();
}

// ---------- PDF Download ----------
function downloadPDF() {
  const element = el("resumePreview");
  const filename =
    (el("fullName").value.trim()
      ? el("fullName").value.trim().replace(/\s+/g, "_")
      : "resume") + ".pdf";

  const opt = {
    margin: 0.5,
    filename,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: {
      scale: 2,
      scrollY: 0,
      useCORS: true,
      backgroundColor: "#ffffff",
      logging: false,
    },
    jsPDF: {
      unit: "in",
      format: "a4",
      orientation: "portrait",
      compress: true,
    },
    pagebreak: { mode: ["css", "legacy"] },
  };

  // Clone the element to avoid style conflicts
  const elementClone = element.cloneNode(true);
  elementClone.style.height = "auto";
  elementClone.style.overflow = "visible";
  document.body.appendChild(elementClone);

  html2pdf()
    .set(opt)
    .from(elementClone)
    .save()
    .then(() => {
      document.body.removeChild(elementClone);
    })
    .catch((error) => {
      console.error("PDF generation failed:", error);
      document.body.removeChild(elementClone);
    });
}

// ---------- Init & Event wiring ----------
addEduBtn.addEventListener("click", () => addEducation());
addExpBtn.addEventListener("click", () => addExperience());
addProjBtn.addEventListener("click", () => addProject());
clearBtn.addEventListener("click", clearAll);
downloadBtn.addEventListener("click", downloadPDF);

[
  "fullName",
  "email",
  "phone",
  "githubLink",
  "codingLink",
  "linkedinLink",
  "summary",
].forEach((id) => {
  const node = el(id);
  if (node) node.addEventListener("input", updatePreview);
});

// Initial starter items
addEducation();
addEducation();
addExperience();
addProject();
initializeSkillsSystem();
updatePreview();

