/**
 * Copyright (c) 2023 MERCENARIES.AI PTE. LTD.
 * All rights reserved.
 */

import { CollectionStrategy } from './CollectionStrategy';
import { Recipe } from '../types';
import { OmniSDKClient } from 'omni-sdk';

export class RecipeStrategy implements CollectionStrategy {
  getFavoriteKey(value: Recipe): string {
    return 'fav-recipe' + value.id;
  }

  getIconPath(value: Recipe): string | null {
    if (value.pictureUrl) {
      return '/extensions/omni-core-recipes/assets/recipe-cover/' + value.pictureUrl;
    } else {
      return '/omni.png';
    }
  }

  async clickToAction(value: Recipe, sdk: OmniSDKClient): Promise<void> {
    await sdk.openRecipeInEditor(value.id, value.version);
    sdk.close();
  }

  openChat(value: Recipe, sdk: OmniSDKClient): void {
    sdk.showExtension('omni-extension-wa-chat-ui', {
      chat: {
        id: value.id,
        name: value.name,
        description: value.description,
        image: this.getIconPath(value)
      }
    });
    sdk.close();
  }

  openFormIO(value: Recipe, sdk: OmniSDKClient): void {
    sdk.showExtension('omni-core-formio', { recipe: { id: value.id, version: undefined } }, 'render', {
      singletonHash: 'formio-' + value.id,
      winbox: {
        //@ts-ignore
        title: '▶️' + value.name,
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
