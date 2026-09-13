declare module "canvas-confetti" {
  interface ConfettiOrigin {
    x?: number;
    y?: number;
  }

  interface Options {
    particleCount?: number;
    angle?: number;
    spread?: number;
    origin?: ConfettiOrigin;
    colors?: string[];
    ticks?: number;
  }

  export default function confetti(options?: Options): Promise<null> | null;
}
