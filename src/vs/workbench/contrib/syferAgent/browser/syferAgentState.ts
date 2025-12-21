/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter } from '../../../../base/common/event.js';

export interface ISyferProject {
	id: string;
	name: string;
	path: string;
}

export class SyferAgentState {
	private static _instance: SyferAgentState;

	static get instance(): SyferAgentState {
		if (!this._instance) {
			this._instance = new SyferAgentState();
		}
		return this._instance;
	}

	private _projects: ISyferProject[] = [];
	private _activePanels: { [windowId: string]: string[] } = {}; // windowId -> list of projectIds

	private readonly _onDidChangeProjects = new Emitter<ISyferProject[]>();
	readonly onDidChangeProjects = this._onDidChangeProjects.event;

	private readonly _onDidChangeActivePanels = new Emitter<{ windowId: string; panelIds: string[] }>();
	readonly onDidChangeActivePanels = this._onDidChangeActivePanels.event;

	constructor() { }

	get projects(): ISyferProject[] {
		return this._projects;
	}

	addProject(project: ISyferProject) {
		if (this._projects.some(p => p.path === project.path)) {
			return;
		}
		this._projects.push(project);
		this._onDidChangeProjects.fire(this._projects);
	}

	removeProject(projectId: string) {
		this._projects = this._projects.filter(p => p.id !== projectId);
		this._onDidChangeProjects.fire(this._projects);
	}

	// Panel Management
	getActivePanels(windowId: string): string[] {
		return this._activePanels[windowId] || [];
	}

	openPanel(windowId: string, projectId: string): boolean {
		const current = this._activePanels[windowId] || [];
		if (current.includes(projectId)) {
			return true; // Already open
		}

		if (current.length >= 3) {
			return false; // Max reached
		}

		this._activePanels[windowId] = [...current, projectId];
		this._onDidChangeActivePanels.fire({ windowId, panelIds: this._activePanels[windowId] });
		return true;
	}

	closePanel(windowId: string, projectId: string) {
		const current = this._activePanels[windowId] || [];
		this._activePanels[windowId] = current.filter(id => id !== projectId);
		this._onDidChangeActivePanels.fire({ windowId, panelIds: this._activePanels[windowId] });
	}
}
