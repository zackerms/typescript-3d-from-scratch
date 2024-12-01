import React, { ChangeEvent, useCallback, useEffect, useMemo } from 'react';
import { Renderer } from './models/Renderer';
import { Mesh } from './models/Mesh';
import { Vector3 } from './models/Vector3';
import { Camera, CameraParams } from './models/Camera';
import { Box, Center, HStack, VStack } from '@chakra-ui/react';
import {
  Checkbox
} from './components/ui/checkbox';
import {
  AccordionRoot,
  AccordionItem,
  AccordionItemTrigger,
  AccordionItemContent
} from './components/ui/accordion';

export default function App() {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [isWireframe, setIsWireframe] = React.useState(false);
  const [cameraParams, setCameraParams] = React.useState<CameraParams>({
    position: new Vector3(0, 0, 5),
    target: new Vector3(0, 0, 0),
    up: new Vector3(0, 1, 0),
  });
  const [canvasContext, setCanvasContext] = React.useState<CanvasRenderingContext2D | null>(null);

  const renderer = useMemo(() => {
    if (!canvasRef.current) return null;
    if (!canvasContext) return null;
    return new Renderer(canvasContext, canvasRef.current.width, canvasRef.current.height);
  }, [canvasRef, canvasContext]);

  const camera = useMemo(() => {
    if (!renderer) return null;

    const c = new Camera({
      position: new Vector3(0, 0, 5),
      target: new Vector3(0, 0, 0),
      up: new Vector3(0, 1, 0),
    });

    c.aspect = renderer.width / renderer.height;
    return c;
  }, [renderer]);

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
    renderer.renderMesh(cube, camera, '#ffffff');
    requestAnimationFrame(() => render(renderer, camera));
  }, [cube]);

  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    setCanvasContext(ctx);
  }, []);
  useEffect(() => {
    if (!renderer || !camera) return;
    render(renderer, camera);
  }, [render, renderer, camera]);

  useEffect(() => {
    if (!renderer) return;
    renderer.isWireframe = isWireframe;
  }, [renderer, isWireframe]);

  useEffect(() => {
    if (!camera) return;
    camera.fov = cameraParams.fov ?? camera.fov;
    camera.near = cameraParams.near ?? camera.near;
    camera.far = cameraParams.far ?? camera.far;
  }, [camera, cameraParams]);

  return (
    <Center w="100%">
      <VStack maxW={900} p="16px">
        <Box borderRadius="20px" overflow="hidden">
          <canvas
            ref={canvasRef}
            width={640}
            height={480}
          />
        </Box>
        <Settings
          isWireframe={isWireframe}
          onUpdateIsWireframe={(value) => setIsWireframe(value)}
          cameraParams={cameraParams}
          onUpdateCameraFov={(value) => setCameraParams({ ...cameraParams, fov: value })}
          onUpdateCameraNear={(value) => setCameraParams({ ...cameraParams, near: value })}
          onUpdateCameraFar={(value) => setCameraParams({ ...cameraParams, far: value })}
        />
      </VStack>
    </Center>
  );
}

function Settings({
  isWireframe,
  cameraParams,
  onUpdateIsWireframe,
  onUpdateCameraFov,
  onUpdateCameraNear,
  onUpdateCameraFar
}: {
  isWireframe: boolean;
  cameraParams: CameraParams;
  onUpdateIsWireframe: (value: boolean) => void;
  onUpdateCameraFov: (value: number) => void;
  onUpdateCameraNear: (value: number) => void;
  onUpdateCameraFar: (value: number) => void;
}) {
  return <AccordionRoot>
    <AccordionItem>
      <AccordionItemTrigger>
        Camera
      </AccordionItemTrigger>
      <AccordionItemContent>
        <VStack w="100%">
          <HStack w="100%" justifyContent="space-between">
            <label>Wireframe</label>
            <input
              type='checkbox'
              checked={isWireframe}
              onChange={(e: ChangeEvent<HTMLInputElement>) => onUpdateIsWireframe(e.target.checked)}
            />
          </HStack>
          <HStack w="100%">
            <label>FOV</label>
            <input type='range' min={1} max={179} value={cameraParams.fov}
              style={{ flex: 1 }}
              onChange={(e) => onUpdateCameraFov(Number(e.target.value))} />
            <div>{cameraParams.fov}</div>
          </HStack>
          <HStack w="100%">
            <label>Near</label>
            <input type='range' min={0.1} max={10} step={0.1} value={cameraParams.near}
              style={{ flex: 1 }}
              onChange={(e) => onUpdateCameraNear(Number(e.target.value))} />
            <div>{cameraParams.near}</div>
          </HStack>
          <HStack w="100%">
            <label>Far</label>
            <input type='range' min={1} max={100} value={cameraParams.far}
              style={{ flex: 1 }}
              onChange={(e) => onUpdateCameraFar(Number(e.target.value))} />
            <div>{cameraParams.far}</div>
          </HStack>
        </VStack>
      </AccordionItemContent>
    </AccordionItem>
  </AccordionRoot>
}