$content = [System.IO.File]::ReadAllText("w:\PT WHX\script.js", [System.Text.Encoding]::UTF8)

# CRLF to LF for consistent replacement
$content = $content -replace "`r`n", "`n"

# 1. magneticButtons
$old1 = @"
      const magneticButtons = document.querySelectorAll(".button, .header-cta");
      magneticButtons.forEach((button) => {
        button.addEventListener("pointermove", (event) => {
          const bounds = button.getBoundingClientRect();
"@.Replace("`r`n", "`n")
$new1 = @"
      const magneticButtons = document.querySelectorAll(".button, .header-cta");
      magneticButtons.forEach((button) => {
        button.addEventListener("pointerenter", () => { button._bounds = button.getBoundingClientRect(); });
        button.addEventListener("pointerleave", () => { button._bounds = null; gsap.to(button, { x: 0, y: 0, duration: 0.45, ease: "elastic.out(1, 0.5)", overwrite: true }); });
        button.addEventListener("pointermove", (event) => {
          const bounds = button._bounds || button.getBoundingClientRect();
"@.Replace("`r`n", "`n")
$content = $content.Replace($old1, $new1)

$old1_leave = @"
        button.addEventListener("pointerleave", () => {
          gsap.to(button, { x: 0, y: 0, duration: 0.45, ease: "elastic.out(1, 0.5)", overwrite: true });
        });
"@.Replace("`r`n", "`n")
$content = $content.Replace($old1_leave, "")

# 2. useAgentLoop
$old2 = @"
    const useAgentLoop = () => {
      const section = document.querySelector(".AgentLoop");
      const labels = [...document.querySelectorAll(".loop-label")];
      if (!section || !labels.length) return;
      const update = () => {
        const bounds = section.getBoundingClientRect();
        const progress = Math.max(0, Math.min(1, (window.innerHeight - bounds.top) / (window.innerHeight + bounds.height)));
"@.Replace("`r`n", "`n")
$new2 = @"
    const useAgentLoop = () => {
      const section = document.querySelector(".AgentLoop");
      const labels = [...document.querySelectorAll(".loop-label")];
      if (!section || !labels.length) return;
      let topOffset = 0, height = 0;
      const measure = () => { const b = section.getBoundingClientRect(); topOffset = b.top + window.scrollY; height = b.height; };
      const update = () => {
        const top = topOffset - window.scrollY;
        const progress = Math.max(0, Math.min(1, (window.innerHeight - top) / (window.innerHeight + height)));
"@.Replace("`r`n", "`n")
$content = $content.Replace($old2, $new2)

$old2_attach = @"
      update();
      window.addEventListener("scroll", update, { passive: true });
      addCleanup(() => window.removeEventListener("scroll", update));
    };
"@.Replace("`r`n", "`n")
$new2_attach = @"
      measure();
      update();
      window.addEventListener("resize", measure, { passive: true });
      window.addEventListener("scroll", update, { passive: true });
      addCleanup(() => { window.removeEventListener("resize", measure); window.removeEventListener("scroll", update); });
    };
"@.Replace("`r`n", "`n")
$content = $content.Replace($old2_attach, $new2_attach)

# 3. useMultiAgentNetwork
$old3 = @"
      const section = document.querySelector(".MultiAgentSystem");
      if (!section) return;
      const update = () => {
        const bounds = section.getBoundingClientRect();
        const progress = Math.max(0, Math.min(1, (window.innerHeight - bounds.top) / (window.innerHeight + bounds.height)));
"@.Replace("`r`n", "`n")
$new3 = @"
      const section = document.querySelector(".MultiAgentSystem");
      if (!section) return;
      let topOffset = 0, height = 0;
      const measure = () => { const b = section.getBoundingClientRect(); topOffset = b.top + window.scrollY; height = b.height; };
      const update = () => {
        const top = topOffset - window.scrollY;
        const progress = Math.max(0, Math.min(1, (window.innerHeight - top) / (window.innerHeight + height)));
"@.Replace("`r`n", "`n")
$content = $content.Replace($old3, $new3)

$old3_attach = @"
      update();
      window.addEventListener("scroll", update, { passive: true });
      addCleanup(() => window.removeEventListener("scroll", update));
    };
"@.Replace("`r`n", "`n")
$new3_attach = @"
      measure();
      update();
      window.addEventListener("resize", measure, { passive: true });
      window.addEventListener("scroll", update, { passive: true });
      addCleanup(() => { window.removeEventListener("resize", measure); window.removeEventListener("scroll", update); });
    };
"@.Replace("`r`n", "`n")
$content = $content.Replace($old3_attach, $new3_attach)

# 4. orchestration
$old4 = @"
    const orchestrationNodes = document.querySelectorAll(".orchestration-flow span, .orchestration-flow strong");
    const updateOrchestration = () => {
      if (!orchestration) return;
      const bounds = orchestration.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, (window.innerHeight - bounds.top) / (window.innerHeight + bounds.height)));
"@.Replace("`r`n", "`n")
$new4 = @"
    const orchestrationNodes = document.querySelectorAll(".orchestration-flow span, .orchestration-flow strong");
    let orchTopOffset = 0, orchHeight = 0;
    const measureOrchestration = () => { if (!orchestration) return; const b = orchestration.getBoundingClientRect(); orchTopOffset = b.top + window.scrollY; orchHeight = b.height; };
    const updateOrchestration = () => {
      if (!orchestration) return;
      const top = orchTopOffset - window.scrollY;
      const progress = Math.max(0, Math.min(1, (window.innerHeight - top) / (window.innerHeight + orchHeight)));
"@.Replace("`r`n", "`n")
$content = $content.Replace($old4, $new4)

$old4_attach = @"
    updateOrchestration();
    window.addEventListener("scroll", updateOrchestration, { passive: true });
    addCleanup(() => window.removeEventListener("scroll", updateOrchestration));
"@.Replace("`r`n", "`n")
$new4_attach = @"
    measureOrchestration();
    updateOrchestration();
    window.addEventListener("resize", measureOrchestration, { passive: true });
    window.addEventListener("scroll", updateOrchestration, { passive: true });
    addCleanup(() => { window.removeEventListener("resize", measureOrchestration); window.removeEventListener("scroll", updateOrchestration); });
"@.Replace("`r`n", "`n")
$content = $content.Replace($old4_attach, $new4_attach)

# 5. parallelSection
$old5 = @"
    const parallelAgents = document.querySelectorAll(".parallel-agents span");
    const updateParallel = () => {
      if (!parallelSection) return;
      const bounds = parallelSection.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, (window.innerHeight - bounds.top) / (window.innerHeight + bounds.height)));
"@.Replace("`r`n", "`n")
$new5 = @"
    const parallelAgents = document.querySelectorAll(".parallel-agents span");
    let parallelTopOffset = 0, parallelHeight = 0;
    const measureParallel = () => { if (!parallelSection) return; const b = parallelSection.getBoundingClientRect(); parallelTopOffset = b.top + window.scrollY; parallelHeight = b.height; };
    const updateParallel = () => {
      if (!parallelSection) return;
      const top = parallelTopOffset - window.scrollY;
      const progress = Math.max(0, Math.min(1, (window.innerHeight - top) / (window.innerHeight + parallelHeight)));
"@.Replace("`r`n", "`n")
$content = $content.Replace($old5, $new5)

$old5_attach = @"
    updateParallel();
    window.addEventListener("scroll", updateParallel, { passive: true });
    addCleanup(() => window.removeEventListener("scroll", updateParallel));
"@.Replace("`r`n", "`n")
$new5_attach = @"
    measureParallel();
    updateParallel();
    window.addEventListener("resize", measureParallel, { passive: true });
    window.addEventListener("scroll", updateParallel, { passive: true });
    addCleanup(() => { window.removeEventListener("resize", measureParallel); window.removeEventListener("scroll", updateParallel); });
"@.Replace("`r`n", "`n")
$content = $content.Replace($old5_attach, $new5_attach)

[System.IO.File]::WriteAllText("w:\PT WHX\script.js", $content, [System.Text.Encoding]::UTF8)
Write-Host "Replacement Complete"
