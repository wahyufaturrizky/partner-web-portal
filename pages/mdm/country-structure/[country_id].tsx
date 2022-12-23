import React, { useEffect, useState } from "react";
import _ from "lodash";
import Router, { useRouter } from "next/router";
import {
  Text,
  Col,
  Row,
  Spacer,
  Dropdown,
  Button,
  Accordion,
  Input,
  Switch,
  FileUploaderExcel,
  Spin,
  Checkbox,
  FormInput,
  FileUploadModal,
} from "pink-lava-ui";

import styled from "styled-components";
import { COUNTRY_CODE } from "utils/country_code_constant";
import { PHONE_CODE } from "utils/phone_code_constant";
import { useUserPermissions } from "hooks/user-config/usePermission";
import ArrowLeft from "../../../assets/icons/arrow-left.svg";
import { ModalDeleteConfirmation } from "../../../components/elements/Modal/ModalConfirmationDelete";
import { useCurrenciesMDM } from "../../../hooks/mdm/country-structure/useCurrencyMDM";
import {
  useFetchDetailCountry,
  useUpdateCountry,
  useDeleteDataCountries,
  useCheckCountryName,
  useUploadFileCountryStructure,
} from "../../../hooks/mdm/country-structure/useCountries";
import { ModalManageDataEdit } from "../../../components/elements/Modal/ModalManageDataEdit";

