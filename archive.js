/**
 * ARTEMIS IV: GATEWAY TO THE MOON
 * Team Éclipse for NASA's SpaceAppsChallenge.org
 * 
 * archive.js - Artemis IV Interactive Educational Archive
 * 10 Comprehensive Deep-Space Aerospace Modules, Technical Schematics & Comparative Rocketry Database
 * Zero fragile external image dependencies: 100% Standalone Vector SVG Diagrams
 */

class ArtemisArchive {
  constructor() {
    this.activeTab = "modules";
    this.researchModeActive = false;
    this.modules = [
      {
        id: "sls_eus",
        title: "SLS Block 1B & Exploration Upper Stage (EUS)",
        subtitle: "Super-Heavy Deep Space Co-Manifesting Workhorse",
        badge: "PROPULSION & PAYLOAD",
        svg: this._generateSlsSvg(),
        shortDesc: "Replacing the single-engine ICPS with the 4-engine RL10 EUS boosts lunar payload capacity from 27 to 38 metric tons, enabling simultaneous launch of Orion and heavy Gateway modules.",
        classifiedDetails: `
          <div class="archive-tech-grid">
            <div class="tech-item"><span class="tech-label">Total Height:</span><span class="tech-val">322 ft (98.1 m)</span></div>
            <div class="tech-item"><span class="tech-label">Liftoff Thrust:</span><span class="tech-val">8,800,000 lbs (39.1 MN)</span></div>
            <div class="tech-item"><span class="tech-label">Core Propulsion:</span><span class="tech-val">4x Aerojet Rocketdyne RS-25 (LH2/LOX)</span></div>
            <div class="tech-item"><span class="tech-label">Booster System:</span><span class="tech-val">Twin 5-Segment Solid Rocket Boosters (SRBs)</span></div>
            <div class="tech-item"><span class="tech-label">EUS Propulsion:</span><span class="tech-val">4x Aerojet Rocketdyne RL10C-3 Engines</span></div>
            <div class="tech-item"><span class="tech-label">EUS Vacuum Thrust:</span><span class="tech-val">97,360 lbf (433 kN)</span></div>
            <div class="tech-item"><span class="tech-label">Lunar TLI Capacity:</span><span class="tech-val">38,000 kg (83,775 lbs)</span></div>
            <div class="tech-item"><span class="tech-label">Cargo Adapter:</span><span class="tech-val">Universal Stage Adapter (USA) for I-Hab</span></div>
          </div>
          <p class="archive-deep-dive">
            <strong>The Exploration Upper Stage Revolution:</strong> Block 1's Interim Cryogenic Propulsion Stage (ICPS) was powered by a single RL10B-2 engine, sufficient only for sending Orion alone to lunar orbit. The EUS is an 8.4-meter wide cryogenic giant burning 285,000 lbs of liquid hydrogen and liquid oxygen. This quadrupled thrust output allows NASA to execute 'co-manifested launches'—transporting both the four-astronaut Orion spacecraft and a massive 10-metric-ton space station module in a single launch.
          </p>
        `
      },
      {
        id: "ihab_gateway",
        title: "I-Hab Module & The Lunar Gateway",
        subtitle: "Humanity's Deep Space Outpost in NRHO Orbit",
        badge: "HABITATION & LIFE SUPPORT",
        svg: this._generateGatewaySvg(),
        shortDesc: "Delivered by Artemis IV, the International Habitat (I-Hab) provides pressurized environmental control, crew quarters, and scientific laboratories in Near-Rectilinear Halo Orbit.",
        classifiedDetails: `
          <div class="archive-tech-grid">
            <div class="tech-item"><span class="tech-label">Contributing Agencies:</span><span class="tech-val">ESA (Europe) &amp; JAXA (Japan)</span></div>
            <div class="tech-item"><span class="tech-label">Pressurized Volume:</span><span class="tech-val">35 m³ (1,236 cu ft)</span></div>
            <div class="tech-item"><span class="tech-label">Station Orbit:</span><span class="tech-val">7-Day L2 Near-Rectilinear Halo Orbit (NRHO)</span></div>
            <div class="tech-item"><span class="tech-label">Periapsis (Moon North):</span><span class="tech-val">3,000 km (1,864 mi)</span></div>
            <div class="tech-item"><span class="tech-label">Apoapsis (Moon South):</span><span class="tech-val">70,000 km (43,496 mi)</span></div>
            <div class="tech-item"><span class="tech-label">Docking Ports:</span><span class="tech-val">4x International Docking System Standard (IDSS)</span></div>
            <div class="tech-item"><span class="tech-label">Orbital Stability:</span><span class="tech-val">Zero-Eclipse, Quasi-Periodic Halo</span></div>
            <div class="tech-item"><span class="tech-label">Station Lifetime:</span><span class="tech-val">15+ Years Human Deep Space Staging</span></div>
          </div>
          <p class="archive-deep-dive">
            <strong>The Gateway Architecture:</strong> Located in an Earth-Moon L2 Near-Rectilinear Halo Orbit, the Gateway serves as a staging post for lunar south pole expeditions and future Mars missions. Because the orbit is tilted 90° relative to the lunar plane, it never experiences Earth or Moon eclipses, ensuring uninterrupted solar power and continuous line-of-sight communication with Deep Space Network tracking stations.
          </p>
        `
      },
      {
        id: "starship_hls",
        title: "Human Landing System (Starship HLS)",
        subtitle: "Super-Heavy Methalox Descent & Ascent Vehicle",
        badge: "SURFACE DESCENT & LANDING",
        svg: this._generateHlsSvg(),
        shortDesc: "Equipped with high-thrust vacuum Raptor engines and landing thrusters, Starship HLS delivers crew and up to 100 metric tons of cargo to the extreme terrain of the lunar South Pole.",
        classifiedDetails: `
          <div class="archive-tech-grid">
            <div class="tech-item"><span class="tech-label">Total Height:</span><span class="tech-val">164 ft (50 m)</span></div>
            <div class="tech-item"><span class="tech-label">Hull Diameter:</span><span class="tech-val">30 ft (9 m)</span></div>
            <div class="tech-item"><span class="tech-label">Propulsion:</span><span class="tech-val">Raptor 2/3 Methalox Engines + High Thrusters</span></div>
            <div class="tech-item"><span class="tech-label">Propellant:</span><span class="tech-val">Liquid Methane (CH4) &amp; Liquid Oxygen (LOX)</span></div>
            <div class="tech-item"><span class="tech-label">Surface Payload:</span><span class="tech-val">100,000 kg (100 metric tons)</span></div>
            <div class="tech-item"><span class="tech-label">Landing System:</span><span class="tech-val">Articulated Wide-Footprint Shock Struts</span></div>
            <div class="tech-item"><span class="tech-label">Surface Stay Time:</span><span class="tech-val">Up to 30 Days Continuous Crewhab</span></div>
            <div class="tech-item"><span class="tech-label">Elevator System:</span><span class="tech-val">External Rigged Cargo &amp; Astronaut Lift</span></div>
          </div>
          <p class="archive-deep-dive">
            <strong>Deep Crater Operations:</strong> Landing at Shackleton Crater presents severe hazards: the Sun sits at less than 1.5° above the horizon, casting pitch-black shadows across boulder-strewn slopes. Starship HLS utilizes dual steerable searchlights, terrain-relative LiDAR navigation, and specialized mid-body landing thrusters to prevent high-velocity plume impingement on loose regolith.
          </p>
        `
      },
      {
        id: "shackleton_ice",
        title: "Shackleton Crater & Water-Ice Reserves",
        subtitle: "Permanently Shadowed Cryogenic Water at the South Pole",
        badge: "PLANETARY SCIENCE & ISRU",
        svg: this._generateShackletonSvg(),
        shortDesc: "Permanently Shadowed Regions (PSRs) at -240°C (-400°F) preserve billions of tons of ancient water ice, providing life-support oxygen and rocket propellant for Mars exploration.",
        classifiedDetails: `
          <div class="archive-tech-grid">
            <div class="tech-item"><span class="tech-label">Crater Diameter:</span><span class="tech-val">21 km (13 mi)</span></div>
            <div class="tech-item"><span class="tech-label">Floor Depth:</span><span class="tech-val">4.2 km (2.6 mi deep)</span></div>
            <div class="tech-item"><span class="tech-label">Crater Floor Temp:</span><span class="tech-val">35 K to 90 K (-238°C / -396°F)</span></div>
            <div class="tech-item"><span class="tech-label">Rim Solar Exposure:</span><span class="tech-val">Peaks of Eternal Light (~86-92% Sunlight)</span></div>
            <div class="tech-item"><span class="tech-label">Estimated Water Ice:</span><span class="tech-val">100M+ Metric Tons in Regolith Matrix</span></div>
            <div class="tech-item"><span class="tech-label">ISRU Product 1:</span><span class="tech-val">Liquid Hydrogen (LH2) &amp; Liquid Oxygen (LOX)</span></div>
            <div class="tech-item"><span class="tech-label">ISRU Product 2:</span><span class="tech-val">Potable Water &amp; Breathing Atmosphere</span></div>
            <div class="tech-item"><span class="tech-label">Scientific Value:</span><span class="tech-val">4-Billion-Year Cometary Record</span></div>
          </div>
          <p class="archive-deep-dive">
            <strong>The Economics of Lunar Ice:</strong> Launching water from Earth to lunar orbit costs over $25,000 per kilogram. By extracting lunar water ice via thermal sublimators and separating it via electrolysis powered by rim solar arrays, Artemis IV establishes the infrastructure to produce rocket propellant on the Moon, turning the lunar South Pole into humanity's cislunar gas station.
          </p>
        `
      },
      {
        id: "orion_reentry",
        title: "Orion Avcoat Heat Shield & Skip-Reentry",
        subtitle: "11 km/s Hypersonic Atmospheric Energy Dissipation",
        badge: "AERODYNAMICS & THERMODYNAMICS",
        svg: this._generateReentrySvg(),
        shortDesc: "Returning from the Moon at 40,000 km/h, Orion bounces off the upper atmosphere to bleed kinetic energy and limit peak deceleration to 4.0 Gs before parachute splashdown.",
        classifiedDetails: `
          <div class="archive-tech-grid">
            <div class="tech-item"><span class="tech-label">Entry Velocity:</span><span class="tech-val">11.02 km/s (Mach 32 / 24,600 mph)</span></div>
            <div class="tech-item"><span class="tech-label">Peak Shock Temp:</span><span class="tech-val">2,760°C (5,000°F Plasma)</span></div>
            <div class="tech-item"><span class="tech-label">Heat Shield Material:</span><span class="tech-val">Avcoat Ablator (Fiberglass Honeycomb)</span></div>
            <div class="tech-item"><span class="tech-label">Heat Shield Diameter:</span><span class="tech-val">5.03 m (16.5 ft Base)</span></div>
            <div class="tech-item"><span class="tech-label">Skip Reentry Corridor:</span><span class="tech-val">Strict 2.0° Flight Path Angle Window</span></div>
            <div class="tech-item"><span class="tech-label">Peak Deceleration:</span><span class="tech-val">4.0 G (Skip) vs 8.5 G (Direct Ballistic)</span></div>
            <div class="tech-item"><span class="tech-label">Main Parachutes:</span><span class="tech-val">3x 116-ft Diameter Ringsail Chutes</span></div>
            <div class="tech-item"><span class="tech-label">Touchdown Velocity:</span><span class="tech-val">25 ft/s (7.6 m/s) in Pacific Ocean</span></div>
          </div>
          <p class="archive-deep-dive">
            <strong>The Skip-Entry Physics:</strong> In Apollo, spacecraft plowed directly into Earth's atmosphere, subjecting crew to violent deceleration loads up to 8 Gs and restricting splashdown to a fixed zone. Orion rotates its center-of-mass to generate aerodynamic lift, bouncing out of the thick air at 60 km altitude like a skipped stone, before diving back in for a gentle 4-G descent with pinpoint landing precision off San Diego.
          </p>
        `
      },
      {
        id: "nrho_mechanics",
        title: "Earth-Moon L2 Near-Rectilinear Halo Orbit",
        subtitle: "Three-Body Gravitational Resonance Dynamics",
        badge: "ASTRODYNAMICS & TRAJECTORY",
        svg: this._generateNrhoSvg(),
        shortDesc: "NRHO balances the gravitational fields of Earth and Moon, requiring only 2-5 m/s of station-keeping Delta-V per year while maintaining permanent communication with Earth.",
        classifiedDetails: `
          <div class="archive-tech-grid">
            <div class="tech-item"><span class="tech-label">Orbital Period:</span><span class="tech-val">6.56 Days (7-Day Lunar Resonance)</span></div>
            <div class="tech-item"><span class="tech-label">Station-Keeping Delta-V:</span><span class="tech-val">&lt; 5 m/s per Earth Year</span></div>
            <div class="tech-item"><span class="tech-label">Libration Point:</span><span class="tech-val">Earth-Moon Lagrangian Point 2 (L2)</span></div>
            <div class="tech-item"><span class="tech-label">Earth Communications:</span><span class="tech-val">100% Continuous Line-of-Sight</span></div>
            <div class="tech-item"><span class="tech-label">Solar Power:</span><span class="tech-val">Zero Thermal Eclipses</span></div>
            <div class="tech-item"><span class="tech-label">Lunar Polar Access:</span><span class="tech-val">Bi-Weekly Low-Energy Transfer Windows</span></div>
            <div class="tech-item"><span class="tech-label">Deep Space Staging:</span><span class="tech-val">Minimal Delta-V for Mars Departure</span></div>
            <div class="tech-item"><span class="tech-label">Orbital Family:</span><span class="tech-val">Southern Halo Orbit Family (L2-S)</span></div>
          </div>
          <p class="archive-deep-dive">
            <strong>Gravitational Sweet Spot:</strong> Unlike Low Lunar Orbit (LLO), which is unstable due to lunar gravitational anomalies ('mascons') that cause orbits to decay in months, an NRHO sits in equilibrium between Earth's gravity, lunar gravity, and centrifugal force. It requires almost zero fuel to maintain and offers continuous unobstructed solar power.
          </p>
        `
      },
      {
        id: "esm_propulsion",
        title: "European Service Module (ESM)",
        subtitle: "Orion's Powerhouse, Life-Support & Propulsion Backbone",
        badge: "SERVICE MODULE PROPULSION",
        svg: this._generateEsmSvg(),
        shortDesc: "Provided by ESA and Airbus, the ESM carries 9 metric tons of hypergolic propellant, solar array wings, water, nitrogen, and oxygen to sustain the 4-astronaut crew.",
        classifiedDetails: `
          <div class="archive-tech-grid">
            <div class="tech-item"><span class="tech-label">Manufacturer:</span><span class="tech-val">Airbus Defence and Space / ESA</span></div>
            <div class="tech-item"><span class="tech-label">Main Engine:</span><span class="tech-val">Aerojet Rocketdyne AJ10-190 (Space Shuttle OMS)</span></div>
            <div class="tech-item"><span class="tech-label">Main Engine Thrust:</span><span class="tech-val">6,000 lbf (26.7 kN Vacuum)</span></div>
            <div class="tech-item"><span class="tech-label">Secondary Thrusters:</span><span class="tech-val">8x 490 N Auxiliary Engines + 24 RCS Jets</span></div>
            <div class="tech-item"><span class="tech-label">Propellant Mass:</span><span class="tech-val">9,200 kg (20,282 lbs) MMH / MON-3</span></div>
            <div class="tech-item"><span class="tech-label">Solar Power Generation:</span><span class="tech-val">4x X-Wings Generating 11.2 kW Power</span></div>
            <div class="tech-item"><span class="tech-label">Potable Water:</span><span class="tech-val">240 kg (529 lbs)</span></div>
            <div class="tech-item"><span class="tech-label">Breathing Gases:</span><span class="tech-val">90 kg Oxygen / 30 kg Nitrogen</span></div>
          </div>
          <p class="archive-deep-dive">
            <strong>Shared Fuel Management:</strong> The ESM hypergolic engines fire with spontaneous ignition on contact—zero spark plugs or igniters required. Because the ESM cannot be refueled during Artemis IV, every drop of hypergolic propellant spent during cislunar transit directly reduces the delta-V available for the crucial Trans-Earth Injection burn.
          </p>
        `
      },
      {
        id: "axemu_suit",
        title: "Axiom AxEMU Lunar Spacesuit",
        subtitle: "Next-Generation Mobility for Polar Regolith Traversal",
        badge: "EXTRAVEHICULAR SYSTEMS",
        svg: this._generateSuitSvg(),
        shortDesc: "Custom-engineered by Axiom Space, the AxEMU spacesuit features articulated mobility joints, high-definition helmet telemetry displays, and cryogenic thermal coatings for South Pole night.",
        classifiedDetails: `
          <div class="archive-tech-grid">
            <div class="tech-item"><span class="tech-label">Operating Pressure:</span><span class="tech-val">4.3 psi (Pure O2 Atmosphere)</span></div>
            <div class="tech-item"><span class="tech-label">EVA Duration:</span><span class="tech-val">8 Hours Continuous Moonwalk</span></div>
            <div class="tech-item"><span class="tech-label">Thermal Tolerance:</span><span class="tech-val">-220°C to +130°C (-364°F to +266°F)</span></div>
            <div class="tech-item"><span class="tech-label">Mobility Joints:</span><span class="tech-val">Bearing-Assisted Knees, Hips &amp; Ankles</span></div>
            <div class="tech-item"><span class="tech-label">Helmet Camera:</span><span class="tech-val">4K UHD Dual Headlights &amp; Telemetry HUD</span></div>
            <div class="tech-item"><span class="tech-label">Dust Mitigation:</span><span class="tech-val">Electrostatic &amp; Abrasion-Resistant Outer Layer</span></div>
            <div class="tech-item"><span class="tech-label">Life Support Pack:</span><span class="tech-val">Rapid CO2 Scrubbers &amp; Ice Sublimator Loop</span></div>
            <div class="tech-item"><span class="tech-label">Emergency Oxygen:</span><span class="tech-val">30-Minute Secondary Redundant Supply</span></div>
          </div>
          <p class="archive-deep-dive">
            <strong>Apollo vs Axiom Mobility:</strong> Apollo astronauts on the Moon famously had to 'bunny hop' because their pressurized suits had rigid hip joints that prevented kneeling or normal walking. The AxEMU incorporates advanced rotary bearing joints, custom-fitted boots, and an innovative rear-entry hatch that prevents abrasive razor-sharp lunar regolith from entering the habitat cabin.
          </p>
        `
      },
      {
        id: "cryo_boiloff",
        title: "Cryogenic Fluid Management & Zero-Boil-Off",
        subtitle: "Storing Liquid Hydrogen & Methane in Vacuum",
        badge: "CRYOGENIC ENGINEERING",
        svg: this._generateCryoSvg(),
        shortDesc: "Deep space missions require storing liquid hydrogen (-253°C) and liquid oxygen (-183°C) for months without evaporation boil-off using 80-layer Multi-Layer Insulation (MLI) and active cryo-coolers.",
        classifiedDetails: `
          <div class="archive-tech-grid">
            <div class="tech-item"><span class="tech-label">LH2 Storage Temp:</span><span class="tech-val">20 K (-253°C / -423°F)</span></div>
            <div class="tech-item"><span class="tech-label">LOX Storage Temp:</span><span class="tech-val">90 K (-183°C / -297°F)</span></div>
            <div class="tech-item"><span class="tech-label">Thermal Insulation:</span><span class="tech-val">80-Layer Gold &amp; Mylar Multi-Layer Blanket</span></div>
            <div class="tech-item"><span class="tech-label">Active Cooling:</span><span class="tech-val">Stirling Pulse-Tube Cryo-Refrigerators</span></div>
            <div class="tech-item"><span class="tech-label">Tank Material:</span><span class="tech-val">Al-Li 2195 (Aluminum-Lithium Orthogrid)</span></div>
            <div class="tech-item"><span class="tech-label">Cryo Propellant Transfer:</span><span class="tech-val">Settling RCS Ullage Acceleration</span></div>
            <div class="tech-item"><span class="tech-label">Boil-Off Target:</span><span class="tech-val">&lt; 0.05% per Month Zero-Boil-Off (ZBO)</span></div>
            <div class="tech-item"><span class="tech-label">Mars Significance:</span><span class="tech-val">Mandatory for 3-Year Mars Return Stages</span></div>
          </div>
          <p class="archive-deep-dive">
            <strong>The Cryogenic Challenge:</strong> Liquid hydrogen has the highest specific impulse of any chemical rocket fuel, but its boiling point is only 20 degrees above absolute zero. In sunlight, an uninsulated tank would vaporize all its fuel in days. Artemis IV flight-tests advanced cryo-coolers, sunshields, and automated thermodynamic vent valves that eliminate boil-off losses.
          </p>
        `
      },
      {
        id: "mars_proving_ground",
        title: "Destination Mars: Artemis IV as Proving Ground",
        subtitle: "Deep Space Crew Autonomy & Interplanetary Flight",
        badge: "MARS PREPARATION & ROADMAP",
        svg: this._generateMarsSvg(),
        shortDesc: "Every Artemis IV system—from the Lunar Gateway habitat to nuclear power testing and long-duration life support—serves as the testbed for the first human voyage to Mars.",
        classifiedDetails: `
          <div class="archive-tech-grid">
            <div class="tech-item"><span class="tech-label">Transit Time to Mars:</span><span class="tech-val">6 to 9 Months (One-Way)</span></div>
            <div class="tech-item"><span class="tech-label">Communication Delay:</span><span class="tech-val">Up to 22 Minutes Each Direction</span></div>
            <div class="tech-item"><span class="tech-label">Crew Autonomy:</span><span class="tech-val">AI Flight Computers (Zero Real-Time Houston Help)</span></div>
            <div class="tech-item"><span class="tech-label">Radiation Shielding:</span><span class="tech-val">Solar Particle Storm Water Shelters</span></div>
            <div class="tech-item"><span class="tech-label">Propulsion Target:</span><span class="tech-val">Nuclear Thermal Propulsion (NTP) / Hybrid Electric</span></div>
            <div class="tech-item"><span class="tech-label">Surface Mission Length:</span><span class="tech-val">500 Days on Martian Surface</span></div>
            <div class="tech-item"><span class="tech-label">Gravity Transition:</span><span class="tech-val">1G (Earth) → 0G → 0.16G (Moon) → 0.38G (Mars)</span></div>
            <div class="tech-item"><span class="tech-label">Gateway Function:</span><span class="tech-val">Assembly &amp; Shakedown of Deep Space Transport</span></div>
          </div>
          <p class="archive-deep-dive">
            <strong>The 3-Day Abort Window:</strong> If an environmental control system fails in low Earth orbit, crew returns in 3 hours. At the Moon, abort takes 3 days. But on a voyage to Mars, there is no quick return—abort takes up to 3 years. Artemis IV tests long-duration autonomy, deep space communications latency, cryogenic fluid management, and psychological isolation where Earth is still visible as a blue marble.
          </p>
        `
      }
    ];
  }

