import React, { useEffect, useState } from 'react'
import { 
    Modal,
    Text,
    Spacer,
    Radio,
    Row,
    Col,
    Dropdown,
    InputWithTags,
    FormSelect,
    Spin,
    Search,
    Pagination,
    Table,
    Input,
    Button,
    Checkbox
 } from "pink-lava-ui";
import styled from "styled-components";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Controller, useForm } from 'react-hook-form';
import useDebounce from 'lib/useDebounce';
import { useCompanyInfiniteLists, useMenuDesignLists } from 'hooks/company-list/useCompany';
import { useBranchInfiniteLists } from 'hooks/mdm/branch/useBranch';
import { useUsers } from 'hooks/user-config/useUser';
import usePagination from '@lucasmogari/react-pagination';
import { useCalculationModules } from 'hooks/calculation-config/useCalculation';



type Props = {}

const ModalCalculation = ({
    visible,
    onCancel,
	defaultValue,
    title,
    onOk
}: any) => {

    const pagination = usePagination({
		page: 1,
		itemsPerPage: 20,
		maxPageItems: Infinity,
		numbers: true,
		arrows: true,
		totalItems: 100,
	});

    const [companyList, setCompanyList] = useState([])
    const [totalRowsCompanyList, setTotalRowsCompanyList] = useState(0)
    const [searchCompany, setSearchCompany] = useState("");
    const debounceFetchCompany = useDebounce(searchCompany, 1000);

    const [branchList, setBranchList] = useState([])
    const [totalRowsBranchList, setTotalRowsBranchList] = useState(0)
    const [searchBranch, setSearchBranch] = useState("");
    const debounceFetchBranch = useDebounce(searchBranch, 1000);

    const [openAdvanceView, setOpenAdvanceView] = useState(false)
    const [searchUsers, setSearchUsers] = useState("");
    const debounceFetchUsers = useDebounce(searchUsers, 1000);

    const [radioValue, setRadioValue] = useState("new")
    const [minUser, setMinUser] = useState(1)
    const schema = yup
	.object({
		role_name: yup.string().required("Role Name is Required"),
		total_user: yup.number().required("Total User is Required"),
		company: yup.string().required("Company is Required"),
		user_name: yup.array().of(yup.string()).min(1, 'User Name cannot be empty').length(minUser, `List of User needs to be exactly ${minUser}`),
	})
	.required();

    const {
		register,
		handleSubmit,
        control,
		formState: { errors },
		setValue,
	} = useForm({
		// defaultValues: defaultValue,
		resolver: yupResolver(schema),
	});

    // FETCH COMPANY
    const {
        isLoading: isLoadingCompany,
        isFetching: isFetchingCompany,
        isFetchingNextPage: isFetchingMoreCompany,
        hasNextPage: hasNextPageCompany,
        fetchNextPage: fetchNextPageCompany,
      } = useCompanyInfiniteLists({
        query: {
          search: debounceFetchCompany,
          limit: 10,
        },
        options: {
          onSuccess: (data: any) => {
            setTotalRowsCompanyList(data.pages[0].totalRow);

            const mappedData = data?.pages?.map((group: any) => {
              return group.rows?.map((element: any) => {
                return {
                  value: element.code,
                  label: element.name,
                };
              });
            });
            const flattenArray = [].concat(...mappedData);
            setCompanyList(flattenArray);
          },
          getNextPageParam: (_lastPage: any, pages: any) => {
            if (companyList.length < totalRowsCompanyList) {
              return pages.length + 1;
            } else {
              return undefined;
            }
          },
        },
      });
    
    // FETCH BRANCH
    const {
        isLoading: isLoadingBranch,
        isFetching: isFetchingBranch,
        isFetchingNextPage: isFetchingMoreBranch,
        hasNextPage: hasNextPageBranch,
        fetchNextPage: fetchNextPageBranch,
      } = useBranchInfiniteLists({
        query: {
          company_id: "KSNI",
          search: debounceFetchBranch,
          limit: 10,
        },
        options: {
          onSuccess: (data: any) => {
            setTotalRowsBranchList(data.pages[0].totalRow);
            const mappedData = data?.pages?.map((group: any) => {
              return group.rows?.map((element: any) => {
                return {
                  value: element.branchId,
                  label: element.name,
                };
              });
            });
            const flattenArray = [].concat(...mappedData);
            setBranchList(flattenArray);
          },
          getNextPageParam: (_lastPage: any, pages: any) => {
            if (branchList.length < totalRowsBranchList) {
              return pages.length + 1;
            } else {
              return undefined;
            }
          },
        },
      });
    
    // FETCH USER LIST
    const {
		data: users,
		refetch: refetchUsers,
		isLoading: isLoadingUser,
	} = useUsers({
		options: {
			onSuccess: (data: any) => {
				pagination.setTotalItems(data.totalRow);
			},
		},
		query: {
			search: debounceFetchUsers,
			page: pagination.page,
			limit: pagination.itemsPerPage,
		},
	});

    const columns = [
		{
			title: "Name",
			dataIndex: "fullname",
		},
		{
			title: "User Name",
			dataIndex: "email",
		},
	];

    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [selectedRows, setSelectedRows] = useState([])
	const [inputWithTagsValue, setInputWithTagsValue] = useState(null)
    const onSelectChange = (selectedRowKeys: any, selectedRows: any) => {
        setSelectedRows(selectedRows)
		setSelectedRowKeys(selectedRowKeys);
	};

    const rowSelection = {
		selectedRowKeys,
		onChange: onSelectChange,
	};

    const setUserFromTable = () => {
        const fullnameList = selectedRows?.map(e => e?.fullname)
        setInputWithTagsValue(fullnameList)
        setOpenAdvanceView(false)
    }


    const [moduleSelected, setModuleSelected] = useState(1)
    const [calculationData, setCalculationData] = useState([]);
    
    // FETCH MODULE
    const {
        data: calculationDataModules,
        isLoading: isLoadingCalculationModules,
        isFetching: isFetchingCalculationModules,
      } = useCalculationModules({
        options: {
            onSuccess: (data: { testData: React.SetStateAction<never[]>; }) => {
                setCalculationData(data.testData)
            },
          select: (data: any) => {
            const testData = data?.map((e: { moduleId: any; moduleName: any; menu: any[]; }) => {
                return {
                    id: e.moduleId,
                    name: e.moduleName,
                    menu: e.menu?.map(el => {
                        return {
                            id: el.id,
                            name: el.name,
                            checked: false
                        }
                    })
                }
            })
            
            return { 
                totalRow: data.totalRow, 
                testData
            };
          },
        },
      });

      const changeValueCheckbox = (value: any, checked: React.Key | null | undefined) => {
        const newData = [...calculationData]
        const updatedData = newData?.map(el => {
            if(el.id === moduleSelected){
                return {
                    ...el,
                    menu: el.menu?.map(e => {
                        if(e.id === checked){
                            return {
                                ...e,
                                checked: value
                            }
                        } else {
                            return e
                        }
                    })
                }
            } else {
                return el
            }
        })
        setCalculationData(updatedData)
    }

    const onAdd = (data: any) => {
        console.log(data, '<<<<< test')
    }

  return (
    <Modal
        width={750}
        visible={visible}
        onCancel={onCancel}
        title={title}
        footer={
            <Row justifyContent={"space-between"}>
                <div></div>
                <Row gap={"1rem"}>
                <Button size="big" variant="tertiary" onClick={onCancel}>
                    Cancel
                </Button>
                <Button size="big" variant="primary" onClick={handleSubmit(onAdd)}>
                    Add
                </Button>
                </Row>
            </Row>
        }
        content={
            <>
            <Spacer size={20} />
            <Text variant={"headingSmall"}>Select One</Text>
            <Spacer size={10} />
            <Row gap={"8px"} alignItems={"center"}>
                <Radio
                    value={"new"}
                    checked={radioValue === "new"}
                    onChange={(e: any) => {
                        setRadioValue(e.target.value);
                    }}
                    >
                    New
                </Radio>
                    <Radio
                    value={"useExistingRole"}
                    checked={radioValue === "useExistingRole"}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setRadioValue(e.target.value);
                    }}
                    >
                    Use Existing Roles
                </Radio>
            </Row>
            <Spacer size={20} />
            
            <Col>
                <Row justifyContent={"space-between"}>
                    <div style={{width: '340px'}}>
                        <Input
                            width="100%"
                            height="40px"
                            placeholder="e.g Sales Admin"
                            label="Role Name" 
                            required
                            error={errors?.role_name?.message}
                            {...register('role_name', {required: true})}
                        />
                    </div>
                    <div style={{width: '340px'}}>
                        <Input
                            width="100%"
                            height="40px"
                            placeholder="e.g 3"
                            label="Total User" 
                            required
                            error={errors?.total_user?.message}
                            onChange={(e: any) => {
                                setMinUser(+e.target.value)
                                setValue('total_user', +e?.target?.value)
                            }}
                        />
                    </div>
                </Row>
                
                <Spacer size={10} />

                <Row justifyContent={"space-between"}>
                    <Controller
                        control={control}
                        defaultValue={""}
                        name="company"
                        render={({ field: { onChange, value }, formState: { errors } }) => (
                            <Col>
                            <div style={{
                            display: 'flex'
                            }}>
                            <Text variant="headingRegular">Company</Text>
                             <Span>&#42;</Span>
                            </div>
                            <Spacer size={6} />
                            <FormSelect
                                // defaultValue={value}
                                style={{ width: "340px"}}
                                size={"large"}
                                placeholder={"Select"}
                                borderColor={"#AAAAAA"}
                                arrowColor={"#000"}
                                withSearch
                                required
                                error={errors?.company?.message}
                                isLoading={isFetchingCompany}
                                isLoadingMore={isFetchingMoreCompany}
                                fetchMore={() => {
                                if (hasNextPageCompany) {
                                    fetchNextPageCompany();
                                }
                                }}
                                items={isFetchingCompany && !isFetchingMoreCompany ? [] : companyList}
                                onChange={(value: any) => {
                                onChange(value);
                                }}
                                onSearch={(value: any) => {
                                setSearchCompany(value);
                                }}
                            />
                            </Col>
                        )
                        }
                    />
                    <Spacer size={1}/>
                    <Controller
                        control={control}
                        // defaultValue={workingCalendarData?.company?.branch ?? ""}
                        name="branch"
                        render={({ field: { onChange }, formState: { errors } }) => (
                            <Col>
                            <Text variant="headingRegular">Branch</Text>
                            <Spacer size={6} />
                            <FormSelect
                                // defaultValue={workingCalendarData?.company?.branch ?? ""}
                                style={{ width: "340px" }}
                                size={"large"}
                                placeholder={"Select"}
                                borderColor={"#AAAAAA"}
                                arrowColor={"#000"}
                                withSearch
                                isLoading={isFetchingBranch}
                                isLoadingMore={isFetchingMoreBranch}
                                fetchMore={() => {
                                if (hasNextPageBranch) {
                                    fetchNextPageBranch();
                                }
                                }}
                                items={branchList}
                                onChange={(value: any) => {
                                onChange(value);
                                }}
                                onSearch={(value: any) => {
                                setSearchBranch(value);
                                }}
                            />
                            </Col>
                        )}
                        />
                </Row>
            </Col>

            <Spacer size={20}/>
            <Separator/>
            <Spacer size={20}/>

            <Text variant={"headingSmall"} style={{color: 'rgb(33, 145, 155)'}}>1 Selected Menu</Text>
            
            <Spacer size={20}/>
            <Text variant={"headingSmall"} >Module</Text>
            <Spacer size={20}/>

            <Row gap={"1rem"}>
                {calculationData?.map(e => (
                    <Button 
                    key={e.id} 
                    size={"small"} 
                    variant={moduleSelected === e.id ? "primary" : "tertiary"}
                    onClick={() => {
                        setModuleSelected(e?.id)
                    }}
                    >
                        {e.name}
                    </Button>
                ))}
            </Row>

            <Spacer size={20}/>
            
            <Row gap={'1rem'}>
                {calculationData?.filter((e: { id: number; }) => e.id === moduleSelected)[0]?.menu?.map((el: { id: React.Key | null | undefined; checked: any; name: string}) => (
                    <Row 
                    key={el.id}
                    style={{
                        border: '1px solid gray',
                        borderRadius: '8px',
                        padding: '.3rem .6rem',
                        width: '160px'
                    }}>
                        <Checkbox
                            checked={el.checked}
                            onChange={(value) => changeValueCheckbox(value, el.id)}
                            stopPropagation={true}
                        />
                        <Col>
                            <Text variant={"headingSmall"} >{el?.name}</Text>
                            <Text variant={"text"} >10.000 / Month</Text>
                        </Col>
                    </Row>
                ))}
            </Row>

            <Spacer size={20}/>
            <Separator/>
            <Spacer size={20}/>

            <Col width={"100%"}>
                <InputWithTags
                    width="80%"
                    label="Choose username to assign"
                    required
                    value={inputWithTagsValue? inputWithTagsValue : []}
                    height="40px"
                    error={errors?.user_name?.message}
                    placeholder={`Type with separate comma or by pressing "Enter"`}
                    onChange={(value) => {
                        setInputWithTagsValue(value)
                        setValue("user_name", value)
                    }}
                    // {...register("user_name", { required: "Please enter Conversion Number." })}
                />
                <ErrorText>
                {errors?.user_name?.message}
                </ErrorText>
            </Col>
            <Button 
            style={{
                position: 'relative',
                top: "-40px"
            }}
            onClick={() => setOpenAdvanceView(true)}
            size={"small"} variant={"ghost"}>Advance View</Button>

            {openAdvanceView && (
                <Modal
                    width={750}
                    visible={openAdvanceView}
                    onCancel={() => setOpenAdvanceView(false)}
                    title={"Choose User"}
                    footer={
                    <>
                    <Spacer size={40}/>
                        <Row justifyContent={"space-between"}>
                            <div></div>
                            <Row gap={"1rem"}>
                            <Button size="big" variant="tertiary" onClick={() => setOpenAdvanceView(false)}>
                                Cancel
                            </Button>
                            <Button size="big" variant="primary" onClick={setUserFromTable}>
                                Add
                            </Button>
                            </Row>
                        </Row>
                    </>
                    }
                    content={
                        <>
                    <Spacer size={40}/>

                            <Row>
                            <Search
                                width="340px"
                                placeholder="Search Role Name, Total User, Menu Name, etc."
                                onChange={(e: any) => {
                                    setSearchUsers(e.target.value);
                                }}
                            />
                                </Row>
                                <Spacer size={20} />

                                <Col gap={"60px"}>
                                <Table
                                    loading={isLoadingUser || refetchUsers}
                                    columns={columns}
                                    data={users?.rows}
                                    rowSelection={rowSelection}
                                    rowKey={"id"}
                                />
                                <Pagination pagination={pagination} />
                            </Col>
                        </>
                    }
                />
            )}
            </>
        }
    />
  )
}

const ErrorText = styled.p`
    color: #ED1C24;
    position: relative;
    font-size: 12px;
    line-height: 18px;
    top: -36px;
`
const Center = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Span = styled.span`
  color: #ed1c24;
  margin-left: 5px;
  font-weight: bold;
`;

const Separator = styled.div`
  display: block;
  height: 0;
  border-bottom: 1px dashed #aaaaaa;
`;

const Container = styled.div``;

export default ModalCalculation