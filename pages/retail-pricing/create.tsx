import React, { useState } from "react";
import {
  Text,
  Col,
  Row,
  Spacer,
  Button,
  Accordion,
  Input,
  Table
} from "pink-lava-ui";
import styled from "styled-components";
import ArrowLeft from "../../assets/icons/arrow-left.svg";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import ModalAddRetailPricing from "components/elements/Modal/ModalAddRetailPricing";
import { ICDelete, ICEdit } from "../../assets";
import { useRouter } from "next/router";
import _ from "lodash";
import moment from "moment";
import { useCreateRetailPricing } from "hooks/mdm/retail-pricing/useRetailPricingList";
import Conditions from "components/pages/RetailPricing/fragments/Conditions";

const CreateRetailPricing: any = () => {
  const router = useRouter();

  const {
    register,
    control,
    handleSubmit,
    setValue,
  } = useForm({
    defaultValues: {
      name: '',
      availability: [{ based_on: "" }],
      rules: []
    },
  });

  const availabilityWatch = useWatch({
    name: "availability",
    control,
  });

  const {
    fields: fieldRules,
    append: appendRules,
    update: updateRules,
    remove: removeRules,
  } = useFieldArray({
    control,
    name: "rules"
  });

  const columns = [
    {
      title: "key",
      dataIndex: "key",
    },
    {
      title: "Action",
      dataIndex: "action",
      width: "15%",
      align: "left",
      render: (_, record, index) => {
        return (
          <Row gap="16px" alignItems="center" nowrap>
            <Col>
              <ICEdit
                style={{cursor: 'pointer'}}
                onClick={() => {
                  setShowModalRules({
                    visibility: true,
                    tempRule: fieldRules[index],
                    index: index
                  })
                }}
              />
            </Col>
            <Col>
              <ICDelete
                style={{cursor: 'pointer'}}
                onClick={() =>{
                  removeRules(index)
                }}
              />
            </Col>
          </Row>
        );
      },
    },
    {
      title: "Price Computation",
      dataIndex: "price_computation",
    },
    {
      title: "Apply On",
      dataIndex: "apply_on",
    },
    {
      title: "Minimum Quantity",
      dataIndex: "min_qty",
    },
    {
      title: "Price",
      dataIndex: "value",
    },
    {
      title: "Validity Date",
      dataIndex: "valid_date",
    },
  ];

  const rulesWatch = useWatch({
    name: "rules",
    control,
  });

  const [showModalRules, setShowModalRules] = useState({
    visibility: false,
    tempRule: null,
    index: null
  })

  const getValue = (data:any) => {
    if (data.price_computation !== 'FORMULA'){
      return data.value;
    } else {
      return `Min Margin ${data.margin_max} and Max Margin ${data.margin_min}`
    }
  }

  const rulesTable = rulesWatch.map((data:any) => ({
    price_computation: _.startCase(_.toLower(data.price_computation)),
    apply_on:  _.startCase(_.toLower(data.apply_on)),
    min_qty: data.min_qty,
    value: getValue(data),
    valid_date: data?.valid_date?.map((date:any) => moment(date).format('DD/MM/YYYY'))?.join(" - ") || ''
  }))

  const { mutate: createRetailPricing } = useCreateRetailPricing({
		options: {
			onSuccess: () => {
				router.push('/retail-pricing')
			},
		},
	});

  const onSubmit = (data:any) => {
    createRetailPricing(data);
  }

  return (
    <>
      <Col>
        <Row gap="4px" alignItems="center">
          <ArrowLeft style={{ cursor: "pointer" }} onClick={() => router.back()} />
          <Text variant={"h4"}>Create Retail Pricing</Text>
        </Row>
        <Spacer size={12} />
        <Card padding="20px">
          <Row justifyContent="end" alignItems="center" nowrap gap="12px">
            <Button size="big" variant={"tertiary"} onClick={() => router.back()}>
              Cancel
            </Button>
            <Button
              size="big"
              variant={"primary"}
              onClick={handleSubmit(onSubmit)}
            >
              Save
            </Button>
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
                  label="Name"
                  height="48px"
                  placeholder={"e.g Public Pricelist"}
                  required
                  {...register('name')}
                />
              </Row>
              <Spacer size={20} />
              <Text variant="headingMedium" color="blue.darker">Availability</Text>
              <Spacer size={20} />
              <Conditions
                register={register}
                control={control}
                setValue={setValue}
                availabilityWatch={availabilityWatch}
              />
              <Spacer size={20} />
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>

        <Spacer size={20} />

        <Accordion>
          <Accordion.Item key={2}>
            <Accordion.Header variant="blue">Inventory Valuation</Accordion.Header>
            <Accordion.Body>
              <Row width="100%" gap="20px" noWrap>
                <DownloadUploadContainer>
                  <Text variant="headingMedium">Download and fill in excel file </Text>
                  <Spacer size={4} />
                  <Text variant="body2" color="black.dark">
                    Use this template to add rules structure
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
                    onClick={() => {}}
                  >
                    Upload Template
                  </Button>
                </DownloadUploadContainer>
							</Row>
              <Spacer size={20} />
              <Row width="100%" noWrap>
                <Col width={"100%"}>
                  <Table
                    columns={columns.filter(
                      (filtering) => filtering.dataIndex !== "id" && filtering.dataIndex !== "key"
                    )}
                    data={rulesTable}
                  />
                </Col>
              </Row>

              <Row justifyContent="flex-start">
                <Button
                  size="small"
                  variant={"ghost"}
                  onClick={() => {
                    setShowModalRules({
                      visibility: true,
                      tempRule: null,
                      index: null
                    })
                  }}
                >
                  + Add New Rules
                </Button>
              </Row>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
        {showModalRules.visibility &&
          <ModalAddRetailPricing 
            visible={showModalRules.visibility} 
            onCancel={() => {
              setShowModalRules({
                visibility: false,
                tempRule: null,
                index:null
              })
            }}
            onSubmit={(index, data:any) => {
              if(index){
                updateRules(index, data)
              } else {
                appendRules(data)
              }
              setShowModalRules({
                visibility: false,
                tempRule: null,
                index:null
              })
            }}
            defaultValues={showModalRules?.tempRule}
            index={showModalRules?.index}
          />
        }
      </Col>
    </>
  );
};

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
  padding: ${(p) => (p.padding ? p.padding : "16px")};
`;

export default CreateRetailPricing;
