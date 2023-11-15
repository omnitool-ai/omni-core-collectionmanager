/**
 * Copyright (c) 2023 MERCENARIES.AI PTE. LTD.
 * All rights reserved.
 */

import { CollectionStrategy } from './strategies/CollectionStrategy';
import { RecipeStrategy } from './strategies/RecipeStrategy';
import { ExtensionStrategy } from './strategies/ExtensionStrategy';
import { ApiStrategy } from './strategies/ApiStrategy';
import { BlockStrategy } from './strategies/BlockStrategy';
import { CollectionItem, CollectionType } from './types';
import { OmniSDKClient } from 'omni-sdk';

export class CollectionContext {
  strategy!: CollectionStrategy;
  sdk: OmniSDKClient;

  constructor(type: CollectionType, sdk: OmniSDKClient) {
    this.sdk = sdk;
    if (type === 'recipe') {
      this.strategy = new RecipeStrategy();
    } else if (type === 'extension') {
      this.strategy = new ExtensionStrategy();
    } else if (type === 'api') {
      this.strategy = new ApiStrategy();
    } else if (type === 'block') {
      this.strategy = new BlockStrategy();
    } else {
      console.log('Collection type not supported');
    }
  }

  getIconPath(item: CollectionItem): string | null {
    return this.strategy.getIconPath(item.value);
  }

  clickToAction(item: CollectionItem): void {
    this.strategy.clickToAction(item.value, this.sdk);
  }

  openChat(item: CollectionItem) {
    if (this.strategy.openChat) {
      this.strategy.openChat(item.value, this.sdk);
    } else {
      console.log('openChat is not implemented for this collection type');
    }
  }

  openFormIO(item: CollectionItem) {
    if (this.strategy.openFormIO) {
      this.strategy.openFormIO(item.value, this.sdk);
    } else {
      console.log('openFormIO is not implemented for this collection type');
    }
  }

  update(item: CollectionItem) {
    if (this.strategy.update) {
      this.strategy.update(item.value, this.sdk);
    } else {
      console.log('update is not implemented for this collection type');
    }
  }

  getFavoriteKey(item: CollectionItem) {
    if (this.strategy.getFavoriteKey) {
      return this.strategy.getFavoriteKey(item.value);
    } else {
      console.log('getFavoriteKey is not implemented for this collection type');
      return '';
    }
  }
}
