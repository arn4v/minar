import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { v4 as uuid, v4 } from "uuid";
import { BlockType, Graph } from "./types";

const rootSlice = createSlice({
  name: "root",
  initialState: {
    activePage: null,
    activeBlock: null,
    data: {
      pages: {},
      blocks: {},
      pageReferences: {},
    },
  } as {
    activePage: string | null;
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

      rootSlice.caseReducers.createBlock(state, {
        type: "createBlock",
        payload: {
          type: "p",
          content: "This is the first block, click here to edit",
          pageId: id,
        },
      });
    },
    renamePage(state, action: PayloadAction<{ id: string; title: string }>) {
      const { id, title } = action.payload;

      state.data.pages[id].title = title;
      state.data.pages[id].updatedAt = new Date().toISOString();
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

    deleteChildUnderBlock(
      state,
      action: PayloadAction<{ parentId: string; childId: string }>
    ) {
      const { childId, parentId } = action.payload;

      state.data.blocks[parentId].children = state.data.blocks[
        parentId
      ].children.filter((item) => item.id === childId);

      delete state.data.blocks[childId];
    },

    movePageChildToBlock() {},

    //> Moves block child to another block
    moveBlockChildToAnotherBlock(
      state,
      action: PayloadAction<{ parentId: string; childId: string }>
    ) {
      const { childId, parentId } = action.payload;

      state.data.blocks[parentId].children = state.data.blocks[
        parentId
      ].children.filter((item) => item.id === childId);

      delete state.data.blocks[childId];
    },

    // Moves an indented block to data.pages[id].children (primary block)
    //
    // If user is focused on "Child block" and presses `Shift + Tab`
    // Remove "Child Block" indentation so it is directly under "Primary block"
    //
    // Before:
    //    * Primary block
    //      * Child block
    //
    // After:
    //    * Primary block
    //    * Child block
    moveBlockChildToPage(
      state,
      action: PayloadAction<{
        pageId: string;
        parentBlockId: string;
        childBlockId: string;
      }>
    ) {},

    // Removes a block from data.page[id].children array & deletes the block from data.blocks
    deleteChildUnderPage(
      state,
      action: PayloadAction<{ pageId: string; blockId: string }>
    ) {
      const { pageId, blockId } = action.payload;

      state.data.pages[pageId].children = state.data.pages[
        pageId
      ].children.filter((item) => item.id === blockId);

      delete state.data.blocks[blockId];
    },

    // Updates position of primary blocks on a page
    updatePosOfChildInPage() {},

    // Updates position of an indented block w.r.t its parent block
    updatePosOfChildInBlock() {},

    //> Updates active block Id
    setActiveBlock(state, action: PayloadAction<{ id: string | null }>) {
      const { id } = action.payload;
      state.activeBlock = id;
    },

    //> Updates active page Id
    setActivePage(state, action: PayloadAction<{ id: string }>) {
      const { id } = action.payload;
      state.activePage = id;
    },
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
