import React, { useState } from "react";
import usePagination from "@lucasmogari/react-pagination";
import {
  DropdownMenuOptionGroupCustom,
  FileUploadModal,
  ContentSwitcher,
  DropdownMenu,
  Pagination,
  Search,
  Spacer,
  Button,
  Text,
  Table,
} from "pink-lava-ui";
import { mdmDownloadService } from "lib/client";
import { useRouter } from "next/router";
import styled from "styled-components";

import {
  useFetchCountTabItems,
  useFetchListSalesman,
  useUploadDocumentSalesman,
} from "hooks/mdm/salesman/useSalesman";
import { options, downloadOptions } from "components/pages/Salesman/constants";
import { useUserPermissions } from "hooks/user-config/usePermission";

const downloadFile = (params: any) =>
  mdmDownloadService("/salesman/template/download", { params }).then((res) => {
    const dataUrl = window.URL.createObjectURL(new Blob([res.data]));
    const tempLink = document.createElement("a");
    tempLink.href = dataUrl;
    tempLink.setAttribute("download", `salesman_${new Date().getTime()}.xlsx`);
    tempLink.click();
  });

export default function Salesman() {
  const companyId = localStorage.getItem("companyId");
  const companyCode = localStorage.getItem("companyCode");
  const [tabActived, setTabActived] = useState("Active");
  const [search, setSearch] = useState("");
  const [visible, setVisible] = useState(false);
  const router = useRouter();
  const pagination = usePagination({
    page: 1,
    itemsPerPage: 20,
    maxPageItems: Infinity,
    numbers: true,
    arrows: true,
    totalItems: 100,
  });

  const { data: dataUserPermission } = useUserPermissions({
    options: {
      onSuccess: () => {},
    },
  });

  const listPermission = dataUserPermission?.permission?.filter(
    (filtering: any) => filtering.menu === "Salesman"
  );

  const columns = [
    {
      title: "Salesman ID",
      dataIndex: "code",
    },
    {
      title: "Salesman Name",
      dataIndex: "name",
    },
    {
      title: "Division Name",
      dataIndex: "division",
    },
    {
      title: "Status",
      dataIndex: "statusText",
      render: (value: string) => {
        const colors =
          value === "Active"
            ? "#01A862"
            : value === "Waiting for Approval"
            ? "#FFB400"
            : value === "Rejected"
            ? "#ED1C24"
            : "#000000";
        const backgrounds =
          value === "Active"
            ? "#E2FFF3"
            : value === "Waiting for Approval"
            ? "#FFFBDF"
            : value === "Rejected"
            ? "#FFE4E5"
            : "#F4F4F4";
        return (
          <StatusAktif style={{ background: backgrounds, color: colors }}>{value}</StatusAktif>
        );
      },
    },
    {
      title: "Action",
      render: ({ id, statusText, idCard, name, division }: any) =>
        listPermission?.filter((data: any) => data.viewTypes[0]?.viewType.name === "View").length >
          0 && (
          <Button
            size="small"
            variant="tertiary"
            onClick={() =>
              router.push({
                pathname: "/salesman/[salesman_id]",
                query: {
                  salesman_id: id,
                  status: statusText,
                  idCard,
                  name,
                  division,
                },
              })
            }
          >
            View Detail
          </Button>
        ),
    },
  ];

  const isStatus = () => {
    switch (tabActived) {
      case "Active":
        return "0";
      case "Inactive":
        return "1";
      case "Waiting for Approval":
        return "2";
      case "Rejected":
        return "3";
      case "Draft":
        return "4";
      default:
        return "0";
    }
  };

  const onhandleActDownload = (key: string) => {
    switch (key) {
      case "1":
        return downloadFile({ company_id: companyCode, with_data: "N" });
      case "2":
        return setVisible(true);
      case "3":
        return downloadFile({ company_id: companyCode, with_data: "Y" });
      default:
        return "0";
    }
  };

  const { data, isLoading, refetch } = useFetchListSalesman({
    company_id: companyCode,
    options: {
      onSuccess: (items: any) => {
        pagination.setTotalItems(items?.totalRow);
      },
    },
    query: {
      status: isStatus(),
      search,
      page: pagination.page,
      limit: pagination.itemsPerPage,
    },
  });

  const { mutate: handleUploadDocuments } = useUploadDocumentSalesman({
    options: {
      onSuccess: () => {
        refetch();
      },
    },
  });

  const { data: countTabItems } = useFetchCountTabItems({
    company_id: companyCode,
    options: { onSuccess: () => {} },
    query: {},
  });

  const submitDocumentsUploader = (file: any) => {
    const formData: any = new FormData();
    formData.append("upload_file", file);
    handleUploadDocuments(formData);
  };

  return (
    <div>
      <Text variant="h4">Salesman</Text>
      <Spacer size={20} />
      <ContentSwitcher
        options={options({
          status: {
            active: countTabItems?.active || 0,
            inactive: countTabItems?.inactive || 0,
            waiting: countTabItems?.waitingForApproval || 0,
            reject: countTabItems?.rejected || 0,
            draft: countTabItems?.draft || 0,
          },
        })}
        defaultValue={tabActived}
        onChange={(value: string) => setTabActived(value)}
      />

      <Spacer size={10} />

      <CardHeader>
        <FlexElement>
          <Search
            width="380px"
            placeholder="Search Salesman ID, Employee, etc"
            onChange={({ target }: any) => setSearch(target.value)}
          />
          <DropdownMenuOptionGroupCustom
            handleChangeValue={(value: string[]) => {}}
            listItems={[
              {
                label: "By Country",
                list: [
                  { label: "PMA Bandung Selatan", value: "filter-1" },
                  { label: "PMA Majalengka", value: "filter-2" },
                ],
              },
              {
                label: "By Division",
                list: [{ label: "Division 1", value: "division-1" }],
              },
            ]}
            label={false}
            width={194}
            roundedSelector
            isShowClearFilter
            defaultValue="All"
            placeholder="Filter"
            noSearch
          />
        </FlexElement>

        <DropdownMenu
          title="More"
          buttonVariant="secondary"
          buttonSize="big"
          textVariant="button"
          textColor="pink.regular"
          onClick={({ key }: any) => onhandleActDownload(key)}
          menuList={downloadOptions()}
        />
      </CardHeader>
      <Spacer size={10} />
      <Card>
        <Spacer size={20} />
        <CountList>
          Total {tabActived} Partner : {data?.totalRow || 0}
        </CountList>
        <Spacer size={20} />
        <Table width="100%" loading={isLoading} columns={columns} data={data?.rows} />
        <Spacer size={50} />
        <Pagination pagination={pagination} />
      </Card>

      {/* modal upload documents */}
      <FileUploadModal
        visible={visible}
        setVisible={() => setVisible(false)}
        onSubmit={submitDocumentsUploader}
      />
    </div>
  );
}

const FlexElement = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const CountList = styled.p`
  color: #1a727a;
  font-weight: 600;
  font-size: 16px;
  line-height: 22px;
`;

const Card = styled.div`
  background: #ffff;
  padding: 1rem;
  border-radius: 16px;
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #ffffff;
  border-radius: 16px;
  padding: 16px;
`;

const StatusAktif = styled.div`
  background: #f4f4f4;
  border-radius: 4px;
  color: ${({ style }: any) => style.color};
  background: ${({ style }) => style?.background};
  width: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 600;
  font-size: 14px;
  line-height: 24px;
`;
