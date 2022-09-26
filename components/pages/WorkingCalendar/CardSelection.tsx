import React from "react";
import styled from "styled-components";
import { Text, Col } from "pink-lava-ui";

const CardSelection = ({ onSelect, type, selectedType, Icon, title }: any) => {
  return (
    <StyledCardSelection
      isActive={type === selectedType}
      onClick={() => {
        onSelect(type);
      }}
    >
      <Col alignItems={"center"} justifyContent={"center"}>
        <Icon
          style={{
            color: type === selectedType ? "#EB008B" : "#666666",
          }}
        />

        <Text
          variant={"body2"}
          textAlign={"center"}
          color={type === selectedType ? "pink.regular" : "black.dark"}
          hoverColor={type === selectedType ? "pink.regular" : "black.dark"}
        >
          {title}
        </Text>
      </Col>
    </StyledCardSelection>
  );
};

const StyledCardSelection = styled.div`
  width: 258px;
  background: #ffffff;
  border-radius: 16px;
  border: ${(props) => (props.isActive ? "2px solid #EB008B" : "1px solid #aaaaaa")};
  box-sizing: border-box;
  cursor: pointer;
  padding: 8px;
`;

export default CardSelection;
