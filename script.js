document.addEventListener("DOMContentLoaded", () => {
  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
  }

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const knowledgePage = document.querySelector(".knowledge-page");
  if (knowledgePage) {
    const sections = [...document.querySelectorAll("[data-section]")];
    const sectionClass = (section) => {
      if (!section) return '';
      return section.getAttribute('data-section') ?? '';
    };

    const storySteps = [
      'data','understand','retrieve','rank','context','reason','verify','answer','act'
    ];

    if (sections.length) {
      sections.forEach((section, index) => {
        section.dataset.index = String(index);
        section.style.setProperty('--step-index', index);
      });
      const timeline = document.createElement('div');
      timeline.className = 'knowledge-scroll-story';
      timeline.setAttribute('aria-label', 'Knowledge intelligence story progress');
      timeline.innerHTML = storySteps.map((step, idx) => `<span class="story-step ${idx === 0 ? 'is-active' : ''}" data-step="${step}">${String(idx + 1).padStart(2, '0')} ${step.toUpperCase()}</span>`).join('');
      if (!document.querySelector('.knowledge-scroll-story')) {
        document.body.appendChild(timeline);
      }
    }

    const hero = document.querySelector('.knowledge-hero');
    const heroNodes = [...document.querySelectorAll('.source-node')];
    if (hero && heroNodes.length && !prefersReducedMotion) {
      hero.classList.add('knowledge-hero-animate');
      heroNodes.forEach((node, index) => {
        node.style.animationDelay = `${150 + index * 180}ms`;
        node.classList.add('knowledge-node-rise');
      });
    }

    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined' && !prefersReducedMotion) {
      const pageSections = document.querySelectorAll('[data-section]');
      pageSections.forEach((section) => {
        const sectionName = section.getAttribute('data-section');
        gsap.fromTo(section, { autoAlpha: 0.84, y: 14 }, {
          autoAlpha: 1,
          y: 0,
          duration: 0.86,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        });
      });
    }

    if (typeof IntersectionObserver !== 'undefined') {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const section = entry.target;
            const step = section.getAttribute('data-section');
            const progress = document.querySelector('.knowledge-scroll-story');
            if (progress && step) {
              progress.querySelectorAll('.story-step').forEach((node) => node.classList.toggle('is-active', node.getAttribute('data-step') === step || node.getAttribute('data-step') === 'act'));
            }
          }
        });
      }, { threshold: 0.2 });

      sections.forEach((section) => observer.observe(section));
    }
  }

  // Single entry point for page motion. Primary system behavior runs first;
  // section and micro-interactions are intentionally registered afterward.
  const animationController = {
    pageLoad() {
      document.body.classList.add("motion-ready");
    },
    heroAnimation() {
      const hero = document.querySelector(".hero");
      if (hero) hero.classList.add("motion-primary");
    },
    scrollAnimations() {
      document.querySelectorAll(".reveal").forEach((element) => element.classList.add("scroll-managed"));
    },
    cardAnimations() {
      document.querySelectorAll(".build-systems-grid article, .case-study-card").forEach((card) => card.classList.add("motion-secondary"));
    },
    workflowAnimation() {
      document.querySelectorAll(".intelligent-pipeline, .voice-workflow-steps, .agent-handoff").forEach((workflow) => workflow.classList.add("motion-secondary"));
    },
    ctaAnimation() {
      document.querySelectorAll(".button, .header-cta, .contact-toggle").forEach((cta) => cta.classList.add("motion-tertiary"));
    },
    run() {
      this.pageLoad();
      this.heroAnimation();
      this.scrollAnimations();
      this.cardAnimations();
      this.workflowAnimation();
      this.ctaAnimation();
    },
  };

  animationController.run();

  const menuToggle = document.querySelector(".menu-toggle");
  const mainNav = document.querySelector(".main-nav");

  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => {
      const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", String(!isExpanded));
      mainNav.classList.toggle("nav-open");
      mainNav.classList.toggle("open", !isExpanded);

      const icon = menuToggle.querySelector("i");
      if (icon) {
        if (!isExpanded) {
          icon.classList.remove("fa-bars");
          icon.classList.add("fa-xmark");
        } else {
          icon.classList.remove("fa-xmark");
          icon.classList.add("fa-bars");
        }
      }
    });
  }

  const siteHeader = document.querySelector(".site-header");
  if (siteHeader) {
    const updateHeaderState = () => {
      siteHeader.classList.toggle("is-scrolled", window.scrollY > 18);
    };

    updateHeaderState();
    window.addEventListener("scroll", updateHeaderState, { passive: true });
  }

  const contactToggle = document.querySelector(".contact-toggle");
  const contactLinks = document.querySelector("#contact-links");

  if (contactToggle && contactLinks) {
    contactToggle.addEventListener("click", () => {
      const isExpanded = contactToggle.getAttribute("aria-expanded") === "true";
      contactToggle.setAttribute("aria-expanded", String(!isExpanded));
      contactLinks.classList.toggle("active");
      contactLinks.setAttribute("aria-hidden", String(isExpanded));

      const icon = contactToggle.querySelector("i");
      if (icon) {
        icon.style.transform = isExpanded ? "rotate(0deg)" : "rotate(180deg)";
        icon.style.transition = "transform 0.3s ease";
      }
    });
  }

  const callDuration = document.querySelector(".call-duration");

  if (callDuration) {
    let elapsedSeconds = Number(callDuration.dataset.callSeconds) || 0;

    const updateCallDuration = () => {
      elapsedSeconds += 1;
      const minutes = Math.floor(elapsedSeconds / 60).toString().padStart(2, "0");
      const seconds = (elapsedSeconds % 60).toString().padStart(2, "0");
      callDuration.textContent = `${minutes}:${seconds}`;
    };

    window.setInterval(updateCallDuration, 1000);
  }

  const aiCore = document.querySelector(".ai-core-visual");
  const coreStatus = document.querySelector(".core-status");
  const coreStates = ["IDLE", "PROCESSING", "REASONING", "EXECUTING", "COMPLETE"];
  let coreStateIndex = 0;

  if (aiCore && coreStatus) {
    const advanceCoreState = () => {
      const state = coreStates[coreStateIndex];
      aiCore.classList.remove("is-processing", "is-reasoning", "is-executing", "is-complete");
      if (state !== "IDLE") aiCore.classList.add(`is-${state.toLowerCase()}`);
      coreStatus.textContent = state;
      coreStateIndex = (coreStateIndex + 1) % coreStates.length;
    };

    advanceCoreState();
    window.setInterval(advanceCoreState, 2200);
  }

  const conversationSpeaker = document.querySelector(".conversation-speaker");
  const conversationText = document.querySelector(".conversation-text");
  const conversationLines = [
    ["AI", "â€œLet me check the calendar for you.â€"],
    ["CUSTOMER", "â€œTomorrow afternoon would be perfect.â€"],
    ["AI", "â€œI found a 2:30 PM opening.â€"],
    ["CUSTOMER", "â€œYes, please book that.â€"],
    ["AI", "â€œYou're all set. Confirmation sent.â€"],
  ];
  let conversationIndex = 0;

  if (conversationSpeaker && conversationText && !document.querySelector(".voice-workflow-steps")) {
    window.setInterval(() => {
      conversationIndex = (conversationIndex + 1) % conversationLines.length;
      const [speaker, message] = conversationLines[conversationIndex];
      conversationSpeaker.textContent = speaker;
      conversationText.textContent = message;
      conversationSpeaker.style.color = speaker === "AI" ? "#15803d" : "#7c3aed";
    }, 2600);
  }

  const pausableAnimations = document.querySelectorAll(".ai-core-visual, .voice-call-panel, .agent-handoff, .ops-console");
  if (pausableAnimations.length > 0 && "IntersectionObserver" in window) {
    const animationVisibilityObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => entry.target.classList.toggle("is-offscreen", !entry.isIntersecting));
    }, { rootMargin: "120px 0px", threshold: 0.01 });

    pausableAnimations.forEach((element) => animationVisibilityObserver.observe(element));
  }

  const voiceWorkflowSteps = document.querySelectorAll(".voice-workflow-steps li");
  let voiceWorkflowIndex = 0;

  if (voiceWorkflowSteps.length > 0) {
    const voiceInsightMap = {
      "UNDERSTANDING INTENT": ["AI", "Intent detected: appointment booking", "Next: check calendar availability"],
      "CHECKING CALENDAR": ["AI", "Calendar tool called with customer context", "Next: find an available slot"],
      "FINDING AVAILABILITY": ["AI", "Two suitable times found and verified", "Next: ask for customer confirmation"],
      "BOOKING": ["AI", "Appointment held pending confirmation", "Next: write the booking to CRM"],
      "CRM UPDATE": ["AI", "CRM record updated with appointment context", "Next: send confirmation"],
      "CONFIRMATION SENT": ["AI", "Confirmation sent and workflow complete", "Next: monitor for follow-up"],
    };
    const voiceTranscript = document.querySelector(".voice-transcript strong");
    const voiceNextAction = document.querySelector(".voice-final");
    const advanceVoiceWorkflow = () => {
      voiceWorkflowSteps.forEach((step, index) => {
        step.classList.toggle("voice-step-active", index === voiceWorkflowIndex);
        step.classList.toggle("voice-step-complete", index < voiceWorkflowIndex);
        const status = step.querySelector("b");
        if (status) status.textContent = index < voiceWorkflowIndex ? "DONE" : index === voiceWorkflowIndex ? "PROCESSING" : "READY";
      });

      voiceWorkflowIndex = (voiceWorkflowIndex + 1) % voiceWorkflowSteps.length;
    };

    advanceVoiceWorkflow();
    voiceWorkflowSteps.forEach((step, index) => {
      const activateVoiceStep = () => {
        voiceWorkflowIndex = index;
        advanceVoiceWorkflow();
        const insight = voiceInsightMap[step.dataset.voiceStep];
        if (insight) {
          conversationSpeaker.textContent = insight[0];
          conversationText.textContent = insight[1];
          if (voiceTranscript) voiceTranscript.textContent = insight[1];
          if (voiceNextAction) voiceNextAction.textContent = insight[2];
        }
      };
      step.addEventListener("click", activateVoiceStep);
      step.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          activateVoiceStep();
        }
      });
    });
  }

  const operatorSteps = document.querySelectorAll(".operator-steps li");
  const operatorBeacon = document.querySelector(".operator-state-beacon");
  const operatorTask = document.querySelector(".operator-task");
  const visionAction = document.querySelector(".vision-action");
  const visionTarget = document.querySelector(".vision-target");
  const operatorLabels = ["OPEN CRM", "SEARCH LEADS", "OPEN CUSTOMER", "READ HISTORY", "UPDATE STATUS", "SEND FOLLOW-UP", "VERIFY", "DONE"];
  const operatorTasks = ["Opening CRM workspace", "Finding today's leads", "Opening Marcus Lee", "Reading customer history", "Updating status to Follow-up", "Sending follow-up message", "Verifying CRM state", "Workflow completed"];
  const visionTargets = ["crm.whxdigital.com", "Today's leads / 12 records", "Marcus Lee / Follow-up", "Customer history / 8 events", "Status field / Follow-up", "Message composer / ready", "CRM record / verified", "Marcus Lee / updated"];
  let operatorIndex = 0;

  if (operatorSteps.length > 0) {
    const cycleOperator = () => {
      operatorSteps.forEach((step) => step.classList.remove("operator-step-active"));
      const activeStep = operatorSteps[operatorIndex % operatorSteps.length];
      activeStep.classList.add("operator-step-active");
      if (operatorBeacon) {
        operatorBeacon.classList.toggle("is-processing", operatorIndex % operatorSteps.length < operatorSteps.length - 1);
        operatorBeacon.classList.toggle("is-complete", operatorIndex % operatorSteps.length === operatorSteps.length - 1);
      }
      if (operatorTask) operatorTask.textContent = operatorTasks[operatorIndex % operatorTasks.length];
      if (visionAction) visionAction.textContent = operatorTasks[operatorIndex % operatorTasks.length];
      if (visionTarget) visionTarget.textContent = `TARGET / ${visionTargets[operatorIndex % visionTargets.length]}`;
      operatorIndex += 1;
    };

    cycleOperator();
    window.setInterval(cycleOperator, 1900);
  }

  const knowledgeSources = document.querySelectorAll("[data-knowledge-source]");
  const knowledgeRunStatus = document.querySelector(".knowledge-run-status");
  const knowledgeRunLabel = document.querySelector(".knowledge-run-label");
  const knowledgeRunDetail = document.querySelector(".knowledge-run-detail");
  const knowledgeFlow = document.querySelector(".ai-knowledge-flow");
  let knowledgeRunTimer;

  if (knowledgeSources.length && knowledgeRunStatus && knowledgeRunLabel && knowledgeRunDetail) {
    knowledgeSources.forEach((source) => {
      source.addEventListener("click", () => {
        const sourceName = source.dataset.knowledgeSource;
        window.clearTimeout(knowledgeRunTimer);
        knowledgeSources.forEach((item) => item.classList.toggle("is-selected", item === source));
        knowledgeRunStatus.classList.remove("is-complete");
        knowledgeRunStatus.classList.add("is-running");
        knowledgeRunLabel.textContent = `Routing ${sourceName} through retrieval`;
        knowledgeRunDetail.textContent = "Signal captured -> context matched -> memory updated -> grounded action queued.";
        if (knowledgeFlow) knowledgeFlow.classList.add("is-routing");

        knowledgeRunTimer = window.setTimeout(() => {
          knowledgeRunStatus.classList.remove("is-running");
          knowledgeRunStatus.classList.add("is-complete");
          knowledgeRunLabel.textContent = `${sourceName} is ready in knowledge memory`;
          knowledgeRunDetail.textContent = "Source match verified. The worker can now act with traceable context.";
          if (knowledgeFlow) knowledgeFlow.classList.remove("is-routing");
        }, prefersReducedMotion ? 0 : 1300);
      });
    });
  }

  const knowledgeFeatures = document.querySelectorAll("[data-knowledge-feature]");
  const knowledgeFeatureStatus = document.querySelector(".knowledge-feature-status");
  if (knowledgeFeatures.length && knowledgeFeatureStatus) {
    const featureLabel = knowledgeFeatureStatus.querySelector("span");
    const featureResult = knowledgeFeatureStatus.querySelector("strong");
    knowledgeFeatures.forEach((feature) => feature.addEventListener("click", () => {
      knowledgeFeatures.forEach((item) => item.classList.toggle("is-selected", item === feature));
      featureLabel.textContent = `${feature.dataset.knowledgeFeature} ACTIVE`;
      featureResult.textContent = feature.dataset.featureResult;
    }));
  }

  const processDemo = document.querySelector(".system-process-demo");
  const crmWorkflowVisual = document.querySelector(".ai-crm-workflow-visual");
  if (processDemo && crmWorkflowVisual && !processDemo.contains(crmWorkflowVisual)) {
    crmWorkflowVisual.classList.add("process-crm-demo");
    processDemo.appendChild(crmWorkflowVisual);
  }

  const crmNodes = document.querySelectorAll("[data-crm-step]");
  const crmStatus = document.querySelector(".ai-crm-interaction-status");
  if (crmNodes.length && crmStatus) {
    const crmLabel = crmStatus.querySelector("span");
    const crmResult = crmStatus.querySelector("strong");
    crmNodes.forEach((node) => node.addEventListener("click", () => {
      crmNodes.forEach((item) => item.classList.toggle("is-selected", item === node));
      crmLabel.textContent = `${node.dataset.crmStep} COMPLETE`;
      crmResult.textContent = node.dataset.crmResult;
      node.closest(".ai-crm-workflow-visual")?.classList.add("is-user-activated");
    }));
  }

  const configuratorSteps = document.querySelectorAll("[data-config-step]");
  const configuratorReadout = document.querySelector(".configurator-readout");
  let configuratorTimer;

  if (configuratorSteps.length && configuratorReadout) {
    const readoutState = (label, detail, state) => {
      configuratorReadout.classList.remove("is-running", "is-complete");
      if (state) configuratorReadout.classList.add(state);
      configuratorReadout.querySelector("span").textContent = label;
      configuratorReadout.querySelector("strong").textContent = detail;
    };

    configuratorSteps.forEach((step) => {
      step.addEventListener("click", () => {
        window.clearTimeout(configuratorTimer);
        configuratorSteps.forEach((item) => item.classList.toggle("is-selected", item === step));
        readoutState("SYSTEM MAPPING", `${step.dataset.configStep}: ${step.dataset.configDetail}`, "is-running");
        configuratorTimer = window.setTimeout(() => {
          readoutState("READY FOR NEXT INPUT", `${step.dataset.configStep} mapped into the deployment blueprint.`, "is-complete");
        }, prefersReducedMotion ? 0 : 900);
      });
    });
  }

  const conceptCards = document.querySelectorAll(".advanced-concepts-grid article");
  if (conceptCards.length > 0 && !prefersReducedMotion) {
    let conceptIndex = 0;
    const cycleConcepts = () => {
      conceptCards.forEach((card, index) => card.classList.toggle("concept-live", index === conceptIndex % conceptCards.length));
      conceptIndex += 1;
    };
    cycleConcepts();
    window.setInterval(cycleConcepts, 2200);
  }

  const discoverySteps = document.querySelectorAll(".discovery-grid article");
  const executionSteps = document.querySelectorAll(".receptionist-flow .receptionist-step");
  if (!prefersReducedMotion && (discoverySteps.length || executionSteps.length)) {
    let systemStepIndex = 0;
    const cycleSystemSteps = () => {
      discoverySteps.forEach((step, index) => step.classList.toggle("discovery-live", index === systemStepIndex % discoverySteps.length));
      executionSteps.forEach((step, index) => step.classList.toggle("execution-live", index === systemStepIndex % executionSteps.length));
      systemStepIndex += 1;
    };
    cycleSystemSteps();
    window.setInterval(cycleSystemSteps, 1900);
  }

  const statusMetricDefaults = {
    agents: { base: 24, minimum: 24, maximum: 38 },
    workflows: { base: 186, minimum: 186, maximum: 260 },
    tasks: { base: 1284, minimum: 1284, maximum: 2400 },
  };

  document.querySelectorAll("[data-status-key]").forEach((element) => {
    const metricKey = element.dataset.statusKey;
    const metric = statusMetricDefaults[metricKey];
    if (!metric) return;

    const storageKey = `whx-status-${metricKey}`;
    const previousValue = Number(window.localStorage.getItem(storageKey));
    const hasPreviousValue = Number.isFinite(previousValue) && previousValue >= metric.minimum;
    const nextValue = hasPreviousValue
      ? Math.min(metric.maximum, previousValue + 1 + Math.floor(Math.random() * 3))
      : metric.base;

    window.localStorage.setItem(storageKey, String(nextValue));
    element.dataset.countTarget = String(nextValue);
    element.textContent = nextValue.toLocaleString();
  });

  const countElements = document.querySelectorAll("[data-count-target]");
  const animateCount = (element) => {
    if (element.dataset.counted === "true") return;

    const target = Number(element.dataset.countTarget);
    const suffix = element.dataset.countSuffix || "";
    const decimals = target % 1 ? 1 : 0;
    const duration = 1100;
    const startTime = performance.now();

    const updateCount = (currentTime) => {
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const currentValue = target * easedProgress;
      element.textContent = `${currentValue.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}${suffix}`;

      if (progress < 1) {
        window.requestAnimationFrame(updateCount);
      } else {
        element.dataset.counted = "true";
      }
    };

    window.requestAnimationFrame(updateCount);
  };

  if (countElements.length > 0) {
    const countObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) animateCount(entry.target);
      });
    }, { threshold: 0.45 });

    countElements.forEach((element) => countObserver.observe(element));
  }

  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    const reducedMotion = prefersReducedMotion;
    const pageLoadTimeline = gsap.timeline({ defaults: { ease: "power3.out" } });
    const heroEyebrow = document.querySelector(".hero .eyebrow");
    const heroHeading = document.querySelector(".hero h1");
    const heroLead = document.querySelector(".hero .lead");
    const heroActions = document.querySelector(".hero .hero-actions");
    const heroCore = document.querySelector(".ai-core-visual");
    const heroCoreNodes = document.querySelectorAll(".ai-core-visual .core-node");

    if (!reducedMotion) {
      pageLoadTimeline
        .fromTo("body", { opacity: 0 }, { opacity: 1, duration: 0.35 }, 0)
        .fromTo(".site-header", { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.45 }, 0.05)
        .fromTo(heroEyebrow, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.45 }, 0.3)
        .fromTo(heroHeading, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.7 }, 0.6)
        .fromTo(heroLead, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.5 }, 1)
        .fromTo(heroActions, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.45 }, 1.15)
        .fromTo(heroCore, { opacity: 0, scale: 0.92 }, { opacity: 1, scale: 1, duration: 0.8 }, 0.8)
        .fromTo(heroCoreNodes, { opacity: 0, scale: 0.88 }, { opacity: 1, scale: 1, duration: 0.35, stagger: 0.2 }, 1.1);
    }

    const revealElements = document.querySelectorAll(".reveal");
    revealElements.forEach((el) => {
      gsap.fromTo(
        el,
        {
          opacity: 0,
          y: 40,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
    });

    const floatingCards = document.querySelectorAll(".floating-card");
    if (floatingCards.length > 0 && !reducedMotion) {
      gsap.to(".card-one", {
        y: -12,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(".card-two", {
        y: 12,
        duration: 3.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 0.5,
      });
    }

    if (!reducedMotion) {
      const magneticButtons = document.querySelectorAll(".button, .header-cta");
      magneticButtons.forEach((button) => {
        button.addEventListener("pointermove", (event) => {
          const bounds = button.getBoundingClientRect();
          const offsetX = (event.clientX - bounds.left - bounds.width / 2) * 0.12;
          const offsetY = (event.clientY - bounds.top - bounds.height / 2) * 0.12;
          gsap.to(button, { x: offsetX, y: offsetY, duration: 0.25, ease: "power2.out", overwrite: true });
        });

        button.addEventListener("pointerleave", () => {
          gsap.to(button, { x: 0, y: 0, duration: 0.45, ease: "elastic.out(1, 0.5)", overwrite: true });
        });
      });

      const heroVisual = document.querySelector(".hero-visual");
      if (heroVisual) {
        gsap.to(heroVisual, {
          y: 42,
          ease: "none",
          scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: 1.2,
          },
        });
      }
    }

    const flowSteps = document.querySelectorAll(".flow-step");
    if (flowSteps.length > 0) {
      flowSteps.forEach((step, index) => {
        gsap.fromTo(
          step,
          {
            opacity: 0,
            x: index % 2 === 0 ? -30 : 30,
            scale: 0.96,
          },
          {
            opacity: 1,
            x: 0,
            scale: 1,
            duration: 0.7,
            ease: "back.out(1.2)",
            scrollTrigger: {
              trigger: step,
              start: "top 88%",
              toggleActions: "play none none none",
            },
          }
        );
      });
    }

    const processCards = document.querySelectorAll(".process-card");
    if (processCards.length > 0) {
      gsap.fromTo(
        processCards,
        {
          opacity: 0,
          y: 30,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".process-grid",
            start: "top 80%",
          },
        }
      );
    }

    const oldWayItems = document.querySelectorAll(".old-way-grid span");
    if (oldWayItems.length > 0) {
      gsap.fromTo(oldWayItems, { opacity: 0, y: 20 }, {
        opacity: 1,
        y: 0,
        duration: 0.45,
        stagger: 0.12,
        scrollTrigger: { trigger: ".old-way-grid", start: "top 78%", toggleActions: "play none none none" },
      });
    }

    const intelligentPipeline = document.querySelector(".intelligent-pipeline");
    const intelligentNodes = intelligentPipeline ? intelligentPipeline.querySelectorAll("span, strong") : [];
    if (intelligentPipeline && intelligentNodes.length > 0) {
      const pipelineTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: intelligentPipeline,
          start: "top 78%",
          end: "bottom 52%",
          scrub: 0.8,
        },
      });
      pipelineTimeline.fromTo(intelligentNodes, { opacity: 0.3, y: 12 }, { opacity: 1, y: 0, duration: 1, stagger: 0.7, ease: "none" });
    }

    const buildCards = document.querySelectorAll(".build-systems-grid article");
    if (buildCards.length > 0) {
      gsap.fromTo(buildCards, { opacity: 0, y: 28 }, {
        opacity: 1,
        y: 0,
        duration: 0.55,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: { trigger: ".build-systems-grid", start: "top 80%", toggleActions: "play none none none" },
      });
    }

    const workforceNodes = document.querySelectorAll(".multi-agent-architecture .ascii-flow, .agent-handoff > div");
    if (workforceNodes.length > 0) {
      gsap.fromTo(workforceNodes, { opacity: 0, y: 18 }, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.14,
        scrollTrigger: { trigger: ".multi-agent", start: "top 72%", toggleActions: "play none none none" },
      });
    }

    const opsConsole = document.querySelector(".ops-console");
    if (opsConsole) {
      ScrollTrigger.create({
        trigger: opsConsole,
        start: "top 82%",
        once: true,
        onEnter: () => opsConsole.classList.add("is-live"),
      });
    }

    const transformationTrack = document.querySelector(".transformation-track");
    if (transformationTrack) {
      ScrollTrigger.create({
        trigger: transformationTrack,
        start: "top 82%",
        onEnter: () => transformationTrack.classList.add("is-visible"),
      });
    }

    const caseStudyGrid = document.querySelector(".case-study-grid");
    if (caseStudyGrid && window.matchMedia("(min-width: 981px)").matches) {
      const caseStudyWidth = caseStudyGrid.scrollWidth - caseStudyGrid.clientWidth;
      if (caseStudyWidth > 0) {
        gsap.to(caseStudyGrid, {
          x: -caseStudyWidth,
          ease: "none",
          scrollTrigger: {
            trigger: ".case-studies",
            start: "top top",
            end: () => `+=${caseStudyWidth}`,
            scrub: 1,
            pin: true,
            anticipatePin: 1,
          },
        });
      }
    }
  }

  const agentPage = document.querySelector(".agent-page");
  if (agentPage) {
    class AgentNode {
      static states = ["idle", "active", "processing", "success", "error", "waiting"];
      static lifecycle = ["IDLE", "RECEIVING", "UNDERSTANDING", "PLANNING", "EXECUTING", "VERIFYING", "COMPLETED"];
      static recovery = ["EXECUTING", "TOOL ERROR", "REASON", "RETRY / ALTERNATIVE", "EXECUTING"];

      constructor({ element, type, label, status = "idle", icon = "", description = "", connectedTo = [], animationState = status }) {
        this.element = element;
        this.type = type;
        this.label = label;
        this.status = status;
        this.icon = icon;
        this.description = description;
        this.connectedTo = connectedTo;
        this.animationState = animationState;
        this.setState(status);
      }

      setState(nextState) {
        if (!AgentNode.states.includes(nextState)) return;
        this.status = nextState;
        this.animationState = nextState;
        this.element.dataset.agentState = nextState;
        this.element.classList.remove(...AgentNode.states.map((state) => `agent-state-${state}`));
        this.element.classList.add(`agent-state-${nextState}`);
        this.element.setAttribute("aria-label", `${this.label}: ${nextState}`);
      }

      runLifecycle({ recover = false, interval = 950, onPhase } = {}) {
        const phases = recover ? AgentNode.recovery : AgentNode.lifecycle;
        let phaseIndex = 0;
        const advance = () => {
          const phase = phases[phaseIndex % phases.length];
          this.element.dataset.agentPhase = phase;
          this.element.setAttribute("aria-label", `${this.label}: ${phase}`);
          if (typeof onPhase === "function") onPhase(phase);
          phaseIndex += 1;
        };
        advance();
        const timer = window.setInterval(advance, interval);
        return () => window.clearInterval(timer);
      }
    }

    const componentClasses = {
      "#memory": "AgentMemory",
      "#task": "MultiStepExecution",
      "#human-review": "HumanInLoop",
      "#multi-agent": "MultiAgentSystem",
      "#evaluation": "AgentEvaluation",
      "#use-cases": "AgentUseCases",
      "#connect": "AgentCTA",
    };
    Object.entries(componentClasses).forEach(([selector, className]) => document.querySelector(selector)?.classList.add(className));

    const reducedMotion = prefersReducedMotion;
    const cleanup = [];
    const addCleanup = (callback) => cleanup.push(callback);

    const useAgentHero = () => {
      const nodes = [
        [".ContextNode", "context", "Context", "active"],
        [".AgentBrain", "brain", "AI Brain", "processing"],
        [".ToolsNode", "tools", "Tools", "waiting"],
        [".MemoryNode", "memory", "Memory", "active"],
      ].map(([selector, type, label, status]) => {
        const element = document.querySelector(selector);
        return element ? new AgentNode({ element, type, label, status, connectedTo: ["agent-core"] }) : null;
      }).filter(Boolean);

      if (!reducedMotion && nodes.length) {
        const stateCycle = ["active", "processing", "success", "waiting"];
        let index = 0;
        const timer = window.setInterval(() => {
          nodes.forEach((node, nodeIndex) => node.setState(stateCycle[(index + nodeIndex) % stateCycle.length]));
          index += 1;
        }, 1700);
        addCleanup(() => window.clearInterval(timer));
      }
      const brainNode = nodes.find((node) => node.type === "brain");
      if (brainNode && !reducedMotion) addCleanup(brainNode.runLifecycle({ onPhase: (phase) => agentPage.dataset.agentLifecycle = phase }));
    };

    const useDefinitionAnimation = () => {
      const comparison = document.querySelector(".workflow-transform");
      if (!comparison || typeof IntersectionObserver === "undefined") return;
      const observer = new IntersectionObserver(([entry]) => comparison.classList.toggle("is-active", entry.isIntersecting), { threshold: 0.45 });
      observer.observe(comparison);
      addCleanup(() => observer.disconnect());
    };

    const useBrainAnimation = () => {
      const core = document.querySelector(".brain-core");
      if (core) new AgentNode({ element: core, type: "brain", label: "AI Brain", status: reducedMotion ? "active" : "processing" });
    };

    const useAgentLoop = () => {
      const section = document.querySelector(".AgentLoop");
      const labels = [...document.querySelectorAll(".loop-label")];
      if (!section || !labels.length) return;
      const update = () => {
        const bounds = section.getBoundingClientRect();
        const progress = Math.max(0, Math.min(1, (window.innerHeight - bounds.top) / (window.innerHeight + bounds.height)));
        section.style.setProperty("--agent-progress", progress.toFixed(3));
        labels.forEach((label, index) => label.classList.toggle("is-progress-active", index <= Math.round(progress * (labels.length - 1))));
      };
      update();
      window.addEventListener("scroll", update, { passive: true });
      addCleanup(() => window.removeEventListener("scroll", update));
    };

    const useToolConnections = () => {
      const network = document.querySelector(".tools-network");
      const target = document.querySelector(".tool-agent");
      if (!network || !target) return;
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.classList.add("agent-data-flow");
      svg.setAttribute("viewBox", "0 0 900 420");
      svg.setAttribute("aria-hidden", "true");
      [72, 142, 212, 282, 352, 422].forEach((y, index) => {
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("id", `agent-flow-${index}`);
        path.setAttribute("d", `M 80 ${y} C 270 ${y}, 335 210, 450 210`);
        svg.appendChild(path);
        const particle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        particle.setAttribute("r", "5");
        particle.classList.add("flow-particle");
        const motion = document.createElementNS("http://www.w3.org/2000/svg", "animateMotion");
        motion.setAttribute("dur", `${2.2 + index * 0.18}s`);
        motion.setAttribute("repeatCount", "indefinite");
        motion.setAttribute("begin", `${index * 0.25}s`);
        const link = document.createElementNS("http://www.w3.org/2000/svg", "mpath");
        link.setAttributeNS("http://www.w3.org/1999/xlink", "href", `#agent-flow-${index}`);
        motion.appendChild(link);
        particle.appendChild(motion);
        svg.appendChild(particle);
      });
      const actionPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
      actionPath.setAttribute("id", "agent-flow-action");
      actionPath.setAttribute("d", "M 450 210 C 560 210, 650 210, 820 210");
      actionPath.classList.add("agent-action-path");
      svg.appendChild(actionPath);
      const actionParticle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      actionParticle.setAttribute("r", "5");
      actionParticle.classList.add("flow-particle", "action-particle");
      const actionMotion = document.createElementNS("http://www.w3.org/2000/svg", "animateMotion");
      actionMotion.setAttribute("dur", "2.6s");
      actionMotion.setAttribute("repeatCount", "indefinite");
      actionMotion.setAttribute("begin", "0.9s");
      const actionLink = document.createElementNS("http://www.w3.org/2000/svg", "mpath");
      actionLink.setAttributeNS("http://www.w3.org/1999/xlink", "href", "#agent-flow-action");
      actionMotion.appendChild(actionLink);
      actionParticle.appendChild(actionMotion);
      svg.appendChild(actionParticle);
      network.prepend(svg);
      addCleanup(() => svg.remove());
    };

    const useMemoryAnimation = () => document.querySelector(".AgentMemory")?.classList.add("memory-ready");
    const useExecutionTimeline = () => document.querySelectorAll(".task-steps li").forEach((step, index) => step.style.setProperty("--step-index", index));
    const useHumanReview = () => document.querySelector(".HumanInLoop")?.setAttribute("aria-label", "Human approval flow");
    const useMultiAgentNetwork = () => {
      document.querySelectorAll(".specialists span").forEach((element, index) => new AgentNode({ element, type: "specialist", label: element.textContent.trim(), status: index === 0 ? "active" : "idle", connectedTo: ["orchestrator", "shared-memory"] }));
      const section = document.querySelector(".MultiAgentSystem");
      if (!section) return;
      const update = () => {
        const bounds = section.getBoundingClientRect();
        const progress = Math.max(0, Math.min(1, (window.innerHeight - bounds.top) / (window.innerHeight + bounds.height)));
        section.style.setProperty("--network-progress", progress.toFixed(3));
        document.querySelectorAll(".specialists span").forEach((node, index) => node.classList.toggle("is-network-active", progress > index / 3));
      };
      update();
      window.addEventListener("scroll", update, { passive: true });
      addCleanup(() => window.removeEventListener("scroll", update));
    };
    const useEvaluationDashboard = () => document.querySelector(".AgentEvaluation")?.classList.add("dashboard-ready");
    const useCTAAnimation = () => document.querySelector(".AgentCTA")?.classList.add("cta-ready");

    useAgentHero();
    useDefinitionAnimation();
    useBrainAnimation();
    useAgentLoop();
    useToolConnections();
    useMemoryAnimation();
    useExecutionTimeline();
    useHumanReview();
    useMultiAgentNetwork();
    useEvaluationDashboard();
    useCTAAnimation();
    window.addEventListener("pagehide", () => cleanup.splice(0).forEach((dispose) => dispose()));

    window.setTimeout(() => agentPage.classList.add("agent-ready"), reducedMotion ? 0 : 120);

    const activateOnView = document.querySelectorAll(".agent-section:not(.agent-hero)");
    if ("IntersectionObserver" in window) {
      const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("is-visible");
        });
      }, { threshold: 0.22 });
      activateOnView.forEach((section) => sectionObserver.observe(section));
    } else {
      activateOnView.forEach((section) => section.classList.add("is-visible"));
    }

    const transform = document.querySelector(".workflow-transform");
    if (transform && "IntersectionObserver" in window) {
      const transformObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) transform.classList.add("is-active");
      }, { threshold: 0.45 });
      transformObserver.observe(transform);
    }

    const brainStages = document.querySelectorAll(".brain-stages li");
    const brainStatus = document.querySelector(".brain-stage-status");
    let brainIndex = 0;
    const advanceBrain = () => {
      brainStages.forEach((stage, index) => stage.classList.toggle("is-active", index === brainIndex));
      if (brainStatus && brainStages[brainIndex]) brainStatus.textContent = brainStages[brainIndex].dataset.state;
      brainIndex = (brainIndex + 1) % brainStages.length;
    };
    if (brainStages.length) {
      advanceBrain();
      if (!reducedMotion) window.setInterval(advanceBrain, 1150);
    }

    const taskSteps = document.querySelectorAll(".task-steps li");
    let taskIndex = 0;
    const advanceTask = () => {
      taskSteps.forEach((step, index) => step.classList.toggle("is-active", index === taskIndex));
      taskIndex = (taskIndex + 1) % taskSteps.length;
    };
    if (taskSteps.length) {
      advanceTask();
      if (!reducedMotion) window.setInterval(advanceTask, 1100);
    }

    const toolButtons = document.querySelectorAll(".tool-list button");
    const toolParticle = document.querySelector(".tools-network");
    toolButtons.forEach((button) => {
      button.addEventListener("mouseenter", () => {
        toolButtons.forEach((item) => item.classList.remove("is-active"));
        button.classList.add("is-active");
        if (toolParticle) toolParticle.dataset.activeTool = button.dataset.tool;
      });
    });

    const loop = document.querySelector(".loop-orbit");
    if (loop && !reducedMotion) {
      const updateLoopSpeed = () => {
        const distance = Math.abs(window.innerHeight / 2 - loop.getBoundingClientRect().top - loop.offsetHeight / 2);
        const speed = Math.max(3.5, Math.min(10, distance / 80));
        loop.style.setProperty("--loop-speed", `${speed}s`);
        loop.querySelector(".loop-particle").style.animationDuration = `${speed}s`;
      };
      updateLoopSpeed();
      window.addEventListener("scroll", updateLoopSpeed, { passive: true });
    }
  }

  const automationPage = document.querySelector(".automation-page");
  if (automationPage) {
    class WorkflowNode {
      static types = ["trigger", "context", "ai", "condition", "tool", "human", "action", "verify", "outcome", "error"];
      static states = ["idle", "active", "processing", "success", "error", "waiting", "recovery"];
      static workflow = ["TRIGGER", "CONTEXT", "AI REASONING", "DECISION", "ACTION", "VERIFY", "OUTCOME"];
      static failure = ["ACTION", "ERROR", "DETECT", "REASON", "RECOVER", "RETRY", "VERIFY"];

      constructor({ element, id, type, label, status = "idle", icon = "", description = "", connections = [], position = { x: 0, y: 0 } }) {
        this.element = element;
        this.id = id;
        this.type = type;
        this.label = label;
        this.status = status;
        this.icon = icon;
        this.description = description;
        this.connections = connections;
        this.position = position;
        this.setState(status);
      }

      setState(nextState) {
        if (!WorkflowNode.states.includes(nextState)) return;
        this.status = nextState;
        this.element.dataset.workflowState = nextState;
        this.element.classList.remove(...WorkflowNode.states.map((state) => `workflow-state-${state}`));
        this.element.classList.add(`workflow-state-${nextState}`);
        this.element.setAttribute("aria-label", `${this.label}: ${nextState}`);
      }

      setPhase(phase) {
        this.element.dataset.workflowPhase = phase;
        this.element.setAttribute("aria-label", `${this.label}: ${phase}`);
      }
    }

    const componentClasses = {
      ".automation-hero": "AutomationHero",
      ".workflow-hero-panel": "WorkflowCanvas",
      "#automation-definition": "TraditionalVsAI",
      ".engine-section": "AutomationEngine",
      ".engine-track": "WorkflowPipeline",
      ".systems-section": "ConnectedSystems",
      ".decision-section": "DecisionLayer",
      ".healing-section": "SelfHealing",
      ".approval-section": "HumanApproval",
      ".lead-section": "MultiSystemWorkflow",
      ".monitor-section": "AutomationMonitor",
      ".builder-section": "WorkflowBuilder",
      ".automation-use-cases": "AutomationUseCases",
      ".automation-final": "AutomationCTA",
    };
    Object.entries(componentClasses).forEach(([selector, className]) => document.querySelector(selector)?.classList.add(className));

    const reducedMotion = prefersReducedMotion;
    const cleanup = [];
    const addCleanup = (callback) => cleanup.push(callback);
    const animationContext = typeof gsap !== "undefined" ? gsap.context(() => {}, automationPage) : null;
    if (animationContext) addCleanup(() => animationContext.revert());

    const useAutomationHero = () => document.querySelectorAll("[data-workflow-step]").forEach((element, index) => new WorkflowNode({ element, id: `hero-${index}`, type: index === 0 ? "trigger" : index === 6 ? "outcome" : "ai", label: element.dataset.workflowStep }));
    const useWorkflowBuild = () => { const node = document.querySelector(".WorkflowPipeline .engine-node"); if (node) new WorkflowNode({ element: node, id: "engine-event", type: "trigger", label: "EVENT", status: "active" }); };
    const useDecisionTree = () => document.querySelector(".DecisionLayer")?.setAttribute("aria-label", "AI decision tree");
    const useIntegrationFlow = () => document.querySelectorAll(".system-cards button").forEach((element, index) => new WorkflowNode({ element, id: `integration-${index}`, type: "tool", label: element.dataset.system, connections: ["automation-core"] }));
    const useSelfHealing = () => document.querySelector(".SelfHealing")?.setAttribute("aria-label", "Self-healing recovery flow");
    const useApprovalFlow = () => document.querySelector(".HumanApproval")?.setAttribute("aria-label", "Human approval flow");
    const useMonitoringDashboard = () => document.querySelector(".AutomationMonitor")?.classList.add("dashboard-ready");
    const useWorkflowBuilder = () => document.querySelector(".WorkflowBuilder")?.setAttribute("aria-label", "Visual workflow builder demo");
    const useAutomationCTA = () => document.querySelector(".AutomationCTA")?.classList.add("cta-ready");
    useAutomationHero(); useWorkflowBuild(); useDecisionTree(); useIntegrationFlow(); useSelfHealing(); useApprovalFlow(); useMonitoringDashboard(); useWorkflowBuilder(); useAutomationCTA();
    window.setTimeout(() => automationPage.classList.add("automation-ready"), reducedMotion ? 0 : 120);

    const heroSteps = document.querySelectorAll("[data-workflow-step]");
    if (!reducedMotion && heroSteps.length) {
      let heroIndex = 0;
      const timer = window.setInterval(() => {
        heroSteps.forEach((step, index) => step.classList.toggle("is-workflow-active", index === heroIndex));
        heroIndex = (heroIndex + 1) % heroSteps.length;
      }, 620);
      addCleanup(() => window.clearInterval(timer));
    } else heroSteps.forEach((step) => step.classList.add("is-workflow-active"));

    const observeSections = document.querySelectorAll(".automation-section:not(.automation-hero)");
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver((entries) => entries.forEach((entry) => entry.target.classList.toggle("is-visible", entry.isIntersecting)), { threshold: .2 });
      observeSections.forEach((section) => observer.observe(section));
      addCleanup(() => observer.disconnect());
    }

    const engine = document.querySelector(".engine-section");
    const engineNodes = [...document.querySelectorAll(".engine-node")];
    const workflowPhases = ["TRIGGER", "CONTEXT", "AI REASONING", "DECISION", "ACTION", "VERIFY", "OUTCOME"];
    const updateEngine = () => {
      if (!engine) return;
      const bounds = engine.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, (window.innerHeight - bounds.top) / (window.innerHeight + bounds.height)));
      engine.style.setProperty("--engine-progress", progress.toFixed(3));
      const activeIndex = Math.round(progress * (engineNodes.length - 1));
      engine.dataset.workflowState = workflowPhases[activeIndex];
      engineNodes.forEach((node, index) => {
        node.classList.toggle("is-engine-active", index <= activeIndex);
        node.dataset.workflowPhase = workflowPhases[index];
        node.classList.toggle("workflow-state-processing", index === activeIndex);
      });
    };
    updateEngine();
    window.addEventListener("scroll", updateEngine, { passive: true });
    addCleanup(() => window.removeEventListener("scroll", updateEngine));

    const systems = document.querySelector(".systems-network");
    const systemsSvg = document.querySelector(".systems-svg");
    if (systems && systemsSvg) {
      [70, 145, 220, 295, 370].forEach((y, index) => {
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", `M 100 ${y} C 300 ${y}, 330 220, 450 220 S 650 220, 805 220`);
        systemsSvg.appendChild(path);
        const particle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        particle.setAttribute("r", "5");
        const motion = document.createElementNS("http://www.w3.org/2000/svg", "animateMotion");
        motion.setAttribute("dur", `${2.4 + index * .25}s`);
        motion.setAttribute("repeatCount", "indefinite");
        motion.setAttribute("begin", `${index * .3}s`);
        const link = document.createElementNS("http://www.w3.org/2000/svg", "mpath");
        link.setAttributeNS("http://www.w3.org/1999/xlink", "href", `#system-path-${index}`);
        path.setAttribute("id", `system-path-${index}`);
        motion.appendChild(link); particle.appendChild(motion); systemsSvg.appendChild(particle);
      });
      addCleanup(() => { systemsSvg.replaceChildren(); });
    }

    const counters = document.querySelectorAll("[data-demo-count]");
    const animateCounters = () => counters.forEach((counter) => {
      const target = Number(counter.dataset.demoCount);
      if (reducedMotion) { counter.textContent = `${target}${counter.dataset.demoCount === "94" ? "%" : ""}`; return; }
      let value = 0;
      const timer = window.setInterval(() => { value = Math.min(target, value + Math.ceil(target / 18)); counter.textContent = `${value}${target === 94 ? "%" : ""}`; if (value >= target) window.clearInterval(timer); }, 55);
    });
    if ("IntersectionObserver" in window && counters.length) {
      const counterObserver = new IntersectionObserver(([entry], observer) => { if (entry.isIntersecting) { animateCounters(); observer.disconnect(); } }, { threshold: .35 });
      counterObserver.observe(document.querySelector(".monitor-section"));
      addCleanup(() => counterObserver.disconnect());
    }

    const healing = document.querySelector(".healing-console");
    if (healing && !reducedMotion) {
      const phases = ["is-healing-error", "is-healing-recovering", "is-healing-complete"];
      let phase = 0;
      const timer = window.setInterval(() => { healing.classList.remove(...phases); healing.classList.add(phases[phase]); phase = (phase + 1) % phases.length; }, 1800);
      addCleanup(() => window.clearInterval(timer));
    }

    const builderCanvas = document.querySelector(".builder-canvas");
    const builderButtons = document.querySelectorAll("[data-builder-node]");
    const addBuilderNode = (label) => { const node = document.createElement("span"); node.textContent = label; node.className = "builder-added-node"; builderCanvas?.prepend(node); };
    builderButtons.forEach((button) => {
      button.addEventListener("dragstart", (event) => event.dataTransfer?.setData("text/plain", button.dataset.builderNode));
      button.addEventListener("click", () => addBuilderNode(button.dataset.builderNode));
    });
    if (builderCanvas) {
      builderCanvas.addEventListener("dragover", (event) => event.preventDefault());
      builderCanvas.addEventListener("drop", (event) => { event.preventDefault(); const label = event.dataTransfer?.getData("text/plain"); if (label) addBuilderNode(label); });
    }

    document.querySelectorAll(".approval-card button").forEach((button) => button.addEventListener("click", () => {
      const card = button.closest(".approval-card");
      if (card) { card.classList.add("approval-complete"); card.querySelector("b").textContent = "WORKFLOW RESUMED"; }
    }));
    window.addEventListener("pagehide", () => cleanup.splice(0).forEach((dispose) => dispose()));
  }

  const workforcePage = document.querySelector(".workforce-page");
  if (workforcePage) {
    class AgentNode {
      static roles = ["research", "sales", "support", "operations", "data", "knowledge", "orchestrator"];
      static states = ["IDLE", "RECEIVING", "UNDERSTANDING", "PLANNING", "EXECUTING", "COMMUNICATING", "VERIFYING", "COMPLETED", "ERROR", "RECOVERING", "WAITING_FOR_APPROVAL", "APPROVED"];

      constructor({ element, id, type, label, role, status = "IDLE", icon = "", description = "", connectedTo = [], animationState = status }) {
        this.element = element;
        this.id = id;
        this.type = type;
        this.label = label;
        this.role = role;
        this.status = status;
        this.icon = icon;
        this.description = description;
        this.connectedTo = connectedTo;
        this.animationState = animationState;
        this.setState(status);
      }

      setState(nextState) {
        if (!AgentNode.states.includes(nextState)) return;
        this.status = nextState;
        this.animationState = nextState;
        this.element.dataset.agentState = nextState;
        this.element.dataset.agentRole = this.role;
        this.element.setAttribute("aria-label", `${this.label}: ${nextState}`);
      }

      setPhase(nextPhase) {
        this.element.dataset.orchestratorPhase = nextPhase;
        this.element.setAttribute("aria-label", `${this.label}: ${nextPhase}`);
      }
    }

    const reducedMotion = prefersReducedMotion;
    const cleanup = [];
    const addCleanup = (callback) => cleanup.push(callback);
    const delegationPlan = [
      { agent: "research", task: "Research company" },
      { agent: "data", task: "Analyze business signals" },
      { agent: "knowledge", task: "Retrieve relevant context" },
      { agent: "sales", task: "Create recommendation" },
    ];
    workforcePage.dataset.delegationPlan = JSON.stringify(delegationPlan);
    const nodeByRole = new Map();
    const roleFromElement = (element) => (element.dataset.agent || element.className.split(" ").find((name) => AgentNode.roles.includes(name)) || "orchestrator").toLowerCase();
    document.querySelectorAll(".workforce-agent, .orchestrator-core, .specialist-grid article").forEach((element, index) => {
      const role = roleFromElement(element);
      const node = new AgentNode({ element, id: `${role}-${index}`, type: role === "orchestrator" ? "orchestrator" : "agent", label: element.textContent.trim().split("\n")[0], role, connectedTo: role === "orchestrator" ? AgentNode.roles : ["orchestrator", "shared-memory"] });
      nodeByRole.set(role, node);
    });

    const connectionLayer = document.querySelector(".agent-network-lines");
    const connectionNodes = ["research", "sales", "support", "operations", "data"].map((role) => nodeByRole.get(role)).filter(Boolean);
    const orchestratorNode = nodeByRole.get("orchestrator");
    const connectionSvg = connectionLayer ? document.createElementNS("http://www.w3.org/2000/svg", "svg") : null;
    const updateConnections = () => {
      if (!connectionLayer || !connectionSvg || !orchestratorNode) return;
      const bounds = connectionLayer.getBoundingClientRect();
      connectionSvg.setAttribute("viewBox", `0 0 ${Math.max(1, bounds.width)} ${Math.max(1, bounds.height)}`);
      connectionSvg.replaceChildren();
      const targetRect = orchestratorNode.element.getBoundingClientRect();
      const target = { x: targetRect.left - bounds.left + targetRect.width / 2, y: targetRect.top - bounds.top + targetRect.height / 2 };
      connectionNodes.forEach((node, index) => {
        const sourceRect = node.element.getBoundingClientRect();
        const source = { x: sourceRect.left - bounds.left + sourceRect.width / 2, y: sourceRect.top - bounds.top + sourceRect.height / 2 };
        const curve = document.createElementNS("http://www.w3.org/2000/svg", "path");
        curve.setAttribute("d", `M ${source.x} ${source.y} C ${(source.x + target.x) / 2} ${source.y}, ${(source.x + target.x) / 2} ${target.y}, ${target.x} ${target.y}`);
        curve.classList.add("workforce-connection");
        curve.dataset.connection = `${node.role}-orchestrator`;
        connectionSvg.appendChild(curve);
        if (!reducedMotion) {
          const particle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
          particle.setAttribute("r", "4");
          particle.classList.add("workforce-particle");
          const motion = document.createElementNS("http://www.w3.org/2000/svg", "animateMotion");
          motion.setAttribute("dur", `${2.2 + index * .22}s`);
          motion.setAttribute("repeatCount", "indefinite");
          motion.setAttribute("begin", `${index * .3}s`);
          const link = document.createElementNS("http://www.w3.org/2000/svg", "mpath");
          link.setAttributeNS("http://www.w3.org/1999/xlink", "href", `#${curve.id || ""}`);
          curve.id = `workforce-connection-${index}`;
          motion.appendChild(link); particle.appendChild(motion); connectionSvg.appendChild(particle);
        }
      });
    };
    if (connectionSvg) {
      connectionSvg.classList.add("workforce-network-svg");
      connectionSvg.setAttribute("aria-hidden", "true");
      connectionLayer.appendChild(connectionSvg);
      updateConnections();
      window.addEventListener("resize", updateConnections);
      addCleanup(() => { window.removeEventListener("resize", updateConnections); connectionSvg.remove(); });
    }

    const orchestratorPhases = ["IDLE", "RECEIVE_OBJECTIVE", "UNDERSTAND", "DECOMPOSE", "DELEGATE", "MONITOR", "COLLECT_RESULTS", "SYNTHESIZE", "VERIFY", "COMPLETE"];
    if (orchestratorNode && !reducedMotion) {
      let phaseIndex = 0;
      const phaseTimer = window.setInterval(() => {
        const phase = orchestratorPhases[phaseIndex % orchestratorPhases.length];
        orchestratorNode.setPhase(phase);
        workforcePage.dataset.orchestratorState = phase;
        if (phase === "DELEGATE") connectionNodes.forEach((node) => node.setState("EXECUTING"));
        if (phase === "COLLECT_RESULTS") connectionNodes.forEach((node) => node.setState("COMPLETED"));
        phaseIndex += 1;
      }, 1250);
      addCleanup(() => window.clearInterval(phaseTimer));
    } else if (orchestratorNode) {
      orchestratorNode.setPhase("COMPLETE");
      workforcePage.dataset.orchestratorState = "COMPLETE";
    }

    if (connectionLayer && "IntersectionObserver" in window) {
      const visibilityObserver = new IntersectionObserver(([entry]) => connectionLayer.classList.toggle("is-paused", !entry.isIntersecting), { threshold: .05 });
      visibilityObserver.observe(connectionLayer);
      addCleanup(() => visibilityObserver.disconnect());
    }
    const workforceNodes = [...document.querySelectorAll(".workforce-agent, .orchestrator-core, .specialist-grid article")];
    const setNodeState = (element, state) => {
      element.dataset.agentState = state;
      element.classList.remove("is-agent-active", "is-agent-processing", "is-agent-success");
      element.classList.add(`is-agent-${state}`);
    };
    workforceNodes.forEach((element, index) => {
      element.dataset.agentType = element.dataset.agent || element.className.split(" ")[1] || "orchestrator";
      setNodeState(element, index === 0 ? "active" : "idle");
    });

    const componentClasses = {
      ".workforce-hero": "MultiAgentHero",
      ".orchestrator-visual": "AgentNetwork",
      ".why-section": "WhyMultiAgent",
      ".orchestration-section": "AgentOrchestration",
      ".specialists-section": "SpecializedAgents",
      ".memory-section": "SharedMemory",
      ".communication-section": "AgentCommunication",
      ".delegation-section": "TaskDelegation",
      ".parallel-section": "ParallelExecution",
      ".governance-section": "AgentGovernance",
      ".control-room-section": "WorkforceControlRoom",
      ".scenario-section": "BusinessScenario",
      ".workforce-final": "WorkforceCTA",
    };
    Object.entries(componentClasses).forEach(([selector, className]) => document.querySelector(selector)?.classList.add(className));
    window.setTimeout(() => workforcePage.classList.add("workforce-ready"), reducedMotion ? 0 : 120);

    const heroAgents = document.querySelectorAll(".workforce-agent");
    const heroCore = document.querySelector(".orchestrator-core");
    if (!reducedMotion) {
      heroCore?.classList.add("is-orchestrator-entering");
      heroAgents.forEach((agent, index) => window.setTimeout(() => agent.classList.add("is-agent-entering"), 1000 + index * 420));
      const heroSignalTimer = window.setTimeout(() => workforcePage.classList.add("is-network-live"), 4000);
      addCleanup(() => window.clearTimeout(heroSignalTimer));
    } else {
      heroCore?.classList.add("is-orchestrator-entering");
      heroAgents.forEach((agent) => agent.classList.add("is-agent-entering"));
      workforcePage.classList.add("is-network-live");
    }

    const specialistCards = document.querySelectorAll(".specialist-grid article");
    specialistCards.forEach((card) => {
      card.addEventListener("mouseenter", () => {
        specialistCards.forEach((item) => item.classList.remove("is-connected"));
        card.classList.add("is-connected");
      });
      card.addEventListener("mouseleave", () => card.classList.remove("is-connected"));
    });
    if ("IntersectionObserver" in window && specialistCards.length) {
      const specialistObserver = new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting) return;
        specialistCards.forEach((card, index) => window.setTimeout(() => {
          card.classList.add("is-specialist-working");
          card.dataset.agentStatus = "WORKING";
        }, reducedMotion ? 0 : index * 420));
        specialistObserver.disconnect();
      }, { threshold: .3 });
      specialistObserver.observe(document.querySelector(".specialists-section"));
      addCleanup(() => specialistObserver.disconnect());
    }

    const orchestration = document.querySelector(".orchestration-section");
    const orchestrationNodes = document.querySelectorAll(".orchestration-flow span, .orchestration-flow strong");
    const updateOrchestration = () => {
      if (!orchestration) return;
      const bounds = orchestration.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, (window.innerHeight - bounds.top) / (window.innerHeight + bounds.height)));
      orchestration.style.setProperty("--orchestration-progress", progress.toFixed(3));
      orchestrationNodes.forEach((node, index) => node.classList.toggle("is-orchestration-active", index <= Math.round(progress * (orchestrationNodes.length - 1))));
    };
    updateOrchestration();
    window.addEventListener("scroll", updateOrchestration, { passive: true });
    addCleanup(() => window.removeEventListener("scroll", updateOrchestration));

    const parallelSection = document.querySelector(".parallel-section");
    const parallelAgents = document.querySelectorAll(".parallel-agents span");
    const updateParallel = () => {
      if (!parallelSection) return;
      const bounds = parallelSection.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, (window.innerHeight - bounds.top) / (window.innerHeight + bounds.height)));
      parallelSection.style.setProperty("--parallel-progress", progress.toFixed(3));
      parallelAgents.forEach((agent, index) => agent.classList.toggle("is-parallel-working", progress > .25 + index * .08));
      parallelSection.classList.toggle("is-synthesis-complete", progress > .82);
    };
    updateParallel();
    window.addEventListener("scroll", updateParallel, { passive: true });
    addCleanup(() => window.removeEventListener("scroll", updateParallel));

    const communicationItems = document.querySelectorAll(".communication-feed article");
    let communicationIndex = 0;
    const advanceCommunication = () => {
      communicationItems.forEach((item, index) => item.classList.toggle("is-message-active", index === communicationIndex));
      communicationIndex = (communicationIndex + 1) % communicationItems.length;
    };
    if (communicationItems.length) {
      advanceCommunication();
      if (!reducedMotion) {
        const timer = window.setInterval(advanceCommunication, 1450);
        addCleanup(() => window.clearInterval(timer));
      }
    }

    const memory = document.querySelector(".memory-network");
    if (memory && !reducedMotion) {
      const timer = window.setInterval(() => memory.classList.toggle("is-memory-active"), 2200);
      addCleanup(() => window.clearInterval(timer));
    }

    const delegationItems = document.querySelectorAll(".delegation-list p");
    if (delegationItems.length && !reducedMotion) {
      let delegationIndex = 0;
      const timer = window.setInterval(() => {
        delegationItems.forEach((item, index) => item.classList.toggle("is-delegated", index === delegationIndex));
        delegationIndex = (delegationIndex + 1) % delegationItems.length;
      }, 1000);
      addCleanup(() => window.clearInterval(timer));
    }

    const governance = document.querySelector(".governance-section");
    if (governance && "IntersectionObserver" in window) {
      const observer = new IntersectionObserver(([entry]) => governance.classList.toggle("is-governance-live", entry.isIntersecting), { threshold: .25 });
      observer.observe(governance);
      addCleanup(() => observer.disconnect());
    }

    const scenarioSteps = document.querySelectorAll(".scenario-steps > span, .scenario-steps > strong");
    if (scenarioSteps.length && "IntersectionObserver" in window) {
      const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) scenarioSteps.forEach((step, index) => window.setTimeout(() => step.classList.add("is-scenario-active"), reducedMotion ? 0 : index * 360));
      }, { threshold: .3 });
      observer.observe(document.querySelector(".scenario-section"));
      addCleanup(() => observer.disconnect());
    }

    const controlRoom = document.querySelector(".control-room");
    if (controlRoom && "IntersectionObserver" in window) {
      const observer = new IntersectionObserver(([entry]) => controlRoom.classList.toggle("is-live", entry.isIntersecting), { threshold: .25 });
      observer.observe(controlRoom);
      addCleanup(() => observer.disconnect());
    }

    window.addEventListener("pagehide", () => cleanup.splice(0).forEach((dispose) => dispose()));
  }

  const topicPage = document.querySelector(".topic-page");
  if (topicPage && topicPage.querySelector(".topic-flow")) {
    const reducedMotion = prefersReducedMotion;
    const flowItems = [...topicPage.querySelectorAll(".topic-flow span, .topic-flow strong")];
    const sourceItems = [...topicPage.querySelectorAll(".topic-card li")];
    let flowIndex = 0;
    let sourceIndex = 0;
    const activateFlow = () => {
      flowItems.forEach((item, index) => item.classList.toggle("is-flow-active", index === flowIndex));
      sourceItems.forEach((item, index) => item.classList.toggle("is-source-active", index === sourceIndex));
      flowIndex = (flowIndex + 1) % flowItems.length;
      sourceIndex = (sourceIndex + 1) % Math.max(1, sourceItems.length);
    };
    flowItems.forEach((item) => item.classList.add("is-flow-ready"));
    sourceItems.forEach((item) => item.classList.add("is-source-ready"));
    if (reducedMotion) {
      flowItems.forEach((item) => item.classList.add("is-flow-active"));
      sourceItems.forEach((item) => item.classList.add("is-source-active"));
    } else {
      activateFlow();
      const timer = window.setInterval(activateFlow, 850);
      window.addEventListener("pagehide", () => window.clearInterval(timer), { once: true });
    }
  }

  const collaborationPanel = document.querySelector(".agent-collaboration");
  if (collaborationPanel) {
    const messages = [...collaborationPanel.querySelectorAll(".collaboration-step")];
    const handoffs = [...collaborationPanel.querySelectorAll(".agent-handoff > div")];
    let collaborationIndex = 0;
    const advanceCollaboration = () => {
      messages.forEach((message, index) => message.classList.toggle("collaboration-live", index === collaborationIndex));
      handoffs.forEach((handoff, index) => handoff.classList.toggle("handoff-live", index === collaborationIndex));
      collaborationIndex = (collaborationIndex + 1) % Math.max(messages.length, handoffs.length);
    };
    advanceCollaboration();
    if (!prefersReducedMotion) {
      const timer = window.setInterval(advanceCollaboration, 1600);
      window.addEventListener("pagehide", () => window.clearInterval(timer), { once: true });
    } else {
      messages.forEach((message) => message.classList.add("collaboration-live"));
      handoffs.forEach((handoff) => handoff.classList.add("handoff-live"));
    }
  }

  const voicePage = document.querySelector(".voice-page");
  if (voicePage) {
    const scenarios = [
      { ai: "â€œI can help with that. Let me check the best available time.â€", customer: "â€œI need to reschedule my consultation for next week.â€", intent: "Intent detected: rescheduling", confidence: "0.96", context: "existing customer", goal: "reschedule consultation", next: "checking calendar...", signals: ["RESCHEDULE", "CALM", "MEDIUM"] },
      { ai: "â€œHi, how can I help you today?â€", customer: "â€œI'd like to book an appointment for tomorrow.â€", intent: "Intent detected: appointment booking", confidence: "0.98", context: "existing lead", goal: "schedule appointment", next: "creating booking...", signals: ["BOOKING", "POSITIVE", "LOW"] },
      { ai: "â€œI understand this is urgent. Iâ€™m bringing in the right specialist now.â€", customer: "â€œThe invoice issue has blocked our whole team.â€", intent: "Intent detected: urgent support", confidence: "0.94", context: "priority account", goal: "route to support", next: "transferring with context...", signals: ["SUPPORT", "FRUSTRATED", "HIGH"] },
      { ai: "â€œIâ€™ve found the order and can start a replacement immediately.â€", customer: "â€œMy delivery hasnâ€™t arrived yet.â€", intent: "Intent detected: delivery support", confidence: "0.97", context: "returning customer", goal: "start replacement", next: "updating CRM...", signals: ["DELIVERY", "CONCERNED", "MEDIUM"] },
    ];
    const aiText = voicePage.querySelector(".voice-message-ai p");
    const customerText = voicePage.querySelector(".voice-message-customer p");
    const transcript = voicePage.querySelector(".voice-transcription strong");
    const confidence = voicePage.querySelector(".voice-transcription span");
    const signalRows = [...voicePage.querySelectorAll(".voice-signal-list p")];
    const stateValues = [...voicePage.querySelectorAll(".voice-signal-list p span")];
    const stateText = voicePage.querySelector(".voice-state-label, .voice-brain-core small");
    const nextAction = voicePage.querySelector(".voice-next-action");
    const voiceTimer = voicePage.querySelector(".voice-timer");
    let scenarioIndex = 1;

    const callStatus = voicePage.querySelector(".voice-room-head b, .voice-console-head b");
    if (callStatus) callStatus.textContent = "CONNECTED";

    const agentState = voicePage.querySelector(".voice-agent-state");
    let moodValue;
    if (agentState && !agentState.querySelector(".voice-mood-view")) {
      const moodView = document.createElement("div");
      moodView.className = "voice-mood-view";
      moodView.innerHTML = `<div class="voice-mood-head"><span>AI MOOD INTELLIGENCE</span><b>LIVE</b></div><div class="voice-mood-orbit"><i></i><i></i><i></i><strong class="voice-mood-value">POSITIVE</strong><small>EMOTION SIGNAL</small></div><div class="voice-mood-meter"><span></span></div><p>tone, urgency, and context are being read together</p>`;
      agentState.appendChild(moodView);
      moodValue = moodView.querySelector(".voice-mood-value");
    }

    if (voiceTimer) {
      let elapsedSeconds = Number(voiceTimer.dataset.callSeconds) || 166;

      const updateVoiceTimer = () => {
        elapsedSeconds += 1;
        const minutes = Math.floor(elapsedSeconds / 60).toString().padStart(2, "0");
        const seconds = (elapsedSeconds % 60).toString().padStart(2, "0");
        voiceTimer.textContent = `${minutes}:${seconds}`;
      };

      const timer = window.setInterval(updateVoiceTimer, 1000);
      window.addEventListener("pagehide", () => window.clearInterval(timer), { once: true });
    }

    const updateVoiceScenario = () => {
      const scenario = scenarios[scenarioIndex % scenarios.length];
      [aiText, customerText, transcript, confidence, nextAction].forEach((element) => element?.classList.add("voice-data-refresh"));
      if (aiText) aiText.textContent = scenario.ai;
      if (customerText) customerText.textContent = scenario.customer;
      if (transcript) transcript.textContent = scenario.intent;
      if (confidence) confidence.textContent = `confidence ${scenario.confidence} / language: EN`;
      if (nextAction) nextAction.textContent = scenario.next;
      if (stateText) stateText.textContent = "THINKING";
      if (stateValues.length >= 3) stateValues.slice(0, 3).forEach((element, index) => element.textContent = scenario.signals[index]);
      if (moodValue) moodValue.textContent = scenario.signals[1];
      scenarioIndex += 1;
      window.setTimeout(() => voicePage.querySelectorAll(".voice-data-refresh").forEach((element) => element.classList.remove("voice-data-refresh")), 500);
    };
    updateVoiceScenario();
    if (!prefersReducedMotion) {
      const timer = window.setInterval(updateVoiceScenario, 4800);
      window.addEventListener("pagehide", () => window.clearInterval(timer), { once: true });
    }

    const story = document.createElement("div");
    story.className = "voice-scroll-story";
    story.setAttribute("aria-label", "Voice AI operating progress");
    story.innerHTML = [
      ['01','LISTEN'],['02','UNDERSTAND'],['03','RETRIEVE'],['04','REASON'],['05','ACTION'],['06','VERIFY']
    ].map(([number, label], index) => `<span class="voice-story-step ${index === 0 ? 'is-active' : ''}" data-step="${label}">${number} ${label}</span>`).join('');
    if (!voicePage.querySelector('.voice-scroll-story')) {
      voicePage.appendChild(story);
    }

    const controlRoom = voicePage.querySelector(".voice-control-room");
    if (controlRoom && !voicePage.querySelector(".voice-browser-activity")) {
      const activity = document.createElement("div");
      activity.className = "voice-browser-activity";
      activity.innerHTML = `<div class="voice-browser-head"><span><i></i> AGENT TOOL ACTIVITY</span><b>LIVE</b></div><div class="voice-browser-window"><div class="voice-browser-toolbar"><span>â— â— â—</span><strong>calendar.whx.local</strong></div><div class="voice-browser-body"><aside><b>CALENDAR</b><span>Availability</span><span>Bookings</span><span>Customers</span></aside><main><small>TOOL CALL / CALENDAR LOOKUP</small><h3>Tomorrow, 2:30 PM</h3><p>Slot available for qualified customer.</p><div class="voice-browser-action"><span>CRM UPDATE</span><b>READY</b></div><div class="voice-browser-action"><span>CONFIRMATION SMS</span><b>QUEUED</b></div></main></div></div>`;
      controlRoom.appendChild(activity);
    }
  }

  const knowledgeDetailPage = document.querySelector(".knowledge-page");
  if (knowledgeDetailPage) {
    const architecture = knowledgeDetailPage.querySelector(".knowledge-architecture");
    if (architecture && !knowledgeDetailPage.querySelector(".knowledge-eye-console")) {
      const eyeConsole = document.createElement("div");
      eyeConsole.className = "knowledge-eye-console";
      eyeConsole.innerHTML = `<div class="knowledge-eye-head"><span><i></i> KNOWLEDGE SIGHT</span><b>SCANNING</b></div><div class="knowledge-eye-stage"><div class="knowledge-eye" aria-hidden="true"><span></span><i></i><b></b></div><div class="knowledge-eye-readout"><small>LIVE CONTEXT WINDOW</small><strong>Reading business memory</strong><span class="knowledge-eye-source">Documents</span></div></div><div class="knowledge-eye-sources"><span>DOCS</span><span>CRM</span><span>EMAIL</span><span>SOPS</span><span>CONTRACTS</span><span>DATABASES</span></div>`;
      architecture.parentElement.insertBefore(eyeConsole, architecture);

      const sources = [
        ["Documents", "Extracting structure from a policy file"],
        ["CRM records", "Connecting customer history to context"],
        ["Emails", "Finding the latest decision and owner"],
        ["SOPs", "Checking the approved operating procedure"],
        ["Contracts", "Verifying terms and permissions"],
        ["Databases", "Matching live records to the answer"],
      ];
      const sourceLabel = eyeConsole.querySelector(".knowledge-eye-source");
      const readout = eyeConsole.querySelector(".knowledge-eye-readout strong");
      const sourceChips = [...eyeConsole.querySelectorAll(".knowledge-eye-sources span")];
      let sourceIndex = 0;

      const updateKnowledgeSight = () => {
        const [source, message] = sources[sourceIndex % sources.length];
        sourceLabel.textContent = source;
        readout.textContent = message;
        sourceChips.forEach((chip, index) => chip.classList.toggle("is-reading", index === sourceIndex % sourceChips.length));
        sourceIndex += 1;
      };

      updateKnowledgeSight();
      if (!prefersReducedMotion) {
        const sightTimer = window.setInterval(updateKnowledgeSight, 2200);
        window.addEventListener("pagehide", () => window.clearInterval(sightTimer), { once: true });
      }
    }

    const knowledgeStages = knowledgeDetailPage.querySelectorAll(".knowledge-layer-node, .knowledge-agent-node, .knowledge-outcome");
    if (knowledgeStages.length > 0 && !prefersReducedMotion) {
      let stageIndex = 0;
      const advanceKnowledgeStage = () => {
        knowledgeStages.forEach((stage, index) => stage.classList.toggle("knowledge-stage-live", index === stageIndex % knowledgeStages.length));
        stageIndex += 1;
      };
      advanceKnowledgeStage();
      window.setInterval(advanceKnowledgeStage, 1800);
    }
  }

  const contactForm = document.querySelector("#contactForm");
  const formMessage = document.querySelector(".form-message");

  if (contactForm && formMessage) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const formData = new FormData(contactForm);
      const name = (formData.get("name") || "").toString().trim();

      formMessage.textContent = name
        ? `Thanks ${name}, weâ€™ll reach out within 24 hours.`
        : "Thanks, weâ€™ll reach out within 24 hours.";

      contactForm.reset();
    });
  }

  const whxBoot = document.querySelector("#whxBoot");
  if (whxBoot) {
    if (sessionStorage.getItem("whxBootShown")) {
      whxBoot.style.display = "none";
    } else {
      sessionStorage.setItem("whxBootShown", "true");
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const progress = document.querySelector("#whxBootProgress");
      const panel = document.querySelector("#whxBootPanel");
      const lines = [
        document.querySelector("#bootLine1"),
        document.querySelector("#bootLine2"),
        document.querySelector("#bootLine3"),
        document.querySelector("#bootLine4"),
        document.querySelector("#bootLine5"),
        document.querySelector("#bootLine6")
      ];
      
      const showLine = (index) => { if(lines[index]) lines[index].style.opacity = "1"; };
      const setProgress = (percent) => { if(progress) progress.style.width = percent + "%"; };
      
            if (prefersReducedMotion) {
        lines.forEach(l => { if(l) l.style.opacity = "1"; });
        setProgress(100);
        setTimeout(() => {
          whxBoot.style.opacity = "0";
          setTimeout(() => { whxBoot.style.display = "none"; }, 150);
        }, 150);
      } else {
        setTimeout(() => showLine(0), 100);
        setTimeout(() => { showLine(1); setProgress(25); }, 400);
        setTimeout(() => { showLine(2); setProgress(50); }, 700);
        setTimeout(() => { showLine(3); setProgress(75); }, 1000);
        setTimeout(() => { showLine(4); setProgress(100); }, 1300);
        setTimeout(() => { 
          showLine(5);
        }, 1600);
        setTimeout(() => { 
          if (panel) panel.style.transform = "scale(0.96) translateY(-8px)";
          whxBoot.style.opacity = "0";
          whxBoot.style.pointerEvents = "none";
        }, 2200);
        setTimeout(() => { whxBoot.style.display = "none"; }, 2500);
      }
    }
  }

  

  const geminiAlert = document.querySelector(".gemini-intelligence-alert");
  const geminiResponseControls = document.querySelectorAll("[data-gemini-response]");
  const geminiResponseDemo = document.querySelector(".gemini-intelligence-alert__response-demo");
  const geminiTickerWindow = document.querySelector(".gemini-intelligence-alert__ticker-window");
  const geminiResponseResults = {
    "Retry Logic": "The failed request is retried within a defined limit, with the original context preserved.",
    "Fallback Model": "The task routes to an approved backup model when Gemini does not respond in time.",
    Verify: "The output is checked against the task rules before any CRM or customer-facing action runs.",
    "Queue / Preserve Work": "The task is safely queued with its state intact so no lead or operation is lost.",
  };
  let geminiTickerTimer;

  if (geminiResponseControls.length && geminiResponseDemo) {
    const responseLabel = geminiResponseDemo.querySelector("span");
    const responseResult = geminiResponseDemo.querySelector("strong");
    geminiResponseControls.forEach((control) => control.addEventListener("click", () => {
      geminiResponseControls.forEach((item) => item.classList.toggle("is-selected", item === control));
      responseLabel.textContent = `${control.dataset.geminiResponse} ACTIVE`;
      responseResult.textContent = geminiResponseResults[control.dataset.geminiResponse];
    }));
  }

  if (geminiAlert) {
    const scheduleGeminiTicker = () => {
      window.clearInterval(geminiTickerTimer);
      geminiTickerTimer = window.setInterval(() => {}, 120000);
    };
    const pauseGeminiTicker = () => window.clearInterval(geminiTickerTimer);
    geminiAlert.addEventListener("mouseenter", pauseGeminiTicker);
    geminiAlert.addEventListener("mouseleave", scheduleGeminiTicker);
    geminiTickerWindow?.addEventListener("focusin", pauseGeminiTicker);
    geminiTickerWindow?.addEventListener("focusout", scheduleGeminiTicker);
    scheduleGeminiTicker();
  }
  initRotatingServices();
  initFaqAccordions();
  initAdvancedArchitectureInteractions();
  initInsightsHub();
});

