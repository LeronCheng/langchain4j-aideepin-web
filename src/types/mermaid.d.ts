declare module 'mermaid' {
  interface MermaidConfig {
    startOnLoad?: boolean;
    theme?: string;
    securityLevel?: string;
    [key: string]: any;
  }

  interface RenderResult {
    svg: string;
    bindFunctions?: Function;
  }

  export function initialize(config: MermaidConfig): void;
  export function render(id: string, text: string): Promise<RenderResult>;
  export default {
    initialize,
    render
  };
} 