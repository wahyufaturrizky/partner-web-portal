import React, { useState } from "react";
import _ from "lodash";
import { useRouter } from "next/router";
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
} from "pink-lava-ui";

import * as ExcelJS from "exceljs/dist/exceljs.min.js";
import { saveAs } from "file-saver";

import styled from "styled-components";
import { COUNTRY_CODE } from "utils/country_code_constant";
import { PHONE_CODE } from "utils/phone_code_constant";
import { useCurrenciesMDM } from "../../../hooks/mdm/country-structure/useCurrencyMDM";
import { useCheckCountryName, useCreateCountries } from "../../../hooks/mdm/country-structure/useCountries";
import { ModalManageData } from "../../../components/elements/Modal/ModalManageData";
import { ModalDeleteConfirmation } from "../../../components/elements/Modal/ModalConfirmationDelete";

async function downloadStructure(countryStructure: any) {
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet("country_structure");
  ws.columns = [
    { header: '1st_level_name', key: '1', width: 30 },
    { header: '2nd_level_name', key: '2', width: 30 },
    { header: '3rd_level_name', key: '3', width: 30 },
    { header: '4th_level_name', key: '4', width: 30 },
    { header: '5th_level_name', key: '5', width: 30 },
    { header: '6th_level_name', key: '6', width: 30 },
    { header: '7th_level_name', key: '7', width: 30 },
    { header: '8th_level_name', key: '8', width: 30 },
    { header: '9th_level_name', key: '9', width: 30 },
    { header: '10th_level_name', key: '10', width: 30 },
	   ];

  const row = ws.addRow({
    1: 'The first-level structure contains the territory of government under the country.E.g. State, Province, Region',
    2: 'The second-level structure contains the territory of government under the provinces/ states/region.',
    3: 'The third-level sructure contains the territory of government under the city/regency.E.g. District',
    4: 'The fourth-level sructure contains the territory of government under districts area	E.g. Sub-District, Village',
    5: 'The fifth-level sructure contains the territory under the administration of the fourth-level',
    6: 'The sixth-level sructure contains the territory under the administration of the fifht-level',
    7: 'The seventh-level sructure contains the territory under the administration of the sixth-level',
    8: 'The eighth-level sructure contains the territory under the administration of the seventh-level',
    9: 'The ninth-level sructure contains the territory under the administration of the eighth-level',
    10: 'The tenth-level sructure contains the territory under the administration of the ninth-level',
  });

  ws.addRow({
    ...(countryStructure[0] && { 1: countryStructure[0].name }),
    ...(countryStructure[1] && { 2: countryStructure[1].name }),
    ...(countryStructure[2] && { 3: countryStructure[2].name }),
    ...(countryStructure[3] && { 4: countryStructure[3].name }),
    ...(countryStructure[4] && { 5: countryStructure[4].name }),
    ...(countryStructure[5] && { 6: countryStructure[5].name }),
    ...(countryStructure[6] && { 7: countryStructure[6].name }),
    ...(countryStructure[7] && { 8: countryStructure[7].name }),
    ...(countryStructure[8] && { 9: countryStructure[8].name }),
    ...(countryStructure[9] && { 10: countryStructure[9].name }),
  });

  ws.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: '68ffb7' },
	  };

  row.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'c5e0b3' },
	  };

  const buf = await wb.xlsx.writeBuffer();

  saveAs(new Blob([buf]), "country_structure.xlsx");
}

