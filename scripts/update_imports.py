import os

replacements = {
    # Directory paths
    'vs/workbench/contrib/void': 'vs/workbench/contrib/syfer',
    'src/vs/workbench/contrib/void': 'src/vs/workbench/contrib/syfer',
    'contrib/void': 'contrib/syfer',
    'void_icons': 'syfer_icons',

    # React Directories (Renamed)
    'void-editor-widgets-tsx': 'syfer-editor-widgets-tsx',
    'void-onboarding': 'syfer-onboarding',
    'void-settings-tsx': 'syfer-settings-tsx',
    'void-tooltip': 'syfer-tooltip',

    # Filenames (modules)
    'voidSettingsService': 'syferSettingsService',
    'voidSettingsTypes': 'syferSettingsTypes',
    'voidModelService': 'syferModelService',
    'voidSCMTypes': 'syferSCMTypes',
    'voidUpdateService': 'syferUpdateService',
    'voidUpdateServiceTypes': 'syferUpdateServiceTypes',
    'void.contribution': 'syfer.contribution',
    'voidCommandBarService': 'syferCommandBarService',
    'voidOnboardingService': 'syferOnboardingService',
    'voidSCMService': 'syferSCMService',
    'voidSelectionHelperWidget': 'syferSelectionHelperWidget',
    'voidSettingsPane': 'syferSettingsPane',
    'voidUpdateActions': 'syferUpdateActions',
    'voidSCMMainService': 'syferSCMMainService',
    'voidUpdateMainService': 'syferUpdateMainService',

    # React / UI Components Refactoring (Filenames in imports)
    'VoidTooltip': 'SyferTooltip',
    'VoidOnboarding': 'SyferOnboarding',
    'VoidCommandBar': 'SyferCommandBar',
    'VoidSelectionHelper': 'SyferSelectionHelper',
    'VoidWarningBox': 'SyferWarningBox',

    # Types / Classes / Interfaces
    'VoidSettingsState': 'SyferSettingsState',
    'IVoidSettingsService': 'ISyferSettingsService',
    'VoidSettingsService': 'SyferSettingsService',
    'VoidStatefulModelInfo': 'SyferStatefulModelInfo',
    'VoidSettings': 'SyferSettings',

    # Constants and Action IDs
    'VOID_CTRL_': 'SYFER_CTRL_',
    'VOID_ACCEPT_': 'SYFER_ACCEPT_',
    'VOID_REJECT_': 'SYFER_REJECT_',
    'VOID_GOTO_': 'SYFER_GOTO_',
    'VOID_OPEN_': 'SYFER_OPEN_',
    'VOID_SETTINGS_STORAGE_KEY': 'SYFER_SETTINGS_STORAGE_KEY',
    'void.ctrl': 'syfer.ctrl',
    'void.accept': 'syfer.accept',
    'void.reject': 'syfer.reject',
    'void.goTo': 'syfer.goTo',
    'void.open': 'syfer.open',
    'void.settings': 'syfer.settings',
    'void.view': 'syfer.view',
    'void.app': 'syfer.app',

    # Resources and CSS
    'inno-void': 'inno-syfer',
    'media/void.css': 'media/syfer.css',
    'void-openfolder': 'syfer-openfolder',
    'void-openssh': 'syfer-openssh',
    'void-link': 'syfer-link',
    'void-settings': 'syfer-settings',
    'void-tooltip': 'syfer-tooltip',
    'void-onboarding': 'syfer-onboarding',
    'void-icon': 'syfer-icon',
    '--void-': '--syfer-',

    # CSS Classes (Additional)
    'void-scope': 'syfer-scope',
    'void-scrollable-element': 'syfer-scrollable-element',
    '--vscode-void-': '--vscode-syfer-',
    'void-sweep': 'syfer-sweep',
    'void-highlight': 'syfer-highlight',
    'void-green': 'syfer-green',
    'void-red': 'syfer-red',

    # Branding text
    'Void Editor': 'Syfer Editor',
    'Void': 'Syfer',
}

extensions = ['.ts', '.js', '.json', '.md', '.html', '.css', '.sh', '.gitignore', '.iss', '.xml', '.desktop', '.svg', '.tsx']
skip_dirs = ['node_modules', '.git', 'out', '.build', 'dist', 'extensions']

def update_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        original_content = content
        for old, new in replacements.items():
            if old == 'Void' and filepath.endswith('.ts'):
                 pass
            content = content.replace(old, new)

        if content != original_content:
            print(f"Updating {filepath}")
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
    except Exception as e:
        print(f"Skipping {filepath}: {e}")

for root, dirs, files in os.walk('.'):
    # Skip directories
    dirs[:] = [d for d in dirs if d not in skip_dirs]

    for file in files:
        if any(file.endswith(ext) for ext in extensions) or file in ['package.json', 'product.json', 'README.md', 'LICENSE.txt', '.gitignore', 'gulpfile.js']:
            filepath = os.path.join(root, file)
            update_file(filepath)

print("Replacement complete.")