  renderArchiveScreen() {
    const archiveScreen = document.getElementById("screen-archive");
    if (!archiveScreen) return;

    const isUnlocked = (window.GameState && window.GameState.archiveUnlocked) || this.researchModeActive;

    archiveScreen.innerHTML = `
      <div class="archive-container">
        <!-- Top Navigation Bar -->
        <header class="archive-header">
          <button id="archive-back-btn" class="archive-back-btn">
            <span class="btn-arrow">◀</span> BACK TO LAUNCHPAD
          </button>
          <div class="archive-title-wrap">
            <h1 class="archive-title">ARTEMIS IV MISSION ARCHIVE</h1>
            <p class="archive-subtitle">NASA Deep Space Technical Briefings, Vehicle Schematics & Telemetry</p>
          </div>
          <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
            <button id="btn-toggle-research-mode" class="hud-btn" style="font-size: 11px; padding: 6px 14px; border-color: ${this.researchModeActive ? 'var(--accent-green)' : 'var(--cyan-glow)'}; cursor: pointer;">
              ${this.researchModeActive ? '🔬 RESEARCH MODE: ACTIVE (ALL UNLOCKED)' : '🔓 UNRESTRICTED JUDGE/STUDENT MODE'}
            </button>
            <div class="archive-badge ${isUnlocked ? 'badge-unlocked' : 'badge-classified'}">
              ${isUnlocked ? '🏆 FULL ACCESS GRANTED' : '🔒 CLASSIFIED DATA'}
            </div>
          </div>
        </header>

        <!-- Classification Banner -->
        <div class="archive-banner ${isUnlocked ? 'banner-unlocked' : 'banner-classified'}">
          <div class="banner-icon">${isUnlocked ? '✅' : '🔒'}</div>
          <div class="banner-content">
            <h4>${isUnlocked ? 'DEEP SPACE TELEMETRY ARCHIVE FULLY UNLOCKED' : 'MISSION CLASSIFIED: FLIGHT QUALIFICATION REQUIRED'}</h4>
            <p>${isUnlocked 
              ? 'Congratulations Commander! Full engineering blueprints, thermodynamic profiles, orbital mechanics calculations, and comparative rocketry data are verified and unlocked below.' 
              : 'Complete all 4 Mission Phases (Ascent, TLI, Shackleton Touchdown, and Earth Reentry) to unlock full NASA Artemis IV schematics, real telemetry, and technical specifications — or click UNRESTRICTED JUDGE/STUDENT MODE above.'}
            </p>
          </div>
        </div>

        <!-- Comparative Vehicle Telemetry Section -->
        <div class="archive-comparison-box">
          <div class="comp-header">
            <h3>HEAVY-LIFT LAUNCH VEHICLE COMPARISON TELEMETRY</h3>
            <span class="comp-badge">NASA FLIGHT TELEMETRY DATABASE</span>
          </div>
          <div class="comp-table-wrap">
            <table class="comp-table">
              <thead>
                <tr>
                  <th>VEHICLE</th>
                  <th>HEIGHT</th>
                  <th>LIFTOFF THRUST</th>
                  <th>UPPER STAGE</th>
                  <th>PAYLOAD TO TLI</th>
                  <th>CO-MANIFEST CAPABILITY</th>
                </tr>
              </thead>
              <tbody>
                <tr class="highlight-row">
                  <td><strong>SLS Block 1B (Artemis IV)</strong></td>
                  <td>322 ft (98.1 m)</td>
                  <td>8.8M lbs (39.1 MN)</td>
                  <td>4x RL10C-3 (EUS)</td>
                  <td><strong>38.0 metric tons</strong></td>
                  <td><span class="comp-tag tag-yes">YES (Orion + 10t I-Hab)</span></td>
                </tr>
                <tr>
                  <td>SLS Block 1 (Artemis I–III)</td>
                  <td>322 ft (98.1 m)</td>
                  <td>8.8M lbs (39.1 MN)</td>
                  <td>1x RL10B-2 (ICPS)</td>
                  <td>27.0 metric tons</td>
                  <td><span class="comp-tag tag-no">NO (Orion Only)</span></td>
                </tr>
                <tr>
                  <td>Saturn V (Apollo 11)</td>
                  <td>363 ft (110.6 m)</td>
                  <td>7.5M lbs (33.4 MN)</td>
                  <td>1x J-2 (S-IVB)</td>
                  <td>43.5 metric tons</td>
                  <td><span class="comp-tag tag-yes">YES (CSM + Lunar Module)</span></td>
                </tr>
                <tr>
                  <td>Starship HLS (Full Stack)</td>
                  <td>397 ft (121.0 m)</td>
                  <td>16.7M lbs (74.3 MN)</td>
                  <td>6x Raptor 3 Engines</td>
                  <td>100.0+ t (w/ Refueling)</td>
                  <td><span class="comp-tag tag-yes">YES (High-Capacity Landings)</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 10 Educational Cards Grid (Pure SVG Vector Graphics, Zero Image Dependencies) -->
        <div class="archive-grid">
          ${this.modules.map(mod => `
            <article class="archive-card ${isUnlocked ? 'card-unlocked' : 'card-locked'}" id="card-${mod.id}">
              <div class="card-media-wrap">
                ${mod.svg}
                <span class="card-badge">${mod.badge}</span>
              </div>
              <div class="card-body">
                <h3 class="card-title">${mod.title}</h3>
                <h5 class="card-sub">${mod.subtitle}</h5>
                <p class="card-desc">${mod.shortDesc}</p>
                
                ${isUnlocked ? `
                  <div class="unlocked-content">
                    <hr class="card-divider"/>
                    <h5 class="specs-heading">OFFICIAL NASA TECHNICAL SPECIFICATIONS</h5>
                    ${mod.classifiedDetails}
                  </div>
                ` : `
                  <div class="locked-placeholder">
                    <span class="lock-icon">🔒</span>
                    <span class="lock-text">COMPLETE CAMPAIGN TO UNLOCK FULL SCHEMATICS &amp; TELEMETRY</span>
                  </div>
                `}
              </div>
            </article>
          `).join('')}
        </div>
      </div>
    `;

    // Bind back button to smoothly return to launchpad
    const backBtn = document.getElementById("archive-back-btn");
    if (backBtn) {
      backBtn.addEventListener("click", () => {
        if (window.Sound) window.Sound.playClick(400);
        if (window.FlightComputer) {
          window.FlightComputer.navigateToScreen('MENU');
        }
      });
    }

    // Bind research mode toggle button
    const researchBtn = document.getElementById("btn-toggle-research-mode");
    if (researchBtn) {
      researchBtn.addEventListener("click", () => {
        if (window.Sound) window.Sound.playClick(600);
        this.researchModeActive = !this.researchModeActive;
        this.renderArchiveScreen();
      });
    }
  }

