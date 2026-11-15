# ARTEMIS IV: GATEWAY TO THE MOON
**Developed by Team Éclipse for NASA's SpaceAppsChallenge.org**  
*Target Platform: Modern Web Browsers (HTML5 Canvas 2D + Three.js WebGL + Web Audio API)*

---

## 🚀 Mission Overview
**"Artemis IV: Gateway to the Moon"** is a high-fidelity, single-page web aerospace simulation created for NASA's Space Apps Challenge. The simulation models the pivotal fourth phase of NASA's Artemis program: debuting the super-heavy **SLS Block 1B** rocket with the **Exploration Upper Stage (EUS)**, delivering the international **I-Hab** habitat module to the **Lunar Gateway** in Near-Rectilinear Halo Orbit (NRHO), executing a precision human touchdown at the lunar **South Pole (Shackleton Crater)**, and piloting Orion through a 25,000 mph **atmospheric skip-entry** return to Earth.

---

## 🛠️ Key Architectural Features
1. **Dual-Canvas Rendering Engine**:
   - `#canvas2d`: HTML5 Canvas 2D for the Terraria-inspired Main Menu night sky, Phase 1 (SLS Vertical Ascent), and Phase 3 (Shackleton Crater Lunar Lander).
   - `#canvas3d`: Three.js WebGL renderer for Phase 2 (TLI Orbital Slingshot) and Phase 4 (Trans-Earth Injection & Entry Corridor).
   - Zero-leak lifecycle manager automatically pauses and disposes of Three.js geometry and requestAnimationFrame loops during 2D phases.

2. **Cross-Phase Shared Propellant Linking**:
   - `GameState.esmFuelReserve` tracks Orion's European Service Module (ESM) propellant.
   - Any mid-course Delta-V burns performed during Level 2 directly reduce the fuel available for Level 4's return burn. Players must save at least 35% fuel in Phase 2 to survive Phase 4!

3. **CAPCOM AI Aerospace Chatbot**:
   - Offline, instant-response flight controller terminal located at the bottom-left of the screen.
   - Pre-programmed with 15+ comprehensive technical intents covering SLS Block 1B, EUS, I-Hab, Lunar Gateway, NRHO, Shackleton Crater, Starship HLS, Skip Reentry, Max-Q, and the Oberth Effect.

4. **Sliding Educational Archive**:
   - Smooth horizontal camera slide (`translateX(-100vw)`) accessible via the Right Arrow button.
   - Classified until Phase 4 is completed. Once unlocked, reveals complete NASA engineering blueprints, RL10 engine specifications, cold-trap temperature data, and thermodynamic ablation curves.

5. **Standalone Web Audio API Sound Synthesizer**:
   - Custom synthesized rocket rumble (Brownian noise), RCS gas hiss (bandpass noise), Max-Q warning siren (LFO-modulated square wave), stage separation explosive bursts, and victory fanfares without any external audio asset dependencies.

---

## 🎮 Flight Controls & Mechanics

### Main Menu
- **[INITIATE MISSION]**: Opens the Flight Directory / Phase Selection screen.
- **[▶ MISSION ARCHIVE]** (Right edge / Menu button): Slides to the Technical Archive.
- **[ASK CAPCOM AI]** (Bottom-left pill): Opens the NASA Flight Controller terminal.
- **[🔊 AUDIO: ON/OFF]**: Toggles sound synthesizer.

### Phase 1: Liftoff & Stage Separation (2D Vertical Ascent)
- **[SPACE] or [▲]**: Throttle Up (hold for maximum thrust)
- **[▼]**: Throttle Down
- **[S] or Click 'JETTISON SRBs'**: Decouples Solid Rocket Boosters at burnout (~45 km)
- **[C] or Click 'CORE MECO / EUS'**: Jettisons Core Stage and ignites EUS (~120 km)
- *Physics Advisory*: At 10–18 km (Max-Q), throttle back to 65–80% to avoid structural failure from extreme aerodynamic pressure.

### Phase 2: Trans-Lunar Injection & Gateway (3D WebGL)
- **Ejection Angle Slider (0°–360°)**: Sets departure position along Earth orbit.
- **Burn Power Slider (1.0–4.5 km/s)**: Adjusts Delta-V applied to the predictive dotted trajectory curve.
- **[W / A / S / D] or On-Screen RCS Buttons**: Fire mid-course correction thrusters en route (each burn consumes 4% of Orion's ESM fuel reserve).
- **[🎥 CAM]**: Toggles between Angled Orbit, Top-Down, and Chase Camera views.
- *Win Condition*: Intersect Lunar Gateway's cyan halo ring at safe capture speed with $\ge 30\%$ ESM fuel.

### Phase 3: Shackleton Crater Touchdown (2D Lunar Lander)
- **[W] or [▲]**: Main Descent Engine (counters lunar gravity $g = 1.62 \text{ m/s}^2$)
- **[S] or [▼]**: Downward Retro-Thrusters
- **[A] / [◀] & [D] / [▶]**: Side RCS Thrusters (cancels lateral drift)
- *Win Condition*: Soft landing on Pad A, B, or C with $|V_y| < 3.0 \text{ m/s}$ and $|V_x| < 2.0 \text{ m/s}$.

### Phase 4: Trans-Earth Injection (3D WebGL)
- **Ejection Angle & Burn Power Sliders**: Calculate departure trajectory from lunar orbit back to Earth.
- **[W / A / S / D] / On-Screen Buttons**: Mid-course corridor trimming burns.
- *Win Condition*: Thread the needle into Earth's narrow green Atmospheric Entry Corridor without burning up or skipping into deep space!

### Post-Mission Cutscene & Finale
- 4 dynamic, halftone-styled comic book panels depicting ESM jettison, 25,000 mph plasma skip-entry, parachute deployment, and Pacific Ocean recovery.
- Unlocks the classified Artemis IV Educational Archive!

---

## 🚀 How to Run
Simply open `index.html` in any modern web browser (Google Chrome, Microsoft Edge, Mozilla Firefox, or Safari):
```bash
# Double-click index.html or open via command line:
start C:\Users\shibu\.gemini\antigravity\scratch\artemis-iv\index.html
```
No installation, npm build, or web server required!
