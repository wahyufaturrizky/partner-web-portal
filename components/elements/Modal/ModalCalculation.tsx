import React, { useState } from 'react'
import { 
    Modal,
    Text,
    Spacer,
    Radio,
    Row,
    Col,
    Dropdown,
    InputWithTags,
    Button,
    Checkbox
 } from "pink-lava-ui";
import styled from "styled-components";

type Props = {}

const ModalCalculation = ({
    visible,
    onCancel,
    title,
    onOk
}: any) => {
    const [radioValue, setRadioValue] = useState("new")
    const [listZone, setListZone] = useState([
        { value: 1, label: 'Andir' },
        { value: 2, label: 'Arcamanik' },
        { value: 3, label: 'Baleendah' },
      ])
    const number = [1,2,3,4,5,6]
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
                <Button size="big" variant="primary" onClick={() => router.push("/branch/create")}>
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
                <Row>
                    <Dropdown
                        label="Role Name"
                        items={listZone}
                        width={"340px"}
                        required
                        // value={employeeLanguages && employeeLanguages}
                        placeholder={"Select"}
                        handleChange={(value) => setValue("language", value)}
                        onSearch={(value) => console.log(value)}
                        // noSearch
                    />
                    <Spacer size={25}/>
                    <Dropdown
                        label="Total User"
                        items={listZone}
                        width={"340px"}
                        required
                        // value={employeeLanguages && employeeLanguages}
                        placeholder={"Select"}
                        handleChange={(value) => setValue("language", value)}
                        onSearch={(value) => console.log(value)}
                        // noSearch
                    />
                </Row>
                <Row>
                    <Dropdown
                        label="Company"
                        items={listZone}
                        width={"340px"}
                        required
                        // value={employeeLanguages && employeeLanguages}
                        placeholder={"Select"}
                        handleChange={(value) => setValue("language", value)}
                        onSearch={(value) => console.log(value)}
                        // noSearch
                    />
                    <Spacer size={25}/>
                    <Dropdown
                        label="Branch"
                        items={listZone}
                        width={"340px"}
                        // value={employeeLanguages && employeeLanguages}
                        placeholder={"Select"}
                        handleChange={(value) => setValue("language", value)}
                        onSearch={(value) => console.log(value)}
                        // noSearch
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
                <Button size={"small"} variant={"primary"}>Sales</Button>
                <Button size={"small"} variant={"tertiary"}>Logistic</Button>
                <Button size={"small"} variant={"tertiary"}>Marketing</Button>
                <Button size={"small"} variant={"tertiary"}>Finance</Button>
            </Row>

            <Spacer size={20}/>
            
            <Row gap={'1rem'}>
                {number.map(e => (
                    <Row 
                    key={e}
                    style={{
                        border: '1px solid gray',
                        borderRadius: '8px',
                        padding: '.3rem .6rem',
                        width: '160px'
                    }}>
                        <Checkbox
                            checked={true}
                            onChange={() => console.log('checked')}
                            stopPropagation={true}
                        />
                        <Col>
                            <Text variant={"headingSmall"} >Sales Order</Text>
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
                    height="40px"
                    placeholder={`Type with separate comma or by pressing "Enter"`}
                    onChange={(e) => console.log(e)}
                    // {...register("conversionNumber", { required: "Please enter Conversion Number." })}
                />
            </Col>
            <Button 
            style={{
                position: 'relative',
                top: "-40px"
            }}
            size={"small"} variant={"ghost"}>Advance View</Button>

            
            </>
        }
    />
  )
}
const Footer = styled.div`
  display: flex;
  marginbottom: 12px;
  marginright: 12px;
  justifycontent: flex-end;
  gap: 12px;
`;

const Separator = styled.div`
  display: block;
  height: 0;
  border-bottom: 1px dashed #aaaaaa;
`;

const Container = styled.div``;

export default ModalCalculation