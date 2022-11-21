import React, { useState } from "react";
import {
  Button,
  Spacer,
  Modal,
  Row,
  Input,
  Search,
  Dropdown,
  Table,
  Col,
  Pagination,
  ActionButton,
  FileUploaderExcel,
} from "pink-lava-ui";
import styled from "styled-components";
import usePagination from "@lucasmogari/react-pagination";
import UploadFile from "../../../assets/icons/upload-file.svg";
import DownloadFile from "../../../assets/icons/download-file.svg";
import {
  useCreateSalesOrganizationHirarcy,
  useSalesOrganizationHirarcy,
} from "../../../hooks/sales-organization/useSalesOrganization";
import axios from "axios";
import { lang } from "lang";

const COMPANY_CODE = "KSNI";

let token;
let apiURL = process.env.NEXT_PUBLIC_API_BASE3;

if (typeof window !== "undefined") {
  token = localStorage.getItem("token");
}

function stringifyNumberSpecial(n) {
  const special = [
    "1st",
    "2nd",
    "3rd",
    "4th",
    "5th",
    "6th",
    "7th",
    "8th",
    "9th",
    "10th",
    "11th",
    "12th",
    "13th",
    "14th",
    "15th",
    "16th",
    "17th",
    "18th",
    "19th",
    "20th",
  ];
  return special[n];
}

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
    "Eleventh",
    "Twelfth",
    "Thirteenth",
    "Fourteen",
    "Fifteenth",
    "Sixteenth",
    "Seventeenth",
    "Eighteenth",
    "Nineteenth",
    "Twentieth",
  ];
  return special[n];
}