  // --- PROCEDURAL HIGH-PRECISION NASA VECTOR SVGS ---
  _generateSlsSvg() {
    return `<svg viewBox="0 0 400 240" class="card-svg" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="slsCoreGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#9a3412"/>
          <stop offset="35%" stop-color="#ea580c"/>
          <stop offset="70%" stop-color="#f97316"/>
          <stop offset="100%" stop-color="#7c2d12"/>
        </linearGradient>
        <linearGradient id="srbGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#cbd5e1"/>
          <stop offset="50%" stop-color="#ffffff"/>
          <stop offset="100%" stop-color="#64748b"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="#030712"/>
      <!-- Grid Lines -->
      <line x1="0" y1="120" x2="400" y2="120" stroke="rgba(56, 189, 248, 0.15)" stroke-dasharray="4,4"/>
      <!-- Core Stage -->
      <rect x="180" y="45" width="40" height="155" fill="url(#slsCoreGrad)" rx="3"/>
      <!-- Twin SRBs -->
      <rect x="156" y="65" width="18" height="135" fill="url(#srbGrad)" rx="3"/>
      <polygon points="156,65 165,42 174,65" fill="#f8fafc"/>
      <rect x="226" y="65" width="18" height="135" fill="url(#srbGrad)" rx="3"/>
      <polygon points="226,65 235,42 244,65" fill="#f8fafc"/>
      <!-- EUS Adapter & Orion -->
      <rect x="184" y="24" width="32" height="21" fill="#e2e8f0"/>
      <polygon points="184,24 200,8 216,24" fill="#ffffff"/>
      <!-- LAS Tower -->
      <line x1="200" y1="8" x2="200" y2="0" stroke="#f87171" stroke-width="2"/>
      <!-- Nozzles -->
      <polygon points="184,200 188,212 196,212 192,200" fill="#334155"/>
      <polygon points="208,200 204,212 212,212 216,200" fill="#334155"/>
      <text x="200" y="230" font-family="'Courier New', monospace" font-size="11" fill="#38bdf8" text-anchor="middle" font-weight="bold">SLS BLOCK 1B + EUS [38t TLI]</text>
    </svg>`;
  }

