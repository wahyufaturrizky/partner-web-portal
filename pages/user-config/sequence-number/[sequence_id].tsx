import React, { useEffect, useState } from "react";
import Router, { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { Text, Col, Row, Spacer, Button, Input, Search, Checkbox } from "pink-lava-ui";

import ArrowLeft from "../../../assets/icons/arrow-left.svg";
import AddSequenceNumber from "../../../components/pages/SequenceNumber/AddSequenceNumber";
import {
  useSequenceNumber,
  useUpdateSequenceNumber,
} from "../../../hooks/sequence-number/useSequenceNumber";

const DetailSequenceNumber: any = () => {
  const router = useRouter();
  const companyId = localStorage.getItem("companyId")
  const companyCode = localStorage.getItem("companyCode")
  const { sequence_id } = router.query;

  const [search, setSearch] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [isAdd, setIsAdd] = useState(true);
  const [listData, setListData] = useState([]);
  const [selected, setSelected] = useState();
  const [selectedData, setSelectedData] = useState();

  const [incCompany, setIncCompany] = useState(false);
  const [incBranch, setIncBranch] = useState(false);
  const [periodMonth, setPeriodMonth] = useState(false);
  const [periodYear, setPeriodYear] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    // resolver: yupResolver(schema),
    // defaultValues: defaultValue,
  });

  const { data: field, isLoading: isLoadingData, refetch: refetchField } = useSequenceNumber({
    id: sequence_id,
    options: {
      onSuccess: (data: any) => {
        // console.log(data, "data response");
        let newListData = [];
        data.map((item, idx) => {
          if (idx == 0) setSelected(item.id);
          newListData.push(item);
        });
        setListData(newListData);
      },
    },
    query: {
      search,
      company_id: companyId,
    },
  });

  const { mutate: updateSequence } = useUpdateSequenceNumber({
    id: selected,
    options: {
      onSuccess: (data) => {
        refetchField()
        alert('Success Updating Data')
        setIsEdit(false)
      },
    },
  });

  useEffect(() => {
    if (selected) {
      const filtered = field.filter((f) => f.id == selected);
      console.log(filtered[0], "Filtereed");
      setValue("sequence_code", filtered[0].sequenceCode);
      setValue("prefix", filtered[0].prefix);
      setValue("suffix", filtered[0].suffix);
      setValue("digit_size", filtered[0].digitSize);
      setValue("separator", filtered[0].separator);
      setValue("start_number", filtered[0].startNumber);
      setValue("next_number", filtered[0].nextNumber);
      const isCompany = filtered[0].include.includes("COMPANY");
      setIncCompany(isCompany);
      const isBranch = filtered[0].include.includes("BRANCH");
      setIncBranch(isBranch);
      const isPerMonth = filtered[0].periodicallyUpdate.includes("MONTH");
      setPeriodMonth(isPerMonth);
      const isPerYear = filtered[0].periodicallyUpdate.includes("YEAR");
      setPeriodYear(isPerYear);
      setSelectedData(filtered[0]);
    }
  }, [selected]);

  const onSubmit = (data: any) => {
    let include = [];
    incCompany && include.push("COMPANY");
    incBranch && include.push("BRANCH");

    let periodically_update = [];
    periodMonth && periodically_update.push("MONTH");
    periodYear && periodically_update.push("YEAR");

    const payload = {
      ...data,
      company_id: companyId,
      include: include,
      periodically_update: periodically_update,
      // parent_id: `1${data.branch_id != undefined ? data.branch_id : ""}`,
      name: selectedData.name,
      process_id: selectedData.processId,
      branch_id: selectedData.branchId,
    };
    // console.log(payload, "payload");
    updateSequence(payload)
  };

  return (
    <>
      {isAdd ? (
        <Col>
          <Row gap="16px" justifyContent="flex" alignItems="center">
            <ArrowLeft style={{ cursor: "pointer" }} onClick={() => Router.back()} />
            {/* <Text variant={"h4"}>{sequence_id}</Text> */}
            <Text variant={"h4"}>
              {!isLoadingData && field[0].branchName ? field[0].branchName : "-"}
            </Text>
          </Row>
          <Spacer size={12} />
          <Card>
            <Row width="100%" noWrap>
              <Col width="25%" style={{ borderRight: "3px solid #f0f2f5" }}>
                <Row style={{ padding: "12px" }}>
                  <Search placeholder="Search" onChange={(e: any) => setSearch(e.target.value)} />
                </Row>
                <Spacer size={10} />
                <Row style={{ padding: "12px" }}>
                  <Text
                    clickable
                    variant={"label"}
                    color={"red.regular"}
                    onClick={() => setIsAdd(!isAdd)}
                  >
                    + Add Sequence
                  </Text>
                </Row>
                <Row>
                  <ListItem>
                    {!isLoadingData &&
                      listData.map((item) => (
                        <ListItemChild
                          className={`${selected == item.id ? "active" : ""}`}
                          key={item.id}
                          onClick={() => setSelected(item.id)}
                        >
                          {item.name}
                        </ListItemChild>
                      ))}
                  </ListItem>
                </Row>
              </Col>
              <Col width="75%" style={{ padding: "12px" }}>
                <Row justifyContent={"flex-end"}>
                  {!isEdit ? (
                    <Button size="big" variant={"primary"} onClick={() => setIsEdit(!isEdit)}>
                      Edit
                    </Button>
                  ) : (
                    // <Button size="big" variant={"primary"} onClick={() => setIsEdit(!isEdit)}>
                    <Button size="big" variant={"primary"} onClick={handleSubmit(onSubmit)}>
                      Save
                    </Button>
                  )}
                </Row>
                <Spacer size={12} />
                <Row>
                  <Input
                    width="100%"
                    label="Sequence Code Preview"
                    height="48px"
                    placeholder={"e.g"}
                    disabled={isEdit ? false : true}
                    {...register("sequence_code", { required: true })}
                    defaultValue={selectedData?.sequenceCode}
                  />
                </Row>
                <Spacer size={20} />

                <Row width="100%">
                  <Col>
                    <Row>
                      <Label>Include</Label>
                    </Row>
                    <Spacer size={10} />

                    <Row style={{ marginRight: "12px" }} alignItems="center" gap="12px">
                      <Row>
                        <Checkbox
                          checked={incCompany}
                          disabled={isEdit ? false : true}
                          onChange={(checked: any) => setIncCompany(checked)}
                        />

                        <Text variant={"h6"} bold>
                          Company
                        </Text>
                      </Row>
                      <Row>
                        <Checkbox
                          checked={incBranch}
                          disabled={isEdit ? false : true}
                          onChange={(checked: any) => setIncBranch(checked)}
                        />
                        <Text variant={"h6"} bold>
                          Branch
                        </Text>
                      </Row>
                    </Row>
                  </Col>
                  <Spacer size={20} />
                  <Col>
                    <Row>
                      <Label>Periodically Updated</Label>
                    </Row>
                    <Spacer size={10} />

                    <Row style={{ marginRight: "12px" }} alignItems="center" gap="12px">
                      <Row>
                        <Checkbox
                          checked={periodMonth}
                          disabled={isEdit ? false : true}
                          onChange={(checked: any) => setPeriodMonth(checked)}
                        />

                        <Text variant={"h6"} bold>
                          Month
                        </Text>
                      </Row>
                      <Row>
                        <Checkbox
                          checked={periodYear}
                          disabled={isEdit ? false : true}
                          onChange={(checked: any) => setPeriodYear(checked)}
                        />
                        <Text variant={"h6"} bold>
                          Year
                        </Text>
                      </Row>
                    </Row>
                  </Col>
                </Row>

                <Spacer size={12} />

                <Row>
                  <Row width="100%" alignItems="center">
                    <Col width="15%">
                      <Text variant="headingSmall">Prefix</Text>
                    </Col>
                    <Col width="85%">
                      <Input
                        width="100%"
                        label=""
                        height="48px"
                        placeholder={"e.g"}
                        disabled={isEdit ? false : true}
                        defaultValue={selectedData?.prefix}
                        {...register("prefix")}
                      />
                    </Col>
                  </Row>
                </Row>
                <Row>
                  <Row width="100%" alignItems="center">
                    <Col width="15%">
                      <Text variant="headingSmall">Suffix</Text>
                    </Col>
                    <Col width="85%">
                      <Input
                        width="100%"
                        label=""
                        height="48px"
                        placeholder={"e.g"}
                        disabled={isEdit ? false : true}
                        defaultValue={selectedData?.suffix}
                        {...register("suffix")}
                      />
                    </Col>
                  </Row>
                </Row>
                <Row>
                  <Row width="100%" alignItems="center">
                    <Col width="15%">
                      <Text variant="headingSmall">Digit Size</Text>
                    </Col>
                    <Col width="85%">
                      <Input
                        width="100%"
                        label=""
                        height="48px"
                        placeholder={"e.g"}
                        disabled={isEdit ? false : true}
                        defaultValue={selectedData?.digitSize}
                        {...register("digit_size")}
                      />
                    </Col>
                  </Row>
                </Row>
                <Row>
                  <Row width="100%" alignItems="center">
                    <Col width="15%">
                      <Text variant="headingSmall">Separator</Text>
                    </Col>
                    <Col width="85%">
                      <Input
                        width="100%"
                        label=""
                        height="48px"
                        placeholder={"e.g"}
                        disabled={isEdit ? false : true}
                        defaultValue={selectedData?.separator}
                        {...register("separator")}
                      />
                    </Col>
                  </Row>
                </Row>
                <Row>
                  <Row width="100%" alignItems="center">
                    <Col width="15%">
                      <Text variant="headingSmall">Start Number</Text>
                    </Col>
                    <Col width="85%">
                      <Input
                        width="100%"
                        label=""
                        height="48px"
                        placeholder={"e.g"}
                        disabled={isEdit ? false : true}
                        defaultValue={selectedData?.startNumber}
                        {...register("start_number")}
                      />
                    </Col>
                  </Row>
                </Row>
                <Row>
                  <Row width="100%" alignItems="center">
                    <Col width="15%">
                      <Text variant="headingSmall">Next Number</Text>
                    </Col>
                    <Col width="85%">
                      <Input
                        width="100%"
                        label=""
                        height="48px"
                        placeholder={"e.g"}
                        disabled={isEdit ? false : true}
                        defaultValue={selectedData?.nextNumber}
                        {...register("next_number")}
                      />
                    </Col>
                  </Row>
                </Row>
              </Col>
            </Row>
          </Card>
        </Col>
      ) : (
        <AddSequenceNumber onBack={() => setIsAdd(!isAdd)} dataParent={field[0]} />
      )}
    </>
  );
};

const Center = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Card = styled.div`
  background: #ffffff;
  border-radius: 16px;
`;

const Label = styled.div`
  font-weight: 700;
  font-size: 16px;
  line-height: 24px;
  color: #000000;
`;

const ListItem = styled.ul`
  list-style-type: none;
  width: 100%;
  margin: 0;
  padding: 0;
`;

const ListItemChild = styled.li`
  font-weight: 700;
  font-size: 14px;
  padding: 20px;
  width: 100%;
  &:active {
    background: #fde6f3;
    border-left: 5px solid red;
  }
  &:hover {
    cursor: pointer;
  }
`;

export default DetailSequenceNumber;
