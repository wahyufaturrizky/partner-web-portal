import React, { useState } from 'react'
import { Spacer, Text, Button, Col, Row, AccordionCheckbox, Checkbox, Search } from 'pink-lava-ui'
import { useBranchGroupList } from 'hooks/mdm/branch/useBranch';
import { useRouter } from 'next/router';

export default function Branch({ setValue, branch=[], isUpdate}: { setValue: any, branch: any, isUpdate: any}) {

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
      <Text variant="headingMedium" color="blue.darker">Branch</Text>
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
            Create New Branch
          </Button>
        </Row>
        <Search
          width="486px"
          placeholder={`Search Branch`}
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
