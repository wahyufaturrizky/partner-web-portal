import React, { useState } from "react";
import styled from "styled-components";
import { ReactComponent as ArrowDown } from "../assets/arrow-down.svg";
import { Text } from "./Text"
import { Row } from "./Row"
import { useClickOutside } from "../hooks/useClickOutside";

export const ActionButton = ({
    lists
}) => {
  const [isShowDropdown, setShowDropdown] = useState(false)
  const clickRef = React.useRef();
  useClickOutside(clickRef, () => setShowDropdown(false));
  return (
    <SuperContainer ref={clickRef}>
        <Container onClick={() => setShowDropdown(!isShowDropdown)}>
            <Text variant="button" color="gray.regular">Action</Text>
            <ArrowDown fill="black" /> 
        </Container>
        {isShowDropdown && 
            <DropdownContainer>
                {lists.map(list => (
                    <Row style={{marginTop: '8px', cursor: 'pointer'}} alignItems="center" width="198px" gap="4px" onClick={() =>list.onClick && list.onClick()}>
                         <Row>{<list.icon />}</Row>
                        <Text variant="headingSmall" color="black.regular">{list.name}</Text>
                    </Row>
                ))}
            </DropdownContainer>
        }
    </SuperContainer>
  );
};

const SuperContainer = styled.div`
    position: relative;
    min-width: 144px;
`

const Container = styled.div`
    height: 48px;
    padding: 12px 16px 12px 24px;
    border: 2px solid #888888;
    border-radius: 100px;
    display: flex;
    justify-content: space-between;
    cursor: pointer;
`

const DropdownContainer = styled.div`
    position: absolute;
    padding: 20px;
    background: #FFFFFF;
    box-shadow: 0px 4px 16px rgba(170, 170, 170, 0.15);
    border-radius: 16px;
    display: flex;
    gap: 20px;
    flex-direction: column;
    z-index: 1;
    width: 198px;
`