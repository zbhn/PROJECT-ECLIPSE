/**
 * ARTEMIS IV: GATEWAY TO THE MOON
 * Team Éclipse for NASA's SpaceAppsChallenge.org
 * 
 * game.js - Master Flight Computer & Simulation Engine
 * High-Fidelity Physics Calibration, Vector Aerospace Rendering,
 * Photorealistic 3D Textures & In-Game NASA Failure/Debrief Systems.
 */

// ==========================================
// 1. GLOBAL GAME STATE
// ==========================================
const GameState = {
  currentScreen: 'MENU', // MENU, ARCHIVE, LEVEL_SELECT, LEVEL_1, LEVEL_2, LEVEL_3, LEVEL_4, CUTSCENE, CREDITS
  unlockedLevels: 1, // 1 to 4
  archiveUnlocked: false,
  esmFuelReserve: 100.0 // Shared strictly between Level 2 and Level 4!
};

// ==========================================
// 2. PROCEDURAL TEXTURE GENERATOR FOR THREE.JS
// ==========================================
class ProceduralSpaceAssets {
    static getEarthTexture() {
    if (this._earthTex) return this._earthTex;
    const canvas = document.createElement("canvas");
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext("2d");
    
    // 1. Deep Ocean Base with Latitudinal Depth Gradient
    const oceanGrad = ctx.createLinearGradient(0, 0, 0, 1024);
    oceanGrad.addColorStop(0.0, '#06172e');  // Arctic deep abyss
    oceanGrad.addColorStop(0.15, '#0c2d5e'); // North Atlantic/Pacific
    oceanGrad.addColorStop(0.48, '#1d4ed8'); // Equatorial tropical vibrant blue
    oceanGrad.addColorStop(0.52, '#1e40af'); // Equatorial deep blue
    oceanGrad.addColorStop(0.85, '#0c2d5e'); // Southern oceans
    oceanGrad.addColorStop(1.0, '#06172e');  // Antarctic deep abyss
    ctx.fillStyle = oceanGrad;
    ctx.fillRect(0, 0, 2048, 1024);

    // 2. Continental Shelf / Shallow Reefs (Vibrant turquoise coastal fringe)
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.55)';
    ctx.fillStyle = 'rgba(6, 182, 212, 0.45)';
    ctx.lineWidth = 14;
    ctx.lineJoin = 'round';

    // Helper to draw filled landmass with realistic colors
    const drawLandmass = (pts, fillColor = '#15803d', strokeTurquoise = true) => {
      if (pts.length < 3) return;
      ctx.beginPath();
      ctx.moveTo(pts[0][0], pts[0][1]);
      for (let i = 1; i < pts.length; i++) {
        ctx.lineTo(pts[i][0], pts[i][1]);
      }
      ctx.closePath();

      if (strokeTurquoise) {
        ctx.stroke();
      }
      ctx.fillStyle = fillColor;
      ctx.fill();
    };

    // -------------------------------------------------------------
    // REALISTIC CONTINENTAL SILHOUETTES (Equirectangular 2048x1024)
    // -------------------------------------------------------------

    // --- NORTH AMERICA ---
    const northAmerica = [
      [280, 140], [330, 120], [380, 110], [440, 130], [470, 160],
      [520, 130], [580, 120], [640, 140], [680, 190],
      // Hudson Bay Cutout
      [640, 210], [600, 190], [580, 220], [610, 250], [640, 240],
      // Labrador & Newfoundland
      [690, 220], [740, 240], [710, 280],
      // US Eastern Seaboard (Nova Scotia, Cape Cod, Carolinas, Florida)
      [680, 310], [650, 340], [640, 370],
      // Florida Peninsula
      [635, 385], [645, 430], [630, 440], [620, 400],
      // Gulf of Mexico & Texas
      [590, 390], [540, 380], [520, 410],
      // Central America
      [510, 440], [530, 470], [560, 490], [610, 510],
      // Pacific Coastline (Baja California, California, Oregon, Alaska)
      [570, 520], [520, 480], [480, 430], [455, 380],
      [420, 350], [380, 270], [340, 240], [280, 220], [250, 170]
    ];
    drawLandmass(northAmerica, '#15803d'); // North American green forests

    // Greenland Ice Sheet
    const greenland = [
      [770, 90], [870, 100], [890, 160], [850, 220], [800, 210], [760, 150]
    ];
    drawLandmass(greenland, '#f1f5f9'); // White ice

    // Great Plains / American Southwest Arid Interior
    drawLandmass([
      [460, 300], [550, 290], [560, 370], [480, 370]
    ], '#b45309', false); // Desert tan/brown

    // --- SOUTH AMERICA ---
    const southAmerica = [
      [610, 510], [660, 500], [720, 510], [780, 540],
      // Brazilian Eastern Bulge (Recife/Salvador)
      [840, 600], [850, 650], [820, 710], [780, 750],
      // Argentina & Tierra del Fuego
      [740, 790], [720, 850], [700, 910], [670, 900],
      // Andes Pacific Western Coast (Chile, Peru, Ecuador)
      [660, 840], [650, 760], [640, 690], [620, 620], [610, 550]
    ];
    drawLandmass(southAmerica, '#166534'); // Amazon rainforest deep green

    // Andes Mountains Rocky Spine
    drawLandmass([
      [625, 540], [645, 650], [660, 780], [680, 870], [660, 870], [640, 760], [620, 650]
    ], '#78350f', false); // Andean mountain brown

    // --- EUROPE & SCANDINAVIA ---
    const europe = [
      [970, 290], [1020, 280], [1060, 270], [1120, 250], [1160, 270],
      // Black Sea & Balkans
      [1170, 310], [1120, 330],
      // Italy Boot
      [1080, 330], [1100, 370], [1085, 380], [1070, 340],
      // Mediterranean Coast & Iberia (Spain/Portugal)
      [1040, 340], [990, 350], [960, 340], [965, 300]
    ];
    drawLandmass(europe, '#15803d');

    // Scandinavia (Norway & Sweden)
    const scandinavia = [
      [1060, 130], [1120, 140], [1160, 170], [1130, 240], [1080, 230], [1060, 180]
    ];
    drawLandmass(scandinavia, '#166534');

    // British Isles
    drawLandmass([[980, 220], [1010, 200], [1020, 240], [990, 250]], '#15803d'); // Britain
    drawLandmass([[950, 220], [970, 220], [965, 250], [945, 240]], '#15803d'); // Ireland

    // --- AFRICA ---
    const africa = [
      [950, 340], [1020, 340], [1120, 330], [1200, 340], [1240, 360],
      // Red Sea Coast & Horn of Africa
      [1220, 400], [1280, 460], [1320, 500], [1280, 530],
      // East Africa & Mozambique
      [1260, 600], [1240, 700], [1200, 760],
      // South Africa (Cape of Good Hope)
      [1160, 790], [1120, 770], [1080, 720],
      // West Coast (Namibia, Angola, Congo)
      [1060, 640], [1040, 550],
      // Gulf of Guinea & West African Bulge
      [1040, 500], [980, 500], [920, 460], [910, 400], [940, 360]
    ];
    drawLandmass(africa, '#15803d'); // African landmass

    // Vast Sahara Desert (North Africa)
    drawLandmass([
      [950, 350], [1220, 350], [1250, 420], [1200, 460], [950, 460], [930, 400]
    ], '#d97706', false); // Golden Sahara sands

    // Kalahari Desert (South Africa)
    drawLandmass([[1100, 680], [1180, 680], [1170, 740], [1110, 740]], '#b45309', false);

    // Madagascar Island
    drawLandmass([[1310, 660], [1340, 670], [1320, 760], [1295, 740]], '#15803d');

    // --- ASIA & MIDDLE EAST ---
    const asia = [
      [1160, 260], [1240, 240], [1350, 210], [1500, 180], [1700, 160], [1850, 180],
      // Kamchatka & East Asia
      [1920, 220], [1880, 280], [1820, 300],
      // China & Korea
      [1760, 320], [1720, 310], [1680, 350], [1640, 380],
      // Southeast Asia / Indochina
      [1620, 450], [1630, 530], [1590, 520], [1570, 440],
      // Indian Subcontinent (Prominent triangular peninsula)
      [1520, 420], [1480, 450], [1440, 540], [1400, 460], [1360, 400],
      // Arabian Peninsula
      [1320, 410], [1310, 470], [1250, 450], [1230, 380], [1180, 360]
    ];
    drawLandmass(asia, '#15803d');

    // Arabian Desert
    drawLandmass([[1240, 380], [1310, 420], [1290, 470], [1240, 440]], '#d97706', false);

    // Gobi & Central Asian Deserts
    drawLandmass([[1380, 280], [1580, 270], [1560, 350], [1360, 360]], '#b45309', false);

    // Japanese Archipelago
    drawLandmass([[1770, 270], [1810, 290], [1820, 330], [1790, 340], [1760, 300]], '#15803d');

    // Indonesian Archipelago & Philippines
    drawLandmass([[1550, 560], [1620, 570], [1610, 590], [1540, 580]], '#15803d'); // Sumatra/Java
    drawLandmass([[1660, 550], [1720, 540], [1730, 580], [1670, 590]], '#15803d'); // Borneo/Sulawesi
    drawLandmass([[1760, 560], [1840, 570], [1830, 610], [1750, 600]], '#15803d'); // New Guinea

    // --- AUSTRALIA & NEW ZEALAND ---
    const australia = [
      [1640, 670], [1700, 650], [1730, 680], [1770, 690],
      // East Coast (Great Barrier Reef)
      [1800, 740], [1780, 810],
      // South Coast & Great Australian Bight
      [1720, 840], [1650, 830],
      // West Coast (Perth & Shark Bay)
      [1600, 780], [1590, 710], [1630, 680]
    ];
    drawLandmass(australia, '#166534');

    // Australian Red Outback Center
    drawLandmass([[1640, 710], [1740, 720], [1730, 800], [1630, 790]], '#c2410c', false);

    // New Zealand
    drawLandmass([[1860, 810], [1880, 820], [1870, 860], [1850, 850]], '#15803d');

    // --- POLAR ICE CAPS ---
    // Arctic Polar Cap (Top)
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(2048, 0);
    ctx.lineTo(2048, 65);
    for (let x = 2048; x >= 0; x -= 40) {
      ctx.lineTo(x, 50 + Math.sin(x * 0.05) * 15);
    }
    ctx.closePath();
    ctx.fill();

    // Antarctica Ice Sheet (Bottom)
    ctx.beginPath();
    ctx.moveTo(0, 1024);
    ctx.lineTo(2048, 1024);
    ctx.lineTo(2048, 930);
    for (let x = 2048; x >= 0; x -= 40) {
      ctx.lineTo(x, 940 + Math.sin(x * 0.04) * 18);
    }
    ctx.closePath();
    ctx.fill();

    // --- ATMOSPHERIC WEATHER SYSTEMS (Realistic Swirling Clouds) ---
    ctx.fillStyle = 'rgba(255, 255, 255, 0.62)';
    
    // Equatorial Intertropical Convergence Zone (ITCZ) Cloud Bands
    for (let i = 0; i < 40; i++) {
      const cx = (i * 54) % 2048;
      const cy = 480 + (Math.sin(i * 0.8) * 35);
      ctx.beginPath();
      ctx.ellipse(cx, cy, 65 + (i % 30), 14 + (i % 8), 0.1, 0, Math.PI * 2);
      ctx.fill();
    }

    // Mid-Latitude Storm Front Spirals (Atlantic & Pacific Cyclones)
    const drawCyclone = (cenX, cenY, radius) => {
      ctx.save();
      ctx.translate(cenX, cenY);
      for (let arm = 0; arm < 3; arm++) {
        ctx.rotate((Math.PI * 2) / 3);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(radius * 0.4, radius * 0.2, radius * 0.8, radius * 0.7, radius, radius * 0.4);
        ctx.bezierCurveTo(radius * 0.6, radius * 0.8, radius * 0.2, radius * 0.4, 0, 0);
        ctx.fill();
      }
      ctx.restore();
    };

    drawCyclone(720, 320, 95);  // North Atlantic storm
    drawCyclone(480, 240, 110); // North Pacific storm
    drawCyclone(1250, 680, 90); // South Indian Ocean storm
    drawCyclone(1750, 340, 105);// Western Pacific Typhoon

    // 6. Night-Side City Lights (Warm Sodium Streetlight Grid Networks)
    ctx.fillStyle = 'rgba(251, 191, 36, 0.75)';
    const cityCoords = [
      // North America (US East & West coasts, Great Lakes, Texas)
      [420, 310], [440, 330], [470, 320], [480, 335], [460, 350], [360, 340], [350, 360], [410, 370],
      // Europe (London, Paris, Berlin, Rome, Madrid)
      [1010, 270], [1030, 290], [1060, 275], [1070, 315], [990, 330],
      // Asia (Tokyo, Beijing, Shanghai, Seoul, Mumbai, Delhi, Singapore)
      [1780, 295], [1720, 315], [1710, 350], [1740, 305], [1460, 440], [1480, 390], [1590, 520],
      // South America & Australia
      [730, 680], [700, 720], [1780, 760], [1760, 800]
    ];
    cityCoords.forEach(([cx, cy]) => {
      ctx.beginPath();
      ctx.arc(cx, cy, 3.5, 0, Math.PI * 2);
      ctx.fill();
      for (let s = 0; s < 6; s++) {
        const sx = cx + (Math.sin(s * 1.5) * 8);
        const sy = cy + (Math.cos(s * 1.5) * 8);
        ctx.beginPath();
        ctx.arc(sx, sy, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    this._earthTex = new THREE.CanvasTexture(canvas);
    this._earthTex.needsUpdate = true;
    return this._earthTex;
  }

  static getMoonTexture() {
    if (this._moonTex) return this._moonTex;
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");

    // Highland Grey Base with layered noise
    const baseGrad = ctx.createLinearGradient(0, 0, 0, 512);
    baseGrad.addColorStop(0, '#8590a2');
    baseGrad.addColorStop(0.5, '#9aa5b8');
    baseGrad.addColorStop(1, '#788294');
    ctx.fillStyle = baseGrad;
    ctx.fillRect(0, 0, 1024, 512);

    // Subtle Regolith Highland Noise Texture
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    for (let n = 0; n < 3000; n++) {
      const nx = (n * 79) % 1024;
      const ny = (n * 53) % 512;
      ctx.fillRect(nx, ny, 1.5, 1.5);
    }

    // Lunar Maria (Vast Dark Basalt Lava Plains)
    const maria = [
      { x: 340, y: 170, rx: 84, ry: 68, fill: '#334155' }, // Oceanus Procellarum
      { x: 440, y: 230, rx: 116, ry: 90, fill: '#3b495d' }, // Mare Imbrium
      { x: 270, y: 270, rx: 64, ry: 50, fill: '#334155' },  // Mare Humorum
      { x: 660, y: 210, rx: 96, ry: 75, fill: '#37475c' },  // Mare Serenitatis
      { x: 590, y: 310, rx: 76, ry: 60, fill: '#3b495d' },  // Mare Tranquillitatis
      { x: 820, y: 180, rx: 70, ry: 55, fill: '#334155' }   // Mare Crisium
    ];
    maria.forEach(m => {
      ctx.fillStyle = m.fill;
      ctx.beginPath();
      ctx.ellipse(m.x, m.y, m.rx, m.ry, 0.15, 0, Math.PI * 2);
      ctx.fill();
    });

    // Tycho, Copernicus & Kepler Crater Ray Systems (Ejecta filaments)
    ctx.strokeStyle = 'rgba(241, 245, 249, 0.35)';
    ctx.lineWidth = 1.5;
    const rayCenters = [
      { x: 470, y: 390, count: 24, length: 180 }, // Tycho Crater
      { x: 400, y: 210, count: 16, length: 110 }, // Copernicus
      { x: 310, y: 230, count: 12, length: 85 }   // Kepler
    ];
    rayCenters.forEach(rc => {
      for (let r = 0; r < rc.count; r++) {
        const ang = (r * Math.PI * 2) / rc.count + (r * 0.1);
        ctx.beginPath();
        ctx.moveTo(rc.x, rc.y);
        ctx.lineTo(rc.x + Math.cos(ang) * rc.length, rc.y + Math.sin(ang) * rc.length);
        ctx.stroke();
      }
    });

    // Impact Craters with Sunlit Rim and Shadowed Floor
    for (let i = 0; i < 220; i++) {
      const x = (i * 89) % 1024;
      const y = (i * 59) % 512;
      const r = 2.0 + (i % 7);

      // Shadowed interior
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();

      // Sunlit rim crescent
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(x - 0.5, y - 0.5, r, Math.PI * 0.8, Math.PI * 1.8);
      ctx.stroke();
    }

    this._moonTex = new THREE.CanvasTexture(canvas);
    this._moonTex.needsUpdate = true;
    return this._moonTex;
  }

  static getCloudTexture() {
    if (this._cloudTex) return this._cloudTex;
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, 1024, 512);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.72)';

    for (let i = 0; i < 35; i++) {
      const cx = (i * 32) % 1024;
      const cy = 240 + Math.sin(i * 0.7) * 22;
      ctx.beginPath();
      ctx.ellipse(cx, cy, 45 + (i % 20), 10 + (i % 6), 0.08, 0, Math.PI * 2);
      ctx.fill();
    }

    const drawCloudFront = (cenX, cenY, radius) => {
      ctx.save();
      ctx.translate(cenX, cenY);
      for (let arm = 0; arm < 3; arm++) {
        ctx.rotate((Math.PI * 2) / 3);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(radius * 0.4, radius * 0.2, radius * 0.8, radius * 0.7, radius, radius * 0.35);
        ctx.bezierCurveTo(radius * 0.6, radius * 0.8, radius * 0.2, radius * 0.4, 0, 0);
        ctx.fill();
      }
      ctx.restore();
    };

    drawCloudFront(360, 160, 65);
    drawCloudFront(240, 120, 75);
    drawCloudFront(620, 340, 60);
    drawCloudFront(870, 170, 70);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    for (let i = 0; i < 20; i++) {
      const px = (i * 55) % 1024;
      ctx.beginPath();
      ctx.ellipse(px, 75 + (i % 15), 60, 12, -0.1, 0, Math.PI * 2);
      ctx.ellipse(px, 435 - (i % 15), 60, 12, 0.1, 0, Math.PI * 2);
      ctx.fill();
    }

    this._cloudTex = new THREE.CanvasTexture(canvas);
    return this._cloudTex;
  }
}

// ==========================================
// 3. DUAL-CANVAS & VIEWPORT CONTROLLER
// ==========================================
class DualCanvasController {
  constructor() {
    this.canvas2d = document.getElementById("canvas2d");
    this.ctx2d = this.canvas2d.getContext("2d");
    this.container3d = document.getElementById("canvas3d");
    
    this.activeMode = '2D'; // '2D' or '3D'
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    // Three.js instances
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.anim3dId = null;

    // Mouse drag spherical orbit controls for 3D views
    this.spherical = { radius: 520, theta: 0.35, phi: 1.15 };
    this.orbitCenter = { x: 0, y: 0, z: 0 };
    this.isDragging = false;
    this.prevMouse = { x: 0, y: 0 };

    this.initCanvasSize();
    this.initThreeRenderer();
    this.bindWindowEvents();
  }

  initCanvasSize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas2d.width = this.width;
    this.canvas2d.height = this.height;
  }

  initThreeRenderer() {
    if (typeof THREE === 'undefined') {
      console.warn("Three.js not loaded yet");
      return;
    }
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.container3d.innerHTML = "";
    this.container3d.appendChild(this.renderer.domElement);
  }

  bindWindowEvents() {
    window.addEventListener("resize", () => this.handleResize());

    // 3D Canvas Mouse Orbit Dragging
    window.addEventListener("mousedown", (e) => {
      if (this.activeMode === '3D') {
        this.isDragging = true;
        this.prevMouse.x = e.clientX;
        this.prevMouse.y = e.clientY;
      }
    });

    window.addEventListener("mousemove", (e) => {
      if (!this.isDragging || this.activeMode !== '3D') return;
      const dx = e.clientX - this.prevMouse.x;
      const dy = e.clientY - this.prevMouse.y;
      this.spherical.theta -= dx * 0.006;
      this.spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, this.spherical.phi - dy * 0.006));
      this.prevMouse.x = e.clientX;
      this.prevMouse.y = e.clientY;
    });

    window.addEventListener("mouseup", () => { this.isDragging = false; });

    window.addEventListener("wheel", (e) => {
      if (this.activeMode === '3D') {
        this.spherical.radius = Math.max(140, Math.min(1200, this.spherical.radius + e.deltaY * 0.4));
      }
    });
  }

  handleResize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas2d.width = this.width;
    this.canvas2d.height = this.height;

    if (this.renderer && this.camera) {
      this.camera.aspect = this.width / this.height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(this.width, this.height);
    }
  }

  switchMode(mode) {
    this.activeMode = mode;
    this.handleResize();
    if (mode === '2D') {
      this.canvas2d.style.display = 'block';
      this.container3d.style.display = 'none';
      if (this.anim3dId) {
        cancelAnimationFrame(this.anim3dId);
        this.anim3dId = null;
      }
    } else {
      this.canvas2d.style.display = 'none';
      this.container3d.style.display = 'block';
      if (this.renderer) {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
      }
    }
  }

  init3dScene() {
    this.clear3dScene();
    if (!this.renderer && typeof THREE !== 'undefined') {
      this.initThreeRenderer();
    }
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(50, this.width / this.height, 0.1, 12000);
    return { scene: this.scene, camera: this.camera };
  }

  render3d() {
    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }

  clear3dScene() {
    if (this.anim3dId) {
      cancelAnimationFrame(this.anim3dId);
      this.anim3dId = null;
    }
    if (this.scene) {
      while (this.scene.children.length > 0) {
        const obj = this.scene.children[0];
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) {
            obj.material.forEach(m => m.dispose());
          } else {
            obj.material.dispose();
          }
        }
        this.scene.remove(obj);
      }
    }
  }
}

