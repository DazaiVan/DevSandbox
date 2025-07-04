import type { LC, PropsWithChildren } from '@use-gpu/live';

type ComponentProps = {
  canvas: HTMLCanvasElement,
};

// This is a Live component
export const Component: LC<ComponentProps> = (props: PropsWithChildren<ComponentProps>) => {
  const {canvas} = props;

  // ...
  return null;
};