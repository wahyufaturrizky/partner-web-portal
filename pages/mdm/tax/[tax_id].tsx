import React, { useEffect, useState } from "react";
import {
  Text,
  Col,
  Row,
  Spacer,
  Button,
  Modal,
  FormSelect,
  Switch,
  Spin,
  Tabs,
} from "pink-lava-ui";
import styled from "styled-components";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useRouter } from "next/router";
import usePagination from "@lucasmogari/react-pagination";
import {
  useCountryTaxInfiniteLists,
  useCreateTax,
  useDeleteTaxItem,
  useDeleteTaxItemDetail,
  useDeletTax,
  useTaxInfiniteLists,
  useUpdateTax,
} from "hooks/mdm/Tax/useTax";
import {
  columnsTaxType,
  dataTaxType,
  listTabItems,
  TaxBodyFields,
} from "components/pages/Tax/constants";
import TaxList from "components/pages/Tax/fragments/TaxList";
import VatList from "components/pages/Tax/fragments/VatList";
import { ICDelete, ICEdit } from "assets";
import WithholdingForm from "components/pages/Tax/fragments/WithholdingForm";
import TaxTypeForm from "components/pages/Tax/fragments/TaxTypeForm";
import moment from "moment";
import { useUserPermissions } from "hooks/user-config/usePermission";
import ArrowLeft from "../../../assets/icons/arrow-left.svg";
import { ModalDeleteConfirmation } from "../../../components/elements/Modal/ModalConfirmationDelete";
import useDebounce from "../../../lib/useDebounce";
import { queryClient } from "../../_app";

const renderConfirmationText = (type: any, data: any) => {
  switch (type) {
    case "selection":
      return data.selectedRowKeys.length > 1
        ? `Are you sure to delete ${data.selectedRowKeys.length} items ?`
        : `Are you sure to delete Tax Name ${data?.tax_item_name} ?`;
    case "detail":
      return `Are you sure to delete Uom Name ${data.uomName} ?`;
    case "item-detail":
      return `Are you sure to delete  ${data.name} ?`;

    default:
      break;
  }
};

interface TaxDetail {
  countryName: string;
  taxId: string;
  country: { name: string };
  countryId: string;
  name: string;
  percentage: string;
  activeStatus: string;
  taxItems: [
    {
      taxItemId: string;
      taxItemType: string;
      taxName: string;
      glAccount: string;
      taxType: string;
      taxCode: string;
      details: [
        {
          tax_item_id: string;
          tax_item_detail_id: string;
          period_from: string;
          period_to: string;
          percentage: string;
          percentage_subject_to_tax: string;
          withholding_tax_rate: string;
        }
      ];
    }
  ];
}
type FormValues = {
  tax_id: string;
  tax_name: string;
  tax_item_type: string;
  gl_account: string;
  tax_type: string;
  tax_code: string;
  status: string;
  item_details: {
    tax_item_id: string;
    tax_item_detail_id: string;
    period_from: any;
    period_to: any;
    percentage: string;
    percentage_subject_to_tax: string;
    withholding_tax_rate: string;
  }[];
};

