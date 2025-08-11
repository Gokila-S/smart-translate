import sys
import json
import os
import traceback

"""
Offline translation using Argos Translate (free, open-source).
First run for a language will download its model package (free, no API key).
Usage:
    python translator.py <lang> <input_file>
    python translator.py <lang> --text "Some text to translate"
Prints JSON to stdout: {"translated": "..."} or {"error": "message"}
Supported target_lang_code: hi, mr, bn, gu, ta, te
"""

SUPPORTED = {"hi", "mr", "bn", "gu", "ta", "te"}


def bootstrap(lang_to: str):
    import argostranslate.package as pkg
    import argostranslate.translate as trans

    # Check installed packages directly (avoids API differences)
    try:
        installed_packages = pkg.get_installed_packages()
    except Exception as e:
        installed_packages = []
        print(f"[translator] Could not list installed packages: {e}", file=sys.stderr)

    for p in installed_packages:
        if getattr(p, 'from_code', None) == 'en' and getattr(p, 'to_code', None) == lang_to:
            return  # already installed

    # Need to install
    try:
        available = pkg.get_available_packages()
    except Exception as e:
        print(f"[translator] get_available_packages failed: {e}", file=sys.stderr)
        print(json.dumps({"error": f"Discovery failed: {e}"}))
        sys.exit(1)

    match = None
    for p in available:
        if getattr(p, 'from_code', None) == 'en' and getattr(p, 'to_code', None) == lang_to:
            match = p
            break
    if not match:
        print(json.dumps({"error": f"Language package en->{lang_to} not found."}))
        sys.exit(1)
    try:
        print(f"[translator] Downloading en->{lang_to} model (~may take time)", file=sys.stderr)
        path_downloaded = match.download()
        pkg.install_from_path(path_downloaded)
    except Exception as e:
        print(f"[translator] Install failed en->{lang_to}: {e}", file=sys.stderr)
        print(json.dumps({"error": f"Install failed: {e}"}))
        sys.exit(1)


def translate_block(text: str, lang_to: str) -> str:
    import argostranslate.translate
    # Argos works best with shorter segments; naive splitting for now.
    segments = [s for s in text.split('\n') if s.strip()]
    out_segments = []
    if len(segments) > 1:
        for seg in segments:
            out_segments.append(argostranslate.translate.translate(seg, "en", lang_to))
        return "\n".join(out_segments)
    return argostranslate.translate.translate(text, "en", lang_to)


def main():
    if len(sys.argv) < 3:
        print(json.dumps({"error": "Usage: python translator.py <lang> <input_file>|--text <text>"}))
        return
    lang = sys.argv[1]
    mode = sys.argv[2]
    if lang not in SUPPORTED:
        print(json.dumps({"error": f"Unsupported language: {lang}"}))
        return
    if mode == '--text':
        if len(sys.argv) < 4:
            print(json.dumps({"error": "No text provided after --text"}))
            return
        text = ' '.join(sys.argv[3:]).strip()
    else:
        infile = mode
        if not os.path.exists(infile):
            print(json.dumps({"error": f"Input file missing: {infile}"}))
            return
        with open(infile, "r", encoding="utf-8") as f:
            text = f.read().strip()
    if not text:
        print(json.dumps({"translated": ""}))
        return
    try:
        print(f"[translator] Bootstrapping en->{lang}", file=sys.stderr)
        bootstrap(lang)
        print(f"[translator] Translating {len(text)} chars", file=sys.stderr)
        output = translate_block(text, lang)
        print(json.dumps({"translated": output}))
    except Exception as e:
        traceback.print_exc(file=sys.stderr)
        print(json.dumps({"error": str(e)}))


if __name__ == "__main__":
    main()
