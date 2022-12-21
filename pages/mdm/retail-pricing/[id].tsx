import React, { useState } from "react";
import {
  Text,
  Col,
  Row,
  Spacer,
  Button,
  Accordion,
  Input,
  Table,
  Spin,
  FileUploaderExcel,
} from "pink-lava-ui";
import styled from "styled-components";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import ModalAddRetailPricing from "components/elements/Modal/ModalAddRetailPricing";
import { useRouter } from "next/router";
import _ from "lodash";
import moment from "moment";
import {
  useRetailPricingDetail,
  useUpdateRetailPricing,
} from "hooks/mdm/retail-pricing/useRetailPricingList";
import Conditions from "components/pages/RetailPricing/fragments/Conditions";
import { toSnakeCase } from "lib/caseConverter";
import { mdmDownloadService } from "lib/client";
import { useUserPermissions } from "hooks/user-config/usePermission";
import { permissionRetailPricing } from "permission/retail-pricing";
import { ICDelete, ICEdit } from "../../../assets";
import ArrowLeft from "../../assets/icons/arrow-left.svg";

const downloadFile = (params: any) => mdmDownloadService("/retail-pricing/download", { params }).then((res) => {
  const dataUrl = window.URL.createObjectURL(new Blob([res.data]));
  const tempLink = document.createElement("a");
  tempLink.href = dataUrl;
  tempLink.setAttribute("download", `retail_pricing_list_${new Date().getTime()}.xlsx`);
  tempLink.click();
});