const CreateConfig = () => {
  const router = useRouter();
  const [errors, setErrors] = useState({});
  const { country_id } = router.query;
  const [countryStructure, setCountryStructure] = useState([]);
  const [updateCountryStructure, setUpdateCountryStructure] = useState({
    update: [],
    addNew: [],
    delete: [],
  });
  const [updateAllStructure, setUpdateAllStructure] = useState<any>({
    addNew: {},
    delete: {},
  });
  const [modalDelete, setModalDelete] = useState({ open: false });
  const [modalDeleteCountry, setModalDeleteCountry] = useState({ open: false });
  const [searchCurrency, setSearchCurrency] = useState("");
  const [searchPhoneCode, setSearchPhoneCode] = useState("");
  const [searchCountryCode, setSearchCountryCode] = useState("");
  const [countryBasic, setCountryBasic] = useState({
    name: "",
    currencyId: "",
    countryCode: "",
    phoneCode: "",
  });

  const [showUploadStructure, setShowUploadStructure] = useState(false);
  const [showManageData, setShowManageData] = useState({
    visible: false,
    index: null,
    update: false,
  });

  const [checkCountryName, setCheckCountryName] = useState(false);
  const [isCountryNameDuplicate, setIsCountryNameDuplicate] = useState(false);
  const [isCountryNameFocused, setIsCountryNameFocused] = useState(false);

  const { data: dataUserPermission } = useUserPermissions({
    options: {
      onSuccess: () => {},
    },
  });

  const listPermission = dataUserPermission?.permission?.filter(
    (filtering: any) => filtering.menu === "Country",
  );

  const onUploadStructure = (data: any) => {
    const idsCountryStructure = countryStructure.map((data: any) => data.id);
    const updateCountryStructureClone: any = _.cloneDeep(updateCountryStructure);
    idsCountryStructure.forEach((id: any) => (
      updateCountryStructureClone.delete.push(id)
    ));
    const datas: any = Object.values(data[1]).map((data, index) => ({
      name: data,
      level: index + 1,
      connectPostalCode: "N",
      isCity: false,
    }));
    updateCountryStructureClone.addNew.push(...datas);
    setUpdateCountryStructure(updateCountryStructureClone);
    setCountryStructure(datas);
  };

  const { mutate: updateCountry } = useUpdateCountry({
    country_id,
    options: {
      onSuccess: () => {
        if (showManageData.update) {
          setShowManageData((prev) => ({ ...prev, update: false }));
        } else {
          router.push("/mdm/country-structure");
        }
      },
    },
  });

  const validateRequired = (data: any) => {
    const newErrors: any = _.cloneDeep(errors);
    let isError = false;

    if (!data.name) {
      newErrors.name = "Country Name is required";
      isError = true;
    }

    setErrors(newErrors);

    return isError;
  };

  const onSubmit = ({ isFromUploadManageData = false }) => {
    const { name } = countryBasic;
    const data: any = {
      name,
      delete: {
        structure: updateCountryStructure.delete,
        structureElements: Object.values(updateAllStructure.delete).flat() || [],
      },
      update: {
        structure: updateCountryStructure.update,
      },
      addNew: {
        structure: updateCountryStructure.addNew.map((data: any) => ({
          ...data,
          data: updateAllStructure.addNew[data.level - 1] || [],
        })),
        structureElements: Object.values(updateAllStructure.addNew).flat().filter((data: any) => {
          if (data?.parent?.id) {
            if (isNaN(data?.parent?.id)) {
              return false;
            }
          }

          return true;
        }).map((data: any) => ({
          id: data.id,
          isNewParent: data.isNewParent,
          isReplace: !!data.isReplace,
          name: data.name,
          ...(data?.parent && { parent: data?.parent?.id }),
          structureId: data.structureId,
        })) || [],
      },
    };

    if (isFromUploadManageData) {
      delete data.name;
      updateCountry(data);
      setUpdateAllStructure({
        addNew: {},
        delete: {},
      });
    } else {
      if (countryBasic.countryCode) {
        data.countryCode = countryBasic.countryCode;
      }
      if (countryBasic.phoneCode) {
        data.phoneCode = countryBasic.phoneCode;
      }
      if (countryBasic.currencyId) {
        data.currencyId = countryBasic.currencyId;
      }
      if (!validateRequired(data)) {
        if (name === country?.name) {
          delete data.name;
        }
        updateCountry(data);
      }
    }
  };

  function stringifyNumber(n) {
    const special = [
      "First",
      "Second",
      "Third",
      "Fourth",
      "Fifth",
      "Sixth",
      "Seventh",
      "Eighth",
      "Ninth",
      "Tenth",
    ];
    return special[n];
  }

  const onDeleteStructure = () => {
    const newCountryStructure = countryStructure.slice(0, modalDelete.index);
    setCountryStructure(newCountryStructure);
    setModalDelete({ open: false });
    if (modalDelete.structure.id) {
      const updateCountryStructureClone = _.cloneDeep(updateCountryStructure);
      updateCountryStructureClone.delete.push(modalDelete.structure.id);
      setUpdateCountryStructure(updateCountryStructureClone);
    } else {
      const updateCountryStructureClone = _.cloneDeep(updateCountryStructure);
      updateCountryStructureClone.addNew = updateCountryStructureClone.addNew.filter((add) => add.level <= modalDelete.structure.level - 1);
      setUpdateCountryStructure(updateCountryStructureClone);
    }
  };

  const addStructure = () => {
    const newStructure: any = countryStructure.slice();
    newStructure.push({
      level: countryStructure.length + 1,
      connectPostalCode: "N",
      name: "",
      isCity: countryStructure.length === 0,
    });
    setCountryStructure(newStructure);

    const updateCountryStructureClone: any = _.cloneDeep(updateCountryStructure);
    updateCountryStructureClone.addNew.push({
      level: countryStructure.length + 1,
      connectPostalCode: "N",
      name: "",
    });
    setUpdateCountryStructure(updateCountryStructureClone);
  };

  const onChangeStructureName = (e: any, index: any) => {
    const newStructure: any = _.cloneDeep(countryStructure);
    newStructure[index].name = e.target.value;
    setCountryStructure(newStructure);
  };

  const onBlurStructureName = (e: any, index: any) => {
    const newStructure: any = _.cloneDeep(countryStructure);
    newStructure[index].name = e.target.value;
    if (newStructure[index].id) {
      const structureInUpdateIndex: any = updateCountryStructure.update.findIndex((update: any) => update.id === newStructure[index].id);
      const updateCountryStructureClone: any = _.cloneDeep(updateCountryStructure);
      if (structureInUpdateIndex > 0) {
        updateCountryStructureClone.update[structureInUpdateIndex].name = e.target.value;
        setUpdateCountryStructure(updateCountryStructureClone);
      } else {
        updateCountryStructureClone.update.push({
          id: newStructure[index].id,
          connectPostalCode: newStructure[index].connectPostalCode,
          name: newStructure[index].name,
        });
        setUpdateCountryStructure(updateCountryStructureClone);
      }
    } else if (updateCountryStructure.addNew.some((add: any) => add.level === index + 1)) {
      const updateCountryStructureClone: any = _.cloneDeep(updateCountryStructure);
      const structureInUpdateIndex = updateCountryStructureClone.addNew.findIndex((add: any) => add.level === index + 1);
      updateCountryStructureClone.addNew[structureInUpdateIndex].name = e.target.value;
      setUpdateCountryStructure(updateCountryStructureClone);
    }
  };

  const onChangeStructurePostalCode = (index: any) => {
    const newStructure: any = _.cloneDeep(countryStructure);
    newStructure[index].connectPostalCode = newStructure[index].connectPostalCode === "Y" ? "N" : "Y";
    setCountryStructure(newStructure);
    if (newStructure[index].id) {
      const structureInUpdateIndex = updateCountryStructure.update.findIndex((update: any) => update.id === newStructure[index].id);
      const updateCountryStructureClone: any = _.cloneDeep(updateCountryStructure);
      if (structureInUpdateIndex > 0) {
        updateCountryStructureClone.update[structureInUpdateIndex].connectPostalCode === "Y" ? "N" : "Y";
        setUpdateCountryStructure(updateCountryStructureClone);
      } else {
        updateCountryStructureClone.update.push({
          id: newStructure[index].id,
          connectPostalCode: newStructure[index].connectPostalCode,
          name: newStructure[index].name,
        });
        setUpdateCountryStructure(updateCountryStructureClone);
      }
    } else if (updateCountryStructure.addNew.some((add: any) => add.level === index + 1)) {
      const updateCountryStructureClone: any = _.cloneDeep(updateCountryStructure);
      const structureInUpdateIndex: any = updateCountryStructureClone.addNew.findIndex((add: any) => add.level === index + 1);
      updateCountryStructureClone.addNew[structureInUpdateIndex].connectPostalCode = newStructure[index].connectPostalCode;
      setUpdateCountryStructure(updateCountryStructureClone);
    }
  };

  const onChangeStructureIsCity = (index: any) => {
    const newStructure: any = _.cloneDeep(countryStructure).map((data:any) => ({
      ...data,
      isCity: false,
    }));
    newStructure[index].isCity = !newStructure[index].isCity;
    setCountryStructure(newStructure);
    if (newStructure[index].id) {
      const structureInUpdateIndex = updateCountryStructure.update.findIndex((update: any) => update.id === newStructure[index].id);
      const updateCountryStructureClone: any = _.cloneDeep(updateCountryStructure);
      if (structureInUpdateIndex > 0) {
        updateCountryStructureClone.update[structureInUpdateIndex].isCity = !updateCountryStructureClone.update[structureInUpdateIndex].isCity;
        setUpdateCountryStructure(updateCountryStructureClone);
      } else {
        updateCountryStructureClone.update.push({
          id: newStructure[index].id,
          connectPostalCode: newStructure[index].connectPostalCode,
          name: newStructure[index].name,
          isCity: newStructure[index].isCity,
        });
        setUpdateCountryStructure(updateCountryStructureClone);
      }
    } else if (updateCountryStructure.addNew.some((add: any) => add.level === index + 1)) {
      const updateCountryStructureClone: any = _.cloneDeep(updateCountryStructure);
      const structureInUpdateIndex: any = updateCountryStructureClone.addNew.findIndex((add: any) => add.level === index + 1);
      updateCountryStructureClone.addNew[structureInUpdateIndex].isCity = newStructure[index].isCity;
      setUpdateCountryStructure(updateCountryStructureClone);
    }
  };

  const { data: currencies, isLoading: isLoadingCurrencies } = useCurrenciesMDM({
    query: {
      limit: 10000,
      search: searchCurrency,
    },
    options: {},
  });
  const currencyList = currencies?.rows?.map((currency: any) => ({
    id: currency.id,
    value: currency.currencyName,
  }));

  const onAddToStructure = (tempUpdateAllStructure: any, level: any) => {
    const newUpdateAllStructure = _.cloneDeep(updateAllStructure);
    newUpdateAllStructure.addNew[level - 1] = tempUpdateAllStructure.addNew;
    newUpdateAllStructure.delete[level - 1] = tempUpdateAllStructure.delete;
    setUpdateAllStructure(newUpdateAllStructure);
    setShowManageData({ visible: false, index: null, update: true });
  };

  useEffect(() => {
    if (showManageData.update) {
      onSubmit({ isFromUploadManageData: true });
    }
  }, [showManageData.update]);

  const [isLoading, setIsLoading] = useState(true);

  const { data: country } = useFetchDetailCountry({
    country_id,
    options: {
      onSuccess: (data: any) => {
        setCountryBasic({
          name: data.name,
          currencyId: data?.currency?.id,
          countryCode: data?.countryCode,
          phoneCode: data?.phoneCode,
        });
        setCountryStructure(
          data.structure.map((data: any, index: any) => ({
            name: data.name,
            level: index + 1,
            id: data.id,
            connectPostalCode: data.connectPostalCode === "N" ? "N" : "Y",
            isCity: data.isCity,
          })),
        );

        setIsLoading(false);
      },
    },
  });

  const { mutate: deleteCountry } = useDeleteDataCountries({
    options: {
      onSuccess: () => {
        alert('delete success!');
        router.push(`/mdm/country-structure`);
      },
    },
  });

  const onFocusRemoveValidation = (e: any) => {
    const newErrors: any = _.cloneDeep(errors);
    delete newErrors[e.target.name];
    setErrors(newErrors);
  };

  useCheckCountryName({
    name: countryBasic.name,
    options: {
      onSuccess: (data: any) => {
        if (data && countryBasic.name !== country.name) {
          const newErrors: any = _.cloneDeep(errors);
          newErrors.name = "The Country name you are using already exists";
          setErrors(newErrors);
          setIsCountryNameDuplicate(true);
        } else {
          setIsCountryNameDuplicate(false);
        }

        setCheckCountryName(false);
        setIsCountryNameFocused(false);
      },
      enabled: checkCountryName,
    },
  });

  const { mutate: uploadFileCountries } = useUploadFileCountryStructure({
    options: {
      onSuccess: () => {
        setShowUploadStructure(false);
      },
    },
  });

  const submitUploadFile = (file: any) => {
    const formData: any = new FormData();
    formData.append('upload_file', file);
    formData.append('country_id', country?.id);

    uploadFileCountries(formData);
  };

  return (
    <>
      {isLoadingCurrencies || isLoading ? (
        <Center>
          <Spin tip="Loading data..." />
        </Center>
      ) : (
        <Col>
          <Row gap="4px" alignItems="center">
            <ArrowLeft style={{ cursor: "pointer" }} onClick={() => Router.push("/mdm/country-structure")} />
            <Text variant="h4">{country?.name}</Text>
          </Row>
          <Spacer size={12} />
          <Card>
            <Row justifyContent="flex-end" alignItems="center" nowrap>
              <Row>
                <Row gap="16px">
                  {listPermission?.filter((data: any) => data.viewTypes[0]?.viewType.name === "Delete")
									  .length > 0 && (
										<Button
  size="big"
  variant="tertiary"
  onClick={() => setModalDeleteCountry({ open: true })}
										>
  Delete
										</Button>
                  )}
                  {listPermission?.filter((data: any) => data.viewTypes[0]?.viewType.name === "Update")
									  .length > 0 && (
										<Button disabled={errors?.name || isCountryNameFocused} size="big" variant="primary" onClick={onSubmit}>
  Save
										</Button>
                  )}
                </Row>
              </Row>
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
                    name="name"
                    label="Country Name"
                    height="48px"
                    placeholder="e.g Indonesia"
                    defaultValue={country?.name}
                    onChange={(e: any) => setCountryBasic({ ...countryBasic, name: e.target.value })}
                    error={errors?.name}
                    required
                    onFocus={() => {
										  setIsCountryNameFocused(true);
										  onFocusRemoveValidation({
										    target: {
										      name: "name",
										    },
										  });
                    }}
                    onBlur={() => {
										  setCheckCountryName(true);
                    }}
                  />
                  <Input
                    width="100%"
                    name="Country Code"
                    label="Country Code"
                    height="48px"
                    placeholder="e.g ID"
                    value={countryBasic.countryCode}
                    onChange={(e: any) => setCountryBasic({ ...countryBasic, countryCode: e.target.value })}
                  />
                </Row>

                <Spacer size={20} />

                <Row width="100%" gap="20px" noWrap>
                  <Col width="100%">
                    <Label> Phone Code </Label>
                    <Spacer size={4} />
                    <CustomFormInput
                      defaultValue={countryBasic?.phoneCode}
                      style={{ height: 48, width: '100%' }}
                      placeholder="e.g 62"
                      size="large"
                      width="100%"
                      addonBefore="+"
                      onChange={(e: any) => setCountryBasic({ ...countryBasic, phoneCode: e.target.value })}
                    />
                  </Col>
                  <Dropdown
                    label="Currency"
                    width="100%"
                    defaultValue={country?.currency?.currencyName}
                    items={currencyList}
                    placeholder="Select"
                    onSearch={(search: any) => setSearchCurrency(search)}
                    handleChange={(value: any) => {
										  onFocusRemoveValidation({
										    target: {
										      name: "currency",
										    },
										  });
										  setCountryBasic({ ...countryBasic, currencyId: value });
                    }}
                  />
                </Row>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>

          <Spacer size={20} />

          <Accordion>
            <Accordion.Item key={2}>
              <Accordion.Header variant="blue">Country Structure</Accordion.Header>
              <Accordion.Body>
                <Row width="100%" gap="20px" noWrap>
                  <DownloadUploadContainer>
                    <Text variant="headingMedium">Download and fill in excel file </Text>
                    <Spacer size={4} />
                    <Text variant="body2" color="black.dark">
                      Use this template to add country structure
                    </Text>
                    <Spacer size={10} />
                    <Button variant="tertiary" size="big">
                      <Link
                        href="https://mdm-portal.nabatisnack.co.id:3001/public/template/Template-Country-Structure.xlsx"
                        target="_blank"
                      >
                        Download Template
                      </Link>
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

                <Spacer size={20} />

                <Divider />

                <Spacer size={28} />

                {countryStructure.map((structure: any, index: any) => (
                  <>
                    <Row key={index} width="100%" gap="16px" alignItems="flex-end" noWrap>
                      <Input
                        width="100%"
                        label={`${stringifyNumber(index)} Level Name`}
                        height="48px"
                        placeholder={`Type ${stringifyNumber(index)} Level Name`}
                        value={structure.name || ""}
                        onChange={(e: any) => onChangeStructureName(e, index)}
                        onBlur={(e: any) => onBlurStructureName(e, index)}
                      />
                      <Row width="41%" noWrap style={{ marginBottom: "5px" }}>
                        <Button
                          variant="tertiary"
                          size="big"
                          onClick={() => setModalDelete({ open: true, index, structure })}
                        >
                          Delete
                        </Button>
                        <Spacer size={16} />
                        <Button
                          variant="primary"
                          size="big"
                          onClick={() => {
													  setShowManageData({
													    visible: true,
													    index,
													  });
                          }}
                        >
                          Manage Data
                        </Button>
                      </Row>
                    </Row>
                    <Spacer size={8} />
                    <Row>
                      <Row alignItems="center">
                        <Text variant="body2">Is City</Text>
                        <Spacer size={8} display="inline-block" />
                        <Checkbox
                          checked={structure.isCity}
                          onChange={() => onChangeStructureIsCity(index)}
                        />
                      </Row>
                      <Row gap="15px" alignItems="center">
                        <Text variant="body2">Connect to postal code</Text>
                        <Switch
                          checked={structure.connectPostalCode === "Y"}
                          onChange={() => onChangeStructurePostalCode(index)}
                        />
                      </Row>
                    </Row>
                    <Spacer size={20} />
                    <Divider />
                    <Spacer size={20} />
                  </>
                ))}
                {countryStructure.length < 10 && (
                <Button variant="ghost" size="big" onClick={() => addStructure()}>
                  + Add Structure Level
                </Button>
                )}
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Col>
      )}
      {modalDelete.open && (
      <ModalDeleteConfirmation
        visible={modalDelete.open}
        onCancel={() => setModalDelete({ open: false })}
        onOk={onDeleteStructure}
        itemTitle={modalDelete.structure.name}
      />
      )}
      {showUploadStructure
			&& (
<FileUploaderExcel
  setVisible={setShowUploadStructure}
  visible={showUploadStructure}
  onSubmit={onUploadStructure}
/>
			)}

      {showManageData.visible && (
      <ModalManageDataEdit
        updateAllStructure={updateAllStructure}
        visible={showManageData.visible}
        onCancel={() => setShowManageData({ visible: false })}
        structure={countryStructure[showManageData.index]}
        onAddToStructure={(tempAllStructure, level) => onAddToStructure(tempAllStructure, level)}
        level={countryStructure[showManageData.index].level}
        countryStructure={_.cloneDeep(countryStructure).slice(
					  0,
					  countryStructure[showManageData.index].level,
        )}
      />
      )}

      {modalDeleteCountry.open && (
      <ModalDeleteConfirmation
        itemTitle={countryBasic.name}
        visible={modalDeleteCountry.open}
        onOk={() => deleteCountry({ ids: [country_id] })}
        onCancel={() => setModalDeleteCountry({ open: false })}
      />
      )}
    </>
  );
};

const Center = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
`;

const Divider = styled.div`
	border: 1px dashed #dddddd;
`;

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
	padding: 16px;
`;

const CustomFormInput = styled(FormInput)`
  input {
    height: 48px !important;
  }
	.ant-input {
		border-radius: 8px;
		border: 1px solid #AAAAAA;
	}

	.ant-input-group-addon {
		width: 72px;
		border-radius: 8px 0px 0px 8px;
		border: 1px solid #AAAAAA;
		border-right: none;
	}
`;

const Label = styled.div`
	font-weight: bold;
	font-size: 16px;
	line-height: 24px;
	color: #000000;
`;

export default CreateConfig;
