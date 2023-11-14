/**
 * Copyright (c) 2023 MERCENARIES.AI PTE. LTD.
 * All rights reserved.
 */

import { CollectionStrategy } from './CollectionStrategy';
import { CollectionItem } from '../types';
import { OmniSDKClient } from 'omni-sdk';

export class ExtensionStrategy implements CollectionStrategy {
  getFavoriteKey(item: CollectionItem): string {
    return 'fav-' + item.type + item.value.id;
  }  

  getIconPath(item: CollectionItem): string | null {
    return '/extensions/' + item.value.id + '/logo.png';
  }

  async clickToAction(item: CollectionItem, sdk: OmniSDKClient):  Promise<void> {
    if (item.value.installed) {
      sdk.showExtension(item.value.id, {}, undefined,{}, 'open')
    } else {
      await sdk.runClientScript('extensions', ['add', item.value.url]);
    }
  }

  async update(item: CollectionItem, sdk: OmniSDKClient): Promise<void> {
    await sdk.runClientScript('extensions',['update', item.value.id]);
  }
}
