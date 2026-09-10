/* ============================================================
   CONFIG — edit these to point at your own images/content.
   Paths are relative to index.html. Missing files fail silently
   and fall back to a placeholder panel, so it's safe to edit
   this before the images exist.
   ============================================================ */

const HERO_IMAGES = [
  "assets/home/1.jpg",
  "assets/home/2.jpg",
  "assets/home/3.jpg",
];

const ABOUT_IMAGES = [
  "assets/about/1.jpg",
  "assets/about/2.jpg",
  "assets/about/3.jpg",
  "assets/about/4.jpg",
];

const PROJECTS = [
  {
    title: "Project title one",
    role: "Personal project · 2025",
    description:
      "One or two sentences on what this project is, the problem it solves, and your role in building it.",
    skills: ["Solidworks", "C++", "PID control"],
    images: [
      "assets/projects/project1/1.jpg",
      "assets/projects/project1/2.jpg",
      "assets/projects/project1/3.jpg",
    ],
  },
  {
    title: "Project title two",
    role: "Coursework · 2024",
    description:
      "One or two sentences on what this project is, the problem it solves, and your role in building it.",
    skills: ["Python", "Sensor fusion", "ROS"],
    images: [
      "assets/projects/project2/1.jpg",
      "assets/projects/project2/2.jpg",
    ],
  },
  {
    title: "Project title three",
    role: "Team project · 2024",
    description:
      "One or two sentences on what this project is, the problem it solves, and your role in building it.",
    skills: ["Onshape", "Manufacturing", "Team lead"],
    images: [
      "assets/projects/project3/1.jpg",
      "assets/projects/project3/2.jpg",
      "assets/projects/project3/3.jpg",
    ],
  },
];

const CROSSFADE_INTERVAL_MS = 4500;
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ============================================================
   LOADER
   ============================================================ */
function runLoader() {
  const loader = document.getElementById("loader");
  const fill = document.getElementById("loaderFill");
  const pct = document.getElementById("loaderPct");

  if (reducedMotion) {
    loader.classList.add("loader-done");
    return;
  }

  let progress = 0;
  const duration = 1400;
  const start = performance.now();

  function tick(now) {
    const elapsed = now - start;
    progress = Math.min(100, Math.round((elapsed / duration) * 100));
    fill.style.width = progress + "%";
    pct.textContent = progress + "%";
    if (elapsed < duration) {
      requestAnimationFrame(tick);
    } else {
      setTimeout(() => loader.classList.add("loader-done"), 200);
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

// Wraps an <img> in a .photo div — the wrapper is what carries the
// amber/teal duotone grade (see .photo::after in styles.css), so any
// image dropped into the site inherits the same cinematic look.
function makePhoto(src) {
  const wrap = document.createElement("div");
  wrap.className = "photo";
  const img = document.createElement("img");
  img.src = src;
  img.alt = "";
  wrap.appendChild(img);
  return wrap;
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
    const photo = makePhoto(src);
    if (i === 0) photo.classList.add("is-visible");
    container.appendChild(photo);
  });

  if (valid.length < 2 || reducedMotion) return;

  let current = 0;
  const photos = container.querySelectorAll(".photo");
  setInterval(() => {
    photos[current].classList.remove("is-visible");
    current = (current + 1) % photos.length;
    photos[current].classList.add("is-visible");
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

  valid.forEach((src) => {
    grid.appendChild(makePhoto(src));
  });
}

/* ============================================================
   PROJECT CARDS
   ============================================================ */
function frameCorners() {
  const frag = document.createDocumentFragment();
  ["tl", "tr", "bl", "br"].forEach((pos) => {
    const span = document.createElement("span");
    span.className = "corner " + pos;
    frag.appendChild(span);
  });
  return frag;
}

async function buildProjects() {
  const list = document.getElementById("projectList");

  for (const project of PROJECTS) {
    const card = document.createElement("article");
    card.className = "project-card";
    card.appendChild(frameCorners());

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
      gallery.appendChild(emptyNote(`Add images to populate this project's gallery`));
    } else {
      valid.forEach((src) => {
        gallery.appendChild(makePhoto(src));
      });
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
  runLoader();
  setupNav();
  buildHeroGallery();
  buildAboutGallery();
  buildProjects();
});