/* eslint-disable no-unused-vars */
import {
  Col,
  Pagination,
  Row,
  Table,
  Tabs,
  Text,
  PopupCard,
} from '../components';
import React, { useState, useCallback, useEffect } from 'react';
import { matchSorter } from 'match-sorter';

export const DataTable = (props) => {
  const {
    rowKey, data = [], columns, isLoading, pagination, rowSelection, scroll,
    listTab, defaultTab, onSearch, onChangeTab,
  } = props;

  const [dataSource, setDataSource] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState();
  const filterDatasources = columns
    .filter((c) => !['No', 'Action'].includes(c.title))
    .filter((c) => c.dataIndex)
    .map((c) => ({
      value: c.dataIndex,
      label: c.title,
    }));

  const searchClientSide = useCallback(
    (search) => {
      const keys = selectedFilter
        ? [selectedFilter]
        : filterDatasources.map((f) => f.value);

      const searchResult = matchSorter(data, search, { keys }) || [];
      setDataSource(searchResult);
    },
    [data, selectedFilter],
  );

  const doSearch = (search) => {
    if (onSearch) return onSearch(search);
    return searchClientSide(search);
  };

  useEffect(() => {
    if (data.length > 0) setDataSource([...data]);
    else setDataSource(null);
  }, [data]);

  return (
    <>
      { listTab
        && (
        <Tabs
          defaultActiveKey={defaultTab}
          listTabPane={listTab}
          onChange={onChangeTab}
        />
        )}
      <Col gap="10px">
        {/* <Row width="50%">
          <Col>
            <Filter
              onSelect={setSelectedFilter}
              onSearch={debounce((e) => doSearch(e.target.value), 500)}
              datasources={filterDatasources}
            />
          </Col>
        </Row> */}
        {/* <div className="w-full">
          <FilterMultiDropdown
            items={[
              {
                label: 'COLUMNS',
                list: filterDatasources,
              },
            ]}
            onSearch={(e) => console.log(e)}
          />
        </div> */}
        <div style={{ width: '100%' }}>
          <Table
            columns={columns}
            data={(dataSource || []).map((d) => ({ ...d, key: d[rowKey] }))}
            rowSelection={rowSelection}
            loading={isLoading}
            scroll={scroll}
          />
          {rowSelection?.selectionMessage
            && (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <PopupCard show={(rowSelection?.selectedRowKeys?.length || 0) > 0}>
                <Row justifyContent="space-between" alignItems="center" width="100%">
                  <Text variant="headingRegular">{`${rowSelection?.selectedRowKeys?.length} ${rowSelection?.selectionMessage}`}</Text>
                  {rowSelection?.selectionAction}
                </Row>
              </PopupCard>
            </div>
            )}
        </div>
        {pagination && (
          <Pagination pagination={pagination} />
        )}
      </Col>
    </>
  );
}

export default DataTable;
