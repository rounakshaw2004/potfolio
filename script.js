const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

document.addEventListener("DOMContentLoaded", () => {
  renderSkills();
  renderProjects();
  renderCertifications();
  renderSocials();
  setupNavigation();
  setupTheme();
  setupScrollEffects();
  setupProjectModal();
  setupContact();
  $("#year").textContent = new Date().getFullYear();
});

function renderSkills() {
  const grid = $("#skillGrid");
  grid.innerHTML = portfolioData.skills.map(skill => `
    <article class="skill-card reveal">
      <div class="skill-icon">${escapeHTML(skill.icon)}</div>
      <div><h3>${escapeHTML(skill.name)}</h3><p>${escapeHTML(skill.category)}</p></div>
    </article>
  `).join("");
}

function renderProjects() {
  const grid = $("#projectGrid");
  grid.innerHTML = portfolioData.projects.map((project, index) => `
    <article class="project-card reveal" data-index="${index}">
      <div class="project-number">0${index + 1}</div>
      <span class="card-kicker">${escapeHTML(project.type)}</span>
      <h3>${escapeHTML(project.title)}</h3>
      <p>${escapeHTML(project.description)}</p>
      <div class="tags">${project.tags.map(tag => `<span>${escapeHTML(tag)}</span>`).join("")}</div>
      <button class="project-open" data-project="${index}">Explore project <span>↗</span></button>
    </article>
  `).join("");
}

function renderCertifications() {
  const grid = $("#certGrid");
  grid.innerHTML = portfolioData.certifications.map(cert => `
    <article class="cert-card reveal">
      <div class="cert-icon">✓</div>
      <div>
        <span class="card-kicker">${escapeHTML(cert.issuer)}</span>
        <h3>${escapeHTML(cert.name)}</h3>
        <p>${escapeHTML(cert.date)}</p>
      </div>
      ${cert.url && cert.url !== "#" ? `<a class="text-link" href="${cert.url}" target="_blank" rel="noopener noreferrer">Verify ↗</a>` : ""}
    </article>
  `).join("");
}

function socialItem(label, href, icon, external = true) {
  const valid = href && !href.includes("ADD_YOUR_");
  return valid ? `<a class="social-link" href="${href}" ${external ? 'target="_blank" rel="noopener noreferrer"' : ""} aria-label="${label}" title="${label}">${icon}</a>` : "";
}

function renderSocials() {
  const icons = {
    whatsapp: "◉",
    linkedin: "in",
    instagram: "◎",
    github: "⌘"
  };
  const markup = [
    socialItem("WhatsApp", portfolioData.social.whatsapp, icons.whatsapp),
    socialItem("LinkedIn", portfolioData.social.linkedin, icons.linkedin),
    socialItem("Instagram", portfolioData.social.instagram, icons.instagram),
    socialItem("GitHub", portfolioData.social.github, icons.github)
  ].join("");

  $("#heroSocials").innerHTML = markup;
  $("#footerSocials").innerHTML = markup;

  $("#heroWhatsapp").href = portfolioData.social.whatsapp;

  $("#contactActions").innerHTML = `
    ${socialItem("WhatsApp Me", portfolioData.social.whatsapp, "WhatsApp")}
    ${socialItem("Connect on LinkedIn", portfolioData.social.linkedin, "LinkedIn")}
    ${socialItem("Follow on Instagram", portfolioData.social.instagram, "Instagram")}
    ${socialItem("View GitHub", portfolioData.social.github, "GitHub")}
    <a class="contact-action" href="mailto:${portfolioData.social.email}">Send Email <span>↗</span></a>
  `;
}

function setupNavigation() {
  const toggle = $("#menuToggle");
  const nav = $("#navLinks");

  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.textContent = open ? "×" : "☰";
  });

  $$("#navLinks a").forEach(link => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.textContent = "☰";
    });
  });
}

function setupTheme() {
  const button = $("#themeToggle");
  const saved = localStorage.getItem("theme");
  if (saved === "light") document.body.classList.add("light");

  button.addEventListener("click", () => {
    document.body.classList.toggle("light");
    localStorage.setItem("theme", document.body.classList.contains("light") ? "light" : "dark");
  });
}

function setupScrollEffects() {
  const progress = $("#progressBar");
  const top = $("#backTop");

  window.addEventListener("scroll", () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = `${max ? (window.scrollY / max) * 100 : 0}%`;
    top.classList.toggle("show", window.scrollY > 500);
  }, { passive: true });

  top.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  }, { threshold: 0.12 });

  $$(".reveal").forEach(el => observer.observe(el));
}

function setupProjectModal() {
  const modal = $("#projectModal");
  const close = $("#modalClose");

  document.addEventListener("click", event => {
    const button = event.target.closest("[data-project]");
    if (!button) return;

    const project = portfolioData.projects[Number(button.dataset.project)];
    $("#modalTitle").textContent = project.title;
    $("#modalDescription").textContent = project.description;
    $("#modalTags").innerHTML = project.tags.map(t => `<span>${escapeHTML(t)}</span>`).join("");
    $("#modalLinks").innerHTML = `
      ${project.links.github && !project.links.github.includes("ADD_") ? `<a class="btn btn-secondary" href="${project.links.github}" target="_blank" rel="noopener noreferrer">GitHub ↗</a>` : ""}
      ${project.links.demo && project.links.demo !== "#" && !project.links.demo.includes("ADD_") ? `<a class="btn btn-primary" href="${project.links.demo}" target="_blank" rel="noopener noreferrer">Live Demo ↗</a>` : ""}
    `;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
  });

  const closeModal = () => {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
  };

  close.addEventListener("click", closeModal);
  modal.addEventListener("click", e => { if (e.target === modal) closeModal(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });
}

function setupContact() {
  // Contact links are generated from portfolioData.
}

function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}