/* ==========================================================================
   WHX Insights Hub Filtering & Search Initialization
   ========================================================================== */
function initInsightsHub() {
  const filterBtns = document.querySelectorAll(".insights-filter-btn");
  const searchInput = document.querySelector(".insights-search-input");
  const cards = document.querySelectorAll(".insights-card");

  if (!cards.length) return;

  let activeCategory = "all";
  let searchQuery = "";

  const filterCards = () => {
    cards.forEach((card) => {
      const cardCategory = (card.dataset.category || "").toLowerCase();
      const cardTitle = (card.querySelector(".insights-card-title")?.textContent || "").toLowerCase();
      const cardDesc = (card.querySelector(".insights-card-desc")?.textContent || "").toLowerCase();

      const matchesCategory = activeCategory === "all" || cardCategory.includes(activeCategory.toLowerCase());
      const matchesSearch = !searchQuery || cardTitle.includes(searchQuery) || cardDesc.includes(searchQuery) || cardCategory.includes(searchQuery);

      if (matchesCategory && matchesSearch) {
        card.style.display = "flex";
      } else {
        card.style.display = "none";
      }
    });
  };

  if (filterBtns.length) {
    filterBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        filterBtns.forEach((b) => b.classList.remove("is-active"));
        btn.classList.add("is-active");
        activeCategory = btn.dataset.filter || "all";
        filterCards();
      });
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      searchQuery = e.target.value.trim().toLowerCase();
      filterCards();
    });
  }
}

