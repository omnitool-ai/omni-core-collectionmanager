/**
 * Copyright (c) 2023 MERCENARIES.AI PTE. LTD.
 * All rights reserved.
 */

import { OmniSDKClient } from 'omni-sdk';
import { CollectionItem } from '../types';

export interface CollectionStrategy {
    getFavoriteKey(item: CollectionItem): string;
    getIconPath(item: CollectionItem): string | null;
    clickToAction(item: CollectionItem, sdk: OmniSDKClient): Promise<void>;
    openChat?(item: CollectionItem, sdk: OmniSDKClient): void;
    openFormIO?(item: CollectionItem, sdk: OmniSDKClient): void;
    update?(item: CollectionItem, sdk: OmniSDKClient): Promise<void>;
}
  