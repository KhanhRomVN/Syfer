/*--------------------------------------------------------------------------------------
 *  Copyright 2025 Glass Devtools, Inc. All rights reserved.
 *  Licensed under the Apache License, Version 2.0. See LICENSE.txt for more information.
 *--------------------------------------------------------------------------------------*/

import { ProxyChannel } from '../../../../base/parts/ipc/common/ipc.js';
import { registerSingleton, InstantiationType } from '../../../../platform/instantiation/common/extensions.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { IMainProcessService } from '../../../../platform/ipc/common/mainProcessService.js';
import { SyferCheckUpdateRespose } from './syferUpdateServiceTypes.js';



export interface ISyferUpdateService {
	readonly _serviceBrand: undefined;
	check: (explicit: boolean) => Promise<SyferCheckUpdateRespose>;
}


export const ISyferUpdateService = createDecorator<ISyferUpdateService>('SyferUpdateService');


// implemented by calling channel
export class SyferUpdateService implements ISyferUpdateService {

	readonly _serviceBrand: undefined;
	private readonly syferUpdateService: ISyferUpdateService;

	constructor(
		@IMainProcessService mainProcessService: IMainProcessService, // (only usable on client side)
	) {
		// creates an IPC proxy to use metricsMainService.ts
		this.syferUpdateService = ProxyChannel.toService<ISyferUpdateService>(mainProcessService.getChannel('void-channel-update'));
	}


	// anything transmitted over a channel must be async even if it looks like it doesn't have to be
	check: ISyferUpdateService['check'] = async (explicit) => {
		const res = await this.syferUpdateService.check(explicit)
		return res
	}
}

registerSingleton(ISyferUpdateService, SyferUpdateService, InstantiationType.Eager);


