import { useRouter } from "next/router";
import {
  Accordion,
  Button,
  Col,
  Dropdown,
  FormSelect,
  Input,
  Row,
  Spacer,
  Text,
  DatePickerInput,
} from "pink-lava-ui";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import styled from "styled-components";
import { useDepartmentInfiniteLists } from "../../hooks/mdm/department/useDepartment";
import { useCreateEmployeeListMDM } from "../../hooks/mdm/employee-list/useEmployeeListMDM";
import { useJobLevelInfiniteLists } from "../../hooks/mdm/job-level/useJobLevel";
import { useJobPositionInfiniteLists } from "../../hooks/mdm/job-position/useJobPositon";
import useDebounce from "../../lib/useDebounce";
import { queryClient } from "../_app";
import { colors } from "../../utils/color";
import { useLanguages } from "../../hooks/languages/useLanguages";

const EmployeeListCreate = () => {
  const router = useRouter();

  const [departmentList, setListDepartmentList] = useState<any[]>([]);
  const [totalRowsDepartmentList, setTotalRowsDepartmentList] = useState(0);
  const [searchDepartment, setSearchDepartment] = useState("");

  const [jobPositionList, setJobPositionList] = useState<any[]>([]);
  const [totalRowsJobPositionList, setTotalRowsJobPositionList] = useState(0);
  const [searchJobPosition, setSearchJobPosition] = useState("");

  const [jobLevelList, setJobLevelList] = useState<any[]>([]);
  const [totalRowsJobLevelList, setTotalRowsJobLevelList] = useState(0);
  const [searchJobLevel, setSearchJobLevel] = useState("");

  const debounceFetch = useDebounce(searchDepartment || searchJobPosition || searchJobLevel, 1000);

  const { register, control, handleSubmit } = useForm({ shouldUseNativeValidation: true });

  const {
    isFetching: isFetchingDepartment,
    isFetchingNextPage: isFetchingMoreDepartment,
    hasNextPage: hasNextPageDepartment,
    fetchNextPage: fetchNextPageDepartment,
  } = useDepartmentInfiniteLists({
    query: {
      search: debounceFetch,
      company_id: "KSNI",
      limit: 10,
    },
    options: {
      onSuccess: (data: any) => {
        setTotalRowsDepartmentList(data.pages[0].totalRow);
        const mappedData = data?.pages?.map((group: any) => {
          return group.rows?.map((element: any) => {
            return {
              value: element.departmentId,
              label: element.name,
            };
          });
        });
        const flattenArray = [].concat(...mappedData);
        setListDepartmentList(flattenArray);
      },
      getNextPageParam: (_lastPage: any, pages: any) => {
        if (departmentList.length < totalRowsDepartmentList) {
          return pages.length + 1;
        } else {
          return undefined;
        }
      },
    },
  });

  const {
    isFetching: isFetchingJobPosition,
    isFetchingNextPage: isFetchingMoreJobPosition,
    hasNextPage: hasNextPageJobPosition,
    fetchNextPage: fetchNextPageJobPosition,
  } = useJobPositionInfiniteLists({
    query: {
      search: debounceFetch,
      company_id: "KSNI",
      limit: 10,
    },
    options: {
      onSuccess: (data: any) => {
        setTotalRowsJobPositionList(data.pages[0].totalRow);
        const mappedData = data?.pages?.map((group: any) => {
          return group.rows?.map((element: any) => {
            return {
              value: element.jobPositionId,
              label: element.name,
            };
          });
        });
        const flattenArray = [].concat(...mappedData);
        setJobPositionList(flattenArray);
      },
      getNextPageParam: (_lastPage: any, pages: any) => {
        if (jobPositionList.length < totalRowsJobPositionList) {
          return pages.length + 1;
        } else {
          return undefined;
        }
      },
    },
  });

  const {
    isFetching: isFetchingJobLevel,
    isFetchingNextPage: isFetchingMoreJobLevel,
    hasNextPage: hasNextPageJobLevel,
    fetchNextPage: fetchNextPageJobLevel,
  } = useJobLevelInfiniteLists({
    query: {
      search: debounceFetch,
      company_id: "KSNI",
      limit: 10,
    },
    options: {
      onSuccess: (data: any) => {
        setTotalRowsJobLevelList(data.pages[0].totalRow);
        const mappedData = data?.pages?.map((group: any) => {
          return group.rows?.map((element: any) => {
            return {
              value: element.jobLevelId,
              label: element.name,
            };
          });
        });
        const flattenArray = [].concat(...mappedData);
        setJobLevelList(flattenArray);
      },
      getNextPageParam: (_lastPage: any, pages: any) => {
        if (jobLevelList.length < totalRowsJobLevelList) {
          return pages.length + 1;
        } else {
          return undefined;
        }
      },
    },
  });

  const { mutate: createEmployeeList, isLoading: isLoadingCreateEmployeeList } =
    useCreateEmployeeListMDM({
      options: {
        onSuccess: () => {
          router.back();
          queryClient.invalidateQueries(["employee-list"]);
        },
      },
    });

  const onSubmit = (data: any) => {
    const formData = {
      company_id: "KSNI",
      ...data,
    };
    console.log("@formData", formData);

    createEmployeeList(formData);
  };

  const { data: languageData } = useLanguages();

  const language = languageData?.rows?.map((row) => ({ id: row.id, value: row.name })) ?? [];

  return (
    <Col>
      <Row gap="4px">
        <Text variant={"h4"}>Create Employee</Text>
      </Row>

      <Spacer size={20} />

      <Card padding="20px">
        <Row justifyContent="space-between" alignItems="center" nowrap>
          <Controller
            control={control}
            name="employee_type"
            defaultValue={"FULLTIME"}
            render={({ field: { onChange } }) => (
              <Dropdown
                label=""
                width="185px"
                noSearch
                items={[{ id: "FULLTIME", value: "Fulltime" }]}
                defaultValue="FULLTIME"
                handleChange={(value: any) => {
                  onChange(value);
                }}
              />
            )}
          />

          <Row gap="16px">
            <Button size="big" variant={"tertiary"} onClick={() => router.back()}>
              Cancel
            </Button>
            <Button size="big" variant={"primary"} onClick={handleSubmit(onSubmit)}>
              {isLoadingCreateEmployeeList ? "Loading..." : "Save"}
            </Button>
          </Row>
        </Row>
      </Card>

      <Spacer size={20} />

      <Accordion>
        <Accordion.Item key={1}>
          <Accordion.Header variant="blue">General</Accordion.Header>
          <Accordion.Body>
            <Row width="100%" noWrap>
              <Col width={"100%"}>
                <Input
                  type="number"
                  width="100%"
                  label="NIK"
                  height="48px"
                  required
                  placeholder={"e.g 123456789"}
                  {...register("nik", { required: "Please enter NIK." })}
                />
              </Col>
              <Spacer size={10} />

              <Col width="100%">
                <Controller
                  control={control}
                  name="department"
                  render={({ field: { onChange } }) => (
                    <>
                      <Label>Department</Label>
                      <Spacer size={3} />
                      <FormSelect
                        style={{ width: "100%" }}
                        size={"large"}
                        placeholder={"Select"}
                        borderColor={"#AAAAAA"}
                        arrowColor={"#000"}
                        withSearch
                        isLoading={isFetchingDepartment}
                        isLoadingMore={isFetchingMoreDepartment}
                        fetchMore={() => {
                          if (hasNextPageDepartment) {
                            fetchNextPageDepartment();
                          }
                        }}
                        items={
                          isFetchingDepartment && !isFetchingMoreDepartment ? [] : departmentList
                        }
                        onChange={(value: any) => {
                          onChange(value);
                        }}
                        onSearch={(value: any) => {
                          setSearchDepartment(value);
                        }}
                      />
                    </>
                  )}
                />
              </Col>
            </Row>

            <Row width="100%" noWrap>
              <Col width="100%">
                <Controller
                  control={control}
                  name="job_position"
                  render={({ field: { onChange } }) => (
                    <>
                      <Label>Job Position</Label>
                      <Spacer size={3} />
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
                          if (hasNextPageJobPosition) {
                            fetchNextPageJobPosition();
                          }
                        }}
                        items={
                          isFetchingJobPosition && !isFetchingMoreJobPosition ? [] : jobPositionList
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
              <Spacer size={10} />

              <Col width="100%">
                <Controller
                  control={control}
                  name="job_level"
                  render={({ field: { onChange } }) => (
                    <>
                      <Label>Job Level</Label>
                      <Spacer size={3} />
                      <FormSelect
                        style={{ width: "100%" }}
                        size={"large"}
                        placeholder={"Select"}
                        borderColor={"#AAAAAA"}
                        arrowColor={"#000"}
                        withSearch
                        isLoading={isFetchingJobLevel}
                        isLoadingMore={isFetchingMoreJobLevel}
                        fetchMore={() => {
                          if (hasNextPageJobLevel) {
                            fetchNextPageJobLevel();
                          }
                        }}
                        items={isFetchingJobLevel && !isFetchingMoreJobLevel ? [] : jobLevelList}
                        onChange={(value: any) => {
                          onChange(value);
                        }}
                        onSearch={(value: any) => {
                          setSearchJobLevel(value);
                        }}
                      />
                    </>
                  )}
                />
              </Col>
            </Row>

            <Row width="100%" noWrap>
              <Col width="100%">
                <Controller
                  control={control}
                  name="report_to"
                  render={({ field: { onChange } }) => (
                    <>
                      <Label>Report to</Label>
                      <Spacer size={3} />
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
                          if (hasNextPageJobPosition) {
                            fetchNextPageJobPosition();
                          }
                        }}
                        items={
                          isFetchingJobPosition && !isFetchingMoreJobPosition ? [] : jobPositionList
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
              <Spacer size={10} />

              <Col width="100%">
                <Controller
                  control={control}
                  name="branch"
                  render={({ field: { onChange } }) => (
                    <>
                      <Label>
                        Branch <span style={{ color: colors.red.regular }}>*</span>
                      </Label>
                      <Spacer size={3} />
                      <FormSelect
                        style={{ width: "100%" }}
                        size={"large"}
                        placeholder={"Select"}
                        borderColor={"#AAAAAA"}
                        arrowColor={"#000"}
                        withSearch
                        isLoading={isFetchingJobLevel}
                        isLoadingMore={isFetchingMoreJobLevel}
                        fetchMore={() => {
                          if (hasNextPageJobLevel) {
                            fetchNextPageJobLevel();
                          }
                        }}
                        items={isFetchingJobLevel && !isFetchingMoreJobLevel ? [] : jobLevelList}
                        onChange={(value: any) => {
                          onChange(value);
                        }}
                        onSearch={(value: any) => {
                          setSearchJobLevel(value);
                        }}
                      />
                    </>
                  )}
                />
              </Col>
            </Row>

            <Row width="100%" noWrap>
              <Col width="100%">
                <Controller
                  control={control}
                  name="join_date"
                  render={({ field: { onChange } }) => (
                    <DatePickerInput
                      fullWidth
                      onChange={(date: any, dateString: any) => onChange(dateString)}
                      label="Join Date"
                    />
                  )}
                />
              </Col>
              <Spacer size={10} />

              <Col width="100%">
                <Controller
                  control={control}
                  name="resign_date"
                  render={({ field: { onChange } }) => (
                    <DatePickerInput
                      fullWidth
                      onChange={(date: any, dateString: any) => onChange(dateString)}
                      label="Join Date"
                    />
                  )}
                />
              </Col>
            </Row>

            <Row width="100%" noWrap>
              <Col width="100%">
                <Controller
                  control={control}
                  name="preferred_language"
                  render={({ field: { onChange } }) => (
                    <Dropdown
                      label="Language"
                      items={language}
                      width={"100%"}
                      placeholder={"Select"}
                      handleChange={onChange}
                      noSearch
                    />
                  )}
                />
              </Col>
              <Spacer size={10} />

              <Col width="100%">
                <Input
                  width="100%"
                  type="number"
                  label="Tax Number"
                  height="48px"
                  placeholder={"e.g 123456789 "}
                  {...register("external_code")}
                />
              </Col>
            </Row>

            <Row width="50%" noWrap>
              <Input
                width="100%"
                label="External Code"
                height="48px"
                placeholder={"e.g ABC12345"}
                {...register("external_code")}
              />
            </Row>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </Col>
  );
};

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

const Label = styled.div`
  font-weight: bold;
  font-size: 16px;
  line-height: 24px;
  color: #000000;
`;

export default EmployeeListCreate;
