/**
 * Copyright (c) 2023 MERCENARIES.AI PTE. LTD.
 * All rights reserved.
 */

import { CollectionItem } from '../types';

export interface CollectionStrategy {
    getIconPath(item: CollectionItem): string | null;
}
  