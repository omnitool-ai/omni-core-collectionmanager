/**
 * Copyright (c) 2023 MERCENARIES.AI PTE. LTD.
 * All rights reserved.
 */

import { CollectionStrategy } from "./CollectionStrategy";
import { CollectionItem } from "../types";

export class ExtensionStrategy implements CollectionStrategy {
    getIconPath(item: CollectionItem): string | null {
      return '/extensions/' + item.value.id + '/logo.png';
    }
  }