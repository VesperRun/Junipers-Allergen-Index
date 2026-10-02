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

  function formatValue(allergen) {
    if (allergen.value == null) return "—";
    if (allergen.unit) return allergen.value + " " + allergen.unit;
    return String(allergen.value);
  }

  function renderRow(allergen) {
    var level = allergen.level || "No data";
    var pillClass = LEVEL_PILL_CLASS[level] || "pill--no-data";
    var barClass = LEVEL_BAR_CLASS[level] || "bar--no-data";
    var width = LEVEL_WIDTH[level] || "0%";

    return (
      '<article class="allergen-row">' +
      '<span class="allergen-row__marker" aria-hidden="true"></span>' +
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
      return renderRow(a);
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

  load();
})();
