#!/bin/bash
set -e

echo "Renaming files in common..."
cd src/vs/workbench/contrib/syfer/common
[ -f syferModelService.ts ] && mv syferModelService.ts syferModelService.ts
[ -f syferSCMTypes.ts ] && mv syferSCMTypes.ts syferSCMTypes.ts
[ -f syferSettingsService.ts ] && mv syferSettingsService.ts syferSettingsService.ts
[ -f syferSettingsTypes.ts ] && mv syferSettingsTypes.ts syferSettingsTypes.ts
[ -f syferUpdateService.ts ] && mv syferUpdateService.ts syferUpdateService.ts
[ -f syferUpdateServiceTypes.ts ] && mv syferUpdateServiceTypes.ts syferUpdateServiceTypes.ts
cd ../../../../../..

echo "Renaming files in browser..."
cd src/vs/workbench/contrib/syfer/browser
[ -f syfer.contribution.ts ] && mv syfer.contribution.ts syfer.contribution.ts
[ -f syferCommandBarService.ts ] && mv syferCommandBarService.ts syferCommandBarService.ts
[ -f syferOnboardingService.ts ] && mv syferOnboardingService.ts syferOnboardingService.ts
[ -f syferSCMService.ts ] && mv syferSCMService.ts syferSCMService.ts
[ -f syferSelectionHelperWidget.ts ] && mv syferSelectionHelperWidget.ts syferSelectionHelperWidget.ts
[ -f syferSettingsPane.ts ] && mv syferSettingsPane.ts syferSettingsPane.ts
[ -f syferUpdateActions.ts ] && mv syferUpdateActions.ts syferUpdateActions.ts
cd ../../../../../..

echo "Renaming files in electron-main..."
cd src/vs/workbench/contrib/syfer/electron-main
[ -f syferSCMMainService.ts ] && mv syferSCMMainService.ts syferSCMMainService.ts
[ -f syferUpdateMainService.ts ] && mv syferUpdateMainService.ts syferUpdateMainService.ts
cd ../../../../../..

echo "Renaming main directory..."
[ -d src/vs/workbench/contrib/syfer ] && mv src/vs/workbench/contrib/syfer src/vs/workbench/contrib/syfer

echo "Renaming icons directory..."
[ -d syfer_icons ] && mv syfer_icons syfer_icons

echo "Done renaming files."