  _generateGatewaySvg() {
    return `<svg viewBox="0 0 400 240" class="card-svg" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#030712"/>
      <!-- Moon & NRHO Halo Orbit -->
      <circle cx="200" cy="120" r="34" fill="#1e293b" stroke="#475569" stroke-width="1.5"/>
      <ellipse cx="200" cy="120" rx="130" ry="45" fill="none" stroke="#00e5ff" stroke-width="2" stroke-dasharray="6,4" transform="rotate(-20 200 120)"/>
      <!-- Gateway Station Modules -->
      <g transform="translate(240, 95) rotate(-20)">
        <!-- Core Cylinder -->
        <rect x="-18" y="-9" width="36" height="18" fill="#d97706" stroke="#fbbf24" rx="2"/>
        <!-- I-Hab Module -->
        <rect x="18" y="-7" width="22" height="14" fill="#0284c7" stroke="#38bdf8" rx="2"/>
        <!-- Solar Panels -->
        <rect x="-10" y="-35" width="20" height="22" fill="#1e3a8a" stroke="#60a5fa"/>
        <rect x="-10" y="13" width="20" height="22" fill="#1e3a8a" stroke="#60a5fa"/>
        <!-- IDSS Docking Port -->
        <circle cx="42" cy="0" r="4" fill="#f8fafc"/>
      </g>
      <text x="200" y="230" font-family="'Courier New', monospace" font-size="11" fill="#00e5ff" text-anchor="middle" font-weight="bold">LUNAR GATEWAY // I-HAB &amp; NRHO</text>
    </svg>`;
  }

