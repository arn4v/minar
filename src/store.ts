import create from "zustand";
import { v4 as uuid, v4 } from "uuid";
import { persist } from "zustand/middleware";
import { Block, BlockType, Graph } from "./types";

interface Store {
  data: Graph;
  actions: {
    createPage(args: { title: string }): void;
    renamePage(args: { title: string }): void;
    createBlock(args: {
      content: string;
      pageId: string;
      type: BlockType;
    }): void;
    updateBlockContent(args: { content: string; id: string }): void;
    addChildToBlock(args: {}): void;
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
            [title]: {
              id,
              title,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              children: [],
            },
          },
        },
      }));
    },
    renamePage({ title }) {
      set((prev) => ({
        data: {
          ...prev.data,
          pages: {
            ...prev.data.pages,
            [title]: {
              ...prev.data.pages[title],
              title,
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
    addChildToBlock() {},
    updateBlockChildrenOrder() {},
    addChildrenToBlock() {},
    rearrangeBlocks() {},
    rearrangeParentBlock() {},
  },
}));
