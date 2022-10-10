import React, { useState } from "react";
import {
  Text,
  Col,
  Row,
  Spacer,
  Button,
  Accordion,
  Input,
  Table,
  Spin
} from "pink-lava-ui";
import styled from "styled-components";
import ArrowLeft from "../../assets/icons/arrow-left.svg";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import ModalAddRetailPricing from "components/elements/Modal/ModalAddRetailPricing";
import { ICDelete, ICEdit } from "../../assets";
import { useRouter } from "next/router";
import _ from "lodash";
import moment from "moment";
import { useRetailPricingDetail, useUpdateRetailPricing } from "hooks/mdm/retail-pricing/useRetailPricingList";
import { queryClient } from "pages/_app";
import Conditions from "components/pages/RetailPricing/fragments/Conditions";
import { toSnakeCase } from "lib/caseConverter";
import { mdmDownloadService } from "lib/client";

const downloadFile = (params: any) =>
  mdmDownloadService("/retail-pricing/download", { params }).then((res) => {
    let dataUrl = window.URL.createObjectURL(new Blob([res.data]));
    let tempLink = document.createElement("a");
    tempLink.href = dataUrl;
    tempLink.setAttribute("download", `retail_pricing_list_${new Date().getTime()}.xlsx`);
    tempLink.click();
  });

const DetailRetailPricing: any = () => {
  const router = useRouter();
  const { id } = router.query;

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch
  } = useForm({
    defaultValues: {
      rules: [],
      name: "",
      availability: []
    }
  });

  const nameWatch = useWatch({
    name: "name",
    control,
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
    if (data.price_computation.toLowerCase().replace("- ", " ") === 'discount'){
      return `Discount ${data.value}`;
    }

    if (data.price_computation.toLowerCase().replace("- ", " ") === 'fixed price'){
      return `Rp. ${data.value}`;
    }

    if(data.price_computation.toLowerCase().replace("_", " ") === 'formula'){
      if(data.based_on.toLowerCase().replace("_", " ") === 'pricing structure'){
        return 'Pricing Structure'
      } else {
        return `Min Margin ${data.margin_max} and Max Margin ${data.margin_min}`
      }
    }
  }

  const rulesTable = rulesWatch.map((data:any) => ({
    price_computation: _.startCase(_.toLower(data.price_computation)),
    apply_on:  _.startCase(_.toLower(data.apply_on)),
    min_qty: data.min_qty,
    value: getValue(data),
    valid_date: data?.valid_date?.map((date:any) => moment(date).format('DD/MM/YYYY')) || ''
  }))

  const { mutate: updateRetailPricing } = useUpdateRetailPricing({
    id,
		options: {
			onSuccess: () => {
				router.push('/retail-pricing')
			},
		},
	});

  const onSubmit = (data:any) => {
    updateRetailPricing(data);
  }

  const { data: retailPricing, isLoading } = useRetailPricingDetail({
    options: {
      onSuccess: (data:any) => {
        data = toSnakeCase(data);
        Object.keys(data).forEach((key:any) => {
          if(key === 'rules'){
            let rules = data[key];

            let newRules = rules.map((data : any) => {
              let newRule: any = {
                apply_on: data.apply_on.toUpperCase(),
                price_computation: data.price_computation.toUpperCase().replace('_', " "),
                min_qty: data.min_qty,
                valid_date: [moment(data.valid_start_date).format('DD/MM/YYYY'), moment(data.valid_end_date).format('DD/MM/YYYY')]
              }
              if(newRule.apply_on === 'PRODUCT VARIANT'){
                newRule.product_variant_id = data.product_variant.id
              }
              if(newRule.apply_on === 'PRODUCT CATEGORY'){
                newRule.product_category_id = data.product_category.id
              }
              if(newRule.apply_on === 'PRODUCT GROUP'){
                newRule.product_group_id = data.product_group.id
              }
          
              if(newRule.price_computation === 'FIXED PRICE') {
                newRule.value = data.fixed_price
              }

              if(newRule.price_computation === 'DISCOUNT') {
                newRule.value = data.discount_percentage
              }
              
              if(newRule.price_computation === 'FORMULA') {
                newRule.based_on = data.based_on.toUpperCase().replace('_', " ")
          
                if(data.based_on.toUpperCase() === 'COST'){
                  newRule.margin_min = data.margin_min
                  newRule.margin_max = data.margin_max
                  newRule.extra_fee = data.extra_fee
                  newRule.rounding_method = data.rounding_method
                }
              }

              return newRule;
            })

            setValue('rules', newRules)
          } else {

            if(key === 'availability'){
              let availability = data[key];
              let newAvailability = availability.map(availability => {
                if(availability.based_on === 'BRANCH'){
                  let branch = {
                    based_on: availability.based_on,
                    branch: {
                      ids: availability.value.map(({id}: any) => id),
                      select_all: availability.select_all
                    }
                  }
                  return branch
                }

                if(availability.based_on === 'SALES ORGANIZATION'){
                  let sales_organization = {
                    based_on: availability.based_on,
                    sales_organization: {
                      ids: availability.value.map(({id}: any) => id),
                      select_all: availability.select_all,
                      level: availability.id
                    }
                  }
                  return sales_organization
                }

                // if(availability.based_on === 'COUNTRY'){
                //   let sales_organization = {
                //     based_on: availability.based_on,
                //     sales_organization: {
                //       ids: availability.value.map(({id}: any) => id),
                //       select_all: availability.select_all,
                //       level: availability.id
                //     }
                //   }
                //   return sales_organization
                // }
              })
              setValue('availability', newAvailability)
            }

            if(key === 'name'){
              setValue('name', data[key])
            }
          }
        })
      },
      select: (data) => {
        data = toSnakeCase(data);
        return data;
      }
    },
    id
  });

  return (
    <>
    {isLoading ?
      <Spin tip="Loading data..." />
      :
      <Col>
        <Row gap="4px" alignItems="center">
          <ArrowLeft style={{ cursor: "pointer" }} onClick={() => router.back()} />
          <Text variant={"h4"}>{nameWatch}</Text>
        </Row>
        <Spacer size={12} />
        <Card padding="20px">
          <Row justifyContent="end" alignItems="center" nowrap gap="12px">
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
                retailPricing={retailPricing}
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
                  <Button variant="tertiary" size="big" onClick={() => downloadFile({ with_data: "N", type: 'rule', company_id: "KSNI" })}>
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
    }
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

export default DetailRetailPricing;
