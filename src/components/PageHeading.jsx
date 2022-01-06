import * as React from "react";
import { debounce } from "lodash-es";
import { useStore } from "../store";

export function PageHeading({ pageId }) {
  const { pageTitle, renamePage } = useStore((state) => ({
    pageTitle: state.data.pages[pageId].title,
    renamePage: state.actions.renamePage,
  }));

  const onTitleChange = React.useMemo(() => {
    return debounce((e) => {
      renamePage({ id: pageId, title: e.target.innerHTML });
    }, 200);
  }, [renamePage, pageId]);

  return (
    <h1
      className="text-xl font-semibold bg-gray-50 rounded-md shadow px-4 py-2 focus:outline-none focus:bg-white"
      contentEditable
      onInput={onTitleChange}
      dangerouslySetInnerHTML={{
        __html: pageTitle,
      }}
    />
  );
}
