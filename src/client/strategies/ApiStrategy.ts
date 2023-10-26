/**
 * Copyright (c) 2023 MERCENARIES.AI PTE. LTD.
 * All rights reserved.
 */

import { OmniSDKClient } from 'omni-sdk';
import { CollectionItem } from '../types';
import { CollectionStrategy } from './CollectionStrategy';

export class ApiStrategy implements CollectionStrategy {
  getIconPath(item: CollectionItem): string | null {
    return '/logos/' + item.value.namespace + '.png';
  }

  async clickToAction(item: CollectionItem, sdk: OmniSDKClient): Promise<void> {
    if (item.value.hasKey) {
      item.value.hasKey = !item.value.hasKey; // Toggle on click
      const response = await sdk.runClientScript('revokeKey', [item.value.namespace, item.value.key.id]);
      item.value.hasKey = !response.answer; // Set to server value
    } else {
      item.value.hasKey = !item.value.hasKey; // Toggle on click
      const response = await sdk.runClientScript('setKey', [
        item.value.namespace,
        item.value.key.id,
        item.value.key.secret
      ]);
      item.value.hasKey = response.answer; // Set to server value
    }
  }
}