/* ==========================================================================
   WHX Advanced Architecture Interactive Nodes
   ========================================================================== */
function initAdvancedArchitectureInteractions() {
  document.querySelectorAll(".orchestration-node").forEach((node) => {
    node.addEventListener("click", () => {
      const result = node.dataset.orchestrationResult || "";
      const display = document.querySelector(".orchestration-result strong");
      if (display && result) display.textContent = result;
    });
  });

  document.querySelectorAll(".feedback-controls button, .feedback-run").forEach((btn) => {
    btn.addEventListener("click", () => {
      const result = btn.dataset.feedbackResult || "Feedback trace logged for evaluation.";
      const display = document.querySelector(".feedback-result-display strong");
      if (display) display.textContent = result;
    });
  });

  document.querySelectorAll(".enterprise-node").forEach((node) => {
    node.addEventListener("click", () => {
      const result = node.dataset.enterpriseResult || "";
      const display = document.querySelector(".enterprise-readout strong");
      if (display && result) display.textContent = result;
    });
  });

  document.querySelectorAll(".hitl-approve").forEach((btn) => {
    btn.addEventListener("click", () => {
      const action = btn.dataset.hitlAction || "";
      const display = document.querySelector(".hitl-outcome strong");
      if (display && action) {
        if (action === "APPROVE") display.textContent = "Action Approved. Workflow executed and committed to system logs.";
        else if (action === "MODIFY") display.textContent = "Modification Requested. Prompt context returned to engineer for review.";
        else if (action === "REJECT") display.textContent = "Action Rejected. Workflow cancelled and alert logged.";
      }
    });
  });
}

