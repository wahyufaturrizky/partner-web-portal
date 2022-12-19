import { UseFormReturn, FieldValues } from 'react-hook-form';
import { Field } from './field';

export type Form<TFormInterface extends FieldValues> = {
  form: UseFormReturn<TFormInterface>,
  type?: 'create' | 'update',
  datasources?: {
    [x: string]: [
      {
        [x: string]: string | number | boolean;
      }
    ]
  },
};

export type FormBuilder<T> = {
  fields: Field<T>[];
  column: number;
  // hookRegister: UseFormRegister<any>;
  useForm: UseFormReturn<any>;
}
