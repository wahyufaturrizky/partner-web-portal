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
  Image,
  FileUploaderAllFilesDragger,
  Input, 
} from "pink-lava-ui";
import usePagination from "@lucasmogari/react-pagination";
import { useRouter } from "next/router";
import useDebounce from "lib/useDebounce";
import { queryClient } from "pages/_app";
import { useAllLibraryLanguage, useCreateLibraryLanguage, useDeleteLibraryLanguage, useUpdateLibraryLanguage } from "hooks/mdm/library-language/useLibraryLanguage";



const renderConfirmationText = (type: any, data: any) => {
  switch (type) {
    case "selection":
      return data.selectedRowKeys.length > 1
        ? `Are you sure to delete ${data.selectedRowKeys.length} items ?`
        : `Are you sure to delete Library Language with code ${
            data?.libraryLanguageData?.data.find((el: any) => el.key === data.selectedRowKeys[0])?.key
          } ?`;
    case "detail":
      return `Are you sure to delete Branch Name ${data.uomName} ?`;

    default:
      break;
  }
};

const ModalManageLanguage = ({
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
  const [isShowCreate, setShowCreate] = useState(false)
  const [isShowDetail, setShowDetail] = useState({ open: false, key: "", name: "", file: "" })
  const [file, setFile] = useState(null)

  const [forms, setForms] = useState({
    id: "",
    name: "",
  });

  const isDisabledButton = false

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const debounceSearch = useDebounce(search, 1000);

  
  const {
    data: libraryLanguageData,
    isLoading: isLoadingLibraryLanguage,
    isFetching: isFetchingLibraryLanguage,
  } = useAllLibraryLanguage({
    query: {
      search: debounceSearch,
      page: pagination.page,
      limit: pagination.itemsPerPage,
    },
    options: {
      onSuccess: (data: any) => {
        pagination.setTotalItems(data?.totalRow);
      },
      select: (data: any) => {
        const mappedData = data?.rows?.map((element: any) => {
            return {
              key: element?.id,
              id: element?.id,
              languageName: element?.name,
              languageLogo: element.file,
              action: (
                <div style={{ display: "flex", justifyContent: "left" }}>
                  <Button
                    size="small"
                    onClick={() => setShowDetail({ open: true, key: element.id, name: element.name, file: element.file })}
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

  const { mutate: deleteLibraryLanguage, isLoading: isLoadingDeleteLibraryLanguage } = useDeleteLibraryLanguage({
    options: {
      onSuccess: () => {
        setShowDelete({ open: false, data: {}, type: "" });
        setSelectedRowKeys([]);
        queryClient.invalidateQueries(["language-list"]);
      },
    },
  });

  const { mutate: createLibraryLanguage, isLoading: isLoadingCreateLibraryLanguage } = useCreateLibraryLanguage({
    options: {
      onSuccess: () => {
        setShowCreate(false);
        queryClient.invalidateQueries(["language-list"]);
      },
    },
  });

  const { mutate: updateLibraryLanguage, isLoading: isLoadingUpdateLibraryLanguage } = useUpdateLibraryLanguage({
    id: isShowDetail.key,
    options: {
      onSuccess: () => {
        setShowDetail({ open: false, key: "", name: "", file: "" });
        queryClient.invalidateQueries(["language-list"]);
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
      dataIndex: "languageName",
    },
    {
      title: "Language Flag",
      dataIndex: "languageLogo",
      render: (languageLogo: any, record: any) => {
        return(
          <div>
            <img
            style={{
              borderRadius: "50%",
              margin: "0 auto"
            }}
              alt={languageLogo}
              width={50}
              height={50}
              src={record?.languageLogo}
              />
          </div>
      )}
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

  if(isLoadingLibraryLanguage){
    return (
      <div>
        <Spin/>
      </div>
    )
  }
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
                      data: { libraryLanguageData, selectedRowKeys },
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
                  loading={isLoadingLibraryLanguage || isFetchingLibraryLanguage}
                  columns={columns}
                  data={libraryLanguageData?.data}
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
                          deleteLibraryLanguage({ ids: selectedRowKeys, company_id: "KSNI" });
                          } else {
                          deleteLibraryLanguage({ ids: [modalForm.data.id], company_id: "KSNI" });
                          }
                      }}
                      >
                      {isLoadingDeleteLibraryLanguage ? "loading..." : "Yes"}
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
                          onClick={() => {
                            const formData = new FormData();
                            formData.append("id", forms.id);
                            formData.append("name", forms.name)
                            formData.append("file", file);
                            createLibraryLanguage(formData)
                          }}
                          full
                          variant="primary"
                          size="big"
                          disabled={isDisabledButton}
                      >
                          {isLoadingCreateLibraryLanguage ? "...loading" : "Save"}
                      </Button>
                  </Footer>
              }
              content={
                  <Container>
                      <Spacer size={20} />
                      <Input
                          value={forms.id}
                          placeholder="e.g EN-US"
                          onChange={({ target }: any) =>
                              setForms({ ...forms, id: target.value })}
                          required
                          label="Language Code"
                      />
                      <Spacer size={20} />
                      <Input
                          value={forms.name}
                          placeholder="e.g English"
                          onChange={({ target }: any) =>
                              setForms({ ...forms, name: target.value })}
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
                              setFile(file);
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

          <Modal
              width={500}
              visible={isShowDetail?.open}
              onCancel={() => setShowDetail({ open: false, key: "", name: "", file: "" })}
              title="Add New Language"
              footer={
                  <Footer>
                      <Button
                          onClick={() => setShowDetail({ open: false, key: "", name: "", file: "" })}
                          full
                          variant="tertiary"
                          size="big">
                          Cancel
                      </Button>
                      <Button
                          onClick={() => {
                            const formData = new FormData();
                            formData.append("name", isShowDetail?.name)
                            formData.append("file", isShowDetail?.file);
                            updateLibraryLanguage(formData)
                          }}
                          full
                          variant="primary"
                          size="big"
                          disabled={isDisabledButton}
                      >
                          {isLoadingUpdateLibraryLanguage ? "...loading" : "Save"}
                      </Button>
                  </Footer>
              }
              content={
                  <Container>
                      <Spacer size={20} />
                      <Input
                          value={isShowDetail?.key}
                          disabled
                          placeholder="e.g EN-US"
                          onChange={({ target }: any) =>
                              setShowDetail({ ...isShowDetail, key: target.value })}
                          required
                          label="Language Code"
                      />
                      <Spacer size={20} />
                      <Input
                          value={isShowDetail?.name}
                          placeholder="e.g English"
                          onChange={({ target }: any) =>
                              setShowDetail({ ...isShowDetail, name: target.value })}
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
                            console.log(file, '<<<<cek')
                              setShowDetail({...isShowDetail, file});
                            }}
                          defaultFileList={[isShowDetail?.file]}
                          defaultFile={isShowDetail?.file}
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

const Footer = styled.div`
  display: flex;
  marginbottom: 12px;
  marginright: 12px;
  justifycontent: flex-end;
  gap: 12px;
`;

const Container = styled.div``;

export default ModalManageLanguage;
