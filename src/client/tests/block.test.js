/**
 * Copyright (c) 2023 MERCENARIES.AI PTE. LTD.
 * All rights reserved.
 */

import { describe, it, expect } from 'vitest';
import { BlockStrategy } from '../strategies/BlockStrategy';

describe('block - getIconPath', () => {
  it('should return the logo of the namespace if it is not generated from extensions', () => {
    const strategy = new BlockStrategy();
    const item = {
      type: 'block',
      value: {
        name: 'block.abc'
      }
    };
    expect(strategy.getIconPath(item.value)).toBe('/logos/block.png');
  });

  it('should return the logo of the extension if it is generated from the extension', () => {
    const strategy = new BlockStrategy();
    const item = {
      type: 'block',
      value: {
        name: 'omni-test-extension:abc.def'
      }
    };
    expect(strategy.getIconPath(item.value)).toBe('/extensions/omni-test-extension/logo.png');
  });
});
