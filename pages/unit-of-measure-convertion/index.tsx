import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {
  Text,
  Button,
  Col,
  Row,
  Spacer,
  Search,
  Table,
  Pagination,
  Modal,
  DropdownMenu,
  FileUploadModal,
  Switch,
  Lozenge,
} from "pink-lava-ui";
import usePagination from "@lucasmogari/react-pagination";
import { useUOMList, useUploadFileUOM, useDeletUOM } from "../../hooks/mdm/unit-of-measure/useUOM";
import useDebounce from "../../lib/useDebounce";
import { queryClient } from "../_app";
import { useForm } from "react-hook-form";
import { ICDownload, ICUpload } from "../../assets/icons";
import { mdmDownloadService } from "../../lib/client";
import { useRouter } from "next/router";
import styles from './index.module.css'

const downloadFile = (params: any) =>
  mdmDownloadService("/uom/download", { params }).then((res) => {
    let dataUrl = window.URL.createObjectURL(new Blob([res.data]));
    let tempLink = document.createElement("a");
    tempLink.href = dataUrl;
    tempLink.setAttribute("download", `uom_${new Date().getTime()}.xlsx`);
    tempLink.click();
  });

const renderConfirmationText = (type: any, data: any) => {
  switch (type) {
    case "selection":
      return data.selectedRowKeys.length > 1
        ? `Are you sure to delete ${data.selectedRowKeys.length} items ?`
        : `Are you sure to delete Uom Name ${
            data?.uomData?.data.find((el: any) => el.key === data.selectedRowKeys[0])?.uomName
          } ?`;
    case "detail":
      return `Are you sure to delete Uom Name ${data.uomName} ?`;

    default:
      break;
  }
};

