declare global {
  interface Window {
    loadPyodide: (config: { indexURL: string }) => Promise<PyodideInterface>;
    pyodide: PyodideInterface;
  }
}

interface PyodideInterface {
  runPythonAsync: (code: string) => Promise<unknown>;
  globals: { get: (key: string) => unknown };
}

let pyodideReady: Promise<PyodideInterface> | null = null;

export function initPyodide(): Promise<PyodideInterface> {
  if (pyodideReady) return pyodideReady;

  pyodideReady = new Promise((resolve, reject) => {
    if (window.pyodide) { resolve(window.pyodide); return; }

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/pyodide/v0.25.1/full/pyodide.js';
    script.onload = async () => {
      try {
        const py = await window.loadPyodide({
          indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.25.1/full/',
        });
        window.pyodide = py;
        resolve(py);
      } catch (e) { reject(e); }
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });

  return pyodideReady;
}

export async function runCode(code: string): Promise<{ output: string; error: string | null }> {
  const py = await initPyodide();

  let output = '';
  const wrappedCode = `
import sys
from io import StringIO
_buf = StringIO()
sys.stdout = _buf
try:
${code.split('\n').map(l => '    ' + l).join('\n')}
except Exception as e:
    print(f"Error: {e}")
finally:
    sys.stdout = sys.__stdout__
    _out = _buf.getvalue()
`;

  try {
    await py.runPythonAsync(wrappedCode);
    output = String(py.globals.get('_out') ?? '');
    return { output, error: null };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    const friendly = friendlyError(msg);
    return { output: '', error: friendly };
  }
}

function friendlyError(msg: string): string {
  if (msg.includes('SyntaxError')) {
    if (msg.includes('expected')) return `Syntax Error: Something looks off — check for missing : or )`;
    return `Syntax Error: Check your spelling and punctuation!`;
  }
  if (msg.includes('IndentationError')) return `Indentation Error: Make sure you have 4 spaces before lines inside if/for/def!`;
  if (msg.includes('NameError')) {
    const m = msg.match(/name '(\w+)' is not defined/);
    return m ? `Name Error: "${m[1]}" is not defined. Did you spell it correctly?` : `Name Error: Variable not found — check your spelling!`;
  }
  if (msg.includes('TypeError')) return `Type Error: You're mixing different types (like numbers and text). Use str() to convert!`;
  return msg.split('\n')[0];
}
