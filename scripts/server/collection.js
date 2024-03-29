/**
 * Copyright (c) 2023 MERCENARIES.AI PTE. LTD.
 * All rights reserved.
 */

import { User } from 'omni-shared';

const script = {
  name: 'collection',

  exec: async function (ctx, payload) {
    let limit = payload.limit || 50;
    let cursor = payload.cursor || 0;
    let type = payload.type || undefined;
    let recipeOwner = payload.recipeOwner || undefined;
    let filter = payload.filter || '';
    
    if (type === 'recipe') {
      ctx.user.recipeOwner = recipeOwner;
      return this.handleRecipe(ctx, filter, limit, cursor);
    }
    else if (type === 'block') {
      return await this.handleBlock(ctx, filter, limit, cursor);
    } else if (type === 'extension') {
      return await this.handleExtension(ctx, filter, limit, cursor);
    } else if (type === 'api') {
      return await this.handleApi(ctx, filter, limit, cursor);
    }
  },

  handleRecipe: async function (ctx, filter, limit, cursor) {
    const workflowIntegration = ctx.app.integrations.get('workflow');
    const page = parseInt(cursor / limit);
    const result = await workflowIntegration.getWorkflowsForSessionUser(ctx, limit, page, filter);
    if (result.data.length === 0) {
      console.log('no result');
      return { items: [] };
    }
    let items = result.data.map(({ id, canDelete, meta, ui, owner }) => {
      const { author, created, description, name, pictureUrl, tags, template, updated, visible, category } = meta;
      return {
        value: {
          id,
          canDelete,
          author,
          created,
          description,
          name,
          pictureUrl,
          tags,
          template,
          updated,
          ui,
          owner,
          visible,
          category
        },
        type: 'recipe',
        currentPage: page,
        totalPages: result.totalPage
      };
    });
    items = items.filter((item) => item.value.visible !== false);
    items = items.map((item) => {
      if (!ctx.app.extensions.has('omni-extension-wa-chat-ui') && item.value?.ui?.chat?.enabled) {
        item.value.ui.chat.enabled = false;
      }
      if (!ctx.app.extensions.has('omni-core-formio') && item.value?.ui?.formIO?.enabled) {
        item.value.ui.formIO.enabled = false;
      }
      return item;
    });
    return {
      items
    };
  },
  handleBlock: async function (ctx, filter, limit, cursor) {
    const blockManager = ctx.app.blocks;
    const opts = { contentMatch: filter, tags: '' };
    let items = blockManager.getFilteredBlocksAndPatches(limit, cursor, filter, opts);
    if (items != null && Array.isArray(items) && items.length > 0) {
      items = items.map((n) => {
        return {

          value: { ...n[1], id: n[0]},
          type: 'block'
        };
      });
      return { items };
    }
    // TODO handle when items is empty
    return { items: [{ type: 'block' }] };
  },
  handleExtension: async function (ctx, filter, limit, cursor) {
    const extensions = await ctx.app.extensions.getExtensionsList();

    const filteredExtensions = extensions
      .filter(({ deprecated, manifest }) => !deprecated && manifest?.title.toLowerCase().includes(filter))
      .map(({ id, manifest, url }) => {
        const { title, description, author = 'Anonymous', client, origin } = manifest;
        return {
          type: 'extension',
          value: {
            installed: ctx.app.extensions.has(id),
            canOpen: client?.addToWorkbench,
            id,
            title,
            description,
            url,
            author,
            origin
          }
        };
      });
    // Sort to put installed extensions first
    filteredExtensions.sort((a, b) => b.value.installed - a.value.installed);

    // Paginate the results
    const paginatedItems = filteredExtensions.slice(cursor, cursor + limit);

    return { items: paginatedItems };
  },
  handleApi: async function (ctx, filter, limit, cursor) {
    const blockManager = ctx.app.blocks;
    const credentialService = ctx.app.services.get('credentials');
    // TODO: move to block manager
    const signUpUrlSet = {
      openai: 'https://platform.openai.com/account/api-keys',
      civitai: 'https://civitai.com/',
      'd-id': 'https://www.d-id.com/',
      deepl: 'https://www.deepl.com/',
      elevenlabs: 'https://elevenlabs.io/',
      getimg: 'https://getimg.ai/tools/api',
      github: 'https://github.com/',
      huggingface: 'https://huggingface.co/',
      paperless: 'https://docs.paperless-ngx.com/',
      perplexity: 'https://www.perplexity.ai/',
      replicate: 'https://replicate.com/account/api-tokens',
      stability: 'https://platform.stability.ai/account/keys',
      textsynth: 'https://textsynth.com/',
      uberduck: 'https://app.uberduck.ai/settings',
      unsplash: 'https://unsplash.com/developers'
    };
    let items = blockManager.getAllNamespaces();
    if (filter?.length > 0) {
      items = items.filter((n) => n.namespace.includes(filter));
    }
    const priority = ['openai', 'replicate'];
    items.sort((a, b) => {
      const isAPriority = priority.includes(a.namespace);
      const isBPriority = priority.includes(b.namespace);
      // If a is one of the priority values and b is not, a should come first
      if (isAPriority && !isBPriority) return -1;
      // If b is one of the priority values and a is not, b should come first
      if (isBPriority && !isAPriority) return 1;
      // If neither or both a and b are priority values, use the original logic
      a.namespace.localeCompare(b.namespace);
    });
    const keys = await credentialService.listKeyMetadata(ctx.userId, User.modelName);
    if (items != null && Array.isArray(items) && items.length > 0) {
      const keysSet = new Set(keys.filter((k) => k.meta?.revoked === false).map((key) => key.apiNamespace));
      items = items.reduce((acc, n) => {
        const requiredKeys = blockManager.getRequiredCredentials(n.namespace);
        if (requiredKeys?.length > 0) {
          // TODO: handle multiple keys
          const key = requiredKeys[0];
          const hasKey = keysSet.has(n.namespace);
          const signUpUrl = signUpUrlSet[n.namespace] ?? null;
          acc.push({
            value: { ...n, key, hasKey, signUpUrl },
            type: 'api'
          });
        }
        return acc;
      }, []);
      return { items };
    }
  }
};

export default script;
