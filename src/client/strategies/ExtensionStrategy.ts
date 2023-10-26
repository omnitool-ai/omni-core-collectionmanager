/**
 * Copyright (c) 2023 MERCENARIES.AI PTE. LTD.
 * All rights reserved.
 */

import { CollectionStrategy } from './CollectionStrategy';
import { CollectionItem } from '../types';
import { OmniSDKClient } from 'omni-sdk';

export class ExtensionStrategy implements CollectionStrategy {
  getIconPath(item: CollectionItem): string | null {
    return '/extensions/' + item.value.id + '/logo.png';
  }

  async clickToAction(item: CollectionItem, sdk: OmniSDKClient):  Promise<void> {
    if (item.value.installed) {
      sdk.signalIntent('show', item.value.id);
    } else {
      await sdk.runClientScript('extensions', ['add', item.value.url]);
    }
  }

  async update(item: CollectionItem, sdk: OmniSDKClient): Promise<void> {
    sdk.runClientScript('extensions',['update', item.value.id]);
  }
}
