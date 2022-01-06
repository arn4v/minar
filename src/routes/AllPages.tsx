import * as React from "react";
import { Link } from "react-router-dom";
import { useStore } from "../store";

export function AllPage() {
  const [pageTitle, setPageTitle] = React.useState("");
  const { createPage, pages, createBlock, addPrimaryBlockToPage } = useStore(
    (state) => ({
      pages: state.data.pages,
      createPage: state.actions.createPage,
      createBlock: state.actions.createBlock,
      addPrimaryBlockToPage: state.actions.addPrimaryBlockToPage,
    })
  );

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const { id: pageId } = createPage({ title: pageTitle });
          const { id: blockId } = createBlock({
            content: "This is the first block, click here to edit",
            type: "p",
            pageId: pageId,
          });
          addPrimaryBlockToPage({ blockId, pageId });

          setPageTitle("");
        }}
      >
        <input
          placeholder="Page Title"
          value={pageTitle}
          onChange={(e) => setPageTitle(e.target.value)}
        />
        <button type="submit">Create Page</button>
      </form>
      <ul className="mt-8">
        {Object.values(pages).map(({ id, title }) => (
          <Link to={`page/${id}`}>
            <li>{title}</li>
          </Link>
        ))}
      </ul>
    </div>
  );
}