// ==========================================
// 4. MAIN MENU & TERRARIA-INSPIRED PARALLAX SKY
// ==========================================
class TerrariaParallaxSky {
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.stars = [];
    this.shootingStars = [];
    this.clouds = [];
    this.cryoParticles = [];
    this.constellations = [];
    this.lastShootingStarTime = Date.now();
    this.init();
  }

  init() {
    this.stars = [];
    for (let i = 0; i < 280; i++) {
      this.stars.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * (this.canvas.height * 0.75),
        size: Math.random() * 2.2 + 0.6,
        baseAlpha: Math.random() * 0.7 + 0.3,
        pulseSpeed: Math.random() * 2 + 1,
        phase: Math.random() * Math.PI * 2,
        color: Math.random() > 0.8 ? '#38bdf8' : (Math.random() > 0.9 ? '#fde047' : '#ffffff')
      });
    }

    this.setupConstellations();

    this.clouds = [];
    for (let i = 0; i < 5; i++) {
      this.clouds.push({
        x: Math.random() * this.canvas.width,
        y: (this.canvas.height * 0.15) + (i * 70),
        width: 350 + Math.random() * 250,
        height: 60 + Math.random() * 40,
        speed: 0.12 + (i * 0.08),
        opacity: 0.08 + (i * 0.04)
      });
    }
  }

  setupConstellations() {
    const W = this.canvas.width;
    const H = this.canvas.height;
    
    // Orion
    const orionOrigin = { x: W * 0.22, y: H * 0.25 };
    this.constellations.push({
      name: "ORION",
      stars: [
        { x: orionOrigin.x - 30, y: orionOrigin.y - 45 },
        { x: orionOrigin.x + 35, y: orionOrigin.y - 40 },
        { x: orionOrigin.x - 12, y: orionOrigin.y },
        { x: orionOrigin.x, y: orionOrigin.y + 2 },
        { x: orionOrigin.x + 12, y: orionOrigin.y + 4 },
        { x: orionOrigin.x - 35, y: orionOrigin.y + 50 },
        { x: orionOrigin.x + 30, y: orionOrigin.y + 45 }
      ],
      lines: [[0, 1], [0, 2], [1, 4], [2, 3], [3, 4], [2, 5], [4, 6], [5, 6]]
    });

    // Cassiopeia ('W')
    const casOrigin = { x: W * 0.74, y: H * 0.20 };
    this.constellations.push({
      name: "CASSIOPEIA",
      stars: [
        { x: casOrigin.x - 50, y: casOrigin.y + 20 },
        { x: casOrigin.x - 25, y: casOrigin.y - 15 },
        { x: casOrigin.x, y: casOrigin.y + 10 },
        { x: casOrigin.x + 30, y: casOrigin.y - 20 },
        { x: casOrigin.x + 55, y: casOrigin.y + 15 }
      ],
      lines: [[0, 1], [1, 2], [2, 3], [3, 4]]
    });
  }

  updateAndRender() {
    const ctx = this.ctx;
    const W = this.canvas.width;
    const H = this.canvas.height;
    const time = Date.now() * 0.001;

    // Atmospheric Florida Night Gradient
    const skyGrad = ctx.createLinearGradient(0, 0, 0, H);
    skyGrad.addColorStop(0, '#020617');
    skyGrad.addColorStop(0.5, '#071630');
    skyGrad.addColorStop(0.85, '#0a254c');
    skyGrad.addColorStop(1, '#051124');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, W, H);

    // Constellations
    this.constellations.forEach(c => {
      ctx.save();
      const pulse = 0.4 + Math.sin(time * 1.5) * 0.2;
      ctx.strokeStyle = `rgba(56, 189, 248, ${pulse})`;
      ctx.lineWidth = 1.2;
      ctx.setLineDash([4, 4]);

      c.lines.forEach(([i, j]) => {
        ctx.beginPath();
        ctx.moveTo(c.stars[i].x, c.stars[i].y);
        ctx.lineTo(c.stars[j].x, c.stars[j].y);
        ctx.stroke();
      });

      c.stars.forEach(s => {
        ctx.fillStyle = '#38bdf8';
        ctx.shadowColor = '#00e5ff';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(s.x, s.y, 2.5, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();
    });

    // Stars Twinkle
    this.stars.forEach(star => {
      const alpha = star.baseAlpha + Math.sin(time * star.pulseSpeed + star.phase) * 0.3;
      ctx.fillStyle = star.color;
      ctx.globalAlpha = Math.max(0.1, Math.min(1, alpha));
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1.0;

    // Shooting Stars
    if (Date.now() - this.lastShootingStarTime > 4500 + Math.random() * 2500) {
      this.shootingStars.push({
        x: Math.random() * (W * 0.8),
        y: Math.random() * (H * 0.4),
        vx: 12 + Math.random() * 8,
        vy: 5 + Math.random() * 4,
        life: 1.0
      });
      this.lastShootingStarTime = Date.now();
    }

    for (let i = this.shootingStars.length - 1; i >= 0; i--) {
      const s = this.shootingStars[i];
      s.x += s.vx;
      s.y += s.vy;
      s.life -= 0.025;

      if (s.life <= 0) {
        this.shootingStars.splice(i, 1);
        continue;
      }

      ctx.save();
      const grad = ctx.createLinearGradient(s.x, s.y, s.x - (s.vx * 4), s.y - (s.vy * 4));
      grad.addColorStop(0, `rgba(255, 255, 255, ${s.life})`);
      grad.addColorStop(0.5, `rgba(56, 189, 248, ${s.life * 0.6})`);
      grad.addColorStop(1, 'rgba(56, 189, 248, 0)');
      ctx.strokeStyle = grad;
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(s.x - (s.vx * 4), s.y - (s.vy * 4));
      ctx.stroke();
      ctx.restore();
    }

    // Drifting Parallax Clouds
    this.clouds.forEach(c => {
      c.x += c.speed;
      if (c.x - c.width > W) c.x = -c.width;

      ctx.save();
      ctx.fillStyle = `rgba(12, 30, 60, ${c.opacity})`;
      ctx.beginPath();
      ctx.ellipse(c.x, c.y, c.width * 0.5, c.height * 0.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // Kennedy Space Center Pad 39B & Venting SLS Rocket
    this.renderLaunchPadAndRocket(W, H, time);
  }

  renderLaunchPadAndRocket(W, H, time) {
    const ctx = this.ctx;
    const padX = W * 0.5;
    const padY = H - 20;

    // Ground horizon
    ctx.fillStyle = '#020814';
    ctx.fillRect(0, H - 35, W, 35);
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.2)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, H - 35);
    ctx.lineTo(W, H - 35);
    ctx.stroke();

    // Warm Spotlights
    ctx.save();
    const beam1 = ctx.createRadialGradient(padX - 90, padY, 10, padX - 90, padY - 240, 160);
    beam1.addColorStop(0, 'rgba(254, 243, 199, 0.35)');
    beam1.addColorStop(0.5, 'rgba(251, 191, 36, 0.12)');
    beam1.addColorStop(1, 'rgba(251, 191, 36, 0)');
    ctx.fillStyle = beam1;
    ctx.beginPath();
    ctx.moveTo(padX - 100, padY);
    ctx.lineTo(padX - 160, padY - 260);
    ctx.lineTo(padX - 20, padY - 260);
    ctx.lineTo(padX - 80, padY);
    ctx.fill();

    const beam2 = ctx.createRadialGradient(padX + 90, padY, 10, padX + 90, padY - 240, 160);
    beam2.addColorStop(0, 'rgba(254, 243, 199, 0.35)');
    beam2.addColorStop(0.5, 'rgba(251, 191, 36, 0.12)');
    beam2.addColorStop(1, 'rgba(251, 191, 36, 0)');
    ctx.fillStyle = beam2;
    ctx.beginPath();
    ctx.moveTo(padX + 80, padY);
    ctx.lineTo(padX + 20, padY - 260);
    ctx.lineTo(padX + 160, padY - 260);
    ctx.lineTo(padX + 100, padY);
    ctx.fill();
    ctx.restore();

    // Pad Hardstand & Tower
    ctx.fillStyle = '#060e1e';
    ctx.fillRect(padX - 110, padY - 25, 220, 25);
    ctx.fillStyle = '#0a162c';
    ctx.fillRect(padX - 70, padY - 50, 140, 25);

    // Tower Structure & Umbilicals
    const towerX = padX - 45;
    ctx.fillStyle = '#64748b';
    ctx.fillRect(towerX - 18, padY - 260, 22, 210);

    // Lightning Mast
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(towerX - 7, padY - 260);
    ctx.lineTo(towerX - 7, padY - 310);
    ctx.stroke();

    // Rocket on Pad
    const rX = padX + 5;
    const rBaseY = padY - 50;

    // Render Vector SLS
    renderVectorRocket(ctx, rX, rBaseY - 100, 0, 0, 0, time);

    // Cryo-Oxygen Vapor
    if (Math.random() > 0.35) {
      this.cryoParticles.push({
        x: rX - 14,
        y: rBaseY - 140 + Math.random() * 20,
        vx: -(0.8 + Math.random() * 1.2),
        vy: -(0.2 + Math.random() * 0.4),
        size: 3 + Math.random() * 5,
        alpha: 0.7
      });
    }

    for (let i = this.cryoParticles.length - 1; i >= 0; i--) {
      const p = this.cryoParticles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.size += 0.15;
      p.alpha -= 0.015;

      if (p.alpha <= 0) {
        this.cryoParticles.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.fillStyle = `rgba(241, 245, 249, ${p.alpha * 0.5})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }
}

// ==========================================
// 5. VECTOR ROCKET RENDERER (ALL STAGES)
// ==========================================
function renderVectorRocket(ctx, rX, rY, stage, throttle, altitude, time) {
  ctx.save();
  ctx.translate(rX, rY);

  if (stage === 0) {
    // --- STAGE 0: FULL SLS BLOCK 1B STACK ---
    // 1. Twin Solid Rocket Boosters (Left & Right)
    const drawBooster = (bx) => {
      ctx.save();
      // White body with segment rings
      const bGrad = ctx.createLinearGradient(bx - 7, 0, bx + 7, 0);
      bGrad.addColorStop(0, '#cbd5e1');
      bGrad.addColorStop(0.4, '#ffffff');
      bGrad.addColorStop(1, '#94a3b8');
      ctx.fillStyle = bGrad;
      ctx.fillRect(bx - 7, -65, 14, 150);

      // 5 segments black separation rings
      ctx.fillStyle = '#0f172a';
      for (let s = 0; s < 5; s++) {
        ctx.fillRect(bx - 7, -65 + (s * 30), 14, 2);
      }

      // Nose Cone & Forward BSRM separation nozzles
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.moveTo(bx - 7, -65);
      ctx.lineTo(bx, -85);
      ctx.lineTo(bx + 7, -65);
      ctx.closePath();
      ctx.fill();

      // Nose black roll stripe
      ctx.fillStyle = '#020617';
      ctx.fillRect(bx - 5, -75, 10, 4);

      // Aft Skirt & Gimbal Nozzle
      ctx.fillStyle = '#475569';
      ctx.beginPath();
      ctx.moveTo(bx - 7, 85);
      ctx.lineTo(bx - 9, 98);
      ctx.lineTo(bx + 9, 98);
      ctx.lineTo(bx + 7, 85);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    drawBooster(-26); // Left SRB
    drawBooster(26);  // Right SRB

    // 2. Orange Core Stage
    const coreGrad = ctx.createLinearGradient(-16, 0, 16, 0);
    coreGrad.addColorStop(0, '#9a3412');
    coreGrad.addColorStop(0.2, '#ea580c');
    coreGrad.addColorStop(0.5, '#fb923c');
    coreGrad.addColorStop(0.8, '#ea580c');
    coreGrad.addColorStop(1, '#7c2d12');
    ctx.fillStyle = coreGrad;
    ctx.fillRect(-16, -70, 32, 160);

    // Vertical Stringer Lines (Fluted panel texture)
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)';
    ctx.lineWidth = 1;
    for (let lx = -12; lx <= 12; lx += 4) {
      ctx.beginPath();
      ctx.moveTo(lx, -70);
      ctx.lineTo(lx, 90);
      ctx.stroke();
    }

    // External Cryogenic Feedline Pipe (Left)
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-14, -60, 2.5, 140);
    // Systems Tunnel Conduit (Right)
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(11.5, -60, 2.5, 140);

    // NASA Worm Logo (Red Vector on Core)
    ctx.save();
    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'center';
    ctx.translate(0, 0);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText("NASA", -10, 4);
    ctx.restore();

    // 4x RS-25 Core Engines
    const drawEngineBell = (ex) => {
      ctx.fillStyle = '#334155';
      ctx.beginPath();
      ctx.moveTo(ex - 3.5, 90);
      ctx.lineTo(ex - 5.5, 102);
      ctx.lineTo(ex + 5.5, 102);
      ctx.lineTo(ex + 3.5, 90);
      ctx.closePath();
      ctx.fill();
      // Glowing yellow throat
      if (throttle > 0.05) {
        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(ex - 3, 91, 6, 2);
      }
    };
    drawEngineBell(-10);
    drawEngineBell(-3.5);
    drawEngineBell(3.5);
    drawEngineBell(10);

    // 3. Forward Interstage & EUS (White Section)
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(-16, -105, 32, 35);
    // Checkerboard roll pattern
    ctx.fillStyle = '#020617';
    ctx.fillRect(-16, -100, 8, 8);
    ctx.fillRect(8, -100, 8, 8);

    // 4. Universal Stage Adapter (USA) & Orion Spacecraft
    ctx.fillStyle = '#e2e8f0';
    ctx.beginPath();
    ctx.moveTo(-16, -105);
    ctx.lineTo(-13, -125);
    ctx.lineTo(13, -125);
    ctx.lineTo(16, -105);
    ctx.closePath();
    ctx.fill();

    // Orion Capsule (Cone with visor)
    ctx.fillStyle = '#f1f5f9';
    ctx.beginPath();
    ctx.moveTo(-13, -125);
    ctx.lineTo(0, -150);
    ctx.lineTo(13, -125);
    ctx.closePath();
    ctx.fill();
    // Capsule Windows
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(-4, -135, 8, 3);

    // 5. Launch Abort System (LAS) Tower & Spike
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(-4, -165, 8, 15);
    // Red Abort Spike
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, -165);
    ctx.lineTo(0, -188);
    ctx.stroke();

  } else if (stage === 1) {
    // --- STAGE 1: CORE STAGE + EUS + ORION (BOOSTERS SEPARATED) ---
    const coreGrad = ctx.createLinearGradient(-16, 0, 16, 0);
    coreGrad.addColorStop(0, '#9a3412');
    coreGrad.addColorStop(0.2, '#ea580c');
    coreGrad.addColorStop(0.5, '#fb923c');
    coreGrad.addColorStop(0.8, '#ea580c');
    coreGrad.addColorStop(1, '#7c2d12');
    ctx.fillStyle = coreGrad;
    ctx.fillRect(-16, -70, 32, 160);

    // 4x RS-25 Core Engines
    const drawEngineBell = (ex) => {
      ctx.fillStyle = '#334155';
      ctx.beginPath();
      ctx.moveTo(ex - 3.5, 90);
      ctx.lineTo(ex - 5.5, 102);
      ctx.lineTo(ex + 5.5, 102);
      ctx.lineTo(ex + 3.5, 90);
      ctx.closePath();
      ctx.fill();
    };
    drawEngineBell(-10);
    drawEngineBell(-3.5);
    drawEngineBell(3.5);
    drawEngineBell(10);

    // EUS & Orion
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(-16, -105, 32, 35);
    ctx.fillStyle = '#f1f5f9';
    ctx.beginPath();
    ctx.moveTo(-13, -125);
    ctx.lineTo(0, -150);
    ctx.lineTo(13, -125);
    ctx.closePath();
    ctx.fill();

  } else {
    // --- STAGE 2: EXPLORATION UPPER STAGE (EUS) + I-HAB + ORION ---
    // 1. 4x Aerojet Rocketdyne RL10C-3 Vacuum Engines
    const drawRL10 = (ex) => {
      ctx.fillStyle = '#475569';
      ctx.beginPath();
      ctx.moveTo(ex - 3, 50);
      ctx.lineTo(ex - 6, 68);
      ctx.lineTo(ex + 6, 68);
      ctx.lineTo(ex + 3, 50);
      ctx.closePath();
      ctx.fill();
      // Glowing blue vacuum nozzle throat
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(ex - 3, 51, 6, 2);
    };
    drawRL10(-10);
    drawRL10(-3.5);
    drawRL10(3.5);
    drawRL10(10);

    // 2. Exploration Upper Stage (EUS) 8.4m Cryogenic Tank
    const eusGrad = ctx.createLinearGradient(-16, 0, 16, 0);
    eusGrad.addColorStop(0, '#cbd5e1');
    eusGrad.addColorStop(0.3, '#f8fafc');
    eusGrad.addColorStop(0.7, '#ffffff');
    eusGrad.addColorStop(1, '#94a3b8');
    ctx.fillStyle = eusGrad;
    ctx.fillRect(-16, -20, 32, 70);

    // EUS stringers & USA logo
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1;
    ctx.strokeRect(-16, -20, 32, 70);
    ctx.fillStyle = '#0284c7';
    ctx.font = '8px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText("EUS // NASA", 0, 15);

    // 3. International Habitat (I-Hab) Module with Gold MLI Insulation
    const ihabGrad = ctx.createLinearGradient(-13, 0, 13, 0);
    ihabGrad.addColorStop(0, '#b45309');
    ihabGrad.addColorStop(0.5, '#f59e0b');
    ihabGrad.addColorStop(1, '#78350f');
    ctx.fillStyle = ihabGrad;
    ctx.fillRect(-13, -55, 26, 35);
    // Docking collar ring
    ctx.fillStyle = '#64748b';
    ctx.fillRect(-10, -58, 20, 3);

    // 4. Orion Spacecraft (Command & Service Module)
    // European Service Module (ESM)
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(-12, -75, 24, 18);
    // Orion Crew Module Cone
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(-12, -75);
    ctx.lineTo(0, -100);
    ctx.lineTo(12, -75);
    ctx.closePath();
    ctx.fill();
    // Heat Shield Base
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-12, -74);
    ctx.lineTo(12, -74);
    ctx.stroke();
    // Windows
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(-4, -86, 8, 3);
  }

  ctx.restore();
}



// ==========================================
// 6. LEVEL 1: LIFTOFF & STAGE SEPARATION (REALISTIC PAD 39B & 2D ASCENT)
// ==========================================

// ==========================================
// 6. LEVEL 1: LIFTOFF & STAGE SEPARATION (REALISTIC PAD 39B & 2D ASCENT)
// ==========================================

// ==========================================
// 6. LEVEL 1: LIFTOFF & STAGE SEPARATION (2D Vertical Ascent)
// Physics Calibration: Authentic Gravity Deceleration, Optimal Power Liftoff,
// Clean Rocket Plumes (Zero background smoke clutter), Kennedy Space Center Pad 39B Scenery

// ==========================================
// 6. LEVEL 1: LIFTOFF & STAGE SEPARATION (ELITE 2D VERTICAL ASCENT)
// Continuous Horizon Transition, Gravity Turn Pitch, Pad 39B & Blue Marble Earth
// ==========================================
class Level1Ascent {
  constructor(canvas, ctx, onComplete, onFail) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.onComplete = onComplete;
    this.onFail = onFail;
    this.active = false;

    // Flight Telemetry
    this.altitude = 0.0;           // km (Target: 200.0 km)
    this.velocity = 0.0;           // km/s (Target: >= 7.50 km/s)
    this.throttle = 0.0;           // 0.0 to 1.0 (HOLD TO THRUST)
    this.targetThrottle = 0.0;
    this.flightTime = 0.0;
    this.pitchAngle = 0.0;         // Radians (Gravity Turn: 0 at launch, tilts to ~1.2 rad at orbit)
    this.stage = 0;                // 0: SRB + Core, 1: Core Alone, 2: EUS Cryogenic

    // Consumables & Propellant Tanks
    this.srbFuel = 100.0;          // %
    this.coreFuel = 100.0;         // %
    this.eusFuel = 100.0;          // %

    // Structural Aerodynamics
    this.structuralStress = 0.0;   // 0 to 100%
    this.stagingState = null;      // null, 'SRB_WINDOW', 'CORE_WINDOW'
    this.stagingTimer = 0.0;
    this.stagingDuration = 4.5;    // seconds

    // Input States
    this.isThrustKeyDown = false;
    this.isMaxQKeyDown = false;
    this.isPointerThrusting = false;
    this.isPointerMaxQ = false;

    // Visual Emitters & Particles
    this.plumeParticles = [];
    this.srbTumbleDebris = [];
    this.vaporConeActive = false;
    this.screenRumble = 0.0;

    this.bindEvents();
  }

  bindEvents() {
    window.addEventListener("keydown", (e) => {
      if (!this.active || GameState.currentScreen !== 'LEVEL_1') return;
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        this.isThrustKeyDown = true;
      }
      if (e.code === 'KeyT') {
        this.isMaxQKeyDown = true;
      }
      if (e.code === 'KeyS' && this.stagingState === 'SRB_WINDOW') {
        this.jettisonSRBs(true);
      }
      if (e.code === 'KeyC' && this.stagingState === 'CORE_WINDOW') {
        this.jettisonCoreStage(true);
      }
    });

    window.addEventListener("keyup", (e) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        this.isThrustKeyDown = false;
      }
      if (e.code === 'KeyT') {
        this.isMaxQKeyDown = false;
      }
    });
  }

  start() {
    this.active = true;
    this.altitude = 0.0;
    this.velocity = 0.0;
    this.throttle = 0.0;
    this.targetThrottle = 0.0;
    this.flightTime = 0.0;
    this.pitchAngle = 0.0;
    this.stage = 0;

    this.srbFuel = 100.0;
    this.coreFuel = 100.0;
    this.eusFuel = 100.0;
    this.structuralStress = 0.0;
    this.stagingState = null;
    this.stagingTimer = 0.0;

    this.plumeParticles = [];
    this.srbTumbleDebris = [];
    this.vaporConeActive = false;
    this.screenRumble = 0.0;

    this.hideStagingTimer();
    this.hideAlert();
    this.updateHUDControls();
    this.updateScienceBox("Launch Pad 39B Ready: Twin 5-Segment Solid Rocket Boosters & 4 RS-25 Core Engines deliver 8.8 million lbs of thrust. HOLD [SPACE] TO IGNITE & ASCEND!");
  }

  stop() {
    this.active = false;
    this.hideStagingTimer();
    this.hideAlert();
    if (window.Sound) window.Sound.stopRocketThrottle();
  }

  updateHUDControls() {
    const actionBox = document.getElementById("hud-action-bar");
    if (!actionBox) return;
    actionBox.innerHTML = `
      <button id="btn-throttle-hold" class="hud-btn btn-primary" style="min-width: 190px;">🔥 HOLD FOR FULL THRUST [SPACE]</button>
      <button id="btn-maxq-hold" class="hud-btn" style="border-color: #f59e0b; color: #fbbf24;">⚡ HOLD MAX-Q (75%) [T]</button>
      <button id="btn-srb-sep" class="hud-btn btn-danger" style="display: none; animation: pulseAlert 0.5s infinite alternate;">JETTISON SRBs [S]</button>
      <button id="btn-core-sep" class="hud-btn btn-danger" style="display: none; animation: pulseAlert 0.5s infinite alternate;">JETTISON CORE STAGE [C]</button>
    `;

    const btnHold = document.getElementById("btn-throttle-hold");
    const btnMaxQ = document.getElementById("btn-maxq-hold");
    const btnSrb = document.getElementById("btn-srb-sep");
    const btnCore = document.getElementById("btn-core-sep");

    if (btnHold) {
      btnHold.addEventListener("mousedown", () => { this.isPointerThrusting = true; });
      btnHold.addEventListener("mouseup", () => { this.isPointerThrusting = false; });
      btnHold.addEventListener("mouseleave", () => { this.isPointerThrusting = false; });
      btnHold.addEventListener("touchstart", (e) => { e.preventDefault(); this.isPointerThrusting = true; });
      btnHold.addEventListener("touchend", (e) => { e.preventDefault(); this.isPointerThrusting = false; });
    }

    if (btnMaxQ) {
      btnMaxQ.addEventListener("mousedown", () => { this.isPointerMaxQ = true; });
      btnMaxQ.addEventListener("mouseup", () => { this.isPointerMaxQ = false; });
      btnMaxQ.addEventListener("mouseleave", () => { this.isPointerMaxQ = false; });
      btnMaxQ.addEventListener("touchstart", (e) => { e.preventDefault(); this.isPointerMaxQ = true; });
      btnMaxQ.addEventListener("touchend", (e) => { e.preventDefault(); this.isPointerMaxQ = false; });
    }

    if (btnSrb) {
      btnSrb.addEventListener("click", () => {
        if (this.stagingState === 'SRB_WINDOW') this.jettisonSRBs(true);
      });
    }

    if (btnCore) {
      btnCore.addEventListener("click", () => {
        if (this.stagingState === 'CORE_WINDOW') this.jettisonCoreStage(true);
      });
    }
  }

  showStagingTimer(title, prompt) {
    const box = document.getElementById("hud-staging-timer");
    const titleEl = document.getElementById("staging-timer-title");
    const promptEl = document.getElementById("staging-timer-prompt");
    const secEl = document.getElementById("staging-timer-seconds");
    const fillEl = document.getElementById("staging-timer-fill");

    if (box) box.style.display = "block";
    if (titleEl) titleEl.innerText = title;
    if (promptEl) promptEl.innerText = prompt;
    if (secEl) secEl.innerText = `${this.stagingTimer.toFixed(1)}s`;
    if (fillEl) fillEl.style.width = "100%";
    this.showAlert(`⚡ STAGE SEPARATION READY: ${prompt}`);
  }

  hideStagingTimer() {
    const box = document.getElementById("hud-staging-timer");
    if (box) box.style.display = "none";
  }

  jettisonSRBs(manual = true) {
    this.stage = 1;
    this.stagingState = null;
    this.hideStagingTimer();

    const btn = document.getElementById("btn-srb-sep");
    if (btn) btn.style.display = "none";
    this.hideAlert();

    if (window.Sound) window.Sound.playStageSeparation();

    // Twin tumbling boosters with pyrotechnic separation
    this.srbTumbleDebris.push(
      { side: -1, x: -32, y: 15, vx: -3.8, vy: 1.2, rot: 0, rotSpeed: -0.06, alpha: 1.0 },
      { side: 1,  x: 32,  y: 15, vx: 3.8,  vy: 1.2, rot: 0, rotSpeed: 0.06,  alpha: 1.0 }
    );

    this.updateScienceBox(
      manual
        ? "SRB Separation Nominal! Twin 5-Segment Solid Rocket Boosters jettisoned cleanly at 45 km. Core Stage RS-25 engines continuing ascent."
        : "Automated SRB Separation: Flight computer executed booster jettison. Maintain full throttle [SPACE] to accelerate Core Stage."
    );
  }

  jettisonCoreStage(manual = true) {
    this.stage = 2;
    this.stagingState = null;
    this.hideStagingTimer();

    const btn = document.getElementById("btn-core-sep");
    if (btn) btn.style.display = "none";
    this.hideAlert();

    if (window.Sound) window.Sound.playStageSeparation();

    // Tumbling spent Core Stage tank
    this.srbTumbleDebris.push({
      side: 0, x: 0, y: 35, vx: 0.4, vy: 2.8, rot: 0, rotSpeed: 0.035, alpha: 1.0
    });

    this.updateScienceBox("Core Stage Separation & EUS Ignition: 4 Aerojet Rocketdyne RL10C-3 vacuum engines ignite, delivering 97,000 lbs of thrust to achieve 200 km parking orbit.");
  }

  update(dt) {
    if (!this.active) return;
    this.flightTime += dt;

    // 1. Hold-to-Thrust Determination
    if (this.isThrustKeyDown || this.isPointerThrusting) {
      this.targetThrottle = 1.0;
    } else if (this.isMaxQKeyDown || this.isPointerMaxQ) {
      this.targetThrottle = 0.75;
    } else {
      this.targetThrottle = 0.0;
    }

    const rampRate = this.targetThrottle > this.throttle ? 9.0 : 14.0;
    this.throttle += (this.targetThrottle - this.throttle) * Math.min(1.0, dt * rampRate);
    if (this.throttle < 0.01) this.throttle = 0.0;

    if (window.Sound) window.Sound.setRocketThrottle(this.throttle);

    // Screen rumble on launchpad ignition
    if (this.altitude < 4.0 && this.throttle > 0.3) {
      this.screenRumble = this.throttle * 3.5;
    } else {
      this.screenRumble = Math.max(0, this.screenRumble - dt * 6.0);
    }

    // 2. Timed Staging Window Logic
    if (this.stagingState !== null) {
      this.stagingTimer -= dt;
      this.updateStagingTimerUI();

      if (this.stagingTimer <= 0) {
        if (this.stagingState === 'SRB_WINDOW') {
          this.jettisonSRBs(false);
        } else if (this.stagingState === 'CORE_WINDOW') {
          this.jettisonCoreStage(false);
        }
      }
    }

    // 3. Stage Propulsion & Propellant Depletion (Boosted Optimal SLS Thrust)
    let stageThrust = 0.0;
    if (this.stage === 0) {
      this.srbFuel = Math.max(0, this.srbFuel - dt * this.throttle * 4.6);
      this.coreFuel = Math.max(0, this.coreFuel - dt * this.throttle * 2.2);
      // Twin 5-Segment SRBs + 4 RS-25 deliver authentic 8.8M lbs liftoff thrust
      stageThrust = (this.srbFuel > 0 ? 0.48 : 0.0) * this.throttle;

      if (this.srbFuel <= 0 && this.stagingState !== 'SRB_WINDOW') {
        this.stagingState = 'SRB_WINDOW';
        this.stagingTimer = this.stagingDuration;
        this.showStagingTimer("SOLID ROCKET BOOSTER BURNOUT", "PRESS [S] OR TAP BUTTON TO JETTISON!");
        const btn = document.getElementById("btn-srb-sep");
        if (btn) btn.style.display = "inline-block";
        if (window.Sound) window.Sound.startAlarm();
        setTimeout(() => { if (window.Sound) window.Sound.stopAlarm(); }, 600);
      }
    } else if (this.stage === 1) {
      this.coreFuel = Math.max(0, this.coreFuel - dt * this.throttle * 4.2);
      stageThrust = (this.coreFuel > 0 ? 0.40 : 0.0) * this.throttle;

      if (this.coreFuel <= 0 && this.stagingState !== 'CORE_WINDOW') {
        this.stagingState = 'CORE_WINDOW';
        this.stagingTimer = this.stagingDuration;
        this.showStagingTimer("CORE STAGE MAIN ENGINE CUTOFF (MECO)", "PRESS [C] TO JETTISON CORE & IGNITE EUS!");
        const btn = document.getElementById("btn-core-sep");
        if (btn) btn.style.display = "inline-block";
        if (window.Sound) window.Sound.startAlarm();
        setTimeout(() => { if (window.Sound) window.Sound.stopAlarm(); }, 600);
      }
    } else if (this.stage === 2) {
      this.eusFuel = Math.max(0, this.eusFuel - dt * this.throttle * 2.4);
      stageThrust = (this.eusFuel > 0 ? 0.38 : 0.0) * this.throttle;
    }

    // 4. Authentic Newtonian Gravity & Dynamic Drag Deceleration
    // Realistic gravity pulls rocket down when throttle is released
    const gravity = 0.115 * Math.pow(6371 / (6371 + this.altitude), 2);
    const airDensity = Math.exp(-this.altitude / 9.5);
    const drag = airDensity * Math.pow(Math.max(0, this.velocity), 2) * 0.024;

    const netAccel = stageThrust - gravity - (this.velocity >= 0 ? drag : -drag * 0.5);
    this.velocity += netAccel * dt;
    this.altitude += this.velocity * dt * 0.76;

    // Ground check: if altitude drops to or below 0
    if (this.altitude <= 0.0) {
      this.altitude = 0.0;
      if (this.velocity < -0.12 && this.flightTime > 1.5) {
        this.stop();
        if (window.Sound) window.Sound.playExplosion();
        this.onFail(
          "PAD IMPACT / VEHICLE LOSS: SLS Block 1B crashed into Launch Complex 39B due to insufficient ascent thrust.",
          "Hold [SPACE] down continuously after ignition to deliver continuous rocket propulsion."
        );
        return;
      }
      if (this.velocity < 0) this.velocity = 0;
    }

    // 5. Gravity Turn Pitch Maneuver: Rocket pitches over toward horizontal
    if (this.altitude < 8.0) {
      this.pitchAngle = 0.0; // Straight up off pad
    } else {
      const turnProgress = Math.min(1.0, (this.altitude - 8.0) / 160.0);
      this.pitchAngle = turnProgress * (Math.PI * 0.42); // Tilts to ~75 degrees
    }

    // Transonic Shock Cone (10 km to 14 km)
    this.vaporConeActive = (this.altitude >= 10 && this.altitude <= 14 && this.velocity > 0.85);

    // Max-Q Region Logic (12 km to 20 km)
    if (this.altitude >= 12 && this.altitude <= 20) {
      if (this.throttle > 0.82) {
        this.structuralStress = Math.min(100, this.structuralStress + dt * 28);
        this.showAlert("⚠️ MAX-Q DYNAMIC PRESSURE: REDUCE THROTTLE TO 65-80% [HOLD T]!");
        if (window.Sound) window.Sound.startAlarm();
      } else {
        this.structuralStress = Math.max(0, this.structuralStress - dt * 20);
        this.showAlert("MAX-Q NOMINAL: DYNAMIC PRESSURE WITHIN STRUCTURAL LIMITS");
        if (window.Sound) window.Sound.stopAlarm();
      }

      if (this.structuralStress >= 100) {
        this.stop();
        if (window.Sound) {
          window.Sound.stopAlarm();
          window.Sound.playExplosion();
        }
        this.onFail(
          "MAX-Q STRUCTURAL BREAKUP: Dynamic aerodynamic pressure exceeded SLS Block 1B safety limits. Vehicle broke up in the upper troposphere.",
          "When climbing between 12 km and 20 km altitude, hold [T] or ease off [SPACE] to keep throttle at 65-80% until dynamic pressure subsides."
        );
        return;
      }
    } else {
      if (this.stagingState === null) {
        this.hideAlert();
      }
      this.structuralStress = Math.max(0, this.structuralStress - dt * 15);
      if (window.Sound) window.Sound.stopAlarm();
    }

    // 6. Win Condition: Reach 200 km Parking Orbit
    if (this.altitude >= 200.0) {
      if (this.velocity >= 7.50) {
        this.stop();
        if (window.Sound) window.Sound.playVictory();
        this.onComplete({
          orbitalSpeed: `${this.velocity.toFixed(2)} km/s (Nominal Insertion)`,
          parkingOrbit: `${this.altitude.toFixed(1)} km (Circular LEO)`,
          eusReserve: `${this.eusFuel.toFixed(1)}% Cryogenic Propellant`
        });
      } else {
        this.stop();
        this.onFail(
          `ORBIT INSERTION FAILED: Final orbital velocity (${this.velocity.toFixed(2)} km/s) was below the 7.50 km/s required for stable Low Earth Orbit. Vehicle suborbitally re-entered.`,
          "Hold full throttle [SPACE] throughout the ascent except during Max-Q (12-20 km), and execute stage separations promptly within the green optimal timing window."
        );
      }
      return;
    }

    this.updateHUD();
  }

  updateStagingTimerUI() {
    const secEl = document.getElementById("staging-timer-seconds");
    const fillEl = document.getElementById("staging-timer-fill");
    if (secEl) secEl.innerText = `${Math.max(0, this.stagingTimer).toFixed(1)}s`;
    if (fillEl) {
      const pct = Math.max(0, (this.stagingTimer / this.stagingDuration) * 100);
      fillEl.style.width = `${pct}%`;
    }
  }

  updateHUD() {
    const velEl = document.getElementById("telem-vel");
    const altEl = document.getElementById("telem-alt");
    const thrEl = document.getElementById("telem-throttle");
    const thrBar = document.getElementById("telem-throttle-bar");
    const fuelEl = document.getElementById("telem-fuel");
    const fuelBar = document.getElementById("telem-fuel-bar");
    const propLabel = document.getElementById("telem-prop-label");

    if (velEl) velEl.innerText = `${this.velocity.toFixed(2)} km/s`;
    if (altEl) altEl.innerText = `${this.altitude.toFixed(1)} km`;
    if (thrEl) thrEl.innerText = `${Math.round(this.throttle * 100)}%`;
    if (thrBar) thrBar.style.width = `${this.throttle * 100}%`;

    const propBlock = document.getElementById("telem-propellant-block");
    const esmBlock = document.getElementById("telem-shared-esm-block");
    if (propBlock) propBlock.style.display = "block";
    if (esmBlock) esmBlock.style.display = "none";

    let activeFuel = this.stage === 0 ? this.srbFuel : (this.stage === 1 ? this.coreFuel : this.eusFuel);
    let stageName = this.stage === 0 ? "SRB SOLID PROPELLANT" : (this.stage === 1 ? "CORE STAGE LH2 / LOX" : "EUS CRYOGENIC RESERVES");

    if (fuelEl) fuelEl.innerText = `${activeFuel.toFixed(1)}%`;
    if (fuelBar) fuelBar.style.width = `${activeFuel}%`;
    if (propLabel) propLabel.innerText = stageName;
  }

  showAlert(text) {
    const box = document.getElementById("hud-alerts");
    const msg = document.getElementById("hud-alert-msg");
    if (box && msg) {
      box.style.display = "block";
      msg.innerText = text;
    }
  }

  hideAlert() {
    const box = document.getElementById("hud-alerts");
    if (box) box.style.display = "none";
  }

  updateScienceBox(text) {
    const el = document.getElementById("hud-science-text");
    if (el) el.innerText = text;
  }

  // --- RENDERING ENGINE ---
  render() {
    const W = this.canvas.width;
    const H = this.canvas.height;
    const ctx = this.ctx;

    ctx.save();

    if (this.screenRumble > 0) {
      const rx = (Math.random() - 0.5) * this.screenRumble;
      const ry = (Math.random() - 0.5) * this.screenRumble;
      ctx.translate(rx, ry);
    }

    // 1. Atmosphere Sky Gradient
    this.renderAtmosphericSky(W, H);

    // 2. Continuous Ground & Earth Scenery (Seamless 0 to 200 km)
    this.renderContinuousEarth(W, H);

    // 3. Tumbling Separated Boosters
    this.renderSeparatedDebris(W, H);

    // 4. SLS Block 1B Active Vehicle (with Gravity Turn Pitch)
    this.renderSLSRocket(W, H);

    // 5. Rocket Engine Plumes ONLY
    this.renderRocketPlumes(W, H);

    ctx.restore();
  }

  renderAtmosphericSky(W, H) {
    const ctx = this.ctx;
    const altRatio = Math.min(1.0, this.altitude / 160.0);
    const skyGrad = ctx.createLinearGradient(0, 0, 0, H);

    if (altRatio < 0.15) {
      skyGrad.addColorStop(0.0, '#0c4a6e');
      skyGrad.addColorStop(0.4, '#0284c7');
      skyGrad.addColorStop(0.85, '#38bdf8');
      skyGrad.addColorStop(1.0, '#7dd3fc');
    } else if (altRatio < 0.55) {
      skyGrad.addColorStop(0.0, '#020617');
      skyGrad.addColorStop(0.35, '#0a192f');
      skyGrad.addColorStop(0.75, '#0c2d5e');
      skyGrad.addColorStop(1.0, '#0369a1');
    } else {
      skyGrad.addColorStop(0.0, '#010409');
      skyGrad.addColorStop(0.7, '#020617');
      skyGrad.addColorStop(1.0, '#040d21');
    }

    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, W, H);

    // Deep Space Twinkling Stars (above 30 km)
    if (this.altitude > 25.0) {
      const starAlpha = Math.min(1.0, (this.altitude - 25.0) / 40.0);
      ctx.fillStyle = `rgba(255, 255, 255, ${starAlpha * 0.85})`;
      for (let i = 0; i < 70; i++) {
        const sx = (i * 97) % W;
        const sy = (i * 53) % (H * 0.7);
        const sz = (i % 5 === 0) ? 2.0 : 1.2;
        ctx.fillRect(sx, sy, sz, sz);
      }
    }
  }

  renderContinuousEarth(W, H) {
    const ctx = this.ctx;

    // Below 40 km: Detailed Pad 39B & Cape Canaveral Horizon receding downward
    if (this.altitude < 40.0) {
      const groundY = H * 0.58 + (this.altitude * 45);

      if (groundY < H + 120) {
        // Atlantic Ocean Horizon
        const oceanGrad = ctx.createLinearGradient(0, groundY + 50, 0, H);
        oceanGrad.addColorStop(0, '#0369a1');
        oceanGrad.addColorStop(1, '#075985');
        ctx.fillStyle = oceanGrad;
        ctx.fillRect(0, groundY + 50, W, H - (groundY + 50));

        // Florida Barrier Island & Beach Dunes
        ctx.fillStyle = '#fef08a';
        ctx.fillRect(0, groundY + 45, W, 8);

        // Cape Canaveral Scrub / Green Marshland
        ctx.fillStyle = '#14532d';
        ctx.fillRect(0, groundY + 53, W, 25);

        // Launch Complex Pad 39B Concrete Mount
        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.moveTo(W * 0.5 - 180, groundY + 95);
        ctx.lineTo(W * 0.5 - 120, groundY + 45);
        ctx.lineTo(W * 0.5 + 120, groundY + 45);
        ctx.lineTo(W * 0.5 + 180, groundY + 95);
        ctx.closePath();
        ctx.fill();

        // Mobile Launcher Tower (ML-1) Truss
        const mlX = W * 0.5 + 46;
        ctx.strokeStyle = '#991b1b';
        ctx.lineWidth = 3;
        ctx.strokeRect(mlX, groundY - 140, 36, 185);

        ctx.lineWidth = 1.5;
        ctx.beginPath();
        for (let ty = groundY - 140; ty < groundY + 45; ty += 22) {
          ctx.moveTo(mlX, ty);
          ctx.lineTo(mlX + 36, ty + 22);
          ctx.moveTo(mlX + 36, ty);
          ctx.lineTo(mlX, ty + 22);
        }
        ctx.stroke();

        // Umbilical Crane Arm
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(mlX, groundY - 100);
        ctx.lineTo(W * 0.5 + 18, groundY - 95);
        ctx.moveTo(mlX, groundY - 60);
        ctx.lineTo(W * 0.5 + 18, groundY - 55);
        ctx.stroke();
      }
    }

    // Above 25 km: The Curved Earth Limb smoothly expands from the bottom!
    if (this.altitude > 25.0) {
      const earthAlpha = Math.min(1.0, (this.altitude - 25.0) / 30.0);
      const earthProgress = Math.min(1.0, (this.altitude - 25.0) / 175.0);
      const earthRadius = 900;
      const horizonCenterY = H + earthRadius - 80 - (earthProgress * 180);

      ctx.save();
      ctx.globalAlpha = earthAlpha;

      // Cyan Rayleigh Atmospheric Scattering Glow
      const atmoGrad = ctx.createRadialGradient(W * 0.5, horizonCenterY, earthRadius - 30, W * 0.5, horizonCenterY, earthRadius + 50);
      atmoGrad.addColorStop(0.0, 'rgba(0, 229, 255, 0.95)');
      atmoGrad.addColorStop(0.3, 'rgba(56, 189, 248, 0.65)');
      atmoGrad.addColorStop(0.7, 'rgba(3, 105, 161, 0.25)');
      atmoGrad.addColorStop(1.0, 'transparent');
      ctx.fillStyle = atmoGrad;
      ctx.beginPath();
      ctx.arc(W * 0.5, horizonCenterY, earthRadius + 50, 0, Math.PI * 2);
      ctx.fill();

      // Deep Blue Marble Ocean
      const oceanGrad = ctx.createRadialGradient(W * 0.5, horizonCenterY - 100, 50, W * 0.5, horizonCenterY, earthRadius);
      oceanGrad.addColorStop(0.0, '#1d4ed8');
      oceanGrad.addColorStop(0.65, '#1e40af');
      oceanGrad.addColorStop(1.0, '#0f172a');
      ctx.fillStyle = oceanGrad;
      ctx.beginPath();
      ctx.arc(W * 0.5, horizonCenterY, earthRadius, 0, Math.PI * 2);
      ctx.fill();

      // Continents (Florida Peninsula, Caribbean, Gulf of Mexico)
      const cx = W * 0.5;
      const cy = horizonCenterY - earthRadius;

      // North American Continent Landmass
      ctx.fillStyle = '#15803d';
      ctx.beginPath();
      ctx.moveTo(cx - 240, cy + 90);
      ctx.bezierCurveTo(cx - 160, cy + 30, cx - 40, cy + 20, cx + 60, cy + 60);
      ctx.bezierCurveTo(cx + 90, cy + 100, cx + 80, cy + 140, cx + 40, cy + 160);
      ctx.bezierCurveTo(cx - 20, cy + 170, cx - 120, cy + 140, cx - 180, cy + 150);
      ctx.closePath();
      ctx.fill();

      // Florida Peninsula Spit
      ctx.beginPath();
      ctx.moveTo(cx - 10, cy + 55);
      ctx.lineTo(cx + 12, cy + 105);
      ctx.lineTo(cx + 2, cy + 115);
      ctx.lineTo(cx - 18, cy + 70);
      ctx.closePath();
      ctx.fill();

      // Caribbean Island Arc (Cuba, Bahamas)
      ctx.fillStyle = '#22c55e';
      ctx.beginPath();
      ctx.ellipse(cx + 25, cy + 125, 28, 6, 0.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(cx + 70, cy + 145, 20, 5, 0.2, 0, Math.PI * 2);
      ctx.fill();

      // Swirling White Storm Clouds
      ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
      ctx.beginPath();
      ctx.arc(cx - 90, cy + 70, 35, 0, Math.PI * 2);
      ctx.arc(cx - 65, cy + 65, 45, 0, Math.PI * 2);
      ctx.arc(cx + 85, cy + 90, 40, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }
  }

  renderSeparatedDebris(W, H) {
    const ctx = this.ctx;
    for (let i = this.srbTumbleDebris.length - 1; i >= 0; i--) {
      const d = this.srbTumbleDebris[i];
      d.x += d.vx;
      d.y += d.vy;
      d.rot += d.rotSpeed;
      d.alpha = Math.max(0, d.alpha - 0.007);

      ctx.save();
      ctx.translate(W * 0.5 + d.x, H * 0.58 + d.y);
      ctx.rotate(d.rot);
      ctx.globalAlpha = d.alpha;

      if (d.side !== 0) {
        // Booster white casing
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(-5, -35, 10, 70);
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(-5, 25, 10, 10);
      } else {
        // Orange core stage tank
        ctx.fillStyle = '#ea580c';
        ctx.fillRect(-14, -40, 28, 80);
      }
      ctx.restore();

      if (d.alpha <= 0) {
        this.srbTumbleDebris.splice(i, 1);
      }
    }
  }

  renderSLSRocket(W, H) {
    const ctx = this.ctx;
    const cx = W * 0.5;
    const cy = H * 0.58;

    ctx.save();
    ctx.translate(cx, cy);
    // Apply gravity turn pitch angle!
    ctx.rotate(this.pitchAngle);

    // Transonic Condensation Shock Cone
    if (this.vaporConeActive) {
      const coneGrad = ctx.createLinearGradient(0, -80, 0, 40);
      coneGrad.addColorStop(0, 'rgba(255, 255, 255, 0.0)');
      coneGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.65)');
      coneGrad.addColorStop(1, 'rgba(255, 255, 255, 0.0)');
      ctx.fillStyle = coneGrad;
      ctx.beginPath();
      ctx.moveTo(-45, 20);
      ctx.lineTo(0, -70);
      ctx.lineTo(45, 20);
      ctx.closePath();
      ctx.fill();
    }

    if (this.stage === 0) {
      // --- STAGE 0: SLS BLOCK 1B FULL STACK ---
      // 1. Orange Foam Core Stage (4 RS-25s)
      const coreGrad = ctx.createLinearGradient(-15, 0, 15, 0);
      coreGrad.addColorStop(0, '#9a3412');
      coreGrad.addColorStop(0.35, '#ea580c');
      coreGrad.addColorStop(0.7, '#f97316');
      coreGrad.addColorStop(1, '#7c2d12');
      ctx.fillStyle = coreGrad;
      ctx.fillRect(-15, -45, 30, 100);

      // Core Stage Intertank & System Tunnels
      ctx.fillStyle = '#431407';
      ctx.fillRect(-15, -15, 30, 12);
      ctx.fillRect(-16, -45, 3, 100);
      ctx.fillRect(13, -45, 3, 100);

      // 2. Exploration Upper Stage (EUS) Cryogenic LH2 Tank
      const eusGrad = ctx.createLinearGradient(-15, 0, 15, 0);
      eusGrad.addColorStop(0, '#cbd5e1');
      eusGrad.addColorStop(0.4, '#f8fafc');
      eusGrad.addColorStop(1, '#94a3b8');
      ctx.fillStyle = eusGrad;
      ctx.fillRect(-15, -82, 30, 37);

      // 3. Orion Spacecraft & Launch Abort System (LAS)
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.moveTo(-15, -82);
      ctx.lineTo(0, -115);
      ctx.lineTo(15, -82);
      ctx.closePath();
      ctx.fill();

      // LAS Needle
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(0, -115);
      ctx.lineTo(0, -145);
      ctx.stroke();

      // 4. Twin 5-Segment Solid Rocket Boosters (SRBs)
      [-1, 1].forEach(side => {
        const bx = side * 24;
        const srbGrad = ctx.createLinearGradient(bx - 7, 0, bx + 7, 0);
        srbGrad.addColorStop(0, '#94a3b8');
        srbGrad.addColorStop(0.4, '#f8fafc');
        srbGrad.addColorStop(1, '#64748b');
        ctx.fillStyle = srbGrad;
        ctx.fillRect(bx - 7, -35, 14, 90);

        // Conical Nosecone
        ctx.beginPath();
        ctx.moveTo(bx - 7, -35);
        ctx.lineTo(bx, -54);
        ctx.lineTo(bx + 7, -35);
        ctx.closePath();
        ctx.fill();

        // 5-Segment Joint Rings
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 1.2;
        for (let seg = -18; seg <= 40; seg += 15) {
          ctx.beginPath();
          ctx.moveTo(bx - 7, seg);
          ctx.lineTo(bx + 7, seg);
          ctx.stroke();
        }

        // Exhaust Nozzle
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(bx - 5, 55, 10, 8);
      });
    } else if (this.stage === 1) {
      // --- STAGE 1: CORE STAGE ALONE ---
      const coreGrad = ctx.createLinearGradient(-15, 0, 15, 0);
      coreGrad.addColorStop(0, '#9a3412');
      coreGrad.addColorStop(0.4, '#ea580c');
      coreGrad.addColorStop(1, '#7c2d12');
      ctx.fillStyle = coreGrad;
      ctx.fillRect(-15, -45, 30, 100);

      const eusGrad = ctx.createLinearGradient(-15, 0, 15, 0);
      eusGrad.addColorStop(0, '#cbd5e1');
      eusGrad.addColorStop(0.4, '#f8fafc');
      eusGrad.addColorStop(1, '#94a3b8');
      ctx.fillStyle = eusGrad;
      ctx.fillRect(-15, -82, 30, 37);

      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.moveTo(-15, -82);
      ctx.lineTo(0, -115);
      ctx.lineTo(15, -82);
      ctx.closePath();
      ctx.fill();

      // RS-25 Core Engines
      ctx.fillStyle = '#1e293b';
      for (let e = -9; e <= 9; e += 6) {
        ctx.fillRect(e - 2, 55, 4, 8);
      }
    } else if (this.stage === 2) {
      // --- STAGE 2: EXPLORATION UPPER STAGE (EUS) + ORION ---
      const eusGrad = ctx.createLinearGradient(-14, 0, 14, 0);
      eusGrad.addColorStop(0, '#cbd5e1');
      eusGrad.addColorStop(0.4, '#f8fafc');
      eusGrad.addColorStop(1, '#94a3b8');
      ctx.fillStyle = eusGrad;
      ctx.fillRect(-14, -20, 28, 48);

      // European Service Module (ESM)
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(-12, -36, 24, 16);

      // Conical Orion Crew Module
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.moveTo(-14, -36);
      ctx.lineTo(0, -60);
      ctx.lineTo(14, -36);
      ctx.closePath();
      ctx.fill();

      // 4x RL10C-3 Engine Bells
      ctx.fillStyle = '#334155';
      ctx.fillRect(-10, 28, 5, 8);
      ctx.fillRect(-3, 28, 6, 8);
      ctx.fillRect(5, 28, 5, 8);
    }

    ctx.restore();
  }

  renderRocketPlumes(W, H) {
    if (this.throttle <= 0.05) return;
    const ctx = this.ctx;
    const cx = W * 0.5;
    const cy = H * 0.58;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(this.pitchAngle);

    const len = 45 + this.throttle * 90;
    const wid = 8 + this.throttle * 14;

    if (this.stage === 0) {
      // Twin SRBs: Violent Hypergolic Orange Plumes
      [-24, 24].forEach(bx => {
        const pGrad = ctx.createLinearGradient(bx, 60, bx, 60 + len * 1.15);
        pGrad.addColorStop(0, '#ffffff');
        pGrad.addColorStop(0.15, '#fde047');
        pGrad.addColorStop(0.45, '#f97316');
        pGrad.addColorStop(0.85, '#dc2626');
        pGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = pGrad;
        ctx.beginPath();
        ctx.moveTo(bx - wid * 0.8, 60);
        ctx.quadraticCurveTo(bx - wid * 1.3, 60 + len * 0.6, bx, 60 + len * 1.15);
        ctx.quadraticCurveTo(bx + wid * 1.3, 60 + len * 0.6, bx + wid * 0.8, 60);
        ctx.fill();
      });

      // 4x RS-25 Core Engines: Electric Blue/Cyan Mach Diamonds
      const corePlume = ctx.createLinearGradient(0, 55, 0, 55 + len * 0.85);
      corePlume.addColorStop(0, '#ffffff');
      corePlume.addColorStop(0.2, '#38bdf8');
      corePlume.addColorStop(0.6, '#0284c7');
      corePlume.addColorStop(1, 'transparent');
      ctx.fillStyle = corePlume;
      ctx.beginPath();
      ctx.moveTo(-12, 55);
      ctx.lineTo(0, 55 + len * 0.85);
      ctx.lineTo(12, 55);
      ctx.fill();
    } else if (this.stage === 1) {
      // RS-25 Core Engines alone
      const corePlume = ctx.createLinearGradient(0, 55, 0, 55 + len * 0.9);
      corePlume.addColorStop(0, '#ffffff');
      corePlume.addColorStop(0.25, '#38bdf8');
      corePlume.addColorStop(0.65, '#0284c7');
      corePlume.addColorStop(1, 'transparent');
      ctx.fillStyle = corePlume;
      ctx.beginPath();
      ctx.moveTo(-14, 55);
      ctx.lineTo(0, 55 + len * 0.9);
      ctx.lineTo(14, 55);
      ctx.fill();
    } else if (this.stage === 2) {
      // RL10C-3 Upper Stage Vacuum Plume (Expanded Violet/Cyan Glow)
      const eusPlume = ctx.createLinearGradient(0, 35, 0, 35 + len * 0.75);
      eusPlume.addColorStop(0, '#ffffff');
      eusPlume.addColorStop(0.3, '#818cf8');
      eusPlume.addColorStop(0.7, '#38bdf8');
      eusPlume.addColorStop(1, 'transparent');
      ctx.fillStyle = eusPlume;
      ctx.beginPath();
      ctx.moveTo(-12, 35);
      ctx.lineTo(0, 35 + len * 0.75);
      ctx.lineTo(12, 35);
      ctx.fill();
    }

    ctx.restore();
  }
}

// ==========================================
// 7. LEVEL 2: TRANS-LUNAR INJECTION (ELITE 3D ASTRODYNAMICS V2)
// Realistic Earth with 3D Cloud Parallax, 3D Lunar Gateway Station,
// 4 Previewable Camera Views (Tactical, Craft Chase, Target Focus, Free Orbit),
// Dynamic 10x Time Warp, Verified Lunar Collision vs NRHO Capture
// ==========================================
class Level2Slingshot {
  constructor(canvasController, onComplete, onFail) {
    this.cc = canvasController;
    this.onComplete = onComplete;
    this.onFail = onFail;
    this.active = false;

    // Orbital Aiming Parameters (Optimal: 240 deg angle, 1.80 km/s power)
    this.ejectAngle = 240.0;
    this.burnPower = 1.80;
    this.state = 'AIMING';   // 'AIMING', 'FLYING', 'ORBITING_MOON', 'SUCCESS', 'FAILED'
    this.flightTime = 0.0;
    this.orbitTimer = 6.0;   // 6 seconds of verified lunar orbit before debrief
    this.orbitRadius = 34.0;
    this.orbitAngle = 0.0;
    this.closestMoonDist = 999999;

    // Coordinate Systems
    this.craftPos = { x: 0, y: 0, z: 0 };
    this.craftVel = { vx: 0, vz: 0 };
    this.moonPos = { x: 750, y: 0, z: -180 };
    this.trajectoryPoints = [];

    // Three.js Scene References
    this.scene = null;
    this.camera = null;
    this.earthMesh = null;
    this.cloudMesh = null;
    this.moonMesh = null;
    this.gatewayGroup = null;
    this.gatewayRing = null;
    this.gatewayBeacon = null;
    this.craftMesh = null;
    this.trajLine = null;
    this.lineMat = null;
    this.thrustPlumeMesh = null;

    // Camera Modes: 0: Tactical Wide, 1: Craft Chase, 2: Target Focus (Gateway/Moon), 3: Free Orbit
    this.camMode = 0;
    this.camNames = [
      "🎥 CAM: [1] TACTICAL WIDE",
      "🎥 CAM: [2] CRAFT CHASE",
      "🎥 CAM: [3] TARGET FOCUS",
      "🎥 CAM: [4] FREE ORBIT"
    ];

    this.bindEvents();
  }

  bindEvents() {
    const angleSlider = document.getElementById("slider-eject-angle");
    const powerSlider = document.getElementById("slider-burn-power");
    const angleLabel = document.getElementById("label-eject-angle");
    const powerLabel = document.getElementById("label-burn-power");
    const burnBtn = document.getElementById("btn-fire-burn");
    const camBtn = document.getElementById("btn-toggle-cam");

    if (angleSlider) {
      angleSlider.addEventListener("input", (e) => {
        if (GameState.currentScreen !== 'LEVEL_2') return;
        this.ejectAngle = parseFloat(e.target.value);
        if (angleLabel) angleLabel.innerText = `${this.ejectAngle.toFixed(0)}°`;
        this.calculateTrajectory();
      });
    }

    if (powerSlider) {
      powerSlider.addEventListener("input", (e) => {
        if (GameState.currentScreen !== 'LEVEL_2') return;
        this.burnPower = parseFloat(e.target.value);
        if (powerLabel) powerLabel.innerText = `${this.burnPower.toFixed(2)} km/s`;
        this.calculateTrajectory();
      });
    }

    if (burnBtn) {
      burnBtn.addEventListener("click", () => {
        if (GameState.currentScreen === 'LEVEL_2' && this.state === 'AIMING') {
          this.executeBurn();
        }
      });
    }

    if (camBtn) {
      camBtn.addEventListener("click", () => {
        if (GameState.currentScreen !== 'LEVEL_2') return;
        this.cycleCamera();
      });
    }

    window.addEventListener("keydown", (e) => {
      if (!this.active || GameState.currentScreen !== 'LEVEL_2') return;
      if (this.state === 'AIMING' && (e.code === 'Space' || e.code === 'Enter')) {
        this.executeBurn();
      }
      if (this.state === 'FLYING' && ['KeyW', 'KeyS', 'KeyA', 'KeyD'].includes(e.code)) {
        this.applyMidCourseCorrection(e.code);
      }
      if (e.code === 'Digit1') this.setCameraMode(0);
      if (e.code === 'Digit2') this.setCameraMode(1);
      if (e.code === 'Digit3') this.setCameraMode(2);
      if (e.code === 'Digit4') this.setCameraMode(3);
      if (e.code === 'KeyC') this.cycleCamera();
    });
  }

  setCameraMode(mode) {
    this.camMode = mode;
    const camBtn = document.getElementById("btn-toggle-cam");
    if (camBtn) camBtn.innerText = this.camNames[this.camMode];
  }

  cycleCamera() {
    this.camMode = (this.camMode + 1) % 4;
    const camBtn = document.getElementById("btn-toggle-cam");
    if (camBtn) camBtn.innerText = this.camNames[this.camMode];
  }

  start() {
    this.active = true;
    this.state = 'AIMING';
    this.flightTime = 0.0;
    this.orbitTimer = 6.0;
    this.closestMoonDist = 999999;
    this.camMode = 0;

    if (GameState.esmFuelReserve <= 0 || isNaN(GameState.esmFuelReserve)) {
      GameState.esmFuelReserve = 100.0;
    }

    // Default optimal parameters
    this.ejectAngle = 240.0;
    this.burnPower = 1.80;

    const angleSlider = document.getElementById("slider-eject-angle");
    const powerSlider = document.getElementById("slider-burn-power");
    const angleLabel = document.getElementById("label-eject-angle");
    const powerLabel = document.getElementById("label-burn-power");
    if (angleSlider) {
      angleSlider.min = "0";
      angleSlider.max = "360";
      angleSlider.step = "1";
      angleSlider.value = this.ejectAngle;
    }
    if (powerSlider) {
      powerSlider.min = "1.0";
      powerSlider.max = "3.0";
      powerSlider.step = "0.05";
      powerSlider.value = this.burnPower;
    }
    if (angleLabel) angleLabel.innerText = `${this.ejectAngle.toFixed(0)}°`;
    if (powerLabel) powerLabel.innerText = `${this.burnPower.toFixed(2)} km/s`;

    const burnBtn = document.getElementById("btn-fire-burn");
    if (burnBtn) {
      burnBtn.disabled = false;
      burnBtn.innerText = "EXECUTE TLI BURN [SPACE]";
    }

    const camBtn = document.getElementById("btn-toggle-cam");
    if (camBtn) camBtn.innerText = this.camNames[this.camMode];

    this.init3DScene();
    this.calculateTrajectory();
    this.showUI();
    this.renderLoop();

    this.updateScienceBox("Trans-Lunar Injection (TLI): Orion and European I-Hab module depart 200 km Earth orbit. Align ejection burn to slingshot into the Moon's gravity well. Preview camera views with [1-4] or CAM button before launch.");
  }

  stop() {
    this.active = false;
    this.hideCoastingTimer();
    this.hideUI();
    this.cc.clear3dScene();
  }

  showUI() {
    const dock = document.getElementById("orbital-dock");
    if (dock) dock.style.display = "block";
    const dockLbl = document.getElementById("orbital-dock-label");
    if (dockLbl) dockLbl.innerText = "PHASE 2: CISLUNAR ASTRODYNAMICS & GATEWAY DOCKING";

    const esmBlock = document.getElementById("telem-shared-esm-block");
    if (esmBlock) esmBlock.style.display = "block";
    const propBlock = document.getElementById("telem-propellant-block");
    if (propBlock) propBlock.style.display = "none";

    const actionBox = document.getElementById("hud-action-bar");
    if (actionBox) {
      actionBox.innerHTML = `
        <button id="btn-rcs-up" class="hud-btn">▲ RCS PROGRADE [W]</button>
        <button id="btn-rcs-down" class="hud-btn">▼ RCS RETRO [S]</button>
        <button id="btn-rcs-left" class="hud-btn">◀ RCS NORMAL [A]</button>
        <button id="btn-rcs-right" class="hud-btn">▶ RCS ANTI-NORMAL [D]</button>
      `;

      const bW = document.getElementById("btn-rcs-up");
      const bS = document.getElementById("btn-rcs-down");
      const bA = document.getElementById("btn-rcs-left");
      const bD = document.getElementById("btn-rcs-right");
      if (bW) bW.addEventListener("click", () => this.applyMidCourseCorrection('KeyW'));
      if (bS) bS.addEventListener("click", () => this.applyMidCourseCorrection('KeyS'));
      if (bA) bA.addEventListener("click", () => this.applyMidCourseCorrection('KeyA'));
      if (bD) bD.addEventListener("click", () => this.applyMidCourseCorrection('KeyD'));
    }

    this.updateHUD();
  }

  hideUI() {
    const dock = document.getElementById("orbital-dock");
    if (dock) dock.style.display = "none";
    const actionBox = document.getElementById("hud-action-bar");
    if (actionBox) actionBox.innerHTML = "";
  }

  showCoastingTimer(text) {
    const box = document.getElementById("hud-coasting-timer");
    const secEl = document.getElementById("coasting-timer-seconds");
    if (box) box.style.display = "block";
    if (secEl) secEl.innerText = `${text} (${Math.max(0, this.orbitTimer).toFixed(1)}s)`;
  }

  hideCoastingTimer() {
    const box = document.getElementById("hud-coasting-timer");
    if (box) box.style.display = "none";
  }

  init3DScene() {
    const { scene, camera } = this.cc.init3dScene();
    this.scene = scene;
    this.camera = camera;

    this.camera.position.set(380, 520, 480);
    this.camera.lookAt(375, 0, -90);

    // Deep Space Multi-Colored Starfield
    const starGeo = new THREE.BufferGeometry();
    const starCount = 4200;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starPositions[i] = (Math.random() - 0.5) * 4200;
      starPositions[i + 1] = (Math.random() - 0.5) * 2600;
      starPositions[i + 2] = (Math.random() - 0.5) * 4200;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 2.2, transparent: true, opacity: 0.88 });
    scene.add(new THREE.Points(starGeo, starMat));

    // Sun Key Lighting + Ambient Space Illumination
    const sunLight = new THREE.DirectionalLight(0xffffff, 1.6);
    sunLight.position.set(-600, 350, 800);
    scene.add(sunLight);
    scene.add(new THREE.AmbientLight(0x223355, 0.48));

    // 1. Photorealistic Blue Marble Earth (Radius: 65)
    const earthGeo = new THREE.SphereGeometry(65, 64, 64);
    const earthTexture = (typeof ProceduralSpaceAssets !== 'undefined') ? ProceduralSpaceAssets.getEarthTexture() : null;
    const earthMat = new THREE.MeshStandardMaterial({
      map: earthTexture,
      roughness: 0.55,
      metalness: 0.1
    });
    this.earthMesh = new THREE.Mesh(earthGeo, earthMat);
    scene.add(this.earthMesh);

    // Earth 3D Parallax Cloud Layer (Radius: 65.8)
    const cloudGeo = new THREE.SphereGeometry(65.8, 64, 64);
    const cloudTexture = (typeof ProceduralSpaceAssets !== 'undefined') ? ProceduralSpaceAssets.getCloudTexture() : null;
    const cloudMat = new THREE.MeshStandardMaterial({
      map: cloudTexture,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending
    });
    this.cloudMesh = new THREE.Mesh(cloudGeo, cloudMat);
    scene.add(this.cloudMesh);

    // Earth Atmospheric Cyan Haze Halo (Radius: 69.2)
    const atmosGeo = new THREE.SphereGeometry(69.2, 48, 48);
    const atmosMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.28,
      side: THREE.BackSide
    });
    scene.add(new THREE.Mesh(atmosGeo, atmosMat));

    // 2. Photorealistic Moon with Maria and Craters (Radius: 18)
    const moonGeo = new THREE.SphereGeometry(18, 48, 48);
    const moonTexture = (typeof ProceduralSpaceAssets !== 'undefined') ? ProceduralSpaceAssets.getMoonTexture() : null;
    const moonMat = new THREE.MeshStandardMaterial({
      map: moonTexture,
      roughness: 0.88,
      metalness: 0.05
    });
    this.moonMesh = new THREE.Mesh(moonGeo, moonMat);
    this.moonPos = { x: 750, y: 0, z: -180 };
    this.moonMesh.position.set(this.moonPos.x, this.moonPos.y, this.moonPos.z);
    scene.add(this.moonMesh);

    // 3. 3D Lunar Gateway Space Station
    this.gatewayGroup = new THREE.Group();
    // Power & Propulsion Element (PPE)
    const ppeCyl = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.4, 4.5, 16), new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.6 }));
    this.gatewayGroup.add(ppeCyl);

    // International Habitation Module (I-Hab) wrapped in Golden MLI Foil
    const habCyl = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 1.8, 5.0, 16), new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.85, roughness: 0.25 }));
    habCyl.position.y = 4.2;
    this.gatewayGroup.add(habCyl);

    // European ESPRIT Refueling Module & Comms Dish
    const espritCyl = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 3.2, 16), new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.4 }));
    espritCyl.position.y = 8.0;
    this.gatewayGroup.add(espritCyl);

    const dishMesh = new THREE.Mesh(new THREE.ConeGeometry(2.0, 0.8, 16, 1, true), new THREE.MeshStandardMaterial({ color: 0xf8fafc, side: THREE.DoubleSide }));
    dishMesh.position.set(0, 10.2, 0);
    this.gatewayGroup.add(dishMesh);

    // Blinking Gateway Docking Beacon
    const beaconGeo = new THREE.SphereGeometry(0.8, 12, 12);
    const beaconMat = new THREE.MeshBasicMaterial({ color: 0x00e5ff });
    this.gatewayBeacon = new THREE.Mesh(beaconGeo, beaconMat);
    this.gatewayBeacon.position.set(0, 5.2, 2.2);
    this.gatewayGroup.add(this.gatewayBeacon);

    // Giant Blue Solar Wings
    for (let sw = -1; sw <= 1; sw += 2) {
      const wing = new THREE.Mesh(new THREE.BoxGeometry(8.0, 0.1, 2.0), new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.2 }));
      wing.position.set(sw * 5.0, 1.8, 0);
      this.gatewayGroup.add(wing);
    }
    this.gatewayGroup.position.set(this.moonPos.x + 34, 0, this.moonPos.z);
    scene.add(this.gatewayGroup);

    // Gateway NRHO Halo Orbit Ring Indicator (Radius 34)
    const ringGeo = new THREE.RingGeometry(33, 35, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x00e5ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.75
    });
    this.gatewayRing = new THREE.Mesh(ringGeo, ringMat);
    this.gatewayRing.rotation.x = Math.PI / 3;
    this.gatewayRing.position.copy(this.moonMesh.position);
    scene.add(this.gatewayRing);

    // 4. 3D Orion + EUS Spacecraft Model
    const craftGroup = new THREE.Group();
    // Exploration Upper Stage (EUS) Cryogenic LH2/LOX Tank
    const eusBody = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 2.4, 8.5, 16), new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.35 }));
    eusBody.rotation.z = Math.PI / 2;
    craftGroup.add(eusBody);

    // RL10C-3 Engine Cluster
    const engCone = new THREE.Mesh(new THREE.ConeGeometry(1.8, 3.2, 16), new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8 }));
    engCone.position.x = -5.2;
    engCone.rotation.z = Math.PI / 2;
    craftGroup.add(engCone);

    // European I-Hab Module Payload
    const ihabCyl = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 2.2, 6.0, 16), new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.8, roughness: 0.3 }));
    ihabCyl.position.x = 7.0;
    ihabCyl.rotation.z = Math.PI / 2;
    craftGroup.add(ihabCyl);

    // Orion Crew Capsule
    const orionCone = new THREE.Mesh(new THREE.ConeGeometry(2.2, 3.2, 16), new THREE.MeshStandardMaterial({ color: 0xf1f5f9, metalness: 0.4, roughness: 0.2 }));
    orionCone.position.x = 11.2;
    orionCone.rotation.z = -Math.PI / 2;
    craftGroup.add(orionCone);

    // Orion ESM X-Wing Solar Panels
    for (let sa = 0; sa < 4; sa++) {
      const saMesh = new THREE.Mesh(new THREE.BoxGeometry(0.15, 6.0, 1.2), new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.2 }));
      saMesh.position.x = 9.8;
      saMesh.rotation.x = (sa * Math.PI) / 2 + Math.PI / 4;
      craftGroup.add(saMesh);
    }

    // Active Engine Thrust Plume
    const plumeGeo = new THREE.ConeGeometry(2.2, 7.5, 16);
    const plumeMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.85 });
    this.thrustPlumeMesh = new THREE.Mesh(plumeGeo, plumeMat);
    this.thrustPlumeMesh.position.x = -9.5;
    this.thrustPlumeMesh.rotation.z = Math.PI / 2;
    this.thrustPlumeMesh.visible = false;
    craftGroup.add(this.thrustPlumeMesh);

    this.craftMesh = craftGroup;
    scene.add(this.craftMesh);

    // Trajectory Line
    const maxPoints = 8000;
    const lineGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(maxPoints * 3);
    lineGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.lineMat = new THREE.LineDashedMaterial({
      color: 0x10b981,
      dashSize: 4.5,
      gapSize: 2.2,
      linewidth: 2.5
    });
    this.trajLine = new THREE.Line(lineGeo, this.lineMat);
    scene.add(this.trajLine);
  }

  calculateTrajectory() {
    const rad = (this.ejectAngle * Math.PI) / 180;
    const parkRadius = 98.0;

    let posX = Math.cos(rad) * parkRadius;
    let posZ = Math.sin(rad) * parkRadius;

    const vMag = 2.1 + (this.burnPower * 0.70);
    let vx = -Math.sin(rad) * vMag;
    let vz = Math.cos(rad) * vMag;

    this.trajectoryPoints = [];
    const dt = 0.16;
    const steps = 6000;

    let minMoonDist = 999999;
    let minEarthDist = 999999;
    const GM_Earth = 320.0;
    const GM_Moon = 160.0;

    for (let i = 0; i < steps; i++) {
      if (this.trajectoryPoints.length < 7900) {
        this.trajectoryPoints.push({ x: posX, y: 0, z: posZ });
      }

      const rE2 = posX * posX + posZ * posZ;
      const rE = Math.sqrt(rE2);
      if (rE < minEarthDist) minEarthDist = rE;

      const fE = -GM_Earth / (rE2 + 50);
      let ax = (posX / rE) * fE;
      let az = (posZ / rE) * fE;

      const dxM = posX - this.moonPos.x;
      const dzM = posZ - this.moonPos.z;
      const rM2 = dxM * dxM + dzM * dzM;
      const rM = Math.sqrt(rM2);
      if (rM < minMoonDist) minMoonDist = rM;

      const fM = -GM_Moon / (rM2 + 25);
      ax += (dxM / rM) * fM;
      az += (dzM / rM) * fM;

      vx += ax * dt;
      vz += az * dt;
      posX += vx * dt;
      posZ += vz * dt;
    }

    const positions = this.trajLine.geometry.attributes.position.array;
    for (let i = 0; i < this.trajectoryPoints.length; i++) {
      positions[i * 3] = this.trajectoryPoints[i].x;
      positions[i * 3 + 1] = this.trajectoryPoints[i].y;
      positions[i * 3 + 2] = this.trajectoryPoints[i].z;
    }
    this.trajLine.geometry.setDrawRange(0, this.trajectoryPoints.length);
    this.trajLine.geometry.attributes.position.needsUpdate = true;
    this.trajLine.computeLineDistances();

    const badge = document.getElementById("orbital-forecast-badge");

    if (minMoonDist <= 18.0 || minEarthDist <= 72.0) {
      if (this.lineMat) this.lineMat.color.setHex(0xef4444);
      if (badge) {
        badge.className = "orbital-forecast-badge collision";
        badge.innerText = "CRITICAL: TRAJECTORY INTERCEPTS SURFACE (COLLISION)";
      }
    } else if (minMoonDist >= 22.0 && minMoonDist <= 50.0) {
      if (this.lineMat) this.lineMat.color.setHex(0x10b981);
      if (badge) {
        badge.className = "orbital-forecast-badge capture";
        badge.innerText = "⭐ OPTIMAL GATEWAY NRHO CAPTURE WINDOW (LOCK OK)";
      }
    } else {
      if (this.lineMat) this.lineMat.color.setHex(0x00e5ff);
      if (badge) {
        badge.className = "orbital-forecast-badge miss";
        badge.innerText = "CISLUNAR FLYBY / FREE-RETURN (CLEAR OF GATEWAY)";
      }
    }

    if (this.state === 'AIMING') {
      const p0 = this.trajectoryPoints[0];
      this.craftPos = { x: p0.x, y: 0, z: p0.z };
      this.craftMesh.position.set(p0.x, 0, p0.z);
      const angle = Math.atan2(vz, vx);
      this.craftMesh.rotation.y = -angle;
    }
  }

  executeBurn() {
    this.state = 'FLYING';
    this.flightTime = 0.0;
    this.closestMoonDist = 999999;

    const rad = (this.ejectAngle * Math.PI) / 180;
    const parkRadius = 98.0;

    this.craftPos = {
      x: Math.cos(rad) * parkRadius,
      y: 0,
      z: Math.sin(rad) * parkRadius
    };

    const vMag = 2.1 + (this.burnPower * 0.70);
    this.craftVel = {
      vx: -Math.sin(rad) * vMag,
      vz: Math.cos(rad) * vMag
    };

    const fuelCost = this.burnPower * 7.5;
    GameState.esmFuelReserve = Math.max(10.0, GameState.esmFuelReserve - fuelCost);

    const burnBtn = document.getElementById("btn-fire-burn");
    if (burnBtn) {
      burnBtn.disabled = true;
      burnBtn.innerText = "TLI BURN ACTIVE — TIME WARP: 10x";
    }

    if (this.thrustPlumeMesh) this.thrustPlumeMesh.visible = true;
    if (window.Sound) window.Sound.playLaunch();
    this.updateScienceBox("TLI Burn Executed! EUS RL10C-3 engines delivered required Delta-V. Spacecraft is coasting across 384,400 km of cislunar space toward the Moon.");
  }

  applyMidCourseCorrection(keyCode) {
    if (GameState.esmFuelReserve <= 5.0) return;
    GameState.esmFuelReserve = Math.max(0, GameState.esmFuelReserve - 0.4);

    const rcsPower = 0.085;
    if (keyCode === 'KeyW') this.craftVel.vx += rcsPower;
    if (keyCode === 'KeyS') this.craftVel.vx -= rcsPower;
    if (keyCode === 'KeyA') this.craftVel.vz -= rcsPower;
    if (keyCode === 'KeyD') this.craftVel.vz += rcsPower;

    if (window.Sound) window.Sound.playRcsPulse();
  }

  updateCameraView() {
    if (!this.camera || !this.craftPos) return;

    const angle = (this.craftVel && (this.craftVel.vx !== 0 || this.craftVel.vz !== 0))
      ? Math.atan2(this.craftVel.vz, this.craftVel.vx)
      : Math.atan2(Math.cos((this.ejectAngle * Math.PI) / 180), -Math.sin((this.ejectAngle * Math.PI) / 180));

    if (this.camMode === 0) {
      // 1. Tactical Orbital (Wide cislunar map overview)
      if (this.state === 'AIMING') {
        this.camera.position.set(380, 520, 480);
        this.camera.lookAt(375, 0, -90);
      } else {
        this.camera.position.x = this.craftPos.x * 0.7 + 100;
        this.camera.position.y = 180 + Math.hypot(this.craftPos.x, this.craftPos.z) * 0.35;
        this.camera.position.z = this.craftPos.z * 0.7 + 140;
        this.camera.lookAt(this.craftPos.x * 0.5 + this.moonPos.x * 0.5, 0, this.craftPos.z * 0.5 + this.moonPos.z * 0.5);
      }
    } else if (this.camMode === 1) {
      // 2. Craft Cockpit / Chase Cam (Close 3D focus on Orion & EUS)
      this.camera.position.set(
        this.craftPos.x - Math.cos(angle) * 36,
        14,
        this.craftPos.z - Math.sin(angle) * 36
      );
      this.camera.lookAt(
        this.craftPos.x + Math.cos(angle) * 20,
        0,
        this.craftPos.z + Math.sin(angle) * 20
      );
    } else if (this.camMode === 2) {
      // 3. Target Focus (Lunar Gateway & Moon Arrival View)
      this.camera.position.set(this.moonPos.x + 90, 48, this.moonPos.z + 85);
      this.camera.lookAt(this.moonPos.x, 0, this.moonPos.z);
    } else if (this.camMode === 3) {
      // 4. Free Orbit (Spherical Mouse Drag Controls)
      const sph = this.cc.spherical;
      const target = (this.state === 'FLYING') ? this.craftPos : { x: 375, y: 0, z: -90 };
      this.camera.position.x = target.x + sph.radius * Math.sin(sph.phi) * Math.sin(sph.theta);
      this.camera.position.y = target.y + sph.radius * Math.cos(sph.phi);
      this.camera.position.z = target.z + sph.radius * Math.sin(sph.phi) * Math.cos(sph.theta);
      this.camera.lookAt(target.x, target.y, target.z);
    }
  }

  updateHUD() {
    const esmEl = document.getElementById("telem-esm-fuel");
    const esmBar = document.getElementById("telem-esm-bar");
    if (esmEl) esmEl.innerText = `${GameState.esmFuelReserve.toFixed(1)}%`;
    if (esmBar) esmBar.style.width = `${GameState.esmFuelReserve.toFixed(1)}%`;

    const velEl = document.getElementById("telem-vel");
    const altEl = document.getElementById("telem-alt");
    if (velEl && this.craftVel) {
      const spd = Math.hypot(this.craftVel.vx, this.craftVel.vz) * 3.4;
      velEl.innerText = `${spd.toFixed(2)} km/s`;
    }
    if (altEl && this.moonPos) {
      const distToMoon = Math.hypot(this.craftPos.x - this.moonPos.x, this.craftPos.z - this.moonPos.z);
      altEl.innerText = `${Math.round(distToMoon * 480)} km to Moon`;
    }
  }

  renderLoop() {
    if (!this.active) return;
    this.cc.anim3dId = requestAnimationFrame(() => this.renderLoop());

    // Celestial Bodies & Station Ambient Rotations
    if (this.earthMesh) this.earthMesh.rotation.y += 0.0012;
    if (this.cloudMesh) this.cloudMesh.rotation.y += 0.0022; // 3D Cloud Parallax
    if (this.moonMesh) this.moonMesh.rotation.y += 0.0008;
    if (this.gatewayGroup) this.gatewayGroup.rotation.y += 0.006;
    if (this.gatewayRing) this.gatewayRing.rotation.z += 0.006;

    // Blinking Gateway Docking Beacon
    if (this.gatewayBeacon) {
      this.gatewayBeacon.visible = (Date.now() % 600 < 300);
    }

    const dt = 0.025;

    if (this.state === 'AIMING') {
      // PREVIEW CAMERAS ACTIVELY IN AIMING STATE!
      this.updateCameraView();
      this.updateHUD();
    } else if (this.state === 'FLYING') {
      this.flightTime += dt;

      // Snappy Time-Warp Multiplier so cislunar transit takes an exciting ~8-10 seconds!
      const warpSpeed = 10.0;
      const GM_Earth = 320.0;
      const GM_Moon = 160.0;

      for (let sub = 0; sub < 4; sub++) {
        const sdt = (dt * warpSpeed) / 4;
        const posX = this.craftPos.x;
        const posZ = this.craftPos.z;

        const rE2 = posX * posX + posZ * posZ;
        const rE = Math.sqrt(rE2);
        const fE = -GM_Earth / (rE2 + 50);
        let ax = (posX / rE) * fE;
        let az = (posZ / rE) * fE;

        const dxM = posX - this.moonPos.x;
        const dzM = posZ - this.moonPos.z;
        const rM2 = dxM * dxM + dzM * dzM;
        const rM = Math.sqrt(rM2);
        const fM = -GM_Moon / (rM2 + 25);
        ax += (dxM / rM) * fM;
        az += (dzM / rM) * fM;

        this.craftVel.vx += ax * sdt;
        this.craftVel.vz += az * sdt;
        this.craftPos.x += this.craftVel.vx * sdt;
        this.craftPos.z += this.craftVel.vz * sdt;

        const curDistMoon = Math.hypot(this.craftPos.x - this.moonPos.x, this.craftPos.z - this.moonPos.z);
        if (curDistMoon < this.closestMoonDist) {
          this.closestMoonDist = curDistMoon;
        }
      }

      this.craftMesh.position.set(this.craftPos.x, 0, this.craftPos.z);
      const angle = Math.atan2(this.craftVel.vz, this.craftVel.vx);
      this.craftMesh.rotation.y = -angle;

      this.updateCameraView();

      const distToEarth = Math.hypot(this.craftPos.x, this.craftPos.z);
      const dxM = this.craftPos.x - this.moonPos.x;
      const dzM = this.craftPos.z - this.moonPos.z;
      const distToMoon = Math.hypot(dxM, dzM);

      if (distToMoon < this.closestMoonDist) {
        this.closestMoonDist = distToMoon;
      }

      const vRadialMoon = (dxM * this.craftVel.vx + dzM * this.craftVel.vz) / Math.max(1, distToMoon);

      // 1. COLLISION WITH EARTH
      if (distToEarth <= 70.0) {
        this.state = 'FAILED';
        this.stop();
        if (window.Sound) window.Sound.playExplosion();
        this.onFail(
          "TERRESTRIAL IMPACT: Spacecraft re-entered Earth's atmosphere and crashed into the ocean. The trajectory lacked escape velocity or an optimal ejection angle.",
          "Ensure burn power is set to 1.80 km/s and ejection angle is set to 240° for a clean trans-lunar trajectory."
        );
        return;
      }

      // 2. COLLISION WITH MOON SURFACE (Moon radius: 18.0)
      if (distToMoon <= 18.5 || this.closestMoonDist <= 18.5) {
        this.state = 'FAILED';
        this.stop();
        if (window.Sound) window.Sound.playExplosion();
        this.onFail(
          "LUNAR SURFACE IMPACT: Spacecraft crashed into the Moon at hypervelocity! Trajectory intercepted the lunar terrain rather than achieving orbital insertion.",
          "Adjust ejection burn angle to 240° and burn power to 1.80 km/s, or use radial RCS [A/D] mid-course burns to raise lunar periapsis into the green Gateway NRHO capture corridor."
        );
        return;
      }

      // 3. GATEWAY NRHO ORBIT INSERTION CAPTURE
      // Only capture if trajectory safely clears the lunar surface (> 19.5) and arrives in capture corridor [20, 50]
      if (this.closestMoonDist > 19.5 && distToMoon <= 50.0 && distToMoon >= 20.0 && (vRadialMoon >= -0.2 || distToMoon <= 34.0)) {
        this.state = 'ORBITING_MOON';
        this.orbitRadius = Math.max(26.0, distToMoon);
        this.orbitAngle = Math.atan2(this.craftPos.z - this.moonPos.z, this.craftPos.x - this.moonPos.x);
        this.orbitTimer = 6.0;

        if (this.thrustPlumeMesh) this.thrustPlumeMesh.visible = false;
        if (window.Sound) window.Sound.playStageSeparation();

        this.showCoastingTimer("LUNAR GATEWAY NRHO DOCKING SEQUENCE");
        this.updateScienceBox("LUNAR ORBIT INSERTION ACHIEVED: Orion & I-Hab have entered Near-Rectilinear Halo Orbit (NRHO)! Spacecraft is actively orbiting the Moon as docking telemetry initializes.");
      }

      // 4. MISSED TRAJECTORY CHECK
      if (this.craftPos.x > this.moonPos.x + 80.0 && distToMoon > 60.0) {
        this.state = 'FAILED';
        this.stop();
        this.onFail(
          "CISLUNAR TRAJECTORY MISSED: Spacecraft overshot the Moon into heliocentric solar orbit without achieving Gateway rendezvous.",
          "Tune ejection angle to 240° and Delta-V burn power to 1.80 km/s, or use RCS thrusters to correct trajectory early in flight."
        );
        return;
      }

      this.updateHUD();
    } else if (this.state === 'ORBITING_MOON') {
      // 6-Second Physical 3D Orbiting Display
      this.orbitTimer -= dt;
      this.showCoastingTimer("LUNAR GATEWAY NRHO DOCKING SEQUENCE");

      this.orbitAngle += dt * 0.85;
      this.craftPos.x = this.moonPos.x + Math.cos(this.orbitAngle) * this.orbitRadius;
      this.craftPos.z = this.moonPos.z + Math.sin(this.orbitAngle) * this.orbitRadius;

      this.craftMesh.position.set(this.craftPos.x, 0, this.craftPos.z);
      this.craftMesh.rotation.y = -this.orbitAngle - Math.PI / 2;

      this.gatewayGroup.position.set(
        this.moonPos.x + Math.cos(this.orbitAngle + 0.35) * (this.orbitRadius + 4),
        0,
        this.moonPos.z + Math.sin(this.orbitAngle + 0.35) * (this.orbitRadius + 4)
      );

      // Camera dramatic orbit lock
      this.camera.position.set(this.moonPos.x + 80, 50, this.moonPos.z + 90);
      this.camera.lookAt(this.moonPos.x, 0, this.moonPos.z);

      this.updateHUD();

      if (this.orbitTimer <= 0) {
        this.state = 'SUCCESS';
        this.stop();
        if (window.Sound) window.Sound.playVictory();
        this.onComplete({
          gatewayStatus: "NRHO Docking Confirmed (7-Day Halo Resonance)",
          ihabDelivery: "European I-Hab Successfully Integrated into Gateway",
          esmReserve: `${GameState.esmFuelReserve.toFixed(1)}% Shared Fuel Reserve`,
          cislunarSpeed: "1.62 km/s (Lunar Capture Delta-V)"
        });
        return;
      }
    }

    this.cc.render3d();
  }

  updateScienceBox(text) {
    const el = document.getElementById("hud-science-text");
    if (el) el.innerText = text;
  }
}

// ==========================================
class Level3Lander {
  constructor(canvas, ctx, onComplete, onFail) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.onComplete = onComplete;
    this.onFail = onFail;
    this.active = false;

    // Massive Lunar World Coordinates (5200m wide, 1600m deep)
    this.worldWidth = 5200;
    this.worldHeight = 1600;

    // Lander State
    this.x = 850;
    this.y = 180;
    this.vx = 0.8;
    this.vy = 0.4;
    this.angle = 0.0;          // Radians
    this.angVel = 0.0;
    this.fuel = 100.0;         // %

    // Control Inputs
    this.mainThrust = false;
    this.rcsLeft = false;
    this.rcsRight = false;
    this.rcsRetro = false;

    // Physical Environment & Procedural Topography
    this.terrain = [];
    this.craterBasins = [];
    this.boulders = [];
    this.iceCrystals = [];
    this.pads = [];
    this.dustParticles = [];
    this.stars = [];

    // Camera Viewport
    this.cameraX = this.x;
    this.cameraY = this.y;

    this.initWorld();
    this.bindEvents();
  }

  initWorld() {
    // 1. Distant High-Elevation Starfield
    this.stars = [];
    for (let i = 0; i < 280; i++) {
      this.stars.push({
        x: Math.random() * this.worldWidth,
        y: Math.random() * 500,
        size: Math.random() < 0.2 ? 2.2 : 1.2,
        alpha: 0.4 + Math.random() * 0.6
      });
    }

    // 2. Continuous Topographical Terrain with 6 Major Impact Basins
    this.terrain = [];
    const segments = 520;
    const dx = this.worldWidth / segments;

    // 6 Deep Crater Basins across the 5200m expanse
    this.craterBasins = [
      { cx: 850,  r: 280, depth: 320, name: "Shackleton Rim Basin" },
      { cx: 1650, r: 340, depth: 420, name: "De Gerlache Chasm" },
      { cx: 2500, r: 240, depth: 260, name: "Malapert Ridge Basin" },
      { cx: 3300, r: 420, depth: 580, name: "Shoemaker Deep Abyss" },
      { cx: 4150, r: 290, depth: 350, name: "Faustini Sunken Trench" },
      { cx: 4850, r: 260, depth: 300, name: "Amundsen Rim Crater" }
    ];

    for (let i = 0; i <= segments; i++) {
      const tx = i * dx;
      // High undulating polar mountains (Base ground elevation at y: 650)
      let ty = 650 + Math.sin(tx * 0.0018) * 90 + Math.sin(tx * 0.006) * 45 + Math.sin(tx * 0.015) * 18;

      // Crater carving with raised rim crests
      for (const c of this.craterBasins) {
        const dist = Math.abs(tx - c.cx);
        if (dist < c.r * 1.35) {
          const normDist = dist / c.r;
          if (normDist <= 1.0) {
            ty += (1.0 - normDist * normDist) * c.depth;
          } else {
            const rimDist = (normDist - 1.0) / 0.35;
            ty -= Math.sin(rimDist * Math.PI) * 42;
          }
        }
      }

      this.terrain.push({ x: tx, y: ty });
    }

    // 3. 4 Exploration Landing Sites with Blinking Beacons
    this.pads = [
      {
        id: "site_alpha",
        label: "SITE ALPHA // SHACKLETON RIM",
        x1: 760, x2: 940, y: 0,
        score: 1000, color: "#10b981", desc: "Flat prepared concrete foundation with green laser beacons."
      },
      {
        id: "site_beta",
        label: "SITE BETA // MALAPERT PLATEAU",
        x1: 2110, x2: 2290, y: 0,
        score: 1500, color: "#f59e0b", desc: "Elevated vantage point with 88% solar exposure."
      },
      {
        id: "site_gamma",
        label: "SITE GAMMA // DEEP ICE CHASM",
        x1: 3460, x2: 3640, y: 0,
        score: 2500, color: "#38bdf8", desc: "Permanently shadowed basin floor at -240°C. Extreme hazard!"
      },
      {
        id: "site_delta",
        label: "SITE DELTA // HISTORIC RECON LANDER",
        x1: 4560, x2: 4740, y: 0,
        score: 3500, color: "#a855f7", desc: "Precision landing zone beside robotic rover & retroreflector."
      }
    ];

    // Flatten terrain strictly at designated landing pads
    for (const pad of this.pads) {
      let sumY = 0, count = 0;
      for (const pt of this.terrain) {
        if (pt.x >= pad.x1 && pt.x <= pad.x2) { sumY += pt.y; count++; }
      }
      pad.y = count > 0 ? (sumY / count) : 680;
      for (const pt of this.terrain) {
        if (pt.x >= pad.x1 - 15 && pt.x <= pad.x2 + 15) {
          pt.y = pad.y;
        }
      }
    }

    // 4. 100 Angular Regolith Boulders with Realistic Ground Shadows
    this.boulders = [];
    for (let i = 0; i < 100; i++) {
      const bx = 80 + Math.random() * (this.worldWidth - 160);
      let inPad = false;
      for (const p of this.pads) {
        if (bx >= p.x1 - 25 && bx <= p.x2 + 25) { inPad = true; break; }
      }
      if (!inPad) {
        const by = this.getGroundElevation(bx);
        this.boulders.push({
          x: bx,
          y: by,
          r: 3 + Math.random() * 8,
          shade: Math.random() < 0.5 ? '#1e293b' : '#334155'
        });
      }
    }

    // 5. 250 Permanently Shadowed Water-Ice Crystals (Deep Basins y > 750)
    this.iceCrystals = [];
    for (let i = 0; i < 250; i++) {
      const ix = 60 + Math.random() * (this.worldWidth - 120);
      const iy = this.getGroundElevation(ix);
      if (iy > 760) {
        this.iceCrystals.push({
          x: ix,
          y: iy - 1 - Math.random() * 3,
          r: 1.5 + Math.random() * 2.5,
          color: Math.random() < 0.6 ? '#38bdf8' : '#ffffff',
          pulse: Math.random() * Math.PI * 2
        });
      }
    }
  }

  getGroundElevation(x) {
    if (x <= 0) return this.terrain[0].y;
    if (x >= this.worldWidth) return this.terrain[this.terrain.length - 1].y;
    const dx = this.worldWidth / (this.terrain.length - 1);
    const idx = Math.floor(x / dx);
    const frac = (x - idx * dx) / dx;
    const y1 = this.terrain[idx].y;
    const y2 = this.terrain[Math.min(this.terrain.length - 1, idx + 1)].y;
    return y1 + (y2 - y1) * frac;
  }

  getTerrainSlope(x) {
    const delta = 15;
    const yL = this.getGroundElevation(x - delta);
    const yR = this.getGroundElevation(x + delta);
    return Math.atan2(yR - yL, delta * 2) * (180 / Math.PI);
  }

  bindEvents() {
    window.addEventListener("keydown", (e) => {
      if (!this.active || GameState.currentScreen !== 'LEVEL_3') return;
      if (e.code === 'KeyW' || e.code === 'ArrowUp' || e.code === 'Space') this.mainThrust = true;
      if (e.code === 'KeyA' || e.code === 'ArrowLeft') this.rcsLeft = true;
      if (e.code === 'KeyD' || e.code === 'ArrowRight') this.rcsRight = true;
      if (e.code === 'KeyS' || e.code === 'ArrowDown') this.rcsRetro = true;
    });

    window.addEventListener("keyup", (e) => {
      if (e.code === 'KeyW' || e.code === 'ArrowUp' || e.code === 'Space') this.mainThrust = false;
      if (e.code === 'KeyA' || e.code === 'ArrowLeft') this.rcsLeft = false;
      if (e.code === 'KeyD' || e.code === 'ArrowRight') this.rcsRight = false;
      if (e.code === 'KeyS' || e.code === 'ArrowDown') this.rcsRetro = false;
    });
  }

  start() {
    this.active = true;
    this.x = 850;
    this.y = 180;
    this.vx = 0.8;
    this.vy = 0.4;
    this.angle = 0.0;
    this.angVel = 0.0;
    this.fuel = 100.0;
    this.mainThrust = false;
    this.rcsLeft = false;
    this.rcsRight = false;
    this.rcsRetro = false;
    this.dustParticles = [];

    this.showRadarWidget();
    this.updateHUDControls();
    this.updateHUD();
    this.updateScienceBox("Shackleton Crater Terminal Approach: 1.62 m/s² lunar gravity. Use [W] for Raptor engines, [A/D] for attitude RCS, and radar to land safely on any flat regolith slope (<14°) or designated base.");
  }

  stop() {
    this.active = false;
    this.hideRadarWidget();
    if (window.Sound) window.Sound.stopRocketThrottle();
  }

  showRadarWidget() {
    const radar = document.getElementById("lunar-radar-widget");
    if (radar) radar.style.display = "block";
    const esmBlock = document.getElementById("telem-shared-esm-block");
    if (esmBlock) esmBlock.style.display = "none";
    const propBlock = document.getElementById("telem-propellant-block");
    if (propBlock) propBlock.style.display = "block";
    const propLabel = document.getElementById("telem-prop-label");
    if (propLabel) propLabel.innerText = "STARSHIP HLS FUEL:";
  }

  hideRadarWidget() {
    const radar = document.getElementById("lunar-radar-widget");
    if (radar) radar.style.display = "none";
  }

  updateHUDControls() {
    const actionBox = document.getElementById("hud-action-bar");
    if (!actionBox) return;
    actionBox.innerHTML = `
      <button id="btn-lander-thrust" class="hud-btn btn-primary">▲ DESCENT ENGINES [W]</button>
      <button id="btn-lander-rcs-left" class="hud-btn">◀ RCS LEFT [A]</button>
      <button id="btn-lander-rcs-right" class="hud-btn">▶ RCS RIGHT [D]</button>
    `;

    const btnThrust = document.getElementById("btn-lander-thrust");
    const btnL = document.getElementById("btn-lander-rcs-left");
    const btnR = document.getElementById("btn-lander-rcs-right");

    if (btnThrust) {
      btnThrust.addEventListener("mousedown", () => { this.mainThrust = true; });
      btnThrust.addEventListener("mouseup", () => { this.mainThrust = false; });
      btnThrust.addEventListener("mouseleave", () => { this.mainThrust = false; });
      btnThrust.addEventListener("touchstart", (e) => { e.preventDefault(); this.mainThrust = true; });
      btnThrust.addEventListener("touchend", (e) => { e.preventDefault(); this.mainThrust = false; });
    }
    if (btnL) {
      btnL.addEventListener("mousedown", () => { this.rcsLeft = true; });
      btnL.addEventListener("mouseup", () => { this.rcsLeft = false; });
      btnL.addEventListener("mouseleave", () => { this.rcsLeft = false; });
      btnL.addEventListener("touchstart", (e) => { e.preventDefault(); this.rcsLeft = true; });
      btnL.addEventListener("touchend", (e) => { e.preventDefault(); this.rcsLeft = false; });
    }
    if (btnR) {
      btnR.addEventListener("mousedown", () => { this.rcsRight = true; });
      btnR.addEventListener("mouseup", () => { this.rcsRight = false; });
      btnR.addEventListener("mouseleave", () => { this.rcsRight = false; });
      btnR.addEventListener("touchstart", (e) => { e.preventDefault(); this.rcsRight = true; });
      btnR.addEventListener("touchend", (e) => { e.preventDefault(); this.rcsRight = false; });
    }
  }

  updateScienceBox(text) {
    const el = document.getElementById("hud-science-text");
    if (el) el.innerText = text;
  }

  update(dt) {
    if (!this.active) return;

    // 1. Lunar Gravity (1.62 m/s² scaled for 2D canvas)
    const lunarG = 2.45;
    this.vy += lunarG * dt;

    // 2. Main Descent Raptor Engine Propulsion
    if (this.mainThrust && this.fuel > 0) {
      const thrustPower = 6.2;
      this.vx += Math.sin(this.angle) * thrustPower * dt;
      this.vy -= Math.cos(this.angle) * thrustPower * dt;
      this.fuel = Math.max(0, this.fuel - dt * 2.8);

      if (window.Sound) window.Sound.setRocketThrottle(0.9);

      // Regolith Ground Dust Emitter when near the lunar surface (< 80m)
      const groundY = this.getGroundElevation(this.x);
      const agl = groundY - this.y;
      if (agl < 80 && agl > 0) {
        for (let k = 0; k < 3; k++) {
          this.dustParticles.push({
            x: this.x + (Math.random() - 0.5) * 16,
            y: groundY - 2,
            vx: (Math.random() < 0.5 ? -1 : 1) * (3.5 + Math.random() * 5.5),
            vy: -1.2 - Math.random() * 2.2,
            rad: 2.5 + Math.random() * 5.0,
            alpha: 0.65,
            color: 'rgba(148, 163, 184, '
          });
        }
      }
    } else {
      if (window.Sound) window.Sound.setRocketThrottle(0.0);
    }

    // 3. RCS Attitude Thrusters
    const rcsPower = 1.45;
    if (this.rcsLeft && this.fuel > 0) {
      this.angVel -= rcsPower * dt;
      this.fuel = Math.max(0, this.fuel - dt * 0.7);
    }
    if (this.rcsRight && this.fuel > 0) {
      this.angVel += rcsPower * dt;
      this.fuel = Math.max(0, this.fuel - dt * 0.7);
    }
    if (this.rcsRetro && this.fuel > 0) {
      this.vy -= 1.8 * dt;
      this.fuel = Math.max(0, this.fuel - dt * 0.9);
    }

    // Angular damping & rotational limits
    this.angVel *= 0.96;
    this.angle += this.angVel * dt;
    this.angle = Math.max(-0.65, Math.min(0.65, this.angle)); // Max ~37 deg tilt

    // 4. Position Update & World Boundary Clamping
    this.x += this.vx * dt * 45;
    this.y += this.vy * dt * 45;

    if (this.x < 40) { this.x = 40; this.vx = 0; }
    if (this.x > this.worldWidth - 40) { this.x = this.worldWidth - 40; this.vx = 0; }

    // Camera smoothly tracks lander
    this.cameraX += (this.x - this.cameraX) * 0.12;
    this.cameraY += (this.y - this.cameraY) * 0.12;

    // 5. Ground Contact & Touchdown Physics Check
    const groundY = this.getGroundElevation(this.x);
    const shipFootY = this.y + 36; // Landing footpad contact point

    if (shipFootY >= groundY) {
      this.y = groundY - 36;

      // Identify if touching down inside any Exploration Site Pad
      let targetPad = null;
      for (const p of this.pads) {
        if (this.x >= p.x1 && this.x <= p.x2) {
          targetPad = p;
          break;
        }
      }

      // Safe thresholds (Forgiving, realistic aerospace tolerances)
      const safeSpeedY = (this.vy <= 2.6);
      const safeSpeedX = (Math.abs(this.vx) <= 1.5);
      const safeAngle = (Math.abs(this.angle) <= 0.20); // Under ~11.5 degrees
      const terrainSlope = Math.abs(this.getTerrainSlope(this.x));
      const safeSlope = (terrainSlope <= 14.0); // Up to 14 degrees slope on regolith

      if (targetPad && safeSpeedY && safeSpeedX && safeAngle) {
        // Triumphant Precision Base Landing at Designated Site!
        this.stop();
        if (window.Sound) window.Sound.playVictory();
        this.onComplete({
          landingSite: `${targetPad.label} (Precision Base Touchdown)`,
          descentVelocity: `${this.vy.toFixed(2)} m/s (Nominal Touchdown)`,
          lateralDrift: `${Math.abs(this.vx).toFixed(2)} m/s`,
          fuelReserve: `${this.fuel.toFixed(1)}% Remaining`,
          explorationScore: `${targetPad.score} NASA Precision Exploration Points`
        });
        return;
      } else if (!targetPad && safeSlope && safeSpeedY && safeSpeedX && safeAngle) {
        // Successful Field Expedition Touchdown on flat/gently sloping Lunar Regolith!
        this.stop();
        if (window.Sound) window.Sound.playVictory();
        this.onComplete({
          landingSite: `Shackleton Polar Regolith (Field Expedition Touchdown, ${terrainSlope.toFixed(1)}° Slope)`,
          descentVelocity: `${this.vy.toFixed(2)} m/s (Safe Touchdown)`,
          lateralDrift: `${Math.abs(this.vx).toFixed(2)} m/s`,
          fuelReserve: `${this.fuel.toFixed(1)}% Remaining`,
          explorationScore: "950 NASA Scientific Field Points"
        });
        return;
      } else {
        // Crash / Hard Touchdown Analysis
        this.stop();
        if (window.Sound) window.Sound.playExplosion();

        let reason = "CRITICAL SURFACE IMPACT: Touchdown parameters exceeded structural safety envelopes.";
        let advice = "Null out lateral drift and slow descent speed below 2.0 m/s before touchdown.";

        if (!safeSlope) {
          reason = `STEEP CRATER SLOPE: Touchdown occurred on a treacherous ${terrainSlope.toFixed(1)}° crater incline, exceeding the 14° maximum safe slope limit. Vehicle rolled into the crater.`;
          advice = "Navigate horizontally using RCS [A/D] across the 5200m terrain toward designated exploration pads or flatter regolith basins (slope < 14°).";
        } else if (!safeSpeedY) {
          reason = `HARD TOUCHDOWN: Vertical descent speed (${this.vy.toFixed(2)} m/s) exceeded the 2.6 m/s landing gear collapse threshold.`;
          advice = "Fire main descent Raptor engines [W] in short pulses to slow descent to under 2.0 m/s just before surface contact.";
        } else if (!safeSpeedX) {
          reason = `LATERAL SHEAR: Horizontal drift speed (${Math.abs(this.vx).toFixed(2)} m/s) exceeded footpad shear tolerance, rolling the spacecraft on regolith.`;
          advice = "Tilt the vehicle in the opposite direction of drift and fire thrusters to bring horizontal velocity to 0.0 m/s.";
        } else if (!safeAngle) {
          reason = `EXCESSIVE ATTITUDE TILT: Lander touched down at a ${(Math.abs(this.angle) * 57.3).toFixed(1)}° angle, causing tip-over on the lunar regolith.`;
          advice = "Use RCS attitude thrusters [A/D] to level the vehicle completely vertical before footpads touch the ground.";
        }

        this.onFail(reason, advice);
        return;
      }
    }

    this.updateHUD();
    this.updateRadar();
  }

  updateRadar() {
    const rCanvas = document.getElementById("radar-canvas");
    if (!rCanvas) return;
    const rctx = rCanvas.getContext("2d");
    const rW = rCanvas.width;
    const rH = rCanvas.height;

    rctx.fillStyle = "rgba(3, 7, 18, 0.92)";
    rctx.fillRect(0, 0, rW, rH);

    // Radar Grid Lines
    rctx.strokeStyle = "rgba(0, 229, 255, 0.15)";
    rctx.lineWidth = 1;
    for (let gx = 0; gx < rW; gx += 40) {
      rctx.beginPath(); rctx.moveTo(gx, 0); rctx.lineTo(gx, rH); rctx.stroke();
    }

    // Terrain Profile on Radar
    rctx.strokeStyle = "#38bdf8";
    rctx.lineWidth = 1.5;
    rctx.beginPath();
    for (let i = 0; i < this.terrain.length; i += 4) {
      const rx = (this.terrain[i].x / this.worldWidth) * rW;
      const ry = (this.terrain[i].y / this.worldHeight) * rH;
      if (i === 0) rctx.moveTo(rx, ry);
      else rctx.lineTo(rx, ry);
    }
    rctx.stroke();

    // 4 Landing Pads on Radar
    for (const pad of this.pads) {
      const rx1 = (pad.x1 / this.worldWidth) * rW;
      const rx2 = (pad.x2 / this.worldWidth) * rW;
      const ry = (pad.y / this.worldHeight) * rH;
      rctx.fillStyle = pad.color;
      rctx.fillRect(rx1, ry - 3, rx2 - rx1, 6);
    }

    // Spacecraft Blip on Radar
    const lx = (this.x / this.worldWidth) * rW;
    const ly = (this.y / this.worldHeight) * rH;
    rctx.fillStyle = (Date.now() % 400 < 200) ? "#00e5ff" : "#ffffff";
    rctx.beginPath();
    rctx.arc(lx, ly, 3.5, 0, Math.PI * 2);
    rctx.fill();

    // Radar Elevation Label
    const elevLabel = document.getElementById("radar-elevation-label");
    if (elevLabel) {
      const groundY = this.getGroundElevation(this.x);
      const aglMeters = Math.max(0, Math.round(groundY - (this.y + 36)));
      elevLabel.innerText = `AGL: ${aglMeters} m`;
    }
  }

  updateHUD() {
    const velEl = document.getElementById("telem-vel");
    const altEl = document.getElementById("telem-alt");
    const throtEl = document.getElementById("telem-throttle");
    const throtBar = document.getElementById("telem-throttle-bar");
    const fuelEl = document.getElementById("telem-fuel");
    const fuelBar = document.getElementById("telem-fuel-bar");

    const groundY = this.getGroundElevation(this.x);
    const aglMeters = Math.max(0, Math.round(groundY - (this.y + 36)));

    if (velEl) velEl.innerText = `Vy: ${this.vy.toFixed(1)} m/s | Vx: ${this.vx.toFixed(1)} m/s`;
    if (altEl) altEl.innerText = `Alt AGL: ${aglMeters} m`;
    if (throtEl) throtEl.innerText = this.mainThrust ? "THRUST: 100%" : "THRUST: 0%";
    if (throtBar) throtBar.style.width = this.mainThrust ? "100%" : "0%";
    if (fuelEl) fuelEl.innerText = `${this.fuel.toFixed(1)}%`;
    if (fuelBar) fuelBar.style.width = `${this.fuel.toFixed(1)}%`;
  }

  render() {
    const W = this.canvas.width;
    const H = this.canvas.height;
    const ctx = this.ctx;

    // Pitch-Black Deep Lunar Sky
    ctx.fillStyle = '#010409';
    ctx.fillRect(0, 0, W, H);

    ctx.save();
    // Center camera on Starship HLS
    ctx.translate(W * 0.5 - this.cameraX, H * 0.5 - this.cameraY);

    // 1. Distant Brilliant Starfield
    ctx.fillStyle = '#ffffff';
    for (const s of this.stars) {
      ctx.globalAlpha = s.alpha;
      ctx.fillRect(s.x, s.y, s.size, s.size);
    }
    ctx.globalAlpha = 1.0;

    // 2. Blue Marble Earth in the Lunar Sky (Fixed High Coordinates)
    this.renderBlueMarbleEarth(ctx);

    // 3. Low Lunar Sun Rays & Ejecta Rays across Terrain
    this.renderEjectaRays(ctx);

    // 4. Volumetric Dark Crater Shadow Fill
    this.renderCraterShadows(ctx);

    // 5. Angular Regolith Boulders with Cast Shadows
    this.renderBoulders(ctx);

    // 6. Glistening Permanently Shadowed Water-Ice Crystals
    this.renderIceCrystals(ctx);

    // 7. Exploration Landing Sites & Surface Artifacts
    this.renderPadsAndArtifacts(ctx);

    // 8. Billowing Regolith Dust Cloud Particles
    this.renderDustStorm(ctx);

    // 9. Hyper-Realistic Starship HLS Model & Dynamic Headlights
    this.renderStarshipHLS(ctx);

    ctx.restore();
  }

  renderBlueMarbleEarth(ctx) {
    const ex = 1200;
    const ey = 220;
    const er = 56;

    // Earth Atmospheric Haze
    const atmoGrad = ctx.createRadialGradient(ex, ey, er - 5, ex, ey, er + 18);
    atmoGrad.addColorStop(0.0, 'rgba(56, 189, 248, 0.7)');
    atmoGrad.addColorStop(0.5, 'rgba(14, 165, 233, 0.3)');
    atmoGrad.addColorStop(1.0, 'rgba(0, 0, 0, 0.0)');
    ctx.fillStyle = atmoGrad;
    ctx.beginPath();
    ctx.arc(ex, ey, er + 18, 0, Math.PI * 2);
    ctx.fill();

    // Ocean Disc
    const oceanGrad = ctx.createRadialGradient(ex - 15, ey - 15, 10, ex, ey, er);
    oceanGrad.addColorStop(0.0, '#38bdf8');
    oceanGrad.addColorStop(0.4, '#1d4ed8');
    oceanGrad.addColorStop(1.0, '#0f172a');
    ctx.fillStyle = oceanGrad;
    ctx.beginPath();
    ctx.arc(ex, ey, er, 0, Math.PI * 2);
    ctx.fill();

    // Continents & Cloud Swirls
    ctx.fillStyle = '#22c55e';
    ctx.beginPath();
    ctx.arc(ex - 8, ey - 6, 18, 0, Math.PI * 2);
    ctx.arc(ex + 18, ey + 12, 14, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
    ctx.beginPath();
    ctx.arc(ex - 16, ey + 10, 16, 0, Math.PI * 2);
    ctx.arc(ex + 12, ey - 18, 20, 0, Math.PI * 2);
    ctx.fill();

    // Earth Crescent Phase Shadow (Low Lunar Sun Angle)
    ctx.fillStyle = 'rgba(1, 4, 9, 0.65)';
    ctx.beginPath();
    ctx.arc(ex + 12, ey, er + 2, -Math.PI / 2, Math.PI / 2, true);
    ctx.bezierCurveTo(ex - 5, ey + er, ex - 5, ey - er, ex + 12, ey - er);
    ctx.fill();
  }

  renderEjectaRays(ctx) {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 18;
    for (const c of this.craterBasins) {
      ctx.beginPath();
      ctx.moveTo(c.cx, 550);
      ctx.lineTo(c.cx - 240, 780);
      ctx.moveTo(c.cx, 550);
      ctx.lineTo(c.cx + 240, 780);
      ctx.stroke();
    }
  }

  renderCraterShadows(ctx) {
    // 1. Terrain Ground Fill
    ctx.fillStyle = '#0f172a'; // Deep regolith charcoal
    ctx.beginPath();
    ctx.moveTo(0, this.worldHeight);
    for (const pt of this.terrain) {
      ctx.lineTo(pt.x, pt.y);
    }
    ctx.lineTo(this.worldWidth, this.worldHeight);
    ctx.closePath();
    ctx.fill();

    // 2. High-Contrast Sunlit Terrain Edge (Low Sun from Left)
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let i = 0; i < this.terrain.length; i++) {
      if (i === 0) ctx.moveTo(this.terrain[i].x, this.terrain[i].y);
      else ctx.lineTo(this.terrain[i].x, this.terrain[i].y);
    }
    ctx.stroke();

    // 3. Pitch-Black Shadow Fill on Leeward Slopes
    ctx.fillStyle = '#020617';
    for (const c of this.craterBasins) {
      ctx.beginPath();
      ctx.moveTo(c.cx - c.r * 0.1, this.getGroundElevation(c.cx - c.r * 0.1));
      ctx.lineTo(c.cx + c.r * 0.9, this.getGroundElevation(c.cx + c.r * 0.9));
      ctx.lineTo(c.cx + c.r * 0.9, this.worldHeight);
      ctx.lineTo(c.cx - c.r * 0.1, this.worldHeight);
      ctx.closePath();
      ctx.fill();
    }
  }

  renderBoulders(ctx) {
    for (const b of this.boulders) {
      ctx.save();
      // Drop Shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
      ctx.beginPath();
      ctx.ellipse(b.x + b.r * 0.8, b.y + 2, b.r * 1.4, b.r * 0.4, 0.1, 0, Math.PI * 2);
      ctx.fill();
      // Boulder Body
      ctx.fillStyle = b.shade;
      ctx.beginPath();
      ctx.arc(b.x, b.y - b.r * 0.5, b.r, 0, Math.PI * 2);
      ctx.fill();
      // Sunlit Facet Highlight
      ctx.fillStyle = '#cbd5e1';
      ctx.beginPath();
      ctx.arc(b.x - b.r * 0.3, b.y - b.r * 0.75, b.r * 0.45, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  renderIceCrystals(ctx) {
    const t = Date.now() * 0.003;
    for (const c of this.iceCrystals) {
      const pulseAlpha = 0.5 + Math.sin(t + c.pulse) * 0.45;
      ctx.fillStyle = c.color;
      ctx.globalAlpha = pulseAlpha;
      ctx.beginPath();
      ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1.0;
  }

  renderPadsAndArtifacts(ctx) {
    for (const pad of this.pads) {
      // Concrete Landing Slab Foundation
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(pad.x1, pad.y, pad.x2 - pad.x1, 14);

      // Pad Border & Surface
      ctx.strokeStyle = pad.color;
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(pad.x1, pad.y);
      ctx.lineTo(pad.x2, pad.y);
      ctx.stroke();

      // Target Crosshair
      const midX = (pad.x1 + pad.x2) * 0.5;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(midX, pad.y, 16, 0, Math.PI * 2);
      ctx.stroke();

      // Flashing Edge Hazard Beacons
      const flash = (Date.now() % 600 < 300);
      ctx.fillStyle = flash ? pad.color : '#334155';
      ctx.beginPath();
      ctx.arc(pad.x1 + 6, pad.y - 6, 5, 0, Math.PI * 2);
      ctx.arc(pad.x2 - 6, pad.y - 6, 5, 0, Math.PI * 2);
      ctx.fill();

      // Site Nameplate Banner
      ctx.fillStyle = pad.color;
      ctx.font = "bold 12px 'Courier New', monospace";
      ctx.textAlign = "center";
      ctx.fillText(pad.label, midX, pad.y + 28);
      ctx.font = "10px sans-serif";
      ctx.fillStyle = '#94a3b8';
      ctx.fillText(`${pad.score} PTS // ${pad.desc}`, midX, pad.y + 42);

      // Historic Scientific Instruments at Site Delta
      if (pad.id === 'site_delta') {
        // Apollo / Artemis Laser Retroreflector Package
        ctx.fillStyle = '#e2e8f0';
        ctx.fillRect(pad.x1 + 30, pad.y - 12, 14, 12);
        ctx.fillStyle = '#00e5ff';
        ctx.fillRect(pad.x1 + 33, pad.y - 9, 8, 6);

        // Robotic Surface Rover Mast
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(pad.x2 - 45, pad.y - 18, 18, 18);
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(pad.x2 - 36, pad.y - 18);
        ctx.lineTo(pad.x2 - 36, pad.y - 32);
        ctx.stroke();
      }
    }
  }

  renderDustStorm(ctx) {
    for (let i = this.dustParticles.length - 1; i >= 0; i--) {
      const p = this.dustParticles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.rad += 0.35;
      p.alpha -= 0.022;

      if (p.alpha <= 0) {
        this.dustParticles.splice(i, 1);
        continue;
      }

      ctx.fillStyle = p.color + p.alpha + ')';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.rad, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  renderStarshipHLS(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);

    // 1. Dual High-Power LED Steerable Landing Searchlights
    ctx.save();
    const lightGrad = ctx.createRadialGradient(0, 20, 10, 0, 180, 140);
    lightGrad.addColorStop(0.0, 'rgba(255, 255, 255, 0.45)');
    lightGrad.addColorStop(0.6, 'rgba(56, 189, 248, 0.18)');
    lightGrad.addColorStop(1.0, 'rgba(0, 0, 0, 0.0)');
    ctx.fillStyle = lightGrad;
    ctx.beginPath();
    ctx.moveTo(-16, 20);
    ctx.lineTo(-90, 260);
    ctx.lineTo(90, 260);
    ctx.lineTo(16, 20);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // 2. Raptor Descent Engine Plume (When Main Thrust Active)
    if (this.mainThrust && this.fuel > 0) {
      const plumeGrad = ctx.createLinearGradient(0, 32, 0, 95);
      plumeGrad.addColorStop(0.0, '#ffffff');
      plumeGrad.addColorStop(0.2, '#38bdf8');
      plumeGrad.addColorStop(0.65, '#0284c7');
      plumeGrad.addColorStop(1.0, 'rgba(2, 132, 199, 0)');

      ctx.fillStyle = plumeGrad;
      ctx.beginPath();
      ctx.moveTo(-10, 32);
      ctx.lineTo(-18, 85);
      ctx.lineTo(0, 105);
      ctx.lineTo(18, 85);
      ctx.lineTo(10, 32);
      ctx.fill();

      // Shock Diamond in Plume
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(0, 52, 3, 6, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // 3. RCS Nitrogen Gas Puffs
    if (this.rcsLeft && this.fuel > 0) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.beginPath();
      ctx.moveTo(16, -26); ctx.lineTo(35, -32); ctx.lineTo(35, -20); ctx.fill();
    }
    if (this.rcsRight && this.fuel > 0) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.beginPath();
      ctx.moveTo(-16, -26); ctx.lineTo(-35, -32); ctx.lineTo(-35, -20); ctx.fill();
    }

    // 4. Stainless Steel Fuselage (Starship HLS Cylindrical Hull)
    const hullGrad = ctx.createLinearGradient(-16, 0, 16, 0);
    hullGrad.addColorStop(0.0, '#64748b');
    hullGrad.addColorStop(0.25, '#f8fafc');
    hullGrad.addColorStop(0.55, '#ffffff');
    hullGrad.addColorStop(0.85, '#cbd5e1');
    hullGrad.addColorStop(1.0, '#475569');
    ctx.fillStyle = hullGrad;
    ctx.fillRect(-16, -28, 32, 58);

    // Forward Aerodynamic Nosecone & Crew Cabins
    ctx.fillStyle = '#f1f5f9';
    ctx.beginPath();
    ctx.moveTo(-16, -28);
    ctx.lineTo(0, -52);
    ctx.lineTo(16, -28);
    ctx.closePath();
    ctx.fill();

    // Panoramic Observation Cupola Windows
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(-8, -40, 16, 5);

    // Hexagonal Thermal Protection Tile Matrix Strip (Leeward Side)
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-16, -28, 6, 58);

    // NASA Worm / Meatball Insignia
    ctx.fillStyle = '#0b3d91';
    ctx.beginPath();
    ctx.arc(2, -10, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#fc3d21';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-1, -10); ctx.lineTo(5, -10); ctx.stroke();

    // Wrap-Around Solar Array Band
    ctx.fillStyle = '#1e3a8a';
    ctx.fillRect(-16, 4, 32, 8);
    ctx.strokeStyle = '#60a5fa';
    ctx.lineWidth = 1;
    ctx.strokeRect(-16, 4, 32, 8);

    // 5. Articulated Hydraulic Landing Gear Struts & Footpads
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 3;
    // Left Quad Strut
    ctx.beginPath();
    ctx.moveTo(-14, 18); ctx.lineTo(-28, 36); ctx.lineTo(-36, 36); ctx.stroke();
    // Right Quad Strut
    ctx.beginPath();
    ctx.moveTo(14, 18); ctx.lineTo(28, 36); ctx.lineTo(36, 36); ctx.stroke();

    // Wide Gold Anodized Footpads
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(-38, 34, 10, 4);
    ctx.fillRect(28, 34, 10, 4);

    ctx.restore();
  }
}

// ==========================================
// 9. LEVEL 4: TRANS-EARTH INJECTION & SKIP REENTRY (ELITE 3D ASTRODYNAMICS)
// Realistic Procedural Earth & Moon Textures, 2800-Step Trajectory Prediction,

// ==========================================
// 9. LEVEL 4: TRANS-EARTH INJECTION & SKIP REENTRY (ELITE 3D ASTRODYNAMICS V2)
// True Earthbound Velocity Vector (42 deg, 2.25 km/s), 3D Parallax Cloud Sphere,
// 4 Previewable Camera Modes (Tactical Wide, Craft Chase, Target Focus, Free Orbit),
// Atmospheric Skip Entry Plasma Sheath & Parachute Splashdown
// ==========================================
class Level4Return {
  constructor(canvasController, onComplete, onFail) {
    this.cc = canvasController;
    this.onComplete = onComplete;
    this.onFail = onFail;
    this.active = false;

    // Simulation Parameters (Optimal: 42 deg angle, 2.25 km/s Delta-V power)
    this.ejectAngle = 42.0;  // Degrees
    this.burnPower = 2.25;   // km/s Delta-V
    this.state = 'AIMING';   // 'AIMING', 'FLYING', 'SKIP_ENTRY', 'SUCCESS', 'FAILED'
    this.flightTime = 0.0;
    this.skipPhase = 0;      // 0: Trajectory, 1: Plasma Skip, 2: Chute Descent
    this.minDistToEarth = 999999;
    this.passedPeriapsis = false;

    // Coordinate Systems
    this.earthPos = { x: 0, y: 0, z: 0 };
    this.moonPos = { x: 750, y: 0, z: -180 };
    this.craftPos = { x: 750, y: 0, z: -180 };
    this.craftVel = { vx: 0, vz: 0 };
    this.trajectoryPoints = [];

    // Three.js Scene References
    this.scene = null;
    this.camera = null;
    this.earthMesh = null;
    this.cloudMesh = null;
    this.moonMesh = null;
    this.craftMesh = null;
    this.trajLine = null;
    this.lineMat = null;
    this.corridorRing = null;
    this.plasmaGroup = null;
    this.plasmaParticles = [];
    this.chuteGroup = null;

    // Camera Modes: 0: Tactical Wide, 1: Craft Chase, 2: Earth Target Focus, 3: Free Orbit
    this.camMode = 0;
    this.camNames = [
      "🎥 CAM: [1] TACTICAL WIDE",
      "🎥 CAM: [2] CRAFT CHASE",
      "🎥 CAM: [3] TARGET FOCUS",
      "🎥 CAM: [4] FREE ORBIT"
    ];

    this.bindEvents();
  }

  bindEvents() {
    const angleSlider = document.getElementById("slider-eject-angle");
    const powerSlider = document.getElementById("slider-burn-power");
    const angleLabel = document.getElementById("label-eject-angle");
    const powerLabel = document.getElementById("label-burn-power");
    const burnBtn = document.getElementById("btn-fire-burn");
    const camBtn = document.getElementById("btn-toggle-cam");

    if (angleSlider) {
      angleSlider.addEventListener("input", (e) => {
        if (GameState.currentScreen !== 'LEVEL_4') return;
        this.ejectAngle = parseFloat(e.target.value);
        if (angleLabel) angleLabel.innerText = `${this.ejectAngle.toFixed(0)}°`;
        this.calculateTrajectory();
      });
    }

    if (powerSlider) {
      powerSlider.addEventListener("input", (e) => {
        if (GameState.currentScreen !== 'LEVEL_4') return;
        this.burnPower = parseFloat(e.target.value);
        if (powerLabel) powerLabel.innerText = `${this.burnPower.toFixed(2)} km/s`;
        this.calculateTrajectory();
      });
    }

    if (burnBtn) {
      burnBtn.addEventListener("click", () => {
        if (GameState.currentScreen === 'LEVEL_4' && this.state === 'AIMING') {
          this.executeBurn();
        }
      });
    }

    if (camBtn) {
      camBtn.addEventListener("click", () => {
        if (GameState.currentScreen !== 'LEVEL_4') return;
        this.cycleCamera();
      });
    }

    window.addEventListener("keydown", (e) => {
      if (!this.active || GameState.currentScreen !== 'LEVEL_4') return;
      if (this.state === 'AIMING' && (e.code === 'Space' || e.code === 'Enter')) {
        this.executeBurn();
      }
      if (this.state === 'FLYING' && ['KeyW', 'KeyS', 'KeyA', 'KeyD'].includes(e.code)) {
        this.applyMidCourseCorrection(e.code);
      }
      if (e.code === 'Digit1') this.setCameraMode(0);
      if (e.code === 'Digit2') this.setCameraMode(1);
      if (e.code === 'Digit3') this.setCameraMode(2);
      if (e.code === 'Digit4') this.setCameraMode(3);
      if (e.code === 'KeyC') this.cycleCamera();
    });
  }

  setCameraMode(mode) {
    this.camMode = mode;
    const camBtn = document.getElementById("btn-toggle-cam");
    if (camBtn) camBtn.innerText = this.camNames[this.camMode];
  }

  cycleCamera() {
    this.camMode = (this.camMode + 1) % 4;
    const camBtn = document.getElementById("btn-toggle-cam");
    if (camBtn) camBtn.innerText = this.camNames[this.camMode];
  }

  start() {
    this.active = true;
    this.state = 'AIMING';
    this.flightTime = 0.0;
    this.skipPhase = 0;
    this.minDistToEarth = 999999;
    this.passedPeriapsis = false;
    this.plasmaParticles = [];
    this.camMode = 0;

    // Ensure inherited ESM fuel reserve
    if (GameState.esmFuelReserve <= 0 || isNaN(GameState.esmFuelReserve)) {
      GameState.esmFuelReserve = 48.0;
    }

    // Default optimal return parameters: 42 deg angle, 2.25 km/s burn power
    this.ejectAngle = 42.0;
    this.burnPower = 2.25;

    const angleSlider = document.getElementById("slider-eject-angle");
    const powerSlider = document.getElementById("slider-burn-power");
    const angleLabel = document.getElementById("label-eject-angle");
    const powerLabel = document.getElementById("label-burn-power");
    if (angleSlider) {
      angleSlider.min = "0";
      angleSlider.max = "360";
      angleSlider.step = "1";
      angleSlider.value = this.ejectAngle;
    }
    if (powerSlider) {
      powerSlider.min = "1.5";
      powerSlider.max = "3.5";
      powerSlider.step = "0.05";
      powerSlider.value = this.burnPower;
    }
    if (angleLabel) angleLabel.innerText = `${this.ejectAngle.toFixed(0)}°`;
    if (powerLabel) powerLabel.innerText = `${this.burnPower.toFixed(2)} km/s`;

    const camBtn = document.getElementById("btn-toggle-cam");
    if (camBtn) camBtn.innerText = this.camNames[this.camMode];

    this.init3DScene();
    this.calculateTrajectory();
    this.showUI();
    this.renderLoop();

    this.updateScienceBox("TEI Planning: Align Orion's Service Module burn to target the 2.0° atmospheric skip-entry corridor (green ring, radius 66-68). Preview cameras with [1-4] or CAM button before launch.");
  }

  stop() {
    this.active = false;
    this.hideUI();
    this.cc.clear3dScene();
  }

  showUI() {
    const dock = document.getElementById("orbital-dock");
    if (dock) dock.style.display = "block";

    const titleEl = document.getElementById("dock-maneuver-title") || document.getElementById("orbital-dock-label");
    if (titleEl) titleEl.innerText = "PHASE 4: TRANS-EARTH INJECTION & SKIP REENTRY";

    const burnBtn = document.getElementById("btn-fire-burn");
    if (burnBtn) {
      burnBtn.disabled = false;
      burnBtn.innerText = "IGNITE ORION ESM MAIN ENGINE [SPACE]";
    }

    const actionBox = document.getElementById("hud-action-bar");
    if (actionBox) {
      actionBox.innerHTML = `
        <button id="btn-rcs-up-4" class="hud-btn">▲ RCS PROGRADE [W]</button>
        <button id="btn-rcs-down-4" class="hud-btn">▼ RCS RETRO [S]</button>
        <button id="btn-rcs-left-4" class="hud-btn">◀ RCS NORMAL [A]</button>
        <button id="btn-rcs-right-4" class="hud-btn">▶ RCS ANTI-NORMAL [D]</button>
      `;

      const bW = document.getElementById("btn-rcs-up-4");
      const bS = document.getElementById("btn-rcs-down-4");
      const bA = document.getElementById("btn-rcs-left-4");
      const bD = document.getElementById("btn-rcs-right-4");
      if (bW) bW.addEventListener("click", () => this.applyMidCourseCorrection('KeyW'));
      if (bS) bS.addEventListener("click", () => this.applyMidCourseCorrection('KeyS'));
      if (bA) bA.addEventListener("click", () => this.applyMidCourseCorrection('KeyA'));
      if (bD) bD.addEventListener("click", () => this.applyMidCourseCorrection('KeyD'));
    }

    this.updateHUD();
  }

  hideUI() {
    const dock = document.getElementById("orbital-dock");
    if (dock) dock.style.display = "none";
    const actionBox = document.getElementById("hud-action-bar");
    if (actionBox) actionBox.innerHTML = "";
  }

  init3DScene() {
    const { scene, camera } = this.cc.init3dScene();
    this.scene = scene;
    this.camera = camera;

    this.camera.position.set(420, 480, 520);
    this.camera.lookAt(320, 0, -90);

    // Deep Space Starfield
    const starGeo = new THREE.BufferGeometry();
    const starCount = 4000;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starPositions[i] = (Math.random() - 0.5) * 4000;
      starPositions[i + 1] = (Math.random() - 0.5) * 2400;
      starPositions[i + 2] = (Math.random() - 0.5) * 4000;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 2.2, transparent: true, opacity: 0.88 });
    scene.add(new THREE.Points(starGeo, starMat));

    // Sun Key Lighting
    const sunLight = new THREE.DirectionalLight(0xffffff, 1.5);
    sunLight.position.set(1200, 300, 800);
    scene.add(sunLight);
    scene.add(new THREE.AmbientLight(0x223355, 0.48));

    // Realistic Blue Marble Earth (Origin [0, 0, 0], Radius: 65)
    const earthGeo = new THREE.SphereGeometry(65, 64, 64);
    const earthTexture = (typeof ProceduralSpaceAssets !== 'undefined') ? ProceduralSpaceAssets.getEarthTexture() : null;
    const earthMat = new THREE.MeshStandardMaterial({
      map: earthTexture,
      roughness: 0.55,
      metalness: 0.1
    });
    this.earthMesh = new THREE.Mesh(earthGeo, earthMat);
    scene.add(this.earthMesh);

    // Earth 3D Parallax Cloud Layer (Radius: 65.8)
    const cloudGeo = new THREE.SphereGeometry(65.8, 64, 64);
    const cloudTexture = (typeof ProceduralSpaceAssets !== 'undefined') ? ProceduralSpaceAssets.getCloudTexture() : null;
    const cloudMat = new THREE.MeshStandardMaterial({
      map: cloudTexture,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending
    });
    this.cloudMesh = new THREE.Mesh(cloudGeo, cloudMat);
    scene.add(this.cloudMesh);

    // Earth Atmospheric Haze Glow
    const atmosGeo = new THREE.SphereGeometry(69.2, 48, 48);
    const atmosMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.28,
      side: THREE.BackSide
    });
    scene.add(new THREE.Mesh(atmosGeo, atmosMat));

    // Earth Skip-Entry Corridor Indicator Ring (Radius: 66.5 to 68.5)
    const ringGeo = new THREE.RingGeometry(66.5, 68.5, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.75
    });
    this.corridorRing = new THREE.Mesh(ringGeo, ringMat);
    this.corridorRing.rotation.x = Math.PI / 2;
    scene.add(this.corridorRing);

    // Realistic Moon at [750, 0, -180] (Radius: 18)
    const moonGeo = new THREE.SphereGeometry(18, 48, 48);
    const moonTexture = (typeof ProceduralSpaceAssets !== 'undefined') ? ProceduralSpaceAssets.getMoonTexture() : null;
    const moonMat = new THREE.MeshStandardMaterial({
      map: moonTexture,
      roughness: 0.88,
      metalness: 0.05
    });
    this.moonMesh = new THREE.Mesh(moonGeo, moonMat);
    this.moonMesh.position.set(this.moonPos.x, this.moonPos.y, this.moonPos.z);
    scene.add(this.moonMesh);

    // Orion Spacecraft Model
    const craftGroup = new THREE.Group();
    // Conical Crew Module (CM)
    const coneGeo = new THREE.ConeGeometry(2.4, 3.8, 16);
    const coneMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.3, metalness: 0.5 });
    const coneMesh = new THREE.Mesh(coneGeo, coneMat);
    coneMesh.rotation.x = Math.PI / 2;
    craftGroup.add(coneMesh);

    // European Service Module (ESM)
    const cylGeo = new THREE.CylinderGeometry(2.2, 2.2, 3.2, 16);
    const cylMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.7 });
    const cylMesh = new THREE.Mesh(cylGeo, cylMat);
    cylMesh.rotation.x = Math.PI / 2;
    cylMesh.position.z = -3.2;
    craftGroup.add(cylMesh);

    // 4 X-Wing Solar Panels
    for (let sa = 0; sa < 4; sa++) {
      const saGeo = new THREE.BoxGeometry(7.0, 0.15, 1.4);
      const saMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.2 });
      const saMesh = new THREE.Mesh(saGeo, saMat);
      saMesh.position.z = -3.0;
      saMesh.rotation.z = (sa * Math.PI) / 2 + Math.PI / 4;
      craftGroup.add(saMesh);
    }

    this.craftMesh = craftGroup;
    scene.add(this.craftMesh);

    // Trajectory Line
    const maxPoints = 8000;
    const lineGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(maxPoints * 3);
    lineGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.lineMat = new THREE.LineDashedMaterial({
      color: 0x10b981,
      dashSize: 4.5,
      gapSize: 2.2,
      linewidth: 2.5
    });
    this.trajLine = new THREE.Line(lineGeo, this.lineMat);
    scene.add(this.trajLine);

    this.plasmaGroup = new THREE.Group();
    scene.add(this.plasmaGroup);

    // 3 Main Apollo / Artemis Parachutes (Hidden until deployment)
    this.chuteGroup = new THREE.Group();
    for (let c = 0; c < 3; c++) {
      const cGeo = new THREE.ConeGeometry(5.5, 4.0, 16, 1, true);
      const cMat = new THREE.MeshStandardMaterial({
        color: (c % 2 === 0) ? 0xe05624 : 0xffffff,
        side: THREE.DoubleSide
      });
      const cMesh = new THREE.Mesh(cGeo, cMat);
      cMesh.rotation.x = -Math.PI / 2;
      const angle = (c * Math.PI * 2) / 3;
      cMesh.position.set(Math.cos(angle) * 7.5, 12.0, Math.sin(angle) * 7.5);
      this.chuteGroup.add(cMesh);
    }
    this.chuteGroup.visible = false;
    this.craftMesh.add(this.chuteGroup);
  }

  calculateTrajectory() {
    const rad = (this.ejectAngle * Math.PI) / 180;
    const moonR = 34.0;
    let posX = this.moonPos.x + Math.cos(rad) * moonR;
    let posZ = this.moonPos.z + Math.sin(rad) * moonR;

    const vMag = 1.9 + (this.burnPower * 0.85);
    let vx = -Math.sin(rad) * vMag;
    let vz = Math.cos(rad) * vMag;

    this.trajectoryPoints = [];
    const dt = 0.08;
    const steps = 10000;
    this.minDistToEarth = 999999;

    const GM_Earth = 2400.0;
    const GM_Moon = 140.0;

    for (let i = 0; i < steps; i++) {
      if (i % 2 === 0 && this.trajectoryPoints.length < 7900) {
        this.trajectoryPoints.push({ x: posX, y: 0, z: posZ });
      }

      const dxE = posX - this.earthPos.x;
      const dzE = posZ - this.earthPos.z;
      const rEarth2 = dxE * dxE + dzE * dzE;
      const rEarth = Math.sqrt(rEarth2);
      if (rEarth < this.minDistToEarth) this.minDistToEarth = rEarth;

      const fEarth = -GM_Earth / (rEarth2 + 80);
      let ax = (dxE / rEarth) * fEarth;
      let az = (dzE / rEarth) * fEarth;

      const dxM = posX - this.moonPos.x;
      const dzM = posZ - this.moonPos.z;
      const rMoon2 = dxM * dxM + dzM * dzM;
      const rMoon = Math.sqrt(rMoon2);
      const fMoon = -GM_Moon / (rMoon2 + 40);
      ax += (dxM / rMoon) * fMoon;
      az += (dzM / rMoon) * fMoon;

      vx += ax * dt;
      vz += az * dt;
      posX += vx * dt;
      posZ += vz * dt;
    }

    const positions = this.trajLine.geometry.attributes.position.array;
    for (let i = 0; i < this.trajectoryPoints.length; i++) {
      positions[i * 3] = this.trajectoryPoints[i].x;
      positions[i * 3 + 1] = this.trajectoryPoints[i].y;
      positions[i * 3 + 2] = this.trajectoryPoints[i].z;
    }
    this.trajLine.geometry.setDrawRange(0, this.trajectoryPoints.length);
    this.trajLine.geometry.attributes.position.needsUpdate = true;
    this.trajLine.computeLineDistances();

    const badge = document.getElementById("orbital-forecast-badge");

    if (this.minDistToEarth < 65.5) {
      if (this.lineMat) this.lineMat.color.setHex(0xef4444);
      if (badge) {
        badge.className = "orbital-forecast-badge collision";
        badge.innerText = "CRITICAL: ENTRY TOO STEEP (>3.5°) - HEAT SHIELD OVERHEAT!";
      }
    } else if (this.minDistToEarth >= 65.5 && this.minDistToEarth <= 69.5) {
      if (this.lineMat) this.lineMat.color.setHex(0x10b981);
      if (badge) {
        badge.className = "orbital-forecast-badge capture";
        badge.innerText = "⭐ NOMINAL 2.0° SKIP-ENTRY CORRIDOR (TARGET LOCKED)";
      }
    } else {
      if (this.lineMat) this.lineMat.color.setHex(0xfbbf24);
      if (badge) {
        badge.className = "orbital-forecast-badge miss";
        badge.innerText = "WARNING: ENTRY TOO SHALLOW (<1.8°) - SKIP-OFF INTO SOLAR ORBIT";
      }
    }

    if (this.state === 'AIMING') {
      const p0 = this.trajectoryPoints[0];
      this.craftPos = { x: p0.x, y: 0, z: p0.z };
      this.craftMesh.position.set(p0.x, 0, p0.z);
      const angle = Math.atan2(vz, vx);
      this.craftMesh.rotation.y = -angle;
    }
  }

  executeBurn() {
    this.state = 'FLYING';
    this.flightTime = 0.0;
    this.skipPhase = 0;
    this.passedPeriapsis = false;

    const rad = (this.ejectAngle * Math.PI) / 180;
    const moonR = 34.0;
    this.craftPos = {
      x: this.moonPos.x + Math.cos(rad) * moonR,
      y: 0,
      z: this.moonPos.z + Math.sin(rad) * moonR
    };

    const vMag = 1.9 + (this.burnPower * 0.85);
    this.craftVel = {
      vx: -Math.sin(rad) * vMag,
      vz: Math.cos(rad) * vMag
    };

    const fuelCost = this.burnPower * 8.2;
    GameState.esmFuelReserve = Math.max(5.0, GameState.esmFuelReserve - fuelCost);

    const burnBtn = document.getElementById("btn-fire-burn");
    if (burnBtn) {
      burnBtn.disabled = true;
      burnBtn.innerText = "TEI BURN COMPLETE — TRANS-EARTH COAST";
    }

    if (window.Sound) window.Sound.playLaunch();
    this.updateScienceBox("TEI Main Engine Burn Executed! Orion service module has departed Gateway orbit and is accelerating across cislunar space toward Earth at 11 km/s.");
  }

  applyMidCourseCorrection(keyCode) {
    if (GameState.esmFuelReserve <= 2.0) return;
    GameState.esmFuelReserve = Math.max(0, GameState.esmFuelReserve - 0.5);

    const rcsImpulse = 0.085;
    if (keyCode === 'KeyW') this.craftVel.vx += rcsImpulse;
    if (keyCode === 'KeyS') this.craftVel.vx -= rcsImpulse;
    if (keyCode === 'KeyA') this.craftVel.vz -= rcsImpulse;
    if (keyCode === 'KeyD') this.craftVel.vz += rcsImpulse;

    if (window.Sound) window.Sound.playRcsPulse();
  }

  updateCameraView() {
    if (!this.camera || !this.craftPos) return;

    const angle = (this.craftVel && (this.craftVel.vx !== 0 || this.craftVel.vz !== 0))
      ? Math.atan2(this.craftVel.vz, this.craftVel.vx)
      : Math.atan2(Math.cos((this.ejectAngle * Math.PI) / 180), -Math.sin((this.ejectAngle * Math.PI) / 180));

    if (this.camMode === 0) {
      // 1. Tactical Orbital (Wide cislunar map overview)
      if (this.state === 'AIMING') {
        this.camera.position.set(420, 480, 520);
        this.camera.lookAt(320, 0, -90);
      } else {
        this.camera.position.x = this.craftPos.x * 0.7 + 120;
        this.camera.position.y = 160 + Math.hypot(this.craftPos.x, this.craftPos.z) * 0.35;
        this.camera.position.z = this.craftPos.z * 0.7 + 160;
        this.camera.lookAt(this.craftPos.x * 0.4, 0, this.craftPos.z * 0.4);
      }
    } else if (this.camMode === 1) {
      // 2. Craft Cockpit / Chase Cam (Close 3D focus on Orion)
      this.camera.position.set(
        this.craftPos.x - Math.cos(angle) * 32,
        14,
        this.craftPos.z - Math.sin(angle) * 32
      );
      this.camera.lookAt(
        this.craftPos.x + Math.cos(angle) * 20,
        0,
        this.craftPos.z + Math.sin(angle) * 20
      );
    } else if (this.camMode === 2) {
      // 3. Target Focus (Earth & Atmospheric Skip Corridor Ring)
      this.camera.position.set(90, 45, 110);
      this.camera.lookAt(0, 0, 0);
    } else if (this.camMode === 3) {
      // 4. Free Orbit (Spherical Mouse Drag Controls)
      const sph = this.cc.spherical;
      const target = (this.state === 'FLYING') ? this.craftPos : { x: 320, y: 0, z: -90 };
      this.camera.position.x = target.x + sph.radius * Math.sin(sph.phi) * Math.sin(sph.theta);
      this.camera.position.y = target.y + sph.radius * Math.cos(sph.phi);
      this.camera.position.z = target.z + sph.radius * Math.sin(sph.phi) * Math.cos(sph.theta);
      this.camera.lookAt(target.x, target.y, target.z);
    }
  }

  updateHUD() {
    const esmEl = document.getElementById("telem-esm-fuel");
    const esmBar = document.getElementById("telem-esm-bar");
    if (esmEl) esmEl.innerText = `${GameState.esmFuelReserve.toFixed(1)}%`;
    if (esmBar) esmBar.style.width = `${GameState.esmFuelReserve.toFixed(1)}%`;

    const velEl = document.getElementById("telem-vel") || document.getElementById("telem-velocity");
    const altEl = document.getElementById("telem-alt") || document.getElementById("telem-altitude");
    if (velEl && this.craftVel) {
      const spd = Math.hypot(this.craftVel.vx, this.craftVel.vz) * 4.2;
      velEl.innerText = `${spd.toFixed(2)} km/s`;
    }
    if (altEl && this.earthPos) {
      const distToEarth = Math.hypot(this.craftPos.x, this.craftPos.z) - 65.0;
      altEl.innerText = `${Math.max(0, Math.round(distToEarth * 92))} km (Atmosphere)`;
    }
  }

  renderLoop() {
    if (!this.active) return;
    this.cc.anim3dId = requestAnimationFrame(() => this.renderLoop());

    // Earth & Cloud 3D Parallax Rotations
    if (this.earthMesh) this.earthMesh.rotation.y += 0.0015;
    if (this.cloudMesh) this.cloudMesh.rotation.y += 0.0024;
    if (this.corridorRing) this.corridorRing.rotation.z += 0.004;

    const dt = 0.025;

    if (this.state === 'AIMING') {
      // PREVIEW CAMERAS ACTIVELY IN AIMING STATE!
      this.updateCameraView();
      this.updateHUD();
    } else if (this.state === 'FLYING') {
      this.flightTime += dt;

      // Realistic 10x Time Warp for Thrilling Trans-Earth Transit
      const warp = 10.0;
      const simDt = dt * warp;
      const subSteps = 8;
      const sdt = simDt / subSteps;

      const GM_Earth = 2400.0;
      const GM_Moon = 140.0;

      for (let sub = 0; sub < subSteps; sub++) {
        const posX = this.craftPos.x;
        const posZ = this.craftPos.z;

        const dxE = posX - this.earthPos.x;
        const dzE = posZ - this.earthPos.z;
        const rEarth2 = dxE * dxE + dzE * dzE;
        const rEarth = Math.sqrt(rEarth2);

        const fEarth = -GM_Earth / (rEarth2 + 80);
        let ax = (dxE / rEarth) * fEarth;
        let az = (dzE / rEarth) * fEarth;

        const dxM = posX - this.moonPos.x;
        const dzM = posZ - this.moonPos.z;
        const rMoon2 = dxM * dxM + dzM * dzM;
        const rMoon = Math.sqrt(rMoon2);
        const fMoon = -GM_Moon / (rMoon2 + 40);
        ax += (dxM / rMoon) * fMoon;
        az += (dzM / rMoon) * fMoon;

        this.craftVel.vx += ax * sdt;
        this.craftVel.vz += az * sdt;
        this.craftPos.x += this.craftVel.vx * sdt;
        this.craftPos.z += this.craftVel.vz * sdt;
      }

      this.craftMesh.position.set(this.craftPos.x, 0, this.craftPos.z);
      const angle = Math.atan2(this.craftVel.vz, this.craftVel.vx);
      this.craftMesh.rotation.y = -angle;

      this.updateCameraView();

      const distToEarth = Math.hypot(this.craftPos.x, this.craftPos.z);

      // Check Atmospheric Interface Arrival
            if (distToEarth < this.minDistToEarth) {
        this.minDistToEarth = distToEarth;
      }

      if (distToEarth <= 69.5) {
        // Analytical orbital periapsis calculation at atmospheric boundary
        const vTot = Math.hypot(this.craftVel.vx, this.craftVel.vz);
        const h = Math.abs(this.craftPos.x * this.craftVel.vz - this.craftPos.z * this.craftVel.vx);
        const energy = 0.5 * vTot * vTot - 2400.0 / distToEarth;
        const disc = 2400.0 * 2400.0 + 2.0 * energy * h * h;
        const rp = disc >= 0 ? (h * h) / (2400.0 + Math.sqrt(disc)) : 0;

        if (rp < 65.5) {
          // Reentry Too Steep: Heat Shield Ablation Failure
          this.state = 'FAILED';
          this.stop();
          if (window.Sound) window.Sound.playExplosion();
          this.onFail(
            "REENTRY CORRIDOR VIOLATION: Entry flight path angle was too steep (> 3.5°). Peak deceleration exceeded 14 Gs and caused catastrophic heat shield ablation.",
            "Adjust ejection angle to ~42° and burn power to 2.25 km/s to lock into the green 2.0° skip-entry corridor."
          );
          return;
        } else {
          // Successful Entry into 2.0° Skip-Entry Corridor
          this.state = 'SKIP_ENTRY';
          this.skipPhase = 1;
          this.flightTime = 0.0; // Reset timer for skip sequence
          if (window.Sound) window.Sound.startAlarm();
          this.updateScienceBox("ORION SKIP ENTRY COMMENCED: Atmospheric interface reached at 11 km/s (Mach 32). Plasma sheath glowing at 2,760°C. Orion is pitching up to skip off the upper atmosphere to bleed velocity before final descent.");
        }
      }

      // Check True Miss: Spacecraft has passed Earth without entering corridor
            const vRadial = (this.craftPos.x * this.craftVel.vx + this.craftPos.z * this.craftVel.vz) / Math.max(1, distToEarth);
      const passedEarth = (this.craftPos.x < -80.0 && this.craftVel.vx < 0) || (vRadial > 0.6 && this.craftPos.x < 50.0);
      if (passedEarth && distToEarth > 70.0) {
        this.state = 'FAILED';
        this.stop();
        this.onFail(
          "ATMOSPHERIC SKIP-OFF: Entry trajectory was too shallow (< 1.8°). Orion skipped off the upper exosphere into a permanent heliocentric orbit around the Sun.",
          "Tune ejection angle to 42° and Delta-V burn power to 2.25 km/s to guide Orion into the green corridor."
        );
        return;
      }

      this.updateHUD();
    } else if (this.state === 'SKIP_ENTRY') {
      this.flightTime += dt;

      // 1. Dynamic Plasma Particles
      const plasmaCount = 6;
      for (let p = 0; p < plasmaCount; p++) {
        const pGeo = new THREE.SphereGeometry(1.6 + Math.random() * 1.2, 8, 8);
        const pMat = new THREE.MeshBasicMaterial({
          color: Math.random() > 0.4 ? 0xff4500 : 0x00e5ff,
          transparent: true,
          opacity: 0.85
        });
        const pMesh = new THREE.Mesh(pGeo, pMat);
        pMesh.position.set(
          this.craftPos.x + (Math.random() - 0.5) * 6,
          (Math.random() - 0.5) * 4,
          this.craftPos.z + (Math.random() - 0.5) * 6
        );
        this.plasmaGroup.add(pMesh);
        this.plasmaParticles.push({ mesh: pMesh, life: 0.35 });
      }

      // Smooth Reentry Arc towards Pacific Ocean
      this.craftPos.x += (0 - this.craftPos.x) * dt * 0.45;
      this.craftPos.z += (65.8 - this.craftPos.z) * dt * 0.45;
      this.craftMesh.position.set(this.craftPos.x, 0, this.craftPos.z);

      this.camera.position.set(this.craftPos.x + 35, 25, this.craftPos.z + 45);
      this.camera.lookAt(this.craftPos.x, 0, this.craftPos.z);

      // Phase 2: Parachute Deployment at 4.0s
      if (this.flightTime > 4.0 && this.skipPhase === 1) {
        this.skipPhase = 2;
        if (this.chuteGroup) this.chuteGroup.visible = true;
        if (window.Sound) {
          window.Sound.stopAlarm();
          window.Sound.playVictory();
        }
        this.updateScienceBox("MAIN CHUTES DEPLOYED: Orion drogue chutes pulled the 3 main orange-and-white parachutes at 7,500 ft. Terminal velocity reduced to 25 km/h for splashdown in the Pacific Ocean.");
      }

      // Phase 3: Pacific Ocean Splashdown at 7.5s
      if (this.flightTime > 7.5) {
        this.state = 'SUCCESS';
        this.stop();
        this.onComplete({
          entrySpeed: "10.98 km/s (Mach 32 Skip-Entry)",
          maxDecel: "4.1 Gs (Nominal Skip Profile)",
          splashdownLocation: "Pacific Ocean (Target: 28.5° N, 122.3° W)",
          esmRemaining: `${GameState.esmFuelReserve.toFixed(1)}% Reserve`
        });
      }
    }

    for (let i = this.plasmaParticles.length - 1; i >= 0; i--) {
      const part = this.plasmaParticles[i];
      part.life -= dt;
      part.mesh.scale.multiplyScalar(0.92);
      if (part.life <= 0) {
        this.plasmaGroup.remove(part.mesh);
        this.plasmaParticles.splice(i, 1);
      }
    }

    this.cc.render3d();
  }

  updateScienceBox(text) {
    const box = document.getElementById("hud-science-box") || document.getElementById("hud-science-text");
    if (box) box.innerText = text;
  }
}



