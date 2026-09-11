'use client';

import { useEffect, useRef, useState } from 'react';
import { Rotate3D } from 'lucide-react';
import * as THREE from 'three';
import { feature } from 'topojson-client';
import landData from 'world-atlas/land-110m.json';
import { guides } from '@/lib/guides';

type RadarNode = {
  id: string;
  city: string;
  region: string;
  signal: string;
  apiCount: number;
  latitude: number;
  longitude: number;
};

const radarNodes: RadarNode[] = guides.map((guide) => ({
  id: guide.id,
  city: guide.marketNodes[0].city,
  region: guide.marketNodes[0].region,
  signal: guide.category,
  apiCount: guide.apiCapabilities.length,
  latitude: guide.marketNodes[0].latitude,
  longitude: guide.marketNodes[0].longitude,
}));

function toGlobePosition(longitude: number, latitude: number, radius: number) {
  const phi = THREE.MathUtils.degToRad(90 - latitude);
  const theta = THREE.MathUtils.degToRad(longitude + 180);

  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
}

function coordinateRings(geometry: {
  type: string;
  coordinates: unknown;
}): number[][][] {
  if (geometry.type === 'Polygon') {
    return geometry.coordinates as number[][][];
  }

  if (geometry.type === 'MultiPolygon') {
    return (geometry.coordinates as number[][][][]).flat();
  }

  return [];
}

