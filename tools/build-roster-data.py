#!/usr/bin/env python3
"""Regenerate js/roster-data.js from clemson-depth-chart.json.

The browser reads the generated JS file so the page works from file:// and from
GitHub Pages without a fetch. clemson-depth-chart.json stays the source of truth.
"""

import json
import pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
SOURCE = ROOT / "clemson-depth-chart.json"
TARGET = ROOT / "js" / "roster-data.js"

HEADER = (
    "/* Generated from clemson-depth-chart.json. Edit the JSON, then regenerate:\n"
    "   python3 tools/build-roster-data.py */\n"
)


def main() -> None:
    data = json.loads(SOURCE.read_text())
    body = json.dumps(data, indent=2)
    body = "\n".join(
        ("  " + line) if line.strip() else line for line in body.split("\n")
    ).lstrip()
    TARGET.write_text(HEADER + "window.DEPTH_CHART = " + body + ";\n")
    print(f"wrote {TARGET.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
