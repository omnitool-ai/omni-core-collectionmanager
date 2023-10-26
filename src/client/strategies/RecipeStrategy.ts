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

  async clickToAction(item: CollectionItem, sdk: OmniSDKClient): Promise<void> {
    await sdk.openRecipeInEditor(item.value.id, item.value.version);
    sdk.close();
  }

  openChat(item: CollectionItem, sdk: OmniSDKClient): void {
    sdk.showExtension('omni-extension-wa-chat-ui', {
      chat: {
        id: item.value.id,
        name: item.value.meta.name,
        description: item.value.meta.description,
        image: this.getIconPath(item)
      }
    });
    sdk.close();
  }

  openFormIO(item: CollectionItem, sdk: OmniSDKClient): void {
    sdk.showExtension('omni-core-formio', { recipe: { id: item.value.id, version: undefined } }, 'render', {
      singletonHash: 'formio-' + item.value.id,
      winbox: {
        //@ts-ignore
        title: '▶️' + item.value.meta.name,
        x: 'center',
        y: 'center',
        minheight: 500,
        minwidth: 600,
        autosize: true
      },
      hideToolbar: true
    });
    sdk.close();
  }
}