/* ==========================================================================
   WHX Shared FAQ Accordion Component Initialization
   ========================================================================== */
function initFaqAccordions() {
  const faqItems = document.querySelectorAll(".faq-item");
  if (!faqItems.length) return;

  faqItems.forEach((item) => {
    const questionBtn = item.querySelector(".faq-question");
    if (!questionBtn) return;

    questionBtn.addEventListener("click", () => {
      const isOpen = item.classList.contains("is-open");
      const parentGrid = item.closest(".faq-grid");

      // Close sibling items in the same grid
      if (parentGrid && !isOpen) {
        parentGrid.querySelectorAll(".faq-item.is-open").forEach((sibling) => {
          sibling.classList.remove("is-open");
          const sibBtn = sibling.querySelector(".faq-question");
          if (sibBtn) sibBtn.setAttribute("aria-expanded", "false");
        });
      }

      item.classList.toggle("is-open", !isOpen);
      questionBtn.setAttribute("aria-expanded", String(!isOpen));
    });
  });
}

/* ==========================================================================
   WHX Shared Rotating Services Component Initialization
   ========================================================================== */
function initRotatingServices() {
  const containers = document.querySelectorAll(".whx-rotating-services");
  if (!containers.length) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  containers.forEach((container) => {
    const prefixText = container.dataset.rotatePrefix || "";
    const rawItems = container.dataset.rotateItems || "";
    const phrases = rawItems.split("|").map((item) => item.trim()).filter(Boolean);

    if (!phrases.length) return;

    container.innerHTML = "";

    if (prefixText) {
      const prefixSpan = document.createElement("span");
      prefixSpan.className = "whx-rotate-prefix";
      prefixSpan.textContent = prefixText;
      container.appendChild(prefixSpan);
    }

    const viewport = document.createElement("span");
    viewport.className = "whx-rotate-viewport";

    const phraseSpan = document.createElement("span");
    phraseSpan.className = "whx-rotate-phrase is-active";
    phraseSpan.textContent = phrases[0];

    viewport.appendChild(phraseSpan);
    container.appendChild(viewport);

    const trace = document.createElement("span");
    trace.className = "whx-rotate-trace";
    trace.setAttribute("aria-hidden", "true");
    container.appendChild(trace);

    // Measure max width of phrases to prevent layout shift
    const measurer = document.createElement("span");
    measurer.className = "whx-rotate-phrase";
    measurer.style.position = "absolute";
    measurer.style.visibility = "hidden";
    measurer.style.left = "-9999px";
    measurer.style.top = "-9999px";
    measurer.style.pointerEvents = "none";
    document.body.appendChild(measurer);

    let maxW = 0;
    phrases.forEach((phrase) => {
      measurer.textContent = phrase;
      const w = measurer.getBoundingClientRect().width;
      if (w > maxW) maxW = w;
    });
    document.body.removeChild(measurer);

    if (maxW > 0) {
      viewport.style.minWidth = Math.ceil(maxW + 4) + "px";
    }

    if (reducedMotion) return;

    let currentIndex = 0;
    let timer = null;

    const advance = () => {
      currentIndex = (currentIndex + 1) % phrases.length;
      const nextPhrase = phrases[currentIndex];

      phraseSpan.classList.remove("is-active", "is-entering");
      phraseSpan.classList.add("is-exiting");

      setTimeout(() => {
        phraseSpan.textContent = nextPhrase;
        phraseSpan.classList.remove("is-exiting");
        phraseSpan.classList.add("is-entering");

        void phraseSpan.offsetWidth;

        phraseSpan.classList.remove("is-entering");
        phraseSpan.classList.add("is-active");
      }, 380);
    };

    const startTimer = () => {
      if (!timer) {
        timer = setInterval(advance, 2800);
      }
    };

    const stopTimer = () => {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    };

    startTimer();

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        stopTimer();
      } else {
        startTimer();
      }
    });
  });
}
/* ==========================================
   WHX REAL AI CORE & AUTOMATION BOT ENGINE
   ========================================== */
