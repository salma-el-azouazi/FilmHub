import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function HeroScene() {
  const mount = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mount.current) return;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, mount.current.clientWidth / mount.current.clientHeight, 0.1, 100);
    camera.position.set(0, 0.4, 7);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.current.clientWidth, mount.current.clientHeight);
    mount.current.appendChild(renderer.domElement);

    const reel = new THREE.Group();
    const ring = new THREE.TorusGeometry(1.45, 0.08, 16, 96);
    const material = new THREE.MeshStandardMaterial({ color: "#d8dee9", metalness: 0.75, roughness: 0.28 });
    reel.add(new THREE.Mesh(ring, material));
    for (let i = 0; i < 6; i++) {
      const hole = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.08, 32), new THREE.MeshStandardMaterial({ color: "#07080d" }));
      const angle = (i / 6) * Math.PI * 2;
      hole.position.set(Math.cos(angle) * 0.75, Math.sin(angle) * 0.75, 0);
      hole.rotation.x = Math.PI / 2;
      reel.add(hole);
    }
    scene.add(reel);

    const cameraRig = new THREE.Group();
    const body = new THREE.Mesh(
      new THREE.BoxGeometry(1.25, 0.72, 0.78),
      new THREE.MeshStandardMaterial({ color: "#111827", metalness: 0.35, roughness: 0.42 })
    );
    const lens = new THREE.Mesh(
      new THREE.CylinderGeometry(0.26, 0.34, 0.62, 40),
      new THREE.MeshStandardMaterial({ color: "#2de2e6", metalness: 0.65, roughness: 0.2, emissive: "#0a3a3d", emissiveIntensity: 0.55 })
    );
    lens.rotation.z = Math.PI / 2;
    lens.position.x = 0.88;
    const topReelA = new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.045, 12, 42), material);
    const topReelB = topReelA.clone();
    topReelA.position.set(-0.34, 0.56, 0);
    topReelB.position.set(0.34, 0.56, 0);
    cameraRig.add(body, lens, topReelA, topReelB);
    cameraRig.position.set(2.15, -1.35, -0.35);
    cameraRig.rotation.set(-0.08, -0.45, 0.08);
    scene.add(cameraRig);

    const clapper = new THREE.Group();
    const slate = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.62, 0.06), new THREE.MeshStandardMaterial({ color: "#141821", roughness: 0.55 }));
    const clap = new THREE.Mesh(new THREE.BoxGeometry(1.16, 0.18, 0.08), new THREE.MeshStandardMaterial({ color: "#f8fafc", roughness: 0.5 }));
    clap.position.y = 0.42;
    clap.rotation.z = -0.22;
    clapper.add(slate, clap);
    clapper.position.set(-2.45, -1.55, 0.25);
    clapper.rotation.set(0.22, 0.48, -0.08);
    scene.add(clapper);

    const palette = ["#ff355e", "#ffd166", "#2de2e6", "#f8fafc"];
    for (let i = 0; i < 24; i++) {
      const poster = new THREE.Mesh(
        new THREE.PlaneGeometry(0.55, 0.82),
        new THREE.MeshBasicMaterial({ color: palette[i % palette.length], transparent: true, opacity: 0.48 })
      );
      poster.position.set(Math.sin(i) * 3.6, Math.cos(i * 1.7) * 2.2, -1 - i * 0.08);
      poster.rotation.set(0.25 * Math.sin(i), 0.4 * Math.cos(i), 0.1 * i);
      scene.add(poster);
    }

    const particles = new THREE.Points(
      new THREE.BufferGeometry().setAttribute(
        "position",
        new THREE.Float32BufferAttribute(Array.from({ length: 480 }, () => (Math.random() - 0.5) * 12), 3)
      ),
      new THREE.PointsMaterial({ color: "#2de2e6", size: 0.025, transparent: true, opacity: 0.75 })
    );
    scene.add(particles);
    scene.add(new THREE.AmbientLight("#ffffff", 1.5));
    const key = new THREE.PointLight("#ff355e", 11, 18);
    key.position.set(2.4, 2.2, 3);
    scene.add(key);
    const fill = new THREE.PointLight("#2de2e6", 6, 18);
    fill.position.set(-3, -1.5, 4);
    scene.add(fill);

    let frame = 0;
    const animate = () => {
      frame = requestAnimationFrame(animate);
      reel.rotation.z += 0.008;
      reel.rotation.y = Math.sin(Date.now() * 0.0006) * 0.35;
      cameraRig.rotation.y = -0.45 + Math.sin(Date.now() * 0.0008) * 0.12;
      topReelA.rotation.z += 0.025;
      topReelB.rotation.z -= 0.02;
      clapper.rotation.z = -0.08 + Math.sin(Date.now() * 0.002) * 0.08;
      particles.rotation.y += 0.0015;
      renderer.render(scene, camera);
    };
    animate();

    const resize = () => {
      if (!mount.current) return;
      camera.aspect = mount.current.clientWidth / mount.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.current.clientWidth, mount.current.clientHeight);
    };
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      renderer.dispose();
      mount.current?.replaceChildren();
    };
  }, []);

  return <div ref={mount} className="absolute inset-0" aria-hidden="true" />;
}
