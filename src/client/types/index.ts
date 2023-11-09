/**
 * Copyright (c) 2023 MERCENARIES.AI PTE. LTD.
 * All rights reserved.
 */

export type CollectionType = 'block' | 'recipe' | 'extension' | 'api';

interface BaseCollectionValue {
  id: string;
  name: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  starred: boolean;
  setData: (item: CollectionItem) => void;
}

interface Recipe extends BaseCollectionValue {
  author: string;
  pictureUrl: string;
  canDelete: boolean;
  created: Date | null;
  updated: Date | null;
  deleted: boolean;
  createdDate: string | null;
  updatedDate: string | null;
}

interface Extension extends BaseCollectionValue {
  author: string;
  installed: boolean;
  canOpen: boolean;
  isCore: boolean;
  isLocal: boolean;
  url: string;
}

interface Block extends BaseCollectionValue {
  // ... (any attributes unique to Block)
}

interface Api extends BaseCollectionValue {
  namespace: string;
  basePath: string;
  signUpUrl: string;
  url: string;
  key: Map<string, string>;
}

export type CollectionValue = Recipe | Extension | Block | Api;
export type CollectionItem = { type: CollectionType; value: CollectionValue; };

