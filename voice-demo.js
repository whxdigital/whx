document.addEventListener('DOMContentLoaded', () => {
  const timerEl = document.getElementById('demo-timer');
  const transcriptBox = document.getElementById('transcript-box');
  const callerWave = document.getElementById('caller-wave');
  const aiWave = document.getElementById('ai-wave');

  if (!timerEl || !transcriptBox) return;

  // 1. Timer logic
  let seconds = 0;
  setInterval(() => {
    seconds++;
    if (seconds > 600) return; // cap at 10 minutes visually if they stay that long
    const m = String(Math.floor(seconds / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    timerEl.textContent = ${m}:;
  }, 1000);

  // 2. Scenarios
  const scenarios = [
    [
      { speaker: 'ai', text: "Hi, this is the WHX routing assistant. How can I help you today?", delay: 1000, duration: 2500 },
      { speaker: 'user', text: "Yeah, hi. I'm looking to automate my lead qualification. We use GoHighLevel.", delay: 1000, duration: 3500 },
      { speaker: 'ai', text: "Great. GoHighLevel is fully supported. Are you looking to qualify via SMS, email, or inbound voice?", delay: 1000, duration: 4000 },
      { speaker: 'user', text: "Mostly inbound voice calls. We get too many unqualified leads taking up sales time.", delay: 1500, duration: 3500 },
      { speaker: 'tool', text: "SYSTEM_ACTION: CHECK_GHL_INTEGRATION_CAPABILITY", delay: 500, duration: 1500 },
      { speaker: 'ai', text: "Understood. I can set up a Voice AI agent that answers instantly, asks your qualifying questions, and books the qualified leads directly into your GoHighLevel calendar.", delay: 1000, duration: 6000 },
      { speaker: 'user', text: "That sounds perfect. How long does deployment take?", delay: 1000, duration: 2500 },
      { speaker: 'ai', text: "Typically 2 to 3 weeks including CRM integration, prompt engineering, and latency optimization. Should I connect you with an engineer?", delay: 1000, duration: 5000 },
      { speaker: 'user', text: "Yes, please.", delay: 800, duration: 1500 },
      { speaker: 'tool', text: "SYSTEM_ACTION: INITIATE_HUMAN_HANDOFF", delay: 500, duration: 2000 },
      { speaker: 'ai', text: "Transferring you to an engineer now. Please hold.", delay: 1000, duration: 3000 }
    ],
    [
      { speaker: 'ai', text: "Hello, you've reached WHX Digital support. Are you calling about an existing system deployment?", delay: 1500, duration: 3500 },
      { speaker: 'user', text: "Yes, our n8n workflow for invoice processing stalled this morning.", delay: 1000, duration: 3000 },
      { speaker: 'tool', text: "SYSTEM_ACTION: QUERY_N8N_TELEMETRY", delay: 500, duration: 1500 },
      { speaker: 'ai', text: "I see a stalled execution in the accounting sub-workflow at 9:15 AM due to a QuickBooks API timeout. Should I automatically retry the failed nodes?", delay: 1000, duration: 6500 },
      { speaker: 'user', text: "Yes, go ahead and retry them.", delay: 1500, duration: 2000 },
      { speaker: 'tool', text: "SYSTEM_ACTION: TRIGGER_N8N_RETRY_WORKFLOW", delay: 500, duration: 2000 },
      { speaker: 'ai', text: "The retry command has been sent. The webhook responded successfully and 14 invoices were processed. Is there anything else you need?", delay: 1500, duration: 5500 },
      { speaker: 'user', text: "Wow, that was fast. No, that's all. Thank you.", delay: 1000, duration: 2500 },
      { speaker: 'ai', text: "You're welcome. Have a great day.", delay: 500, duration: 2000 }
    ],
    [
      { speaker: 'ai', text: "Thank you for calling. Are you looking to schedule an AI strategy consultation?", delay: 1000, duration: 3500 },
      { speaker: 'user', text: "Yes, I wanted to see if you have time on Thursday afternoon.", delay: 1000, duration: 3000 },
      { speaker: 'tool', text: "SYSTEM_ACTION: FETCH_CALENDAR_AVAILABILITY(Thursday, PM)", delay: 800, duration: 1500 },
      { speaker: 'ai', text: "I have availability this Thursday at 2:00 PM or 4:30 PM EST. Do either of those work for you?", delay: 1000, duration: 4500 },
      { speaker: 'user', text: "2 PM works perfectly.", delay: 1500, duration: 2000 },
      { speaker: 'ai', text: "Great. Could you provide your work email so I can send the calendar invite?", delay: 1000, duration: 3500 },
      { speaker: 'user', text: "It's alex at techops dot com.", delay: 1000, duration: 3000 },
      { speaker: 'tool', text: "SYSTEM_ACTION: CREATE_CALENDAR_EVENT(alex@techops.com, Thursday 2:00 PM EST)", delay: 1000, duration: 2000 },
      { speaker: 'ai', text: "The consultation is booked. You should receive a calendar invite shortly. We look forward to speaking with you.", delay: 1500, duration: 4500 },
      { speaker: 'user', text: "Thanks, bye.", delay: 500, duration: 1000 }
    ]
  ];

  // Pick a random scenario
  const selectedScenario = scenarios[Math.floor(Math.random() * scenarios.length)];

  // 3. Playback Logic
  let stepIndex = 0;

  function appendToolAction(text) {
    const el = document.createElement('div');
    el.className = 'tool-call-banner';
    el.innerHTML = '<i class="fa-solid fa-bolt"></i> ' + text;
    transcriptBox.appendChild(el);
    transcriptBox.scrollTop = transcriptBox.scrollHeight;
  }

  function appendChat(speaker, text) {
    const row = document.createElement('div');
    row.className = 'transcript-row ' + speaker;
    
    const name = document.createElement('div');
    name.className = 'transcript-name';
    name.textContent = speaker === 'ai' ? 'WHX VOICE AI' : 'CALLER';
    
    const bubble = document.createElement('div');
    bubble.className = 'transcript-bubble';
    
    row.appendChild(name);
    row.appendChild(bubble);
    transcriptBox.appendChild(row);
    transcriptBox.scrollTop = transcriptBox.scrollHeight;

    return bubble; // to type into it
  }

  function typeText(element, text, duration, callback) {
    let charIndex = 0;
    // Calculate interval based on string length and duration
    const interval = Math.max(30, duration / text.length);
    
    const timer = setInterval(() => {
      element.textContent += text.charAt(charIndex);
      charIndex++;
      transcriptBox.scrollTop = transcriptBox.scrollHeight;
      if (charIndex >= text.length) {
        clearInterval(timer);
        if(callback) callback();
      }
    }, interval);
  }

  function processNextStep() {
    if (stepIndex >= selectedScenario.length) {
      setTimeout(() => {
        const el = document.createElement('div');
        el.style = "text-align: center; color: #64748b; font-size: 0.85rem; margin-top: 10px;";
        el.textContent = "Call disconnected.";
        transcriptBox.appendChild(el);
        transcriptBox.scrollTop = transcriptBox.scrollHeight;
      }, 1000);
      return;
    }

    const step = selectedScenario[stepIndex];
    stepIndex++;

    setTimeout(() => {
      if (step.speaker === 'tool') {
        appendToolAction(step.text);
        processNextStep();
      } else {
        // Activate wave
        const wave = step.speaker === 'ai' ? aiWave : callerWave;
        wave.classList.add('active');
        
        const bubble = appendChat(step.speaker, "");
        typeText(bubble, step.text, step.duration, () => {
          // Deactivate wave
          wave.classList.remove('active');
          processNextStep();
        });
      }
    }, step.delay);
  }

  // Start the simulation slightly after page load
  setTimeout(() => {
    processNextStep();
  }, 1500);

});