  _generateHlsSvg() {
    return `<svg viewBox="0 0 400 240" class="card-svg" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#030712"/>
      <ellipse cx="200" cy="225" rx="160" ry="30" fill="#0f172a" stroke="#334155"/>
      <!-- Starship HLS Hull -->
      <defs>
        <linearGradient id="hlsHull" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#64748b"/>
          <stop offset="30%" stop-color="#f8fafc"/>
          <stop offset="70%" stop-color="#ffffff"/>
          <stop offset="100%" stop-color="#475569"/>
        </linearGradient>
      </defs>
      <rect x="182" y="55" width="36" height="120" fill="url(#hlsHull)" rx="3"/>
      <polygon points="182,55 200,20 218,55" fill="#f1f5f9"/>
      <!-- Forward Observation Window -->
      <rect x="194" y="38" width="12" height="4" fill="#0284c7"/>
      <!-- Heat Shield Tile Strip -->
      <rect x="182" y="55" width="6" height="120" fill="#0f172a"/>
      <!-- Landing Legs -->
      <line x1="184" y1="160" x2="162" y2="198" stroke="#94a3b8" stroke-width="3"/>
      <line x1="162" y1="198" x2="152" y2="198" stroke="#fbbf24" stroke-width="4"/>
      <line x1="216" y1="160" x2="238" y2="198" stroke="#94a3b8" stroke-width="3"/>
      <line x1="238" y1="198" x2="248" y2="198" stroke="#fbbf24" stroke-width="4"/>
      <!-- Headlights -->
      <polygon points="188,100 130,195 270,195 212,100" fill="rgba(255, 255, 255, 0.12)"/>
      <text x="200" y="230" font-family="'Courier New', monospace" font-size="11" fill="#fbbf24" text-anchor="middle" font-weight="bold">STARSHIP HLS // SOUTH POLE LANDER</text>
    </svg>`;
  }

