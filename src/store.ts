import create from "zustand";
import { v4 as uuid, v4 } from "uuid";
import { persist } from "zustand/middleware";
import { Block, BlockType, Graph } from "./types";
import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

// interface Store {
//   data: Graph;
//   actions: {
//     createPage(args: { title: string }): { id: string };
//     renamePage(args: { id: string; title: string }): void;
//     createBlock(args: { content: string; pageid: string; type: blocktype }): {
//       id: string;
//     };
//     updateBlockContent(args: { content: string; id: string }): void;
//     addPrimaryBlockToPage(args: { pageId: string; blockId: string }): void;
//     updateBlockChildrenOrder(args: {}): void;
//     rearrangeBlocks(): void;
//     rearrangeParentBlock(): void;
//     addChildrenToBlock(
//       blockId: string,
//       newBlock: Omit<Block, "id" | "createdAt">
//     ): void;
//   };
// }

// export const useStore = create<Store>((set, get) => ({
//   data: {
//     pages: {},
//     blocks: {},
//     pageReferences: {},
//   },
//   actions: {
//     createPage({ title }) {
//       const id = v4();
//       set((prev) => ({
//         data: {
//           ...prev.data,
//           pages: {
//             ...prev.data.pages,
//             [id]: {
//               id,
//               title,
//               createdAt: new Date().toISOString(),
//               updatedAt: new Date().toISOString(),
//               children: [],
//             },
//           },
//         },
//       }));
//       return { id };
//     },
//     renamePage({ id, title }) {
//       set((prev) => ({
//         data: {
//           ...prev.data,
//           pages: {
//             ...prev.data.pages,
//             [id]: {
//               ...prev.data.pages[id],
//               title,
//               updatedAt: new Date().toISOString(),
//             },
//           },
//         },
//       }));
//     },
//     createBlock({ content, pageId, type }) {
//       const id = uuid();

//       set((prev) => ({
//         data: {
//           ...prev.data,
//           blocks: {
//             ...prev.data.blocks,
//             [id]: {
//               id,
//               pageId,
//               content,
//               parentId: null,
//               type,
//               createdAt: new Date().toISOString(),
//               updatedAt: new Date().toISOString(),
//             },
//           },
//         },
//       }));

//       return { id };
//     },
//     updateBlockContent({ content, id }) {
//       set((prev) => ({
//         data: {
//           ...prev.data,
//           blocks: {
//             ...prev.data.blocks,
//             [id]: {
//               ...prev.data.blocks[id],
//               content,
//               updatedAt: new Date().toISOString(),
//             },
//           },
//         },
//       }));
//     },
//     addPrimaryBlockToPage({ pageId, blockId }) {
//       set((prev) => ({
//         data: {
//           ...prev.data,
//           pages: {
//             [pageId]: {
//               ...prev.data.pages[pageId],
//               children: [
//                 ...prev.data.pages[pageId].children,
//                 { id: blockId, children: [] },
//               ],
//             },
//           },
//         },
//       }));
//     },
//     updateBlockChildrenOrder() {},
//     addChildrenToBlock() {},
//     rearrangeBlocks() {},
//     rearrangeParentBlock() {},
//   },
// }));

const rootSlice = createSlice({
  name: "root",
  initialState: {
    currentPage: null,
    activeBlock: null,
    data: {
      pages: {},
      blocks: {},
      pageReferences: {},
    },
  } as {
    currentPage: string | null;
    activeBlock: string | null;
    data: Graph;
  },
  reducers: {
    createPage(state, action: PayloadAction<{ title: string }>) {
      const { title } = action.payload;
      const id = v4();

      state.data.pages[id] = {
        id,
        title,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        children: [],
      };

      this.createBlock({
        content: "This is the first block, click here to edit",
        type: "p",
        pageId: id,
      });
    },
    renamePage(state, action: PayloadAction<{ id: string; title: string }>) {
      // set((prev) => ({
      //   data: {
      //     ...prev.data,
      //     pages: {
      //       ...prev.data.pages,
      //       [id]: {
      //         ...prev.data.pages[id],
      //         title,
      //         updatedAt: new Date().toISOString(),
      //       },
      //     },
      //   },
      // }));
    },
    createBlock(
      state,
      {
        payload,
      }: PayloadAction<{
        content: string;
        pageId: string;
        blockId?: string;
        type: BlockType;
      }>
    ) {
      const { content, pageId, blockId, type } = payload;
      const id = uuid();

      state.data.blocks[id] = {
        id,
        pageId,
        content,
        parentId: null,
        type,
        children: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (pageId && !blockId) {
        state.data.pages[pageId].children.push({ id });
      } else if (pageId && blockId) {
        state.data.blocks[blockId].children.push({ id });
      }
    },
    updateBlockContent(
      state,
      {
        payload: { content, id },
      }: PayloadAction<{ content: string; id: string }>
    ) {
      state.data.blocks[id].content = content;
      state.data.blocks[id].updatedAt = new Date().toISOString();
    },
    updatePageChildrenOrder() {},
    updateBlockChildrenOrder(state, action) {},
    removeBlockFromParentBlock() {},
    addChildrenToBlock(state, action) {},
    rearrangeBlocks(state, action) {},
    rearrangeParentBlock(state, action) {},
  },
});

// Redux Store
export const store = configureStore({ reducer: rootSlice.reducer });

// Actions
export const actions = rootSlice.actions;

// RootState
export type RootState = ReturnType<typeof store.getState>;

// Typed Dispatcher
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();

// Typed Selector
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