export const ModalManageDataEdit = ({
  visible,
  onCancel,
  structure,
  onSubmit,
  parentId,
  countryStructure,
}) => {
  const t = localStorage.getItem("lan") || "en-US";
  const level = structure.level;
  const [name, setName] = useState();
  const [parent, setParent] = useState(null);
  const [tempAllStructure, setTempAllStructure] = useState([]);
  const [updateStructure, setUpdateStructure] = useState({
    companyCode: COMPANY_CODE,
    delete: [],
    add: [],
  });
  const [searchTable, setSearchTable] = useState("");
  const [parentDatasStructure, setParentDatasStructure] = useState([]);
  const [allParentData, setAllParentData] = useState([]);
  const [searchCurrency, setSearchCurrency] = useState("");

  const pagination = usePagination({
    page: 1,
    itemsPerPage: 20,
    maxPageItems: Infinity,
    numbers: true,
    arrows: true,
    totalItems: 100,
  });

  const { mutate: updateSalesOrganizationHirarcy } = useCreateSalesOrganizationHirarcy({
    options: {
      onSuccess: () => {},
      retry: true
    },
  });

  useSalesOrganizationHirarcy({
    structure_id: structure.id,
    options: {
      onSuccess: (data) => {
        setTempAllStructure(data);
        pagination.setTotalItems(data.length);
      },
      enabled: !!structure.id,
    },
    query: {
      search: searchTable,
    },
  });

  useSalesOrganizationHirarcy({
    structure_id: parentId,
    options: {
      onSuccess: (data) => {
        setAllParentData(data ?? []);
        setParentDatasStructure(
          data.map((data) => {
            let previousParentName = data?.hirarcies?.[1]?.name;
            let currentParentName = data?.name;
            let parentValue = previousParentName
              ? `${previousParentName} - ${currentParentName}`
              : currentParentName;
            return {
              id: data.id,
              value: parentValue,
              data: data,
            };
          })
        );
      },
      enabled: !!parentId,
    },
    query: {
      search: searchCurrency,
      limit: 10000,
    },
  });

  const onSaveHirarcy = () => {
    let updateStructureClone = _.cloneDeep(updateStructure);
    updateStructureClone.add = updateStructureClone.add.map((data) => {
      delete data.hirarcies;
      delete data.id;
      delete data.actionType;
      return data;
    });
    updateSalesOrganizationHirarcy(updateStructureClone);
    onSubmit();
  };

  const onAddStructure = () => {
    let parentData = allParentData.find((data) => data?.id === parent?.id);
    if (!parentData) {
      parentData = {
        hirarcies: [],
      };
    }
    const newData = {
      id: self.crypto.randomUUID(),
      name: name,
      ...(parent?.id && { parent: parent?.id }),
      hirarcies: [{ name }, ...(parentData && parentData.hirarcies)],
      structureId: structure.id,
      actionType: "NEW",
    };

    const newAllStructure = _.cloneDeep(tempAllStructure);
    newAllStructure.unshift(newData);
    setTempAllStructure(newAllStructure);
    setName("");
    setParent(null);

    let updateStructureClone = _.cloneDeep(updateStructure);
    updateStructureClone.add.push(newData);
    setUpdateStructure(updateStructureClone);
  };

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const columns = JSON.parse(JSON.stringify(countryStructure))
    .slice(0, level)
    .reverse()
    .map((country, index) => ({
      title: country.name,
      dataIndex: index + 1,
    }));

  let dataTable = [];
  const pageManageData = pagination?.page;
  const paginateAllStructure =
    tempAllStructure?.slice(5 * (pageManageData - 1), 6 * pageManageData) || [];

  paginateAllStructure?.forEach((data) => {
    let newData = data?.hirarcies?.reduce(
      (obj, item, index) => ({
        ...obj,
        [index + 1]: item.name,
      }),
      {}
    );
    newData.key = data?.id;
    dataTable.push(newData);
  });

  if (searchTable) {
    dataTable = dataTable.filter((data) =>
      data[1].toLowerCase().includes(searchTable.toLowerCase())
    );
  }

  let parentData = parentDatasStructure;
  if (searchCurrency) {
    parentData = parentData.filter((data) =>
      data.value.toLowerCase().includes(searchCurrency.toLowerCase())
    );
  }

  const onSelectChange = (selectedRowKeys) => {
    setSelectedRowKeys(selectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const deleteDataInStructure = () => {
    const newAllStructure = _.cloneDeep(tempAllStructure);
    newAllStructure = newAllStructure.filter((data) => !selectedRowKeys.includes(data.id));
    setTempAllStructure(newAllStructure);

    let updateStructureClone = _.cloneDeep(updateStructure);
    const isNaNRow = selectedRowKeys.filter((row) => isNaN(row));
    updateStructureClone.add = updateStructureClone.add.filter(
      (data) => !isNaNRow.includes(data.id)
    );
    updateStructureClone.delete.push(...selectedRowKeys.filter((row) => !isNaN(row)));
    setUpdateStructure(updateStructureClone);
  };

  const [showUploadTemplate, setShowUploadTemplate] = useState(false);

  const onUploadStructure = (data) => {
    const newData = [];
    if (level > 1) {
      data.forEach((data) => {
        let newEntries = Object.entries(data);
        const currentData = newEntries[2][1];
        const currentParentId = newEntries[0][1];

        const parentData = allParentData.find((data) => data?.id === currentParentId);
        const newSingleData = {
          id: self.crypto.randomUUID(),
          name: currentData,
          ...(parent?.id && { parent: currentParentId }),
          hirarcies: [{ name: currentData }, ...(parentData && parentData.hirarcies)],
          structureId: structure.id,
          actionType: "NEW",
        };
        newData.push(newSingleData);
      });
    } else {
      data.forEach((data) => {
        let newEntries = Object.entries(data);
        const currentData = newEntries[1][1];

        const newSingleData = {
          id: self.crypto.randomUUID(),
          name: currentData,
          hirarcies: [{ name: currentData }],
          structureId: structure.id,
          actionType: "NEW",
        };
        newData.push(newSingleData);
      });
    }

    const newAllStructure = _.cloneDeep(tempAllStructure);
    newAllStructure = newData;
    setTempAllStructure(newAllStructure);
    setName("");
    setParent(null);

    let updateStructureClone = _.cloneDeep(updateStructure);
    updateStructureClone.delete.push(...tempAllStructure.map((data) => data.id));
    updateStructureClone.add = newData;
    setUpdateStructure(updateStructureClone);
  };

  const donwloadStructure = async (value) => {
    return await axios
      .get(apiURL + `/sales-org/hirarcy/download/${structure.id}`, {
        responseType: "blob",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        var data = new Blob([response?.data], { type: "application / vnd. MS Excel" });
        var csvURL = window.URL.createObjectURL(data);
        var tempLink = document.createElement("a");
        tempLink.href = csvURL;
        tempLink.setAttribute("download", `manage_${stringifyNumberSpecial(level - 1)}_level.xlsx`);
        tempLink.click();
      });
  };

  const lists = [
    {
      name: lang[t].salesOrganization.ghost.downloadTemplate,
      icon: DownloadFile,
      onClick: () => {
        donwloadStructure();
      },
    },
    {
      name: lang[t].salesOrganization.ghost.uploadTemplate,
      icon: UploadFile,
      onClick: () => {
        setShowUploadTemplate(true);
      },
    },
  ];

  return (
    <Modal
      onCancel={onCancel}
      visible={visible}
      width="880px"
      title={`Manage ${structure.name}`}
      footer={
        <div
          style={{
            display: "flex",
            marginBottom: "12px",
            marginRight: "12px",
            justifyContent: "flex-end",
            gap: "12px",
          }}
        >
          <Button size="big" variant="secondary" key="submit" type="primary" onClick={onCancel}>
            {lang[t].salesOrganization.tertier.cancel}
          </Button>
          <Button variant="primary" size="big" onClick={onSaveHirarcy}>
            {`${lang[t].salesOrganization.primary.save}`}
          </Button>
        </div>
      }
      content={
        <>
          <Spacer size={22} />
          <Row width="100%" gap="16px" noWrap alignItems="flex-end" style={{ marginBottom: "5px" }}>
            <Input
              width="100%"
              label={`${t == "en-US" ? stringifyNumberSpecial(structure.level - 1) : ""} ${
                lang[t].salesOrganization.emptyState.levelName
              } ${
                t == "id-ID"
                  ? stringifyNumberSpecial(structure.level - 1).substring(
                      0,
                      stringifyNumberSpecial(structure.level - 1).length - 2
                    )
                  : ""
              }`}
              height="48px"
              placeholder={`e.g ${structure.name} Name`}
              onChange={(e) => setName(e.target.value)}
              value={name}
              //onChange={(e) => onChangeStructure(e, index)}
            />
            {level > 1 && (
              <Dropdown
                label={`${t == "en-US" ? stringifyNumberSpecial(structure.level - 2) : ""} ${
                  lang[t].salesOrganization.emptyState.levelName
                } ${
                  t == "id-ID"
                    ? stringifyNumberSpecial(structure.level - 2).substring(
                        0,
                        stringifyNumberSpecial(structure.level - 2).length - 2
                      )
                    : ""
                }`}
                width={"100%"}
                key={dataTable.length}
                items={parentData}
                placeholder={"Select"}
                onSearch={(search) => setSearchCurrency(search)}
                handleChange={(value) => setParent({ id: value })}
              />
            )}
            <Button disabled={!name} variant="primary" size="big" onClick={() => onAddStructure()}>
              {lang[t].salesOrganization.primary.add}
            </Button>
          </Row>

          <Spacer size={20} />

          <Divider />

          <Spacer size={20} />

          <Row width="100%" noWrap alignItems="center" gap="16px">
            <Search
              placeholder={`${lang[t].salesOrganization.searchBar.salesChannel} ${structure.name} Name`}
              onChange={(e) => setSearchTable(e.target.value)}
            />
            <ActionButton lists={lists} />
            <Button
              variant="tertiary"
              size="big"
              onClick={deleteDataInStructure}
              disabled={rowSelection.selectedRowKeys?.length === 0}
            >
              {lang[t].salesOrganization.tertier.delete}
            </Button>
          </Row>

          <Spacer size={20} />

          <Col gap="20px">
            <Table loading={false} columns={columns} data={dataTable} rowSelection={rowSelection} />
            {pagination.totalItems > 5 && <Pagination pagination={pagination} />}
          </Col>
          <Spacer size={38} />
          {showUploadTemplate && (
            <FileUploaderExcel
              visible={showUploadTemplate}
              setVisible={setShowUploadTemplate}
              onSubmit={onUploadStructure}
            />
          )}
        </>
      }
    />
  );
};

const Divider = styled.div`
  border: 1px dashed #dddddd;
`;
