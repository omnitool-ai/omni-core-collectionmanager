/**
 * Copyright (c) 2023 MERCENARIES.AI PTE. LTD.
 * All rights reserved.
 */

import { EObjectAction } from 'omni-shared';

const script = {
  name: 'delete',
  permission: async function (ctx, ability, payload) {
    const type = payload.type;
    if (type === 'recipe') {
      const id = payload.id;
      const integration = ctx.app.integrations.get('workflow');
      const workflow = await integration.getRecipe(payload.id, ctx.userId, false);
      if (!workflow || !ability.can(EObjectAction.DELETE, workflow)) {
        throw new Error('Insufficient permissions to delete the recipe');
      }
    }
  },
  exec: async function (ctx, payload) {
    let type = payload.type || undefined;
    if (type === 'recipe') {
      let result = false;
      const integration = ctx.app.integrations.get('workflow');
      const workflow = await integration.getRecipe(payload.id, ctx.userId, false /*allowPublic: false*/);
      if (workflow) {
        result = await integration.deleteWorkflow(workflow);
        if (result) {
          const deletedItem = [workflow.id];
          return deletedItem;
        } else {
          console.error('Failed to delete the recipe');
          return null;
        }
      } else {
        console.error('Failed to delete the recipe');
        return null;
      }
    } else {
      console.error('delete is not supported for this type');
      return null;
    }
  }
};

export default script;
