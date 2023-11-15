/**
 * Copyright (c) 2023 MERCENARIES.AI PTE. LTD.
 * All rights reserved.
 */

import { OmniSDKClient } from 'omni-sdk';
import { CollectionValue } from '../types';

export interface CollectionStrategy {
    getFavoriteKey(value: CollectionValue): string;
    getIconPath(value: CollectionValue): string | null;
    clickToAction(value: CollectionValue, sdk: OmniSDKClient): Promise<void>;
    openChat?(value: CollectionValue, sdk: OmniSDKClient): void;
    openFormIO?(value: CollectionValue, sdk: OmniSDKClient): void;
    update?(value: CollectionValue, sdk: OmniSDKClient): Promise<void>;
}
  