  _generateShackletonSvg() {
    return `<svg viewBox="0 0 400 240" class="card-svg" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#020617"/>
      <!-- Crater Rim with Sunlit Crest & Pitch Black Shadow -->
      <ellipse cx="200" cy="130" rx="150" ry="60" fill="#0f172a" stroke="#64748b" stroke-width="2.5"/>
      <ellipse cx="200" cy="132" rx="110" ry="38" fill="#000000"/>
      <!-- Water-Ice Deposit in Deep Shadow -->
      <ellipse cx="200" cy="134" rx="45" ry="16" fill="#0369a1" opacity="0.75"/>
      <!-- Glistening Ice Crystals -->
      <circle cx="180" cy="132" r="2" fill="#38bdf8"/>
      <circle cx="215" cy="136" r="2" fill="#38bdf8"/>
      <circle cx="195" cy="138" r="2.5" fill="#ffffff"/>
      <!-- Low Lunar Sun Angle -->
      <polygon points="20,80 380,80 350,110 50,110" fill="rgba(251, 191, 36, 0.08)"/>
      <text x="200" y="140" font-family="'Courier New', monospace" font-size="9" fill="#7dd3fc" text-anchor="middle">PERMANENTLY SHADOWED ICE (-240°C)</text>
      <text x="200" y="225" font-family="'Courier New', monospace" font-size="11" fill="#94a3b8" text-anchor="middle" font-weight="bold">SHACKLETON CRATER // 100M+ TONS WATER ICE</text>
    </svg>`;
  }

