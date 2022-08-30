import React from 'react'
import { Spacer, Text, Button } from 'pink-lava-ui'

export default function Branch() {
  return (
    <div>
      <Text variant="headingMedium" color="blue.darker">Branch</Text>
      <Spacer size={14} />
      <Button
        size="big"
        variant="primary"
        onClick={() => {}}
      >
        Create New Branch
      </Button>
      <Spacer size={20} />
    </div>
  )
}
