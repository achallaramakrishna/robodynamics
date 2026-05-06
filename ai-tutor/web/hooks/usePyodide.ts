import { useState, useEffect } from 'react';

declare global {
  interface Window {
    pyodide: any;
    loadPyodide: any;
  }
}

export function usePyodide() {
  const [pyodide, setPyodide] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function initPyodide() {
      try {
        if (window.pyodide) {
          if (isMounted) {
            setPyodide(window.pyodide);
            setIsLoading(false);
          }
          return;
        }

        if (!document.getElementById("pyodide-script")) {
          const script = document.createElement('script');
          script.id = "pyodide-script";
          script.src = "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js";
          script.async = true;
          document.body.appendChild(script);

          script.onload = async () => {
            try {
              const pyInstance = await window.loadPyodide({
                indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/"
              });
              window.pyodide = pyInstance;
              if (isMounted) {
                setPyodide(pyInstance);
                setIsLoading(false);
              }
            } catch (e: any) {
              if (isMounted) {
                setError(e.message);
                setIsLoading(false);
              }
            }
          };
        }
      } catch (e: any) {
        if (isMounted) {
          setError(e.message);
          setIsLoading(false);
        }
      }
    }
    
    initPyodide();
    
    return () => { isMounted = false; };
  }, []);

  /**
   * Executes python code and captures stdout and stderr.
   * Allows injecting mock inputs for the `input()` function.
   */
  const executeCode = async (code: string, mockInputs: string[] = []): Promise<{ stdout: string, error?: string }> => {
    if (!pyodide) return { stdout: "", error: "Pyodide engine is still loading..." };

    try {
      // 1. Setup secure stdout/stderr buffers
      pyodide.runPython(`
import sys
import io
import builtins

sys.stdout = io.StringIO()
sys.stderr = io.StringIO()
      `);

      // 2. Mock the built-in input() function to read from our array
      const inputString = JSON.stringify(mockInputs);
      pyodide.runPython(`
_mock_inputs = ${inputString}
_input_idx = 0

def mock_input(prompt=""):
    global _input_idx
    if _input_idx < len(_mock_inputs):
        val = _mock_inputs[_input_idx]
        _input_idx += 1
        print(str(prompt) + str(val))
        return val
    return ""

builtins.input = mock_input
      `);

      // 3. Execute the student's code
      await pyodide.runPythonAsync(code);
      
      // 4. Retrieve outputs
      const stdout = pyodide.runPython(`sys.stdout.getvalue()`);
      const stderr = pyodide.runPython(`sys.stderr.getvalue()`);
      
      return { stdout: stdout + stderr };
    } catch (err: any) {
      return { stdout: "", error: err.toString() };
    }
  };

  /**
   * Analyzes the Abstract Syntax Tree (AST) of the student's code.
   * Ensures they are actually using the required concepts (like a 'For' loop).
   */
  const checkAST = async (code: string, requiredNodes: string[]): Promise<{ valid: boolean; missing: string[]; error?: string }> => {
    if (!pyodide) return { valid: false, missing: [], error: "Pyodide engine is still loading..." };

    try {
      const codeString = JSON.stringify(code);
      const reqNodesString = JSON.stringify(requiredNodes);
      
      const resultJson = pyodide.runPython(`
import ast
import json

def analyze_ast():
    try:
        tree = ast.parse(${codeString})
        found_nodes = set(type(node).__name__ for node in ast.walk(tree))
        required = ${reqNodesString}
        missing = [n for n in required if n not in found_nodes]
        return json.dumps({"valid": len(missing) == 0, "missing": missing})
    except SyntaxError as e:
        return json.dumps({"valid": False, "error": str(e)})

analyze_ast()
      `);
      
      return JSON.parse(resultJson);
    } catch (e: any) {
      return { valid: false, missing: [], error: e.toString() };
    }
  };

  return { pyodide, isLoading, error, executeCode, checkAST };
}
