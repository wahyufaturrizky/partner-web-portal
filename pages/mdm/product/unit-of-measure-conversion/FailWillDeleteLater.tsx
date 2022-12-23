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
  TableAntd,
  Input,
  InputWithTags,
} from "pink-lava-ui";
import usePagination from "@lucasmogari/react-pagination";
import { useRouter } from "next/router";
import { useUOMList, useUploadFileUOM, useDeletUOM } from "../../../../hooks/mdm/unit-of-measure/useUOM";
import useDebounce from "../../../../lib/useDebounce";
import { queryClient } from "../../../_app";
import { ICDownload, ICUpload } from "../../../../assets/icons";
import { mdmDownloadService } from "../../../../lib/client";
import styles from './index.module.css';

const downloadFile = (params: any) => mdmDownloadService("/uom/download", { params }).then((res) => {
  const dataUrl = window.URL.createObjectURL(new Blob([res.data]));
  const tempLink = document.createElement("a");
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

const UOMConversion = () => {
  const router = useRouter();
  const pagination = usePagination({
    page: 1,
    itemsPerPage: 20,
    maxPageItems: Infinity,
    numbers: true,
    arrows: true,
    totalItems: 100,
  });

  const [search, setSearch] = useState("");
  const [isShowDelete, setShowDelete] = useState({ open: false, type: "selection", data: {} });
  const [isShowCreate, setShowCreate] = useState(false);
  const [isShowEdit, setShowEdit] = useState({ open: false, data: {} });

  const [isShowUpload, setShowUpload] = useState(false);
  const [modalForm, setModalForm] = useState({
    open: false,
    data: {},
    typeForm: "create",
  });
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const debounceSearch = useDebounce(search, 1000);
  const [dataUoM, setDataUoM] = useState(null);

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
        const mappedData = data?.rows?.map((element: any) => ({
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
                  router.push(`/mdm/product/unit-of-measure-conversion/${element.uomId}`);
                }}
                variant="tertiary"
              >
                View Detail
              </Button>
            </div>
          ),
        }));

        return { data: mappedData, totalRow: data.totalRow };
      },
    },
  });

  useEffect(() => {
    const data = [
      {
        // key:'UMC-0000001',
        id: 'UMC-0000001',
        name: 'FMCG',
        sector: "Manufacture",
        action: (
          <div style={{ display: "flex", justifyContent: "left" }}>
            <Button
              size="small"
              onClick={() => {
                setShowEdit({
                  open: true,
                  data: {
                    name: 'FMCG',
                    sector: [
                      {
                        key: 'UMC-0000001-1',
                        value: "Manufacture",
                      },
                      {
                        key: 'UMC-0000001-3',
                        sector: "Packing",
                      },
                      {
                        key: 'UMC-0000001-4',
                        value: "Distribution",
                      },
                      {
                        key: 'UMC-0000001-5',
                        value: "Package Goods",
                      },
                    ],
                  },
                });
              }}
              variant="tertiary"
            >
              View Detail
            </Button>
          </div>
        ),
        advent: [
          {
            key: 'UMC-0000001-3',
            sector: "Packing",
          },
          {
            key: 'UMC-0000001-4',
            sector: "Distribution",
          },
          {
            key: 'UMC-0000002-5',
            sector: "Package Goods",
          },
        ],
      },
      {
        // key: 'UMC-0000002',
        id: 'UMC-0000002',
        name: 'E-Commerce',
        sector: "Distribution",
        action: (
          <div style={{ display: "flex", justifyContent: "left" }}>
            <Button
              size="small"
              onClick={() => {
                setShowEdit({
                  open: true,
                  data: {
                    name: 'E-commerce',
                    sector: [
                      {
                        key: 'UMC-0000002-1',
                        value: "Manufacture",
                      },
                      {
                        key: 'UMC-0000002-2',
                        value: "Distribution",
                      },
                      {
                        key: 'UMC-0000002-3',
                        value: "Package Goods",
                      },
                    ],
                  },
                });
              }}
              variant="tertiary"
            >
              View Detail
            </Button>
          </div>
        ),
        advent: [
          {
            key: 'UMC-0000002-1',
            sector: "Manufacture",
          },
          {
            key: 'UMC-0000002-3',
            sector: "Package Goods",
          },
        ],
      },
    ];
    setDataUoM(data);
  }, []);

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
    const data = dataUoM?.map((element) => element.children.map((el) => {
      if (el.key === rowKey.key) {
        el.status === 'ACTIVE' ? el.status = 'INACTIVE' : el.status = 'ACTIVE';
      }
      return el;
    }));
    const dataSekarang = [...dataUoM];

    dataSekarang.forEach((el, i) => {
      el.children = data[i];
    });
    setDataUoM(dataSekarang);
  };

  const checkedStatus = (status: string) => (status === 'ACTIVE');

  const columns = [
    {
      title: "Industry",
      dataIndex: "name",
      key: 'name',
    },
    TableAntd.EXPAND_COLUMN,
    {
      title: "Sector",
      dataIndex: "sector",
      key: 'sector',
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
      if (record?.id) {
        return {
          disabled: false,
        };
      }
      return {
        className: styles.overideAntdCheckbox,
      };
    },

    onChange: (selectedRowKeys: any, selectedRows: any, getCheckboxProps: any) => {
      if (!selectedRowKeys) {
      }
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
        <Text variant="h4">Industy & Sector</Text>
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
              variant="tertiary"
              onClick={() => setShowDelete({
                open: true,
                type: "selection",
                data: { uomData: dataUoM, selectedRowKeys },
              })}
              disabled={rowSelection.selectedRowKeys?.length === 0}
            >
              Delete
            </Button>
            <DropdownMenu
              title="More"
              buttonVariant="secondary"
              buttonSize="big"
              textVariant="button"
              textColor="pink.regular"
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
              onClick={() => setShowCreate(true)}
            >
              Create
            </Button>
          </Row>
        </Row>
      </Card>
      <Spacer size={10} />
      <Card style={{ padding: "16px 20px" }}>
        <Col gap="60px">
          <Table
            loading={isLoadingUOM || isFetchingUOM}
            columns={columns}
            data={dataUoM}
            rowSelection={rowSelection}
            rowKey={(record) => record.id}
            expandable={{
              // expandRowByClick: true,
              // expandIcon: true,
              expandedRowRender: (record) => (
                <div className={styles.expandableTable} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {record.advent.map((e: { sector: string; }) => (
                    <p className={styles.tableDropdown}>{e.sector}</p>
                  ))}
                </div>
              ),
              expandIconColumnIndex: 0,
            }}
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
          title="Confirm Delete"
          footer={null}
          content={(
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
          )}
        />
      )}

      {isShowCreate && (
        <Modal
          centered
          width="450px"
          visible={isShowCreate}
          onCancel={() => setShowCreate(false)}
          footer={null}
          content={(
            <TopButtonHolder>
              <CreateTitle>
                Create New Industry & Sector
              </CreateTitle>
              <Spacer size={20} />
              <Col width="100%">
                <Input
                  width="80%"
                  label="Industry"
                  height="40px"
                  placeholder="e.g FMCG"
                  addonAfter="PCS"
                />
              </Col>

              <Spacer size={15} />

              <Col width="100%">
                <InputWithTags
                  width="80%"
                  label="Sector"
                  height="40px"
                  placeholder="Type with separate comma or by pressing enter"
                  onChange={(e) => console.log(e)}
                />
              </Col>

              <Spacer size={15} />

              <ModalButtonHolder>
                <ModalButton
                  variant="tertiary"
                  key="submit"
                  type="primary"
                  onClick={() => setShowCreate(false)}
                >
                  Cancel
                </ModalButton>
                <ModalButton
                  variant="primary"
                  onClick={() => console.log('masuk')}
                >
                  save
                </ModalButton>
              </ModalButtonHolder>
            </TopButtonHolder>
        )}
        />
      )}

      {isShowEdit.open && (
        <Modal
          centered
          width="450px"
          visible={isShowEdit}
          onCancel={() => setShowEdit({ open: false, data: {} })}
          footer={null}
          content={(
            <TopButtonHolder>
              <CreateTitle>
                Create New Industry & Sector
              </CreateTitle>
              <Spacer size={20} />
              <Col width="100%">
                <Input
                  width="80%"
                  label="Industry"
                  height="40px"
                  defaultValue={isShowEdit?.data?.name}
                  placeholder="e.g FMCG"
                  addonAfter="PCS"
                />
              </Col>

              <Spacer size={15} />

              <Col width="100%">
                <InputWithTags
                  width="80%"
                  label="Sector"
                  height="40px"
                  defaultValue={isShowEdit?.data?.sector}
                  placeholder="Type with separate comma or by pressing enter"
                  onChange={(e) => console.log(e)}
                />
              </Col>

              <Spacer size={15} />

              <ModalButtonHolder>
                <ModalButton
                  variant="tertiary"
                  key="submit"
                  type="primary"
                  onClick={() => setShowEdit({ open: false, data: {} })}
                >
                  Cancel
                </ModalButton>
                <ModalButton
                  variant="primary"
                  onClick={() => console.log('masuk')}
                >
                  save
                </ModalButton>
              </ModalButtonHolder>
            </TopButtonHolder>
        )}
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

const TopButtonHolder = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;
const CreateTitle = styled.div`
  margin-top: 1rem;
  font-weight: 600;
  font-size: 1.5rem;
`;

const ModalButtonHolder = styled.div`
    display: flex;
    justify-content: space-between;
    gap: 20px;
    margin-bottom: 20px;
`;

const ModalButton = styled(Button)`
  width: 50%;
`;
export default UOMConversion;
