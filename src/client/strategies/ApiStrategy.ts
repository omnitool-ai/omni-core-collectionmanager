/**
 * Copyright (c) 2023 MERCENARIES.AI PTE. LTD.
 * All rights reserved.
 */

import { CollectionItem } from "../types";
import { CollectionStrategy } from "./CollectionStrategy";

export class ApiStrategy implements CollectionStrategy {
    getIconPath(item: CollectionItem): string | null {
        return '/logos/'+ item.value.namespace + '.png';
    }
}