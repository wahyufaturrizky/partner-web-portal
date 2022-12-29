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
  Dropdown,
} from "pink-lava-ui";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { useFormContext, Controller, useWatch } from "react-hook-form";
import { useUploadLogo } from "hooks/mdm/vendor/useVendorGroup";
import { useLanguages, useLanguageLibrary } from "hooks/languages/useLanguages";
import useDebounce from "lib/useDebounce";
import styled from "styled-components";
import { CustomerContext } from "context/CustomerContext";
import { useInfiniteCustomerGroupsLists } from "hooks/mdm/customers/useCustomersGroupMDM";
import { useUploadLogoCompany } from "hooks/mdm/customers/useCustomersMDM";

const General = ({ type, formType }: any) => {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext();

  const { setCompanyLogo, companyLogo } = useContext(CustomerContext);

  const [searchLanguage, setSearchLanguage] = useState("");
  const [searchCustomerGroup, setSearchCustomerGroup] = useState("");

  const [customerGroupsList, setListCustomerGroupsList] = useState<any[]>([]);
  const [totalRowsCustomerGroupsList, setTotalRowsCustomerGroupsList] = useState(0);

  const debounceFetchLanguages = useDebounce(searchLanguage, 1000);
  const debounceFetchCustomerGroup = useDebounce(searchCustomerGroup, 1000);

  const { data: languagesData, isLoading: isLoadingLanguages } = useLanguageLibrary({
    options: {
      select: (data: any) => {
        const mappedData = data?.rows?.map((element: any) => {
          return {
            value: `${element.id} - ${element.name}`,
            id: element.id,
          };
        });

        return mappedData;
      },
    },
    query: {
      search: debounceFetchLanguages,
    },
  });

  const {
    isFetching: isFetchingCustomerGroupsLists,
    isFetchingNextPage: isFetchingMoreCustomerGroupsLists,
    hasNextPage: hasNextPageCustomerGroupsLists,
    fetchNextPage: fetchNextPageCustomerGroupsLists,
  } = useInfiniteCustomerGroupsLists({
    query: {
      search: debounceFetchCustomerGroup,
      company: "KSNI",
      limit: 10,
    },
    options: {
      onSuccess: (data: any) => {
        setTotalRowsCustomerGroupsList(data.pages[0].totalRow);
        const mappedData = data?.pages?.map((group: any) =>
          group.rows?.map((element: any) => ({
            value: element.id,
            label: element.name,
          }))
        );
        const flattenArray = [].concat(...mappedData);
        setListCustomerGroupsList(flattenArray);
      },
      getNextPageParam: (_lastPage: any, pages: any) => {
        if (customerGroupsList.length < totalRowsCustomerGroupsList) {
          return pages.length + 1;
        }
        return undefined;
      },
    },
  });

  const { mutate: uploadLogoCustomer } = useUploadLogoCompany({
    options: {
      onSuccess: (data: any) => {
        setCompanyLogo(data);
      },
    },
  });

  return (
    <div style={{ height: "650px" }}>
      <Row width="100%" gap="12px">
        <Col width="48%">
          <Input
            style={{ marginBotton: "1rem" }}
            width="100%"
            label="Name"
            height="50px"
            placeholder="e.g PT. Kaldu Sari Nabati Indonesia"
            required
            error={errors?.customer?.name?.message}
            {...register("customer.name", {
              required: "name must be filled",
            })}
          />
          <Spacer size={10} />

          <Input
            width="100%"
            height="50px"
            type="number"
            required
            label="Tax Number"
            placeholder="e.g 123456789"
            error={errors?.customer?.tax_number?.message}
            {...register("customer.tax_number", {
              required: "Tax Number must be filled",
            })}
          />

          <Spacer size={10} />

          <FlexElement>
            <Spacer size={5} />
            <Text>PKP?</Text>
            <ExclamationCircleOutlined />
            <Spacer size={10} />
            <Controller
              control={control}
              defaultValue={false}
              name="customer.ppkp"
              render={({ field: { onChange, value }, fieldState: { error } }) => {
                return <Switch checked={value} defaultChecked={value} onChange={onChange} />;
              }}
            />
          </FlexElement>
          <Spacer size={10} />
          <Input
            required
            width="100%"
            label="Website"
            height="50px"
            placeholder="e.g ksni.com"
            error={errors?.customer?.website?.message}
            {...register("customer.website", {
              required: "website must be filled",
            })}
          />
          <Spacer size={10} />
          <Controller
            control={control}
            defaultValue={null}
            rules={{
              required: {
                value: true,
                message: "Please enter language.",
              },
            }}
            name="customer.language"
            render={({ field: { onChange, value }, fieldState: { error } }) => {
              return (
                <>
                  <Dropdown
                    error={error?.message}
                    defaultValue={value}
                    required
                    label="Language"
                    height="50px"
                    width="100%"
                    handleChange={onChange}
                    items={languagesData}
                    loading={isLoadingLanguages}
                    onSearch={(value: string) => setSearchLanguage(value)}
                  />
                </>
              );
            }}
          />
          <Spacer size={10} />
          {type === "company" && (
            <FileUploaderAllFiles
              label="Company Logo"
              onSubmit={(files: any) => {
                const formData: any = new FormData();
                formData.append("image", files);
                uploadLogoCustomer(formData);
              }}
              defaultFile={companyLogo}
              withCrop
              sizeImagePhoto="125px"
              removeable
              textPhoto={[
                "Dimension Minimum 72 x 72, Optimal size 300 x 300",
                "File Size Max. 5MB",
              ]}
            />
          )}
        </Col>
        <Col width="50%">
          <Input
            width="100%"
            label="Phone"
            height="50px"
            type="number"
            required
            placeholder="e.g 021 123456"
            error={errors?.customer?.phone?.message}
            {...register("customer.phone", {
              required: "phone must be filled",
            })}
          />
          <Spacer size={10} />
          <Input
            width="100%"
            label="Mobile"
            height="50px"
            required
            type="number"
            error={errors?.customer?.mobile?.message}
            placeholder="e.g 081234567891011"
            {...register("customer.mobile", {
              required: "mobile must be filled",
            })}
          />
          <Spacer size={50} />
          <Input
            width="100%"
            label="Email"
            height="50px"
            type="email"
            required
            placeholder={"e.g admin@kasni.co.id"}
            error={errors?.customer?.email?.message}
            {...register("customer.email", {
              required: "email must be filled",
            })}
          />

          <Spacer size={10} />

          <Controller
            control={control}
            defaultValue={null}
            name="customer.customer_group"
            render={({ field: { onChange, value } }) => (
              <>
                <LabelDropdown>Customer Group</LabelDropdown>
                <Spacer size={3} />
                <FormSelect
                  height="48px"
                  style={{ width: "100%" }}
                  size={"large"}
                  placeholder={"Select"}
                  defaultValue={value}
                  borderColor={"#AAAAAA"}
                  arrowColor={"#000"}
                  withSearch
                  isLoading={isFetchingCustomerGroupsLists}
                  isLoadingMore={isFetchingMoreCustomerGroupsLists}
                  fetchMore={() => {
                    if (hasNextPageCustomerGroupsLists) {
                      fetchNextPageCustomerGroupsLists();
                    }
                  }}
                  items={
                    isFetchingCustomerGroupsLists && !isFetchingMoreCustomerGroupsLists
                      ? []
                      : customerGroupsList
                  }
                  onChange={(value: any) => {
                    onChange(value);
                  }}
                  onSearch={(value: any) => {
                    setSearchCustomerGroup(value);
                  }}
                />
              </>
            )}
          />
          <Spacer size={10} />
          <Input
            width="100%"
            label="External Code"
            height="50px"
            type="number"
            placeholder={"e.g 123456"}
            {...register("customer.external_code")}
          />
        </Col>
      </Row>
    </div>
  );
};

const FlexElement = styled.div`
  display: flex;
  align-items: center;
`;

const Center = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ErrorText = styled.p`
  color: #ed1c24;
  font-size: 12px;
  line-height: 18px;
`;

const LabelDropdown = styled.div`
  font-weight: bold;
  font-size: 16px;
  line-height: 24px;
  color: #000000;
`;

export default General;
