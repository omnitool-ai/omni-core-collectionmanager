/**
 * Copyright (c) 2023 MERCENARIES.AI PTE. LTD.
 * All rights reserved.
 */

import { CollectionStrategy } from './CollectionStrategy';
import { CollectionItem } from '../types';
import { OmniSDKClient } from 'omni-sdk';

export class RecipeStrategy implements CollectionStrategy {
  getIconPath(item: CollectionItem): string | null {
    if (item.value.meta.pictureUrl) {
      return '/extensions/omni-core-recipes/assets/recipe-cover/' + item.value.meta.pictureUrl;
    } else {
      return '/omni.png';
    }
  }

  async clickToAction(item: CollectionItem, sdk: OmniSDKClient):  Promise<void> {
    await sdk.openRecipeInEditor(item.value.id, item.value.version);
    sdk.close();
  }
}
