(function () {
  const state = {
    unit: "offense",
    formationId: "base-spread-2x2",
    depthRank: 0,
    view: "zoomed",
    selectedSpot: null,
    overrides: {},
  };

  const fieldEl = document.getElementById("field");
  const markingsEl = document.getElementById("field-markings");
  const playersEl = document.getElementById("field-players");
  const panelEl = document.getElementById("detail-panel");
  const formationSelect = document.getElementById("formation-select");
  const loadError = document.getElementById("load-error");

  function lastName(name) {
    return (name || "").split(",")[0];
  }

  function dash(value) {
    return value ? value : "—";
  }

  function formationsFor(unit) {
    return FORMATIONS[unit];
  }

  function currentFormation() {
    return formationsFor(state.unit)[state.formationId];
  }

  function overrideKey(spotIndex) {
    return state.unit + "|" + state.formationId + "|" + spotIndex;
  }

  function playerForSpot(spot, spotIndex) {
    const override = state.overrides[overrideKey(spotIndex)];
    if (override) return override;
    return Roster.getPlayerAt(state.unit, spot.slot, state.depthRank);
  }

  function alignLabel(spot) {
    return spot.align || spot.slot;
  }

  function fillFormationSelect() {
    const list = formationsFor(state.unit);
    const ids = Object.keys(list);
    if (!list[state.formationId]) state.formationId = ids[0];
    formationSelect.replaceChildren();
    ids.forEach(function (id) {
      const opt = document.createElement("option");
      opt.value = id;
      opt.textContent = list[id].name;
      if (id === state.formationId) opt.selected = true;
      formationSelect.appendChild(opt);
    });
  }

  function setActive(selector, attr, value) {
    document.querySelectorAll(selector).forEach(function (btn) {
      btn.classList.toggle("is-active", btn.getAttribute(attr) === value);
    });
  }

  function renderFieldChrome() {
    fieldEl.classList.toggle("field--zoomed", state.view === "zoomed");
    fieldEl.classList.toggle("field--full", state.view === "full");
    fieldEl.classList.toggle("field--offense", state.unit === "offense");
    fieldEl.classList.toggle("field--defense", state.unit === "defense");
    Field.renderMarkings(markingsEl, state.view);
  }

  function renderTokens() {
    const formation = currentFormation();
    playersEl.replaceChildren();

    formation.spots.forEach(function (spot, index) {
      const player = playerForSpot(spot, index);
      if (!player) return;

      const pos = Field.yardsToPercent(spot.x, spot.depth, state.view);
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "token" + (state.selectedSpot === index ? " is-selected" : "");
      btn.style.left = pos.left + "%";
      btn.style.top = pos.top + "%";
      btn.dataset.spot = String(index);
      btn.setAttribute(
        "aria-label",
        "#" + player.number + " " + player.name + ", " + alignLabel(spot)
      );
      btn.innerHTML =
        '<span class="token__disc">' +
        player.number +
        "</span>" +
        '<span class="token__meta">' +
        '<span class="token__name">' +
        lastName(player.name) +
        "</span>" +
        '<span class="token__align">' +
        alignLabel(spot) +
        "</span>" +
        "</span>";
      btn.addEventListener("click", function () {
        state.selectedSpot = index;
        renderTokens();
        renderPanel();
      });
      playersEl.appendChild(btn);
    });

    const t = [...playersEl.children];
    for (let k = 0; k < 8; k++) t.forEach(function (A, i) { t.forEach(function (B, j) { if (j <= i) return; var a = A.firstElementChild.getBoundingClientRect(), b = B.firstElementChild.getBoundingClientRect(), dx = a.left + a.width / 2 - (b.left + b.width / 2), dy = a.top + a.height / 2 - (b.top + b.height / 2), need = (a.width + b.width) / 2 + 4; if (Math.hypot(dx, dy) >= need) return; var n = (Math.sqrt(Math.max(0, need * need - dy * dy)) - Math.abs(dx)) / 2 * (dx === 0 ? 1 : Math.sign(dx)); A.style.transform = "translate(calc(-50% + " + (A._ox = (A._ox || 0) + n) + "px), -50%)"; B.style.transform = "translate(calc(-50% + " + (B._ox = (B._ox || 0) - n) + "px), -50%)"; }); });
  }

  function renderPanel() {
    if (state.selectedSpot == null) {
      panelEl.innerHTML = '<p class="panel__empty">Select a player on the field</p>';
      return;
    }

    const formation = currentFormation();
    const spot = formation.spots[state.selectedSpot];
    if (!spot) {
      state.selectedSpot = null;
      renderPanel();
      return;
    }

    const player = playerForSpot(spot, state.selectedSpot);
    const backups = Roster.getPlayers(state.unit, spot.slot);

    const backupHtml = backups
      .map(function (p) {
        const current = p === player || (p.number === player.number && p.name === player.name);
        return (
          '<button type="button" class="backup' +
          (current ? " is-current" : "") +
          '" data-number="' +
          p.number +
          '" data-name="' +
          p.name.replace(/"/g, "&quot;") +
          '">' +
          '<span class="backup__num">' +
          p.number +
          "</span>" +
          '<span class="backup__name">' +
          p.name +
          "</span>" +
          '<span class="backup__class">' +
          p.class +
          "</span>" +
          "</button>"
        );
      })
      .join("");

    panelEl.innerHTML =
      '<h2 class="panel__title">' +
      '<span class="panel__jersey">#' +
      player.number +
      "</span>" +
      '<span class="panel__name">' +
      player.name +
      "</span>" +
      "</h2>" +
      '<p class="panel__class">' +
      player.class +
      " · " +
      spot.slot +
      "</p>" +
      '<p class="panel__align">Lined up as <strong>' +
      alignLabel(spot) +
      "</strong></p>" +
      "<dl class=\"bio\">" +
      "<div><dt>Height</dt><dd>" +
      dash(player.height) +
      "</dd></div>" +
      "<div><dt>Weight</dt><dd>" +
      dash(player.weight) +
      "</dd></div>" +
      "<div><dt>Age</dt><dd>" +
      dash(player.age) +
      "</dd></div>" +
      "<div><dt>High school</dt><dd>" +
      dash(player.highSchool) +
      "</dd></div>" +
      "</dl>" +
      '<div class="panel__backups">' +
      "<h2>Depth at " +
      spot.slot +
      "</h2>" +
      backupHtml +
      "</div>";

    panelEl.querySelectorAll(".backup").forEach(function (btn) {
      btn.addEventListener("click", function () {
        const number = Number(btn.dataset.number);
        const name = btn.dataset.name;
        const picked = backups.find(function (p) {
          return p.number === number && p.name === name;
        });
        if (!picked) return;
        state.overrides[overrideKey(state.selectedSpot)] = picked;
        renderTokens();
        renderPanel();
      });
    });
  }

  function render() {
    fillFormationSelect();
    setActive("[data-unit]", "data-unit", state.unit);
    setActive("[data-depth]", "data-depth", String(state.depthRank));
    setActive("[data-view]", "data-view", state.view);
    renderFieldChrome();
    renderTokens();
    renderPanel();
  }

  function bindControls() {
    document.querySelectorAll("[data-unit]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        const unit = btn.getAttribute("data-unit");
        if (unit === state.unit) return;
        state.unit = unit;
        state.formationId = Object.keys(formationsFor(unit))[0];
        state.selectedSpot = null;
        state.overrides = {};
        render();
      });
    });

    formationSelect.addEventListener("change", function () {
      state.formationId = formationSelect.value;
      state.selectedSpot = null;
      render();
    });

    document.querySelectorAll("[data-depth]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        state.depthRank = Number(btn.getAttribute("data-depth"));
        state.overrides = {};
        render();
      });
    });

    document.querySelectorAll("[data-view]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        state.view = btn.getAttribute("data-view");
        render();
      });
    });
  }

  bindControls();

  try {
    Roster.load();
    render();
  } catch (err) {
    loadError.hidden = false;
    console.error(err);
  }
})();
