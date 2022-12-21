import React, { useState, useMemo } from "react";
import { queryClient } from "../../_app";
import {
  Text,
  Col,
  Row,
  Spacer,
  Dropdown,
  Button,
  Accordion,
  Input,
  EmptyState,
} from "pink-lava-ui";
import { arrayMove } from "@dnd-kit/sortable";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/router";
import useDebounce from "../../../lib/useDebounce";
import ModalAddBusinessProcess from "../../../components/elements/Modal/ModalAddBusinessProcess";
import ModalEditProcess from "../../../components/elements/Modal/ModalEditProcess";
import { useProcessInfiniteLists } from "../../../hooks/business-process/useProcess";
import { useCreateBusinessProcess } from "../../../hooks/business-process/useBusinessProcess";
import DraggableTable from "../../../components/pages/BusinessProcess/DraggableTable";
import DraggableGrids from "../../../components/pages/BusinessProcess/DraggableGrid";

import styled from "styled-components";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

let schema = yup
.object({
	name: yup.string().required("Name is Required"),
})
.required();

import { lang } from "lang";
const CreateBusinessProcess = () => {
  const t = localStorage.getItem("lan") || "en-US";
  const router = useRouter();
  const [showAddProcessModal, setShowAddProcessModal] = useState(false);
  const [showEditProcessModal, setShowEditProcessModal] = useState(false);

  const [editModalData, setEditModalData] = useState<any>({});
  const [isMandatory, setMandatory] = useState("Is Mandatory");
  const [isActive, setIsActive] = useState("Active");
  const [value, setValue] = useState<any[]>([]);
  const [listItems, setListItems] = useState<any[]>([]);
  const [processList, setProcessList] = useState<any[]>([]);
  const [totalRows, setTotalRows] = useState(0);
  const [search, setSearch] = useState("");
  const debounceFetch = useDebounce(search, 1000);

  const { register, handleSubmit, control, 
		formState: { errors },
	} = useForm({
		resolver: yupResolver(schema),
	});

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

  const { mutate: createBusinessProcess, isLoading: isLoadingCreateBusinessProcess } =
    useCreateBusinessProcess({
      options: {
        onSuccess: () => {
          router.back();
          queryClient.invalidateQueries(["bprocess"]);
        },
      },
    });

  /** Key Identifier untuk sortable array ketika di drag */
  const keyItems = useMemo(() => processList.map(({ key }) => key), [processList]);

  const onHandleDrag = (activeId: any, overId: any) => {
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
          index,
          id: findProcessList.id,
          name: findProcessList.name,
          is_mandatory: findProcessList.is_mandatory,
          status: findProcessList.status,
        };
      } else {
        return {
          key: `${index}`,
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
    const mappedProcessListRequest = processList.map((el: any) => {
      return {
        id: el.id,
        is_mandatory: el.is_mandatory === "Is Mandatory",
        status: el.status === "ACTIVE" ? "Y" : "N",
      };
    });

    createBusinessProcess({ ...data, processes: mappedProcessListRequest });
  };

  return (
    <>
      <Col>
        <Row gap="4px">
          <Text variant="h4">{lang[t].businessProcess.modalTitleCreate.businessProcess}</Text>
        </Row>
        <Spacer size={20} />

        <Card>
          <Row justifyContent="space-between" alignItems="center" nowrap>
            <Controller
              control={control}
              name="status"
              defaultValue={"DRAFT"}
              render={({ field: { onChange } }) => (
                <Dropdown
                  label=""
                  width="185px"
                  noSearch
                  items={[
                    { id: "DRAFT", value: lang[t].businessProcess.ghost.draft },
                    { id: "PUBLISH", value: lang[t].businessProcess.ghost.published },
                  ]}
                  defaultValue="DRAFT"
                  placeholder={"Select"}
                  handleChange={(value: any) => {
                    onChange(value);
                  }}
                />
              )}
            />

            <Row gap="16px">
              <Button size="big" variant={"tertiary"} onClick={() => router.back()}>
                {lang[t].businessProcess.tertier.cancel}
              </Button>
              <Button size="big" variant={"primary"} onClick={handleSubmit(onSubmit)}>
                {isLoadingCreateBusinessProcess ? "Loading..." : lang[t].businessProcess.primary.save}
              </Button>
            </Row>
          </Row>
        </Card>

        <Spacer size={20} />

        <Accordion>
          <Accordion.Item key={1}>
            <Accordion.Header variant="blue">{lang[t].businessProcess.accordion.general}</Accordion.Header>
            <Accordion.Body>
              <Row width="100%">
                <Input
                  id="name"
                  width="100%"
                  label={lang[t].businessProcess.emptyState.name}
                  height="48px"
									error={errors?.name?.message}
                  required
                  placeholder={lang[t].businessProcess.pageTitle.ordertoCash}
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
                    <Text variant="h5">Visualization</Text>

                    <Spacer size={20} />

                    <DraggableGrids processList={processList} onDrag={onHandleDrag} />
                  </VisualizationContainer>

                  <Spacer size={20} />

                  <DraggableTable
                    processList={processList}
                    isLoading={false}
                    onDrag={onHandleDrag}
                    onEdit={(data: any) => {
                      setShowEditProcessModal(true);
                      setEditModalData(data);
                    }}
                    onDelete={(data: any) => {
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
                    subtitle={"Press Add Process First"}
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
          processList={processList}
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
  padding: ${(p: any) => (p.padding ? p.padding : "16px")};
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

export default CreateBusinessProcess;
