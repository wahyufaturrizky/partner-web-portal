import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useFetchDetailSalesman } from "hooks/mdm/salesman/useSalesmanDivision";
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
  Spin,
  DropdownMenu,
  FileUploadModal,
  FileUploaderAllFilesDragger,
  Input, 
} from "pink-lava-ui";
import usePagination from "@lucasmogari/react-pagination";
import { useRouter } from "next/router";
import {
    useBranchList,
    useDeleteBranch,
  } from "hooks/mdm/branch/useBranch";
import useDebounce from "lib/useDebounce";
import { queryClient } from "pages/_app";



const renderConfirmationText = (type: any, data: any) => {
  switch (type) {
    case "selection":
      return data.selectedRowKeys.length > 1
        ? `Are you sure to delete ${data.selectedRowKeys.length} items ?`
        : `Are you sure to delete Branch Name ${
            data?.uomData?.data.find((el: any) => el.key === data.selectedRowKeys[0])?.uomName
          } ?`;
    case "detail":
      return `Are you sure to delete Branch Name ${data.uomName} ?`;

    default:
      break;
  }
};

const ModalManageLanguage = ({
	listProducts,
	formsUpdate,
	onCancel,
	visible,
	onOk
}: any) => {
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
//   const [modalForm, setModalForm] = useState({
//     open: false,
//     data: {},
//     typeForm: "create",
//   });
  const [isShowCreate, setShowCreate] = useState(false)
  const [isShowDetail, setShowDetail] = useState(false)
  const [countryFlag, setCountryFlag] = useState(null)
  const [forms, setForms] = useState({
    name: "",
    description: "",
  });

  const isDisabledButton = true


  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const debounceSearch = useDebounce(search, 1000);

  const {
    data: branchData,
    isLoading: isLoadingBranch,
    isFetching: isFetchingBranch,
  } = useBranchList({
    query: {
      search: debounceSearch,
      page: pagination.page,
      limit: pagination.itemsPerPage,
      company_id: "KSNI"
    },
    options: {
      onSuccess: (data: any) => {
        pagination.setTotalItems(data.totalRow);
      },
      select: (data: any) => {
        const mappedData = data?.rows?.map((element: any) => {
            return {
              key: element.branchId,
              id: element.branchId,
              branchName: element.name,
              action: (
                <div style={{ display: "flex", justifyContent: "left" }}>
                  <Button
                    size="small"
                    onClick={() => setShowDetail(true)}
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

  const { mutate: deleteBranch, isLoading: isLoadingDeleteBranch } = useDeleteBranch({
    options: {
      onSuccess: () => {
        setShowDelete({ open: false, data: {}, type: "" });
        setSelectedRowKeys([]);
        queryClient.invalidateQueries(["branch-list"]);
      },
    },
  });

  const columns = [
    {
      title: "Language Code",
      dataIndex: "id",
    },
    {
      title: "Language Name",
      dataIndex: "branchName",
    },
    {
      title: "Language Flag",
      dataIndex: "branchName",
    },
    {
      title: "Action",
      dataIndex: "action",
      width: "25%",
      align: "left",
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys: any) => {
      setSelectedRowKeys(selectedRowKeys);
    },
  };

	return (
		<Modal
			width={750}
			visible={visible}
			onCancel={onCancel}
			title="Manage Language"
			footer={
				<></>
			}
			content={
				<>
                    <Spacer size={40} />
                        <Row justifyContent="space-between">
                        <Search
                            width="380px"
                            placeholder="Search Branch ID, Name."
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
                                data: { branchData, selectedRowKeys },
                                })
                            }
                            disabled={rowSelection.selectedRowKeys?.length === 0}
                            >
                            Delete
                            </Button>
                            <Button size="big" variant="primary" onClick={() => setShowCreate(true)}>
                            Add New
                            </Button>
                        </Row>
                        </Row>
                    <Spacer size={30} />
                        <Col gap={"60px"}>
                        <Table
                            loading={isLoadingBranch || isFetchingBranch}
                            columns={columns}
                            data={branchData?.data}
                            rowSelection={rowSelection}
                        />
                        <Pagination pagination={pagination} />
                        </Col>

                    {isShowDelete.open && (
                        <Modal
                        closable={false}
                        centered
                        visible={isShowDelete.open}
                        onCancel={() => setShowDelete({ open: false, type: "", data: {} })}
                        title={"Confirm Delete"}
                        footer={null}
                        content={
                            <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                            }}
                            >
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
                                    deleteBranch({ ids: selectedRowKeys, company_id: "KSNI" });
                                    } else {
                                    deleteBranch({ ids: [modalForm.data.id], company_id: "KSNI" });
                                    }
                                }}
                                >
                                {isLoadingDeleteBranch ? "loading..." : "Yes"}
                                </Button>
                            </div>
                            </div>
                        }
                        />
                    )}

                    <Modal
                        width={500}
                        visible={isShowCreate}
                        onCancel={() => setShowCreate(false)}
                        title="Add New Language"
                        footer={
                            <Footer>
                                <Button
                                    onClick={() => setShowCreate(false)}
                                    full
                                    variant="tertiary"
                                    size="big">
                                    Cancel
                                </Button>
                                <Button
                                    onClick={() => onOk({
                                        ...forms,
                                        itemSelected
                                    })}
                                    full
                                    variant="primary"
                                    size="big"
                                    disabled={isDisabledButton}
                                >
                                    Save
                                </Button>
                            </Footer>
                        }
                        content={
                            <Container>
                                <Spacer size={20} />
                                <Input
                                    value={forms.name}
                                    placeholder="e.g EN-US"
                                    onChange={({ target }: any) =>
                                        setForms({ ...forms, name: target.value })}
                                    required
                                    label="Language Code"
                                />
                                <Spacer size={20} />
                                <Input
                                    value={forms.description}
                                    placeholder="e.g English"
                                    onChange={({ target }: any) =>
                                        setForms({ ...forms, description: target.value })}
                                    label="Language Name"
                                />
                                <Spacer size={30} />
                                <div style={{
                                    display: "flex"
                                }}>
                                    <Text variant="headingRegular">Language Flag</Text>
                                    <Spacer size={5}/>
                                    <Text variant="caption" textAlign={"center"}>(Max. 5MB, Format .jpg, .png)</Text>
                                </div>
                                <Spacer size={5}/>
                                <FileUploaderAllFilesDragger 
                                    disabled={false}
                                    inputHeight={"65px"}
                                    inputBorderColor={"pink"}
                                    onSubmit={(file: any) => {
                                        setCountryFlag(file);
                                        console.log(file, '<<<file')
                                      }}
                                    defaultFileList={[]}
                                    defaultFile={"/placeholder-employee-photo.svg"}
                                    withCrop
                                    editCrop
                                    removeable
                                />
                                <Spacer size={30}/>

                            </Container>
                        }
                    />
                    </>
			}
		/>
	);
};

const Card = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: 16px;
`;

const Uploader = styled(FileUploaderAllFilesDragger)`
    border-color: pink;
    margin-bottom: 100px;

    .ant-upload-select-picture-card i {
        font-size: 32px;
        color: red;
      }

    .ant-upload-select-picture-card .ant-upload-text {
        margin-top: 8px;
        color: red;
      }
`

const Footer = styled.div`
  display: flex;
  marginbottom: 12px;
  marginright: 12px;
  justifycontent: flex-end;
  gap: 12px;
`;

const Container = styled.div``;

export default ModalManageLanguage;