  _generateReentrySvg() {
    return `<svg viewBox="0 0 400 240" class="card-svg" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#020617"/>
      <!-- Curved Atmosphere Layer -->
      <path d="M 0 200 Q 200 130 400 200" fill="none" stroke="#0284c7" stroke-width="28" opacity="0.45"/>
      <!-- Skip Reentry Flight Path -->
      <path d="M 40 70 Q 180 135 250 115 T 380 170" fill="none" stroke="#f43f5e" stroke-width="3.5" stroke-dasharray="6,4"/>
      <!-- Orion Capsule at Skip Point with Plasma Sheath -->
      <g transform="translate(180, 132) rotate(15)">
        <polygon points="-8,-12 8,-12 12,12 -12,12" fill="#e2e8f0"/>
        <path d="M -16 12 Q 0 20 16 12" fill="none" stroke="#ea580c" stroke-width="4"/>
        <path d="M -22 14 Q 0 26 22 14" fill="none" stroke="#facc15" stroke-width="2" opacity="0.8"/>
      </g>
      <text x="200" y="230" font-family="'Courier New', monospace" font-size="11" fill="#f87171" text-anchor="middle" font-weight="bold">ORION SKIP-ENTRY // 11 KM/S (MACH 32)</text>
    </svg>`;
  }

  _generateNrhoSvg() {
    return `<svg viewBox="0 0 400 240" class="card-svg" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#020617"/>
      <!-- Earth -->
      <circle cx="80" cy="120" r="30" fill="#1d4ed8" stroke="#60a5fa"/>
      <!-- Moon -->
      <circle cx="280" cy="120" r="18" fill="#475569" stroke="#94a3b8"/>
      <!-- NRHO 3D Halo Loop -->
      <ellipse cx="280" cy="95" rx="55" ry="75" fill="none" stroke="#00e5ff" stroke-width="2.5" stroke-dasharray="6,4" transform="rotate(-15 280 95)"/>
      <line x1="80" y1="120" x2="280" y2="120" stroke="rgba(255, 255, 255, 0.15)" stroke-dasharray="3,3"/>
      <text x="200" y="225" font-family="'Courier New', monospace" font-size="11" fill="#38bdf8" text-anchor="middle" font-weight="bold">EARTH-MOON L2 NRHO ORBITAL RESONANCE</text>
    </svg>`;
  }

