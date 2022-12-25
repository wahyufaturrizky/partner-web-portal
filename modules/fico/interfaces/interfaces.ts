/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import { TableRowSelection } from 'antd/lib/table/interface';
import { UseFormReturn, FieldValues } from 'react-hook-form';

export interface IModals {
  confirmation?: { open: boolean, title: string, message: string, onOk?: () => void }
  alert?: { open: boolean, title: string, message: string, variant?: string }
  transaction?: { open: boolean, title: string, onOk?: () => void }
}

export interface IRowSelection extends TableRowSelection<object> {
  selectionMessage?: string;
  selectionAction?: JSX.Element;
}

export interface IDataTable {
  rowKey: string,
  data?: any[],
  columns: any[],
  pagination?: any,
  rowSelection?: IRowSelection,
  listTab?: any[],
  isLoading?: boolean,
  defaultTab?: string,
  searchPlaceholder?: string,
  scroll?: { x?: number | string | true | undefined, y?: number | string | undefined },
  onSearch?: (e) => void,
  onDelete?: (e) => void,
  onAdd?: (e) => void,
  onChangeTab?: (e) => void
}

export interface IMutate {
  mutate?: (e) => void,
  isLoading?: boolean,
}

export interface IForm<TFormInterface extends FieldValues> {
  form: UseFormReturn<TFormInterface>,
  type?: 'create' | 'update',
  datasources?: {
    [x: string]: [
      {
        [x: string]: string | number | boolean;
      }
    ]
  },
}