const UOMConvertion = () => {
  const router = useRouter();
  const pagination = usePagination({
    page: 1,
    itemsPerPage: 10,
    maxPageItems: Infinity,
    numbers: true,
    arrows: true,
    totalItems: 100,
  });

  const [search, setSearch] = useState("");
  const [isShowDelete, setShowDelete] = useState({ open: false, type: "selection", data: {} });
  const [isShowUpload, setShowUpload] = useState(false);
  const [modalForm, setModalForm] = useState({
    open: false,
    data: {},
    typeForm: "create",
  });
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const debounceSearch = useDebounce(search, 1000);
  const [dataUoM, setDataUoM] = useState(null)

  const {
    data: UOMData,
    isLoading: isLoadingUOM,
    isFetching: isFetchingUOM,
  } = useUOMList({
    query: {
      search: debounceSearch,
      page: pagination.page,
      limit: pagination.itemsPerPage,
      company_id: "KSNI",
    },
    options: {
      onSuccess: (data: any) => {
        pagination.setTotalItems(data.totalRow);
      },
      select: (data: any) => {
        const mappedData = data?.rows?.map((element: any) => {
          return {
            key: element.uomId,
            id: element.uomId,
            uomName: element.name,
            uomCategoryName: element.uomCategoryName,
            status: element.activeStatus,
            action: (
              <div style={{ display: "flex", justifyContent: "left" }}>
                <Button
                  size="small"
                  onClick={() => {
                    router.push(`/unit-of-measure-convertion/${element.uomId}`);
                  }}
                  variant="tertiary"
                >
                  View Detail
                </Button>
              </div>
            ),
          };
        });

        return { data: mappedData, totalRow: data.totalRow };
      },
    },
  });
  
  useEffect(() => {
    let data = [
      {
        // key:'UMC-0000001',
        id: 'UMC-0000001',
        name: 'Conversion Product',
        action: (
          <div style={{ display: "flex", justifyContent: "left" }}>
            <Button
              size="small"
              onClick={() => {
                router.push(`/unit-of-measure-convertion/${'MPC-0000005'}`);
              }}
              variant="tertiary"
            >
              View Detail
            </Button>
          </div>
        ),
        children: [
          {
          key: 'UMC-0000001-1',
          Qty: 1,
          UoM: 'PACK',
          conversionNumber: 12,
          baseUoM: 'PCS',
          status: "ACTIVE"
          },
          {
          key: 'UMC-0000001-2',
          Qty: 1,
          UoM: 'CTN',
          conversionNumber: 24,
          baseUoM: 'PCS',
          status: "INACTIVE"
          },
        ]
      },
      {
        // key: 'UMC-0000002',
        id: 'UMC-0000002',
        name: 'Conversion Transport',
        action: (
          <div style={{ display: "flex", justifyContent: "left" }}>
            <Button
              size="small"
              onClick={() => {
                router.push(`/unit-of-measure-convertion/${'MPC-0000006'}`);
              }}
              variant="tertiary"
            >
              View Detail
            </Button>
          </div>
        ),
        children: [
          {
          key: 'UMC-0000002-1',
          Qty: 1,
          UoM: 'PACK',
          conversionNumber: 22,
          baseUoM: 'PCS',
          status: "ACTIVE"
          },
          {
          key: 'UMC-0000002-2',
          Qty: 1,
          UoM: 'CTN',
          conversionNumber: 21,
          baseUoM: 'PCS',
          status: "INACTIVE"
          },
        ]
      }
    ]
    setDataUoM(data)
  }, [])

  const { mutate: deleteUom, isLoading: isLoadingDeleteUom } = useDeletUOM({
    options: {
      onSuccess: () => {
        setShowDelete({ open: false, data: {}, type: "" });
        setSelectedRowKeys([]);
        queryClient.invalidateQueries(["uom-list"]);
      },
    },
  });

  const { mutate: uploadFileUom, isLoading: isLoadingUploadFileUom } = useUploadFileUOM({
    options: {
      onSuccess: () => {
        queryClient.invalidateQueries(["uom-list"]);
        setShowUpload(false);
      },
    },
  });

  const checkTableChildren = (rowKey: any) => {
    const data = dataUoM?.map(element => element.children.map(el => {
      if(el.key === rowKey.key){
        el.status === 'ACTIVE' ? el.status = 'INACTIVE' : el.status = 'ACTIVE'
      }
      return el
    }))
    const dataSekarang = [...dataUoM]

    dataSekarang.forEach((el, i) => {
      el.children = data[i]
    })
    setDataUoM(dataSekarang)
  }

  const checkedStatus = (status: string) => {
    return status === 'ACTIVE' ? true : false
  }

  const columns = [
    {
      title: "UoM Conversion ID",
      dataIndex: "id",
      key: 'id',
    },
    {
      title: "Uom Conversion Name",
      dataIndex: "name",
      key: 'name'
    },
    {
      title: "Qty",
      dataIndex: "Qty",
      key: 'Qty',
    },
    {
      title: "UoM",
      dataIndex: "UoM",
      key: 'UoM'
    },
    {
      title: "Conversion Number",
      dataIndex: "conversionNumber",
      key: 'conversionNumber'
    },
    {
      title: "Base UoM",
      dataIndex: "baseUoM",
      key: 'baseUoM',
    },
    {
      title: "Active",
      dataIndex: 'status',
      render: (status: string, rowKey: any) => (
        <>
        {rowKey.action? '' :
          <Switch checked={checkedStatus(status)} onChange={() => checkTableChildren(rowKey)}/>
        }
        </>
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      width: "15%",
      align: "left",
    },
  ];
  

  const rowSelection = {
    selectedRowKeys,
    getCheckboxProps: (record: any) => {
      console.log(record.action)
      if(record?.action){
        return {
          disabled: false,
        }
      } else {
        return {
          className: styles.overideAntdCheckbox,
        }
      }
    },
    onChange: (selectedRowKeys: any, selectedRows: any, getCheckboxProps: any) => {
      console.log(getCheckboxProps, '<<<,')
      if(!selectedRowKeys) {
      }
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows, 'getcheckbox:', getCheckboxProps);
      setSelectedRowKeys(selectedRowKeys);
    },
  };

  const onSubmitFile = (file: any) => {
    const formData = new FormData();
    formData.append("company_id", "KSNI");
    formData.append("file", file);

    uploadFileUom(formData);
  };

  return (
    <>
      <Col>
        <Text variant={"h4"}>UoM Convertion</Text>
        <Spacer size={20} />
      </Col>
      <Card>
        <Row justifyContent="space-between">
          <Search
            width="340px"
            placeholder="Search UoM Conversion Name, UoM Base, etc"
            onChange={(e: any) => {
              setSearch(e.target.value);
            }}
          />
          <Row gap="16px">
            <Button
              size="big"
              variant={"tertiary"}
              onClick={() =>
                setShowDelete({
                  open: true,
                  type: "selection",
                  data: { uomData: dataUoM, selectedRowKeys },
                })
              }
              disabled={rowSelection.selectedRowKeys?.length === 0}
            >
              Delete
            </Button>
            <DropdownMenu
              title={"More"}
              buttonVariant={"secondary"}
              buttonSize={"big"}
              textVariant={"button"}
              textColor={"pink.regular"}
              iconStyle={{ fontSize: "12px" }}
              onClick={(e: any) => {
                switch (parseInt(e.key)) {
                  case 1:
                    downloadFile({ with_data: "N", company_id: "KSNI" });
                    break;
                  case 2:
                    setShowUpload(true);
                    break;
                  case 3:
                    downloadFile({ with_data: "Y", company_id: "KSNI" });
                    break;
                  case 4:
                    break;
                  default:
                    break;
                }
              }}
              menuList={[
                {
                  key: 1,
                  value: (
                    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <ICDownload />
                      <p style={{ margin: "0" }}>Download Template</p>
                    </div>
                  ),
                },
                {
                  key: 2,
                  value: (
                    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <ICUpload />
                      <p style={{ margin: "0" }}>Upload Template</p>
                    </div>
                  ),
                },
                {
                  key: 3,
                  value: (
                    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <ICDownload />
                      <p style={{ margin: "0" }}>Download Data</p>
                    </div>
                  ),
                },
              ]}
            />
            <Button
              size="big"
              variant="primary"
              onClick={() => router.push("/unit-of-measure/create")}
            >
              Create
            </Button>
          </Row>
        </Row>
      </Card>
      <Spacer size={10} />
      <Card style={{ padding: "16px 20px" }}>
        <Col gap={"60px"}>
          <Table
            loading={isLoadingUOM || isFetchingUOM}
            columns={columns}
            data={dataUoM}
            rowSelection={rowSelection}
            rowKey={"id"}
          />
          <Pagination pagination={pagination} />
        </Col>
      </Card>

      {isShowDelete.open && (
        <Modal
          closable={false}
          centered
          visible={isShowDelete.open}
          onCancel={() => setShowDelete({ open: false, type: "", data: {} })}
          title={"Confirm Delete"}
          footer={null}
          content={
            <TopButtonHolder>
              <Spacer size={4} />
              {renderConfirmationText(isShowDelete.type, isShowDelete.data)}
              <Spacer size={20} />
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "10px",
                  marginBottom: "20px",
                }}
              >
                <Button
                  size="big"
                  variant="tertiary"
                  key="submit"
                  type="primary"
                  onClick={() => setShowDelete({ open: false, type: "", data: {} })}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="big"
                  onClick={() => {
                    if (isShowDelete.type === "selection") {
                      deleteUom({ ids: selectedRowKeys, company_id: "KSNI" });
                    } else {
                      deleteUom({ ids: [modalForm.data.id], company_id: "KSNI" });
                    }
                  }}
                >
                  {isLoadingDeleteUom ? "loading..." : "Yes"}
                </Button>
              </div>
            </TopButtonHolder>
          }
        />
      )}

      {isShowUpload && (
        <FileUploadModal
          visible={isShowUpload}
          setVisible={setShowUpload}
          onSubmit={onSubmitFile}
        />
      )}
    </>
  );
};

const Card = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: 16px;
`;

const HideCheckBox = styled.input.attrs({ type: 'checkbox' })`
  opacity: 0;
`;

const TopButtonHolder = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`
export default UOMConvertion;
