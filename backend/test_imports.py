#!/usr/bin/env python3
"""Test that all Python modules import correctly."""

import sys
import importlib

# List of modules to test
modules_to_test = [
    "app.config",
    "app.database",
    "app.main",
    "app.models.signal",
    "app.models.trend",
    "app.models.user",
    "services.ingestion.reddit_scraper",
]

print("Testing module imports...\n")

success_count = 0
fail_count = 0

for module_name in modules_to_test:
    try:
        module = importlib.import_module(module_name)
        print(f"SUCCESS: {module_name}")
        success_count += 1
    except ImportError as e:
        print(f"FAILED:  {module_name} - {e}")
        fail_count += 1
    except Exception as e:
        print(f"ERROR:   {module_name} - {e}")
        fail_count += 1

print(f"\nResults: {success_count} successful, {fail_count} failed")

if fail_count == 0:
    print("All modules imported successfully!")
    sys.exit(0)
else:
    print("Some modules failed to import. Please fix the errors above.")
    sys.exit(1)