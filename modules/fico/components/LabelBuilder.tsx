import { For } from 'react-loops';
import { Row, Col, Text } from 'pink-lava-ui';

export interface ILabelField {
  id: string;
  label: string;
  value: string | number;
}

export interface ILabelBuilder {
  fields: ILabelField[];
  column: number;
}

export function LabelBuilder(props: ILabelBuilder) {
  const { fields, column = 1 } = props;

  return (
    <For of={fields}>
      {(field) => {
        const { id, label, value } = field;

        return (
          <Col key={id} ratio={`1 0 ${(100 / column) - 2}%`} style={{ maxWidth: `${(100 / column) - 2}%` }}>
            <Row width="100%">
              <Row width="39%">
                <Text variant="headingRegular">{label}</Text>
              </Row>
              <Row width="1%">
                <Text variant="headingRegular">
                  :
                </Text>
              </Row>
              <Row width="60%">
                <Text variant="headingRegular">
                  {' '}
                  {value}
                </Text>
              </Row>
            </Row>
          </Col>
        );
      }}
    </For>
  );
}
