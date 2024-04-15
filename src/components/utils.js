const getWithChildrenCount = (tree) => tree?.map((t) => ({ ...t, value: t?.id, label: `${t?.title} (${t?.children?.length})` }));

export const getFolders = (tree) => {
  const mainFolders = getWithChildrenCount(tree);
  const allFolders = mainFolders.reduce((arr, { children = [] }) => {
    if (children?.length === 0) return arr;

    return [...arr, ...getWithChildrenCount(children?.filter((c) => c?.children))];
  }, mainFolders);

  return { mainFolders, allFolders };
};
