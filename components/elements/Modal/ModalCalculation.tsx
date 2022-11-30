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
    DropdownWithTags,
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
import { useRolePermissions } from 'hooks/user-config/useRole';



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
    const [searchCompany, setSearchCompany] = useState(" ");
    const debounceFetchCompany = useDebounce(searchCompany, 1000);

    const [branchList, setBranchList] = useState([])
    const [totalRowsBranchList, setTotalRowsBranchList] = useState(0)
    const [searchBranch, setSearchBranch] = useState("");
    const debounceFetchBranch = useDebounce(searchBranch, 1000);
    
    const [searchRole, setSearchRole] = useState("");
    const debounceFetchRole = useDebounce(searchRole, 1000);

    const [openAdvanceView, setOpenAdvanceView] = useState(false)
    const [searchUsers, setSearchUsers] = useState("");
    const debounceFetchUsers = useDebounce(searchUsers, 1000);

    const [radioValue, setRadioValue] = useState("new")
    const [minUser, setMinUser] = useState(1)

    let schema;
    if(radioValue === "new" && !defaultValue) {
        schema = yup
        .object({
            role_name: yup.string().required("Role Name is Required"),
            total_user: yup.number().required("Total User is Required"),
            company_id: yup.string().required("Company is Required"),
            user_name: yup.array(yup.string().required('User Name cannot be empty')).of(yup.string()).min(1, 'User Name cannot be empty').length(minUser, `List of User needs to be exactly ${minUser}`),
        })
        .required();
    } else if (defaultValue){
        schema = yup
        .object({
            // role_id: yup.string().required("Role Name is Required"),
            // total_user: yup.number().required("Total User is Required"),
            // // company_id: yup.string().required("Company is Required"),
            // user_name: yup.array(yup.string().required('User Name cannot be empty')).of(yup.string()).min(1, 'User Name cannot be empty').length(minUser, `List of User needs to be exactly ${minUser}`),
        })
        .required();
    }else {
        schema = yup
        .object({
            role_id: yup.string().required("Role Name is Required"),
            total_user: yup.number().required("Total User is Required"),
            // company_id: yup.string().required("Company is Required"),
            user_name: yup.array(yup.string().required('User Name cannot be empty')).of(yup.string()).min(1, 'User Name cannot be empty').length(minUser, `List of User needs to be exactly ${minUser}`),
        })
        .required();
    }

    const {
		register,
		handleSubmit,
        control,
		formState: { errors },
		setValue,
	} = useForm({
		defaultValues: defaultValue,
		resolver: yupResolver(schema),
	});

    const [companyFromRole, setCompanyFromRole] = useState("PT. Kaldu Sari Nabati")
    // FETCH ROLE
    const {
		data: roleData,
		refetch: refetchRole,
        isFetching: isFetchingRole,
		isLoading: isLoadingRole,
	} = useRolePermissions({
		options: {
			onSuccess: (data: any) => {
				pagination.setTotalItems(data.totalRow);
			},
            select: (data: any) => {
                const mappedData = data?.rows?.map((element: { name: any; id: any; company: any }) => ({
                    label: element.name,
                    value: element.id,
                    company: element?.company?.name
                }))
                const flattenArray = [].concat(...mappedData);

                return {
                    data: flattenArray,
                    totalRow: data?.totalRow
                }
            }
		},
		query: {
			search: debounceFetchRole,
			page: pagination.page,
			limit: pagination.itemsPerPage,
            company_id: "HERMES"
		},
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
          limit: 10000,
        },
        options: {
          onSuccess: (data: any) => {
            setTotalRowsCompanyList(data.pages[0].totalRow);
            const mappedData = data?.pages?.map((group: any) => {
              return group.rows?.map((element: any) => {
                return {
                  value: element.id,
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
                  value: element.name,
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
            company_id: "HERMES"
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
        // console.log(selectedRowKeys, selectedRows, '<<<<<')
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
    const [count, setCount] = useState(0)

    // FETCH MODULE
    const {
        data: calculationDataModules,
        isLoading: isLoadingCalculationModules,
        isFetching: isFetchingCalculationModules,
      } = useCalculationModules({
        options: {
            onSuccess: (data: { newMappedModules: React.SetStateAction<never[]>; }) => {
                setModuleSelected(data.newMappedModules[0]?.id)
                setCalculationData(data.newMappedModules)
                setCount(count => count + data.countData)
            },
          select: (data: any) => {
            let menusFromModules: string | any[] = []
            let newMappedModules = data?.map((e: { moduleId: any; moduleName: any; menu: any[]; }) => {
                return {
                    id: e.moduleId,
                    name: e.moduleName,
                    menu: e.menu?.map(el => {
                        return {
                            id: el.id,
                            name: el.name,
                            price: el.fee ?? 10000,
                            checked: false
                        }
                    })
                }
            })

            if(defaultValue){
                menusFromModules = defaultValue?.modules?.map((module: { menus: any; }) => module.menus)?.flatMap((e: any) => e)
                newMappedModules = newMappedModules?.map(el => {
                    return {
                        ...el,
                        menu: el?.menu?.map(e => {
                        for(let i = 0; i < menusFromModules.length; i++){
                            if(menusFromModules[i]?.id === e.id){
                            return {
                                ...e,
                                checked:true
                            }
                            } else {
                            return e
                            }
                        }
                        })
                    }
                    })
            }
            console.log(newMappedModules, '<<<<<< ini data modules')
            return { 
                totalRow: data.totalRow, 
                newMappedModules,
                countData: menusFromModules.length
            };
          },
        },
      });

      useEffect(() => {
        const moduleIdFromDefaultValue = defaultValue?.modules?.map((module: { id: any; }) => module.id)
        setInputWithTagsValue(defaultValue?.users?.map(e => e.fullname))
        setSelectedRowKeys(defaultValue?.users?.map(e => e.id))
        setModuleSelected(moduleIdFromDefaultValue)
        
      }, [defaultValue])

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
        const newCalculationData = calculationData.map(module => module?.menu?.filter((menu: { checked: boolean; }) => menu.checked === true))
        const array_of_fee = newCalculationData[0]?.map((element: { price: number; }) => element?.price)
        let fee = []
        let total_fee
        if(array_of_fee.length >= 1){
            fee = array_of_fee?.reduce((a: number, b: number) => a + b)
            total_fee = fee * data?.total_user
        }    
        const modules = calculationData?.map((module: {id: any; menu: any}) => {
            const menu_ids = module?.menu?.filter((element: { checked: boolean; }) => element?.checked === true)?.map((menu: { id: any; }) => menu.id)
            if(menu_ids?.length > 0){
                return {
                    module_ids: [module.id?.toString()],
                    menu_ids
                }
            }
        })
            
        const newDataCreate = {
            ...data,
            company_id: radioValue === "new"? data?.company_id : companyList?.filter(el => el?.label === companyFromRole)[0]?.value,
            modules,
            fee,
            total_fee,
            user_ids: selectedRowKeys,
            period: "1",
            role_id: data?.role_id?? "1",
            role_name: radioValue === "new" ? data?.role_name : roleData?.data?.find(role => role?.value === +data?.role_id)?.label,
            total_payment: total_fee,
            assign_payment: 'holding'
        }

        onOk(newDataCreate)
        
    }

    const onEdit = (data: any) => {
        const newCalculationData = calculationData.map(e=> e?.menu?.filter(el => el?.checked === true))
        const array_of_fee = newCalculationData[0]?.map(el => el?.price)
        let fee = []
        let total_fee
        
        if(array_of_fee.length >= 1){
            fee = array_of_fee?.reduce((a, b) => a + b)
            if(data?.total_user){
                total_fee = fee * data?.total_user
            } else {
                total_fee = fee * data?.totalUser
            }
        }
        const modules = calculationData?.map((module: {id: any; menu: any}) => {
            const menu_ids = module?.menu?.filter((element: { checked: boolean; }) => element?.checked === true)?.map((menu: { id: any; }) => menu.id)
            if(menu_ids?.length > 0){
                return {
                    module_ids: [module.id?.toString()],
                    menu_ids
                }
            }
        })
        const newDataEdit = {
            company_id: radioValue === "new" && data?.company_id === "" ? data?.companyId : radioValue === "new" && data?.company_id !== "" ? data?.company_id : companyList?.filter(el => el.label === companyFromRole)[0]?.value,
            role_id: data?.role_id ?? data?.roleId,
            role_name: radioValue === "new" ? data?.role_name : roleData?.data?.find(role => role?.value === +data?.role_id)?.label,
            period: "1",
            branch: data?.branch,
            total_user: data?.total_user?? data?.totalUser,
            fee,
            user_ids: selectedRowKeys,
            total_fee,
            total_payment: total_fee,
            modules,
            assign_payment: 'holding'
        }
        onOk(newDataEdit)
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
                <Button size="big" variant="primary" onClick={defaultValue? handleSubmit(onEdit) : handleSubmit(onAdd)}>
                    {defaultValue? "Save": "Add"}
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
                        {radioValue === "new" ? (
                            <Input
                            width="100%"
                            height="40px"
                            defaultValue={defaultValue?.roleName}
                            placeholder="e.g Sales Admin"
                            label="Role Name" 
                            required
                            error={errors?.role_name?.message}
                            {...register('role_name', {required: true})}
                        />
                        ) : (
                        <Controller
                            control={control}
                            defaultValue={""}
                            name="role_id"
                            render={({ field: { onChange }, formState: { errors } }) => (
                                <Col>
                                <div style={{
                                display: 'flex'
                                }}>
                                <Text variant="headingRegular">Role Name</Text>
                                <Span>&#42;</Span>
                                </div>
                                <Spacer size={6} />
                                <FormSelect
                                    defaultValue={defaultValue?.roleName}
                                    style={{ width: "340px"}}
                                    size={"large"}
                                    placeholder={"Select"}
                                    borderColor={"#AAAAAA"}
                                    arrowColor={"#000"}
                                    withSearch
                                    required
                                    error={errors?.role_name?.message}
                                    isLoading={isLoadingRole || isFetchingRole}
                                    isLoadingMore={isFetchingRole}
                                    items={isFetchingRole ? [] : roleData?.data}
                                    onChange={(value: any) => {
                                        setCompanyFromRole(roleData?.data?.filter(e => e.value === value)[0]?.company)
                                        onChange(value);
                                    }}
                                    onSearch={(value: any) => {
                                        value === '' ? value = ' ' : value
                                        setSearchRole(value);
                                    }}
                                />
                                </Col>
                            )
                            }
                        />
                        )}
                        
                        
                    </div>
                    <div style={{width: '340px'}}>
                        <Input
                            width="100%"
                            height="40px"
                            placeholder="e.g 3"
                            defaultValue={defaultValue?.totalUser}
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
                    {radioValue === "new" ? (
                        <Controller
                        control={control}
                        defaultValue={""}
                        name="company_id"
                        render={({ field: { onChange }, formState: { errors } }) => (
                            <Col>
                            <div style={{
                            display: 'flex'
                            }}>
                            <Text variant="headingRegular">Company</Text>
                             <Span>&#42;</Span>
                            </div>
                            <Spacer size={6} />
                            <FormSelect
                                defaultValue={defaultValue?.companyName}
                                style={{ width: "340px"}}
                                size={"large"}
                                placeholder={"Select"}
                                borderColor={"#AAAAAA"}
                                arrowColor={"#000"}
                                withSearch
                                required
                                error={errors?.company_id?.message}
                                isLoading={isFetchingCompany || isLoadingCompany}
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
                                    value === '' ? value = ' ' : value
                                    setSearchCompany(value);
                                }}
                            />
                            </Col>
                        )
                        }
                    />
                    ) : (
                    <div style={{width: '340px'}}>
                        <Input
                            width="100%"
                            height="40px"
                            defaultValue={defaultValue?.company?.name}
                            value={companyFromRole}
                            placeholder="e.g Sales Admin"
                            label="Company" 
                            disabled
                            required
                            error={errors?.company_id?.message}
                            {...register('company_id', {required: true})}
                        />
                        </div>
                    )}
                    
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
                                defaultValue={defaultValue?.branch}
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

            <Text variant={"headingSmall"} style={{color: 'rgb(33, 145, 155)'}}>{count} Selected Menu</Text>
            
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
                {calculationData?.filter((e: { id: number; }) => e.id === moduleSelected)[0]?.menu?.map((el: { id: React.Key | null | undefined; checked: any; name: string; price: any;}) => (
                    <Row 
                    key={el.id}
                    style={{
                        border: '1px solid gray',
                        borderRadius: '8px',
                        padding: '.3rem .6rem',
                        // width: '160px'
                    }}>
                        <Checkbox
                            checked={el.checked}
                            onChange={(value) => {
                                changeValueCheckbox(value, el.id)
                                if(value) setCount(count => count + 1)
                                else setCount(count => count -1)
                            }}
                            stopPropagation={true}
                        />
                        <Col>
                            <Text variant={"headingSmall"} >{el?.name}</Text>
                            <Text variant={"text"} >{el?.price ? el?.price : 10000} / Month</Text>
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
                    mode={"multiple"}
                    dropdownStyle={""}
                    options={users?.rows?.map(e => ({value: e.fullname, label: e.fullname}))}
                    error={errors?.user_name?.message}
                    placeholder={`Type with separate comma or by pressing "Enter"`}
                    onChange={(value: string | any[] | React.SetStateAction<null>) => {
                        const userChoosen = value[value.length -1]
                        const userId = users?.rows?.filter((user: { fullname: any; }) => user.fullname === userChoosen)[0]?.id
                        if(selectedRowKeys?.length > 1){
                            setSelectedRowKeys(prev => [...prev, userId])
                        } else {
                            setSelectedRowKeys([userId])
                        }
                        setInputWithTagsValue(value)
                        // setValue("user_name", value)
                    }}
                />
                {/* 
                ini karena yup nya ga jalan ketika array [] empty 
                padahal udah min 1 
                */}
                {!inputWithTagsValue ? (
                    <ErrorText>
                    {"User Name cannot be empty"}
                    </ErrorText>
                ):(
                <ErrorText>
                {errors?.user_name?.message}
                </ErrorText>
                )}
                
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