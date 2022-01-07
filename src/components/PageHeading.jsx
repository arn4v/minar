import * as React from "react";
import { debounce } from "lodash-es";
import { actions, useAppDispatch, useAppSelector } from "../store";

export function PageHeading({ pageId }) {
  const { pageTitle } = useAppSelector((state) => ({
    pageTitle: state.data.pages[pageId].title,
  }));
  const dispatch = useAppDispatch();

  const onTitleChange = React.useMemo(() => {
    return debounce((e) => {
      dispatch(actions.renamePage({ id: pageId, title: e.target.innerHTML }));
    }, 200);
  }, [dispatch, pageId]);

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
