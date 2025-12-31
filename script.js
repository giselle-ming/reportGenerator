function generatePDF() {
  function safeValue(id, fallback = "") {
    const el = document.getElementById(id);
    if (!el) return fallback;
    return el.value !== undefined ? el.value : el.textContent || fallback;
  }

  // Map inputs to PDF fields (use safeValue to avoid null references)
  document.getElementById("out-name").innerText = safeValue("name", "");
  document.getElementById("out-wins").innerText = safeValue("wins", "");
  document.getElementById("out-todo").innerText = safeValue("todo", "");
  document.getElementById("out-notes").innerText = safeValue("notes", "");
  document.getElementById("out-clients-attended").innerText = safeValue(
    "clients-attended",
    "0"
  );
  document.getElementById("out-appointments-scheduled").innerText = safeValue(
    "appointments-scheduled",
    "0"
  );
  document.getElementById("out-appointments-details").innerText = safeValue(
    "appointments-details",
    ""
  );
  document.getElementById("pdf-date").innerText = new Date().toLocaleDateString(
    "en-US",
    {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  // Add current date/time in Eastern Time to the compliance note
  try {
    const complianceEl = document.getElementById("compliance-note");
    if (complianceEl) {
      const eastNow = new Date().toLocaleString("en-US", {
        timeZone: "America/New_York",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });
      complianceEl.innerText = "Generated on " + eastNow;
    }
  } catch (e) {
    // If Intl/timeZone isn't supported, silently continue
  }

  const element = document.getElementById("pdf-content");
  element.style.display = "block";

  const opt = {
    margin: 1,
    filename: (function () {
      const n = safeValue("name", "report").toString();
      const safe = n.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_\-]/g, "");
      const now = new Date();
      const mm = String(now.getMonth() + 1).padStart(2, "0");
      const dd = String(now.getDate()).padStart(2, "0");
      const yyyy = now.getFullYear();
      return "EOD_Report-" + safe + "-" + mm + "-" + dd + "-" + yyyy + ".pdf";
    })(),
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
  };

  html2pdf()
    .set(opt)
    .from(element)
    .save()
    .then(() => {
      element.style.display = "none"; // Hide again
    });
}
