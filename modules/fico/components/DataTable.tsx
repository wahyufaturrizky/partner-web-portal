/* eslint-disable no-unused-vars */
import {
  Col,
  Pagination,
  Row,
  // Table,
  Tabs,
  Text,
} from 'pink-lava-ui';
import { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { IDataTable } from 'interfaces/interfaces';
import { debounce } from 'lodash';
import { matchSorter } from 'match-sorter';
import { STATUS_ASSET_DISPOSAL_VARIANT } from 'utils/utils';
import { PopupCard } from './PopupCard';
import { Table } from './Table';
import { ModalDeleteConfirmation } from './modals/ModalDeleteConfirmation';
import { Filter } from './Filter';
import { FilterMultiDropdown } from './FilterMultiDropdown';
import { FilterForm } from './FilterForm';

function DataTable(props: IDataTable) {
  const {
    rowKey, data = [], columns, isLoading, pagination, rowSelection, searchPlaceholder = 'Search', scroll,
    listTab, defaultTab, onSearch, onDelete, onAdd, onChangeTab,
  } = props;

  const [dataSource, setDataSource] = useState<any>([]);
  const [modalDelete, setModalDelete] = useState({ open: false });
  const [selectedFilter, setSelectedFilter] = useState();
  const filterDatasources = columns
    .filter((c) => !['No', 'Action'].includes(c.title))
    .filter((c) => c.dataIndex)
    .map((c) => ({
      value: c.dataIndex,
      label: c.title,
    }));

  const doDelete = async () => {
    await onDelete?.({ id: rowSelection?.selectedRowKeys });
    setModalDelete({ open: false });
  };

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
      {/* <Card>
      <Row justifyContent="space-between" alignItems="center">
        <If condition={selectedRowKeys.length > 0}>
          <Then>
            <Text variant="headingMedium">{`${selectedRowKeys.length} ${_.startCase(rowKey)}(s) are Selected`}</Text>
          </Then>
        </If>
        <If condition={selectedRowKeys.length === 0}>
          <Then>
            <Search
              width="380px"
              nameIcon="SearchOutlined"
              placeholder={searchPlaceholder}
              colorIcon={COLORS.grey.regular}
              onChange={_.debounce((e) => onSearch?.(e), 500)}
            />
          </Then>
        </If>
        <Row gap="16px">
          {onDelete &&
            <Button
              size="big"
              variant={"tertiary"}
              onClick={() => setModalDelete({ open: true })}
              disabled={rowSelection.selectedRowKeys?.length === 0}
            >
              Delete
            </Button>
          }
          {onAdd &&
            <Button
              size="big"
              variant={"primary"}
              onClick={(e) => onAdd?.(e)}
            >
              Create
            </Button>
          }
        </Row>
      </Row>
    </Card> */}
      {/* <Spacer size={10} /> */}
      {/* <Card style={{ padding: "16px 0px", width: '100%' }}> */}
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
        <div className="w-full">
          <FilterForm columns={filterDatasources} />
        </div>
        <div style={{ width: '100%' }}>
          <Table
            columns={columns}
            data={(dataSource || []).map((d) => ({ ...d, key: d[rowKey] }))}
            rowSelection={rowSelection}
            loading={false}
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
      {/* </Card> */}
      {modalDelete.open && (
      <ModalDeleteConfirmation
        totalSelected={rowSelection?.selectedRowKeys?.length || 0}
        visible={modalDelete.open}
        onCancel={() => setModalDelete({ open: false })}
        onOk={() => doDelete()}
      />
      )}
    </>
  );
}

const PopupCardBody = styled.div`
  display: flex;
  justify-content: space-between;
`;

export default DataTable;
