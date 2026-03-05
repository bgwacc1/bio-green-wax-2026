import type { Plugin, IndexHtmlTransformContext } from 'vite';

const CRITICAL_CSS = `
:root{--primary:142 50% 25%;--primary-foreground:0 0% 100%;--secondary:142 30% 92%;--secondary-foreground:142 50% 20%;--accent:43 90% 50%;--accent-foreground:0 0% 10%;--background:36 33% 94%;--foreground:0 0% 15%;--card:36 33% 94%;--card-foreground:0 0% 15%;--popover:36 33% 94%;--popover-foreground:0 0% 15%;--muted:142 10% 96%;--muted-foreground:0 0% 45%;--border:142 20% 88%;--input:142 20% 88%;--ring:142 50% 35%;--radius:0.5rem;--gold:43 90% 50%;--gold-light:43 85% 65%;--gold-dark:43 95% 40%;--green-light:142 40% 45%;--green-dark:142 60% 15%}
*,::before,::after{box-sizing:border-box;border-width:0;border-style:solid;border-color:hsl(var(--border))}
html{scroll-behavior:smooth;line-height:1.5;-webkit-text-size-adjust:100%;tab-size:4;font-family:'Open Sans',ui-sans-serif,system-ui,-apple-system,sans-serif;font-feature-settings:normal}
body{margin:0;background-color:hsl(var(--background));color:hsl(var(--foreground));font-family:'Open Sans',sans-serif;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}
h1,h2,h3,h4,h5,h6{font-family:'Montserrat',sans-serif;font-weight:600;letter-spacing:-0.025em;font-size:inherit;font-weight:inherit}
img,video{max-width:100%;height:auto;display:block}
a{color:inherit;text-decoration:inherit}
#root{min-height:100vh;display:flex;flex-direction:column}
header{position:fixed;top:0;left:0;right:0;z-index:50;transition:all .3s;background-color:rgba(245,240,232,1)}
.container-wide{width:100%;max-width:80rem;margin-left:auto;margin-right:auto;padding-left:1rem;padding-right:1rem}
@media(min-width:640px){.container-wide{padding-left:1.5rem;padding-right:1.5rem}}
@media(min-width:1024px){.container-wide{padding-left:2rem;padding-right:2rem}}
main{flex-grow:1;padding-top:72px}
@media(min-width:1024px){main{padding-top:120px}}
.section-padding{padding-top:4rem;padding-bottom:4rem}
@media(min-width:768px){.section-padding{padding-top:6rem;padding-bottom:6rem}}
`;

export function criticalCss(): Plugin {
  return {
    name: 'critical-css',
    enforce: 'post',
    transformIndexHtml: {
      order: 'post',
      handler(html: string, ctx: IndexHtmlTransformContext) {
        if (!html.includes('<head>')) return html;

        const criticalStyle = `<style id="critical-css">${CRITICAL_CSS.replace(/\n/g, '')}</style>`;

        html = html.replace('<head>', `<head>\n    ${criticalStyle}`);

        html = html.replace(
          /<link rel="stylesheet" crossorigin href="(\/assets\/[^"]+\.css)">/g,
          (_match: string, cssHref: string) => {
            return `<link rel="preload" href="${cssHref}" as="style" onload="this.onload=null;this.rel='stylesheet'" crossorigin>
    <noscript><link rel="stylesheet" crossorigin href="${cssHref}"></noscript>`;
          }
        );

        return html;
      }
    }
  };
}
