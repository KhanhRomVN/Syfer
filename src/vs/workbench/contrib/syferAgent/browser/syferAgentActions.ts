/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize2 } from '../../../../nls.js';
import { Categories } from '../../../../platform/action/common/actionCommonCategories.js';
import { Action2, MenuId } from '../../../../platform/actions/common/actions.js';
import { ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { IAuxiliaryWindowService, AuxiliaryWindowMode } from '../../../services/auxiliaryWindow/browser/auxiliaryWindowService.js';
import { INativeHostService } from '../../../../platform/native/common/native.js';
import { Codicon } from '../../../../base/common/codicons.js';

// --- Open Hello World Window

export class OpenHelloWorldWindowAction extends Action2 {

	static readonly ID = 'workbench.action.openHelloWorldWindow';

	constructor() {
		super({
			id: OpenHelloWorldWindowAction.ID,
			title: localize2('openHelloWorldWindow', "Open Hello World Window"),
			category: Categories.View,
			f1: true,
			icon: Codicon.window,
			menu: {
				id: MenuId.LayoutControlMenu,
				group: '0_workbench_layout',
				order: -1
			}
		});
	}

	async run(accessor: ServicesAccessor): Promise<void> {
		const auxiliaryWindowService = accessor.get(IAuxiliaryWindowService);

		const auxiliaryWindow = await auxiliaryWindowService.open({
			nativeTitlebar: false,
			mode: AuxiliaryWindowMode.Maximized
		});

		if (auxiliaryWindow) {
			const container = auxiliaryWindow.container;

			// Main Layout
			container.style.display = 'flex';
			container.style.flexDirection = 'row';
			container.style.width = '100%';
			container.style.height = '100%';
			// Use CSS variables for theme synchronization
			container.style.backgroundColor = 'var(--vscode-editor-background)';
			container.style.color = 'var(--vscode-editor-foreground)';

			// --- Left Sidebar ---
			const sidebar = document.createElement('div');
			sidebar.style.width = '300px';
			sidebar.style.height = '100%';
			sidebar.style.borderRight = '1px solid var(--vscode-panel-border)';
			sidebar.style.display = 'flex';
			sidebar.style.flexDirection = 'column';
			sidebar.style.overflowY = 'auto'; // allow scrolling
			sidebar.style.padding = '10px';
			sidebar.style.boxSizing = 'border-box';
			container.appendChild(sidebar);

			const sidebarTitle = document.createElement('h3');
			sidebarTitle.textContent = 'Running Editors';
			sidebarTitle.style.marginBottom = '15px';
			sidebarTitle.style.borderBottom = '1px solid var(--vscode-panel-border)';
			sidebarTitle.style.paddingBottom = '5px';
			sidebar.appendChild(sidebarTitle);

			// --- Main Content ---
			const mainContent = document.createElement('div');
			mainContent.style.flex = '1';
			mainContent.style.height = '100%';
			mainContent.style.display = 'flex';
			mainContent.style.alignItems = 'center';
			mainContent.style.justifyContent = 'center';
			container.appendChild(mainContent);

			const title = document.createElement('h1');
			title.textContent = 'Hello world';
			title.style.fontSize = '3em';
			title.style.fontWeight = '300';
			mainContent.appendChild(title);

			// --- Process Discovery Logic ---
			this.listRunningEditors(sidebar, accessor);
		}
	}

	private listRunningEditors(sidebarContainer: HTMLElement, accessor: ServicesAccessor) {
		const nativeHostService = accessor.get(INativeHostService);
		const loading = document.createElement('div');
		loading.textContent = 'Scanning processes...';
		sidebarContainer.appendChild(loading);

		// Common editor binaries/names to look for
		const knownEditors = ['code', 'code-oss', 'cursor', 'windsurf', 'syfer', 'void', 'antigravity'];

		// Linux: ps -axww -o pid=,command=
		// We fetch all processes and look for arguments that look like workspace paths
		nativeHostService.exec2('ps -axww -o pid=,command=').then(stdout => {
			if (sidebarContainer.contains(loading)) {
				sidebarContainer.removeChild(loading);
			}

			const lines = stdout.toString().split('\n');
			const runningInstances: { name: string; pid: string; path: string }[] = [];
			const seenPaths = new Set<string>();

			for (const line of lines) {
				const trimmed = line.trim();
				if (!trimmed) continue;

				const firstSpace = trimmed.indexOf(' ');
				if (firstSpace === -1) continue;

				const pid = trimmed.substring(0, firstSpace);
				const command = trimmed.substring(firstSpace).trim();

				// Skip if command doesn't contain any known editor string (optimization)
				if (!knownEditors.some(e => command.includes(e))) continue;

				// 1. Check for explicit workspace arguments (common in Electron apps/Language Servers)
				// Patterns: --workspace_id file_PATH, --folder-uri file://PATH, --folder PATH
				let detectedPath = '';
				let detectedName = '';

				// Identify likely app name
				for (const editorName of knownEditors) {
					if (command.includes(editorName)) {
						detectedName = editorName;
						break;
					}
				}

				if (!detectedName) continue;

				// Regex for --workspace_id file_path
				const workspaceIdMatch = /--workspace_id\s+file_([a-zA-Z0-9_\-\.\/]+)/.exec(command);
				if (workspaceIdMatch) {
					// Decode path: underscores often replace slashes or just raw path
					// Usually: file_home_user_project -> file:///home/user/project (approx)
					// But log showed: file_home_khanhromvn_Documents... which maps to /home/khanhromvn/Documents...
					// A safer bet is searching for the absolute path pattern in the raw command

					// Let's try to extract the known path part
					detectedPath = '/' + workspaceIdMatch[1].replace(/_/g, '/'); // Rough unescaping
					// Fix simplistic unescaping if needed, but usually --workspace_id is for tracking
				}

				// Regex for standard file path arguments (absolute paths)
				// Look for strings starting with /home or /Users (mac) that are not inside other args
				// This matches: /home/user/project
				if (!detectedPath) {
					const pathMatch = /\s(\/[a-zA-Z0-9_\-\.\/]+)/g;
					let match;
					while ((match = pathMatch.exec(command)) !== null) {
						const p = match[1];
						// Heuristics to avoid binary paths or system paths
						if (p.startsWith('/usr/') || p.startsWith('/bin/') || p.startsWith('/lib/') || p.startsWith('/proc/') || p.startsWith('/sys/') || p.startsWith('/dev/') || p.includes('.config') || p.includes('/extensions/') || p.includes('node_modules')) {
							continue;
						}
						// If path looks like a user project folder
						if (p.split('/').length > 3) { // /home/user/something
							detectedPath = p;
							break; // Take the first valid looking project path
						}
					}
				}

				if (detectedPath && !seenPaths.has(detectedPath)) {
					seenPaths.add(detectedPath);
					runningInstances.push({
						name: detectedName,
						pid: pid,
						path: detectedPath
					});
				}
			}

			// Render Cards
			if (runningInstances.length === 0) {
				const emptyMsg = document.createElement('div');
				emptyMsg.textContent = 'No scanned running editors with folders found. Try opening a folder in VS Code/Cursor.';
				sidebarContainer.appendChild(emptyMsg);
			} else {
				runningInstances.forEach(instance => {
					const card = document.createElement('div');
					card.style.border = '1px solid var(--vscode-panel-border)';
					card.style.borderRadius = '5px';
					card.style.padding = '8px';
					card.style.marginBottom = '8px';
					card.style.backgroundColor = 'var(--vscode-editor-background)';
					card.style.cursor = 'pointer';

					const nameEl = document.createElement('div');
					nameEl.style.fontWeight = 'bold';
					nameEl.textContent = instance.name.toUpperCase();

					const pathEl = document.createElement('div');
					pathEl.style.fontSize = '0.9em';
					pathEl.style.opacity = '0.8';
					pathEl.style.whiteSpace = 'nowrap';
					pathEl.style.overflow = 'hidden';
					pathEl.style.textOverflow = 'ellipsis';
					pathEl.textContent = instance.path;
					pathEl.title = instance.path;

					card.appendChild(nameEl);
					card.appendChild(pathEl);

					// Hover effect
					card.onmouseenter = () => { card.style.backgroundColor = 'var(--vscode-list-hoverBackground)'; };
					card.onmouseleave = () => { card.style.backgroundColor = 'var(--vscode-editor-background)'; };

					sidebarContainer.appendChild(card);
				});
			}
		}).catch(error => {
			// clean loading if error
			if (sidebarContainer.contains(loading)) {
				sidebarContainer.removeChild(loading);
			}
			const errorMsg = document.createElement('div');
			errorMsg.textContent = 'Error scanning processes.';
			sidebarContainer.appendChild(errorMsg);
			console.error('Process detection failed', error);
		});
	}
}
