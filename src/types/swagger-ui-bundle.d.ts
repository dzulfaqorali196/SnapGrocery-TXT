declare module 'swagger-ui-dist/swagger-ui-bundle' {
  interface SwaggerUIOptions {
    dom_id?: string;
    spec?: any;
    url?: string;
    docExpansion?: 'list' | 'full' | 'none';
    deepLinking?: boolean;
  }

  function SwaggerUIBundle(options: SwaggerUIOptions): any;
  export default SwaggerUIBundle;
} 