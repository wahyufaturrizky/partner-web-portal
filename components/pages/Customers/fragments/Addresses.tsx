import React, { useState } from "react";
import {
  Col,
  Row,
  Spacer,
  Text,
  Button,
  FormSelect,
  Input,
  Spin,
  FileUploaderAllFiles,
  TextArea,
} from "pink-lava-ui";
import { useFormContext, useFieldArray, Controller } from "react-hook-form";
import { ICPlusWhite } from "assets";
import { CheckOutlined } from "@ant-design/icons";
import { useCountryStructureVendor, useCountryPostalVendor } from "hooks/mdm/vendor/useVendor";
import { useCountryInfiniteLists } from "hooks/mdm/country-structure/useCountries";
import useDebounce from "lib/useDebounce";
import styled from "styled-components";
import { useUploadStorePhotoAddress } from "hooks/mdm/customers/useCustomersMDM";

const Addresses = ({
  formType,
  getValues,
  isFetchingPostalCode,
  isFetchingMorePostalCode,
  hasNextPagePostalCode,
  fetchNextPagePostalCode,
  postalCodeList,
  setSearchPostalCode,
  addMoreAddress,
  newAddress,
  primaryLabel,
  setPrimary,
  deleteLabel,
  addressTypeLabel,
  storePhotoLabel,
  dimensionMinimumLabel,
  fileSizeLabel,
  streetLabel,
  countryLabel,
  provinceLabel,
  cityLabel,
  districtLabel,
  zoneLabel,
  postalCodeLabel,
  longitudeLabel,
}: any) => {
  const { register, control, setValue } = useFormContext();

  const { fields, append, remove, update }: any = useFieldArray({
    control,
    name: "address",
  });

  const [indexStorePhoto, setindexStorePhoto] = useState(0);

  // Country State
  const [totalRowsCountry, setTotalRowsCountry] = useState(0);
  const [listCountry, setListCountry] = useState([]);
  const [searchCountry, setSearchCountry] = useState("");
  const debounceSearchCountry = useDebounce(searchCountry, 1000);

  // Country Structure State
  const [totalRowsCountryStructure, setTotalRowsCountryStructure] = useState(0);
  const [listCountryStructure, setListCountryStructure] = useState([]);
  const [searchCountryStructure, setSearchCountryStructure] = useState("");
  const debounceSearchCountryStructure = useDebounce(searchCountryStructure, 1000);

  // Postal State
  const [totalRowsPostal, setTotalRowsPostal] = useState(0);
  const [listPostal, setListPostal] = useState([]);
  const [searchPostal, setSearchPostal] = useState("");
  const debounceSearchPostal = useDebounce(searchPostal, 1000);

  const { mutate: uploadStorePhotoAddress, isLoading: isLoadingStorePhotoAddress } =
    useUploadStorePhotoAddress({
      options: {
        onSuccess: ({ imageUrl }: { imageUrl: string }) => {
          setValue(`address.${indexStorePhoto}.image`, imageUrl);
        },
      },
    });

  const handleUploadStorePhotoAddress = async (files: any) => {
    const formData: any = new FormData();
    await formData.append("image", files);

    return uploadStorePhotoAddress(formData);
  };

  // Country API
  const {
    isLoading: isLoadingCountry,
    isFetching: isFetchingCountry,
    isFetchingNextPage: isFetchingMoreCountry,
    hasNextPage: hasNextPageCountry,
    fetchNextPage: fetchNextPageCountry,
  } = useCountryInfiniteLists({
    query: {
      search: debounceSearchCountry,
      limit: 10,
    },
    options: {
      onSuccess: (data: any) => {
        setTotalRowsCountry(data.pages[0].totalRow);
        const mappedData = data?.pages?.map((group: any) => {
          return group.rows?.map((element: any) => {
            return {
              value: element.id,
              label: element.name,
            };
          });
        });
        const flattenArray = [].concat(...mappedData);
        setListCountry(flattenArray);
      },
      getNextPageParam: (_lastPage: any, pages: any) => {
        if (listCountry.length < totalRowsCountry) {
          return pages.length + 1;
        } else {
          return undefined;
        }
      },
    },
  });

  const {
    data: countryPostalData,
    isLoading: isLoadingCountryPostal,
    isFetching: isFetchingCountryPostal,
  } = useCountryPostalVendor({
    countryId: "",
    level: "",
    options: {
      enabled: false,
      onSuccess: (data: any) => {
        // pagination.setTotalItems(data.totalRow);
      },
    },
  });

  const {
    data: vendorData,
    isLoading: isLoadingVendor,
    isFetching: isFetchingVendor,
  } = useCountryStructureVendor({
    id: "",
    options: {
      enabled: false,
      onSuccess: (data: any) => {
        // pagination.setTotalItems(data.totalRow);
      },
    },
  });

  return (
    <Col width="100%">
      <Row width={"250px"}>
        <Button
          size="big"
          onClick={() => {
            if (formType === "edit") {
              append({
                id: 0,
                address_type: "",
                street: "",
                country: "",
                province: "",
                city: "",
                district: "",
                zone: "",
                postal_code: "",
                longtitude: "",
                latitude: "",
                is_primary: fields.length === 0,
                photo: "",
                deleted: false,
              });
            } else {
              append({
                address_type: "",
                street: "",
                country: "",
                province: "",
                city: "",
                district: "",
                zone: "",
                postal_code: "",
                longtitude: "",
                latitude: "",
                is_primary: fields.length === 0,
                photo: "",
              });
            }
          }}
        >
          <ICPlusWhite /> {addMoreAddress}
        </Button>
      </Row>

      <Spacer size={20} />

      {fields.map((address: any, addressIndex: any) => {
        return (
          <Col key={address.id}>
            <Controller
              control={control}
              name={`address.${addressIndex}.imageUrl`}
              render={({ field: { value } }) => {
                return (
                  <FileUploaderAllFiles
                    label={storePhotoLabel}
                    onSubmit={(file: any) => {
                      setindexStorePhoto(addressIndex);
                      handleUploadStorePhotoAddress(file);
                    }}
                    disabled={isLoadingStorePhotoAddress}
                    defaultFile={value || "/placeholder-employee-photo.svg"}
                    withCrop
                    sizeImagePhoto="125px"
                    removeable
                    textPhoto={[dimensionMinimumLabel, fileSizeLabel]}
                  />
                );
              }}
            />

            <Spacer size={10} />

            <Text variant="headingRegular" color="blue.dark">
              {newAddress}
            </Text>

            <Spacer size={10} />

            <Row gap={"5px"}>
              {address.is_primary ? (
                <>
                  <AddressLabel>
                    <CheckOutlined /> {primaryLabel}
                  </AddressLabel>{" "}
                  |
                </>
              ) : (
                <>
                  <Text
                    variant="subtitle1"
                    clickable
                    inline
                    color="blue.dark"
                    onClick={() => {
                      const findIndex = fields.findIndex((address: any) => address.is_primary);

                      // Ganti status primary true menjadi false di elemen lain
                      update(findIndex, { ...fields[findIndex], is_primary: false });

                      // Ganti status primary false menjadi true di elemen yang di tuju
                      update(addressIndex, { ...address, is_primary: true });
                    }}
                  >
                    {setPrimary}
                  </Text>{" "}
                  |
                </>
              )}

              <Text
                variant="subtitle1"
                color="pink.regular"
                clickable
                inline
                onClick={() => {
                  remove(addressIndex);
                }}
              >
                {deleteLabel}
              </Text>
            </Row>

            <Spacer size={10} />

            <Row width="100%" gap={"10px"} noWrap>
              <Controller
                control={control}
                defaultValue={getValues(`address.${addressIndex}.address_type`)}
                name={`address.${addressIndex}.address_type`}
                render={({ field: { onChange, value }, formState: { errors } }) => (
                  <Col width="50%">
                    <Text variant="headingRegular">{addressTypeLabel}</Text>
                    <Spacer size={5} />
                    <FormSelect
                      defaultValue={value}
                      style={{ width: "100%" }}
                      size={"large"}
                      placeholder={"Select"}
                      borderColor={"#AAAAAA"}
                      error={errors?.["address"]?.[addressIndex]?.["address_type"]?.["message"]}
                      arrowColor={"#000"}
                      withSearch={false}
                      items={[
                        { id: "Home", value: "Home" },
                        { id: "Office", value: "Office" },
                        { id: "Apartment", value: "Apartment" },
                        { id: "School", value: "School" },
                      ]}
                      onChange={(value: any) => {
                        onChange(value);
                      }}
                    />
                  </Col>
                )}
              />

              <Col width="50%">
                <Controller
                  control={control}
                  defaultValue={getValues(`address.${addressIndex}.street`)}
                  rules={{
                    maxLength: {
                      value: 225,
                      message: "Max length exceeded",
                    },
                    // required: {
                    //   value: true,
                    //   message: "Please enter account street.",
                    // },
                  }}
                  name={`address.${addressIndex}.street`}
                  render={({ field: { onChange, value }, formState: { errors } }) => (
                    <TextArea
                      width="100%"
                      rows={2}
                      defaultValue={value}
                      onChange={onChange}
                      // required
                      error={errors?.["address"]?.[addressIndex]?.["street"]?.["message"]}
                      placeholder="e.g Front Groceries No. 5"
                      label={streetLabel}
                    />
                  )}
                />
              </Col>
            </Row>

            <Spacer size={10} />

            <Row width="100%" gap={"10px"} noWrap>
              <Controller
                control={control}
                defaultValue={""}
                name={`address.${addressIndex}.country`}
                render={({ field: { onChange }, formState: { errors } }) => (
                  <Col width="50%">
                    {isLoadingCountry ? (
                      <Center>
                        <Spin tip="" />
                      </Center>
                    ) : (
                      <>
                        <Text variant="headingRegular">{countryLabel}</Text>
                        <Spacer size={5} />
                        <FormSelect
                          defaultValue={""}
                          style={{ width: "100%" }}
                          size={"large"}
                          placeholder={"Select"}
                          borderColor={"#AAAAAA"}
                          arrowColor={"#000"}
                          withSearch
                          isLoading={isFetchingCountry}
                          isLoadingMore={isFetchingMoreCountry}
                          fetchMore={() => {
                            if (hasNextPageCountry) {
                              fetchNextPageCountry();
                            }
                          }}
                          items={isFetchingCountry && !isFetchingMoreCountry ? [] : listCountry}
                          onChange={(value: any) => {
                            onChange(value);
                          }}
                          onSearch={(value: any) => {
                            setSearchCountry(value);
                          }}
                        />
                      </>
                    )}
                  </Col>
                )}
              />

              <Controller
                control={control}
                defaultValue={""}
                name={`address.${addressIndex}.province`}
                render={({ field: { onChange, value }, formState: { errors } }) => (
                  <Col width="50%">
                    <Text variant="headingRegular">{provinceLabel}</Text>
                    <Spacer size={5} />
                    <FormSelect
                      defaultValue={value}
                      style={{ width: "100%" }}
                      size={"large"}
                      placeholder={"Select"}
                      borderColor={"#AAAAAA"}
                      arrowColor={"#000"}
                      withSearch={false}
                      items={[]}
                      onChange={(value: any) => {
                        onChange(value);
                      }}
                    />
                  </Col>
                )}
              />
            </Row>

            <Spacer size={10} />

            <Row width="100%" gap={"10px"} noWrap>
              <Controller
                control={control}
                defaultValue={""}
                name={`address.${addressIndex}.city`}
                render={({ field: { onChange, value }, formState: { errors } }) => (
                  <Col width="50%">
                    <Text variant="headingRegular">{cityLabel}</Text>
                    <Spacer size={5} />
                    <FormSelect
                      defaultValue={value}
                      style={{ width: "100%" }}
                      size={"large"}
                      placeholder={"Select"}
                      borderColor={"#AAAAAA"}
                      arrowColor={"#000"}
                      withSearch={false}
                      items={[]}
                      onChange={(value: any) => {
                        onChange(value);
                      }}
                    />
                  </Col>
                )}
              />

              <Controller
                control={control}
                defaultValue={""}
                name={`address.${addressIndex}.district`}
                render={({ field: { onChange, value }, formState: { errors } }) => (
                  <Col width="50%">
                    <Text variant="headingRegular">{districtLabel}</Text>
                    <Spacer size={5} />
                    <FormSelect
                      defaultValue={value}
                      style={{ width: "100%" }}
                      size={"large"}
                      placeholder={"Select"}
                      borderColor={"#AAAAAA"}
                      arrowColor={"#000"}
                      withSearch={false}
                      items={[]}
                      onChange={(value: any) => {
                        onChange(value);
                      }}
                    />
                  </Col>
                )}
              />
            </Row>

            <Spacer size={10} />

            <Row width="100%" gap={"10px"} noWrap>
              <Controller
                control={control}
                defaultValue={""}
                name={`address.${addressIndex}.zone`}
                render={({ field: { onChange, value }, formState: { errors } }) => (
                  <Col width="50%">
                    <Text variant="headingRegular">{zoneLabel}</Text>
                    <Spacer size={5} />
                    <FormSelect
                      defaultValue={value}
                      style={{ width: "100%" }}
                      size={"large"}
                      placeholder={"Select"}
                      borderColor={"#AAAAAA"}
                      arrowColor={"#000"}
                      withSearch={false}
                      items={[]}
                      onChange={onChange}
                    />
                  </Col>
                )}
              />

              <Controller
                control={control}
                name={`address.${addressIndex}.postal_code`}
                render={({ field: { onChange, value } }) => (
                  <Col width="50%">
                    <Text variant="headingRegular">{postalCodeLabel}</Text>
                    <Spacer size={5} />
                    <FormSelect
                      defaultValue={value}
                      style={{ width: "100%" }}
                      size={"large"}
                      placeholder={"Select"}
                      borderColor={"#AAAAAA"}
                      arrowColor={"#000"}
                      withSearch
                      isLoading={isFetchingPostalCode}
                      isLoadingMore={isFetchingMorePostalCode}
                      fetchMore={() => {
                        if (hasNextPagePostalCode) {
                          fetchNextPagePostalCode();
                        }
                      }}
                      items={
                        isFetchingPostalCode && !isFetchingMorePostalCode ? [] : postalCodeList
                      }
                      onChange={(value: any) => {
                        onChange(value);
                      }}
                      onSearch={(value: any) => {
                        setSearchPostalCode(value);
                      }}
                    />
                  </Col>
                )}
              />
            </Row>

            <Spacer size={10} />

            <Row width="100%" gap={"10px"} noWrap>
              <Col width="50%">
                <Input
                  width="100%"
                  label={longitudeLabel}
                  height="40px"
                  defaultValue={""}
                  placeholder={"e.g 38.8951"}
                  {...register(`address.${addressIndex}.longtitude`)}
                />
              </Col>

              <Col width="50%">
                <Input
                  width="100%"
                  label="Latitude"
                  height="40px"
                  defaultValue={""}
                  placeholder={"e.g -77.0364"}
                  {...register(`address.${addressIndex}.latitude`)}
                />
              </Col>
            </Row>

            <Spacer size={25} />
          </Col>
        );
      })}
    </Col>
  );
};

const AddressLabel: any = styled.p`
  display: inline;
  width: fit-content;
  background: #d5fafd;
  padding: 4px 8px;
  font-weight: 600;
  font-size: 10px;
  color: #1e858e;
`;

const Center = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default Addresses;
