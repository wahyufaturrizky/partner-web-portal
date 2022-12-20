import { RegisterOptions } from 'react-hook-form';
import { FlexWidth } from './flex-width';

export type Field<T = {[key: string]: string}> = {
  id: keyof T & string | '';
  validation?: RegisterOptions;
  type: '' | 'dropdown' | 'number' | 'text' | 'currency'
    | 'telephone' | 'mobilephone' | 'ammount' | 'datepicker'
    | 'monthpicker' | 'yearpicker' | 'checkbox' | 'checkbox-horizontal-label'
    | 'custom' | 'dropdown-texbox';
  width?: number | string | undefined;
  height?: number | string | undefined;
  label?: string;
  placeholder?: string;
  isLoading?: boolean;
  disabled?: boolean;
  datasources?: any[];
  onChange?: (e) => void;
  onSearch?: (value, id) => void;
  render?: JSX.Element;
  flexWidth?: FlexWidth;
}