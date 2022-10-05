import React from 'react'
import { Spacer, Text, Button } from 'pink-lava-ui'

export default function Division() {
  return (
    <div>
      <Text variant="headingMedium" color="blue.darker">Sales Division</Text>
      <Spacer size={14} />
      <Button
        size="big"
        variant="primary"
        onClick={() => {}}
      >
        Create New Divison
      </Button>
      <Spacer size={20} />
    </div>
  )
}
