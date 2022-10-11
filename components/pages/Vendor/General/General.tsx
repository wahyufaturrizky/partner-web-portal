import React, { useState } from "react";
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
} from "pink-lava-ui";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { useFormContext, Controller } from "react-hook-form";
import { useVendorGroupInfiniteLists, useUploadLogo } from "hooks/mdm/vendor/useVendorGroup";
import { useJobPositionInfiniteLists } from "hooks/mdm/job-position/useJobPositon";
import { useLanguagesInfiniteLists } from "hooks/languages/useLanguages";
import { useCompanyInfiniteLists } from "hooks/company-list/useCompany";
import useDebounce from "lib/useDebounce";

const General = ({ type }: any) => {
  const { register, control } = useFormContext();

  const [isPKP, setIsPKP] = useState(false);
  const [imageLogo, setImageLogo] = useState<string>("");

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

  // Vendor Group API
  const {
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
              value: `${element.id}`,
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

  const { mutate: uploadLogoVendor } = useUploadLogo({
    options: {
      onSuccess: ({ imageUrl }: { imageUrl: string }) => {
        setImageLogo(imageUrl);
      },
    },
  });

  return (
    <>
      <Row width="100%" noWrap>
        {type === "company" && (
          <FileUploaderAllFiles
            label="Company Logo"
            onSubmit={async (files: any) => {
              // onChange(file);
              // const formData: any = new FormData();
              // await formData.append("upload_file", files);
              // return uploadLogoVendor(formData);
            }}
            defaultFile="/placeholder-employee-photo.svg"
            withCrop
            sizeImagePhoto="125px"
            removeable
            textPhoto={["Dimension Minimum 72 x 72, Optimal size 300 x 300", "File Size Max. 1MB"]}
          />
          // <Controller
          //   control={control}
          //   shouldUnregister={true}
          //   name="upload_file"
          //   render={({ field: { onChange } }) => (

          //   )}
          // />
        )}
        {type === "individu" && (
          <>
            <Controller
              control={control}
              name="individu.title"
              defaultValue={""}
              shouldUnregister={true}
              rules={{
                required: true,
              }}
              render={({ field: { onChange }, fieldState: { error } }) => (
                <Col width={"10%"}>
                  <Text variant="headingRegular">
                    Title<span style={{ color: "#EB008B" }}>*</span>
                  </Text>
                  <Spacer size={6} />
                  <FormSelect
                    width="100%"
                    items={[
                      { id: "mr", value: "Mr." },
                      { id: "ms", value: "Ms." },
                    ]}
                    handleChange={(value: any) => {
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
                placeholder={"e.g Jane Doe"}
                {...register("name", {
                  required: true,
                  shouldUnregister: true,
                })}
              />
            </Col>
          </>
        )}
      </Row>

      <Spacer size={20} />

      <Row width="100%" noWrap gap={"10px"}>
        {type === "company" && (
          <Col width={"100%"}>
            <Input
              width="100%"
              label={"Name"}
              height="40px"
              defaultValue={""}
              placeholder={"e.g PT Indo Log"}
              {...register("name", { shouldUnregister: true })}
            />
          </Col>
        )}
        {type === "individu" && (
          <Col width={"100%"}>
            <Controller
              control={control}
              shouldUnregister={true}
              defaultValue={""}
              name="individu.job"
              render={({ field: { onChange }, formState: { errors } }) => (
                <>
                  <Text variant="headingRegular">Job Position</Text>
                  <Spacer size={6} />
                  <FormSelect
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
              )}
            />
          </Col>
        )}

        <Controller
          control={control}
          shouldUnregister={true}
          defaultValue={""}
          name="group"
          render={({ field: { onChange }, formState: { errors } }) => (
            <Col width={"100%"}>
              <Text variant="headingRegular">Vendor Group</Text>
              <Spacer size={6} />
              <FormSelect
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
                items={isFetchingVendorGroup && !isFetchingMoreVendorGroup ? [] : listVendorGroup}
                onChange={(value: any) => {
                  onChange(value);
                }}
                onSearch={(value: any) => {
                  setSearchVendorGroup(value);
                }}
              />
            </Col>
          )}
        />
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
            shouldUnregister={true}
            defaultValue={""}
            name="individu.company"
            render={({ field: { onChange }, formState: { errors } }) => (
              <Col width={"100%"}>
                <Text variant="headingRegular">Company</Text>
                <Spacer size={6} />
                <FormSelect
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
            )}
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

      <Row width="100%" noWrap gap={"10px"}>
        <Col width={"100%"}>
          <Controller
            control={control}
            shouldUnregister={true}
            defaultValue={""}
            name="language"
            render={({ field: { onChange }, formState: { errors } }) => (
              <>
                <Text variant="headingRegular">Language</Text>
                <Spacer size={6} />
                <FormSelect
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
            )}
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
              shouldUnregister={true}
              defaultValue={isPKP}
              name="is_pkp"
              render={({ field: { onChange }, formState: { errors } }) => (
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
                    checked={isPKP}
                    defaultChecked={isPKP}
                    onChange={(value: boolean) => {
                      setIsPKP(value);
                      onChange(value);
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
    </>
  );
};

export default General;
