/**
 * ARTEMIS IV: GATEWAY TO THE MOON
 * Team Éclipse for NASA's SpaceAppsChallenge.org
 * 
 * capcom.js - CAPCOM AI Offline Aerospace Knowledge Engine
 * 18+ In-Depth Scientific & Mission Intent Handlers + Quick Chips
 */

class CapcomChatbot {
  constructor() {
    this.isOpen = false;
    this.messages = [];
    this.intents = [
      {
        id: "artemis4",
        triggers: ["artemis 4", "artemis iv", "what is artemis", "mission overview", "objective"],
        chip: "What is Artemis IV?",
        title: "Artemis IV Mission Overview",
        response: "Artemis IV is NASA's first crewed mission to dock with the Lunar Gateway in Near-Rectilinear Halo Orbit (NRHO) and conduct a lunar South Pole landing. Scheduled for the late 2020s, it debuts the super-heavy SLS Block 1B rocket with the Exploration Upper Stage (EUS) and delivers the European/JAXA International Habitat (I-Hab) module to the Gateway."
      },
      {
        id: "sls_block1b",
        triggers: ["sls", "block 1b", "rocket", "core stage", "booster", "heavy lift"],
        chip: "What is SLS Block 1B?",
        title: "Space Launch System Block 1B",
        response: "SLS Block 1B replaces the single-engine ICPS used on Artemis I–III with the Exploration Upper Stage (EUS). Standing 322 ft tall, it generates 8.8 million lbs of thrust at liftoff using twin 5-segment solid rocket boosters and 4 RS-25 liquid hydrogen/oxygen core engines. It can deliver 38 metric tons to Trans-Lunar Injection (TLI), co-manifesting Orion and large space station modules like I-Hab."
      },
      {
        id: "eus",
        triggers: ["eus", "exploration upper stage", "rl10", "second stage", "upper stage"],
        chip: "Explain the EUS",
        title: "Exploration Upper Stage (EUS)",
        response: "The EUS is powered by four Aerojet Rocketdyne RL10C-3 engines generating 97,000 lbs of thrust in vacuum. With an 8.4-meter diameter matching the SLS Core Stage, it holds over 285,000 lbs of liquid propellant. Unlike Block 1's single-engine ICPS, the EUS provides the immense Delta-V needed to launch both the 26-ton Orion spacecraft and the 10-ton I-Hab habitat simultaneously to the Moon."
      },
      {
        id: "ihab_gateway",
        triggers: ["ihab", "i-hab", "gateway", "habitat", "station", "lunar station"],
        chip: "What is I-Hab & Gateway?",
        title: "I-Hab & The Lunar Gateway",
        response: "The Lunar Gateway is humanity's first extraterrestrial space station. Artemis IV delivers I-Hab (International Habitat), jointly built by ESA (European Space Agency) and JAXA (Japan Aerospace Exploration Agency). I-Hab provides ~10 m³ of living space, environmental control, multi-docking ports for visiting Orion and Starship HLS, and scientific airlocks for deep-space research."
      },
      {
        id: "nrho",
        triggers: ["nrho", "orbit", "near rectilinear", "halo orbit", "lagrange"],
        chip: "What is an NRHO orbit?",
        title: "Near-Rectilinear Halo Orbit (NRHO)",
        response: "Gateway orbits in a 7-day Near-Rectilinear Halo Orbit (NRHO) around Earth-Moon Lagrange point L2. NRHO passes within 3,000 km of the lunar North Pole and arcs out to 70,000 km over the South Pole. This orbit provides constant line-of-sight communication with Earth, continuous solar illumination without eclipse blackouts, and easy low-energy transfers down to the lunar surface."
      },
      {
        id: "shackleton",
        triggers: ["shackleton", "south pole", "crater", "ice", "landing site", "water"],
        chip: "Why Shackleton Crater?",
        title: "Target: Shackleton Crater",
        response: "Shackleton Crater (21 km wide, 4.2 km deep) lies at the lunar South Pole. Its rims experience 'peaks of eternal light' with up to 90% continuous solar power. Its interior is a Permanently Shadowed Region (PSR) cold-trapped at -240°C (-400°F) for billions of years, containing vast reserves of water ice essential for lunar life support and in-situ rocket fuel production (LOX/LH2)."
      },
      {
        id: "hls",
        triggers: ["hls", "starship", "lander", "touchdown", "human landing system"],
        chip: "What is Starship HLS?",
        title: "Human Landing System (HLS)",
        response: "SpaceX's Starship HLS serves as the lunar lander for Artemis IV. Boarded by astronauts at the Lunar Gateway in NRHO, Starship uses methalox Raptor engines to descend to the lunar surface and return to Gateway. It provides unprecedented pressurized living volume (over 1,000 m³), supporting multi-week surface stays and heavy scientific payload returns."
      },
      {
        id: "reentry",
        triggers: ["reentry", "skip entry", "atmosphere", "heat shield", "plasma", "speed"],
        chip: "Explain Skip Reentry",
        title: "Orion's Skip Reentry Profile",
        response: "Orion returns from lunar distance at ~11 km/s (25,000 mph). Rather than entering directly in a high-G ballistic arc, it performs a 'skip entry': diving into the upper atmosphere to brake, using aerodynamic lift to 'skip' back up to space to bleed kinetic energy, and then performing a gentle second entry. This caps deceleration at 4 Gs (instead of 8+ Gs) and allows pinpoint splashdowns in the Pacific Ocean."
      },
      {
        id: "esm_fuel",
        triggers: ["esm", "fuel", "reserve", "service module", "level 2", "level 4", "shared"],
        chip: "How does ESM Fuel carry over?",
        title: "European Service Module Fuel Linking",
        response: "In this simulation, Orion's ESM hypergolic propellant is strictly persistent between Level 2 (TLI & Gateway Rendezvous) and Level 4 (Trans-Earth Injection). In real spaceflight, every kilogram of propellant burned during outbound trajectory correction burns reduces the Delta-V available for the critical Earth-return burn. You must save at least 35% fuel in Phase 2 to ensure crew survival in Phase 4!"
      },
      {
        id: "max_q",
        triggers: ["max q", "max-q", "dynamic pressure", "aerodynamic", "throttle"],
        chip: "What is Max-Q?",
        title: "Maximum Dynamic Pressure (Max-Q)",
        response: "Max-Q is the moment during atmospheric ascent where aerodynamic mechanical drag stress on the rocket structure reaches its absolute peak (proportional to air density × velocity²). For SLS, Max-Q occurs between 10 km and 18 km altitude around Mach 1.5. Flight computers intentionally throttle the RS-25 core engines down from 109% to ~70% to prevent structural breakup before throttling back up once through the thick atmosphere."
      },
      {
        id: "oberth",
        triggers: ["oberth", "delta v", "slingshot", "gravity assist", "injection"],
        chip: "Oberth Effect Explained",
        title: "The Oberth Effect & TLI",
        response: "The Oberth Effect states that rocket engines generate far more useful orbital energy when fired at maximum speed deep inside a gravitational potential well. Firing the Exploration Upper Stage in low Earth orbit (moving at 7.8 km/s) gives far greater kinetic energy per kilogram of fuel burned than performing the burn in high orbit. This is why Trans-Lunar Injection (TLI) is executed in Low Earth Orbit."
      },
      {
        id: "srb",
        triggers: ["srb", "boosters", "solid rocket", "jettison", "separation"],
        chip: "Solid Rocket Boosters (SRBs)",
        title: "SLS 5-Segment Solid Rocket Boosters",
        response: "The twin 5-segment SRBs are the largest, most powerful solid propellant rocket motors ever flown. Each burns polybutadiene acrylonitrile (PBAN) fuel at a rate of 4,000 lbs per second, delivering 3.6 million lbs of thrust each for 126 seconds. At ~45 km altitude, 16 booster separation motors fire to push the spent casings outward away from the core stage."
      },
      {
        id: "crew",
        triggers: ["crew", "astronauts", "who is flying", "compliment"],
        chip: "Who is on Artemis IV?",
        title: "Artemis IV International Crew",
        response: "Artemis IV will carry a crew of four astronauts, including an ESA European astronaut and a JAXA Japanese astronaut alongside NASA astronauts, representing humanity's united international push to deep space. Two astronauts will descend to the lunar surface in HLS while two remain aboard Lunar Gateway to commission the new I-Hab module."
      },
      {
        id: "team_eclipse",
        triggers: ["team", "eclipse", "space apps", "who made", "developer", "credits"],
        chip: "Who is Team Éclipse?",
        title: "Developer Credit: Team Éclipse",
        response: "This interactive aerospace simulator was created by Team Éclipse for NASA's International SpaceAppsChallenge.org. Developed with vanilla HTML5 Canvas 2D and Three.js WebGL, the simulation puts authentic NASA flight dynamics, engineering constraints, and Artemis IV lunar exploration science directly into your web browser."
      },
      {
        id: "avcoat",
        triggers: ["heat shield", "avcoat", "temperature", "degrees", "plasma"],
        chip: "Avcoat Heat Shield Specs",
        title: "Avcoat Ablative Thermal Protection",
        response: "Orion's base is shielded by a 5-meter (16.5-foot) diameter Avcoat ablative heat shield—the largest of its kind ever built. During lunar return skip entry, temperatures reach 2,760°C (5,000°F)—half the surface temperature of the Sun. The Avcoat material melts and vaporizes away in a controlled chemical process, carrying destructive heat away from the crew capsule."
      },
      {
        id: "compare_rockets",
        triggers: ["compare", "saturn", "saturn v", "starship", "comparison", "thrust"],
        chip: "SLS vs Saturn V vs Starship",
        title: "Rocket Telemetry Comparison",
        response: "SLS Block 1B generates 8.8 million lbs of thrust, surpassing Apollo's Saturn V (7.5M lbs). SpaceX's Starship generates 16.7M lbs. While Saturn V carried the Lunar Module and CSM together, SLS Block 1B is the only rocket designed to co-manifest a 26-ton crewed spacecraft AND a 10-ton permanent space station module (I-Hab) directly to the Moon in a single launch!"
      },
      {
        id: "mars_stepping_stone",
        triggers: ["mars", "red planet", "future", "stepping stone", "why the moon"],
        chip: "Why the Moon Before Mars?",
        title: "The Cislunar Proving Ground",
        response: "A trip to Mars requires a 3-year round trip with zero abort options. The Moon is only 3 days away. At Lunar Gateway, NASA and international partners test deep space life support, long-duration radiation mitigation, nuclear thermal propulsion concepts, and closed-loop ECLSS where emergency return to Earth is still feasible if systems fail."
      },
      {
        id: "spacesuit",
        triggers: ["suit", "spacesuit", "axemu", "eva", "walk"],
        chip: "AxEMU Lunar Spacesuits",
        title: "Axiom Space AxEMU Suits",
        response: "Artemis IV astronauts will explore Shackleton Crater in Axiom Space's AxEMU spacesuit. Built with rear-hatch entry, advanced mobility bearings, and electrodynamic dust-repelling Teflon fabric, it allows astronauts to kneel, bend, and drill deep into polar ice traps in -240°C shadowed terrain for 8+ continuous hours."
      }
    ];
  }