const DetailRetailPricing: any = () => {
  const router = useRouter();
  const companyId = localStorage.getItem("companyId");
  const companyCode = localStorage.getItem("companyCode");
  const { id } = router.query;

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      rules: [],
      name: "",
      availability: [],
    },
  });

  const nameWatch = useWatch({
    name: "name",
    control,
  });

  const availabilityWatch = useWatch({
    name: "availability",
    control,
  });

  const {
    fields: fieldRules,
    append: appendRules,
    update: updateRules,
    remove: removeRules,
  } = useFieldArray({
    control,
    name: "rules",
  });

  const [showModalRules, setShowModalRules] = useState({
    visibility: false,
    tempRule: null,
    index: null,
  });

  const { data: dataUserPermission } = useUserPermissions({
    options: {
      onSuccess: () => {},
    },
  });

  const listPermission = dataUserPermission?.permission?.filter(
    (filtering: any) => filtering.menu === "User List",
  );
  const columns = [
    {
      title: "key",
      dataIndex: "key",
    },
    // ...(allowPermissionToShow?.some((el: any) => el.name === "Delete Retail Pricing")
    // ? [
    {
      title: "Action",
      dataIndex: "action",
      width: "15%",
      align: "left",
      render: (_, __, index) => (
        <Row gap="16px" alignItems="center" nowrap>
          {listPermission?.filter((x: any) => x.viewTypes[0]?.viewType.name === "Update").length
              > 0 && (
              <Col>
                <ICEdit
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setShowModalRules({
                      visibility: true,
                      tempRule: fieldRules[index],
                      index,
                    });
                  }}
                />
              </Col>
          )}
          {listPermission?.filter((x: any) => x.viewTypes[0]?.viewType.name === "Delete").length
              > 0 && (
              <Col>
                <ICDelete
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    removeRules(index);
                  }}
                />
              </Col>
          )}
        </Row>
      ),
    },
    // ]:[]),
    {
      title: "Price Computation",
      dataIndex: "price_computation",
    },
    {
      title: "Apply On",
      dataIndex: "apply_on",
    },
    {
      title: "Minimum Quantity",
      dataIndex: "min_qty",
    },
    {
      title: "Price",
      dataIndex: "value",
    },
    {
      title: "Validity Date",
      dataIndex: "valid_date",
    },
  ];

  const rulesWatch = useWatch({
    name: "rules",
    control,
  });

  const [showUploadStructure, setShowUploadStructure] = useState<any>(false);

  const getValue = (data: any) => {
    if (data.price_computation.toLowerCase().replace("- ", " ") === "discount") {
      return data.value ? `Discount ${data.value} %` : "";
    }

    if (data.price_computation.toLowerCase().replace("- ", " ") === "fixed price") {
      return data.value ? `Rp. ${data.value}` : "";
    }

    if (data.price_computation.toLowerCase().replace("_", " ") === "formula") {
      if (!data.based_on) {
        return "";
      } if (data.based_on.toLowerCase().replace("_", " ") === "pricing structure") {
        return "Pricing Structure";
      }
      if (data.margin_max && data.margin_min) {
        return `Min Margin ${data.margin_min} and Max Margin ${data.margin_max}`;
      } if (data.margin_max) {
        return `Max Margin ${data.margin_max}`;
      } if (data.margin_min) {
        return `Min Margin ${data.margin_min}`;
      }
      return "";
    }
  };

  const rulesTable = rulesWatch.map((data: any) => ({
    price_computation: _.startCase(_.toLower(data.price_computation)),
    apply_on: _.startCase(_.toLower(data.apply_on)),
    min_qty: data.min_qty,
    value: getValue(data),
    valid_date: data?.valid_date
      ?.map((date: any) => {
        if (moment(date, "DD/MM/YYYY", true).isValid()) {
          return moment(date, "DD/MM/YYYY").format("DD/MM/YYYY");
        }
        return moment(date).format("DD/MM/YYYY");
      })
      ?.join(" - "),
  }));

  const { mutate: updateRetailPricing } = useUpdateRetailPricing({
    id,
    options: {
      onSuccess: () => {
        router.push("/mdm/retail-pricing");
      },
    },
  });

  const onSubmit = (data: any) => {
    data.availability = data?.availability
      ?.filter((data: any) => {
        Object.keys(data).length === 0;
      })
      .map((data: any) => {
        const newData: any = {
          based_on: data.based_on,
        };
        if (data.based_on === "BRANCH") {
          newData.branch = {
            ids: data.value?.map((data: any) => data.id) || [],
            select_all: !!data.select_all,
          };
        } else if (data.based_on === "SALES ORGANIZATION") {
          newData.sales_organization = {
            level: data.id,
            select_all: !!data.select_all,
            ids: data.value?.map((data: any) => data.id) || [],
          };
        } else if (data.based_on === "COUNTRY") {
          newData.country = {
            id: data?.country.id,
            level: data?.country.value.map((data: any) => ({
              id: data.id,
              values: data?.levels?.map((data: any) => data?.id) || [],
            })),
          };
        }
        return newData;
      });

    data.rules = data.rules.map((data: any) => {
      if (data.product_category) {
        data.product_category_id = data.product_category.id;
        delete data.product_category;
      }
      if (data.product_group) {
        data.product_group_id = data.product_group.id;
        delete data.product_group;
      }
      if (data.product_variant) {
        data.product_variant_id = data.product_variant.id;
        delete data.product_variant;
      }
      return data;
    });

    updateRetailPricing(data);
  };

  const { data: retailPricing, isLoading } = useRetailPricingDetail({
    options: {
      onSuccess: (data: any) => {
        data = toSnakeCase(data);
        Object.keys(data).forEach((key: any) => {
          if (key === "rules") {
            const rules = data[key];

            const newRules = rules.map((data: any) => {
              const newRule: any = {
                apply_on: data.apply_on.toUpperCase(),
                price_computation: data.price_computation.toUpperCase().replace("_", " "),
                min_qty: data.min_qty,
                valid_date: [
                  moment(data.valid_start_date).format("DD/MM/YYYY"),
                  moment(data.valid_end_date).format("DD/MM/YYYY"),
                ],
              };
              if (newRule.apply_on === "PRODUCT VARIANT") {
                newRule.product_variant = data.product_variant;
              }
              if (newRule.apply_on === "PRODUCT CATEGORY") {
                newRule.product_category = data.product_category;
              }
              if (newRule.apply_on === "PRODUCT GROUP") {
                newRule.product_group = data.product_group;
              }

              if (newRule.price_computation === "FIXED PRICE") {
                newRule.value = data.fixed_price;
              }

              if (newRule.price_computation === "DISCOUNT") {
                newRule.value = data.discount_percentage;
              }

              if (newRule.price_computation === "FORMULA") {
                newRule.based_on = data?.based_on?.toUpperCase()?.replace("_", " ");

                if (data?.based_on?.toUpperCase() === "COST") {
                  newRule.margin_min = data.margin_min;
                  newRule.margin_max = data.margin_max;
                  newRule.extra_fee = data.extra_fee;
                  newRule.rounding_method = data.rounding_method;
                }
              }

              return newRule;
            });

            setValue("rules", newRules);
          } else {
            if (key === "availability") {
              setValue("availability", data[key]);
            }

            if (key === "name") {
              setValue("name", data[key]);
            }
          }
        });
      },
      select: (data) => {
        data = toSnakeCase(data);
        return data;
      },
    },
    id,
  });

  const onUploadStructure = (data: any) => {
    data.forEach((data: any) => {
      const valid_date_split = data.validateDate ? data.validateDate.split(" ") : null;

      const newRule: any = {};

      if (data.applyOn) {
        newRule.apply_on = data.applyOn.toUpperCase();
      }

      if (data.priceComputation) {
        newRule.price_computation = data.priceComputation.toUpperCase();
      }

      if (data.minimumQuantity) {
        newRule.min_qty = data.minimumQuantity;
      }

      if (valid_date_split) {
        newRule.valid_date = [
          moment(valid_date_split[0], "DD/MM/YYYY").utc().toString(),
          moment(valid_date_split[2], "DD/MM/YYYY").utc().toString(),
        ];
      }

      if (newRule.apply_on === "PRODUCT CATEGORY") {
        newRule.product_category = {
          id: data.productCategory,
        };
      }

      if (newRule.apply_on === "PRODUCT VARIANT") {
        newRule.product_variant = {
          id: data.productVariant,
        };
      }

      if (newRule.apply_on === "PRODUCT GROUP") {
        newRule.product_group = {
          id: data.productGroup,
        };
      }

      appendRules(newRule);
    });
  };

  return (
    <>
      {isLoading ? (
        <Spin tip="Loading data..." />
      ) : (
        <Col>
          <Row gap="4px" alignItems="center">
            <ArrowLeft style={{ cursor: "pointer" }} onClick={() => router.back()} />
            <Text variant="h4">{nameWatch}</Text>
          </Row>
          <Spacer size={12} />
          <Card padding="20px">
            <Row justifyContent="end" alignItems="center" nowrap gap="12px">
              <Button size="big" variant="tertiary" onClick={() => router.back()}>
                Cancel
              </Button>
              {listPermission?.filter((x: any) => x.viewTypes[0]?.viewType.name === "Update")
                .length > 0 && (
                <Button size="big" variant="primary" onClick={handleSubmit(onSubmit)}>
                  Save
                </Button>
              )}
            </Row>
          </Card>

          <Spacer size={20} />

          <Accordion>
            <Accordion.Item key={1}>
              <Accordion.Header variant="blue">General</Accordion.Header>
              <Accordion.Body>
                <Row width="100%" gap="20px" noWrap>
                  <Input
                    width="100%"
                    label="Name"
                    height="48px"
                    placeholder="e.g Public Pricelist"
                    error={errors.name?.message}
                    required
                    {...register("name", {
                      required: "Name must be filled",
                    })}
                  />
                </Row>
                <Spacer size={20} />
                <Text variant="headingMedium" color="blue.darker">
                  Availability
                </Text>
                <Spacer size={20} />
                <Conditions
                  retailPricing={retailPricing}
                  register={register}
                  control={control}
                  setValue={setValue}
                  availabilityWatch={availabilityWatch}
                />
                <Spacer size={20} />
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>

          <Spacer size={20} />

          <Accordion>
            <Accordion.Item key={2}>
              <Accordion.Header variant="blue">Price Rules</Accordion.Header>
              <Accordion.Body>
                {listPermission?.filter((x: any) => x.viewTypes[0]?.viewType.name === "Update")
                  .length > 0 && (
                  <Row width="100%" gap="20px" noWrap>
                    <DownloadUploadContainer>
                      <Text variant="headingMedium">Download and fill in excel file </Text>
                      <Spacer size={4} />
                      <Text variant="body2" color="black.dark">
                        Use this template to add rules structure
                      </Text>
                      <Spacer size={10} />
                      <Button
                        variant="tertiary"
                        size="big"
                        onClick={() => downloadFile({ with_data: "N", type: "rule", company_id: companyCode })}
                      >
                        Download Template
                      </Button>
                    </DownloadUploadContainer>

                    <DownloadUploadContainer>
                      <Text variant="headingMedium">Upload template excel file </Text>
                      <Spacer size={4} />
                      <Text variant="body2" color="black.dark">
                        Select or drop your Excel(.xlsx) file here.
                      </Text>
                      <Spacer size={10} />
                      <Button
                        variant="tertiary"
                        size="big"
                        onClick={() => setShowUploadStructure(true)}
                      >
                        Upload Template
                      </Button>
                    </DownloadUploadContainer>
                  </Row>
                )}
                <Spacer size={20} />
                <Row width="100%" noWrap>
                  <Col width="100%">
                    <Table
                      columns={columns.filter(
                        (filtering) => filtering.dataIndex !== "id" && filtering.dataIndex !== "key",
                      )}
                      data={rulesTable}
                    />
                  </Col>
                </Row>

                <Row justifyContent="flex-start">
                  <Button
                    size="small"
                    variant="ghost"
                    onClick={() => {
                      setShowModalRules({
                        visibility: true,
                        tempRule: null,
                        index: null,
                      });
                    }}
                  >
                    + Add New Rules
                  </Button>
                </Row>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
          {showModalRules.visibility && (
            <ModalAddRetailPricing
              visible={showModalRules.visibility}
              onCancel={() => {
                setShowModalRules({
                  visibility: false,
                  tempRule: null,
                  index: null,
                });
              }}
              onSubmit={(index, data: any) => {
                if (index || index === 0) {
                  updateRules(index, data);
                } else {
                  appendRules(data);
                }
                setShowModalRules({
                  visibility: false,
                  tempRule: null,
                  index: null,
                });
              }}
              defaultValues={JSON?.parse(JSON?.stringify(showModalRules?.tempRule))}
              index={showModalRules?.index}
            />
          )}
        </Col>
      )}

      <FileUploaderExcel
        setVisible={setShowUploadStructure}
        visible={showUploadStructure}
        onSubmit={onUploadStructure}
      />
    </>
  );
};

const Link = styled.a`
  text-decoration: none;
  color: inherit;

  :hover,
  :focus,
  :active {
    text-decoration: none;
    color: inherit;
  }
`;

const DownloadUploadContainer = styled.div`
  background: #ffffff;
  border: 1px solid #aaaaaa;
  border-radius: 8px;
  width: 100%;
  padding: 20px 20px 20px 20px;
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const Card = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: ${(p) => (p.padding ? p.padding : "16px")};
`;

export default DetailRetailPricing;
