/**
 * Copyright (c) 2023 MERCENARIES.AI PTE. LTD.
 * All rights reserved.
 */

import Alpine from 'alpinejs';
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import DOMPurify from 'dompurify';
import { OmniSDKClient } from 'omni-sdk';
import { CollectionItem, CollectionType, Recipe, Extension, Api } from './types';
import { CollectionContext } from './CollectionContext';

const sdk = new OmniSDKClient('omni-core-collectionmanager').init();

declare global {
  interface Window {
    Alpine: typeof Alpine;
  }
}

const params = sdk.args;
let type = params?.type;
let filter = params?.filter;
const collectionContext = new CollectionContext(type, sdk);
const createGallery = function () {
  return {
    type: type,
    currentPage: 0,
    itemsPerPage: 60,
    items: new Array<CollectionItem>(),
    shadow: new Array<CollectionItem>(),
    totalPages: 1,
    multiSelectedItems: [],
    cursor: 0,
    search: filter || '',
    filterOption: '',
    isLoading: false,
    async init() {
      await this.fetchItems();
    },
    close() {
      sdk.close();
    },

    prepareFromShadow() {
      this.items = [...this.shadow];
    },
    

    async addItems(items: Array<CollectionItem>, replace = false) {
      if (replace) {
        this.items = new Array<CollectionItem>();
        this.shadow = new Array<CollectionItem>();
        this.cursor = 0;
      }

      if (items.length === 1 && items[0].type === 'block' && Object.keys(items[0]).length === 1) {
        // Special case, items is actually empty
        items = [];
      }

      this.cursor += items.length;

      this.shadow = this.shadow.concat(items);
      this.prepareFromShadow();
    },
    async fetchItems(replace = false) {
      this.isLoading = true;
      let limit = this.itemsPerPage;
      if (type !== 'recipe') {
        limit += 1; // One extra to see if we are at the end of the collection.
      }
      const body: { limit: number; cursor: number; type: CollectionType; filter: string } = {
        limit,
        type: this.type,
        cursor: replace ? 0 : this.cursor,
        filter: this.search
      };
      try {
        const data = await sdk.runExtensionScript('collection', body);
        this.addItems(data.items.slice(0, this.itemsPerPage), replace);

        if (data.hasOwnProperty('currentPage')) {
          this.currentPage = data.currentPage;
        } else {
          this.currentPage += 1;
        }
        if (data.hasOwnProperty('totalPages')) {
          this.totalPages = data.totalPages;
        } else {
          this.totalPages = data.items.length === limit ? this.currentPage + 1 : this.currentPage;
        }
      } catch (error) {
        console.error('Error fetching items:', error);
      } finally {
        this.isLoading = false;
      }
    },

    selectItem(item: CollectionItem, event?: MouseEvent) {
      // Exit early if the item has an onclick property
      if (item.onclick) {
        return;
      }

      // Deselect the item if it's already selected
      const idx = this.multiSelectedItems.indexOf(item);
      if (idx > -1) {
        this.multiSelectedItems.splice(idx, 1); // Deselect the item if it's already selected
        return;
      }

      // Handle item selection based on mouse event
      if (!event) {
        return;
      }

      switch (event.type) {
        case 'contextmenu': // multi select
          this.multiSelectedItems.push(item);
          break;
        case 'click': // select
          this.multiSelectedItems = [item];
          break;
      }
    },

    async deleteItemList(itemList: Array<CollectionItem>) {
      if (!itemList || itemList.length === 0) return;
      let deletedItemList = [];
      if (Array.isArray(itemList) && itemList.length > 0) {
        if (!confirm(`Are you sure you want to delete ${itemList.length} items?`)) {
          return;
        }
        itemList.forEach(async (i) => {
          const result = await this.deleteItem(i);
          if (result) {
            deletedItemList.push(...result);
          }
        });
        if (deletedItemList?.length > 0) {
          this.needRefresh = true;
          return deletedItemList;
        } else {
          sdk.sendChatMessage('Failed to delete item(s) ' + itemList.join(', '), 'text/plain', {}, ['error']);
          return null;
        }
      }
    },
    async deleteItem(item: CollectionItem) {
      const type = item.type;
      const payload = Alpine.raw(item.value);
      try {
        const result = await sdk.runExtensionScript('delete', { type: type, id: payload.id });
        if (result?.length > 0) {
          this.needRefresh = true;
          return result;
        } else {
          sdk.sendChatMessage('Failed to delete item(s) ' + item.value.name, 'text/plain', {}, ['error']);
          return null;
        }
      } catch (e) {
        console.error(e);
      }
    },
    async toggleFavorite(item: CollectionItem) {
      const key = collectionContext.getFavoriteKey(item);
      sdk.runClientScript('toggleFavorite', [key]);
      item.value.starred = window.localStorage.getItem(key) !== null; // Toggle.

      // TODO: The next line isn't part of the toggle logic, but appears to trigger the redraw as a side-effect.
      // Don't remove it without adding the redraw back in.
      this.starred = !this.starred;
    },
    
    getIconPath(item: CollectionItem) {
      return collectionContext.getIconPath(item);
    },
    
    needRefresh: false,
    async refresh() {
      await this.fetchItems(true);
      this.multiSelectedItems = [];
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    async applyFilter() {
      await this.refresh();
      if (this.filterOption === 'Favorites') {
        this.items = this.items.filter((item) => {
          const key = collectionContext.getFavoriteKey(item);
          return window.localStorage.getItem(key) ? true : false;
        });
      } else if (this.filterOption === 'Template') {
        this.items = this.items.filter((item) => {
          return item.value.template ? true : false;
        });
      } else if (this.filterOption === 'All') {
        // Do nothing
      }
    },
    async filteredItems() {
      this.needRefresh = false;
      await this.fetchItems(true);
      return this.items;
    }
  };
};

const buttonActions = function() {
  return {
    async addAsBlock(id: string) {
      return await sdk.runClientScript('add', ['omnitool.loop_recipe', { recipe_id: id }]);
    },
    async clickToAction(item: CollectionItem) {
      collectionContext.clickToAction(item);
    },
    openChat(item: CollectionItem) {
      collectionContext.openChat(item);
    },
    openFormIO(item: CollectionItem) {
      collectionContext.openFormIO(item);
    },
    async update(item: CollectionItem) {
      collectionContext.update(item);
    },
    copyString(str: string) {
      navigator.clipboard.writeText(str).then(
        function () {
          sdk.showToast('Copied Successfully!',{type: "success", description: str});
        },
        function (err) {
          console.error('Could not copy the string: ', err);
        }
      );
    }
  }
}

window.Alpine = Alpine;
document.addEventListener('alpine:init', async () => {
  Alpine.data('collection', () => ({
    id: '',
    name: '',
    title: '',
    description: '',
    pictureUrl: '',
    type: '',
    category: '',
    author: '',
    tags: [] as string[],
    starred: false,
    canDelete: false,
    canOpen: false,
    installed: false,
    created: null as Date | null,
    updated: null as Date | null,
    deleted: false,
    namespace: '',
    basePath: '',
    signUpUrl: '',
    url: '',
    origin: '',
    key: null as Map<string, string> | null,
    hasKey: false,
    setData(item: CollectionItem) {
      this.type = item.type;
      this.id = item.value.id;
      this.name = item.value.name;
      this.title = item.value.title;
      this.description = item.value.description;
      this.category = item.value.category;
      const key = collectionContext.getFavoriteKey(item);
      this.starred = !!window.localStorage.getItem(key);
      if (item.type === 'block') {
        this.tags = (item.value.name?.split('.') ?? []) as string[];
      } else {
        this.tags = (item.value.tags ?? []) as string[];
      }

      switch (item.type) { 
        case 'recipe':
          const recipeValue = item.value as Recipe;
          this.pictureUrl = recipeValue.pictureUrl;
          this.canDelete = recipeValue.canDelete;
          this.created = recipeValue.created;
          this.updated = recipeValue.updated;
          this.deleted = recipeValue.deleted;
          break;
        case 'extension':
          const extensionValue = item.value as Extension;
          this.author = extensionValue.author;
          this.url = extensionValue.url;
          this.origin = extensionValue.origin;
          this.canOpen = extensionValue.canOpen;
          this.installed = extensionValue.installed;
          break;
        case 'api':
          const apiValue = item.value as Api;
          this.namespace = apiValue.namespace;
          this.basePath = apiValue.api?.basePath;
          this.signUpUrl = apiValue.signUpUrl;
          this.key = apiValue.key;
          this.hasKey = apiValue.hasKey;
          this.url = apiValue.url;
          break;
        case 'block':
          break;
        default:
          // Handle or log an unexpected type
          console.warn(`Unexpected type: ${item.type}`);
      }
    },
    get createdDate() {
      return this.created ? new Date(this.created).toLocaleString() : null;
    },
    get updatedDate() {
      return this.updated ? new Date(this.updated).toLocaleString() : null;
    }
  }));

  Alpine.data('collectionManager', () => ({
    createGallery,
    buttonActions,
  }));

  Alpine.magic('tooltip', (el: HTMLElement) => (message: any) => {
    const instance = tippy(el, { content: message, trigger: 'manual' });

    instance.show();

    setTimeout(() => {
      instance.hide();

      setTimeout(() => instance.destroy(), 150);
    }, 2000);
  });

  // Directive: x-tooltip or x-tooltip:reactive
  Alpine.directive('tooltip', (el: HTMLElement, { value, expression }, { evaluate }) => {
    let text: unknown = expression;
    if (value === 'reactive') {
      text = evaluate(expression);
    }
    // @ts-ignore
    tippy(el, { content: DOMPurify.sanitize(text, { ALLOWED_TAGS: [] }) });
  });
});

Alpine.start();

export default {};