  init() {
    this.renderWidget();
    this.bindEvents();
  }

  renderWidget() {
    let container = document.getElementById("capcom-widget");
    if (!container) {
      container = document.createElement("div");
      container.id = "capcom-widget";
      document.body.appendChild(container);
    }

    container.innerHTML = `
      <div id="capcom-trigger" class="capcom-pill" title="Click to open CAPCOM AI Terminal">
        <span class="capcom-pulse-dot"></span>
        <span class="capcom-icon">🛰️</span>
        <span class="capcom-label">ASK CAPCOM AI</span>
      </div>
      <div id="capcom-window" class="capcom-window hidden">
        <div class="capcom-header">
          <div class="capcom-status">
            <span class="capcom-led"></span>
            <span class="capcom-head-title">NASA FLIGHT CONTROLLER // CAPCOM AI</span>
          </div>
          <div class="capcom-actions">
            <button id="capcom-clear-btn" class="capcom-mini-btn" title="Clear transcript">CLS</button>
            <button id="capcom-close-btn" class="capcom-close-btn" title="Minimize terminal">✕</button>
          </div>
        </div>
        <div class="capcom-chips-container" id="capcom-chips">
          ${this.intents.slice(0, 10).map(intent => `
            <button class="capcom-chip" data-intent-id="${intent.id}">${intent.chip}</button>
          `).join('')}
        </div>
        <div class="capcom-chat-body" id="capcom-chat-body">
          <div class="capcom-msg capcom-msg-ai">
            <div class="msg-sender">CAPCOM AI [KSC FLIGHT LOOP]:</div>
            <div class="msg-content">HOUSTON / CAPCOM ONLINE. Ready to support Artemis IV flight dynamics, SLS Block 1B specifications, Lunar Gateway telemetry, Shackleton Crater science, and Orion reentry trajectory calculations. Select a telemetry prompt above or enter a query below.</div>
          </div>
        </div>
        <form class="capcom-input-bar" id="capcom-form">
          <input type="text" id="capcom-input" class="capcom-input" placeholder="Query flight computer or science database..." autocomplete="off"/>
          <button type="submit" class="capcom-send-btn" id="capcom-send">TRANSMIT</button>
        </form>
      </div>
    `;
  }