const TaxDetail = () => {
  const router = useRouter();
  const pagination = usePagination({
    page: 1,
    itemsPerPage: 20,
    maxPageItems: Infinity,
    numbers: true,
    arrows: true,
    totalItems: 100,
  });
  const { tax_id } = router.query;
  const [listTaxCountries, setListTaxCountries] = useState<any[]>([]);
  const [totalRows, setTotalRows] = useState(0);
  const [search, setSearch] = useState("");

  const [isShowDelete, setShowDelete] = useState({ open: false, type: "selection", data: {} });
  const [showCreateModal, setShowCreateModal] = useState({ open: false, type: "", data: {} });
  const [showTaxTypeModal, setShowTaxTypeModal] = useState(false);

  const debounceSearch = useDebounce(search, 1000);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [statusId, setStatusId] = useState(null);
  const [updatedTaskData, setUpdatedTaskData] = useState(null);
  const [tabAktived, setTabAktived] = useState<string>("Withholding Tax");
  const [formType, setFormType] = useState<string>("Withholding Tax");
  const [arrayTax, setArrayTax] = useState<{ data: string }[]>([]);
  const [allTaxData, setAllTaxData] = useState<{ data: string }[]>([]);
  const [taxItemId, setTaxItemId] = useState(null);

  const { data: dataUserPermission } = useUserPermissions({
    options: {
      onSuccess: () => {},
    },
  });

  const listPermission = dataUserPermission?.permission?.filter(
    (filtering: any) => filtering.menu === "Tax"
  );

  const {
    register,
    control,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
    setValue,
  } = useForm<FormValues>({
    defaultValues: {
      tax_id: "",
      tax_name: "",
      tax_item_type: "",
      gl_account: "",
      tax_type: "",
      tax_code: "",
      status: "",
      item_details: [
        {
          tax_item_id: "",
          tax_item_detail_id: "",
          period_from: moment(),
          period_to: moment(),
          percentage: "",
          percentage_subject_to_tax: "",
          withholding_tax_rate: "",
        },
      ],
    },
  });

  const {
    isFetching: isFetchingCountryList,
    isFetchingNextPage: isFetchingMoreCountryList,
    hasNextPage,
    fetchNextPage,
  } = useCountryTaxInfiniteLists({
    query: {
      search: debounceSearch,
      limit: 10,
    },
    options: {
      onSuccess: (data: any) => {
        setTotalRows(data.pages[0].totalRow);
        const mappedData = data?.pages[0]?.map((country: any) => ({
          id: country.id,
          value: country.id,
          label: country.name,
        }));
        setListTaxCountries(mappedData);
      },
      getNextPageParam: (_lastPage: any, pages: any) => {
        if (listTaxCountries?.length < totalRows) {
          return pages.length + 1;
        }
        return undefined;
      },
    },
  });
  // switch elements detail information
  const switchTabItem = () => {
    switch (tabAktived) {
      case "Withholding Tax":
        return <TaxList {...propsTaxList} />;
      case "VAT":
        return <VatList {...propsTaxList} />;
      default:
        return null;
    }
  };
  // useFieldArray ADDRESSES
  const {
    fields: fieldsTax,
    append: appendTax,
    replace: replaceTax,
    remove,
  } = useFieldArray({
    control,
    name: "item_details",
  });

  const {
    data: TaxData,
    isLoading: isLoadingTax,
    isFetching: isFetchingTax,
  } = useTaxInfiniteLists({
    query: {
      country_id: tax_id,
      search: debounceSearch,
      page: pagination.page,
      limit: pagination.itemsPerPage,
    },
    options: {
      onSuccess: (data: any) => {
        pagination.setTotalItems(data?.totalRow);
        if (data) {
          setAllTaxData(data?.data);
        }
      },
      select: (data: any) => {
        const mappedData = data?.pages[0]?.rows?.map((taxDetail: TaxDetail, _index: any) => ({
          key: _index,
          id: taxDetail.taxId,
          country_name: taxDetail.country.name,
          country_id: taxDetail.countryId,
          name: taxDetail.name,
          percentage: taxDetail.percentage,
          active_status: taxDetail.activeStatus,
          tax_item: taxDetail.taxItems.map((item: any) => ({
            tax_item_id: item.taxItemId,
            tax_item_name: item.taxName,
            tax_item_type: item.taxItemType,
            gl_account: item.glAccount,
            tax_type: item.taxType,
            tax_code: item.taxCode,
            deleted_by: item.deletedBy,
            status: item.status,
            details: item.details.map((item_detail: any) => ({
              tax_item_id: item_detail.taxItemId,
              tax_item_detail_id: item_detail.taxItemDetailId,
              period_from: item_detail.periodFrom,
              period_to: item_detail.periodTo,
              percentage: item_detail.percentage,
              percentage_subject_to_tax: item_detail.percentageSubjectToTax,
              withholding_tax_rate: item_detail.withholdingTaxRate,
              deleted_by: item_detail.deletedBy,
            })),
          })),
        }));
        return { data: mappedData, totalRows: data.totalRow };
      },
    },
  });

  const { mutate: deleteTaxItem, isLoading: isLoadingDeleteTaxItem } = useDeleteTaxItem({
    options: {
      onSuccess: () => {
        queryClient.invalidateQueries(["tax/infinite"]);
        setShowDelete({ open: false, type: "selection", data: {} });
        // router.back();
      },
    },
  });
  const { mutate: updateTax, isLoading: isLoadingUpdateTax } = useUpdateTax({
    id: TaxData?.data[0]?.id,
    taxItem: taxItemId,
    options: {
      onSuccess: () => {
        queryClient.invalidateQueries(["tax/infinite"]);
      },
    },
  });

  const { mutate: createTax, isLoading: isLoadingCreateTax } = useCreateTax({
    options: {
      onSuccess: () => {
        queryClient.invalidateQueries(["tax/infinite"]);
        reset();
      },
    },
  });

  const { mutate: deleteTaxItemDetail, isLoading: isLoadingDeleteTaxItemDetail } =
    useDeleteTaxItemDetail({
      options: {
        onSuccess: () => {
          queryClient.invalidateQueries(["tax/infinite"]);
          setShowDelete({ open: false, type: "selection", data: {} });
          // router.back();
        },
      },
    });
  useEffect(() => {
    if (updatedTaskData) {
      updateTax(updatedTaskData);
    }
  }, [updatedTaskData]);

  // belum bisa dari backend
  const deleteTax = (param: any, type: any) => {
    const deleteParam: any = {
      tax_ids: [TaxData?.data[0]?.id],
      tax_item_ids: [param.tax_item_id],
      tax_item_detail_ids: [param?.tax_item_detail_id],
    };
    if (type == "item-detail") {
      delete deleteParam.tax_ids;
      deleteTaxItemDetail(deleteParam);
    } else {
      delete deleteParam.tax_item_detail_ids;
      deleteTaxItem(deleteParam);
    }
  };

  const handleNewTax = (data: any) => {
    const newTax: any = {
      tax_id: TaxData?.data[0]?.id,
      tax_name: data.tax_name,
      tax_item_type: tabAktived == "Withholding Tax" ? "WITHHOLDING" : tabAktived,
      gl_account: `${data.gl_account}`,
      tax_type: data.tax_type,
      tax_code: data.tax_code,
      status: "ACTIVE",
      item_details: data.item_details?.map((item: any) => ({
        tax_item_id: taxItemId,
        tax_item_detail_id: item?.tax_item_detail_id ? item?.tax_item_detail_id : "",
        percentage: item?.percentage ? item?.percentage : "",
        // period_from: item?.period ? moment(item?.period[0]).format("DD/MM/YYYY") : "",
        period_from: item.period
          ? item.period[0].includes("/")
            ? item.period[0]
            : moment(item.period[0]).format("DD/MM/YYYY")
          : "",
        period_to: item.period
          ? item.period[1].includes("/")
            ? item.period[1]
            : moment(item.period[1]).format("DD/MM/YYYY")
          : "",
        percentage_subject_to_tax: item?.percentage_subject_to_tax
          ? item?.percentage_subject_to_tax
          : "",
        withholding_tax_rate: item?.withholding_tax_rate ? item?.withholding_tax_rate : "",
      })),
    };
    if (showCreateModal.type == "edit") {
      delete newTax.tax_id;
      updateTax(newTax);
    } else {
      createTax(newTax);
    }

    setShowCreateModal({ open: false, type: "", data: {} });
  };

  const updateTaxStatus = (rowKey: any) => {
    const data: any = {
      tax_name: rowKey?.tax_item_name,
      tax_item_type: rowKey?.tax_item_type,
      gl_account: rowKey?.gl_account,
      tax_type: rowKey?.tax_type,
      tax_code: rowKey?.tax_code,
      status: rowKey?.status === "ACTIVE" ? "INACTIVE" : "ACTIVE",
      item_details: [
        {
          tax_item_id: rowKey?.tax_item_id,
          percentage: rowKey?.percentage,
          // period_from: "17/11/2022",
          // period_to: "18/11/2022",
          percentage_subject_to_tax: rowKey?.percentage_subject_to_tax,
          withholding_tax_rate: rowKey?.withholding_tax_rate,
        },
      ],
    };
    setStatusId(rowKey.key);
    setUpdatedTaskData(data);
  };

  const checkedStatus = (status: string) => status === "ACTIVE";

  const columns = [
    { title: "", dataIndex: "key" },
    { title: "", dataIndex: "id" },
    { title: "", dataIndex: "tax_item_type" },
    {
      title: "",
      dataIndex: "action",
      width: "15%",
      render: (_: any, record: any) => {
        if (record.tax_item_name) {
          return (
            <Row gap="16px" alignItems="center" nowrap>
              <Col>
                <ICEdit onClick={() => onHandleEdit(record)} />
              </Col>
              <Col>
                <ICDelete
                  onClick={() =>
                    setShowDelete({
                      open: true,
                      type: "selection",
                      data: {
                        tax_item_id: record.tax_item_id,
                        tax_item_name: record.tax_item_name,
                        selectedRowKeys,
                      },
                    })
                  }
                />
              </Col>
            </Row>
          );
        }
      },
    },
    {
      title: "Tax Name",
      dataIndex: "tax_item_name",
      key: "tax_item_name",
    },
    {
      title: "G/L Account",
      dataIndex: "gl_account",
      key: "gl_account",
    },
    {
      title: "Tax Type",
      dataIndex: "tax_type",
      key: "tax_type",
    },
    {
      title: "Tax Code",
      dataIndex: "tax_code",
      key: "tax_code",
    },
    {
      title: "Percentage",
      dataIndex: "percentage",
      key: "percentage",
    },
    {
      title: "Percentage Subject Tax",
      dataIndex: "percentage_subject_to_tax",
      key: "percentage_subject_to_tax",
    },
    {
      title: "Withholding Rate",
      dataIndex: "withholding_tax_rate",
      key: "withholding_tax_rate",
    },
    {
      title: "Period",
      dataIndex: "period",
      key: "period",
    },
    {
      title: "Active",
      dataIndex: "status",
      render: (status: string, rowKey: any) => {
        if (rowKey.tax_item_name) {
          return (
            <Switch
              checked={checkedStatus(rowKey?.status)}
              onChange={() => {
                setTaxItemId(rowKey?.tax_item_id);
                updateTaxStatus(rowKey);
              }}
            />
          );
        }
      },
    },
  ];

  const datadetails = allTaxData[0]?.tax_item.map((item) => {
    const datadetails = item.details.map((item2, index) => ({
      tax_item_id: item.tax_item_id,
      tax_item_name: index !== 0 ? null : item.tax_item_name,
      gl_account: index !== 0 ? null : item.gl_account,
      tax_type: index !== 0 ? null : item.tax_type,
      tax_item_type: item.tax_item_type,
      tax_code: index !== 0 ? null : item.tax_code,
      percentage: item2.percentage,
      percentage_subject_to_tax: item2.percentage_subject_to_tax,
      withholding_tax_rate: item2.withholding_tax_rate,
      status: item.status,
      period: `${moment(item2.period_from).format("D MMM YYYY")} to ${moment(
        item2.period_to
      ).format("D MMM YYYY")}`,
      details: item.details,
      deleted_by: item.deleted_by,
    }));
    return datadetails;
  });
  const dataMerge = [].concat.apply([], datadetails);

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys: any) => {
      setSelectedRowKeys(selectedRowKeys);
    },
  };

  if (isLoadingTax || isFetchingTax || isLoadingUpdateTax) {
    return (
      <Center>
        <Spin tip="Loading data..." />
      </Center>
    );
  }
  const onHandleEdit = (render: any) => {
    setShowCreateModal({ open: true, type: "edit", data: render });
    setTaxItemId(render.tax_item_id);
  };
  const removeBankAccount = (param: any) => {
    const columns = arrayTax.filter((filtering: any) => filtering?.key !== param);
    setArrayTax(columns);
  };
  const propsTaxList = {
    onHandleEdit,
    isLoadingTax,
    isFetchingTax,
    columns,
    data: TaxData?.data[0]?.tax_item,
    rowSelection,
    pagination,
    removeBankAccount,
    setShowCreateModal,
    dataSource: dataMerge,
  };
  const propsWithHolding = {
    control,
    register,
    fieldsTax,
    appendTax,
    replaceTax,
    remove,
    TaxBodyFields,
    getValues,
    reset,
    setShowTaxTypeModal,
    tabAktived,
    errors,
    showCreateModal,
    setValue,
    setShowDelete,
  };

  const propsTaxType = {
    control,
    register,
    getValues,
    reset,
    setShowTaxTypeModal,
    columns: columnsTaxType,
    data: dataTaxType[0].data.rows,
  };

  return (
    <>
      <Col>
        <Row gap="4px">
          <ArrowLeft style={{ cursor: "pointer" }} onClick={() => router.back()} />
          <Text variant="h4">
            Tax-
            {TaxData?.data[0]?.country_name}
          </Text>
        </Row>
        <Spacer size={20} />

        <Card>
          <Spacer size={10} />
          <Row width="50%" noWrap>
            <Col width="100%">
              <Controller
                control={control}
                name="country_id"
                defaultValue={TaxData?.data[0]?.country_id}
                render={({ field: { onChange } }) => (
                  <>
                    <Label>Country</Label>
                    <Spacer size={3} />
                    <FormSelect
                      defaultValue={TaxData?.data[0]?.country_name}
                      style={{ width: "100%" }}
                      size="large"
                      placeholder="Select"
                      borderColor="#AAAAAA"
                      arrowColor="#000"
                      required
                      withSearch
                      disabled
                      isLoading={isFetchingCountryList}
                      isLoadingMore={isFetchingMoreCountryList}
                      fetchMore={() => {
                        if (hasNextPage) {
                          fetchNextPage();
                        }
                      }}
                      items={
                        isFetchingCountryList && !isFetchingMoreCountryList ? [] : listTaxCountries
                      }
                      onChange={(value: any) => {
                        onChange(value);
                      }}
                      onSearch={(value: any) => {
                        setSearch(value);
                      }}
                    />
                  </>
                )}
              />
            </Col>
          </Row>
          <Spacer size={20} />
          <Col>
            {/* <HeaderLabel>Tax</HeaderLabel>
              <Spacer size={20} />
              <Row gap="16px">
                <Button size="big" variant={"primary"} onClick={() => setShowCreateModal(true)}>
                  + Add New
                </Button>
                <Button
                  size="big"
                  variant={"tertiary"}
                  onClick={() =>
                    setShowDelete({
                      open: true,
                      type: "selection",
                      data: { taxData: TaxData?.data, selectedRowKeys },
                    })
                  }
                  disabled={rowSelection.selectedRowKeys?.length === 0}
                >
                  Delete
                </Button>
              </Row>
              <Spacer size={20} /> */}
            <Tabs
              defaultActiveKey={tabAktived}
              listTabPane={listTabItems.slice(0, listTabItems.length)}
              onChange={(e: any) => setTabAktived(e)}
            />
            <Spacer size={20} />
            {switchTabItem()}
            <Spacer size={100} />
          </Col>
        </Card>
      </Col>

      {showCreateModal.open && (
        <Modal
          // style={{fontSize: '20px'}}
          centered
          width="60%"
          visible={showCreateModal.open}
          onCancel={() => setShowCreateModal({ open: false, type: "", data: {} })}
          footer={null}
          content={
            <TopButtonHolder>
              <CreateTitle>
                Add New
                {tabAktived}
              </CreateTitle>
              <Spacer size={20} />
              <WithholdingForm {...propsWithHolding} />
              <Spacer size={100} />
              <DeleteCardButtonHolder>
                <Button
                  // size="medium"
                  variant="tertiary"
                  key="submit"
                  type="primary"
                  onClick={() => setShowCreateModal({ open: false, type: "", data: {} })}
                >
                  Cancel
                </Button>
                {listPermission?.filter(
                  (data: any) =>
                    data.viewTypes[0]?.viewType.name === "Create" ||
                    data.viewTypes[0]?.viewType.name === "Update"
                ).length > 0 && (
                  <Button
                    variant="primary"
                    // size="small"
                    onClick={handleSubmit(handleNewTax)}
                  >
                    save
                  </Button>
                )}
              </DeleteCardButtonHolder>
            </TopButtonHolder>
          }
        />
      )}

      {isShowDelete.open && (
        <Modal
          closable={false}
          centered
          visible={isShowDelete.open}
          onCancel={() => setShowDelete({ open: false, type: "", data: {} })}
          title="Confirm Delete"
          footer={null}
          content={
            <TopButtonHolder>
              <Spacer size={4} />
              {renderConfirmationText(isShowDelete.type, isShowDelete.data)}
              <Spacer size={20} />
              <DeleteCardButtonHolder>
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
                    deleteTax(isShowDelete.data, isShowDelete.type);
                  }}
                >
                  {isLoadingDeleteTaxItem || isLoadingDeleteTaxItemDetail ? "loading..." : "Yes"}
                </Button>
              </DeleteCardButtonHolder>
            </TopButtonHolder>
          }
        />
      )}

      {showTaxTypeModal && (
        <Modal
          // style={{fontSize: '20px'}}
          centered
          width="60%"
          visible={showTaxTypeModal}
          onCancel={() => setShowTaxTypeModal(false)}
          footer={null}
          content={
            <TopButtonHolder>
              <CreateTitle>Add New Tax Type Modal</CreateTitle>
              <Spacer size={20} />
              <TaxTypeForm {...propsTaxType} />
              <Spacer size={100} />
              <DeleteCardButtonHolder>
                <Button
                  // size="medium"
                  variant="tertiary"
                  key="submit"
                  type="primary"
                  onClick={() => setShowTaxTypeModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  // size="small"
                  onClick={handleSubmit(handleNewTax)}
                >
                  save
                </Button>
              </DeleteCardButtonHolder>
            </TopButtonHolder>
          }
        />
      )}
    </>
  );
};

const Card = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: ${(p: any) => (p.padding ? p.padding : "16px")};
`;

const Center = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Label = styled.div`
  font-weight: bold;
  font-size: 16px;
  line-height: 24px;
  color: #000000;
`;

const HeaderLabel = styled.p`
  font-weight: 600;
  font-size: 20px;
  line-height: 27px;
  color: #1e858e;
`;

const DeleteCardButtonHolder = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
`;

const TopButtonHolder = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const CreateInputDiv = styled.div`
  display: flex;
  position: relative;
`;

const CreateTitle = styled.div`
  margin-top: 1rem;
  font-weight: 600;
  font-size: 1.5rem;
`;

const InputAddonBefore = styled.div`
  z-index: 10;
  right: 0;
  bottom: 4;
  background: #f4f4f4;
  position: absolute;
  height: 40px;
  width: 20%;
  border-radius: 0 5px 5px 0;
  margin: 0 auto;
  margin-top: 1.75rem;
  text-align: center;
  padding-top: 0.5rem;
  border: 1px solid #aaaaaa;
`;

export default TaxDetail;
