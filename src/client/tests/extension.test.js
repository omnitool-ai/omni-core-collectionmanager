/**
 * Copyright (c) 2023 MERCENARIES.AI PTE. LTD.
 * All rights reserved.
 */

import { describe, it, expect } from 'vitest';
import { ExtensionStrategy } from '../strategies/ExtensionStrategy';

describe('extension - getIconPath', () => {
  it('should return correct path for extension type', () => {
    const strategy = new ExtensionStrategy();
    const item = {
      type: 'extension',
      value: {
        id: 'exampleId'
      }
    };
    expect(strategy.getIconPath(item)).toBe('/extensions/exampleId/logo.png');
  });
});