  bindEvents() {
    const trigger = document.getElementById("capcom-trigger");
    const closeBtn = document.getElementById("capcom-close-btn");
    const clearBtn = document.getElementById("capcom-clear-btn");
    const form = document.getElementById("capcom-form");
    const input = document.getElementById("capcom-input");
    const chipsContainer = document.getElementById("capcom-chips");

    if (trigger) trigger.addEventListener("click", () => this.toggleWindow(true));
    if (closeBtn) closeBtn.addEventListener("click", () => this.toggleWindow(false));
    
    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        const body = document.getElementById("capcom-chat-body");
        if (body) {
          body.innerHTML = `
            <div class="capcom-msg capcom-msg-ai">
              <div class="msg-sender">CAPCOM AI [KSC FLIGHT LOOP]:</div>
              <div class="msg-content">Flight loop cleared. All telemetry channels nominal. Awaiting queries.</div>
            </div>
          `;
        }
      });
    }

    if (form && input) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const text = input.value.trim();
        if (!text) return;
        this.handleUserQuery(text);
        input.value = "";
      });
    }

    if (chipsContainer) {
      chipsContainer.addEventListener("click", (e) => {
        const chip = e.target.closest(".capcom-chip");
        if (chip) {
          const intentId = chip.dataset.intentId;
          const intent = this.intents.find(i => i.id === intentId);
          if (intent) {
            this.handleUserQuery(intent.chip);
          }
        }
      });
    }
  }

  toggleWindow(open) {
    this.isOpen = open;
    const win = document.getElementById("capcom-window");
    const trig = document.getElementById("capcom-trigger");
    if (!win) return;

    if (open) {
      win.classList.remove("hidden");
      if (trig) trig.classList.add("hidden");
      if (window.Sound) window.Sound.playClick(800);
      const input = document.getElementById("capcom-input");
      if (input) setTimeout(() => input.focus(), 150);
    } else {
      win.classList.add("hidden");
      if (trig) trig.classList.remove("hidden");
      if (window.Sound) window.Sound.playClick(400);
    }
  }

  handleUserQuery(query) {
    this.appendMessage("user", query);
    if (window.Sound) window.Sound.playClick(650);

    const queryLower = query.toLowerCase();
    let bestMatch = null;

    for (const intent of this.intents) {
      for (const trigger of intent.triggers) {
        if (queryLower.includes(trigger.toLowerCase())) {
          bestMatch = intent;
          break;
        }
      }
      if (bestMatch) break;
    }

    setTimeout(() => {
      if (bestMatch) {
        this.appendMessage("ai", `<strong>${bestMatch.title}:</strong> ${bestMatch.response}`);
      } else {
        this.appendMessage(
          "ai",
          `Telemetry query not recognized in primary flight database for: "<em>${this._escapeHtml(query)}</em>". Try selecting a quick telemetry chip above, or query about SLS Block 1B, EUS, I-Hab, Lunar Gateway, NRHO orbit, Shackleton Crater, Starship HLS, or Skip Reentry.`
        );
      }
      if (window.Sound) window.Sound.playClick(900);
    }, 280);
  }

  appendMessage(role, htmlContent) {
    const body = document.getElementById("capcom-chat-body");
    if (!body) return;

    const msgEl = document.createElement("div");
    msgEl.className = `capcom-msg ${role === 'user' ? 'capcom-msg-user' : 'capcom-msg-ai'}`;
    msgEl.innerHTML = `
      <div class="msg-sender">${role === 'user' ? 'ASTRONAUT [VOICE LOOP]:' : 'CAPCOM AI [FLIGHT DYNAMICS]:'}</div>
      <div class="msg-content">${htmlContent}</div>
    `;

    body.appendChild(msgEl);
    body.scrollTop = body.scrollHeight;
  }

  _escapeHtml(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
}

// Global Mount
window.addEventListener("DOMContentLoaded", () => {
  window.Capcom = new CapcomChatbot();
  window.Capcom.init();
});
