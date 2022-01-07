export type BlockType = "h1" | "h2" | "h3" | "p";

export type Page = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  children: Child[];
};

export type Child = {
  id: string;
};

export type Block = {
  id: string;
  type: BlockType;
  content: string;
  parentId: string | null;
  children: Child[];
  pageId: string;
  createdAt: string;
  updatedAt: string;
};

export type PageMap = {
  [title: string]: Page;
};

export type BlockMap = {
  [id: string]: Block;
};

export type PageReference = {
  // ID of page that was referenced, i.e Page B
  referencedId: string;

  // Page where the block referenced another page
  // For example, on a page "A", a block referenced `[[B]]`
  // This ID is of "A"
  referencePageId: string;

  // Block that referenced page B
  referenceBlockId: string;
};

export type PageReferenceMap = {
  [referencedId: string]: {
    [referenceBlockId: string]: PageReference;
  };
};

export type Graph = {
  pages: PageMap;
  blocks: BlockMap;
  pageReferences: PageReferenceMap;
};
