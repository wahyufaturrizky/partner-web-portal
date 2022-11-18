import React, { useState, useMemo } from "react";
import {
  Text,
  Col,
  Spin,
  Row,
  Spacer,
  Dropdown,
  Button,
  Accordion,
  Input,
  EmptyState,
} from "pink-lava-ui";
import { useForm, Controller } from "react-hook-form";
import { arrayMove } from "@dnd-kit/sortable";
import styled from "styled-components";
import { useRouter } from "next/router";
import {
  useBusinessProcess,
  useUpdateBusinessProcess,
  useDeleteBusinessProcess,
} from "../../hooks/business-process/useBusinessProcess";
import { queryClient } from "../_app";
import ArrowLeft from "../../assets/icons/arrow-left.svg";
import { ModalDeleteConfirmation } from "../../components/elements/Modal/ModalConfirmationDelete";
import { useProcessInfiniteLists } from "../../hooks/business-process/useProcess";
import useDebounce from "../../lib/useDebounce";
import ModalAddBusinessProcess from "../../components/elements/Modal/ModalAddBusinessProcess";
import ModalEditProcess from "../../components/elements/Modal/ModalEditProcess";
import DraggableTable from "../../components/pages/BusinessProcess/DraggableTable";
import DraggableGrids from "../../components/pages/BusinessProcess/DraggableGrid";
import { lang } from "lang";

