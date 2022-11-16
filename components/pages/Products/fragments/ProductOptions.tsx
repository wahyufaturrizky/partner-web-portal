import React from 'react'
import { Table, Pagination, Col, Spacer, Text } from 'pink-lava-ui'
import usePagination from '@lucasmogari/react-pagination';
import { useWatch } from 'react-hook-form';
import { lang } from 'lang';

export default function ProductOptions({control} : any) {
  const t = localStorage.getItem("lan") || "en-US";
  // lang[t].companyList.companyName
  const columsProductOptions = [
    {
      title: "Option Name",
      dataIndex: "name",
    },
    {
      title: "Option Value",
      dataIndex: "value",
    },
  ];

  const optionsForm = useWatch({
    control,
    name: 'options'
  })

  const productOptionsData = optionsForm.map((data:any) => ({
    name: data.option.name,
    value: data.option_items?.map((data:any) => data.name)?.join(", ") || []
  }))

  const paginationProductOptions = usePagination({
		page: 1,
		itemsPerPage: 20,
		maxPageItems: Infinity,
		numbers: true,
		arrows: true,
		totalItems: productOptionsData.length,
	});
	const page = paginationProductOptions?.page;
  let paginateProductOptions = productOptionsData?.slice( paginationProductOptions.itemsPerPage * (page - 1), paginationProductOptions.itemsPerPage * page) || [];
  
  return (
    <Col>
        <Text variant="headingMedium" color="blue.darker">{lang[t].productList.create.field.detail.options}</Text>
        <Spacer size={12} />
        <Col gap="20px">
          <Table
            columns={columsProductOptions}
            data={paginateProductOptions}
            width="100%"
          />
          {productOptionsData.length > 5 && <Pagination pagination={paginationProductOptions} /> }
        </Col>
    </Col>
  )
}
