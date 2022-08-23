import React, { useState } from 'react'
import {
  Button,
  Col,
  Input,
  Row,
  Spacer,
  Dropdown,
  Checkbox,
  Text,
  TextArea
} from "pink-lava-ui";
import styled from 'styled-components'

import IconAdd from '../../../../assets/icons/ICAdd'
import PicturePlaceholder from '../../../../assets/icons/ic-picture-dummy.svg'

import styles from './styles.module.css'

export default function Addresses() {
  const [isPrimary, setIsPrimary] = useState(false)

  return (
    <div>
      <Button size="big" variant={"primary"} onClick={() => { }}>
        <IconAdd /> Add More Address
      </Button>
      <Spacer size={20} />
      <ElementFlex>
        <LabelChekbox>Address 1</LabelChekbox>
        <Row alignItems="center">
          <Checkbox checked={isPrimary} onChange={() => setIsPrimary(!isPrimary)} />
          <div style={{ cursor: "pointer" }} onClick={() => {}}>
            <Text>Primary</Text>
          </div>
        </Row>
      </ElementFlex>
      <Spacer size={30} />
      <Row gap="20px" width="100%">
        <Col width="48%">
          <Dropdown label="Address Type" width="100%" />
          <Spacer size={10} />
          <Dropdown label="Country" width="100%" />
          <Spacer size={10} />
          <Dropdown label="City" width="100%" />
          <Spacer size={10} />
          <Dropdown label="Zone" width="100%" />
          <Spacer size={10} />
          <Input
            height="48px"
            placeholder="e.g 1421.31231.1231"
            label="Longitude"
            width="100%"
          />
          <Spacer size={30} />
          <UploadImage />
        </Col>
        <Col width="48%">
          <TextArea
            width="100%"
            rows={1}
            height="10px"
            placeholder="e.g Front Groceries No. 5"
            label={<Label>Street</Label>}
            onChange={() => {}}
            defaultValue={['']}
          />
          <Spacer size={10} />
          <Dropdown label="Province" width="100%" />
          <Spacer size={10} />
          <Dropdown label="District" width="100%" />
          <Spacer size={10} />
          <Dropdown label="Postal Code" width="100%" />
          <Spacer size={10} />
          <Input
            height="48px"
            placeholder="e.g 1421.31231.1231"
            label="Latitude"
            width="100%"
          />
        </Col>
      </Row>
    </div>
  )
}

const UploadImage = () => {
  return (
    <div>
      <Label>Store Photo</Label>
      <CardUploader>
        <div className={styles['image-uploader']}>
          <PicturePlaceholder />
        </div>
        <Spacer size={10} />
        <div className={styles['description-uploader']}>
          <p className={styles['rules-dimension']}>Dimension Minimum Size 300 x 300</p>
          <p className={styles['rules-size']}>File Size Max. 1MB</p>
          <Spacer size={5} />
          <Button type="primary" size="small">
            Upload
          </Button>
        </div>
      </CardUploader>
    </div>
  )
}

const CardUploader = styled.div`
  display: flex;
  align-items: top;
`

const LabelChekbox = styled.p`
  margin: 0;
  font-weight: 600;
  font-size: 20px;
  line-height: 27px;
  color: #1E858E;
`

const ElementFlex = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`

const Label = styled.p`
  font-weight: bold;
  line-height: 14px;
  font-size: 16px;
  margin: 0 0 10px 0;
`
