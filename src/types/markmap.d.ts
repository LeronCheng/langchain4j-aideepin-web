declare module 'markmap-lib' {
  export class Transformer {
    transform(markdown: string): { root: any }
  }
}

declare module 'markmap-view' {
  export class Markmap {
    static create(el: HTMLElement): Markmap
    setData(data: any): void
  }
} 