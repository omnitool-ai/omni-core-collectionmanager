/**
 * Copyright (c) 2023 MERCENARIES.AI PTE. LTD.
 * All rights reserved.
 */

import { CollectionStrategy,  } from "./strategies/CollectionStrategy";
import { RecipeStrategy } from "./strategies/RecipeStrategy";
import { ExtensionStrategy } from "./strategies/ExtensionStrategy";
import { ApiStrategy } from "./strategies/ApiStrategy"; 
import { BlockStrategy } from "./strategies/BlockStrategy"; 
import { CollectionItem, CollectionType } from "./types";

export class CollectionContext {
    strategy: CollectionStrategy;
  
    constructor(type: CollectionType) {
      if (type === 'recipe') {
        this.strategy = new RecipeStrategy();
      } else if (type === 'extension') {
        this.strategy = new ExtensionStrategy();
      } else if (type === 'api') {
        this.strategy = new ApiStrategy();
      } else if (type === 'block') {
        this.strategy = new BlockStrategy();
      }
    }
  
    getIconPath(item: CollectionItem): string | null {
      return this.strategy.getIconPath(item);
    }
  }
  