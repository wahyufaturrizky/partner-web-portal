import React from 'react'
import { Button } from 'pink-lava-ui'
import styled from 'styled-components'

const ActionButton = ({
  onCancel,
  onReject,
  onSubmit,
  onDraft,
  status
}: any) => {
  const labelButtonLeft = status === "Waiting for Approval" ? "Reject" : "Cancel"
  const labelButtonRight = status === "Waiting for Approval" ? "Approve" : status === "Draft" ? "Submit" : "Save"
  const fnButtonLeft = status === "Waiting for Approval" ? onReject : onCancel

  const middleButtonAction = status === "Draft" && (
    <Button onClick={onDraft} variant="secondary">
      Save as Draft
    </Button>
  )

  return (
    <FlexElement style={{ gap: "10px" }}>
      <Button onClick={fnButtonLeft} variant="tertiary">
        {labelButtonLeft}
      </Button>
      {middleButtonAction}
      <Button onClick={onSubmit} variant="primary">
        {labelButtonRight}
      </Button>
    </FlexElement>
  )
}

export default ActionButton

export const FlexElement = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ style }: any) => style?.gap};
  padding-top: ${({ style }: any) => style?.paddingTop};
`