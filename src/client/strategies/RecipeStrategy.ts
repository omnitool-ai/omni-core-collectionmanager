/**
 * Copyright (c) 2023 MERCENARIES.AI PTE. LTD.
 * All rights reserved.
 */

import { CollectionStrategy } from './CollectionStrategy';
import { CollectionItem } from '../types';
import { OmniSDKClient } from 'omni-sdk';

export class RecipeStrategy implements CollectionStrategy {
  getFavoriteKey(item: CollectionItem): string {
    return 'fav-' + item.type + item.value.id;
  }

  getIconPath(item: CollectionItem): string | null {
    if (item.value.pictureUrl) {
      return '/extensions/omni-core-recipes/assets/recipe-cover/' + item.value.pictureUrl;
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
        name: item.value.name,
        description: item.value.description,
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
        title: '▶️' + item.value.name,
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
