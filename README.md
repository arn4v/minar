# Minar - Tiny, Friendly Roam/Remnote Alternative

Minar is a research project meant to replicate a subset of functionality offered TfT Tools such as Roam, Remnote, Obsidian, et cetera.

## Scope

- Block Editor
  - Full markdown support
  - Indentation (Child blocks)
  - Drag & drop to re-arrange
  - Paste image
- Daily notes pages
- Block referencing
- Page referencing (Bi-directional linking)

## Frontend Stack

- React
- TypeScript
- Stitches.js (CSS-in-JS)

## Backend Stack

- Express
- MongoDB / Mongoose

## Data Structure Ideation (06/01/2022)

```js
let db = {
  pages: {
    "8fa4e2c9-eb51-42e7-8bfd-cc9d11838b21": {
      id: "",
      title: "Page 1",
      children: {},
    },
    "fce888a3-58a0-4479-a858-61ef366c34eb": {
      id: "",
      title: "Page 2",
      children: {
      order: [],
        "id": {
          id: "id",
          children: {
            "c1a2aa2f-2659-46aa-8cd9-05f057dd357f": {
              id: "c1a2aa2f-2659-46aa-8cd9-05f057dd357f",
              children: {

              order: [],
              },
            },
            "c1a2aa2f-2659-46aa-8cd9-05f057dd357f": {
              id: "c1a2aa2f-2659-46aa-8cd9-05f057dd357f",
              order: [],
              children: {
                "51fc2f6e-60ac-484b-983a-67371e3b43da": {
                  id: "c1a2aa2f-2659-46aa-8cd9-05f057dd357f",
                  order: [],
                  children: {},
                },
                    "1461f58a-5ab2-4cfb-90f5-c763088cdf57": {
                      id: "1461f58a-5ab2-4cfb-90f5-c763088cdf57",
                  order: [],
                  children: {
                      "c1a2aa2f-2659-46aa-8cd9-05f057dd357f": {
                      id: "c1a2aa2f-2659-46aa-8cd9-05f057dd357f",
                      order: [],
                      children: {

                      },
                    },
                  },
                },
              },
            },
          },
        },
        {
          id: "",
          pos: 0,
          children: [
            {
              id: "",
              pos: 0,
              children: [],
            },
          ],
        },
       },
    },
  },
  blocks: {
    "c1a2aa2f-2659-46aa-8cd9-05f057dd357f": {
      type: "h1" | "h2" | "h3" | "p",
      content: "Hi Ishan",
      parent_id: null,
    },
    "897e1daa-8a86-4d7d-b846-11b759cd60ce": {
      type: "h1" | "h2" | "h3" | "p",
      content: "Some content",
      parent_id: "",
    },
    "69be422a-9715-48f6-853b-fc464283a02d": {
      type: "reference",
      reference_id: "c1a2aa2f-2659-46aa-8cd9-05f057dd357f", // Can be from any block in the page or any block on any other page
      parent_id: "",
    },
  },
  pageReferences : {}
};
```
