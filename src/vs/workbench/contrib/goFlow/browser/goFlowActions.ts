/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize2 } from '../../../../nls.js';
import { Categories } from '../../../../platform/action/common/actionCommonCategories.js';
import { Action2, MenuId } from '../../../../platform/actions/common/actions.js';
import { ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { IAuxiliaryWindowService, AuxiliaryWindowMode } from '../../../services/auxiliaryWindow/browser/auxiliaryWindowService.js';
import { IExtensionService } from '../../../services/extensions/common/extensions.js';
import { IDialogService } from '../../../../platform/dialogs/common/dialogs.js';
import { Codicon } from '../../../../base/common/codicons.js';

// --- Open GoFlow Window

export class OpenGoFlowWindowAction extends Action2 {

	static readonly ID = 'workbench.action.openGoFlowWindow';

	constructor() {
		super({
			id: OpenGoFlowWindowAction.ID,
			title: localize2('openGoFlowWindow', "Open GoFlow Window"),
			category: Categories.View,
			f1: true,
			icon: Codicon.window, // Fallback to window icon
			menu: {
				id: MenuId.LayoutControlMenu,
				group: '0_workbench_layout',
				order: -1
			}
		});
	}

	async run(accessor: ServicesAccessor): Promise<void> {
		const extensionService = accessor.get(IExtensionService);
		const dialogService = accessor.get(IDialogService);
		const auxiliaryWindowService = accessor.get(IAuxiliaryWindowService);

		// Check for Go extension
		const goExtensionId = 'golang.go';
		const extension = await extensionService.getExtension(goExtensionId);

		if (!extension) {
			dialogService.error('The GoFlow window requires the Go extension (golang.go) to be installed and enabled.');
			return;
		}

		const auxiliaryWindow = await auxiliaryWindowService.open({
			nativeTitlebar: false,
			mode: AuxiliaryWindowMode.Maximized
		});

		if (auxiliaryWindow) {
			const container = auxiliaryWindow.container;

			// Styles
			container.style.display = 'flex';
			container.style.alignItems = 'center';
			container.style.justifyContent = 'center';
			container.style.width = '100%';
			container.style.height = '100%';
			container.style.backgroundColor = 'var(--vscode-editor-background)';
			container.style.color = 'var(--vscode-editor-foreground)';

			const title = document.createElement('h1');
			title.textContent = 'Hello world';
			title.style.fontSize = '3em';
			title.style.fontWeight = '300';
			container.appendChild(title);
		}
	}
}
