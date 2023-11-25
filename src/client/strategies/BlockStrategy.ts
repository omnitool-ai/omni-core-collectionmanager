/**
 * Copyright (c) 2023 MERCENARIES.AI PTE. LTD.
 * All rights reserved.
 */

import { OmniSDKClient } from 'omni-sdk';
import { Block } from '../types';
import { CollectionStrategy } from './CollectionStrategy';

export class BlockStrategy implements CollectionStrategy {
  getFavoriteKey(value: Block): string {
    return 'fav-block' + value.name;
  }

  getIconPath(value: Block): string | null {
    const names = value?.name?.split('.');


    if (names && names.length > 1) {
      //if name starts with 'local-' or testing, strip it
      const logo = names[0].replace(/^local-|^testing-/, '');

      if (logo.includes(':')) {
        return '/extensions/' + names[0].split(':')[0] + '/logo.png';
      } else {
        return '/extensions/omni-core-blocks/logos/' + logo + '.png';
      }
    }
    return null;
  }
  async clickToAction(value: Block, sdk: OmniSDKClient): Promise<void> {
    console.log(await sdk.runClientScript('add', [value.name]));
  }
}