export function CommerceGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [activeNode, setActiveNode] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    if (!canvas || !stage) return;

    let renderer: THREE.WebGLRenderer;

    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      });
    } catch {
      stage.dataset.failed = 'true';
      return;
    }

    stage.dataset.ready = 'true';

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 0.15, 6.4);

    const globe = new THREE.Group();
    globe.rotation.set(-0.16, -0.64, 0.03);
    scene.add(globe);

    const coreGeometry = new THREE.SphereGeometry(2, 64, 64);
    const coreMaterial = new THREE.MeshPhongMaterial({
      color: 0x111936,
      emissive: 0x080d20,
      shininess: 26,
      transparent: true,
      opacity: 0.98,
    });
    globe.add(new THREE.Mesh(coreGeometry, coreMaterial));

    const atmosphereGeometry = new THREE.SphereGeometry(2.055, 64, 64);
    const atmosphereMaterial = new THREE.MeshBasicMaterial({
      color: 0x8b5cf6,
      transparent: true,
      opacity: 0.055,
      side: THREE.BackSide,
    });
    globe.add(new THREE.Mesh(atmosphereGeometry, atmosphereMaterial));

    const borderMaterial = new THREE.LineBasicMaterial({
      color: 0x8f84d9,
      transparent: true,
      opacity: 0.32,
    });

    const topology = landData as {
      type: 'Topology';
      objects: { land: unknown };
      arcs: unknown;
      transform?: unknown;
    };
    const land = feature(
      topology as never,
      topology.objects.land as never,
    ) as unknown as {
      geometry: { type: string; coordinates: unknown } | null;
    };

    if (land.geometry) {
      coordinateRings(land.geometry).forEach((ring) => {
        if (ring.length < 3) return;
        const points = ring.map(([longitude, latitude]) =>
          toGlobePosition(longitude, latitude, 2.012),
        );
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        globe.add(new THREE.Line(geometry, borderMaterial));
      });
    }

    const markerMeshes: THREE.Mesh[] = [];
    const markerMaterial = new THREE.MeshBasicMaterial({ color: 0xa78bfa });
    const markerCoreMaterial = new THREE.MeshBasicMaterial({ color: 0x5eead4 });

    radarNodes.forEach((node, index) => {
      const position = toGlobePosition(node.longitude, node.latitude, 2.06);
      const marker = new THREE.Mesh(
        new THREE.SphereGeometry(0.075, 16, 16),
        markerCoreMaterial,
      );
      marker.position.copy(position);
      marker.userData.nodeIndex = index;
      markerMeshes.push(marker);
      globe.add(marker);

      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(0.14, 0.012, 8, 32),
        markerMaterial,
      );
      ring.position.copy(position);
      ring.quaternion.setFromUnitVectors(
        new THREE.Vector3(0, 0, 1),
        position.clone().normalize(),
      );
      globe.add(ring);
    });

    const arcMaterial = new THREE.LineBasicMaterial({
      color: 0x5eead4,
      transparent: true,
      opacity: 0.48,
    });

    radarNodes.forEach((node, index) => {
      const next = radarNodes[(index + 1) % radarNodes.length];
      const start = toGlobePosition(node.longitude, node.latitude, 2.07);
      const end = toGlobePosition(next.longitude, next.latitude, 2.07);
      const midpoint = start.clone().add(end).normalize().multiplyScalar(2.75);
      const curve = new THREE.QuadraticBezierCurve3(start, midpoint, end);
      const geometry = new THREE.BufferGeometry().setFromPoints(
        curve.getPoints(44),
      );
      globe.add(new THREE.Line(geometry, arcMaterial));
    });

    const ambientLight = new THREE.AmbientLight(0x8b94c7, 1.5);
    const keyLight = new THREE.DirectionalLight(0xc4b5fd, 3.8);
    keyLight.position.set(-4, 4, 5);
    const rimLight = new THREE.DirectionalLight(0x2dd4bf, 2.1);
    rimLight.position.set(4, -2, -3);
    scene.add(ambientLight, keyLight, rimLight);

    const starsGeometry = new THREE.BufferGeometry();
    const stars = new Float32Array(330 * 3);
    for (let index = 0; index < stars.length; index += 3) {
      const seed = index / 3 + 1;
      stars[index] = ((seed * 47) % 97) / 8 - 6;
      stars[index + 1] = ((seed * 71) % 89) / 8 - 5.5;
      stars[index + 2] = -1 - ((seed * 37) % 83) / 10;
    }
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(stars, 3));
    const starsMaterial = new THREE.PointsMaterial({
      color: 0x7c83aa,
      size: 0.018,
      transparent: true,
      opacity: 0.58,
    });
    scene.add(new THREE.Points(starsGeometry, starsMaterial));

    let dragging = false;
    let pointerX = 0;
    let pointerY = 0;
    let animationFrame = 0;
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    const resize = () => {
      const { width, height } = stage.getBoundingClientRect();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
      renderer.setSize(width, height, false);
      camera.aspect = width / Math.max(height, 1);
      camera.updateProjectionMatrix();
    };

    const onPointerDown = (event: PointerEvent) => {
      dragging = true;
      pointerX = event.clientX;
      pointerY = event.clientY;
      canvas.setPointerCapture(event.pointerId);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!dragging) return;
      globe.rotation.y += (event.clientX - pointerX) * 0.006;
      globe.rotation.x = THREE.MathUtils.clamp(
        globe.rotation.x + (event.clientY - pointerY) * 0.004,
        -0.75,
        0.75,
      );
      pointerX = event.clientX;
      pointerY = event.clientY;
    };

    const onPointerUp = (event: PointerEvent) => {
      dragging = false;
      if (canvas.hasPointerCapture(event.pointerId)) {
        canvas.releasePointerCapture(event.pointerId);
      }
    };

    const onClick = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const pointer = new THREE.Vector2(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -((event.clientY - rect.top) / rect.height) * 2 + 1,
      );
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(pointer, camera);
      const hit = raycaster.intersectObjects(markerMeshes, false)[0];
      if (hit) setActiveNode(hit.object.userData.nodeIndex as number);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(stage);
    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('pointercancel', onPointerUp);
    canvas.addEventListener('click', onClick);
    resize();

    const render = () => {
      if (!reduceMotion && !dragging) globe.rotation.y += 0.00125;
      renderer.render(scene, camera);
      animationFrame = window.requestAnimationFrame(render);
    };
    render();

    return () => {
      window.cancelAnimationFrame(animationFrame);
      observer.disconnect();
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerup', onPointerUp);
      canvas.removeEventListener('pointercancel', onPointerUp);
      canvas.removeEventListener('click', onClick);
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.Line) {
          object.geometry.dispose();
        }
      });
      coreMaterial.dispose();
      atmosphereMaterial.dispose();
      borderMaterial.dispose();
      markerMaterial.dispose();
      markerCoreMaterial.dispose();
      arcMaterial.dispose();
      starsGeometry.dispose();
      starsMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  const selected = radarNodes[activeNode];

  return (
    <section
      className="globe-panel"
      aria-label="Global ecommerce intelligence map"
    >
      <div className="globe-stage" ref={stageRef}>
        <div className="globe-fallback" aria-hidden="true">
          <Rotate3D size={54} />
        </div>
        <canvas ref={canvasRef} aria-hidden="true" />
      </div>

      <div className="globe-status">
        <span className="live-dot" aria-hidden="true" /> Commerce intelligence
        map
      </div>

      <div className="globe-focus" aria-live="polite">
        <div className="globe-focus-top">
          <span>{selected.region}</span>
          <strong>{String(selected.apiCount).padStart(2, '0')}</strong>
        </div>
        <p>{selected.city}</p>
        <h2>{selected.signal}</h2>
        <span className="globe-focus-label">Research lens</span>
      </div>

      <div className="globe-node-list" aria-label="Select a market lens">
        {radarNodes.map((node, index) => (
          <button
            type="button"
            key={node.id}
            className={activeNode === index ? 'active' : ''}
            onClick={() => setActiveNode(index)}
            aria-pressed={activeNode === index}
          >
            <span>{node.id}</span>
            {node.city}
          </button>
        ))}
      </div>

      <p className="globe-instruction">
        <Rotate3D size={14} aria-hidden="true" /> Drag to rotate · select a node
      </p>
    </section>
  );
}