// ==========================================
// 10. COMIC BOOK CUTSCENE ENGINE
// ==========================================
class ComicCutscene {
  constructor(onFinish) {
    this.onFinish = onFinish;
    this.currentPanel = 0;
    this.panels = [
      { id: 'ccanvas-1', draw: this.drawPanel1 },
      { id: 'ccanvas-2', draw: this.drawPanel2 },
      { id: 'ccanvas-3', draw: this.drawPanel3 },
      { id: 'ccanvas-4', draw: this.drawPanel4 }
    ];
    this.bindEvents();
  }

  bindEvents() {
    const nextBtn = document.getElementById("btn-next-panel");
    const finishBtn = document.getElementById("btn-finish-mission");

    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        if (window.Sound) window.Sound.playComicAction('whoosh');
        this.revealNextPanel();
      });
    }

    if (finishBtn) {
      finishBtn.addEventListener("click", () => {
        if (window.Sound) window.Sound.playClick(600);
        this.onFinish();
      });
    }
  }

  start() {
    const cutsceneScreen = document.getElementById("screen-cutscene");
    if (cutsceneScreen) cutsceneScreen.style.display = "flex";
    this.currentPanel = 0;

    const nextBtn = document.getElementById("btn-next-panel");
    const finishBtn = document.getElementById("btn-finish-mission");
    if (nextBtn) {
      nextBtn.style.display = "inline-flex";
      nextBtn.innerText = "NEXT PANEL ❯";
    }
    if (finishBtn) {
      finishBtn.style.display = "none";
    }

    for (let i = 1; i <= 4; i++) {
      const p = document.getElementById(`cpanel-${i}`);
      if (p) p.classList.remove('active');
    }

    this.panels.forEach((p) => {
      const canvas = document.getElementById(p.id);
      if (canvas) {
        canvas.width = 540;
        canvas.height = 240;
        const ctx = canvas.getContext("2d");
        p.draw.call(this, ctx, canvas.width, canvas.height);
      }
    });

    this.revealNextPanel();
  }

  revealNextPanel() {
    if (this.currentPanel < 4) {
      this.currentPanel++;
      const panelEl = document.getElementById(`cpanel-${this.currentPanel}`);
      if (panelEl) {
        panelEl.classList.add('active');
        if (window.Sound) window.Sound.playComicAction(this.currentPanel === 2 ? 'whoosh' : 'punch');
      }

      if (this.currentPanel === 4) {
        const nextBtn = document.getElementById("btn-next-panel");
        const finishBtn = document.getElementById("btn-finish-mission");
        if (nextBtn) nextBtn.style.display = "none";
        if (finishBtn) finishBtn.style.display = "inline-flex";
      }
    }
  }

  drawHalftone(ctx, W, H) {
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.18)';
    for (let x = 0; x < W; x += 7) {
      for (let y = 0; y < H; y += 7) {
        ctx.beginPath();
        ctx.arc(x, y, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
  }

  drawPanel1(ctx, W, H) {
    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 40; i++) {
      const sx = (i * 73) % W;
      const sy = (i * 37) % (H * 0.7);
      ctx.fillRect(sx, sy, 1.5, 1.5);
    }

    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.moveTo(0, H);
    ctx.lineTo(0, H - 45);
    ctx.lineTo(90, H - 75);
    ctx.lineTo(180, H - 35);
    ctx.lineTo(310, H - 85);
    ctx.lineTo(420, H - 40);
    ctx.lineTo(W, H - 65);
    ctx.lineTo(W, H);
    ctx.fill();

    ctx.fillStyle = 'rgba(56, 189, 248, 0.4)';
    ctx.beginPath();
    ctx.arc(220, H - 25, 60, 0, Math.PI * 2);
    ctx.fill();

    const cx = W * 0.52;
    const cy = H * 0.45;

    const plumeGrad = ctx.createRadialGradient(cx, cy + 50, 4, cx, cy + 70, 45);
    plumeGrad.addColorStop(0, '#ffffff');
    plumeGrad.addColorStop(0.3, '#38bdf8');
    plumeGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = plumeGrad;
    ctx.beginPath();
    ctx.arc(cx, cy + 60, 40, 0, Math.PI * 2);
    ctx.fill();

    const hullGrad = ctx.createLinearGradient(cx - 14, 0, cx + 14, 0);
    hullGrad.addColorStop(0, '#64748b');
    hullGrad.addColorStop(0.5, '#f8fafc');
    hullGrad.addColorStop(1, '#334155');
    ctx.fillStyle = hullGrad;
    ctx.fillRect(cx - 14, cy - 25, 28, 60);

    ctx.beginPath();
    ctx.moveTo(cx - 14, cy - 25);
    ctx.lineTo(cx, cy - 60);
    ctx.lineTo(cx + 14, cy - 25);
    ctx.fill();

    ctx.fillStyle = '#0284c7';
    ctx.fillRect(cx - 14, cy - 5, 28, 12);

    this.drawHalftone(ctx, W, H);
  }

  drawPanel2(ctx, W, H) {
    ctx.fillStyle = '#030712';
    ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = '#334155';
    ctx.beginPath();
    ctx.arc(W * 0.85, H * 1.2, 180, 0, Math.PI * 2);
    ctx.fill();

    const gx = W * 0.38;
    const gy = H * 0.48;

    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(gx - 35, gy - 12, 70, 24);

    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(gx - 15, gy - 26, 30, 14);

    ctx.fillStyle = '#0369a1';
    ctx.fillRect(gx - 105, gy - 8, 60, 16);
    ctx.fillRect(gx + 45, gy - 8, 60, 16);

    const ox = gx + 115;
    const oy = gy - 18;
    ctx.fillStyle = '#f1f5f9';
    ctx.beginPath();
    ctx.moveTo(ox, oy);
    ctx.lineTo(ox - 22, oy - 10);
    ctx.lineTo(ox - 22, oy + 10);
    ctx.fill();

    ctx.strokeStyle = '#00e5ff';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(ox - 22, oy);
    ctx.lineTo(gx + 35, gy);
    ctx.stroke();
    ctx.setLineDash([]);

    this.drawHalftone(ctx, W, H);
  }

  drawPanel3(ctx, W, H) {
    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, W, H);

    const gradEarth = ctx.createRadialGradient(W * 0.5, H * 2.2, 280, W * 0.5, H * 2.2, 400);
    gradEarth.addColorStop(0, '#0c4a6e');
    gradEarth.addColorStop(0.7, '#0284c7');
    gradEarth.addColorStop(0.85, '#38bdf8');
    gradEarth.addColorStop(1, 'transparent');
    ctx.fillStyle = gradEarth;
    ctx.beginPath();
    ctx.arc(W * 0.5, H * 2.2, 400, 0, Math.PI * 2);
    ctx.fill();

    const px = W * 0.48;
    const py = H * 0.38;

    const fireGrad = ctx.createRadialGradient(px, py, 6, px + 70, py - 40, 90);
    fireGrad.addColorStop(0, '#ffffff');
    fireGrad.addColorStop(0.2, '#f59e0b');
    fireGrad.addColorStop(0.6, '#ef4444');
    fireGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = fireGrad;
    ctx.beginPath();
    ctx.arc(px + 45, py - 20, 75, 0, Math.PI * 2);
    ctx.fill();

    ctx.save();
    ctx.translate(px, py);
    ctx.rotate(0.4);

    ctx.fillStyle = '#f97316';
    ctx.beginPath();
    ctx.ellipse(0, 16, 22, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.moveTo(-18, 14);
    ctx.lineTo(0, -16);
    ctx.lineTo(18, 14);
    ctx.fill();
    ctx.restore();

    this.drawHalftone(ctx, W, H);
  }

  drawPanel4(ctx, W, H) {
    const sunsetGrad = ctx.createLinearGradient(0, 0, 0, H);
    sunsetGrad.addColorStop(0, '#0f172a');
    sunsetGrad.addColorStop(0.4, '#c2410c');
    sunsetGrad.addColorStop(0.7, '#f59e0b');
    sunsetGrad.addColorStop(0.85, '#0284c7');
    sunsetGrad.addColorStop(1, '#075985');
    ctx.fillStyle = sunsetGrad;
    ctx.fillRect(0, 0, W, H);

    const seaY = H * 0.74;
    ctx.fillStyle = '#0369a1';
    ctx.fillRect(0, seaY, W, H - seaY);

    ctx.fillStyle = 'rgba(251, 191, 36, 0.45)';
    ctx.fillRect(W * 0.4, seaY, W * 0.2, H - seaY);

    const chuteY = H * 0.22;
    const chuteColors = ['#f97316', '#ffffff', '#f97316'];
    for (let c = -1; c <= 1; c++) {
      const cx = W * 0.5 + c * 38;
      ctx.fillStyle = chuteColors[c + 1];
      ctx.beginPath();
      ctx.arc(cx, chuteY, 22, Math.PI, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx - 20, chuteY);
      ctx.lineTo(W * 0.5, chuteY + 75);
      ctx.moveTo(cx + 20, chuteY);
      ctx.lineTo(W * 0.5, chuteY + 75);
      ctx.stroke();
    }

    const capX = W * 0.5;
    const capY = chuteY + 78;
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.moveTo(capX - 12, capY + 12);
    ctx.lineTo(capX, capY - 10);
    ctx.lineTo(capX + 12, capY + 12);
    ctx.fill();

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(W * 0.76, seaY - 14, 75, 14);
    ctx.fillRect(W * 0.80, seaY - 26, 24, 12);

    this.drawHalftone(ctx, W, H);
  }
}

