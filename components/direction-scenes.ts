import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { feature } from 'topojson-client';
import landData from 'world-atlas/land-110m.json';
import { directionArtwork, type FutureDirection } from '@/lib/future-directions';

function spherePoint(lon: number, lat: number, radius: number) {
  const longitude = THREE.MathUtils.degToRad(lon);
  const latitude = THREE.MathUtils.degToRad(lat);
  return new THREE.Vector3(
    radius * Math.cos(latitude) * Math.sin(longitude),
    radius * Math.sin(latitude),
    radius * Math.cos(latitude) * Math.cos(longitude),
  );
}

type Coastline = [number, number][];
type Land = { geometry: { coordinates: Coastline[][] } };

const coordinates = [[-99, 39], [10, 51], [139, 36]] as const;

function radar() {
  const globe = new THREE.Group();
  const sea = new THREE.Mesh(
    new THREE.SphereGeometry(1.16, 48, 32),
    new THREE.MeshStandardMaterial({ color: '#176062', metalness: 0.32, roughness: 0.53, emissive: '#0b292b', emissiveIntensity: 0.45 }),
  );
  globe.add(sea);

  const grid = new THREE.LineBasicMaterial({ color: '#74c1b7', transparent: true, opacity: 0.36 });
  for (const lat of [-60, -30, 0, 30, 60]) {
    const points = Array.from({ length: 73 }, (_, i) => spherePoint(i * 5 - 180, lat, 1.164));
    globe.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), grid));
  }
  for (let lon = -150; lon <= 180; lon += 30) {
    const points = Array.from({ length: 37 }, (_, i) => spherePoint(lon, i * 5 - 90, 1.164));
    globe.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), grid));
  }

  const coast = feature(landData as never, landData.objects.land as never) as unknown as Land | { features: Land[] };
  const land = 'features' in coast ? coast.features : [coast];
  const shore = new THREE.LineBasicMaterial({ color: '#8fc8b7' });
  const coastlineSegments = land.flatMap(({ geometry }) => geometry.coordinates).flatMap((polygon) =>
    polygon.flatMap((ring) => ring.slice(1).flatMap(([lon, lat], i) => [
      spherePoint(...ring[i], 1.172),
      spherePoint(lon, lat, 1.172),
    ])),
  );
  globe.add(new THREE.LineSegments(
    new THREE.BufferGeometry().setFromPoints(coastlineSegments),
    shore,
  ));

  for (const [lon, lat] of coordinates) {
    const center = spherePoint(lon, lat, 1.18);
    const marker = new THREE.Mesh(
      new THREE.SphereGeometry(0.041, 16, 12),
      new THREE.MeshBasicMaterial({ color: '#eaffbb' }),
    );
    marker.position.copy(center);
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(0.067, 0.08, 24),
      new THREE.MeshBasicMaterial({ color: '#bdff99', side: THREE.DoubleSide }),
    );
    ring.position.copy(spherePoint(lon, lat, 1.2));
    ring.lookAt(spherePoint(lon, lat, 2));
    globe.add(ring, marker);
  }
  const atmosphere = new THREE.Mesh(
    new THREE.SphereGeometry(1.179, 48, 32),
    new THREE.MeshBasicMaterial({ color: '#88dfb9', side: THREE.BackSide }),
  );
  globe.add(atmosphere);
  return globe;
}

type Position = readonly [number, number, number];
type Pose = { position: Position; rotation: Position; scale?: number };
type Exhibit = { items: THREE.Object3D[]; layout: (chapter: number) => Pose[] };

function globeExhibit(): Exhibit {
  const globe = radar();
  const orbital = new THREE.Group();
  const line = new THREE.LineBasicMaterial({ color: '#92e2be', transparent: true, opacity: 0.48 });
  for (const radius of [1.42, 1.55]) {
    const points = Array.from({ length: 96 }, (_, index) => {
      const angle = index * Math.PI / 48;
      return new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
    });
    orbital.add(new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(points), line));
  }
  return {
    items: [globe, orbital],
    layout(chapter) {
      const [lon, lat] = chapter ? coordinates[chapter - 1] : [-19, 22];
      return [
        { position: [0, 0.04, 0], rotation: [THREE.MathUtils.degToRad(lat * 0.75), THREE.MathUtils.degToRad(-lon), 0], scale: chapter ? 1.08 : 1 },
        { position: [0, 0, 0], rotation: [0.29 + chapter * 0.07, 0, -0.34 + chapter * 0.12] },
      ];
    },
  };
}