  _generateEsmSvg() {
    return `<svg viewBox="0 0 400 240" class="card-svg" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#020617"/>
      <!-- European Service Module Body -->
      <rect x="170" y="85" width="60" height="55" fill="#e2e8f0" stroke="#64748b" rx="3"/>
      <!-- AJ10-190 Main Engine Nozzle -->
      <polygon points="190,140 210,140 206,165 194,165" fill="#334155"/>
      <!-- 4 Solar Array X-Wings -->
      <rect x="70" y="70" width="90" height="22" fill="#1e3a8a" stroke="#60a5fa" rx="2"/>
      <rect x="240" y="70" width="90" height="22" fill="#1e3a8a" stroke="#60a5fa" rx="2"/>
      <rect x="70" y="125" width="90" height="22" fill="#1e3a8a" stroke="#60a5fa" rx="2"/>
      <rect x="240" y="125" width="90" height="22" fill="#1e3a8a" stroke="#60a5fa" rx="2"/>
      <!-- ESA / European Flag Decal -->
      <circle cx="200" cy="105" r="7" fill="#003399"/>
      <text x="200" y="225" font-family="'Courier New', monospace" font-size="11" fill="#60a5fa" text-anchor="middle" font-weight="bold">EUROPEAN SERVICE MODULE (ESM)</text>
    </svg>`;
  }

  _generateSuitSvg() {
    return `<svg viewBox="0 0 400 240" class="card-svg" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#020617"/>
      <!-- Astronaut Helmet & Gold Visor -->
      <circle cx="200" cy="65" r="22" fill="#e2e8f0" stroke="#94a3b8" stroke-width="2"/>
      <ellipse cx="200" cy="65" rx="16" ry="12" fill="#f59e0b" stroke="#d97706" stroke-width="1.5"/>
      <!-- Torso & Backpack -->
      <rect x="178" y="90" width="44" height="60" fill="#f8fafc" stroke="#94a3b8" rx="4"/>
      <rect x="160" y="86" width="16" height="55" fill="#0f172a" stroke="#334155" rx="3"/>
      <!-- Arms with Bearing Joints -->
      <rect x="156" y="98" width="18" height="42" fill="#cbd5e1" rx="3"/>
      <rect x="226" y="98" width="18" height="42" fill="#cbd5e1" rx="3"/>
      <!-- Legs with Articulated Knees -->
      <rect x="180" y="152" width="18" height="46" fill="#e2e8f0" rx="3"/>
      <rect x="202" y="152" width="18" height="46" fill="#e2e8f0" rx="3"/>
      <!-- Blue Anodized Accent Trim -->
      <line x1="178" y1="120" x2="222" y2="120" stroke="#0284c7" stroke-width="3"/>
      <text x="200" y="225" font-family="'Courier New', monospace" font-size="11" fill="#fbbf24" text-anchor="middle" font-weight="bold">AxEMU LUNAR EXTRAVEHICULAR SPACESUIT</text>
    </svg>`;
  }

  _generateCryoSvg() {
    return `<svg viewBox="0 0 400 240" class="card-svg" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#020617"/>
      <!-- Vacuum Cryogenic Tank -->
      <defs>
        <radialGradient id="cryoGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#38bdf8"/>
          <stop offset="60%" stop-color="#0284c7"/>
          <stop offset="100%" stop-color="#082f49"/>
        </radialGradient>
      </defs>
      <!-- Multi-Layer Insulation Gold Shell -->
      <rect x="150" y="60" width="100" height="110" fill="#d97706" stroke="#fbbf24" stroke-width="2" rx="20"/>
      <!-- Inner Cryogenic LOX/LH2 Core -->
      <circle cx="200" cy="115" r="38" fill="url(#cryoGrad)"/>
      <!-- Pulse-Tube Cryo-Cooler Lines -->
      <line x1="130" y1="90" x2="150" y2="90" stroke="#00e5ff" stroke-width="3"/>
      <line x1="130" y1="140" x2="150" y2="140" stroke="#00e5ff" stroke-width="3"/>
      <circle cx="125" cy="115" r="12" fill="#1e293b" stroke="#00e5ff"/>
      <text x="200" y="120" font-family="'Courier New', monospace" font-size="10" fill="#ffffff" text-anchor="middle">LH2 20 K</text>
      <text x="200" y="225" font-family="'Courier New', monospace" font-size="11" fill="#38bdf8" text-anchor="middle" font-weight="bold">ZERO-BOIL-OFF CRYOGENIC STORAGE</text>
    </svg>`;
  }

  _generateMarsSvg() {
    return `<svg viewBox="0 0 400 240" class="card-svg" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#020617"/>
      <!-- Red Planet Mars -->
      <circle cx="200" cy="110" r="48" fill="#dc2626" stroke="#991b1b" stroke-width="2.5"/>
      <!-- Polar Ice Cap -->
      <ellipse cx="200" cy="68" rx="22" ry="7" fill="#fef2f2" opacity="0.9"/>
      <!-- Transfer Trajectory Arc -->
      <path d="M 60 190 Q 200 130 340 190" fill="none" stroke="#f59e0b" stroke-width="2.5" stroke-dasharray="5,5"/>
      <polygon points="260,152 272,145 270,160" fill="#f59e0b"/>
      <text x="200" y="225" font-family="'Courier New', monospace" font-size="11" fill="#ef4444" text-anchor="middle" font-weight="bold">DESTINATION MARS // DEEP SPACE PROVING GROUND</text>
    </svg>`;
  }
}

// Global Mount
window.addEventListener("DOMContentLoaded", () => {
  window.Archive = new ArtemisArchive();
});
