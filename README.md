# ARTEMIS IV: GATEWAY TO THE MOON

**Developed by Team Eclipse for the NASA Space Apps Challenge**  
**Target Platform:** Modern Web Browsers (`HTML5 Canvas 2D` + `Three.js WebGL` + `Web Audio API`)

---

## Mission Overview

**Artemis IV: Gateway to the Moon** is a single-page web aerospace simulation created for NASA's Space Apps Challenge. The simulation models the pivotal fourth phase of NASA's Artemis program:

* Debuting the super-heavy **SLS Block 1B** rocket with the **Exploration Upper Stage (EUS)**.
* Delivering the international **I-Hab** habitat module to the **Lunar Gateway** in Near-Rectilinear Halo Orbit (NRHO).
* Executing a precision human touchdown at the lunar South Pole (**Shackleton Crater**).
* Piloting **Orion** through a 25,000 mph atmospheric skip-entry return to Earth.

---

## Key Architectural Features

* **Dual-Canvas Rendering Engine:** Combines an HTML5 Canvas 2D rendering pipeline (Main Menu, Phase 1 Vertical Ascent, Phase 3 Lunar Lander) with a Three.js WebGL renderer (Phase 2 TLI Orbital Slingshot, Phase 4 Trans-Earth Injection). A dedicated lifecycle manager automatically pauses and disposes of 3D geometry and animation loops during 2D phases to prevent memory leaks.
* **Cross-Phase Shared Propellant Linking:** Tracks Orion's European Service Module (ESM) propellant reserve continuously across mission stages. Mid-course Delta-V burns in Phase 2 directly reduce fuel available for Phase 4. Players must conserve at least **35% propellant** in Phase 2 to survive Phase 4.
* **CAPCOM AI Aerospace Assistant:** An offline, instant-response flight controller terminal pre-programmed with 15+ technical aerospace briefings covering SLS Block 1B, EUS, I-Hab, Lunar Gateway, NRHO, Shackleton Crater, Starship HLS, Skip Reentry, Max-Q, and the Oberth Effect.
* **Sliding Educational Archive:** Remains classified until Phase 4 is completed. Once unlocked, it displays NASA engineering blueprints, RL10 engine specifications, lunar cold-trap temperature profiles, and thermodynamic ablation data.
* **Standalone Web Audio API Sound Synthesizer:** Generates procedural audio in real time with zero external audio dependencies—including Brownian noise rocket rumble, bandpass RCS thruster hiss, LFO-modulated Max-Q warning sirens, stage separation bursts, and mission completion fanfares.

---

## Project Structure

| File Name | Component Type | Description |
| :--- | :--- | :--- |
| `index.html` | Application Entry | Main single-page layout, UI overlays, and dual-canvas viewport containers. |
| `styles.css` | Stylesheet | HUD styling, telemetry displays, sliding archive transitions, and responsive layout. |
| `game.js` | Core Simulation Engine | 2D/3D physics loops, orbital mechanics, mission state management, and controls. |
| `audio.js` | Audio Synthesizer | Procedural Web Audio API sound generator for engines, alarms, and telemetry. |
| `capcom.js` | CAPCOM Assistant | Interactive flight controller logic and aerospace knowledge base. |
| `archive.js` | Technical Archive | Unlockable engineering reference data, specifications, and post-mission visuals. |
| `README.md` | Documentation | Repository overview, gameplay mechanics, and local deployment instructions. |

---

## Flight Controls & Mechanics

### Main Menu
* **`INITIATE MISSION`**: Opens the Flight Directory and Phase Selection interface.
* **`MISSION ARCHIVE`**: Slides the viewport to the Technical Archive section.
* **`ASK CAPCOM AI`**: Opens the interactive NASA Flight Controller terminal at the bottom-left.
* **`AUDIO ON/OFF`**: Toggles the procedural Web Audio API sound synthesizer.

### Phase 1: Liftoff & Stage Separation (2D Vertical Ascent)
* **`SPACE` or `UP ARROW`**: Throttle Up (hold for maximum thrust).
* **`DOWN ARROW`**: Throttle Down.
* **`S` or Click `JETTISON SRBs`**: Decouples Solid Rocket Boosters at burnout (~45 km altitude).
* **`C` or Click `CORE MECO / EUS`**: Jettisons Core Stage and ignites the Exploration Upper Stage (~120 km altitude).
* > **Physics Advisory:** Between **10 km and 18 km (Max-Q)**, throttle back to **65%–80%** to prevent structural failure from peak aerodynamic pressure.

### Phase 2: Trans-Lunar Injection & Gateway Rendezvous (3D WebGL)
* **Ejection Angle Slider (`0°` – `360°`)**: Sets the departure angle along Earth parking orbit.
* **Burn Power Slider (`1.0` – `4.5 km/s`)**: Adjusts the Delta-V applied to the predictive trajectory curve.
* **`W` / `A` / `S` / `D` or On-Screen RCS Buttons**: Fires mid-course correction thrusters en route (each burn consumes **4%** of Orion's ESM fuel reserve).
* **`CAM` Button**: Cycles between Angled Orbit, Top-Down, and Chase Camera views.
* **Win Condition:** Intersect the Lunar Gateway halo ring at safe capture velocity with at least **30% ESM fuel** remaining.

### Phase 3: Shackleton Crater Touchdown (2D Lunar Lander)
* **`W` or `UP ARROW`**: Fires Main Descent Engine to counter lunar gravity ($g = 1.62\text{ m/s}^2$).
* **`S` or `DOWN ARROW`**: Fires downward retro-thrusters.
* **`A` / `LEFT ARROW` & `D` / `RIGHT ARROW`**: Fires lateral RCS thrusters to cancel horizontal drift.
* **Win Condition:** Execute a soft landing on **Pad A, B, or C** with vertical speed `< 3.0 m/s` and lateral speed `< 2.0 m/s`.

### Phase 4: Trans-Earth Injection (3D WebGL)
* **Ejection Angle & Burn Power Sliders**: Calculates the return trajectory from lunar orbit back toward Earth.
* **`W` / `A` / `S` / `D` or On-Screen Buttons**: Executes mid-course corridor trimming burns.
* **Win Condition:** Guide Orion into Earth's narrow green **Atmospheric Entry Corridor** without burning up or skipping back into deep space.

### Post-Mission Finale
* **Mission Cutscene:** Displays four halftone-styled comic panels depicting ESM jettison, 25,000 mph plasma skip-entry, parachute deployment, and Pacific Ocean recovery.
* **Archive Unlock:** Completing Phase 4 permanently unlocks the classified **Artemis IV Educational Archive**.

---

## How to Run Locally

This project runs natively in any modern web browser (Chrome, Edge, Firefox, Safari) with **no build tools, external dependencies, or local server required**.

### Option 1: Direct Launch
1. Download and extract the project folder.
2. Double-click `index.html` to launch the simulation in your default browser.

### Option 2: Clone via Git
```bash
git clone [https://github.com/](https://github.com/)<your-username>/eclipse-project.git
cd eclipse-project
start index.html
