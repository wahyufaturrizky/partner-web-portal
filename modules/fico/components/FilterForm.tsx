import { IModals } from 'interfaces/interfaces';
import { useState } from 'react';
import { Row } from 'pink-lava-ui';
import { useForm } from 'react-hook-form';
import { Button } from './Button';
import { ModalChildren } from './modals/ModalChildren';
import { FormBuilder, IField } from './FormBuilder';

type FilterFormProps = {
  columns: { value: string; label: string; }[]
}

const getFieldType = (key: string) => {
  if (/_date|date/.test(key)) return 'datepicker';

  return 'text';
};

export const FilterForm = ({ columns }: FilterFormProps) => {
  const [modals, setModals] = useState<IModals>();
  const form = useForm();

  const closeModals = () => setModals({});

  const fields: IField[] = columns.map((col) => ({
    id: col.value,
    type: getFieldType(col.value),
    label: col.label,
  }));

  const totalFilterUsed = Object.entries(form.getValues()).filter(([, value]) => value !== '' && value !== undefined && value !== null).length;

  return (
    <>
      <Button
        size="big"
        variant={totalFilterUsed > 0 ? 'primary' : 'tertiary'}
        onClick={() => {
          setModals({
            transaction: {
              open: true,
              title: 'Filter',
              onOk: () => closeModals(),
            },
          });
        }}
      >
        <b>{totalFilterUsed > 0 ? `${totalFilterUsed} Filter Used` : 'Filter'}</b>
      </Button>
      {modals?.transaction && (
      <ModalChildren
        title={modals.transaction.title}
        visible={modals.transaction.open}
        width={800}
        onCancel={() => { form.reset({}); }}
        onOk={() => modals.transaction?.onOk?.()}
        textBtnOk="Filter"
        textBtnCancel="Reset"
      >
        <Row width="100%">
          <FormBuilder
            fields={fields}
            column={2}
            useForm={form}
          />
        </Row>
      </ModalChildren>
      )}
    </>
  );
};
