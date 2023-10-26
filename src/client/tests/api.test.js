/**
 * Copyright (c) 2023 MERCENARIES.AI PTE. LTD.
 * All rights reserved.
 */

import { describe, it, expect } from 'vitest';
import { ApiStrategy } from '../strategies/ApiStrategy';

describe('api - getIconPath', () => {
  it('should return correct path for api type', () => {
    const strategy = new ApiStrategy();
    const item = {
      type: 'api',
      value: {
        namespace: 'test'
      }
    };
    expect(strategy.getIconPath(item)).toBe('/logos/test.png');
  });
});
