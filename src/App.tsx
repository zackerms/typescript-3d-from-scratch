import React, { useCallback, useEffect, useMemo } from 'react';
import { Renderer } from './models/Renderer';
import { Mesh } from './models/Mesh';
import { Vector3 } from './models/Vector3';
import { Camera } from './models/Camera';

export default function App() {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  const cube = useMemo(() => {
    return new Mesh(
      [
        new Vector3(-1, -1, -1), // 0
        new Vector3(1, -1, -1),  // 1
        new Vector3(1, 1, -1),   // 2
        new Vector3(-1, 1, -1),  // 3
        new Vector3(-1, -1, 1),  // 4
        new Vector3(1, -1, 1),   // 5
        new Vector3(1, 1, 1),    // 6
        new Vector3(-1, 1, 1)    // 7
      ],
      [
        // 前面
        [0, 1, 2], [0, 2, 3],
        // 背面
        [5, 4, 7], [5, 7, 6],
        // 上面
        [3, 2, 6], [3, 6, 7],
        // 底面
        [4, 5, 1], [4, 1, 0],
        // 右面
        [1, 5, 6], [1, 6, 2],
        // 左面
        [4, 0, 3], [4, 3, 7]
      ]
    )
  }, []);

  const render = useCallback((renderer: Renderer, camera: Camera) => {
    renderer.clear();
    cube.rotation.y += 0.01;
    renderer.renderMesh(cube, camera);
    requestAnimationFrame(() => render(renderer, camera));
  }, [cube]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const renderer = new Renderer(canvasRef.current!);
    renderer.isWireframe = true;

    const camera =  new Camera(
      new Vector3(0, 0, 5),
      new Vector3(0, 0, 0),
      new Vector3(0, 1, 0),
    );
    camera.aspect = renderer.width / renderer.height;

    render(renderer, camera);
  }, [render]);

  return (
    <canvas
      ref={canvasRef}
      width={640}
      height={480}
    />
  );
}