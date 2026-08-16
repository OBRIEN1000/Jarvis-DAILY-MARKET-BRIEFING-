import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { VoiceStatus } from '../types';

interface JarvisThreeVisualizerProps {
  status: VoiceStatus;
  isListening: boolean;
  isSpeaking: boolean;
  onToggleListening: () => void;
}

export const JarvisThreeVisualizer: React.FC<JarvisThreeVisualizerProps> = ({
  status,
  isListening,
  isSpeaking,
  onToggleListening,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const animIdRef = useRef<number | null>(null);

  // Keep state refs for animation loop
  const stateRef = useRef({ status, isListening, isSpeaking });
  useEffect(() => {
    stateRef.current = { status, isListening, isSpeaking };
  }, [status, isListening, isSpeaking]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 260;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 18, 38);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    rendererRef.current = renderer;

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);

    // 3. 3D Wave Ribbon Plane & Concentric Frequency Rings
    const planeGeo = new THREE.PlaneGeometry(42, 24, 70, 40);
    const posAttr = planeGeo.attributes.position;
    const origPositions = new Float32Array(posAttr.array);

    // Wireframe Mesh for 3D Cyber Wave Grid
    const waveMat = new THREE.MeshBasicMaterial({
      color: 0xeab308, // Cyber Gold/Yellow
      wireframe: true,
      transparent: true,
      opacity: 0.55,
    });
    const waveMesh = new THREE.Mesh(planeGeo, waveMat);
    waveMesh.rotation.x = -Math.PI / 2.3;
    scene.add(waveMesh);

    // Dynamic 3D Particle Cloud Rings
    const particleCount = 180;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      const radius = 8 + (i % 3) * 2.2;
      particlePos[i * 3] = Math.cos(angle) * radius;
      particlePos[i * 3 + 1] = (Math.sin(i * 4) * 1.5);
      particlePos[i * 3 + 2] = Math.sin(angle) * radius;

      // Yellow/Amber palette
      particleColors[i * 3] = 0.98;     // R
      particleColors[i * 3 + 1] = 0.82; // G
      particleColors[i * 3 + 2] = 0.12; // B
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.45,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // 4. Central Orb Ring
    const orbGeo = new THREE.RingGeometry(3.5, 3.8, 48);
    const orbMat = new THREE.MeshBasicMaterial({
      color: 0xfacc15,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.7,
    });
    const orbRing = new THREE.Mesh(orbGeo, orbMat);
    orbRing.rotation.x = -Math.PI / 2.3;
    orbRing.position.y = 1.2;
    scene.add(orbRing);

    // Animation Loop
    let clock = new THREE.Clock();

    const animate = () => {
      const time = clock.getElapsedTime();
      const { status: curStatus, isListening: curListening, isSpeaking: curSpeaking } = stateRef.current;

      const isActive = curSpeaking || curListening || curStatus === 'processing';
      const waveSpeed = curSpeaking ? 3.8 : curListening ? 2.5 : curStatus === 'processing' ? 3.0 : 1.0;
      const amp = curSpeaking ? 3.2 : curListening ? 2.0 : curStatus === 'processing' ? 2.6 : 0.8;

      // Update color based on state
      if (curSpeaking) {
        waveMat.color.setHex(0xfacc15); // Bright Cyber Yellow
        orbMat.color.setHex(0xfde047);
      } else if (curListening) {
        waveMat.color.setHex(0x4ade80); // Emerald Green Active Listener
        orbMat.color.setHex(0x22c55e);
      } else if (curStatus === 'processing') {
        waveMat.color.setHex(0xf59e0b); // Amber Computing
        orbMat.color.setHex(0xfbbf24);
      } else {
        waveMat.color.setHex(0xca8a04); // Deep Gold Idle
        orbMat.color.setHex(0xa16207);
      }

      // Deform 3D Plane Vertices
      const pos = waveMesh.geometry.attributes.position;
      const count = pos.count;
      for (let i = 0; i < count; i++) {
        const ox = origPositions[i * 3];
        const oy = origPositions[i * 3 + 1];
        const dist = Math.sqrt(ox * ox + oy * oy);

        // Sinusoidal 3D Wave ripple
        const z =
          Math.sin(ox * 0.4 + time * waveSpeed) *
          Math.cos(oy * 0.4 + time * waveSpeed * 0.8) *
          amp *
          Math.exp(-dist * 0.06);

        pos.setZ(i, z);
      }
      pos.needsUpdate = true;

      // Rotate Particle System
      particleSystem.rotation.y = time * 0.25 * (isActive ? 1.8 : 0.8);
      particleSystem.rotation.x = Math.sin(time * 0.5) * 0.08;

      // Pulse Central Ring
      const scale = 1 + Math.sin(time * (isActive ? 5 : 2)) * (isActive ? 0.08 : 0.03);
      orbRing.scale.set(scale, scale, scale);

      renderer.render(scene, camera);
      animIdRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      cameraRef.current.aspect = newWidth / newHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(newWidth, newHeight);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    return () => {
      if (animIdRef.current) cancelAnimationFrame(animIdRef.current);
      resizeObserver.disconnect();
      if (rendererRef.current && container) {
        try {
          container.removeChild(rendererRef.current.domElement);
        } catch {
          // ignore
        }
        rendererRef.current.dispose();
      }
      planeGeo.dispose();
      waveMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      orbGeo.dispose();
      orbMat.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-[220px] sm:h-[260px] flex items-center justify-center select-none overflow-hidden bg-black">
      {/* 3D WebGL Canvas Layer */}
      <div ref={containerRef} className="absolute inset-0 w-full h-full cursor-pointer" onClick={onToggleListening} />

      {/* Center Interactive Button */}
      <div className="relative z-10 pointer-events-none flex flex-col items-center justify-center">
        <button
          onClick={onToggleListening}
          id="btn-three-voice-trigger"
          className={`pointer-events-auto px-5 py-2 text-xs font-mono font-bold tracking-wider uppercase border transition-all cursor-pointer ${
            isListening
              ? 'bg-emerald-500 text-black border-emerald-400 shadow-lg shadow-emerald-500/30'
              : isSpeaking
              ? 'bg-yellow-400 text-black border-yellow-300 shadow-lg shadow-yellow-400/30'
              : status === 'processing'
              ? 'bg-amber-500 text-black border-amber-400 shadow-lg shadow-amber-500/30'
              : 'bg-black/80 text-yellow-400 border-yellow-500/60 hover:bg-yellow-400 hover:text-black hover:border-yellow-400'
          }`}
          title="Click to toggle voice mode"
        >
          {isSpeaking
            ? 'AUDIO TRANSMITTING'
            : isListening
            ? 'VOICE ACTIVE — LISTENING'
            : status === 'processing'
            ? 'COMPUTING INTEL...'
            : 'ACTIVATE VOICE'}
        </button>
      </div>
    </div>
  );
};
