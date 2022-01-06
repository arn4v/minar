import create from "zustand";
import { v4 as uuid, v4 } from "uuid";
import { persist } from "zustand/middleware";
import { Block, BlockType, Graph } from "./types";

interface Store {
  data: Graph;
  actions: {
    createPage(args: { title: string }): { id: string };
    renamePage(args: { id: string; title: string }): void;
    createBlock(args: { content: string; pageId: string; type: BlockType }): {
      id: string;
    };
    updateBlockContent(args: { content: string; id: string }): void;
    addPrimaryBlockToPage(args: { pageId: string; blockId: string }): void;
    updateBlockChildrenOrder(args: {}): void;
    rearrangeBlocks(): void;
    rearrangeParentBlock(): void;
    addChildrenToBlock(
      blockId: string,
      newBlock: Omit<Block, "id" | "createdAt">
    ): void;
  };
}

export const useStore = create<Store>((set, get) => ({
  data: {
    pages: {},
    blocks: {},
    pageReferences: {},
  },
  actions: {
    createPage({ title }) {
      const id = v4();
      set((prev) => ({
        data: {
          ...prev.data,
          pages: {
            ...prev.data.pages,
            [id]: {
              id,
              title,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              children: [],
            },
          },
        },
      }));
      return { id };
    },
    renamePage({ id, title }) {
      set((prev) => ({
        data: {
          ...prev.data,
          pages: {
            ...prev.data.pages,
            [id]: {
              ...prev.data.pages[id],
              title,
              updatedAt: new Date().toISOString(),
            },
          },
        },
      }));
    },
    createBlock({ content, pageId, type }) {
      const id = uuid();

      set((prev) => ({
        data: {
          ...prev.data,
          blocks: {
            ...prev.data.blocks,
            [id]: {
              id,
              pageId,
              content,
              parentId: null,
              type,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          },
        },
      }));

      return { id };
    },
    updateBlockContent({ content, id }) {
      set((prev) => ({
        data: {
          ...prev.data,
          blocks: {
            ...prev.data.blocks,
            [id]: {
              ...prev.data.blocks[id],
              content,
              updatedAt: new Date().toISOString(),
            },
          },
        },
      }));
    },
    addPrimaryBlockToPage({ pageId, blockId }) {
      set((prev) => ({
        data: {
          ...prev.data,
          pages: {
            [pageId]: {
              ...prev.data.pages[pageId],
              children: [
                ...prev.data.pages[pageId].children,
                { id: blockId, children: [] },
              ],
            },
          },
        },
      }));
    },
    updateBlockChildrenOrder() {},
    addChildrenToBlock() {},
    rearrangeBlocks() {},
    rearrangeParentBlock() {},
  },
}));
