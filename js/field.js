(function (global) {
  const FIELD = {
    width: 53.333,
    playingLength: 100,
    endZone: 10,
    totalLength: 120,
    hashes: [20, 33.333],
    losYard: 30,
  };

  function losAbs() {
    return FIELD.endZone + FIELD.losYard;
  }

  function playerAbsY(depth) {
    return losAbs() - depth;
  }

  function getView(mode) {
    const los = losAbs();
    if (mode === "full") {
      return { bottom: 0, top: FIELD.totalLength };
    }
    return { bottom: los - 27, top: los + 8 };
  }

  function inView(absY, view, pad) {
    const slack = pad || 0;
    return absY >= view.bottom - slack && absY <= view.top + slack;
  }

  function yPercent(absY, view) {
    return ((view.top - absY) / (view.top - view.bottom)) * 100;
  }

  function xPercent(x) {
    return (x / FIELD.width) * 100;
  }

  function yardsToPercent(x, depth, viewMode) {
    const view = getView(viewMode);
    return {
      left: xPercent(x),
      top: yPercent(playerAbsY(depth), view),
    };
  }

  function displayYardNumber(fromOwnGoal) {
    if (fromOwnGoal === 50) return "50";
    return String(fromOwnGoal <= 50 ? fromOwnGoal : 100 - fromOwnGoal);
  }

  function el(tag, className, styles) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (styles) Object.assign(node.style, styles);
    return node;
  }

  function renderMarkings(container, viewMode) {
    container.replaceChildren();
    const view = getView(viewMode);
    const viewH = view.top - view.bottom;

    const leftSideline = el("div", "sideline sideline--left");
    const rightSideline = el("div", "sideline sideline--right");
    container.append(leftSideline, rightSideline);

    if (viewMode === "full") {
      const own = el("div", "end-zone end-zone--own", {
        top: yPercent(FIELD.endZone, view) + "%",
        height: (FIELD.endZone / viewH) * 100 + "%",
      });
      own.innerHTML = '<span class="end-zone__text">CLEMSON</span>';

      const opp = el("div", "end-zone end-zone--opp", {
        top: yPercent(FIELD.totalLength, view) + "%",
        height: (FIELD.endZone / viewH) * 100 + "%",
      });
      opp.innerHTML = '<span class="end-zone__text">TIGERS</span>';
      container.append(own, opp);
    }

    for (let g = 0; g < 100; g += 5) {
      if (Math.floor(g / 5) % 2 !== 1) continue;
      const absBottom = FIELD.endZone + g;
      const absTop = absBottom + 5;
      const clippedBottom = Math.max(absBottom, view.bottom);
      const clippedTop = Math.min(absTop, view.top);
      if (clippedTop <= clippedBottom) continue;
      container.append(
        el("div", "yard-band", {
          top: yPercent(clippedTop, view) + "%",
          height: ((clippedTop - clippedBottom) / viewH) * 100 + "%",
        })
      );
    }

    for (let g = 0; g <= 100; g += 1) {
      const absY = FIELD.endZone + g;
      if (!inView(absY, view, 0.05)) continue;

      const top = yPercent(absY, view) + "%";

      if (g % 5 === 0) {
        container.append(
          el("div", "yard-line" + (g % 10 === 0 ? " yard-line--major" : ""), { top })
        );
      }

      FIELD.hashes.forEach(function (hx) {
        container.append(
          el("div", "hash", { top: top, left: xPercent(hx) + "%" })
        );
      });
      container.append(el("div", "hash hash--side", { top: top, left: "1.4%" }));
      container.append(el("div", "hash hash--side", { top: top, left: "98.6%" }));

      if (g > 0 && g < 100 && g % 10 === 0) {
        const num = displayYardNumber(g);
        const inset = viewMode === "full" ? "7%" : "8.5%";
        const left = el("div", "yard-number", { top: top, left: inset });
        const right = el("div", "yard-number", { top: top, left: 100 - parseFloat(inset) + "%" });
        left.textContent = num;
        right.textContent = num;
        container.append(left, right);
      }
    }

    const losTop = yPercent(losAbs(), view) + "%";
    container.append(el("div", "los", { top: losTop }));
    container.append(
      el("div", "ball", {
        top: losTop,
        left: xPercent(FIELD.width / 2) + "%",
      })
    );
  }

  global.Field = {
    FIELD: FIELD,
    getView: getView,
    yardsToPercent: yardsToPercent,
    renderMarkings: renderMarkings,
  };
})(window);
