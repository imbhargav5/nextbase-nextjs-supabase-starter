import { render } from 'preact';
import { h } from 'preact';
import { fetchWidgetConfig } from './api';
import { STYLES } from './styles';
import { WidgetApp } from './ui';

function getCurrentScript(): HTMLScriptElement | null {
  if (document.currentScript instanceof HTMLScriptElement) {
    return document.currentScript;
  }
  return document.querySelector<HTMLScriptElement>('script[data-project-key]');
}

async function boot() {
  try {
    const script = getCurrentScript();
    const projectKey = script?.getAttribute('data-project-key');
    if (!projectKey) return;

    const origin = new URL(script!.src).origin;
    const config = await fetchWidgetConfig(origin, projectKey);
    if (!config.active) return;

    const host = document.createElement('div');
    host.id = 'ybug-widget-root';
    document.body.appendChild(host);
    const shadow = host.attachShadow({ mode: 'open' });
    const style = document.createElement('style');
    style.textContent = STYLES;
    shadow.appendChild(style);
    const mount = document.createElement('div');
    shadow.appendChild(mount);

    render(h(WidgetApp, { origin, projectKey }), mount);
  } catch {
    // Never break the host page.
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
