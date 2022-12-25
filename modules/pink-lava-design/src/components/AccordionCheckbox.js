
import React, { useEffect, useRef, useState } from "react";
import { Accordion } from "./Accordion";
import { Row } from "./Row";
import { Checkbox } from "./Checkbox";
import { Text } from "./Text";
import PropTypes from 'prop-types';

export const AccordionCheckbox = ({ id, name, lists, checked, onChange, disabled }) => {
  const [listChecked, setListChecked] = useState(checked || []);
  const allChecked = lists?.every(list => listChecked.includes(list.id))
  const firstUpdate = useRef(true);

  useEffect(() => {
    if(firstUpdate.current){
      firstUpdate.current = false
    } else {
      onChange?.(listChecked)
    }
  }, [listChecked])

  const onChangeChecked = (checkboxId) => {
    let newChecked = [];
    if(listChecked.includes(checkboxId)){
      newChecked = listChecked.filter(checked => checked !== checkboxId)
    } else {
      newChecked = [...listChecked];
      newChecked.push(checkboxId);
    }
    setListChecked(newChecked)
  } 

  const checkAll = () => {
    let newChecked = [];
    if(allChecked) {
      newChecked= checked.filter(check => !lists.map(list => list.id).includes(check));
    } else {
      newChecked = checked.filter(check => !lists.map(list => list.id).includes(check));
      newChecked = newChecked.concat(lists.map(list => list.id));
    }
    setListChecked(newChecked)
  }

  return (
    <Accordion key={id}>
        <Accordion.Item key={1}>
        <Accordion.Header variant="white">
            <Row alignItems="center" gap="8px"><Checkbox disabled={disabled} checked={allChecked} onChange={(_, e) => { e.stopPropagation(); checkAll()}}/><Text variant="headingMedium" bold>{name}</Text></Row>
        </Accordion.Header>
        <Accordion.Body padding="0px">
            {lists?.map(list => (
                <Row padding="16px" alignItems="center" gap="8px" key={list.id}>
                    <Checkbox disabled={disabled} checked={listChecked.includes(list.id)} onChange={() => onChangeChecked(list.id)}/> <Text variant="body1">{list.value}</Text>
                </Row>
            ))}
            {/* <Divider  margin="0px" color="#AAAAAA"/> */}
        </Accordion.Body>
        </Accordion.Item>
    </Accordion>
  )
};

AccordionCheckbox.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  name: PropTypes.string,
  lists: PropTypes.array,
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  disabled: PropTypes.bool
}