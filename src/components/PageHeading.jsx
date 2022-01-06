import { useParams } from "react-router-dom";
import { debounce } from "lodash-es";
import { useStore } from "../store";

export function PageHeading({ pageId }) {
  const { pageTitle, renamePage } = useStore((state) => ({
    pageTitle: state.data.pages[id].title,
    renamePage: state.actions.renamePage,
  }));

  return (
    <h1
      className="text-xl font-semibold"
      contentEditable
      onInput={debounce(
        (e) => renamePage({ title: e.currentTarget.innerHTML }),
        5000
      )}
      dangerouslySetInnerHTML={{
        __html: pageTitle,
      }}
    />
  );
}
