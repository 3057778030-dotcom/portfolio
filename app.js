(() => {
  const data = window.PORTFOLIO_DATA;
  if (!data) return;

  const page = document.body.dataset.page;
  if (page === "home") initHome();
  if (page === "detail") initDetail();

  function initHome() {
    renderProjectList();
    renderAwards();
    renderCarousel();
    renderModal();
    wireTimeline();
  }

  function renderProjectList() {
    const wrap = document.getElementById("project-list");
    if (!wrap) return;
    wrap.innerHTML = data.projects
      .map(
        (project, index) => `
          <button type="button" class="project-item fade-in delay-${Math.min(index + 1, 5)}" data-open-project="${project.slug}">
            <span>
              <strong>${project.title}</strong>
              <span>${project.category}</span>
            </span>
            <span>Open</span>
          </button>`
      )
      .join("");

    wrap.querySelectorAll("[data-open-project]").forEach((button) => {
      button.addEventListener("click", () => openModal(button.dataset.openProject));
    });
  }

  function renderAwards() {
    const wrap = document.getElementById("awards-grid");
    if (!wrap) return;
    wrap.innerHTML = data.awards
      .map((item, index) => {
        const media = item.type === "pdf"
          ? `<div class="snippet" style="min-height: 280px; display: grid; align-content: center; justify-items: center; text-align: center;">
               <strong style="letter-spacing: .18em; text-transform: uppercase; color: var(--muted-2); font-size: 11px;">PDF</strong>
               <p style="margin-top: 10px;">${item.detail}</p>
               <a class="award-link" href="${item.image}" target="_blank" rel="noreferrer">打开 PDF</a>
             </div>`
          : `<img src="${item.image}" alt="${item.title}" loading="lazy" style="height: 260px;" />`;

        return `
          <article class="award-card fade-in delay-${Math.min(index + 1, 5)}">
            ${media}
            <h4>${item.title}</h4>
            <p>${item.detail}</p>
            ${item.type !== "pdf" ? `<a class="award-link" href="${item.image}" target="_blank" rel="noreferrer">打开原图</a>` : ""}
          </article>`;
      })
      .join("");
  }

  function renderCarousel() {
    const orbit = document.getElementById("carousel-orbit");
    const stage = document.getElementById("carousel-stage");
    if (!orbit || !stage) return;

    const orbitStep = 360 / data.projects.length;
    const getRadius = () => Math.min(250, Math.max(100, stage.clientWidth * 0.26));
    let radius = getRadius();
    let angle = -25;

    orbit.innerHTML = data.projects
      .map((project, index) => {
        const turn = index * orbitStep;
        return `
          <article class="carousel-card ${index === 0 ? "is-active" : ""}" data-project="${project.slug}" role="button" tabindex="0" aria-label="预览${project.title}" style="--angle:${turn}deg; --radius:${radius}px;">
            <figure>
              <img src="${project.coverImage}" alt="${project.title}" />
              <figcaption>
                <h4>${project.title}</h4>
                <p>${project.summary}</p>
              </figcaption>
            </figure>
          </article>`;
      })
      .join("");

    const cards = [...orbit.querySelectorAll(".carousel-card")];
    const list = [...document.querySelectorAll(".project-item")];

    const sync = () => {
      cards.forEach((card, index) => {
        const current = angle + index * orbitStep;
        card.style.setProperty("--angle", `${current}deg`);
        card.style.setProperty("--radius", `${radius}px`);
        const normalized = ((current % 360) + 360) % 360;
        const distance = Math.min(normalized, 360 - normalized);
        const active = distance <= orbitStep / 2;
        card.classList.toggle("is-active", active);
        if (active) {
          list.forEach((item) => item.classList.toggle("is-active", item.dataset.openProject === card.dataset.project));
        }
      });
    };

    sync();

    document.getElementById("carousel-prev")?.addEventListener("click", () => {
      angle += orbitStep;
      sync();
    });
    document.getElementById("carousel-next")?.addEventListener("click", () => {
      angle -= orbitStep;
      sync();
    });

    stage.addEventListener(
      "wheel",
      (event) => {
        angle += event.deltaY * 0.06;
        sync();
      },
      { passive: true }
    );

    cards.forEach((card) => {
      card.addEventListener("click", () => openModal(card.dataset.project));
      card.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openModal(card.dataset.project);
        }
      });
    });

    let ticking = false;
    window.addEventListener("resize", () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        radius = getRadius();
        sync();
        ticking = false;
      });
    });
  }

  function renderModal() {
    const modal = document.getElementById("project-modal");
    if (!modal) return;
    modal.addEventListener("click", (event) => {
      if (event.target === modal || event.target.hasAttribute("data-close-modal")) {
        closeModal();
      }
    });
    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeModal();
      if (event.key === "Tab" && modal.classList.contains("is-open")) {
        const focusable = [...modal.querySelectorAll("button, a[href]")];
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    });
    modal.querySelector('a[href="#awards"]')?.addEventListener("click", closeModal);
  }

  let modalTrigger = null;

  function openModal(slug) {
    const modal = document.getElementById("project-modal");
    const project = data.projects.find((item) => item.slug === slug) || data.projects[0];
    if (!modal || !project) return;

    document.getElementById("modal-title").textContent = project.title;
    document.getElementById("modal-summary").textContent = project.summary;
    document.getElementById("modal-fit").textContent = project.fit;
    document.getElementById("modal-live").href = project.livePath;

    const tags = document.getElementById("modal-tags");
    tags.innerHTML = project.tags.map((tag) => `<span class="tag">${tag}</span>`).join("");

    const notes = document.getElementById("modal-notes");
    notes.innerHTML = project.modalNotes
      .map(
        (note) => `
        <div class="project-item" style="cursor: default;">
          <span>
            <strong>${note}</strong>
            <span>${project.alias}</span>
          </span>
        </div>`
      )
      .join("");

    const snippets = document.getElementById("modal-snippets");
    snippets.innerHTML = project.snippets
      .map(
        (item) => `
        <div class="snippet">
          <strong>${item.label}</strong>
          <p>${escapeHtml(item.text)}</p>
        </div>`
      )
      .join("");

    const mosaic = document.getElementById("modal-mosaic");
    mosaic.innerHTML = [project.heroImage, project.coverImage]
      .map((src) => `<a href="${src}" target="_blank" rel="noopener noreferrer" aria-label="打开${project.title}截图原图"><img src="${src}" alt="${project.title}" /></a>`)
      .join("");

    modalTrigger = document.activeElement;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.querySelectorAll("body > header, body > main, body > footer").forEach((element) => { element.inert = true; });
    document.body.style.overflow = "hidden";
    modal.querySelector("[data-close-modal]").focus();
  }

  function closeModal() {
    const modal = document.getElementById("project-modal");
    if (!modal || !modal.classList.contains("is-open")) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    document.querySelectorAll("body > header, body > main, body > footer").forEach((element) => { element.inert = false; });
    modalTrigger?.focus();
  }

  function wireTimeline() {
    const cards = [...document.querySelectorAll(".timeline-card")];
    if (!cards.length) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => entry.target.classList.toggle("is-active", entry.isIntersecting));
    }, { rootMargin: "-15% 0px -15% 0px", threshold: 0.3 });
    cards.forEach((card) => observer.observe(card));
  }

  function initDetail() {
    const project = readProjectFromQuery();
    if (!project) return;
    document.body.classList.toggle("case-study", project.layout === "case-study");

    document.title = `${project.title} · 邱怡青作品集`;
    document.querySelector('meta[name="description"]').content = project.summary;
    const title = document.getElementById("detail-title");
    const desc = document.getElementById("detail-desc");
    const fit = document.getElementById("detail-fit");
    const live = document.getElementById("detail-live");
    const galleryHeading = document.getElementById("gallery-heading");
    const galleryCopy = document.getElementById("gallery-copy");
    const facts = document.getElementById("detail-facts");
    const grid = document.getElementById("gallery-grid");

    title.textContent = project.title;
    desc.textContent = project.summary;
    fit.textContent = project.fit;
    live.href = "index.html#works";
    live.textContent = "View Works";
    galleryHeading.textContent = project.alias;
    galleryCopy.textContent = project.galleryIntro || "查看项目截图、实现方法与相关证明。点击截图可在新标签页查看原图。";

    const projectFacts = project.facts || [
      { label: "Category", value: project.category },
      { label: "Skills", value: project.tags.join(" / ") },
      { label: "Focus", value: "海外用户增长" },
      { label: "Materials", value: "项目截图与方法" },
    ];
    facts.innerHTML = projectFacts.map((fact) => `<div class="fact"><span>${escapeHtml(fact.label)}</span><strong>${escapeHtml(fact.value)}</strong></div>`).join("");

    grid.innerHTML = project.detailCards
      .map((card) => {
        if (card.kind === "document") {
          return `
            <article class="gallery-card document-card ${card.span}">
              <div class="copy">
                <h5>${escapeHtml(card.title)}</h5>
                <p>${escapeHtml(card.copy)}</p>
                <a class="button secondary" href="${card.href}" target="_blank" rel="noopener noreferrer">${escapeHtml(card.label)}</a>
                <a class="award-link" href="${card.href}" download>下载 Markdown 文件</a>
              </div>
            </article>`;
        }
        if (card.kind === "image" || card.kind === "proof") {
          return `
            <article class="gallery-card ${card.span}">
              <a class="gallery-image-link" href="${card.src}" target="_blank" rel="noopener noreferrer" aria-label="打开${card.title || project.title}截图原图">
                <img src="${card.src}" alt="${card.caption}" loading="lazy" style="height:${galleryMediaHeight(card.span)}px;" />
              </a>
              <div class="copy">
                <h5>${card.title || (card.kind === "proof" ? "Proof" : "Visual")}</h5>
                <p>${card.caption}</p>
              </div>
            </article>`;
        }
        if (card.kind === "code") {
          return `
            <article class="gallery-card ${card.span}">
              <div class="copy">
                <h5>${card.title}</h5>
                <pre>${escapeHtml(card.copy)}</pre>
              </div>
            </article>`;
        }
        return `
          <article class="gallery-card ${card.span}">
            <div class="copy">
              <h5>${card.title}</h5>
              <p>${card.copy}</p>
            </div>
          </article>`;
      })
      .join("");

    if (project.relatedProjects?.length) {
      const related = document.createElement("nav");
      related.className = "related-projects";
      related.setAttribute("aria-label", "相关项目");
      related.innerHTML = project.relatedProjects.map((item) => `<a class="button secondary" href="detail.html?project=${item.slug}">${escapeHtml(item.title)}</a>`).join("");
      grid.after(related);
    }

    if (project.layout !== "case-study") attachHorizontalInertia(document.getElementById("detail-shell"));
  }

  function readProjectFromQuery() {
    const params = new URLSearchParams(location.search);
    const slug = params.get("project") || "ad-automation";
    return data.projects.find((project) => project.slug === slug) || data.projects[0];
  }

  function attachHorizontalInertia(container) {
    if (!container || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let velocity = 0;
    let raf = 0;

    const step = () => {
      if (Math.abs(velocity) < 0.25) {
        raf = 0;
        velocity = 0;
        return;
      }
      container.scrollLeft += velocity;
      velocity *= 0.92;
      raf = requestAnimationFrame(step);
    };

    container.addEventListener(
      "wheel",
      (event) => {
        if (window.innerWidth < 1180) return;
        event.preventDefault();
        velocity += event.deltaY * 0.85 + event.deltaX * 0.35;
        if (!raf) raf = requestAnimationFrame(step);
      },
      { passive: false }
    );
  }

  function galleryMediaHeight(span) {
    if (span === "wide") return 330;
    if (span === "tall") return 520;
    if (span === "medium") return 400;
    return 280;
  }

  function escapeHtml(value) {
    return value
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }
})();
