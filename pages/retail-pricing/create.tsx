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
  FileUploaderExcel
} from "pink-lava-ui";
import styled from "styled-components";
import ArrowLeft from "../../assets/icons/arrow-left.svg";
import { useFieldArray, useForm, useWatch, Controller } from "react-hook-form";
import ModalAddRetailPricing from "components/elements/Modal/ModalAddRetailPricing";
import { ICDelete, ICEdit } from "../../assets";
import { useRouter } from "next/router";
import _ from "lodash";
import moment from "moment";
import { useCreateRetailPricing } from "hooks/mdm/retail-pricing/useRetailPricingList";
import Conditions from "components/pages/RetailPricing/fragments/Conditions";
import { mdmDownloadService } from "lib/client";

const downloadFile = (params: any) =>
  mdmDownloadService("/retail-pricing/download", { params }).then((res) => {
    let dataUrl = window.URL.createObjectURL(new Blob([res.data]));
    let tempLink = document.createElement("a");
    tempLink.href = dataUrl;
    tempLink.setAttribute("download", `retail_pricing_list_${new Date().getTime()}.xlsx`);
    tempLink.click();
  });


const CreateRetailPricing: any = () => {
  const router = useRouter();

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: '',
      availability: [{ based_on: "COUNTRY" }],
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

  const [showModalRules, setShowModalRules] = useState({
    visibility: false,
    tempRule: null,
    index: null
  })

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
      render: (_, __, index) => {
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

  const [showUploadStructure, setShowUploadStructure] = useState<any>(false);

  const getValue = (data:any) => {
    if (data.price_computation.toLowerCase().replace("- ", " ") === 'discount'){
      return data.value ? `Discount ${data.value} %` : "";
    }

    if (data.price_computation.toLowerCase().replace("- ", " ") === 'fixed price'){
      return data.value ? `Rp. ${data.value}` : "";
    }

    if(data.price_computation.toLowerCase().replace("_", " ") === 'formula'){
      if(!data.based_on) {
        return ""
      } else if(data.based_on.toLowerCase().replace("_", " ") === 'pricing structure'){
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
    valid_date: data?.valid_date?.map((date:any) => {
        if(moment.isMoment(date)) {
          return moment(date, "DD/MM/YYYY").format('DD/MM/YYYY')
        } else {
          return  moment(date).format('DD/MM/YYYY')
        }
      })?.join(" - ")
  }))

  const { mutate: createRetailPricing } = useCreateRetailPricing({
		options: {
			onSuccess: () => {
				router.push('/retail-pricing')
			},
		},
	});

  const onSubmit = (data:any) => {
    data.company_id = 'KSNI'
    data.availability = data?.availability?.map((data) => {
      let newData:any = {
        based_on: data?.based_on
      }
      if(data.based_on === 'BRANCH'){
        newData.branch = {
          ids: data?.value?.map((data:any) => data?.id) || [],
          select_all: !!data?.select_all
        }
      } else if( data.based_on === 'SALES ORGANIZATION') {
        newData.sales_organization = {
          level: data?.id,
          select_all: !!data?.select_all,
          ids: data?.value?.map((data:any) => data?.id) || []
        }
      } else if(data.based_on === 'COUNTRY'){
        newData.country = {
          id: data?.country?.id,
          level: data?.country?.value?.map((data:any) => ({
            id: data?.id,
            values: data?.levels?.map((data:any) => data?.id) || []
          }))
        }
      }
      return newData
    })

    data.rules = data.rules.map((data:any) => {
      if(data.product_category){
        data.product_category_id = data.product_category.id
        delete data.product_category;
      }
      if(data.product_group){
        data.product_group_id = data.product_group.id
        delete data.product_group
      }
      if(data.product_variant){
        data.product_variant_id = data.product_variant.id
        delete data.product_variant;
      }
      return data;
    })
    
    createRetailPricing(data);
  }

  const onUploadStructure = (data: any) => {

    data.forEach((data:any) => {
      let valid_date_split = data.validateDate ? data.validateDate.split(' ') : null;

      let newRule: any = {
        apply_on: data.applyOn.toUpperCase(),
        price_computation: data.priceComputation.toUpperCase(),
        min_qty: data.minimumQuantity,
      }

      if(valid_date_split){
        newRule.valid_date = [moment(valid_date_split[0], 'DD/MM/YYYY').utc().toString(), moment(valid_date_split[2], 'DD/MM/YYYY').utc().toString()];
      }

      if(newRule.apply_on === 'PRODUCT CATEGORY') {
        newRule.product_category = {
          id: data.productCategory
        }
      }

      if(newRule.apply_on === 'PRODUCT VARIANT') {
        newRule.product_variant = {
          id: data.productVariant
        }
      }

      if(newRule.apply_on === 'PRODUCT GROUP') {
        newRule.product_group = {
          id: data.productGroup
        }
      }

      appendRules(newRule)
    })
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
                  error={errors.name?.message}
                  required
                  {...register('name', {
                    required: "Name must be filled"
                  })}
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
            <Accordion.Header variant="blue">Price Rules</Accordion.Header>
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
                    onClick={() => setShowUploadStructure(true)}
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
              if(index || index === 0){
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
            defaultValues={JSON?.parse(JSON?.stringify(showModalRules?.tempRule))}
            index={showModalRules?.index}
          />
        }
      </Col>

      <FileUploaderExcel
				setVisible={setShowUploadStructure}
				visible={showUploadStructure}
				onSubmit={onUploadStructure}
			/>
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
