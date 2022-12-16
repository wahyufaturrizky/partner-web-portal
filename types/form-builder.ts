import { UseFormReturn } from "react-hook-form";
import { Field } from "./field";

export type IFormBuilder<T> = {
  fields: Field<T>[];
  column: number;
  // hookRegister: UseFormRegister<any>;
  useForm: UseFormReturn<any>;
}