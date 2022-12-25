import { useState } from 'react';
import { debounce } from 'lodash';
import { DropdownMultiValue } from './DropdownMultiValue';
import { BaseInput } from './Input';

export const FilterMultiDropdown = ({
  items,
  onSearch,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string[]>([]);

  return (
    <div className="flex w-full lg:w-[800px] gap-3">
      <div className="w-full lg:w-[25%]">
        <DropdownMultiValue
          handleChangeValue={setSelectedFilter}
          listItems={items}
          placeholder="Filter Column"
          rounded
        />
      </div>
      <div className="w-full">
        <BaseInput height="100%" placeholder="search..." onChange={debounce((e) => onSearch({ selectedFilter, value: e.target.value }), 600)} />
      </div>
    </div>
  );
};
