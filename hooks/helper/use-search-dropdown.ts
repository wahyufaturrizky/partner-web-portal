import { useState } from 'react';

export const useSearchDropdown = <T>() => {
  const [searchDropdown, setSearchDropdown] = useState({ field: null, search: '' });

  const getSearchValue = (field: keyof T) => {
    if (searchDropdown.field !== field) return null;
    return searchDropdown.search;
  };

  return {
    searchDropdown,
    setSearchDropdown,
    getSearchValue,
  };
};
