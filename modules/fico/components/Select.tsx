import { Select as AntdSelect, Spin } from 'antd';
import Text from 'antd/lib/typography/Text';
import styled from 'styled-components';
import { Row } from 'pink-lava-ui';

export const Select = ({
  datasources,
  onSelect,
  serverSideSearch,
  fetchLoading,
  ...props
}) => {
  // const { Option } = AntdSelect;
  // const options = datasources?.map((d, idx) => (
  //   <Option key={idx} value={d.value}>
  //     {d.label}
  //   </Option>
  // ));

  if (serverSideSearch) {
    return (
      <SelectStyled
        onSelect={onSelect}
        options={datasources}
        placeholder="Type to search..."
        dropdownStyle={{
          padding: '12px 0',
          borderRadius: '8px',
          marginTop: '10px',
          width: 'auto',
        }}
        allowClear
        filterOption={false}
        autoClearSearchValue={false}
        showSearch
        notFoundContent={(
          <Row justify="center">
            {fetchLoading ? (
              <Spin size="default" />
            ) : (
              <Text type="secondary">No Data, Type to Search</Text>
            )}
          </Row>
        )}
        {...props}
      />
    );
  }

  return (
    <SelectStyled
      onSelect={onSelect}
      options={datasources}
      placeholder="Select"
      dropdownStyle={{
        padding: '12px 0',
        borderRadius: '8px',
        marginTop: '10px',
        width: 'auto',
      }}
      allowClear
      {...props}
    >
      {/* {options} */}
    </SelectStyled>
  );
};

const SelectStyled = styled(AntdSelect)`
  font-size: 16px;
  line-height: 24px;

  .ant-select-selector input {
    margin-top: 8px !important;
  }
`;