// ==========================================
// 11. ARTEMIS IV MASTER FLIGHT COMPUTER
// ==========================================
class ArtemisFlightComputer {
  constructor() {
    this.canvas2d = document.getElementById("canvas2d");
    this.canvas3d = document.getElementById("canvas3d");
    this.ctx2d = this.canvas2d ? this.canvas2d.getContext("2d") : null;

    this.cc = new DualCanvasController(this.canvas2d, this.canvas3d);
    this.parallax = new TerrariaParallaxSky(this.canvas2d, this.ctx2d);

    // Subsystems
    this.lvl1 = new Level1Ascent(
      this.canvas2d,
      this.ctx2d,
      (stats) => this.handleLevelComplete(1, stats),
      (reason, advice) => this.handleLevelFail(reason, advice)
    );

    this.lvl2 = new Level2Slingshot(
      this.cc,
      (stats) => this.handleLevelComplete(2, stats),
      (reason, advice) => this.handleLevelFail(reason, advice)
    );

    this.lvl3 = new Level3Lander(
      this.canvas2d,
      this.ctx2d,
      (stats) => this.handleLevelComplete(3, stats),
      (reason, advice) => this.handleLevelFail(reason, advice)
    );

    this.lvl4 = new Level4Return(
      this.cc,
      (stats) => this.handleLevelComplete(4, stats),
      (reason, advice) => this.handleLevelFail(reason, advice)
    );

    this.cutscene = new ComicCutscene(() => this.finishMissionFinale());

    this.currentBriefPhase = 1;
    this.currentPendingPhase = 1;
    this.lastTime = performance.now();

    this.initDOM();
    this.startMasterLoop();
  }

