(function () {
  "use strict";

  var ALLERGEN_ORDER = [
    "mountain_cedar",
    "oak",
    "ragweed",
    "grass",
    "mold",
  ];

  var LEVEL_WIDTH = {
    Low: "25%",
    Moderate: "50%",
    High: "75%",
    "Very high": "100%",
    "No data": "0%",
  };

  var LEVEL_PILL_CLASS = {
    Low: "pill--low",
    Moderate: "pill--moderate",
    High: "pill--high",
    "Very high": "pill--very-high",
    "No data": "pill--no-data",
  };

  var LEVEL_BAR_CLASS = {
    Low: "bar--low",
    Moderate: "bar--moderate",
    High: "bar--high",
    "Very high": "bar--very-high",
    "No data": "bar--no-data",
  };

  var ICONS = {
    mountain_cedar: iconCedar,
    oak: iconOak,
    ragweed: iconRagweed,
    grass: iconGrass,
    mold: iconMold,
  };

  function iconCedar() {
    return (
      '<svg class="allergen-row__icon" viewBox="0 0 32 32" aria-hidden="true">' +
      '<path fill="currentColor" d="M16 4l-3 6H8l4 5-2 7h12l-2-7 4-5h-5L16 4z"/>' +
      '<rect x="14" y="22" width="4" height="6" fill="currentColor" opacity="0.7"/>' +
      "</svg>"
    );
  }

  function iconOak() {
    return (
      '<svg class="allergen-row__icon" viewBox="0 0 32 32" aria-hidden="true">' +
      '<circle cx="16" cy="14" r="9" fill="currentColor" opacity="0.85"/>' +
      '<rect x="14" y="20" width="4" height="10" fill="currentColor"/>' +
      "</svg>"
    );
  }

  function iconRagweed() {
    return (
      '<svg class="allergen-row__icon" viewBox="0 0 32 32" aria-hidden="true">' +
      '<path fill="currentColor" d="M16 28V14M16 14c-4 0-7-3-7-7s3-3 7-3 7 0 7 3-3 7-7 7z"/>' +
      '<circle cx="10" cy="8" r="2" fill="currentColor"/>' +
      '<circle cx="22" cy="8" r="2" fill="currentColor"/>' +
      "</svg>"
    );
  }

  function iconGrass() {
    return (
      '<svg class="allergen-row__icon" viewBox="0 0 32 32" aria-hidden="true">' +
      '<path fill="currentColor" d="M8 28V12l4 8V10l4 10V8l4 12V14l4 14H8z"/>' +
      "</svg>"
    );
  }

  function iconMold() {
    return (
      '<svg class="allergen-row__icon" viewBox="0 0 32 32" aria-hidden="true">' +
      '<ellipse cx="12" cy="18" rx="5" ry="4" fill="currentColor" opacity="0.7"/>' +
      '<ellipse cx="20" cy="16" rx="4" ry="3" fill="currentColor"/>' +
      '<ellipse cx="16" cy="22" rx="6" ry="3" fill="currentColor" opacity="0.5"/>' +
      "</svg>"
    );
  }

  function formatUpdated(iso) {
    if (!iso) return "—";
    var d = new Date(iso);
    if (isNaN(d.getTime())) return "—";
    return new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Chicago",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      timeZoneName: "shortGeneric",
    }).format(d);
  }

  function cedarSeasonLine() {
    var now = new Date();
    var month = now.getMonth();
    var inSeason = month === 11 || month === 0 || month === 1;
    if (inSeason) {
      return (
        "Mountain cedar (Juniperus ashei) season runs December–February in Central Texas. " +
        "Counts shown are county estimates, not medical guidance."
      );
    }
    return "";
  }

  function drawPixelTexas() {
    var canvas = document.getElementById("tx-bg");
    if (!canvas) return;

    var w = window.innerWidth;
    var h = window.innerHeight;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";

    var ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);

    var gw = 48;
    var gh = 44;
    var offCtx = document.createElement("canvas").getContext("2d");
    offCtx.canvas.width = gw;
    offCtx.canvas.height = gh;

    offCtx.fillStyle = "#000";
    offCtx.fillRect(0, 0, gw, gh);

    var mask = buildTexasMask(gw, gh);
    for (var y = 0; y < gh; y++) {
      for (var x = 0; x < gw; x++) {
        if (mask[y * gw + x]) {
          var t = y / gh;
          var g = Math.floor(28 + t * 55 + (x % 3) * 4);
          offCtx.fillStyle = "rgb(20," + g + ",45)";
          offCtx.fillRect(x, y, 1, 1);
        }
      }
    }

    var scale = Math.max(w / gw, h / gh) * 1.15;
    var dw = gw * scale;
    var dh = gh * scale;
    var dx = (w - dw) / 2;
    var dy = (h - dh) / 2;

    ctx.imageSmoothingEnabled = false;
    ctx.fillStyle = "#0a1f14";
    ctx.fillRect(0, 0, w, h);
    ctx.drawImage(offCtx.canvas, 0, 0, gw, gh, dx, dy, dw, dh);

    var grad = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w * 0.7);
    grad.addColorStop(0, "rgba(10,31,20,0)");
    grad.addColorStop(1, "rgba(5,12,8,0.75)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
  }

  function buildTexasMask(w, h) {
    var m = new Uint8Array(w * h);
    function set(x, y) {
      if (x >= 0 && x < w && y >= 0 && y < h) m[y * w + x] = 1;
    }
    function fillPoly(points) {
      var minY = h;
      var maxY = 0;
      for (var i = 0; i < points.length; i++) {
        minY = Math.min(minY, points[i][1]);
        maxY = Math.max(maxY, points[i][1]);
      }
      minY = Math.max(0, minY);
      maxY = Math.min(h - 1, maxY);
      for (var y = minY; y <= maxY; y++) {
        var xs = [];
        for (var j = 0; j < points.length; j++) {
          var p0 = points[j];
          var p1 = points[(j + 1) % points.length];
          if (p0[1] === p1[1]) continue;
          if (y < Math.min(p0[1], p1[1]) || y >= Math.max(p0[1], p1[1])) continue;
          var x =
            p0[0] +
            ((y - p0[1]) * (p1[0] - p0[0])) / (p1[1] - p0[1]);
          xs.push(x);
        }
        xs.sort(function (a, b) {
          return a - b;
        });
        for (var k = 0; k < xs.length; k += 2) {
          if (k + 1 >= xs.length) break;
          var x0 = Math.ceil(xs[k]);
          var x1 = Math.floor(xs[k + 1]);
          for (var x = x0; x <= x1; x++) set(x, y);
        }
      }
    }

    var tx = [
      [8, 38],
      [6, 32],
      [5, 26],
      [7, 20],
      [10, 14],
      [14, 10],
      [18, 8],
      [24, 6],
      [30, 5],
      [36, 6],
      [40, 10],
      [42, 16],
      [43, 22],
      [41, 28],
      [38, 34],
      [34, 38],
      [28, 40],
      [20, 39],
      [14, 38],
    ].map(function (p) {
      return [Math.round((p[0] / 44) * w), Math.round((p[1] / 42) * h)];
    });

    fillPoly(tx);
    return m;
  }

  function formatValue(allergen) {
    if (allergen.value == null) return "—";
    if (allergen.unit) return allergen.value + " " + allergen.unit;
    return String(allergen.value);
  }

  function renderRow(key, allergen) {
    var level = allergen.level || "No data";
    var pillClass = LEVEL_PILL_CLASS[level] || "pill--no-data";
    var barClass = LEVEL_BAR_CLASS[level] || "bar--no-data";
    var width = LEVEL_WIDTH[level] || "0%";
    var iconFn = ICONS[key] || iconGrass;

    return (
      '<article class="allergen-row">' +
      iconFn() +
      '<span class="allergen-row__label">' +
      escapeHtml(allergen.label) +
      "</span>" +
      '<span class="allergen-row__value">' +
      escapeHtml(formatValue(allergen)) +
      "</span>" +
      '<div class="allergen-row__bar-wrap">' +
      '<div class="allergen-row__bar">' +
      '<div class="allergen-row__bar-fill ' +
      barClass +
      '" style="width:' +
      width +
      '"></div>' +
      "</div>" +
      '<span class="allergen-row__pill ' +
      pillClass +
      '">' +
      escapeHtml(level) +
      "</span>" +
      "</div>" +
      "</article>"
    );
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function renderCounty(id, countyData) {
    var rows = ALLERGEN_ORDER.map(function (key) {
      var a = countyData.allergens[key];
      if (!a) return "";
      return renderRow(key, a);
    }).join("");

    var note = countyData.note
      ? '<p class="county-panel__note">' + escapeHtml(countyData.note) + "</p>"
      : "";

    return (
      '<section class="county-panel" aria-labelledby="head-' +
      id +
      '">' +
      '<h2 class="county-panel__head" id="head-' +
      id +
      '">' +
      escapeHtml(countyData.county) +
      " County</h2>" +
      note +
      rows +
      "</section>"
    );
  }

  function render(data) {
    var columns = document.getElementById("columns");
    var updated = data.bexar.updated_at || data.travis.updated_at;
    var sub = document.getElementById("top-sub");
    sub.textContent = "Travis · Bexar · Updated " + formatUpdated(updated);

    var cedarEl = document.getElementById("cedar-season");
    var cedarText = cedarSeasonLine();
    if (cedarText) {
      cedarEl.textContent = cedarText;
      cedarEl.hidden = false;
    } else {
      cedarEl.hidden = true;
    }

    columns.innerHTML =
      renderCounty("bexar", data.bexar) + renderCounty("travis", data.travis);

    var footerTime = document.getElementById("footer-time");
    footerTime.textContent = "Board timestamp: " + formatUpdated(updated);

    var sampleBadge = document.getElementById("sample-badge");
    if (data.meta && data.meta.sample === false) {
      sampleBadge.hidden = true;
    }
  }

  function load() {
    fetch("data/latest.json")
      .then(function (r) {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.json();
      })
      .then(render)
      .catch(function (err) {
        var columns = document.getElementById("columns");
        columns.innerHTML =
          '<p class="load-msg">Could not load data. Serve this folder over HTTP (see README). ' +
          escapeHtml(err.message) +
          "</p>";
      });
  }

  window.addEventListener("resize", drawPixelTexas);
  drawPixelTexas();
  load();
})();
