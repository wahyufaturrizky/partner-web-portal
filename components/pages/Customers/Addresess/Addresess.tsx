import React, { useState } from "react";
import { Col, Row, Spacer, Text, Button, FormSelect, Input, Spin } from "pink-lava-ui";
import { useFormContext, useFieldArray, Controller } from "react-hook-form";
import { ICPlusWhite } from "assets";
import { CheckOutlined } from "@ant-design/icons";
import { useCountryStructureVendor, useCountryPostalVendor } from "hooks/mdm/vendor/useVendor";
import { useCountryInfiniteLists } from "hooks/mdm/country-structure/useCountries";
import useDebounce from "lib/useDebounce";
import styled from "styled-components";
import MultipleUploadPhotos from "./component/MultipleUploadPhotos";

const Addresses = ({ formType }: any) => {
  const { register, control } = useFormContext();

  const { fields, append, remove, update }: any = useFieldArray({
    control,
    name: "address",
  });

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
                type: "",
                street: "",
                country: "",
                province: "",
                city: "",
                district: "",
                zone: "",
                postal_code: "",
                lon: "",
                lat: "",
                is_primary: fields.length === 0,
                photo: [],
                deleted: false,
              });
            } else {
              append({
                type: "",
                street: "",
                country: "",
                province: "",
                city: "",
                district: "",
                zone: "",
                postal_code: "",
                lon: "",
                lat: "",
                is_primary: fields.length === 0,
                photo: [],
              });
            }
          }}
        >
          <ICPlusWhite /> Add More Address
        </Button>
      </Row>

      <Spacer size={20} />

      {fields?.map((address: any, addressIndex: any) => {
        return (
          <Col key={address.id}>
            <Text variant="headingRegular" color="blue.dark">
              New Address
            </Text>

            <Spacer size={10} />

            <Row gap={"5px"}>
              {address.is_primary ? (
                <>
                  <AddressLabel>
                    <CheckOutlined /> Primary
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

                      // Gantu status primary false menjadi true di elemen yang di tuju
                      update(addressIndex, { ...address, is_primary: true });
                    }}
                  >
                    Set Primary
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
                Delete
              </Text>
            </Row>

            <Spacer size={10} />

            <Row width="100%" gap={"10px"} noWrap>
              <Controller
                control={control}
                defaultValue={""}
                name={`addresses.${addressIndex}.type`}
                render={({ field: { onChange, value }, formState: { errors } }) => (
                  <Col width="50%">
                    <Text variant="headingRegular">Address Type</Text>
                    <Spacer size={5} />
                    <FormSelect
                      defaultValue={value}
                      style={{ width: "100%" }}
                      size={"large"}
                      placeholder={"Select"}
                      borderColor={"#AAAAAA"}
                      arrowColor={"#000"}
                      withSearch={false}
                      items={[
                        { id: "Office", value: "Office" },
                        { id: "Store/Outlet", value: "Store/Outlet" },
                      ]}
                      onChange={(value: any) => {
                        onChange(value);
                      }}
                    />
                  </Col>
                )}
              />

              <Col width="50%">
                <Input
                  required
                  width="100%"
                  label="Street"
                  height="40px"
                  defaultValue={""}
                  placeholder={"e.g Front Groceries No. 5"}
                  {...register(`addresses.${addressIndex}.street`)}
                />
              </Col>
            </Row>

            <Spacer size={10} />

            <Row width="100%" gap={"10px"} noWrap>
              <Controller
                control={control}
                defaultValue={""}
                name={`addresses.${addressIndex}.country`}
                render={({ field: { onChange }, formState: { errors } }) => (
                  <Col width="50%">
                    {isLoadingCountry ? (
                      <Center>
                        <Spin tip="" />
                      </Center>
                    ) : (
                      <>
                        <Text variant="headingRegular">Country</Text>
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
                name={`addresses.${addressIndex}.province`}
                render={({ field: { onChange, value }, formState: { errors } }) => (
                  <Col width="50%">
                    <Text variant="headingRegular">Province</Text>
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
                name={`addresses.${addressIndex}.city`}
                render={({ field: { onChange, value }, formState: { errors } }) => (
                  <Col width="50%">
                    <Text variant="headingRegular">City</Text>
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
                name={`addresses.${addressIndex}.district`}
                render={({ field: { onChange, value }, formState: { errors } }) => (
                  <Col width="50%">
                    <Text variant="headingRegular">District</Text>
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
                name={`addresses.${addressIndex}.zone`}
                render={({ field: { onChange, value }, formState: { errors } }) => (
                  <Col width="50%">
                    <Text variant="headingRegular">Zone</Text>
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
                      onChange={(value: any) => {}}
                    />
                  </Col>
                )}
              />

              <Controller
                control={control}
                defaultValue={""}
                name={`addresses.${addressIndex}.postal_code`}
                render={({ field: { onChange, value }, formState: { errors } }) => (
                  <Col width="50%">
                    <Text variant="headingRegular">Postal Code</Text>
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
              <Col width="50%">
                <Input
                  width="100%"
                  label="Longitude"
                  height="40px"
                  defaultValue={""}
                  placeholder={"e.g 38.8951"}
                  {...register(`addresses.${addressIndex}.lon`)}
                />
              </Col>

              <Col width="50%">
                <Input
                  width="100%"
                  label="Latitude"
                  height="40px"
                  defaultValue={""}
                  placeholder={"e.g -77.0364"}
                  {...register(`addresses.${addressIndex}.lat`)}
                />
              </Col>
            </Row>

            <Spacer size={10} />

            <MultipleUploadPhotos index={addressIndex} control={control} />

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
