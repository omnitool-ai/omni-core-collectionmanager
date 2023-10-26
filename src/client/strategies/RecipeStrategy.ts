/**
 * Copyright (c) 2023 MERCENARIES.AI PTE. LTD.
 * All rights reserved.
 */

import { CollectionStrategy } from "./CollectionStrategy";
import { CollectionItem } from "../types";

export class RecipeStrategy implements CollectionStrategy {
    getIconPath(item: CollectionItem): string | null{
      if (item.value.meta.pictureUrl) {
        return '/extensions/omni-core-recipes/assets/recipe-cover/' + item.value.meta.pictureUrl;
      } else {
        return '/omni.png';
      }
    }
  }