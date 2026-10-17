import subprocess
import sys
import tempfile

import os

import json
from pathlib import Path

def execute_code(code, timeout=5):
    """
    Execute Python code safely using subprocess
    
    Args:
        code (str): Python code to execute
        timeout (int): Maximum execution time in seconds
    
    Returns:
        dict: {
            'output': str,  # stdout
            'error': str,   # stderr
            'success': bool # True if no errors
        }
    """

    try:
        with tempfile.NamedTemporaryFile(mode="w", suffix=".py", delete=False) as f:
            f.write(code)
            temp_file = f.name

        result = subprocess.run(
            [sys.executable, temp_file],
            capture_output=True,
            text=True,
            timeout=timeout,
            cwd= os.path.dirname(temp_file)
        )

        os.unlink(temp_file)

        return {
            "output": result.stdout,
            "error": result.stderr,
            "success": result.returncode == 0
        }
    except subprocess.TimeoutExpired:
        if "temp_file" in locals():
            try:
                os.unlink(temp_file)
            except:
                pass
        return {
            "output": "",
            'error': f'Execution timed out after {timeout} seconds',
            'success':False
        }