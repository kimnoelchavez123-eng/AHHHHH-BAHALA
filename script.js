"use strict";

/* =====================================================
   1. SCHOLARSHIP DATA
   Edit this list to change the cards and the popup
   content. Add a new object to add a new scholarship.
   ===================================================== */
const scholarships = [
  {
    id: "dost",
    theme: "dost", // matches .card-dost in the CSS (logo image)
    title: "DOST Scholarships",
    summary:
      "Offered through the Department of Science and Technology (DOST) for priority courses in science, technology, engineering, and mathematics (RA 7687, Merit, and JLSSS RA 10612).",
    overview:
      "Placeholder: a short description of the DOST scholarship programs goes here.",
    facts: {
      Agency: "Placeholder agency name",
      Coverage: "Placeholder tuition and allowance details",
      Deadline: "Placeholder date",
    },
    eligibility: [
      "Placeholder requirement one",
      "Placeholder requirement two",
      "Placeholder requirement three",
    ],
    howToApply: "Placeholder: step-by-step application instructions go here.",
  },
  {
    id: "ched",
    theme: "ched",
    title: "CHED Financial Assistance",
    summary:
      "The Commission on Higher Education provides Full and Half Merit scholarships, PESFA (Private Education Student Financial Assistance), Tulong Dunong, and UniFAST Tertiary Education Subsidy (TES) programs.",
    overview:
      "Placeholder: a short description of the CHED financial assistance programs goes here.",
    facts: {
      Agency: "Placeholder agency name",
      Coverage: "Placeholder tuition and allowance details",
      Deadline: "Placeholder date",
    },
    eligibility: [
      "Placeholder requirement one",
      "Placeholder requirement two",
      "Placeholder requirement three",
    ],
    howToApply: "Placeholder: step-by-step application instructions go here.",
  },
  {
    id: "cebu",
    theme: "cebu",
    title: "Cebu City College Scholarship Program",
    summary:
      "Provides financial aid, tuition grants, and allowances for poor but deserving residents of Cebu City enrolled in accredited local colleges and universities.",
    overview:
      "Placeholder: a short description of the Cebu City scholarship program goes here.",
    facts: {
      Agency: "Placeholder agency name",
      Coverage: "Placeholder tuition and allowance details",
      Deadline: "Placeholder date",
    },
    eligibility: [
      "Placeholder requirement one",
      "Placeholder requirement two",
      "Placeholder requirement three",
    ],
    howToApply: "Placeholder: step-by-step application instructions go here.",
  },
  {
    id: "tesda",
    theme: "tesda",
    title: "TESDA & Local Government Partnerships",
    summary:
      "Joint programs like the TESDA and University of Cebu partnership offer full diplomas in fields like Hospitality and Management with free tuition and living allowances.",
    overview:
      "Placeholder: a short description of the TESDA partnership programs goes here.",
    facts: {
      Agency: "Placeholder agency name",
      Coverage: "Placeholder tuition and allowance details",
      Deadline: "Placeholder date",
    },
    eligibility: [
      "Placeholder requirement one",
      "Placeholder requirement two",
      "Placeholder requirement three",
    ],
    howToApply: "Placeholder: step-by-step application instructions go here.",
  },
];

/* =====================================================
   2. SMALL HELPER FOR BUILDING ELEMENTS
   ===================================================== */
function el(tag, { className, text, attrs } = {}, children = []) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  if (attrs) {
    Object.entries(attrs).forEach(([key, value]) =>
      node.setAttribute(key, value)
    );
  }
  node.append(...children);
  return node;
}

/* =====================================================
   3. RENDER THE CARDS
   ===================================================== */
const cardsContainer = document.querySelector(".cards");

function createCard(item) {
  const button = el("button", {
    className: "card-open",
    text: item.title,
    attrs: {
      type: "button",
      "aria-haspopup": "dialog",
      "data-id": item.id,
    },
  });

  return el("article", { className: `card card-${item.theme}` }, [
    el("h2", {}, [button]),
    el("p", { text: item.summary }),
    el("p", {
      className: "card-cta",
      text: "View details",
      attrs: { "aria-hidden": "true" },
    }),
  ]);
}

cardsContainer.replaceChildren(...scholarships.map(createCard));

/* =====================================================
   4. BUILD THE POPUP CONTENT
   ===================================================== */
function createDetails(item) {
  const facts = el(
    "dl",
    { className: "facts" },
    Object.entries(item.facts).flatMap(([label, value]) => [
      el("dt", { text: label }),
      el("dd", { text: value }),
    ])
  );

  const eligibility = el(
    "ul",
    { className: "placeholder" },
    item.eligibility.map((line) => el("li", { text: line }))
  );

  return [
    el("h3", { text: "Overview" }),
    el("p", { className: "placeholder", text: item.overview }),
    el("h3", { text: "Quick facts" }),
    facts,
    el("h3", { text: "Eligibility" }),
    eligibility,
    el("h3", { text: "How to apply" }),
    el("p", { className: "placeholder", text: item.howToApply }),
    el("button", {
      className: "modal-action",
      text: "Apply (coming soon)",
      attrs: { type: "button", disabled: "" },
    }),
  ];
}

/* =====================================================
   5. POPUP OPEN / CLOSE
   ===================================================== */
const dialog = document.getElementById("scholarship-dialog");
const panel = dialog.querySelector(".modal-panel");
const titleEl = dialog.querySelector(".modal-title");
const bodyEl = dialog.querySelector(".modal-body");
const closeBtn = dialog.querySelector(".modal-close");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

let lastTrigger = null;
let closing = false;

function openModal(item, trigger) {
  lastTrigger = trigger;
  closing = false;

  titleEl.textContent = item.title;
  bodyEl.replaceChildren(...createDetails(item));
  panel.scrollTop = 0;

  dialog.showModal();
  document.documentElement.classList.add("modal-open");

  // reflow first so the browser sees the "closed" look,
  // then add the class that starts the smooth transition
  void dialog.offsetWidth;
  dialog.classList.add("is-open");
  closeBtn.focus();
}

function closeModal() {
  if (!dialog.open || closing) return;
  closing = true;
  dialog.classList.remove("is-open");

  const finish = () => {
    if (!dialog.open) return;
    dialog.close();
    document.documentElement.classList.remove("modal-open");
    closing = false;
    if (lastTrigger) lastTrigger.focus();
  };

  if (reduceMotion.matches) {
    finish();
    return;
  }

  panel.addEventListener(
    "transitionend",
    (e) => {
      if (e.target === panel && e.propertyName === "opacity") finish();
    },
    { once: true }
  );
  setTimeout(finish, 500); // safety net if transitionend never fires
}

/* =====================================================
   6. EVENTS
   ===================================================== */
// one listener for all cards (event delegation)
cardsContainer.addEventListener("click", (e) => {
  const button = e.target.closest(".card-open");
  if (!button) return;
  const item = scholarships.find((s) => s.id === button.dataset.id);
  if (item) openModal(item, button);
});

closeBtn.addEventListener("click", closeModal);

// click on the dark backdrop (outside the panel) closes it
dialog.addEventListener("click", (e) => {
  if (e.target === dialog) closeModal();
});

// Esc key: use the animated close instead of the instant default
dialog.addEventListener("cancel", (e) => {
  e.preventDefault();
  closeModal();
});