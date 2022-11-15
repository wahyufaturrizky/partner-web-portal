import React, { useState } from 'react'
import { Spacer, Text, Button, Col, Row, AccordionCheckbox, Checkbox, Search } from 'pink-lava-ui'
import { useBranchGroupList } from 'hooks/mdm/branch/useBranch';
import { useRouter } from 'next/router';
import { lang } from 'lang';

export default function Branch({ setValue, branch=[], isUpdate}: { setValue: any, branch: any, isUpdate: any}) {
  const t = localStorage.getItem("lan") || "en-US";

  const router = useRouter();
  const [searchBranch, setSearchBranch] = useState("")

  const {
    data: branchData,
  } = useBranchGroupList({
    query: {
      company_id: "KSNI",
      search: searchBranch
    },
  });

  return (
    <div>
      <Text variant="headingMedium" color="blue.darker">{lang[t].productList.create.field.branch.title}</Text>
      <Spacer size={14} />
      <Row width="100%" justifyContent="space-between" noWrap>
        <Row>
          <Button
            size="big"
            variant="primary"
            onClick={() => {
              window.open(`/branch/create`, "_blank")
            }}
          >
            {lang[t].productList.list.button.newBranch}
          </Button>
        </Row>
        <Search
          width="486px"
          placeholder={lang[t].productList.create.field.branch.searchBarBranch}
          onChange={(e: any) => setSearchBranch(e.target.value)}
        />
      </Row>
      <Spacer size={20} />

      <Col gap="20px">
        {branchData?.rows?.map((b: any) => (
          <AccordionCheckbox
            key={b.parentId}
            lists={b?.items?.map((item: any) => ({
              id: item?.branchId,
              value: item?.name,
            }))}
            name={b.parentName}
            checked={branch?.ids}
            onChange={(data: any) => {
              setValue("branch", {
                ids: data
              })
            }}
          />
        ))}
      </Col>
    </div>
  )
}
