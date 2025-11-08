declare module "next/dist/compiled/zod" {
  /**
   * Next bundles a vendored copy of zod that ships without TypeScript
   * declarations. We only need the runtime API, so a minimal shim keeps the
   * project compiling without pulling zod into dependencies.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const z: any;
}
