/**
 * Copyright (c) 2023 MERCENARIES.AI PTE. LTD.
 * All rights reserved.
 */

import { CollectionStrategy } from './CollectionStrategy';
import { Extension } from '../types';
import { OmniSDKClient } from 'omni-sdk';

export class ExtensionStrategy implements CollectionStrategy {
  getFavoriteKey(value: Extension): string {
    return 'fav-extension' + value.id;
  }  

  getIconPath(value: Extension): string | null {
    return '/extensions/' + value.id + '/logo.png';
  }

  async clickToAction(value: Extension, sdk: OmniSDKClient):  Promise<void> {
    if (value.installed) {
      sdk.showExtension(value.id, {}, undefined,{}, 'open')
    } else {
      await sdk.runClientScript('extensions', ['add', value.url]);
    }
  }

  async update(value: Extension, sdk: OmniSDKClient): Promise<void> {
    await sdk.runClientScript('extensions',['update', value.id]);
  }
}