const BussinessProcessDetail = () => {
  const t = localStorage.getItem("lan") || "en-US";
  const router = useRouter();
  const { bussiness_process_id: bp_id } = router.query;

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddProcessModal, setShowAddProcessModal] = useState(false);
  const [showEditProcessModal, setShowEditProcessModal] = useState(false);
  const [editModalData, setEditModalData] = useState<any>({});
  const [isMandatory, setMandatory] = useState("Is Mandatory");
  const [isActive, setIsActive] = useState("Active");
  const [value, setValue] = useState<any[]>([]);
  const [listItems, setListItems] = useState<any[]>([]);
  const [processList, setProcessList] = useState<any[]>([]);
  const [processListTemp, setProcessListTemp] = useState<any[]>([]);
  const [totalRows, setTotalRows] = useState(0);
  const [search, setSearch] = useState("");
  const debounceFetch = useDebounce(search, 1000);

  const { register, handleSubmit, control } = useForm();

  const {
    isFetching: isFetchingProcess,
    isFetchingNextPage: isFetchingMoreProcess,
    hasNextPage,
    fetchNextPage,
  } = useProcessInfiniteLists({
    query: {
      search: debounceFetch,
      limit: 10,
    },
    options: {
      onSuccess: (data: any) => {
        setTotalRows(data.pages[0].totalRow);
        const mappedData = data?.pages?.map((group: any) => {
          return group.rows?.map((element: any) => {
            return {
              label: element.name,
              value: element.id,
            };
          });
        });
        const flattenArray = [].concat(...mappedData);
        setListItems(flattenArray);
      },
      getNextPageParam: (_lastPage: any, pages: any) => {
        if (listItems.length < totalRows) {
          return pages.length + 1;
        } else {
          return undefined;
        }
      },
    },
  });

  const { mutate: deleteBusinessProcess, isLoading: isLoadingDeleteBP } = useDeleteBusinessProcess({
    options: {
      onSuccess: () => {
        queryClient.invalidateQueries(["bprocesses"]);
        setShowDeleteModal(false);
        router.back();
      },
    },
  });

  const {
    data: businessProcessData,
    isLoading: isLoadingBP,
    isFetching: isFetchingBP,
  } = useBusinessProcess({
    id: bp_id,
    options: {
      onSuccess: (data: any) => {
        const mappedToListProcessList = data.businessProcessToProcesses.map(
          (element: any, index: any) => {
            return {
              key: `${index}`,
              bp_id: element.id,
              index,
              id: element.process.id,
              name: element.process.name,
              is_mandatory: element.isMandatory ? "Is Mandatory" : "Not Mandatory",
              status: element.status === "Y" ? "ACTIVE" : "INACTIVE",
            };
          }
        );
        setProcessList(mappedToListProcessList);
        setProcessListTemp(mappedToListProcessList);
      },
    },
  });

  const { mutate: updateBusinessProcess, isLoading: isLoadingUpdateBusinessProcess } =
    useUpdateBusinessProcess({
      id: bp_id,
      options: {
        onSuccess: () => {
          router.back();
          queryClient.invalidateQueries(["bprocess"]);
        },
      },
    });

  /** Key Identifier untuk sortable array ketika di drag */
  const keyItems = useMemo(() => processList.map(({ key }) => key), [processList]);

  const onHandleDrag = (activeId, overId) => {
    setProcessList((data) => {
      const oldIndex = keyItems.indexOf(activeId);
      const newIndex = keyItems.indexOf(overId);
      const changeSequenceProcessList = arrayMove(data, oldIndex, newIndex).map((el, index) => {
        return {
          ...el,
          index,
        };
      });
      const changeSequenceDropdownList = changeSequenceProcessList.map((el) => ({
        label: el.name,
        value: el.id,
      }));

      setValue(changeSequenceDropdownList);
      return changeSequenceProcessList;
    });
  };

  const addProcessList = () => {
    const mappedProcessList = value.map((el: any, index) => {
      const findProcessList = processList.find((process) => process.id === el.value);

      if (!!findProcessList) {
        return {
          key: `${index}`,
          bp_id: findProcessList.bp_id ? findProcessList.bp_id : null,
          index,
          id: findProcessList.id,
          name: findProcessList.name,
          is_mandatory: findProcessList.is_mandatory,
          status: findProcessList.status,
        };
      } else {
        return {
          key: `${index}`,
          bp_id: null,
          index,
          id: el.value,
          name: el.label,
          is_mandatory: isMandatory,
          status: isActive.toUpperCase(),
        };
      }
    });
    let newProcessList = 
    [...processList, ...mappedProcessList].map((data, index) => 
      ({ ...data, index }));

    setProcessList(newProcessList);
    setShowAddProcessModal(false);
    setMandatory("Is Mandatory")
    setIsActive("Active")
    setValue([])

  };

  const editProcessList = () => {
    const mappedProcessList = processList.map((el: any, index: any) => {
      if (editModalData.id === el.id) {
        return {
          key: `${index}`,
          bp_id: el.bp_id,
          index,
          id: el.id,
          name: el.name,
          is_mandatory: isMandatory,
          status: isActive.toUpperCase(),
        };
      } else {
        return el;
      }
    });
    setProcessList(mappedProcessList);
    setShowEditProcessModal(false);
  };

  const onSubmit = (data: any) => {
    const mappedRemovedProcessList: any[] = [];
    const mappedAddProcessList: any[] = [];
    const mappedUpdateProcessList: any[] = [];

    processList.map((el: any, index: any) => {
      const isSameIndex = processListTemp.filter((value) => value.index === el.index);
      if (isSameIndex.length > 0 && el.bp_id === null) {
        mappedAddProcessList.push({
          process_id: el.id,
          index,
          is_mandatory: el.is_mandatory === "Is Mandatory",
          status: el.status === "ACTIVE" ? "Y" : "N",
        });

        const updatedIndex = processList.filter((value) => value.bp_id === isSameIndex[0].bp_id);
        mappedUpdateProcessList.push({
          id: updatedIndex[0].bp_id,
          is_mandatory: updatedIndex[0].is_mandatory === "Is Mandatory",
          index: updatedIndex[0].index,
          status: updatedIndex[0].status === "ACTIVE" ? "Y" : "N",
        });
      } else if (el.bp_id === null) {
        mappedAddProcessList.push({
          process_id: el.id,
          index,
          is_mandatory: el.is_mandatory === "Is Mandatory",
          status: el.status === "ACTIVE" ? "Y" : "N",
        });
      }
    });

    processListTemp.map((el) => {
      const checkIfIdExist = processList.filter((value) => value.bp_id === el.bp_id);

      if (!(checkIfIdExist.length > 0)) {
        mappedRemovedProcessList.push({
          id: el.bp_id,
        });
      } else {
        const isSameIndex = processList.filter((value) => value.index === el.index);
        if (
          (el.index !== checkIfIdExist[0].index && isSameIndex[0]?.bp_id !== null) ||
          el.is_mandatory !== checkIfIdExist[0].is_mandatory ||
          el.status !== checkIfIdExist[0].status
        ) {
          mappedUpdateProcessList.push({
            id: el.bp_id,
            is_mandatory: checkIfIdExist[0].is_mandatory === "Is Mandatory",
            index: checkIfIdExist[0].index,
            status: checkIfIdExist[0].status === "ACTIVE" ? "Y" : "N",
          });
        }
      }
    });

    const requestData = {
      ...data,
      remove_bp: mappedRemovedProcessList,
      update_bp: mappedUpdateProcessList,
      add_process: mappedAddProcessList,
    };

    updateBusinessProcess(requestData);
  };

  if (isLoadingBP || isFetchingBP)
    return (
      <Center>
        <Spin tip="Loading data..." />
      </Center>
    );

  return (
    <>
      <Col>
        <Row gap="4px" alignItems="center">
          <ArrowLeft style={{ cursor: "pointer" }} onClick={() => router.back()} />
          <Text variant="h4">{businessProcessData.name}</Text>
        </Row>
        <Spacer size={20} />
        <Card padding="20px">
          <Row justifyContent="space-between" alignItems="center" nowrap>
            <Controller
              control={control}
              name="status"
              defaultValue={businessProcessData.status}
              render={({ field: { onChange } }) => (
                <Dropdown
                  label=""
                  width="185px"
                  noSearch
                  defaultValue={businessProcessData.status}
                  items={[
                    { id: "DRAFT", value: lang[t].businessProcess.ghost.draft },
                    { id: "PUBLISH", value: lang[t].businessProcess.ghost.published },
                  ]}
                  placeholder={"Select"}
                  handleChange={(value: any) => {
                    onChange(value);
                  }}
                />
              )}
            />

            <Row gap="16px">
              <Button size="big" variant={"tertiary"} onClick={() => setShowDeleteModal(true)}>
                Delete
              </Button>
              <Button size="big" variant={"primary"} onClick={handleSubmit(onSubmit)}>
                {isLoadingUpdateBusinessProcess ? "...Loading" : lang[t].businessProcess.primary.save}
              </Button>
            </Row>
          </Row>
        </Card>

        <Spacer size={20} />

        <Accordion>
          <Accordion.Item key={1}>
            <Accordion.Header variant="blue">{lang[t].businessProcess.accordion.general}</Accordion.Header>
            <Accordion.Body>
              <Row>
                <Input
                  id="name"
                  width="100%"
                  label={lang[t].businessProcess.emptyState.name}
                  height="48px"
                  required
                  placeholder={lang[t].businessProcess.pageTitle.ordertoCash}
                  defaultValue={businessProcessData.name}
                  {...register("name")}
                />
              </Row>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>

        <Spacer size={20} />

        <Accordion>
          <Accordion.Item key={1}>
            <Accordion.Header variant="blue">{lang[t].businessProcess.accordion.processes}</Accordion.Header>
            <Accordion.Body>
              {!!processList.length ? (
                <>
                  <Button
                    size="big"
                    variant={"primary"}
                    onClick={() => setShowAddProcessModal(true)}
                  >
                    Add Process
                  </Button>

                  <Spacer size={10} />

                  <Separator />

                  <Spacer size={20} />

                  <VisualizationContainer>
                    <Text variant="h5">{lang[t].businessProcess.process.visualization}</Text>

                    <Spacer size={20} />

                    <DraggableGrids processList={processList} onDrag={onHandleDrag} />
                  </VisualizationContainer>

                  <Spacer size={20} />

                  <DraggableTable
                    processList={processList}
                    isLoading={isLoadingBP || isFetchingBP}
                    onDrag={onHandleDrag}
                    onEdit={(data) => {
                      setShowEditProcessModal(true);
                      setEditModalData(data);
                    }}
                    onDelete={(data) => {
                      const filterProcessList = processList.filter(
                        (process) => process.id !== data.id
                      );

                      const mappedProcessList = filterProcessList.map((el, index) => {
                        return {
                          ...el,
                          index,
                        };
                      });

                      const filterDropdownValue = value.filter((value) => value.value !== data.id);
                      setProcessList(mappedProcessList);
                      setValue(filterDropdownValue);
                    }}
                  />
                </>
              ) : (
                <>
                  <EmptyState
                    image={"/icons/empty-state.svg"}
                    title={"No Data Company List"}
                    description={"Press Add Process First"}
                    height={325}
                  />
                  <Spacer size={10} />
                  <Center>
                    <Button
                      size="big"
                      variant={"primary"}
                      onClick={() => setShowAddProcessModal(true)}
                    >
                      Add Process
                    </Button>
                  </Center>
                </>
              )}
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Col>

      {showAddProcessModal && (
        <ModalAddBusinessProcess
          visible={showAddProcessModal}
          onCancel={() => setShowAddProcessModal(false)}
          onSave={addProcessList}
          dropdownValue={value}
          isLoading={isFetchingProcess}
          isLoadingMore={isFetchingMoreProcess}
          dropdownList={listItems}
          fetchMore={() => {
            if (hasNextPage) {
              fetchNextPage();
            }
          }}
          onSearch={(value: any) => {
            setSearch(value);
          }}
          onChange={(value: any) => {
            setValue(value);
            setSearch("");
          }}
          selectedValue={value}
          onClear={() => {
            setSearch("");
          }}
          mandatoryValue={isMandatory}
          onChangeMandatory={(value: any) => {
            setMandatory(value);
          }}
          statusValue={isActive}
          onChangeActive={(value: any) => {
            setIsActive(value);
          }}
        />
      )}

      {showEditProcessModal && (
        <ModalEditProcess
          visible={showEditProcessModal}
          onCancel={() => setShowEditProcessModal(false)}
          onSave={editProcessList}
          processName={editModalData?.name}
          mandatoryValue={editModalData.is_mandatory}
          onChangeMandatory={(value: any) => setMandatory(value)}
          statusValue={editModalData.status.toLowerCase()}
          onChangeStatus={(value: any) => setIsActive(value)}
        />
      )}

      {showDeleteModal && (
        <ModalDeleteConfirmation
          totalSelected={1}
          itemTitle={businessProcessData.name}
          visible={showDeleteModal}
          isLoading={isLoadingDeleteBP}
          onCancel={() => setShowDeleteModal(false)}
          onOk={() => deleteBusinessProcess({ ids: [bp_id] })}
        />
      )}
    </>
  );
};

const VisualizationContainer = styled.div`
  background: #ffffff;
  border-radius: 16px;
  box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
  padding: 16px;
  cursor: pointer;
`;

const Card = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: ${(p) => (p.padding ? p.padding : "16px")};
`;

const Center = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Separator = styled.div`
  display: block;
  height: 0;
  border-bottom: 1px dashed #aaaaaa;
`;

export default BussinessProcessDetail;
