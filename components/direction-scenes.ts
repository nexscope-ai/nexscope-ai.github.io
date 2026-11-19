import * as THREE from 'three';
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

function radar() {
  const globe = new THREE.Group();
  const sea = new THREE.Mesh(
    new THREE.SphereGeometry(1.16, 48, 32),
    new THREE.MeshStandardMaterial({ color: '#153243', roughness: 0.82 }),
  );
  globe.add(sea);

  const grid = new THREE.LineBasicMaterial({ color: '#416c76', transparent: true, opacity: 0.47 });
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

  for (const [lon, lat] of [[-99, 39], [10, 51], [139, 36]]) {
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
  globe.rotation.y = 0.32;
  return globe;
}

function taskCardTexture(title: string, action: string, accent: string) {
  const card = document.createElement('canvas');
  card.width = 700;
  card.height = 360;
  const ctx = card.getContext('2d');
  if (!ctx) return null;

  ctx.beginPath();
  ctx.roundRect(2, 2, 696, 356, 27);
  ctx.fillStyle = '#fff9f1';
  ctx.fill();
  ctx.strokeStyle = '#e7cfc3';
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.fillStyle = accent;
  ctx.fillRect(34, 40, 12, 50);
  ctx.font = '600 28px Arial';
  ctx.fillText(title, 61, 74);
  ctx.fillStyle = '#2d1b24';
  ctx.font = '700 43px Arial';
  ctx.fillText(action, 36, 162, 618);
  ctx.fillStyle = '#e5cfc6';
  ctx.fillRect(37, 221, 561, 8);
  ctx.fillRect(37, 254, 452, 8);
  ctx.fillRect(37, 287, 494, 8);

  const texture = new THREE.CanvasTexture(card);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function growth() {
  const group = new THREE.Group();
  const cards = [
    ['01  PRODUCT DIMENSIONS', 'Show how much space it takes', '#9c4836'],
    ['02  BATTERY REQUIREMENTS', 'Explain what is included', '#85527f'],
    ['03  PRODUCT DEMO', 'Show the display in use', '#486a67'],
  ] as const;
  cards.forEach(([title, body, accent], index) => {
    const card = new THREE.Mesh(
      new THREE.PlaneGeometry(2.22, 1.14),
      new THREE.MeshBasicMaterial({
        map: taskCardTexture(title, body, accent),
        transparent: true,
        alphaTest: 0.4,
        side: THREE.DoubleSide,
      }),
    );
    card.position.set(index * 0.2 - 0.15, index * -0.47 + 0.46, (2 - index) * 0.22);
    group.add(card);
  });
  group.rotation.set(-0.18, -0.28, 0.05);
  return group;
}

function creative(render: () => void, unavailable: () => void) {
  const group = new THREE.Group();
  const loader = new THREE.TextureLoader();
  const cards = [
    { width: 0.96, height: 0.96, x: 0, y: -0.03, z: 0.47, angle: 0 },
    { width: 1.68, height: 0.95, x: -0.84, y: 0.12, z: 0, angle: 0.43 },
    { width: 0.82, height: 1.48, x: 0.92, y: 0.06, z: 0.12, angle: -0.43 },
  ];
  cards.forEach(({ width, height, x, y, z, angle }, index) => {
    const texture = loader.load(directionArtwork[index], render, undefined, unavailable);
    texture.colorSpace = THREE.SRGBColorSpace;
    const art = new THREE.Mesh(
      new THREE.PlaneGeometry(width, height),
      new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide }),
    );
    art.position.set(x, y, z);
    art.rotation.y = angle;
    const border = new THREE.Mesh(
      new THREE.BoxGeometry(width + 0.06, height + 0.06, 0.045),
      new THREE.MeshStandardMaterial({ color: '#363854' }),
    );
    border.position.set(x, y, z - 0.035);
    border.rotation.y = angle;
    group.add(border, art);
  });
  return group;
}

export function mountDirectionScene(
  kind: FutureDirection,
  canvas: HTMLCanvasElement,
  unavailable: () => void,
) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 20);
  camera.position.set(0, 0, 6.15);
  scene.add(new THREE.HemisphereLight('#f2fff9', '#193649', 2.2));
  const key = new THREE.DirectionalLight('#fff4df', 2.1);
  key.position.set(-2, 4, 5);
  scene.add(key);

  let disposed = false;
  let frame = 0;
  function render() {
    if (disposed || frame) return;
    frame = window.requestAnimationFrame(() => {
      frame = 0;
      if (!disposed) renderer.render(scene, camera);
    });
  }

  const object = kind === 'radar' ? radar() : kind === 'growth' ? growth() : creative(render, unavailable);
  const initial = object.rotation.clone();
  scene.add(object);

  const resize = new ResizeObserver(() => {
    const { clientWidth: width, clientHeight: height } = canvas;
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.position.z = camera.aspect < 1.15 ? 6.15 * 1.15 / camera.aspect : 6.15;
    camera.updateProjectionMatrix();
    render();
  });
  resize.observe(canvas);
  canvas.addEventListener('webglcontextlost', unavailable);
  render();

  return {
    rotate(yaw: number, pitch = 0) {
      object.rotation.y += yaw;
      object.rotation.x = THREE.MathUtils.clamp(object.rotation.x + pitch, -0.52, 0.52);
      render();
    },
    reset() {
      object.rotation.copy(initial);
      render();
    },
    dispose() {
      disposed = true;
      if (frame) window.cancelAnimationFrame(frame);
      resize.disconnect();
      canvas.removeEventListener('webglcontextlost', unavailable);
      const materials = new Set<THREE.Material>();
      scene.traverse((node) => {
        if (node instanceof THREE.Mesh || node instanceof THREE.Line) {
          node.geometry.dispose();
          for (const material of Array.isArray(node.material) ? node.material : [node.material]) {
            materials.add(material);
          }
        }
      });
      for (const material of materials) {
        if (material instanceof THREE.MeshBasicMaterial) material.map?.dispose();
        material.dispose();
      }
      renderer.dispose();
    },
  };
}