  // Safe element click binder: accepts string or array of IDs, binds if element exists, never throws!
  bindClick(ids, handler) {
    const list = Array.isArray(ids) ? ids : [ids];
    list.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener("click", handler);
      }
    });
  }

  initDOM() {
    // 1. Play / Initiate Mission
    this.bindClick(["btn-play-mission", "btn-nav-play"], () => {
      if (window.Sound) window.Sound.playClick(600);
      this.showMissionSelect();
    });

    // 2. Return to Main Menu / Launchpad
    this.bindClick(["btn-back-to-menu", "btn-ms-back"], () => {
      if (window.Sound) window.Sound.playClick(400);
      this.navigateToScreen('MENU');
    });

    // 2b. Flight / Mission Directory Navigation
    this.bindClick(["btn-grand-menu", "btn-debrief-menu", "btn-fail-menu"], () => {
      if (window.Sound) window.Sound.playClick(400);
      this.showMissionSelect();
    });

    // 3. Educational Technical Archive
    this.bindClick(["btn-goto-archive", "btn-open-archive-menu", "btn-nav-archive", "btn-grand-archive", "btn-archive-unlocked-banner", "mission-complete-banner"], () => {
      if (window.Sound) window.Sound.playClick(600);
      this.navigateToScreen('ARCHIVE');
    });

    // 4. Mission Credits Modal
    this.bindClick(["btn-credits", "btn-roster-menu", "btn-nav-credits", "btn-grand-credits", "btn-cutscene-credits"], () => {
      if (window.Sound) window.Sound.playClick(500);
      const modal = document.getElementById("modal-credits");
      if (modal) modal.style.display = "flex";
    });

    this.bindClick("btn-close-credits", () => {
      if (window.Sound) window.Sound.playClick(400);
      const modal = document.getElementById("modal-credits");
      if (modal) modal.style.display = "none";
    });

    const modalCredits = document.getElementById("modal-credits");
    if (modalCredits) {
      modalCredits.addEventListener("click", (e) => {
        if (e.target === modalCredits) {
          if (window.Sound) window.Sound.playClick(400);
          modalCredits.style.display = "none";
        }
      });
    }

    window.addEventListener("keydown", (e) => {
      if (e.code === 'Escape') {
        const modal = document.getElementById("modal-credits");
        if (modal && modal.style.display === "flex") {
          if (window.Sound) window.Sound.playClick(400);
          modal.style.display = "none";
        }
      }
    });

    // 5. Sound Engine Toggle
    this.bindClick("btn-audio-toggle", () => {
      if (window.Sound) {
        const enabled = window.Sound.toggle();
        const btn = document.getElementById("btn-audio-toggle");
        if (btn) {
          btn.innerText = enabled ? "🔊 AUDIO: ON" : "🔇 AUDIO: MUTED";
          btn.style.borderColor = enabled ? "var(--cyan-glow)" : "rgba(255,255,255,0.2)";
        }
      }
    });

    // 6. Pre-Level Briefing Controls
    this.bindClick(["btn-launch-level", "btn-initiate-launch", "btn-briefing-launch"], () => {
      if (window.Sound) window.Sound.playClick(750);
      const modal = document.getElementById("modal-briefing");
      if (modal) modal.style.display = "none";
      this.launchLevel(this.currentPendingPhase);
    });

    this.bindClick(["btn-cancel-briefing", "btn-close-briefing", "btn-briefing-cancel"], () => {
      if (window.Sound) window.Sound.playClick(400);
      const modal = document.getElementById("modal-briefing");
      if (modal) modal.style.display = "none";
    });

    // 7. Post-Level Debrief Controls
    this.bindClick(["btn-continue-phase", "btn-debrief-next"], () => {
      if (window.Sound) window.Sound.playClick(600);
      const modal = document.getElementById("modal-debrief");
      if (modal) modal.style.display = "none";

      if (this.currentBriefPhase === 4 || this.completedPhase === 4) {
        this.navigateToScreen('CUTSCENE');
      } else {
        this.openBriefing(this.currentBriefPhase + 1);
      }
    });

    // 8. Failure Modal Controls
    this.bindClick(["btn-retry-phase", "btn-fail-retry"], () => {
      if (window.Sound) window.Sound.playClick(500);
      const modal = document.getElementById("modal-fail");
      if (modal) modal.style.display = "none";
      this.launchLevel(this.currentPendingPhase);
    });

    // 9. HUD Collapsible Toggle
    this.bindClick("btn-hud-toggle", () => {
      const panel = document.getElementById("hud-panel");
      const btn = document.getElementById("btn-hud-toggle");
      if (panel) {
        panel.classList.toggle("collapsed");
        if (btn) btn.innerText = panel.classList.contains("collapsed") ? "◀" : "▶";
      }
    });
  }

  navigateToScreen(screen) {
    GameState.currentScreen = screen;

    // Stop active levels cleanly
    this.lvl1.stop();
    this.lvl2.stop();
    this.lvl3.stop();
    this.lvl4.stop();

    const slider = document.getElementById("viewport-slider");
    const mainMenu = document.getElementById("main-menu");
    const msScreen = document.getElementById("screen-mission-select");
    const hud = document.getElementById("gameplay-hud");
    const cutsceneScreen = document.getElementById("screen-cutscene");
    const archiveBtn = document.getElementById("btn-goto-archive") || document.getElementById("btn-nav-archive");

    // Hide modals
    const modalBrief = document.getElementById("modal-briefing");
    if (modalBrief) modalBrief.style.display = "none";
    const modalDebrief = document.getElementById("modal-debrief");
    if (modalDebrief) modalDebrief.style.display = "none";
    const failModal = document.getElementById("modal-fail");
    if (failModal) failModal.style.display = "none";
    const grandModal = document.getElementById("modal-grand-victory");
    if (grandModal) grandModal.style.display = "none";
    const modalCredits = document.getElementById("modal-credits");
    if (modalCredits) modalCredits.style.display = "none";
    const banner = document.getElementById("mission-complete-banner");
    if (banner && screen !== 'MENU') banner.style.display = "none";

    // Manage Right Arrow Archive Button (visible on MENU only)
    if (archiveBtn) {
      archiveBtn.style.display = (screen === 'MENU') ? 'flex' : 'none';
    }

    if (screen === 'MENU') {
      if (slider) slider.style.transform = "translateX(0)";
      if (mainMenu) mainMenu.style.display = "flex";
      if (msScreen) msScreen.style.display = "none";
      if (hud) hud.style.display = "none";
      if (cutsceneScreen) cutsceneScreen.style.display = "none";
      this.cc.switchMode('2D');
    } else if (screen === 'ARCHIVE') {
      if (slider) slider.style.transform = "translateX(-100vw)";
      if (window.Archive) window.Archive.renderArchiveScreen();
    } else if (screen === 'LEVEL_SELECT') {
      if (slider) slider.style.transform = "translateX(0)";
      if (mainMenu) mainMenu.style.display = "none";
      if (msScreen) msScreen.style.display = "flex";
      if (hud) hud.style.display = "none";
      if (cutsceneScreen) cutsceneScreen.style.display = "none";
      this.renderMissionCards();
      this.cc.switchMode('2D');
    } else if (screen === 'CUTSCENE') {
      if (slider) slider.style.transform = "translateX(0)";
      if (mainMenu) mainMenu.style.display = "none";
      if (msScreen) msScreen.style.display = "none";
      if (hud) hud.style.display = "none";
      this.cc.switchMode('2D');
      this.cutscene.start();
    }
  }

  showMissionSelect() {
    this.navigateToScreen('LEVEL_SELECT');
  }

  renderMissionCards() {
    const grid = document.getElementById("ms-cards-grid");
    if (!grid) return;

    const cardsData = [
      {
        phase: 1,
        title: "LIFTOFF & ASCENT",
        subtitle: "SLS Block 1B Pad 39B Launch",
        desc: "Pilot the 8.8-million-lb thrust rocket through Max-Q. Time booster jettison and ignite the Exploration Upper Stage into parking orbit.",
        mode: "2D VERTICAL ASCENT"
      },
      {
        phase: 2,
        title: "TRANS-LUNAR INJECTION",
        subtitle: "Cislunar Transit & Gateway NRHO",
        desc: "Calculate the orbital escape burn using the Oberth effect. Slingshot Orion and I-Hab into the 3D Lunar Gateway docking halo.",
        mode: "3D WEBGL ASTRODYNAMICS"
      },
      {
        phase: 3,
        title: "SHACKLETON TOUCHDOWN",
        subtitle: "Lunar South Pole Ice Exploration",
        desc: "Guide the Starship Human Landing System through 1/6th gravity down onto the permanently shadowed crater terrain to sample water ice.",
        mode: "2D RETRO-PROPULSION LANDER"
      },
      {
        phase: 4,
        title: "TRANS-EARTH SKIP ENTRY",
        subtitle: "Lunar Departure & Atmospheric Skip",
        desc: "Execute Trans-Earth Injection burn. Target the 2.0° atmospheric skip-entry corridor to bleed 11 km/s hypervelocity before Pacific splashdown.",
        mode: "3D WEBGL EARTH RETURN"
      }
    ];

    grid.innerHTML = cardsData.map(c => {
      const isLocked = c.phase > GameState.unlockedLevels;
      return `
        <div class="mission-card ${isLocked ? 'locked' : 'interactive'}" data-phase="${c.phase}">
          <div class="mc-phase-badge">PHASE ${c.phase} // ${c.mode}</div>
          <h4 class="mc-title">${c.title}</h4>
          <div class="mc-subtitle">${c.subtitle}</div>
          <p class="mc-desc">${c.desc}</p>
          <div class="mc-status-row">
            ${isLocked
              ? `<span class="mc-locked-tag">🔒 LOCKED</span>`
              : `<button class="mc-launch-btn">PLAN FLIGHT ➔</button>`
            }
          </div>
        </div>
      `;
    }).join('');

    const cards = grid.querySelectorAll(".mission-card:not(.locked)");
    cards.forEach(card => {
      card.addEventListener("click", () => {
        const ph = parseInt(card.getAttribute("data-phase"));
        if (ph) {
          if (window.Sound) window.Sound.playClick(500);
          this.openBriefing(ph);
        }
      });
    });
  }

  openBriefing(phase) {
    this.currentBriefPhase = phase;
    this.currentPendingPhase = phase;

    const modal = document.getElementById("modal-briefing");
    const tag = document.getElementById("brief-phase-tag");
    const title = document.getElementById("brief-title");
    const objText = document.getElementById("brief-objective");
    const ctrlText = document.getElementById("brief-controls");

    if (modal) modal.style.display = "flex";
    if (tag) tag.innerText = `NASA DIRECTIVE // FLIGHT PLAN ${phase}`;

    const briefings = {
      1: {
        title: "PHASE 1: LIFTOFF & STAGE SEPARATION",
        obj: "Launch SLS Block 1B from Launch Complex 39B. Throttle through Max-Q (12-20 km), execute Solid Rocket Booster jettison at burnout, jettison the Core Stage, and ignite the Exploration Upper Stage to reach a 200 km circular parking orbit at 7.5+ km/s.",
        ctrl: "HOLD [SPACE] / [W] to ignite rocket engines. HOLD [T] to ease throttle to 75% during Max-Q. Press [S] to jettison SRBs when timer displays. Press [C] to jettison Core Stage."
      },
      2: {
        title: "PHASE 2: CISLUNAR TRANSIT & GATEWAY DOCKING",
        obj: "Calculate the orbital escape burn using the Oberth effect. Slingshot Orion and the European I-Hab module across 384,400 km of cislunar space into Near-Rectilinear Halo Orbit (NRHO) around the Moon.",
        ctrl: "DRAG SLIDERS to set Burn Angle (240°) and Delta-V (1.80 km/s). Press [SPACE] or click 'EXECUTE TLI BURN'. Use [W/S/A/D] for mid-course RCS attitude pulses. Clear Moon (>22.0) into capture halo [26, 50]."
      },
      3: {
        title: "PHASE 3: SHACKLETON CRATER TOUCHDOWN",
        obj: "Pilot the Starship Human Landing System through 1/6th lunar gravity down onto Shackleton Crater rim at the Lunar South Pole. Manage descent velocity to touch down under 2.5 m/s with less than 6° tilt.",
        ctrl: "HOLD [SPACE] / [W] for main descent thrusters. Use [A] and [D] for radial RCS attitude thrusters. Explore across 4 designated landing sites (Alpha, Beta, Gamma, Delta)."
      },
      4: {
        title: "PHASE 4: TRANS-EARTH INJECTION & SKIP ENTRY",
        obj: "Ignite Orion's European Service Module to escape lunar gravity. Calculate entry angle to enter Earth's atmosphere at a precise 2.0° flight path angle, executing a skip-entry maneuver to safely bleed 11 km/s hypervelocity before Pacific splashdown.",
        ctrl: "SET Burn Angle (~42°) and Burn Power (2.25 km/s). Press [SPACE] to ignite Orion TEI. Use [W/S/A/D] for RCS trims into the green 2.0° skip-entry corridor."
      }
    };

    const b = briefings[phase];
    if (b) {
      if (title) title.innerText = b.title;
      if (objText) objText.innerText = b.obj;
      if (ctrlText) ctrlText.innerText = b.ctrl;
    }
  }

  launchLevel(phase) {
    this.currentPendingPhase = phase;
    this.currentBriefPhase = phase;

    const mainMenu = document.getElementById("main-menu");
    const msScreen = document.getElementById("screen-mission-select");
    const hud = document.getElementById("gameplay-hud");
    const cutsceneScreen = document.getElementById("screen-cutscene");
    const archiveBtn = document.getElementById("btn-goto-archive");
    const banner = document.getElementById("mission-complete-banner");

    if (mainMenu) mainMenu.style.display = "none";
    if (msScreen) msScreen.style.display = "none";
    if (cutsceneScreen) cutsceneScreen.style.display = "none";
    if (archiveBtn) archiveBtn.style.display = "none";
    if (banner) banner.style.display = "none";
    if (hud) hud.style.display = "block";

    const phaseTag = document.getElementById("hud-phase-label");
    if (phaseTag) phaseTag.innerText = `PHASE ${phase}`;

    if (phase === 1) {
      GameState.currentScreen = 'LEVEL_1';
      this.cc.switchMode('2D');
      this.lvl1.start();
    } else if (phase === 2) {
      GameState.currentScreen = 'LEVEL_2';
      this.cc.switchMode('3D');
      this.lvl2.start();
    } else if (phase === 3) {
      GameState.currentScreen = 'LEVEL_3';
      this.cc.switchMode('2D');
      this.lvl3.start();
    } else if (phase === 4) {
      GameState.currentScreen = 'LEVEL_4';
      this.cc.switchMode('3D');
      this.lvl4.start();
    }
  }

  handleLevelComplete(phase, stats) {
    GameState.unlockedLevels = Math.max(GameState.unlockedLevels, phase + 1);
    this.currentBriefPhase = phase;
    this.completedPhase = phase;

    const modal = document.getElementById("modal-debrief");
    const titleEl = document.getElementById("debrief-title");
    const grid = document.getElementById("debrief-stats");
    const realBox = document.getElementById("debrief-science");
    const nextBtn = document.getElementById("btn-continue-phase");

    if (modal) modal.style.display = "flex";
    if (titleEl) titleEl.innerText = `PHASE ${phase} OBJECTIVE COMPLETE`;

    if (grid && stats) {
      grid.innerHTML = Object.entries(stats).map(([k, v]) => `
        <div class="debrief-stat-row">
          <span class="debrief-stat-label">${k}:</span>
          <span class="debrief-stat-val">${v}</span>
        </div>
      `).join('');
    }

    const realExplanations = {
      1: "Real NASA Artemis IV Telemetry: SLS Block 1B achieves orbit via 4 RS-25 core engines (2.0 million lbs thrust) and twin 5-segment SRBs (7.2 million lbs thrust), handing over to the RL10C-3 Exploration Upper Stage at 88 km to circularize at 200 km.",
      2: "Real NASA Cislunar Astrodynamics: Orion and I-Hab utilize a powered lunar swingby and the Oberth effect to enter the Near-Rectilinear Halo Orbit (NRHO), a stable 7-day resonance orbit passing 3,000 km over the lunar North Pole and 70,000 km over the South Pole.",
      3: "Real NASA South Pole Landing: SpaceX Starship HLS performs a terminal pitch maneuver using Raptor engines throttled to pinpoint touchdown on the rim of Shackleton Crater, where water-ice deposits exist in permanently shadowed regions at -246°C.",
      4: "Real NASA Skip Entry Aerodynamics: Orion approaches Earth at 11 km/s (Mach 32). It enters the upper atmosphere at 122 km, skips back out into space to bleed velocity, and executes a second gentle reentry, reducing peak deceleration from 12 Gs to just 4 Gs."
    };

    if (realBox) realBox.innerText = realExplanations[phase] || "";

    if (nextBtn) {
      if (phase === 4) {
        nextBtn.innerText = "INITIATE EARTH RETURN CUTSCENE ▶";
      } else {
        nextBtn.innerText = `PROCEED TO PHASE ${phase + 1} ➔`;
      }
    }
  }

  handleLevelFail(reason, advice = "Adjust throttle and trajectory parameters according to flight controllers.") {
    const modal = document.getElementById("modal-fail");
    const reasonEl = document.getElementById("fail-reason");
    const adviceEl = document.getElementById("fail-advice");
    if (modal && reasonEl) {
      modal.style.display = "flex";
      reasonEl.innerText = reason;
      if (adviceEl) adviceEl.innerText = advice;
    } else {
      this.showMissionSelect();
    }
  }

  finishMissionFinale() {
    GameState.archiveUnlocked = true;
    const cutsceneScreen = document.getElementById("screen-cutscene");
    if (cutsceneScreen) cutsceneScreen.style.display = "none";
    const hud = document.getElementById("gameplay-hud");
    if (hud) hud.style.display = "none";

    const grandModal = document.getElementById("modal-grand-victory");
    if (grandModal) grandModal.style.display = "flex";

    const banner = document.getElementById("mission-complete-banner");
    if (banner) banner.style.display = "flex";

    if (window.Sound) window.Sound.playVictory();
  }

  startMasterLoop() {
    const loop = (now) => {
      const dt = Math.min(0.1, (now - this.lastTime) * 0.001);
      this.lastTime = now;

      if (this.cc.activeMode === '2D') {
        if (GameState.currentScreen === 'MENU' || GameState.currentScreen === 'LEVEL_SELECT') {
          this.parallax.updateAndRender();
        } else if (GameState.currentScreen === 'LEVEL_1') {
          this.lvl1.update(dt);
          this.lvl1.render();
        } else if (GameState.currentScreen === 'LEVEL_3') {
          this.lvl3.update(dt);
          this.lvl3.render();
        }
      }

      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }
}

// Global Launch
window.addEventListener("DOMContentLoaded", () => {
  window.navigateToScreen = (scr) => window.FlightComputer.navigateToScreen(scr);
  window.FlightComputer = new ArtemisFlightComputer();
});
