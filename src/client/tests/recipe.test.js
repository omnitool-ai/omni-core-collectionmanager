/**
 * Copyright (c) 2023 MERCENARIES.AI PTE. LTD.
 * All rights reserved.
 */

import { describe, it, expect } from 'vitest';
import { RecipeStrategy } from '../strategies/RecipeStrategy';

describe('recipe - getIconPath', () => {
  it('should return correct path for recipe type', () => {
    const strategy = new RecipeStrategy();
    const item = {
      type: 'recipe',
      value: {
        pictureUrl: 'sample.jpg'
      }
    };
    expect(strategy.getIconPath(item)).toBe('/extensions/omni-core-recipes/assets/recipe-cover/sample.jpg');
  });

  it('should return default path for recipe type if pictureUrl is missing', () => {
    const strategy = new RecipeStrategy();
    const item = {
      type: 'recipe',
      value: {
      }
    };
    expect(strategy.getIconPath(item)).toBe('/omni.png');
  });
});
