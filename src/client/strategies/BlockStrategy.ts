/**
 * Copyright (c) 2023 MERCENARIES.AI PTE. LTD.
 * All rights reserved.
 */

import { OmniSDKClient } from 'omni-sdk';
import { CollectionItem } from '../types';
import { CollectionStrategy } from './CollectionStrategy';

export class BlockStrategy implements CollectionStrategy {
  getIconPath(item: CollectionItem): string | null {
    const names = item.value?.name?.split('.');
    if (names && names.length > 1) {
      if (names[0].includes(':')) {
        return '/extensions/' + names[0].split(':')[0] + '/logo.png';
      } else {
        return '/logos/' + names[0] + '.png';
      }
    }
    return null;
  }
  async clickToAction(item: CollectionItem, sdk: OmniSDKClient): Promise<void> {
    console.log(await sdk.runClientScript('add', [item.value.name]));
  }
}