import React, { ChangeEvent, useCallback, useEffect, useMemo } from 'react';
import { Renderer } from './models/Renderer';
import { Mesh } from './models/Mesh';
import { Vector3 } from './models/Vector3';
import { Camera } from './models/Camera';
import {Box, Center, VStack} from '@chakra-ui/react';
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
  const [canvasContext, setCanvasContext] = React.useState<CanvasRenderingContext2D | null>(null);

  const renderer = useMemo(() => {
    if (!canvasRef.current) return null;
    if (!canvasContext) return null;
    return new Renderer(canvasContext, canvasRef.current.width, canvasRef.current.height);
  }, [canvasRef, canvasContext]);

  const camera = useMemo(() => {
    if (!renderer) return null;

    const c = new Camera(
      new Vector3(0, 0, 5),
      new Vector3(0, 0, 0),
      new Vector3(0, 1, 0),
    );

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
    renderer.renderMesh(cube, camera);
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
        />
      </VStack>
    </Center>
  );
}

function Settings({
  isWireframe,
  onUpdateIsWireframe
}: {
  isWireframe: boolean;
  onUpdateIsWireframe: (value: boolean) => void;
}) {
  return <AccordionRoot>
    <AccordionItem>
      <AccordionItemTrigger>
        Camera
      </AccordionItemTrigger>
      <AccordionItemContent>
        <Checkbox
          checked={isWireframe}
          onChange={(e: ChangeEvent<HTMLInputElement>) => onUpdateIsWireframe(e.target.checked)}
        >
          Wireframe
        </Checkbox>
      </AccordionItemContent>
    </AccordionItem>
  </AccordionRoot>
}