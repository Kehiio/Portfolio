/* ============================================================
   CONFIG — edit these to point at your own images/content.
   Paths are relative to index.html. Missing files fail silently
   and fall back to a placeholder panel, so it's safe to edit
   this before the images exist.
   ============================================================ */

const HERO_IMAGES = [
  "assets/home/ersp.jpg",
  "assets/home/pupper_group_pic.png",
  "assets/home/ERSP_complete.jpg",
];

const ABOUT_IMAGES = [
  "assets/about/headshot.jpg",
  // "assets/about/hiking.jpg",
  "assets/about/funny.jpg",
];

// Projects section to edit
const PROJECTS = [
  {
    title: "Orbbit - Anxiety Reduction Robot",
    role: "Independent Researcher for San Diego Undergraduate Tech Conference",
    description:
      "In this project, I re-created an open-source version of a robotics project originally made by Yale Researchers. It's purpose is to reduce stress by guiding users through deep breathing exercises. I also wrote a paper to be published at the SDUTC conference in October.",
    skills: ["C++", "ESP32", "Research"],
    images: [
      "assets/orbbit/BreathingDiagram.png",
      "assets/orbbit/Orbbt-digital-schem.png",
      "assets/orbbit/Orbbit_Closed.jpg",
    ],
  },
  {
    title: "Pupper Trivia Robot",
    role: "Coursework · 2025",
    description:
      "We created a trivia robot based on the Harry Potter books and ran a study on how anthropomorphism in robots can help students retain information. I led the autonomous navigation and anthropomorphic features.",
    skills: ["ROS2", "Python", "Research"],
    images: [
      "assets/puppertrivia/pupper_screen.jpg",
      "assets/puppertrivia/pupperpotter.png",
    ],
  },
];

const CROSSFADE_INTERVAL_MS = 4500;
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ============================================================
   THEME TOGGLE
   ============================================================ */
function setupTheme() {
  const root = document.documentElement;
  const toggle = document.getElementById("themeToggle");
  const stored = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  if (stored) {
    root.setAttribute("data-theme", stored);
  } else if (prefersDark) {
    root.setAttribute("data-theme", "dark");
  }

  toggle.addEventListener("click", () => {
    const current = root.getAttribute("data-theme") === "dark" ? "dark" : "light";
    const next = current === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  });
}

/* ============================================================
   LOADER
   ============================================================ */
function runLoader() {
  const loader = document.getElementById("loader");
  const fill = document.getElementById("loaderFill");

  if (reducedMotion) {
    loader.classList.add("loader-done");
    return;
  }

  let progress = 0;
  const duration = 900;
  const start = performance.now();

  function tick(now) {
    const elapsed = now - start;
    progress = Math.min(100, (elapsed / duration) * 100);
    fill.style.width = progress + "%";
    if (elapsed < duration) {
      requestAnimationFrame(tick);
    } else {
      setTimeout(() => loader.classList.add("loader-done"), 150);
    }
  }
  requestAnimationFrame(tick);
}

/* ============================================================
   IMAGE HELPERS
   ============================================================ */

// Resolves once per image: true if it loads, false if it 404s.
function checkImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = src;
  });
}

function emptyNote(text) {
  const div = document.createElement("div");
  div.className = "gallery-empty-note";
  div.textContent = text;
  return div;
}

function makeImg(src) {
  const img = document.createElement("img");
  img.src = src;
  img.alt = "";
  return img;
}

/* ============================================================
   HOME CROSSFADE GALLERY
   ============================================================ */
async function buildHeroGallery() {
  const container = document.getElementById("heroGallery");
  const results = await Promise.all(HERO_IMAGES.map(checkImage));
  const valid = HERO_IMAGES.filter((_, i) => results[i]);

  if (valid.length === 0) {
    container.appendChild(emptyNote("Add images to assets/home/ to populate this gallery"));
    return;
  }

  valid.forEach((src, i) => {
    const img = makeImg(src);
    if (i === 0) img.classList.add("is-visible");
    container.appendChild(img);
  });

  if (valid.length < 2 || reducedMotion) return;

  let current = 0;
  const imgs = container.querySelectorAll("img");
  setInterval(() => {
    imgs[current].classList.remove("is-visible");
    current = (current + 1) % imgs.length;
    imgs[current].classList.add("is-visible");
  }, CROSSFADE_INTERVAL_MS);
}

/* ============================================================
   ABOUT GALLERY GRID
   ============================================================ */
async function buildAboutGallery() {
  const grid = document.getElementById("aboutGalleryGrid");
  const results = await Promise.all(ABOUT_IMAGES.map(checkImage));
  const valid = ABOUT_IMAGES.filter((_, i) => results[i]);

  if (valid.length === 0) {
    grid.appendChild(emptyNote("Add images to assets/about/ to populate this gallery"));
    return;
  }

  valid.forEach((src) => grid.appendChild(makeImg(src)));
}

/* ============================================================
   PROJECT CARDS
   ============================================================ */
async function buildProjects() {
  const list = document.getElementById("projectList");

  for (const project of PROJECTS) {
    const card = document.createElement("article");
    card.className = "project-card";

    const head = document.createElement("div");
    head.className = "project-head";
    head.innerHTML = `
      <h3 class="project-title">${project.title}</h3>
      <span class="project-role">${project.role}</span>
    `;
    card.appendChild(head);

    if (project.description) {
      const desc = document.createElement("p");
      desc.className = "project-desc";
      desc.textContent = project.description;
      card.appendChild(desc);
    }

    if (project.skills && project.skills.length) {
      const tagList = document.createElement("ul");
      tagList.className = "skill-tags";
      project.skills.forEach((skill) => {
        const li = document.createElement("li");
        li.textContent = skill;
        tagList.appendChild(li);
      });
      card.appendChild(tagList);
    }

    const gallery = document.createElement("div");
    gallery.className = "project-gallery";
    const results = await Promise.all(project.images.map(checkImage));
    const valid = project.images.filter((_, i) => results[i]);

    if (valid.length === 0) {
      gallery.appendChild(emptyNote("Add images to populate this project's gallery"));
    } else {
      valid.forEach((src) => gallery.appendChild(makeImg(src)));
    }
    card.appendChild(gallery);

    list.appendChild(card);
  }
}

/* ============================================================
   NAV — smooth scroll + active-section highlighting
   ============================================================ */
function setupNav() {
  const buttons = document.querySelectorAll("[data-target]");
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = document.getElementById(btn.dataset.target);
      if (target) target.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
    });
  });

  const navButtons = document.querySelectorAll(".nav-btn");
  const sections = ["home", "about", "projects"]
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navButtons.forEach((b) => b.classList.toggle("active", b.dataset.target === entry.target.id));
        }
      });
    },
    { rootMargin: "-40% 0px -55% 0px" }
  );

  sections.forEach((s) => observer.observe(s));
}

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  setupTheme();
  runLoader();
  setupNav();
  buildHeroGallery();
  buildAboutGallery();
  buildProjects();
});