document.addEventListener('DOMContentLoaded', () => {
  const statusBtn = document.getElementById('whxSystemStatus');
  
  if (statusBtn && !document.getElementById('whxDemoBot')) {
    const botHtml = `
      <div id="whxDemoBot" class="whx-demo-bot-overlay" aria-hidden="true">
        <div class="whx-demo-bot-panel">
          <div class="bot-header">
            <div class="bot-header-info">
              <strong>WHX AUTONOMOUS AI AGENT</strong>
              <small><i class="fa-solid fa-circle" style="color:#22c55e; font-size:8px;"></i> RAG Core v4.2 • Latency 8ms • Live</small>
            </div>
            <button id="closeDemoBot" class="bot-close-btn" aria-label="Close AI Assistant">&times;</button>
          </div>
          <div class="bot-quick-chips">
            <button class="bot-chip-btn" data-chip="services">⚡ Core Services</button>
            <button class="bot-chip-btn" data-chip="agents">🤖 Multi-Agent Systems</button>
            <button class="bot-chip-btn" data-chip="n8n">⚙️ n8n & CRM Pipelines</button>
            <button class="bot-chip-btn" data-chip="voice">📞 Voice AI Agents</button>
            <button class="bot-chip-btn" data-chip="rag">🧠 RAG Knowledge Base</button>
            <button class="bot-chip-btn" data-chip="demo">▶️ Test Live Workflow</button>
            <button class="bot-chip-btn" data-chip="contact">✉️ Contact & Upwork</button>
          </div>
          <div class="bot-body" id="botChatArea">
            <div class="bot-msg">
              <span class="bot-avatar"><i class="fa-solid fa-robot"></i></span>
              <div class="bot-bubble">
                <strong>Greetings! I am the WHX Autonomous AI Agent Core.</strong><br/>
                I have indexed all 17 service modules, 31 research insights, and live system architectures across WHX Digital.<br/><br/>
                Ask me any question in English or Urdu about our <em>AI Agents, n8n workflows, CRM automation, RAG knowledge systems, Voice callers, or client proof</em>, or run a live workflow test!
                <div class="bot-options" style="margin-top:12px;">
                  <button class="bot-opt-btn" onclick="triggerBotQuery('services')"><i class="fa-solid fa-cubes"></i> Explore All AI Services</button>
                  <button class="bot-opt-btn" onclick="triggerBotQuery('demo')"><i class="fa-solid fa-play"></i> Run Live Workflow Simulation</button>
                  <button class="bot-opt-btn" onclick="triggerBotQuery('reviews')"><i class="fa-solid fa-star"></i> View 10 Verified Client Reviews</button>
                </div>
              </div>
            </div>
          </div>
          <div class="bot-footer">
            <input type="text" id="botInput" placeholder="Ask about AI agents, n8n, CRM, RAG, Voice AI..." />
            <button class="bot-send-btn" id="botSendBtn" aria-label="Send message"><i class="fa-solid fa-paper-plane"></i></button>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', botHtml);
  }

  const demoBot = document.getElementById('whxDemoBot');
  const closeBtn = document.getElementById('closeDemoBot');
  const chatArea = document.getElementById('botChatArea');
  const botInput = document.getElementById('botInput');
  const botSendBtn = document.getElementById('botSendBtn');

  if (statusBtn && demoBot) {
    statusBtn.addEventListener('click', (e) => {
      e.preventDefault();
      demoBot.classList.add('active');
      demoBot.setAttribute('aria-hidden', 'false');
      if (botInput) botInput.focus();
    });
  }

  if (closeBtn && demoBot) {
    closeBtn.addEventListener('click', () => {
      demoBot.classList.remove('active');
      demoBot.setAttribute('aria-hidden', 'true');
    });
  }

  // Quick Chips listener
  document.querySelectorAll('.bot-chip-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const chipKey = btn.getAttribute('data-chip');
      if (chipKey) processUserIntent(chipKey);
    });
  });

  window.triggerBotQuery = function(key) {
    processUserIntent(key);
  };

  function appendUserMsg(msgText) {
    const div = document.createElement('div');
    div.className = 'bot-msg user';
    div.innerHTML = `
      <span class="bot-avatar"><i class="fa-solid fa-user"></i></span>
      <div class="bot-bubble">${escapeHtml(msgText)}</div>
    `;
    chatArea.appendChild(div);
    chatArea.scrollTop = chatArea.scrollHeight;
  }

  function appendThinkingState() {
    const div = document.createElement('div');
    div.className = 'bot-msg thinking-msg';
    div.id = 'botThinkingMsg';
    div.innerHTML = `
      <span class="bot-avatar"><i class="fa-solid fa-brain" style="color:#a78bfa;"></i></span>
      <div class="bot-bubble" style="background:#f1f5f9; color:#64748b;">
        <span style="font-size:0.8rem; font-family:monospace; font-weight:700;">[RAG Vector Search & Agent Execution...]</span>
        <div class="typing-indicator" style="margin-top:4px;">
          <div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>
        </div>
      </div>
    `;
    chatArea.appendChild(div);
    chatArea.scrollTop = chatArea.scrollHeight;
  }

  function removeThinkingState() {
    const thinking = document.getElementById('botThinkingMsg');
    if (thinking) thinking.remove();
  }

  function appendBotMsg(htmlContent) {
    removeThinkingState();
    const div = document.createElement('div');
    div.className = 'bot-msg';
    div.innerHTML = `
      <span class="bot-avatar"><i class="fa-solid fa-robot"></i></span>
      <div class="bot-bubble">${htmlContent}</div>
    `;
    chatArea.appendChild(div);
    chatArea.scrollTop = chatArea.scrollHeight;
  }

  function processUserIntent(rawInput) {
    const input = rawInput.toLowerCase().trim();
    if (!input) return;

    appendUserMsg(rawInput);
    if (botInput) botInput.value = '';
    appendThinkingState();

    setTimeout(() => {
      // 1. Services / Kaam
      if (input.includes('service') || input.includes('kaam') || input.includes('capabilities') || input.includes('what do you do') || input.includes('whx') || input === 'services') {
        appendBotMsg(`
          <strong>WHX Digital Core Engineering Capabilities:</strong><br/>
          We build autonomous AI workforce systems designed to handle real business operations:
          <div style="margin-top:8px;">
            <a href="multi-agent.html" class="bot-action-badge"><i class="fa-solid fa-network-wired"></i> Multi-Agent Workforce</a>
            <a href="ai-crm-automation.html" class="bot-action-badge"><i class="fa-solid fa-diagram-project"></i> AI CRM & Lead Qualification</a>
            <a href="n8n-automation.html" class="bot-action-badge"><i class="fa-solid fa-gears"></i> n8n Automated Workflows</a>
            <a href="voice.html" class="bot-action-badge"><i class="fa-solid fa-headset"></i> Real-Time Voice AI Agents</a>
            <a href="knowledge.html" class="bot-action-badge"><i class="fa-solid fa-brain"></i> RAG Zero-Hallucination Systems</a>
            <a href="computer-use.html" class="bot-action-badge"><i class="fa-solid fa-desktop"></i> Computer Use & Browser Agents</a>
          </div>
          <div class="bot-options" style="margin-top:10px;">
            <button class="bot-opt-btn" onclick="triggerBotQuery('demo')">▶️ Test Live Workflow</button>
            <button class="bot-opt-btn" onclick="triggerBotQuery('contact')">✉️ Book Consultation</button>
          </div>
        `);
      }
      // 2. CRM / GoHighLevel
      else if (input.includes('crm') || input.includes('gohighlevel') || input.includes('ghl') || input.includes('salesforce') || input.includes('hubspot') || input.includes('lead')) {
        appendBotMsg(`
          <strong>AI CRM & Lead Qualification Automation:</strong><br/>
          WHX Digital integrates AI agents with your CRM to score, qualify, and route incoming leads instantly.
          <div class="bot-workflow-box">➔ TRIGGER: Lead Form Submitted (Name, Email, Budget)<br/>➔ <span class="highlight">RAG SEARCH: Match Lead Profile against ICP database</span><br/>➔ AGENT SCORE: 94/100 (High-Intent Enterprise Lead)<br/>➔ <span class="action">ACTION: Bi-directional sync to CRM & Calendar Invite Sent [OK]</span></div>
          <a href="ai-crm-automation.html" class="bot-action-badge"><i class="fa-solid fa-diagram-project"></i> Explore AI CRM System →</a>
          <a href="gohighlevel-automation.html" class="bot-action-badge"><i class="fa-solid fa-filter"></i> GoHighLevel Snapshot →</a>
        `);
      }
      // 3. n8n & Workflow Pipelines
      else if (input.includes('n8n') || input.includes('workflow') || input.includes('zapier') || input.includes('make') || input === 'n8n') {
        appendBotMsg(`
          <strong>Enterprise n8n Workflow Automation:</strong><br/>
          We engineer self-hosted and cloud n8n workflow engines with automated retries, error alerting, and custom webhook connectors.
          <div class="bot-workflow-box">➔ ENGINE: Self-Hosted n8n Instance<br/>➔ <span class="highlight">WEBHOOK: Multi-party invoice processing</span><br/>➔ PARSER: Extracted line items with 99.8% precision<br/>➔ <span class="action">RESULT: Payout triggered via Stripe API [OK]</span></div>
          <a href="n8n-automation.html" class="bot-action-badge"><i class="fa-solid fa-gears"></i> View n8n Integration Specs →</a>
        `);
      }
      // 4. Voice AI
      else if (input.includes('voice') || input.includes('call') || input.includes('phone') || input.includes('support') || input === 'voice') {
        appendBotMsg(`
          <strong>Real-Time Sub-Second Voice AI Callers:</strong><br/>
          Our Voice AI agents handle inbound support and outbound sales inquiries with natural human latency (&lt; 800ms) and automatic escalation to human staff.
          <div class="bot-workflow-box">➔ TELEPHONY: Twilio / Retell AI SIP Trunk<br/>➔ <span class="highlight">SPEECH-TO-TEXT: Whisper Real-Time Stream</span><br/>➔ LLM DECISION: Intent recognized (Appointment Reschedule)<br/>➔ <span class="action">ACTION: Calendar updated & SMS Confirmation Sent</span></div>
          <a href="voice.html" class="bot-action-badge"><i class="fa-solid fa-headset"></i> Test Voice AI Agent Demo →</a>
        `);
      }
      // 5. RAG / Knowledge
      else if (input.includes('rag') || input.includes('knowledge') || input.includes('vector') || input.includes('document') || input.includes('pdf')) {
        appendBotMsg(`
          <strong>RAG & Enterprise Knowledge Systems:</strong><br/>
          We connect your company's PDFs, Notion pages, and SQL databases into high-precision vector search indexes (Pinecone / Qdrant) for 100% hallucination-free AI answers.
          <a href="knowledge.html" class="bot-action-badge"><i class="fa-solid fa-brain"></i> Explore RAG Architecture →</a>
        `);
      }
      // 6. Contact / Upwork / Hire / Price
      else if (input.includes('contact') || input.includes('upwork') || input.includes('linkedin') || input.includes('email') || input.includes('hire') || input.includes('price') || input.includes('cost')) {
        appendBotMsg(`
          <strong>Connect with WHX Digital Engineering:</strong><br/>
          We partner with enterprises, agencies, and founders globally:
          <div style="margin-top:8px;">
            <a href="https://www.upwork.com/freelancers/~0187ee99ef01623869?mp_source=share" target="_blank" rel="noopener noreferrer" class="bot-action-badge" style="background:#14a800; color:#fff; border-color:#14a800;"><i class="fa-brands fa-upwork"></i> Verified Upwork Profile</a>
            <a href="https://www.linkedin.com/in/whxdigital?originalSubdomain=pt" target="_blank" rel="noopener noreferrer" class="bot-action-badge" style="background:#0a66c2; color:#fff; border-color:#0a66c2;"><i class="fa-brands fa-linkedin"></i> LinkedIn Profile</a>
          </div>
          <div style="margin-top:10px; font-size:0.88rem; color:#475569;">
            <i class="fa-solid fa-envelope" style="color:#7c3aed;"></i> <strong>info@whxdigital.com</strong><br/>
            <i class="fa-solid fa-envelope" style="color:#7c3aed;"></i> <strong>whxdigital@gmail.com</strong>
          </div>
        `);
      }
      // 7. Reviews / Proof
      else if (input.includes('review') || input.includes('proof') || input.includes('client') || input.includes('testimonial') || input.includes('rating')) {
        appendBotMsg(`
          <strong>1 Verified Client Review:</strong><br/>
          Check our verified client feedback from SEO Benchmark:
          <a href="reviews.html" class="bot-action-badge"><i class="fa-solid fa-star" style="color:#eab308;"></i> Explore 1 Verified Client Review →</a>
        `);
      }
      // 8. Live Workflow Simulation Demo
      else if (input.includes('demo') || input.includes('test') || input.includes('run') || input.includes('agents')) {
        runInteractiveWorkflowSimulation();
      }
      // 9. General Intelligent Fallback
      else {
        appendBotMsg(`
          <strong>WHX Autonomous AI Intelligence Response:</strong><br/>
          I processed your query: <em>"${escapeHtml(rawInput)}"</em>.<br/><br/>
          WHX Digital designs self-healing multi-agent workflows, custom n8n pipelines, Voice AI callers, and zero-hallucination RAG knowledge engines.
          <div class="bot-options" style="margin-top:12px;">
            <button class="bot-opt-btn" onclick="triggerBotQuery('services')">⚡ Explore Core Services</button>
            <button class="bot-opt-btn" onclick="triggerBotQuery('demo')">▶️ Run Workflow Simulation</button>
            <button class="bot-opt-btn" onclick="triggerBotQuery('contact')">✉️ Contact & Upwork Profile</button>
          </div>
        `);
      }
    }, 700);
  }

  function runInteractiveWorkflowSimulation() {
    appendBotMsg(`
      <strong>Initializing WHX Live Workflow Test...</strong>
      <div class="bot-workflow-box" id="botSimLog">➔ [0ms] ⚡ INITIATING EVENT LISTENERS...</div>
    `);

    const simLog = document.getElementById('botSimLog');
    if (!simLog) return;

    setTimeout(() => {
      simLog.innerHTML += `<br/>➔ [140ms] <span class="highlight">🧠 RAG: Querying Pinecone Vector Index... Score 0.98</span>`;
      chatArea.scrollTop = chatArea.scrollHeight;
    }, 600);

    setTimeout(() => {
      simLog.innerHTML += `<br/>➔ [320ms] 🤖 AGENT: Evaluating Human-in-the-Loop approval criteria...`;
      chatArea.scrollTop = chatArea.scrollHeight;
    }, 1200);

    setTimeout(() => {
      simLog.innerHTML += `<br/>➔ [540ms] <span class="action">🔄 ACTION: Bi-directional CRM Sync & Slack Notification Sent [OK]</span>`;
      chatArea.scrollTop = chatArea.scrollHeight;

      setTimeout(() => {
        appendBotMsg(`
          <strong>Workflow Simulation Completed in 540ms!</strong><br/>
          All execution state checkpoints passed successfully.
          <div class="bot-options" style="margin-top:8px;">
            <button class="bot-opt-btn" onclick="triggerBotQuery('services')">⚡ Learn more about our Architecture</button>
            <button class="bot-opt-btn" onclick="triggerBotQuery('contact')">✉️ Hire WHX Digital for your project</button>
          </div>
        `);
      }, 500);
    }, 1800);
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  if (botSendBtn && botInput) {
    botSendBtn.addEventListener('click', () => {
      const val = botInput.value.trim();
      if (val) processUserIntent(val);
    });

    botInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        botSendBtn.click();
      }
    });
  }

  // Initialize review filter on reviews.html
  initReviewsFilter();
});

/* ==========================================================================
   WHX Multi-Platform Reviews Filter
   ========================================================================== */
function initReviewsFilter() {
  const filterBtns = document.querySelectorAll('.review-filter-btn');
  const reviewCards = document.querySelectorAll('.review-card[data-source]');
  if (!filterBtns.length || !reviewCards.length) return;

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const source = btn.getAttribute('data-filter');

      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      reviewCards.forEach((card) => {
        const cardSource = card.getAttribute('data-source');
        if (source === 'all' || cardSource === source) {
          card.style.display = 'flex';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
          card.style.opacity = '0';
        }
      });
    });
  });
}


/* ==========================================================================
   CONTACT FORM N8N INTEGRATION
   ========================================================================== */

// Configure the real n8n production webhook URL here
// Expected n8n workflow: Webhook -> Validate -> Store Lead -> Notify -> Return { success: true }
const WHX_CONTACT_WEBHOOK_URL = "https://n8n.whxdigital.com/webhook/contact-form";

document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('whx-contact-form');
  if (contactForm) {
    const formRenderTime = Date.now();

    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const statusDiv = document.getElementById('form-status');
      const submitBtn = document.getElementById('form-submit-btn');
      
      // Basic Spam Protection (Honeypot + Time Check)
      const honeypot = document.getElementById('bot_field').value;
      const timeElapsed = Date.now() - formRenderTime;
      
      if (honeypot || timeElapsed < 2000) {
        statusDiv.style.display = 'block';
        statusDiv.style.background = '#dcfce7';
        statusDiv.style.color = '#16a34a';
        statusDiv.innerText = "Thanks - your automation request has been received.";
        contactForm.reset();
        return;
      }

      // Gather Data
      const payload = {
        source: "WHX Digital Website",
        name: document.getElementById('form-name').value.trim(),
        email: document.getElementById('form-email').value.trim(),
        company: document.getElementById('form-company').value.trim(),
        automationGoal: document.getElementById('form-goal').value.trim(),
        currentTools: document.getElementById('form-tools').value.trim(),
        pageUrl: window.location.href,
        submittedAt: new Date().toISOString()
      };

      if (!payload.name || !payload.email || !payload.automationGoal) {
        statusDiv.style.display = 'block';
        statusDiv.style.background = '#fee2e2';
        statusDiv.style.color = '#b91c1c';
        statusDiv.innerText = "Please fill in all required fields.";
        return;
      }

      submitBtn.disabled = true;
      submitBtn.innerText = "PROCESSING...";
      submitBtn.style.opacity = "0.7";
      statusDiv.style.display = 'none';

      const trace = document.getElementById('whx-trace-lines');
      const log = (msg, col = '#059669') => {
        if(!trace) return;
        trace.innerHTML += `<div class="trace-line" style="color:${col};">[ ${new Date().toISOString().substring(11,23)} ] ${msg}</div>`;
        trace.parentElement.scrollTop = trace.parentElement.scrollHeight;
      };
      
      const setNode = (i, state) => {
        const n = document.getElementById('node-'+i);
        const b = document.getElementById('badge-'+i);
        if(n) {
          n.style.borderColor = state === 'success' ? '#10b981' : state === 'error' ? '#ef4444' : state === 'active' ? '#7c3aed' : '';
          n.style.background = state === 'active' ? 'rgba(124, 58, 237, 0.05)' : '';
        }
        if(b) {
          b.textContent = state.toUpperCase();
          b.style.background = state === 'success' ? '#dcfce7' : state === 'error' ? '#fee2e2' : state === 'active' ? '#f3e8ff' : '';
          b.style.color = state === 'success' ? '#16a34a' : state === 'error' ? '#dc2626' : state === 'active' ? '#7c3aed' : '';
        }
      };

      if(trace) trace.innerHTML = '';
      log("INIT: Webhook payload compiled.");
      setNode(1, 'active');
      await new Promise(r => setTimeout(r, 400));
      setNode(1, 'success');
      
      setNode(2, 'active');
      log("VALIDATE: Schema check passed.");
      await new Promise(r => setTimeout(r, 400));
      setNode(2, 'success');
      
      setNode(3, 'active');
      log("CLASSIFY: Intent identified as Inbound Contact.");
      
      try {
        const fetchPromise = fetch(WHX_CONTACT_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        
        await new Promise(r => setTimeout(r, 400));
        setNode(3, 'success');
        setNode(4, 'active');
        log("ROUTE: Establishing secure connection to n8n backend...");
        
        const response = await fetchPromise;

        setNode(4, 'success');
        setNode(5, 'active');
        
        if (response.ok) {
          log("NOTIFY: Delivery confirmed by backend.");
          setNode(5, 'success');
          setNode(6, 'success');
          log("COMPLETE: System standby.");
          
          statusDiv.style.display = 'block';
          statusDiv.style.background = '#dcfce7';
          statusDiv.style.color = '#16a34a';
          statusDiv.innerHTML = '<i class="fa-solid fa-check-circle"></i> Thanks - your automation request has been received.';
          contactForm.reset();
        } else {
          throw new Error("Server returned non-2xx response");
        }
      } catch (error) {
        console.error("Webhook submission error:", error);
        setNode(4, 'error');
        setNode(5, 'error');
        setNode(6, 'error');
        log("SYS_ERR: Connection timed out or rate limited.", '#ef4444');
        
        statusDiv.style.display = 'block';
        statusDiv.style.background = '#fee2e2';
        statusDiv.style.color = '#b91c1c';
        statusDiv.innerText = "AI assistant is temporarily unavailable. You can still send your automation request to WHX Digital.";
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerText = "Tell us what you want to automate";
        submitBtn.style.opacity = "1";
      }
    });
  }
});

/* ==========================================================================
   WHX SYSTEM STATUS PANEL INTERACTION
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  const badge = document.getElementById('whxSystemStatus');
  const panel = document.getElementById('whxStatusPanel');
  const closeBtn = document.getElementById('whxCloseStatus');

  if (!badge || !panel) return;

  function openPanel() {
    badge.setAttribute('aria-expanded', 'true');
    panel.classList.add('is-open');
    panel.setAttribute('aria-hidden', 'false');
  }

  function closePanel() {
    badge.setAttribute('aria-expanded', 'false');
    panel.classList.remove('is-open');
    panel.setAttribute('aria-hidden', 'true');
  }

  badge.addEventListener('click', (e) => {
    e.stopPropagation();
    if (panel.classList.contains('is-open')) {
      closePanel();
    } else {
      openPanel();
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closePanel();
    });
  }

  document.addEventListener('click', (e) => {
    if (panel.classList.contains('is-open') && !panel.contains(e.target) && !badge.contains(e.target)) {
      closePanel();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && panel.classList.contains('is-open')) {
      closePanel();
    }
  });

  // Optional module inspection
  const moduleItems = panel.querySelectorAll('.status-module-item');
  moduleItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      item.classList.toggle('is-expanded');
    });
  });
});




// WHX Interactive Modals & Workflow System
(function() {
  if (typeof document === 'undefined') return;

  const interactiveItems = {
    'aidecision': {
      title: 'AI Decision',
      description: 'The AI evaluates available context, business rules and workflow data to determine the appropriate next action.',
      points: [
        'Inputs: business context, CRM data, knowledge, rules',
        'Decision: classify / route / respond / escalate',
        'Safeguard: important decisions can require human approval'
      ],
      status: 'DECIDE',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>'
    },
    'policycheck': {
      title: 'Policy Check',
      description: 'Before an action is executed, the workflow can validate permissions, business rules and operational restrictions.',
      points: [
        'Permission checks',
        'Required conditions',
        'Restricted actions',
        'Compliance with configured business rules'
      ],
      status: 'CHECK',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>'
    },
    'humanapproval': {
      title: 'Human Approval',
      description: 'Sensitive or high-impact actions can pause and wait for an authorized person before execution.',
      points: [
        'Approval required',
        'Reject / Approve',
        'Human-in-the-loop control',
        'Audit trail where configured'
      ],
      status: 'APPROVE',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>'
    },
    'apiaction': {
      title: 'API Action',
      description: 'After validation, the system can call an approved API or connected business application to perform the required action.',
      points: [
        'CRM updates',
        'API requests',
        'Notifications',
        'Database actions',
        'External business tools'
      ],
      status: 'ACT',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24"><path d="M18 8h1a4 4 0 0 1 0 8h-1M6 8H5a4 4 0 0 0 0 8h1M2 12h20"/></svg>'
    },
    'verification': {
      title: 'Verification',
      description: 'The workflow checks whether the requested action completed successfully before marking the task complete.',
      points: [
        'Response validation',
        'Error detection',
        'Retry / queue logic',
        'Final result confirmation'
      ],
      status: 'VERIFY',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg>'
    },
    'openai': {
      title: 'OpenAI',
      description: 'AI model and API platform used for language, reasoning and AI-powered application workflows.',
      points: [
        'AI agents',
        'structured extraction',
        'reasoning workflows',
        'support automation',
        'CRM automation',
        'API-driven AI tasks'
      ],
      integration: 'Usually connected through secure server-side API calls.',
      icon: '<svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2057 5.9847 5.9847 0 0 0 3.989-2.9 6.051 6.051 0 0 0-.7388-7.0732zM13.2599 22.5002c-1.258 0-2.4411-.565-3.2354-1.55l.081-.0447 5.3409-3.0844v-6.3268l3.6558 2.1107c.026.015.051.0298.0779.043v5.2758a4.57 4.57 0 0 1-5.9202 3.5764zm-8.2323-2.1228a4.5682 4.5682 0 0 1-1.0778-6.8533l.081.047 5.3409 3.0844v6.3268l-3.6558-2.1107c-.027-.015-.052-.03-.0789-.044zM3.483 8.3512a4.5682 4.5682 0 0 1 4.8424-4.954l-.04.0722-2.671 4.626-5.4804 3.1645v-4.2215c0-.03.0039-.06.0118-.0887zM10.74 1.4998c1.258 0 2.4411.565 3.2354 1.55l-.081.0447-5.3409 3.0844v6.3268L4.8977 10.395c-.026-.015-.051-.0298-.0779-.043V5.0762a4.57 4.57 0 0 1 5.9202-3.5764zm8.2323 2.1228a4.5682 4.5682 0 0 1 1.0778 6.8533l-.081-.047-5.3409-3.0844V4.9733l3.6558 2.1107c.027.015.052.03.0789.044zm2.8048 9.1764a4.5682 4.5682 0 0 1-4.8424 4.954l.04-.0722 2.671-4.626 5.4804-3.1645v4.2215c0 .03-.0039.06-.0118.0887zM12 15.539l-3.0642-1.769v-3.538L12 8.461l3.0642 1.769v3.538L12 15.539z"/></svg>'
    },
    'gemini': {
      title: 'Gemini',
      description: 'Google\'s AI model ecosystem for multimodal and generative AI workflows.',
      points: [
        'AI agents',
        'multimodal workflows',
        'business automation',
        'structured reasoning',
        'AI-assisted data processing'
      ],
      icon: '<svg viewBox="0 0 24 24" width="24" height="24"><path d="M12 0l2 8 8 2-8 2-2 8-2-8-8-2 8-2z" fill="#4285f4"/><circle cx="18" cy="6" r="3" fill="#ea4335"/><circle cx="6" cy="18" r="3" fill="#fbbc04"/></svg>'
    },
    'claude': {
      title: 'Claude',
      description: 'An AI model platform that can support reasoning, content understanding and workflow automation.',
      points: [
        'document workflows',
        'reasoning',
        'agent tasks',
        'structured analysis'
      ],
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24"><path d="M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4"/><polyline points="14 2 14 8 20 8"/><path d="M2 15h10M6 11l-4 4 4 4"/></svg>'
    },
    'n8n': {
      title: 'n8n',
      description: 'A workflow automation platform used to connect APIs, applications and AI systems.',
      points: [
        'webhooks',
        'CRM automation',
        'API orchestration',
        'AI workflows',
        'notifications',
        'database workflows'
      ],
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="#ea3a66" stroke-width="2" width="24" height="24"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5" fill="#ea3a66"/><circle cx="15.5" cy="8.5" r="1.5" fill="#ea3a66"/><circle cx="12" cy="15.5" r="1.5" fill="#ea3a66"/><path d="M8.5 10v3.5a2 2 0 0 0 2 2h1.5M15.5 10v3.5a2 2 0 0 1-2 2h-1.5"/></svg>'
    },
    'make': {
      title: 'Make',
      description: 'A visual automation platform for connecting applications and business workflows.',
      points: [
        'application integrations',
        'workflow automation',
        'data routing',
        'API workflows'
      ],
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><path d="M12 2v6M12 16v6M2 12h6M16 12h6"/></svg>'
    },
    'gohighlevel': {
      title: 'GoHighLevel',
      description: 'A CRM and automation platform commonly used for lead management, pipelines, communication and appointments.',
      points: [
        'lead routing',
        'CRM automation',
        'Voice AI workflows',
        'appointment workflows',
        'pipeline updates'
      ],
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24"><path d="M2 20h20M5 20V8l7-6 7 6v12M9 20v-6h6v6"/></svg>'
    },
    'restapis': {
      title: 'REST APIs',
      description: 'REST APIs allow software systems to exchange data and trigger actions.',
      points: [
        'CRM integration',
        'AI provider integration',
        'custom software',
        'databases',
        'workflow triggers',
        'external systems'
      ],
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>'
    },
    'seobenchmark': {
      title: 'SEO Benchmark',
      description: 'SEO Benchmark is a digital marketing and SEO platform/business associated with WHX\'s broader operating experience.',
      link: 'https://seobenchmark.com/',
      linkText: 'Visit SEO Benchmark',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24"><path d="M3 3v18h18"/><path d="M18 9l-5 5-4-4-5 5"/></svg>'
    }
  };

  // Convert texts to keys
  const mapping = {
    'ai decision': 'aidecision',
    'policy check': 'policycheck',
    'human approval': 'humanapproval',
    'api action': 'apiaction',
    'verification': 'verification',
    'openai': 'openai',
    'gemini': 'gemini',
    'claude': 'claude',
    'n8n': 'n8n',
    'make': 'make',
    'gohighlevel': 'gohighlevel',
    'rest api': 'restapis',
    'rest apis': 'restapis',
    'seo benchmark': 'seobenchmark'
  };

  document.addEventListener('DOMContentLoaded', () => {
    // Inject Dialog Modal
    const dialogHTML = `
      <dialog id="whx-info-modal" class="whx-info-modal">
        <div class="whx-modal-content">
          <button class="whx-modal-close" aria-label="Close" type="button">&times;</button>
          <div class="whx-modal-header">
            <div class="whx-modal-icon" id="whx-modal-icon"></div>
            <h3 id="whx-modal-title"></h3>
            <span id="whx-modal-status" class="whx-modal-status"></span>
          </div>
          <div class="whx-modal-body">
            <p id="whx-modal-desc"></p>
            <h4 id="whx-modal-cases-title">Use cases & workflows</h4>
            <ul id="whx-modal-list"></ul>
            <p id="whx-modal-integration" class="whx-integration-text"></p>
            <div id="whx-modal-link-container"></div>
          </div>
        </div>
      </dialog>
    `;
    document.body.insertAdjacentHTML('beforeend', dialogHTML);

    const modal = document.getElementById('whx-info-modal');
    const closeBtn = modal.querySelector('.whx-modal-close');
    
    closeBtn.addEventListener('click', () => modal.close());
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.close();
    });

    let currentTrigger = null;
    modal.addEventListener('close', () => {
      if (currentTrigger) {
        currentTrigger.focus();
        currentTrigger.classList.remove('is-active-node');
      }
      document.querySelectorAll('.whx-interactive-pill').forEach(el => el.classList.remove('is-dimmed'));
    });

    // Find and upgrade elements
    const elementsToCheck = document.querySelectorAll('.tech-pill, .process-node, .workflow-step, .core-node, .badge, .decision-split, .approval-decision, .approval-card, .hitl-decision-card, .hitl-review-card, .capability-pill');
    
    elementsToCheck.forEach(el => {
      if (el.tagName === 'A') return; // Skip links
      
      const text = el.textContent.toLowerCase();
      let matchedKey = null;
      
      for (const [phrase, key] of Object.entries(mapping)) {
        if (text.includes(phrase)) {
          matchedKey = key;
          break;
        }
      }

      if (matchedKey) {
        // Upgrade element
        el.classList.add('whx-interactive-pill');
        el.setAttribute('role', 'button');
        el.setAttribute('tabindex', '0');
        el.setAttribute('aria-haspopup', 'dialog');
        
        const handler = (e) => {
          e.preventDefault();
          e.stopPropagation();
          currentTrigger = el;
          
          // Visual connection logic
          document.querySelectorAll('.whx-interactive-pill').forEach(other => {
            if (other !== el) other.classList.add('is-dimmed');
            else other.classList.remove('is-dimmed');
          });
          el.classList.add('is-active-node');

          // Populate modal
          const data = interactiveItems[matchedKey];
          document.getElementById('whx-modal-icon').innerHTML = data.icon;
          document.getElementById('whx-modal-title').textContent = data.title;
          document.getElementById('whx-modal-desc').textContent = data.description;
          
          if (data.status) {
            document.getElementById('whx-modal-status').textContent = data.status;
            document.getElementById('whx-modal-status').style.display = 'inline-block';
          } else {
            document.getElementById('whx-modal-status').style.display = 'none';
          }

          const listContainer = document.getElementById('whx-modal-list');
          if (data.points && data.points.length > 0) {
            document.getElementById('whx-modal-cases-title').style.display = 'block';
            listContainer.style.display = 'block';
            listContainer.innerHTML = data.points.map(p => `<li>${p}</li>`).join('');
          } else {
            document.getElementById('whx-modal-cases-title').style.display = 'none';
            listContainer.style.display = 'none';
          }

          const intText = document.getElementById('whx-modal-integration');
          if (data.integration) {
            intText.textContent = data.integration;
            intText.style.display = 'block';
          } else {
            intText.style.display = 'none';
          }

          const linkCont = document.getElementById('whx-modal-link-container');
          if (data.link) {
            linkCont.innerHTML = `<a href="${data.link}" target="_blank" rel="noopener noreferrer" class="whx-modal-btn">${data.linkText}</a>`;
          } else {
            linkCont.innerHTML = '';
          }

          modal.showModal();
        };

        el.addEventListener('click', handler);
        el.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handler(e);
          }
        });
      }
    });

    // Also upgrade the explicit terms inside the "whx-rotating-services" or pure text spans if needed
    // But since they are dynamic or text, applying to class lists is safer.
  });
})();

// Code Vibe Modal Interaction
document.addEventListener('DOMContentLoaded', () => {
  // Ensure the modal HTML exists in the document
  let codeModal = document.getElementById('codeVibeModal');
  if (!codeModal) {
    const modalHTML = `
      <div id="codeVibeModal" class="code-vibe-modal" style="display:none;">
        <div class="code-vibe-window">
          <div class="code-vibe-header">
            <div class="code-vibe-title" id="codeVibeTitle">whx-systems-core.js</div>
            <button class="code-vibe-close">&times;</button>
          </div>
          <div class="code-vibe-body">
            <pre><code id="codeVibeContent"></code></pre>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    codeModal = document.getElementById('codeVibeModal');
  }

  const closeBtn = document.querySelector('.code-vibe-close');
  const codeContent = document.getElementById('codeVibeContent');
  const modalTitle = document.getElementById('codeVibeTitle');
  
  const triggers = document.querySelectorAll('.system-online-indicator, .status-text');

  const topCodeString = `// ==========================================
// WHX DIGITAL - AUTONOMOUS AI CLUSTER
// ==========================================

import { AgentCluster, CRMConnector, Orchestrator } from '@whx/core';

async function bootNextGenSystems() {
  console.log('[CLUSTER] Initializing next-gen AI systems...');
  const orchestrator = new Orchestrator({ concurrency: 100 });
  
  console.log('[CLUSTER] Establishing CRM webhooks...');
  await CRMConnector.sync({ provider: 'GoHighLevel', mode: 'real-time' });

  console.log('[CLUSTER] Deploying reasoning models...');
  orchestrator.registerModels(['gpt-4o', 'gemini-1.5-pro']);
  
  console.log('[CLUSTER] ALL SYSTEMS ONLINE. AWAITING TRIGGERS.');
  return { status: 200, message: 'Operational' };
}

bootNextGenSystems();`;

  const footerCodeString = `// ==========================================
// WHX DIGITAL - NETWORK & HEALTH STATUS
// ==========================================

import { SystemMonitor, Telemetry } from '@whx/monitoring';

async function runHealthDiagnostic() {
  console.log('[MONITOR] Pinging AI provider endpoints...');
  const latency = await SystemMonitor.ping(['OpenAI', 'Gemini', 'Anthropic']);
  
  console.log('[MONITOR] Verifying webhook listeners...');
  const webhooks = await Telemetry.checkActiveRoutes();
  
  console.log('[MONITOR] Checking n8n automation instances...');
  const n8nStatus = await SystemMonitor.checkEngine('n8n');

  if (latency.ok && webhooks.active && n8nStatus === 'healthy') {
    console.log('[STATUS] AI SYSTEMS OPERATIONAL. 99.99% UPTIME.');
  }
}

runHealthDiagnostic();`;

  let typingTimeout;

  triggers.forEach(trigger => {
    if (trigger.classList.contains('system-online-indicator') || trigger.textContent.includes('AI Systems Operational')) {
      trigger.style.cursor = 'pointer';
      
      trigger.addEventListener('click', () => {
        const isTop = trigger.classList.contains('system-online-indicator');
        const codeString = isTop ? topCodeString : footerCodeString;
        
        if (modalTitle) {
          modalTitle.textContent = isTop ? 'whx-autonomous-cluster.js' : 'whx-health-monitor.js';
        }

        codeModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        codeContent.innerHTML = '';
        
        if (typingTimeout) clearTimeout(typingTimeout);
        
        let i = 0;
        function typeWriter() {
          if (i < codeString.length) {
            codeContent.innerHTML += codeString.charAt(i);
            i++;
            typingTimeout = setTimeout(typeWriter, 15);
          }
        }
        typeWriter();
      });
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      codeModal.style.display = 'none';
      document.body.style.overflow = 'auto';
      if (typingTimeout) clearTimeout(typingTimeout);
    });
  }
});
