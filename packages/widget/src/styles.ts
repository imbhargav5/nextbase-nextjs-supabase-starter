export const STYLES = `
:host { all: initial; }
* { box-sizing: border-box; font-family: ui-sans-serif, system-ui, sans-serif; }
.launcher {
  position: fixed; bottom: 20px; right: 20px; z-index: 2147483000;
  background: #5b6cff; color: #fff; border: none; border-radius: 999px;
  padding: 12px 18px; font-size: 14px; font-weight: 600; cursor: pointer;
  box-shadow: 0 6px 20px rgba(0,0,0,.25);
}
.overlay {
  position: fixed; inset: 0; z-index: 2147483001; background: rgba(0,0,0,.6);
  display: flex; align-items: center; justify-content: center;
}
.panel {
  background: #fff; border-radius: 12px; width: min(900px, 94vw);
  max-height: 92vh; overflow: auto; padding: 16px;
}
.toolbar { display: flex; gap: 8px; margin-bottom: 12px; flex-wrap: wrap; }
.toolbar button { padding: 6px 10px; border-radius: 8px; border: 1px solid #ddd; background: #fff; cursor: pointer; }
.toolbar button.active { background: #5b6cff; color: #fff; border-color: #5b6cff; }
.canvas-wrap { border: 1px solid #eee; overflow: auto; max-height: 50vh; }
canvas { max-width: 100%; display: block; cursor: crosshair; }
.field { display: flex; flex-direction: column; gap: 4px; margin-top: 10px; }
.field label { font-size: 12px; color: #444; }
.field input, .field textarea, .field select { padding: 8px; border: 1px solid #ccc; border-radius: 8px; font-size: 14px; }
.row { display: flex; gap: 8px; }
.row > * { flex: 1; }
.actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 14px; }
.actions .primary { background: #5b6cff; color: #fff; border: none; }
.actions button { padding: 9px 14px; border-radius: 8px; border: 1px solid #ccc; cursor: pointer; }
.msg { padding: 12px; text-align: center; }
.error { color: #b00020; }
`;
