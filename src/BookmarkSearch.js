import React, { useState } from 'react';
import { Search } from 'semantic-ui-react';

const BookmarkSearch = () => {
  const [state, setState] = useState({ isLoading: false, results: [], value: '' });
  const { isLoading, results, value } = state;

  const onResultSelect = (e, { result }) => window.chrome.tabs.create({ url: result.url, active: true });
  const onSearchChange = (e, { value }) => {
    setState({ ...state, isLoading: true, value });
    setTimeout(() => {
      window.chrome.bookmarks.search(value, results => setState({ ...state, value, results, isLoading: false }));
    }, 250);
  };

  return (
    <Search
      loading={isLoading}
      onResultSelect={onResultSelect}
      onSearchChange={onSearchChange}
      results={results}
      value={value}
      minCharacters="3"
      placeholder="Search..."
      icon="search"
    />
  );
};

export default BookmarkSearch;