function taskTexture(topic: string, title: string, detail: string) {
  const card = document.createElement('canvas');
  card.width = 760;
  card.height = 440;
  const ctx = card.getContext('2d');
  if (!ctx) return null;

  ctx.fillStyle = '#fbefe2';
  ctx.beginPath();
  ctx.roundRect(0, 0, card.width, card.height, 26);
  ctx.fill();
  ctx.strokeStyle = '#e4c6ad';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(42, 92);
  ctx.lineTo(718, 92);
  ctx.stroke();
  ctx.fillStyle = '#985637';
  ctx.font = '600 23px Arial';
  ctx.fillText(topic, 43, 64);
  ctx.fillStyle = '#342925';
  ctx.font = '700 48px Arial';
  ctx.fillText(title, 42, 174, 676);
  ctx.fillStyle = '#68483b';
  ctx.font = '400 27px Arial';
  ctx.fillText(detail, 42, 235, 675);

  ctx.strokeStyle = '#d6af93';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(43, 308, 674, 76, 12);
  ctx.stroke();
  ctx.fillStyle = '#7e4b36';
  ctx.font = '600 23px Arial';
  ctx.fillText('LISTING REVIEW', 65, 353);
  const texture = new THREE.CanvasTexture(card);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function displayPanel(width: number, height: number, texture: THREE.Texture | null, color: string) {
  const panel = new THREE.Group();
  const back = new THREE.Mesh(
    new RoundedBoxGeometry(width + 0.085, height + 0.085, 0.083, 3, 0.035),
    new THREE.MeshStandardMaterial({ color, metalness: 0.34, roughness: 0.44 }),
  );
  const screen = new THREE.Mesh(
    new THREE.PlaneGeometry(width, height),
    new THREE.MeshBasicMaterial({ map: texture, transparent: true, alphaTest: 0.45 }),
  );
  screen.position.z = 0.046;
  panel.add(back, screen);
  return panel;
}

function growthExhibit(): Exhibit {
  const scale = new THREE.Group();
  const shell = new THREE.Mesh(
    new RoundedBoxGeometry(1.54, 0.20, 1.35, 4, 0.08),
    new THREE.MeshStandardMaterial({ color: '#b1a294', metalness: 0.57, roughness: 0.39 }),
  );
  const deck = new THREE.Mesh(
    new RoundedBoxGeometry(1.47, 0.075, 1.27, 4, 0.033),
    new THREE.MeshStandardMaterial({ color: '#d7c6b1', metalness: 0.62, roughness: 0.43 }),
  );
  deck.position.y = 0.115;
  const readout = new THREE.Mesh(
    new RoundedBoxGeometry(0.57, 0.022, 0.24, 3, 0.02),
    new THREE.MeshStandardMaterial({ color: '#1d2927', emissive: '#264331', emissiveIntensity: 0.25 }),
  );
  readout.position.set(0, 0.16, 0.43);
  const dial = new THREE.Mesh(new THREE.CylinderGeometry(0.078, 0.078, 0.022, 24), new THREE.MeshStandardMaterial({ color: '#433935' }));
  dial.position.set(0.48, 0.162, 0.43);
  const dialLeft = dial.clone();
  dialLeft.position.x *= -1;
  scale.add(shell, deck, readout, dial, dialLeft);

  const cards = [
    ['PRODUCT DIMENSIONS', 'Show the scale’s dimensions', 'Add a dimension callout to the gallery.'],
    ['BATTERY REQUIREMENTS', 'Clarify what is included', 'Answer the power and battery question.'],
    ['PRODUCT DEMO', 'Show the display in use', 'Add an image taken during weighing.'],
  ] as const;
  return {
    items: [
      scale,
      ...cards.map(([topic, title, detail]) => displayPanel(1.95, 1.12, taskTexture(topic, title, detail), '#6b4a3e')),
    ],
    layout(chapter) {
      return [
        { position: [chapter ? -0.72 : -0.57, -0.59, 0.42], rotation: [0.62, -0.34 + chapter * 0.24, 0.13], scale: chapter ? 0.85 : 1.12 },
        ...cards.map((_, index): Pose => {
          if (chapter === index + 1) return { position: [0.39, 0.32, 0.85], rotation: [-0.12, -0.13, 0.035], scale: 1.13 };
          return { position: [0.25 + index * 0.25, 0.62 - index * 0.21, -0.14 - index * 0.24], rotation: [-0.08, -0.36, 0.08], scale: chapter ? 0.76 : 0.92 };
        }),
      ];
    },
  };
}

function creativeExhibit(render: () => void, unavailable: () => void): Exhibit {
  const loader = new THREE.TextureLoader();
  const formats = [[1.27, 1.27], [1.78, 1.0], [0.88, 1.55]] as const;
  const overview = [
    { position: [-0.19, -0.12, 0.57], rotation: [0.04, -0.17, 0.035] },
    { position: [-0.92, 0.24, -0.22], rotation: [0.03, 0.4, -0.12] },
    { position: [0.93, 0.17, 0.01], rotation: [-0.04, -0.35, 0.08] },
  ] as const;
  return {
    items: formats.map(([width, height], index) => {
      const texture = loader.load(directionArtwork[index], render, undefined, unavailable);
      texture.colorSpace = THREE.SRGBColorSpace;
      return displayPanel(width, height, texture, '#9f8ccc');
    }),
    layout(chapter) {
      if (!chapter) return [...overview];
      return formats.map((_, index): Pose => {
        if (chapter === index + 1) return { position: [0.02, 0.11, 0.65], rotation: [-0.06, -0.14, 0.02], scale: 1.36 };
        const side = index < chapter - 1 ? -1 : 1;
        return { position: [side * (0.86 + index * 0.16), 0.12 - index * 0.07, -0.79], rotation: [0.03, 0.47 * side, -0.08 * side], scale: 0.8 };
      });
    },
  };
}

const palettes = {
  radar: { line: '#66bca6', floor: '#17343a', light: '#d5fff0' },
  growth: { line: '#df9e76', floor: '#432b26', light: '#ffe3c9' },
  creative: { line: '#ab9de4', floor: '#302846', light: '#eadbff' },
};

function platform(kind: FutureDirection) {
  const palette = palettes[kind];
  const stand = new THREE.Group();
  const floor = new THREE.Mesh(
    new THREE.CylinderGeometry(2.26, 2.18, 0.09, 96),
    new THREE.MeshStandardMaterial({ color: palette.floor, metalness: 0.56, roughness: 0.62 }),
  );
  floor.position.y = -0.079;
  stand.add(floor);
  for (const [radius, opacity] of [[1.15, 0.2], [1.58, 0.33], [2.02, 0.37], [2.26, 0.62], [2.46, 0.23]]) {
    const points = Array.from({ length: 96 }, (_, i) => {
      const angle = i * Math.PI / 48;
      return new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
    });
    stand.add(new THREE.LineLoop(
      new THREE.BufferGeometry().setFromPoints(points),
      new THREE.LineBasicMaterial({ color: palette.line, transparent: true, opacity }),
    ));
  }
  const ticks = [];
  for (let i = 0; i < 96; i++) {
    const theta = i * Math.PI / 48;
    const x = Math.cos(theta);
    const z = Math.sin(theta);
    const radius = i % 8 === 0 ? 2.04 : 2.15;
    ticks.push(new THREE.Vector3(x * 2.21, 0, z * 2.21), new THREE.Vector3(x * radius, 0, z * radius));
  }
  stand.add(new THREE.LineSegments(
    new THREE.BufferGeometry().setFromPoints(ticks),
    new THREE.LineBasicMaterial({ color: palette.line, opacity: 0.48, transparent: true }),
  ));
  stand.position.set(0, -1.28, 0);
  stand.rotation.x = 0.28;
  return stand;
}

export function mountDirectionScene(kind: FutureDirection, canvas: HTMLCanvasElement, unavailable: () => void) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.65));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 25);
  camera.position.z = 7.8;
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const narrow = window.matchMedia('(max-width: 850px)');
  const light = palettes[kind].light;
  scene.add(new THREE.HemisphereLight(light, '#3a3345', 1.9));
  const key = new THREE.DirectionalLight(light, 2.35);
  key.position.set(-2, 4, 5);
  scene.add(key);

  const stage = new THREE.Group();
  const turntable = new THREE.Group();
  stage.add(platform(kind), turntable);
  scene.add(stage);

  let frame = 0;
  let disposed = false;
  let chapter = -1;
  let transitionStart = 0;
  let poses: Pose[] = [];
  let initial: Pose[] = [];
  const duration = 630;

  function draw(time: number) {
    frame = 0;
    if (disposed) return;
    if (transitionStart) {
      const amount = 1 - (1 - Math.min((time - transitionStart) / duration, 1)) ** 3;
      apply(amount);
      if (amount < 1 && !motion.matches) render();
      else {
        apply(1);
        transitionStart = 0;
      }
    }
    renderer.render(scene, camera);
  }

  function render() {
    if (!disposed && !frame) frame = window.requestAnimationFrame(draw);
  }

  const exhibit = kind === 'radar' ? globeExhibit() : kind === 'growth' ? growthExhibit() : creativeExhibit(render, unavailable);
  turntable.add(...exhibit.items);

  function apply(amount: number) {
    exhibit.items.forEach((item, index) => {
      const from = initial[index];
      const to = poses[index];
      const lerp = THREE.MathUtils.lerp;
      item.position.set(...to.position.map((value, axis) => lerp(from.position[axis], value, amount)) as [number, number, number]);
      item.rotation.set(...to.rotation.map((value, axis) => lerp(from.rotation[axis], value, amount)) as [number, number, number]);
      item.scale.setScalar(lerp(from.scale ?? 1, to.scale ?? 1, amount));
    });
  }

  function setChapter(next: number) {
    if (next === chapter) return;
    const animate = chapter >= 0 && !motion.matches;
    chapter = next;
    turntable.rotation.set(0, 0, 0);
    poses = exhibit.layout(next);
    initial = animate ? exhibit.items.map((item) => ({
      position: [item.position.x, item.position.y, item.position.z],
      rotation: [item.rotation.x, item.rotation.y, item.rotation.z],
      scale: item.scale.x,
    })) : poses;
    transitionStart = animate ? performance.now() : 0;
    if (!animate) apply(1);
    render();
  }

  const resize = new ResizeObserver(() => {
    const { clientWidth: width, clientHeight: height } = canvas;
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    const worldHeight = 2 * camera.position.z * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    const worldWidth = worldHeight * camera.aspect;
    stage.position.set(narrow.matches ? 0 : worldWidth * 0.224, narrow.matches ? worldHeight * 0.255 : worldHeight * 0.052, 0);
    stage.scale.setScalar(narrow.matches ? Math.min(0.84, camera.aspect * 1.41) : Math.min(1.14, camera.aspect * 0.69));
    camera.updateProjectionMatrix();
    render();
  });
  resize.observe(canvas);
  canvas.addEventListener('webglcontextlost', unavailable);
  setChapter(0);

  return {
    setChapter,
    rotate(yaw: number, pitch = 0) {
      turntable.rotation.y += yaw;
      turntable.rotation.x = THREE.MathUtils.clamp(turntable.rotation.x + pitch, -0.45, 0.45);
      render();
    },
    reset() {
      turntable.rotation.set(0, 0, 0);
      render();
    },
    dispose() {
      disposed = true;
      if (frame) window.cancelAnimationFrame(frame);
      resize.disconnect();
      canvas.removeEventListener('webglcontextlost', unavailable);
      const geometries = new Set<THREE.BufferGeometry>();
      const materials = new Set<THREE.Material>();
      scene.traverse((node) => {
        if (node instanceof THREE.Mesh || node instanceof THREE.Line) {
          geometries.add(node.geometry);
          for (const material of Array.isArray(node.material) ? node.material : [node.material]) materials.add(material);
        }
      });
      for (const geometry of geometries) geometry.dispose();
      for (const material of materials) {
        if (material instanceof THREE.MeshBasicMaterial) material.map?.dispose();
        material.dispose();
      }
      renderer.dispose();
    },
  };
}
