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

export interface Recipe extends BaseCollectionValue {
  author: string;
  pictureUrl: string;
  canDelete: boolean;
  created: Date | null;
  updated: Date | null;
  deleted: boolean;
  createdDate: string | null;
  updatedDate: string | null;
  template: boolean;
  version: string;
}

export interface Extension extends BaseCollectionValue {
  author: string;
  installed: boolean;
  canOpen: boolean;
  isCore: boolean;
  isLocal: boolean;
  url: string;
  origin: string;
}

export interface Block extends BaseCollectionValue {
  // ... (any attributes unique to Block)
}

export interface Api extends BaseCollectionValue {
  namespace: string;
  basePath: string;
  signUpUrl: string;
  url: string;
  key: Map<string, string>;
  hasKey: boolean;
}

export type CollectionValue = Recipe | Extension | Block | Api;
export type CollectionItem = { type: CollectionType; value: CollectionValue; };

