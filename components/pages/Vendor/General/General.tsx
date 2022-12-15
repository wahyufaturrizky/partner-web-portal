import React, { useState, useContext } from "react";
import {
  Text,
  Col,
  Row,
  Spacer,
  Input,
  FormSelect,
  FileUploaderAllFiles,
  Switch,
  Tooltip,
  Spin,
} from "pink-lava-ui";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { useFormContext, Controller, useWatch } from "react-hook-form";
import { useVendorGroupInfiniteLists, useUploadLogo } from "hooks/mdm/vendor/useVendorGroup";
import { useJobPositionInfiniteLists } from "hooks/mdm/job-position/useJobPositon";
import { useLanguagesInfiniteLists } from "hooks/languages/useLanguages";
import { useCompanyInfiniteLists } from "hooks/company-list/useCompany";
import { useCustomerInfiniteLists } from "hooks/mdm/customers/useCustomersMDM";
import useDebounce from "lib/useDebounce";
import { VendorContext } from "context/VendorContext";
import styled from "styled-components";

const General = ({ type, formType }: any) => {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext();

  const [isPKP, setIsPKP] = useState(false);

  const { setCompanyLogo, selectFromForm, companyLogo } = useContext(VendorContext);

  const watchCustomerId = useWatch({
    control,
    name: "customer_id",
  });

  // Vendor Group State
  const [totalRowsVendorGroup, setTotalRowsVendorGroup] = useState(0);
  const [listVendorGroup, setListVendorGroup] = useState([]);
  const [searchVendorGroup, setSearchVendorGroup] = useState("");
  const debounceSearchVendorGroup = useDebounce(searchVendorGroup, 1000);

  // Job Position State
  const [totalRowsJobPosition, setTotalRowsJobPosition] = useState(0);
  const [listJobPosition, setListJobPosition] = useState([]);
  const [searchJobPosition, setSearchJobPosition] = useState("");
  const debounceSearchJobPosition = useDebounce(searchJobPosition, 1000);

  // Language State
  const [totalRowsLanguage, setTotalRowsLanguage] = useState(0);
  const [listLanguage, setListLanguage] = useState([]);
  const [searchLanguage, setSearchLanguage] = useState("");
  const debounceSearchLanguage = useDebounce(searchLanguage, 1000);

  // Company State
  const [companyList, setCompanyList] = useState<any[]>([]);
  const [totalRowsCompanyList, setTotalRowsCompanyList] = useState(0);
  const [searchCompany, setSearchCompany] = useState("");
  const debounceFetchCompany = useDebounce(searchCompany, 1000);

  // Customer State
  const [customerList, setCustomerList] = useState<any[]>([]);
  const [totalRowsCustomerList, setTotalRowsCustomerList] = useState(0);
  const [searchCustomer, setSearchCustomer] = useState("");
  const debounceFetchCustomer = useDebounce(searchCustomer, 1000);

  // Vendor Group API
  const {
    isLoading: isLoadingVendor,
    isFetching: isFetchingVendorGroup,
    isFetchingNextPage: isFetchingMoreVendorGroup,
    hasNextPage: hasNextVendorGroup,
    fetchNextPage: fetchNextPageVendorGroup,
  } = useVendorGroupInfiniteLists({
    query: {
      search: debounceSearchVendorGroup,
      limit: 10,
    },
    options: {
      onSuccess: (data: any) => {
        setTotalRowsVendorGroup(data?.pages[0].totalRow);
        const mappedData = data?.pages?.map((group: any) => {
          return group.rows?.map((element: any) => {
            return {
              label: element.name,
              value: element.id,
            };
          });
        });
        const flattenArray = [].concat(...mappedData);
        setListVendorGroup(flattenArray);
      },
      getNextPageParam: (_lastPage: any, pages: any) => {
        if (listVendorGroup.length < totalRowsVendorGroup) {
          return pages.length + 1;
        } else {
          return undefined;
        }
      },
    },
  });

  // Job Position API
  const {
    isLoading: isLoadingJobPosition,
    isFetching: isFetchingJobPosition,
    isFetchingNextPage: isFetchingMoreJobPosition,
    hasNextPage: hasNextJobPosition,
    fetchNextPage: fetchNextPageJobPosition,
  } = useJobPositionInfiniteLists({
    query: {
      company_id: "KSNI",
      search: debounceSearchJobPosition,
      limit: 10,
    },
    options: {
      onSuccess: (data: any) => {
        setTotalRowsJobPosition(data?.pages[0].totalRow);
        const mappedData = data?.pages?.map((group: any) => {
          return group.rows?.map((element: any) => {
            return {
              label: element.name,
              value: element.name,
            };
          });
        });
        const flattenArray = [].concat(...mappedData);
        setListJobPosition(flattenArray);
      },
      getNextPageParam: (_lastPage: any, pages: any) => {
        if (listJobPosition.length < totalRowsJobPosition) {
          return pages.length + 1;
        } else {
          return undefined;
        }
      },
    },
  });

  // Language API
  const {
    isLoading: isLoiadingLanguages,
    isFetching: isFetchingLanguages,
    isFetchingNextPage: isFetchingMoreLanguages,
    hasNextPage: hasNextLanguages,
    fetchNextPage: fetchNextPageLanguages,
  } = useLanguagesInfiniteLists({
    query: {
      search: debounceSearchLanguage,
      limit: 10,
    },
    options: {
      onSuccess: (data: any) => {
        setTotalRowsLanguage(data?.pages[0].totalRow);
        const mappedData = data?.pages?.map((group: any) => {
          return group.rows?.map((element: any) => {
            return {
              label: element.name,
              value: element.name,
            };
          });
        });
        const flattenArray = [].concat(...mappedData);
        setListLanguage(flattenArray);
      },
      getNextPageParam: (_lastPage: any, pages: any) => {
        if (listLanguage.length < totalRowsLanguage) {
          return pages.length + 1;
        } else {
          return undefined;
        }
      },
    },
  });

  // Company API
  const {
    isLoading: isLoadingCompany,
    isFetching: isFetchingCompany,
    isFetchingNextPage: isFetchingMoreCompany,
    hasNextPage: hasNextPageCompany,
    fetchNextPage: fetchNextPageCompany,
  } = useCompanyInfiniteLists({
    query: {
      search: debounceFetchCompany,
      limit: 10,
    },
    options: {
      onSuccess: (data: any) => {
        setTotalRowsCompanyList(data.pages[0].totalRow);
        const mappedData = data?.pages?.map((group: any) => {
          return group.rows?.map((element: any) => {
            return {
              value: element.code,
              label: element.name,
            };
          });
        });
        const flattenArray = [].concat(...mappedData);
        setCompanyList(flattenArray);
      },
      getNextPageParam: (_lastPage: any, pages: any) => {
        if (companyList.length < totalRowsCompanyList) {
          return pages.length + 1;
        } else {
          return undefined;
        }
      },
    },
  });

  // Customer API
  const {
    isLoading: isLoadingCustomer,
    isFetching: isFetchingCustomer,
    isFetchingNextPage: isFetchingMoreCustomer,
    hasNextPage: hasNextPageCustomer,
    fetchNextPage: fetchNextPageCustomer,
  } = useCustomerInfiniteLists({
    query: {
      search: debounceFetchCustomer,
      limit: 10,
    },
    options: {
      enabled: formType === "edit",
      onSuccess: (data: any) => {
        setTotalRowsCustomerList(data.pages[0].totalRow);
        const mappedData = data?.pages?.map((group: any) => {
          return group.rows?.map((element: any) => {
            return {
              value: element.id,
              label: `${element.id} - ${element.name}`,
            };
          });
        });
        const flattenArray = [].concat(...mappedData);
        setCustomerList(flattenArray);
      },
      getNextPageParam: (_lastPage: any, pages: any) => {
        if (customerList.length < totalRowsCustomerList) {
          return pages.length + 1;
        } else {
          return undefined;
        }
      },
    },
  });

  const { mutate: uploadLogoVendor } = useUploadLogo({
    options: {
      onSuccess: (data: any) => {
        setCompanyLogo(data);
      },
    },
  });

  return (
    <div style={{ height: "650px" }}>
      <Row width="100%" noWrap>
        {type === "company" && (
          <>
            <div style={{ width: "50%" }}>
              <FileUploaderAllFiles
                label="Company Logo"
                onSubmit={(files: any) => {
                  const formData: any = new FormData();
                  formData.append("upload_file", files);
                  uploadLogoVendor(formData);
                }}
                defaultFile={companyLogo}
                withCrop
                sizeImagePhoto="125px"
                removeable
                textPhoto={[
                  "Dimension Minimum 72 x 72, Optimal size 300 x 300",
                  "File Size Max. 1MB",
                ]}
              />
            </div>

            {formType === "edit" && (
              <Col width="50%" justifyContent={"center"}>
                {watchCustomerId === "" || selectFromForm ? (
                  <Controller
                    control={control}
                    defaultValue={""}
                    name="customer_id"
                    render={({ field: { onChange }, formState: { errors } }) => (
                      <>
                        {isLoadingCustomer ? (
                          <Center>
                            <Spin tip="" />
                          </Center>
                        ) : (
                          <>
                            <Text variant="headingRegular">Customer ID</Text>
                            <Spacer size={6} />
                            <FormSelect
                              style={{ width: "100%" }}
                              size={"large"}
                              placeholder={"Select"}
                              borderColor={"#AAAAAA"}
                              arrowColor={"#000"}
                              withSearch
                              isLoading={isFetchingCustomer}
                              isLoadingMore={isFetchingMoreCompany}
                              fetchMore={() => {
                                if (hasNextPageCustomer) {
                                  fetchNextPageCustomer();
                                }
                              }}
                              items={
                                isFetchingCustomer && !isFetchingMoreCustomer ? [] : customerList
                              }
                              onChange={(value: any) => {
                                onChange(value);
                              }}
                              onSearch={(value: any) => {
                                setSearchCustomer(value);
                              }}
                            />
                          </>
                        )}
                      </>
                    )}
                  />
                ) : (
                  <CustomerContainer>
                    <Text variant="headingSmall" color={"blue.dark"} hoverColor={"blue.dark"}>
                      {watchCustomerId}{" "}
                      <span
                        style={{ color: "#EB008B", cursor: "pointer" }}
                        onClick={() => {
                          window.open(`/customers/${watchCustomerId}`, "_blank");
                        }}
                      >
                        View Detail
                      </span>
                    </Text>
                  </CustomerContainer>
                )}
              </Col>
            )}
          </>
        )}

        {type === "individu" && (
          <>
            <Row width={"50%"} noWrap>
              <Controller
                control={control}
                name="individu.title"
                defaultValue={"Mr."}
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <Col width={"10%"}>
                    <Label>
                      Title<span style={{ color: "#EB008B" }}>*</span>
                    </Label>
                    <Spacer size={6} />
                    <FormSelect
                      width="100%"
                      size="large"
                      defaultValue={value}
                      items={[
                        { id: "Mr.", value: "Mr." },
                        { id: "Ms.", value: "Ms." },
                      ]}
                      onChange={(value: any) => {
                        onChange(value);
                      }}
                    />
                  </Col>
                )}
              />

              <Spacer size={10} />

              <Col width="90%">
                <Input
                  width="100%"
                  label="Name"
                  height="40px"
                  required
                  defaultValue={""}
                  error={errors?.name?.type === "required" && "This field is required"}
                  placeholder={"e.g Jane Doe"}
                  {...register("name", {
                    required: true,
                  })}
                />
              </Col>
            </Row>

            <Spacer size={10} />

            {formType === "edit" && (
              <Row width="50%" justifyContent={"center"} alignItems={"center"} noWrap>
                {watchCustomerId === "" || selectFromForm ? (
                  <Controller
                    control={control}
                    defaultValue={""}
                    name="customer_id"
                    render={({ field: { onChange }, formState: { errors } }) =>
                      isLoadingCustomer ? (
                        <Center>
                          <Spin tip="" />
                        </Center>
                      ) : (
                        <Col width="100%" justifyContent={"center"}>
                          <Text variant="headingRegular">Customer ID</Text>
                          <Spacer size={6} />
                          <FormSelect
                            style={{ width: "100%" }}
                            size={"large"}
                            placeholder={"Select"}
                            borderColor={"#AAAAAA"}
                            arrowColor={"#000"}
                            withSearch
                            isLoading={isFetchingCustomer}
                            isLoadingMore={isFetchingMoreCompany}
                            fetchMore={() => {
                              if (hasNextPageCustomer) {
                                fetchNextPageCustomer();
                              }
                            }}
                            items={
                              isFetchingCustomer && !isFetchingMoreCustomer ? [] : customerList
                            }
                            onChange={(value: any) => {
                              onChange(value);
                            }}
                            onSearch={(value: any) => {
                              setSearchCustomer(value);
                            }}
                          />
                        </Col>
                      )
                    }
                  />
                ) : (
                  <Col width={"100%"}>
                    <Spacer size={15} />
                    <CustomerContainer>
                      <Text variant="headingSmall" color={"blue.dark"} hoverColor={"blue.dark"}>
                        {watchCustomerId}{" "}
                        <span
                          style={{ color: "#EB008B", cursor: "pointer" }}
                          onClick={() => {
                            window.open(`/customers/${watchCustomerId}`, "_blank");
                          }}
                        >
                          View Detail
                        </span>
                      </Text>
                    </CustomerContainer>
                  </Col>
                )}
              </Row>
            )}
          </>
        )}
      </Row>

      <Spacer size={20} />

      <Row width="100%" noWrap gap={"10px"} alignItems={"center"}>
        {type === "company" && (
          <Col width={"100%"}>
            <Input
              width="100%"
              label={"Name"}
              height="40px"
              required
              defaultValue={""}
              error={errors?.name?.type === "required" && "This field is required"}
              placeholder={"e.g PT Indo Log"}
              {...register("name", {
                required: true,
              })}
            />
          </Col>
        )}
        {type === "individu" && (
          <Col width={"100%"}>
            <Controller
              control={control}
              defaultValue={null}
              name="individu.job"
              render={({ field: { onChange, value }, formState: { errors } }) =>
                isLoadingJobPosition ? (
                  <Center>
                    <Spin tip="" />
                  </Center>
                ) : (
                  <>
                    <Label>Job Position</Label>
                    <Spacer size={6} />
                    <FormSelect
                      defaultValue={value}
                      style={{ width: "100%" }}
                      size={"large"}
                      placeholder={"Select"}
                      borderColor={"#AAAAAA"}
                      arrowColor={"#000"}
                      withSearch
                      isLoading={isFetchingJobPosition}
                      isLoadingMore={isFetchingMoreJobPosition}
                      fetchMore={() => {
                        if (hasNextJobPosition) {
                          fetchNextPageJobPosition();
                        }
                      }}
                      items={
                        isFetchingJobPosition && !isFetchingMoreJobPosition ? [] : listJobPosition
                      }
                      onChange={(value: any) => {
                        onChange(value);
                      }}
                      onSearch={(value: any) => {
                        setSearchJobPosition(value);
                      }}
                    />
                  </>
                )
              }
            />
          </Col>
        )}

        <Col width={"100%"}>
          <Controller
            control={control}
            defaultValue={null}
            name="group"
            render={({ field: { onChange, value }, formState: { errors } }) =>
              isLoadingVendor ? (
                <Center>
                  <Spin tip="" />
                </Center>
              ) : (
                <>
                  <Label>Vendor Group</Label>
                  <Spacer size={6} />
                  <FormSelect
                    defaultValue={value}
                    style={{ width: "100%" }}
                    size={"large"}
                    placeholder={"Select"}
                    borderColor={"#AAAAAA"}
                    arrowColor={"#000"}
                    withSearch
                    isLoading={isFetchingVendorGroup}
                    isLoadingMore={isFetchingMoreVendorGroup}
                    fetchMore={() => {
                      if (hasNextVendorGroup) {
                        fetchNextPageVendorGroup();
                      }
                    }}
                    items={
                      isFetchingVendorGroup && !isFetchingMoreVendorGroup ? [] : listVendorGroup
                    }
                    onChange={(value: any) => {
                      onChange(value);
                    }}
                    onSearch={(value: any) => {
                      setSearchVendorGroup(value);
                    }}
                  />
                </>
              )
            }
          />
        </Col>
      </Row>

      <Spacer size={20} />

      <Row width="100%" noWrap gap={"10px"}>
        {type === "company" && (
          <Col width={"100%"}>
            <Input
              width="100%"
              label={"Website"}
              height="40px"
              defaultValue={""}
              placeholder={"e.g yourcompany.com"}
              {...register("company.website")}
            />
          </Col>
        )}
        {type === "individu" && (
          <Controller
            control={control}
            defaultValue={null}
            name="individu.company"
            render={({ field: { onChange, value }, formState: { errors } }) =>
              isLoadingCompany ? (
                <Center>
                  <Spin tip="" />
                </Center>
              ) : (
                <Col width={"100%"}>
                  <Label>Company</Label>
                  <Spacer size={6} />
                  <FormSelect
                    defaultValue={value}
                    style={{ width: "100%" }}
                    size={"large"}
                    placeholder={"Select"}
                    borderColor={"#AAAAAA"}
                    arrowColor={"#000"}
                    withSearch
                    isLoading={isFetchingCompany}
                    isLoadingMore={isFetchingMoreCompany}
                    fetchMore={() => {
                      if (hasNextPageCompany) {
                        fetchNextPageCompany();
                      }
                    }}
                    items={isFetchingCompany && !isFetchingMoreCompany ? [] : companyList}
                    onChange={(value: any) => {
                      onChange(value);
                    }}
                    onSearch={(value: any) => {
                      setSearchCompany(value);
                    }}
                  />
                </Col>
              )
            }
          />
        )}

        <Col width={"100%"}>
          <Input
            width="100%"
            label={"Mobile"}
            height="40px"
            defaultValue={""}
            placeholder={"e.g 0812345678910"}
            {...register("mobile")}
          />
        </Col>
      </Row>

      <Spacer size={20} />

      <Row width="100%" noWrap gap={"10px"} alignItems={"center"}>
        <Col width={"100%"}>
          <Controller
            control={control}
            defaultValue={null}
            name="language"
            render={({ field: { onChange, value }, formState: { errors } }) =>
              isLoiadingLanguages ? (
                <Center>
                  <Spin tip="" />
                </Center>
              ) : (
                <>
                  <Label>Language</Label>
                  <Spacer size={6} />
                  <FormSelect
                    defaultValue={value}
                    style={{ width: "100%" }}
                    size={"large"}
                    placeholder={"Select"}
                    borderColor={"#AAAAAA"}
                    arrowColor={"#000"}
                    withSearch
                    isLoading={isFetchingLanguages}
                    isLoadingMore={isFetchingMoreLanguages}
                    fetchMore={() => {
                      if (hasNextLanguages) {
                        fetchNextPageLanguages();
                      }
                    }}
                    items={isFetchingLanguages && !isFetchingMoreLanguages ? [] : listLanguage}
                    onChange={(value: any) => {
                      onChange(value);
                    }}
                    onSearch={(value: any) => {
                      setSearchLanguage(value);
                    }}
                  />
                </>
              )
            }
          />
        </Col>

        <Col width={"100%"}>
          <Input
            width="100%"
            label={"Phone"}
            height="40px"
            defaultValue={""}
            placeholder={"e.g 021 123456"}
            {...register("phone")}
          />
        </Col>
      </Row>

      <Spacer size={20} />

      <Row width="100%" noWrap gap={"10px"}>
        <Col width={"100%"}>
          <Input
            width="100%"
            label={"Tax Number"}
            height="40px"
            defaultValue={""}
            placeholder={"e.g 123456789"}
            {...register("tax")}
          />
          <Row alignItems={"center"} gap={"5px"}>
            <Controller
              control={control}
              defaultValue={isPKP}
              name="is_pkp"
              render={({ field: { onChange, value }, formState: { errors } }) => (
                <>
                  <Text>PKP?</Text>
                  <Tooltip
                    overlayInnerStyle={{ width: "fit-content" }}
                    title={`If you are "ON" PKP then input Purchase Tax`}
                    color={"#F4FBFC"}
                  >
                    <ExclamationCircleOutlined />
                  </Tooltip>
                  <Switch
                    checked={value}
                    defaultChecked={value}
                    onChange={(isPkp: boolean) => {
                      setIsPKP(isPkp);
                      onChange(isPkp);
                    }}
                  />
                </>
              )}
            />
          </Row>
        </Col>

        <Col width={"100%"}>
          <Input
            width="100%"
            label={"Email"}
            height="40px"
            defaultValue={""}
            placeholder={"e.g admin@Indolog.com"}
            {...register("email")}
          />
        </Col>
      </Row>

      <Spacer size={20} />

      <Row width="50%" noWrap gap={"10px"}>
        <Col width={"100%"}>
          <Input
            width="100%"
            label={"External Code"}
            height="40px"
            defaultValue={""}
            placeholder={"e.g 123456789"}
            {...register("external_code")}
          />
        </Col>
      </Row>
    </div>
  );
};

const Label = styled.div`
  font-weight: bold;
  font-size: 16px;
  line-height: 24px;
  color: #000000;
`;

const CustomerContainer = styled.div`
  background: #d5fafd;
  border-radius: 8px;
  height: 50px;
  justify-content: flex-start;
  align-items: center;
  padding: 15px;
  display: flex;
  gap: 8px;
  width: 100%;
`;

const Center = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default General;