function stringifyNumber(n: any) {
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

const CreateCountries = () => {
  const router = useRouter();
  const [errors, setErrors] = useState<any>({});
  const [countryStructure, setCountryStructure] = useState<any>([]);
  const [modalDelete, setModalDelete] = useState<any>({ open: false });
  const [searchCurrency, setSearchCurrency] = useState("");
  const [searchPhoneCode, setSearchPhoneCode] = useState("");
  const [searchCountryCode, setSearchCountryCode] = useState("");
  const [countryBasic, setCountryBasic] = useState({
    name: "",
    currencyId: "",
    countryCode: "",
    phoneCode: "",
  });
  const [allStructure, setAllStructure] = useState<any>([]);
  const [checkCountryName, setCheckCountryName] = useState(false);
  const [isCountryNameDuplicate, setIsCountryNameDuplicate] = useState(false);
  const [isCountryNameFocused, setIsCountryNameFocused] = useState(false);

  const [showUploadStructure, setShowUploadStructure] = useState<any>(false);
  const [showManageData, setShowManageData] = useState<any>({
    visible: false,
    index: null,
  });

  const onUploadStructure = (data: any) => {
    const datas: any = Object.values(data[1]).map((data, index) => ({
      name: data,
      level: index + 1,
      connectPostalCode: "N",
      isCity: false,
    }));
    setCountryStructure(datas);
  };

  const { mutate: createCountry } = useCreateCountries({
    options: {
      onSuccess: () => {
        alert('country success created');
        router.push("/mdm/country-structure");
      },
    },
  });

  const validateRequired = (data: any) => {
    const newErrors: any = _.cloneDeep(errors);
    let isError = isCountryNameDuplicate;

    if (!data.name) {
      newErrors.name = "Country Name is required";
      isError = true;
    }

    setErrors(newErrors);

    return isError;
  };

  const onSubmit = () => {
    const newAllStructure: any = _.clone(allStructure);
    if (newAllStructure.length > 0) {
      const allStructureZero: any =				allStructure?.[0]?.map((data: any) => ({
				  ...data,
				  parent: 0,
      })) || [];
      newAllStructure[0] = allStructureZero;
    }
    const newStructure = countryStructure.map((country: any, index: any) => ({
      ...country,
      data: newAllStructure[index],
    }));

    const data: any = {
      name: countryBasic.name,
      ...(newStructure.length > 0 && { structure: newStructure }),
    };
    if (countryBasic.countryCode) {
      data.countryCode = countryBasic.countryCode;
    }
    if (countryBasic.phoneCode) {
      data.phoneCode = countryBasic.phoneCode.toString();
    }
    if (countryBasic.currencyId) {
      data.currencyId = countryBasic.currencyId;
    }
    if (!validateRequired(data)) {
      createCountry(data);
    }
  };

  const onDeleteStructure = () => {
    const newCountryStructure: any = countryStructure.slice(0, modalDelete?.index);
    const newAllStructure: any = allStructure.slice(0, modalDelete?.index);
    setCountryStructure(newCountryStructure);
    setAllStructure(newAllStructure);
    setModalDelete({ open: false });
  };

  const addStructure = () => {
    const newStructure = countryStructure.slice();
    newStructure.push({
      level: countryStructure.length + 1,
      connectPostalCode: "N",
      isCity: countryStructure.length === 0,
      name: "",
    });
    setCountryStructure(newStructure);
  };

  const onChangeStructureName = (e: any, index: any) => {
    const newStructure = _.cloneDeep(countryStructure);
    newStructure[index].name = e.target.value;
    setCountryStructure(newStructure);
  };

  const onChangeStructurePostalCode = (index: any) => {
    const newStructure = _.cloneDeep(countryStructure);
    newStructure[index].connectPostalCode = newStructure[index].connectPostalCode === "Y" ? "N" : "Y";
    setCountryStructure(newStructure);
  };

  const onChangeStructureIsCity = (index: any) => {
    const newStructure = _.cloneDeep(countryStructure).map((data:any) => ({
      ...data,
      isCity: false,
    }));
    newStructure[index].isCity = !newStructure[index].isCity;
    setCountryStructure(newStructure);
  };

  const { data: currencies, isLoading: isLoadingCurrencies }: any = useCurrenciesMDM({
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

  const recursivelyDeleteStructure = (structure: any, allStructure: any, deletedIds: any, level: any) => {
    const parentDeletedIds: any = [];
    deletedIds.forEach((id: any) => {
      const findParentId = structure.find((structure: any) => structure.parent === id);
      parentDeletedIds.push(findParentId.id);
      allStructure[level] = structure.filter((structure: any) => structure.parent !== id);
    });

    if (allStructure[level + 1]) {
      recursivelyDeleteStructure(allStructure[level + 1], allStructure, parentDeletedIds, level + 1);
    }
  };

  const onAddToStructure = (tempAllStructure: any, level: any) => {
    if (!tempAllStructure) {
      setShowManageData({ visible: false });
      return;
    }

    const newStructure: any = _.cloneDeep(allStructure);
    // recursively delete
    if (newStructure[level] && !_.isEqual(newStructure[level - 1], tempAllStructure)) {
      const deletedIds: any = [];
      const tempAllStructureIds: any = tempAllStructure.map((temp: any) => temp?.id);
      newStructure[level - 1].forEach((structure: any) => {
        if (!tempAllStructureIds.includes(structure.id)) {
          deletedIds.push(structure.id);
        }
      });
      const parentDeletedIds: any = [];
      deletedIds.forEach((id: any) => {
        const findParentId = newStructure[level].find((structure: any) => structure.parent === id);
        parentDeletedIds.push(findParentId.id);
        newStructure[level] = newStructure[level].filter((structure: any) => structure.parent !== id);
      });

      if (newStructure[level + 1]) {
        recursivelyDeleteStructure(newStructure[level + 1], newStructure, parentDeletedIds, level + 1);
      }
    }
    newStructure[level - 1] = tempAllStructure;
    setAllStructure(newStructure);
    setShowManageData({ visible: false });
  };

  const onFocusRemoveValidation = (e: any) => {
    const newErrors: any = _.cloneDeep(errors);
    delete newErrors[e.target.name];
    setErrors(newErrors);
  };

  useCheckCountryName({
    name: countryBasic.name,
    options: {
      onSuccess: (data: any) => {
        if (data) {
          const newErrors: any = _.cloneDeep(errors);
          newErrors.name = "The Country name you are using already exists";
          setErrors(newErrors);
        }
        setIsCountryNameDuplicate(data);
        setCheckCountryName(false);
        setIsCountryNameFocused(false);
      },
      enabled: checkCountryName,
    },
  });

  return (
    <>
      {isLoadingCurrencies ? (
        <Center>
          <Spin tip="Loading data..." />
        </Center>
      ) : (
        <Col>
          <Row gap="4px">
            <Text variant="h4">Create Country</Text>
          </Row>
          <Spacer size={12} />
          <Card>
            <Row justifyContent="flex-end" alignItems="center" nowrap>
              <Row gap="10px">
                <Button size="big" variant="tertiary" onClick={() => router.push("/mdm/country-structure")}>
                  Cancel
                </Button>
                <Button disabled={errors.name || isCountryNameFocused} size="big" variant="primary" onClick={onSubmit}>
                  Save
                </Button>
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
                    value={countryBasic.name}
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
                      onChange={(value: any) => setCountryBasic({ ...countryBasic, phoneCode: value })}
                      type="number"
                    />
                  </Col>
                  <Dropdown
                    label="Currency"
                    width="100%"
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
                    <Button
                      variant="tertiary"
                      size="big"
                      onClick={() => downloadStructure(countryStructure)}
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
                      disabled
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
                          defaultChecked={false}
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
      <FileUploaderExcel
        setVisible={setShowUploadStructure}
        visible={showUploadStructure}
        onSubmit={onUploadStructure}
      />
      {showManageData.visible && (
      <ModalManageData
        visible={showManageData.visible}
        onCancel={() => setShowManageData({ visible: false })}
        structure={countryStructure[showManageData.index]}
        parentDataStructure={allStructure[countryStructure[showManageData.index].level - 2]}
        onAddToStructure={(tempAllStructure: any, level: any) => onAddToStructure(tempAllStructure, level)}
        allStructure={_.cloneDeep(allStructure).slice(
					  0,
					  countryStructure[showManageData.index].level,
        )}
        level={countryStructure[showManageData.index].level}
        countryStructure={_.cloneDeep(countryStructure).slice(
					  0,
					  countryStructure[showManageData.index].level,
        )}
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
	.ant-input-number-input {
		border-radius: 0px;

	}

	.ant-input-number {
		border: 1px solid #AAAAAA;
	}

	.ant-input-number-group-addon {
		width: 72px;
		border-radius: 8px 0px 0px 8px;
		border: 1px solid #AAAAAA;
		border-right: none;
	}

	.ant-input-number-handler-wrap {
		display: none;
	}
`;

const Label = styled.div`
	font-weight: bold;
	font-size: 16px;
	line-height: 24px;
	color: #000000;
`;

export default CreateCountries;
