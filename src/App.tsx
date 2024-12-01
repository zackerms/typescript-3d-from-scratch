import React, { ChangeEvent, useCallback, useEffect, useMemo } from "react";
import { Renderer } from "./models/Renderer";
import { Vector3 } from "./models/Vector3";
import { Camera, CameraParams } from "./models/Camera";
import { Box, Center, HStack, VStack } from "@chakra-ui/react";
import {
  AccordionRoot,
  AccordionItem,
  AccordionItemTrigger,
  AccordionItemContent,
} from "./components/ui/accordion";
import { Light } from "./models/Light";
import { Color } from "./models/Color";
import { Cube } from "./models/Cube";
import { Material } from "./models/Material";

export default function App() {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [isWireframe, setIsWireframe] = React.useState(false);
  const [cameraParams, setCameraParams] = React.useState<CameraParams>({
    position: new Vector3({ x: 0, y: 0, z: 5 }),
    target: new Vector3({ x: 0, y: 0, z: 0 }),
    up: new Vector3({ x: 0, y: 1, z: 0 }),
  });
  const [canvasContext, setCanvasContext] =
    React.useState<CanvasRenderingContext2D | null>(null);

  const renderer = useMemo(() => {
    if (!canvasRef.current) return null;
    if (!canvasContext) return null;
    return new Renderer(
      canvasContext,
      canvasRef.current.width,
      canvasRef.current.height,
    );
  }, [canvasRef, canvasContext]);

  const camera = useMemo(() => {
    if (!renderer) return null;

    const c = new Camera({
      position: new Vector3({ x: 0, y: 0, z: 5 }),
      target: new Vector3({ x: 0, y: 0, z: 0 }),
      up: new Vector3({ x: 0, y: 1, z: 0 }),
    });

    c.aspect = renderer.width / renderer.height;
    return c;
  }, [renderer]);

  const cube = useMemo(() => {
    return new Cube({
      material: new Material({
        color: new Color(1, 1, 1),
        ambient: 0.1,
        diffuse: 0.8,
        specular: 0.2,
        shininess: 32,
      }),
    });
  }, []);

  const lights = useMemo(() => {
    return [
      new Light({
        position: new Vector3({ x: -5, y: 5, z: 5 }),
        color: new Color(0, 0.2, 1),
        intensity: 1.2,
      }),
      new Light({
        position: new Vector3({ x: 5, y: -3, z: 3 }),
        color: new Color(1.0, 0.1, 0.1),
        intensity: 1.0,
      }),
    ];
  }, []);

  const render = useCallback(
    (renderer: Renderer, camera: Camera) => {
      renderer.clear();
      cube.rotation.y += 0.01;
      renderer.renderMesh({
        mesh: cube,
        camera,
        lights,
      });
      requestAnimationFrame(() => render(renderer, camera));
    },
    [cube, lights],
  );

  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
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
          <canvas ref={canvasRef} width={640} height={480} />
        </Box>
        <Settings
          isWireframe={isWireframe}
          onUpdateIsWireframe={(value) => setIsWireframe(value)}
          cameraParams={cameraParams}
          onUpdateCameraFov={(value) =>
            setCameraParams({ ...cameraParams, fov: value })
          }
          onUpdateCameraNear={(value) =>
            setCameraParams({ ...cameraParams, near: value })
          }
          onUpdateCameraFar={(value) =>
            setCameraParams({ ...cameraParams, far: value })
          }
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
  onUpdateCameraFar,
}: {
  isWireframe: boolean;
  cameraParams: CameraParams;
  onUpdateIsWireframe: (value: boolean) => void;
  onUpdateCameraFov: (value: number) => void;
  onUpdateCameraNear: (value: number) => void;
  onUpdateCameraFar: (value: number) => void;
}) {
  return (
    <AccordionRoot>
      <AccordionItem>
        <AccordionItemTrigger>Camera</AccordionItemTrigger>
        <AccordionItemContent>
          <VStack w="100%">
            <HStack w="100%" justifyContent="space-between">
              <label>Wireframe</label>
              <input
                type="checkbox"
                checked={isWireframe}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  onUpdateIsWireframe(e.target.checked)
                }
              />
            </HStack>
            <HStack w="100%">
              <label>FOV</label>
              <input
                type="range"
                min={1}
                max={179}
                value={cameraParams.fov}
                style={{ flex: 1 }}
                onChange={(e) => onUpdateCameraFov(Number(e.target.value))}
              />
              <div>{cameraParams.fov}</div>
            </HStack>
            <HStack w="100%">
              <label>Near</label>
              <input
                type="range"
                min={0.1}
                max={10}
                step={0.1}
                value={cameraParams.near}
                style={{ flex: 1 }}
                onChange={(e) => onUpdateCameraNear(Number(e.target.value))}
              />
              <div>{cameraParams.near}</div>
            </HStack>
            <HStack w="100%">
              <label>Far</label>
              <input
                type="range"
                min={1}
                max={100}
                value={cameraParams.far}
                style={{ flex: 1 }}
                onChange={(e) => onUpdateCameraFar(Number(e.target.value))}
              />
              <div>{cameraParams.far}</div>
            </HStack>
          </VStack>
        </AccordionItemContent>
      </AccordionItem>
    </AccordionRoot>
  );
}
