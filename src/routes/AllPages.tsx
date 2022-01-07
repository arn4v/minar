import * as React from "react";
import { Link } from "react-router-dom";
import { actions, useAppDispatch, useAppSelector } from "../store";

export function AllPage() {
  const dispatch = useAppDispatch();
  const [pageTitle, setPageTitle] = React.useState("");
  const { pages } = useAppSelector((state) => ({
    pages: state.data.pages,
  }));

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          dispatch(actions.createPage({ title: pageTitle }));
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
