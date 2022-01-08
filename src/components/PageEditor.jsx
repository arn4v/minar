import * as React from "react";
import { useFirstMountState } from "react-use";
import { actions, useAppDispatch, useAppSelector } from "../store";
import { BlockList } from "./BlockList";
import { PageHeading } from "./PageHeading";

export function PageEditor() {
  const { page, pageId } = useAppSelector((state) => ({
    page: state.data.pages[state.activePage],
    pageId: state.activePage,
  }));
  const dispatch = useAppDispatch();
  const isFirstMount = useFirstMountState();

  React.useEffect(() => {
    if (isFirstMount) {
      dispatch(actions.setActiveBlock(page?.children[0]));
    }
  }, [dispatch, page]);

  if (!pageId || !page) return null;

  return (
    <div className="block w-[80%] h-full mx-auto my-auto">
      <PageHeading pageId={pageId} />
      <div className="mt-8 flex flex-col w-full">
        <BlockList blockChildren={page.children} />
      </div>
    </div>
  );
}
