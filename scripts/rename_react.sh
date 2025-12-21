#!/bin/bash
set -e

cd src/vs/workbench/contrib/syfer/browser/react/src

# Rename directories
[ -d syfer-editor-widgets-tsx ] && mv syfer-editor-widgets-tsx syfer-editor-widgets-tsx
[ -d syfer-onboarding ] && mv syfer-onboarding syfer-onboarding
[ -d syfer-settings-tsx ] && mv syfer-settings-tsx syfer-settings-tsx
[ -d syfer-tooltip ] && mv syfer-tooltip syfer-tooltip

# Rename files
cd syfer-editor-widgets-tsx/
[ -f SyferCommandBar.tsx ] && mv SyferCommandBar.tsx SyferCommandBar.tsx
[ -f SyferSelectionHelper.tsx ] && mv SyferSelectionHelper.tsx SyferSelectionHelper.tsx
cd ..

cd syfer-onboarding/
[ -f SyferOnboarding.tsx ] && mv SyferOnboarding.tsx SyferOnboarding.tsx
cd ..

# cd syfer-settings-tsx/
# [ -f SyferSettings.tsx ] && mv SyferSettings.tsx SyferSettings.tsx
# cd ..

cd syfer-tooltip/
[ -f SyferTooltip.tsx ] && mv SyferTooltip.tsx SyferTooltip.tsx
cd ..

echo "React renames complete."
