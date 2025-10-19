import sys
import json
#!/usr/bin/env python3
"""
DEPRECATED: server/translator.py

This file previously provided offline translation via Argos Translate.
It's intentionally disabled and no longer used by the server.

If you need offline Argos support again, restore the original file from
version control and re-add `argostranslate` to `requirements.txt`.
"""

import sys

print("translator.py is deprecated and disabled. Use the server's online translate endpoints.", file=sys.stderr)
sys.exit(1)

