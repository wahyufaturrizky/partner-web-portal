/* eslint-disable no-unused-vars */
import { Checkbox as PinkLavaCheckbox, Row, Col } from 'pink-lava-ui';
import React, { useEffect, useState } from 'react';
import { Else, If, Then } from 'react-if';
import styled from 'styled-components';

export const Checkbox = React.forwardRef(({
  id,
  label,
  labelPosition = 'vertical',
  subtitle,
  error,
  disabled,
  required,
  size,
  checked = false,
  justifyContent,
  ...props
}: any, ref) => {
  const [isChecked, setIsChecked] = useState(Boolean(checked ?? props.value));

  const onChange = (value) => {
    setIsChecked(!isChecked);
    props?.onChange?.({ target: { value, name: id } });
  };

  useEffect(() => {
    setIsChecked(checked);
  }, [checked]);

  return (
    <Container>
      <If condition={!label || label === '' || labelPosition === 'horizontal'}>
        <Then><Label style={{ color: 'transparent' }}>{id}</Label></Then>
        <Else>
          <If condition={label && label !== '' && labelPosition === 'vertical'}>
            <Then><Label>{label}</Label></Then>
          </If>
        </Else>
      </If>
      <Row justifyContent={justifyContent} style={{ marginTop: '10px' }}>
        <Col width="30px">
          <CheckboxStyled
            ref={ref}
            id={id}
            name={id}
            disabled={disabled}
            size={size}
            error={error}
            checked={isChecked}
            justifyContent={justifyContent}
            {...props}
            onChange={onChange}
          />
        </Col>

        {labelPosition === 'horizontal' && (
        <Col>
          <Label>{label}</Label>
        </Col>
        )}
      </Row>
      <Subtitle error={error}>{error || subtitle}</Subtitle>
    </Container>
  );
});

const CheckboxStyled = styled(PinkLavaCheckbox)`
`;

const Container = styled.div`
  display: flex;
  gap: 4px;
  flex-direction: column;
  width: 100%;
`;

const Label = styled.div`
  font-weight: 700;
  font-size: 16px;
  line-height: 24px;
  color: #000000;
`;

const Subtitle = styled.div<{error}>`
  font-weight: normal;
  font-size: 12px;
  line-height: 18px;
  color: ${(p) => (p.error ? '#ED1C24' : '#888888')};
`;
