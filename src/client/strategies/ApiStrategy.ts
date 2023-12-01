/**
 * Copyright (c) 2023 MERCENARIES.AI PTE. LTD.
 * All rights reserved.
 */

import { OmniSDKClient } from 'omni-sdk';
import { Api } from '../types';
import { CollectionStrategy } from './CollectionStrategy';

export class ApiStrategy implements CollectionStrategy {
  getFavoriteKey(value: Api): string {
    return 'fav-api' + value.id;
  }
  
  getIconPath(value: Api): string | null {
    return '/extensions/omni-core-blocks/logos/' + value.namespace + '.png';
  }

  async clickToAction(value: Api, sdk: OmniSDKClient): Promise<void> {
    if (value.hasKey) {
      value.hasKey = !value.hasKey; // Toggle on click
      const response = await sdk.runClientScript('revokeKey', [value.namespace, value.key.id]);
      value.hasKey = !response.answer; // Set to server value
    } else {
      value.hasKey = !value.hasKey; // Toggle on click
      const response = await sdk.runClientScript('setKey', [
        value.namespace,
        value.key.id,
        value.key.secret
      ]);
      value.hasKey = response.answer; // Set to server value
    }
  }
}
