import React from 'react'
import { Button } from 'pink-lava-ui'
import styled from 'styled-components'

const ActionButton = ({
  onCancel,
  onReject,
  isDisabled,
  onSubmit,
  onDraft,
  status
}: any) => {
  const labelButtonLeft = status === "Waiting for Approval" ? "Reject" : "Cancel"
  const labelButtonRight = status === "Waiting for Approval" ? "Approve" : status === "Draft" ? "Submit" : "Save"
  const fnButtonLeft = status === "Waiting for Approval" ? onReject : onCancel

  const middleButtonAction = status === "Draft" && (
    <Button onClick={onDraft} disabled={!isDisabled} variant="secondary">
      {isDisabled ? 'Save as Draft' : 'Loading...' }
    </Button>
  )

  return (
    <FlexElement style={{ gap: "10px" }}>
      <Button onClick={fnButtonLeft} variant="tertiary">
        {labelButtonLeft}
      </Button>
      {middleButtonAction}
      <Button disabled={!isDisabled} onClick={onSubmit} variant="primary">
        {isDisabled ? labelButtonRight : 'Loading...' }
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