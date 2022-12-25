/* eslint-disable no-unused-vars */
import styled from 'styled-components';
import { For } from 'react-loops';
import { Col } from '../../components';
import {
  Case, Default, Switch,
} from 'react-if';
import React, { useEffect } from 'react';
import moment from 'moment';
import { errorMaxLength, errorMaxValue } from '../../const/errorMsg';

import { Input } from './Input';
import { InputNumber } from './InputNumber';
import { DatePicker } from './DatePicker';
import { Dropdown } from './Dropdown';
import { Checkbox } from './Checkbox';
import { DropdownTextbox } from './DropdownTextbox';

import uniqueId from 'lodash.uniqueid';

const currencyParser = (value) => value.replace(/\$\s?|(,*)/g, '');
const telephoneParser = (value) => value.replace(/\$\s?|(\s*)/g, '');
const mobilephoneParser = (value) => value.replace(/\$\s?|(\s*)/g, '');

// Comment this if you want to see console log error
// eslint-disable-next-line no-console
console.error = () => {};

export function FormBuilder(props) {
  const { fields, column = 1, useForm } = props;
  const {
    watch, register, setValue, getValues, formState: { errors },
  } = useForm;

  useEffect(() => {
    const subscription = watch((value) => value);
    return subscription.unsubscribe();
  }, [watch]);

  // console.log(getValues());

  return (
    <For of={fields}>
      {(field) => {
        const {
          id, validation = {}, type, width = '100%', height = '48px', label = ' ', placeholder = '', isLoading = false, disabled = false,
          datasources = [], onChange, render, flexWidth, onSearch,
        } = field;

        let defaultValue = getValues(id);

        validation.onChange = (e) => onChange?.(e);
        validation.onBlur = (e) => setValue(id, e.target.value);

        if (type === 'number') {
          defaultValue = Number(defaultValue);
        }
        if (type === 'mobilephone') {
          if (validation.required) validation.minLength = { value: 10, message: 'Invalid phone number' };
          validation.maxLength = errorMaxLength(20);
          validation.onBlur = (e) => setValue(id, mobilephoneParser(e.target.value));
        }
        if (type === 'telephone') {
          if (validation.required) validation.minLength = { value: 6, message: 'Invalid phone number' };
          validation.maxLength = errorMaxLength(20);
          validation.onBlur = (e) => setValue(id, telephoneParser(e.target.value));
        }
        if (type === 'currency') {
          defaultValue = Number(defaultValue);
          if (!validation.max) validation.max = errorMaxValue(999999999999999, '* maximal length is 15');
          validation.valueAsNumber = true;
          validation.onBlur = (e) => {
            const value = parseFloat(currencyParser(e.target.value)).toFixed(2);
            if (Number.isNaN(value) === false) setValue(id, parseFloat(currencyParser(e.target.value)).toFixed(2));
          };
        }
        if (type === 'datepicker') {
          if (!defaultValue || defaultValue === '') defaultValue = undefined;
          else if (moment(defaultValue, 'DD/MM/YYYY').isValid()) defaultValue = moment(defaultValue, 'DD/MM/YYYY');
          else if (moment(defaultValue).isValid()) defaultValue = moment(defaultValue);
        }

        const flexRatio = `1 0 ${(flexWidth ?? 100 / column) - 2}%`;
        const containerId = id !== '' ? `container-field-${id}` : uniqueId('container-field-');

        const basisWidth = flexWidth ? `lg:!basis-${flexWidth}` : `lg:!basis-${Math.ceil(100 / column)}`;

        return (
          <Col key={`${containerId}`} justifyContent="start" className={`basis-full ${basisWidth}`}>
            <div className="w-[98%]">
              <Switch>
                <Case condition={type === 'text'}>
                  <Input
                    id={id}
                    width={width}
                    label={label}
                    height={height}
                    placeholder={placeholder}
                    disabled={disabled}
                    isLoading={isLoading}
                    error={errors[id]?.message}
                  // value={watch(id)}
                    {...register(id, validation)}
                  />
                </Case>
                <Case condition={type === 'number'}>
                  <InputNumber
                    id={id}
                    width={width}
                    label={label}
                    height={height}
                    placeholder={placeholder}
                    isLoading={isLoading}
                    disabled={disabled}
                    error={errors[id]?.message}
                    value={defaultValue}
                    {...register(id, validation)}
                  />
                </Case>
                <Case condition={type === 'currency'}>
                  <InputNumber
                    id={id}
                    width={width}
                    label={label}
                    height={height}
                    placeholder={placeholder}
                    isLoading={isLoading}
                    disabled={disabled}
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={currencyParser}
                    error={errors[id]?.message}
                    value={defaultValue}
                    {...register(id, validation)}
                  />
                </Case>
                <Case condition={type === 'telephone'}>
                  {/* <InputNumber
                    id={id}
                    width={width}
                    label={label}
                    height={height}
                    placeholder={placeholder}
                    isLoading={isLoading}
                    disabled={disabled}
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
                    parser={telephoneParser}
                    error={errors[id]?.message}
                    value={defaultValue}
                    {...register(id, validation)}
                  /> */}
                  <Input
                    id={id}
                    width={width}
                    label={label}
                    height={height}
                    placeholder={placeholder}
                    disabled={disabled}
                    isLoading={isLoading}
                    // formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
                    // parser={telephoneParser}
                    error={errors[id]?.message}
                  // value={watch(id)}
                    {...register(id, validation)}
                  />
                </Case>
                <Case condition={type === 'mobilephone'}>
                  {/* <InputNumber
                    id={id}
                    width={width}
                    label={label}
                    height={height}
                    placeholder={placeholder}
                    isLoading={isLoading}
                    disabled={disabled}
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{4})+(?!\d))/g, ' ')}
                    parser={mobilephoneParser}
                    error={errors[id]?.message}
                    value={defaultValue}
                    {...register(id, validation)}
                  /> */}
                  <Input
                    id={id}
                    width={width}
                    label={label}
                    height={height}
                    placeholder={placeholder}
                    disabled={disabled}
                    isLoading={isLoading}
                    // formatter={(value) => `${value}`.replace(/\B(?=(\d{4})+(?!\d))/g, ' ')}
                    // parser={telephoneParser}
                    error={errors[id]?.message}
                  // value={watch(id)}
                    {...register(id, validation)}
                  />
                </Case>
                <Case condition={type === 'datepicker'}>
                  <DatePicker
                    id={id}
                    label={label}
                    placeholder={placeholder || 'DD/MM/YYYY'}
                    disabled={disabled}
                    picker="date"
                    format="DD/MM/YYYY"
                    isLoading={isLoading}
                    error={errors[id]?.message}
                    value={defaultValue}
                    {...register(id, validation)}
                  />
                </Case>
                <Case condition={type === 'monthpicker'}>
                  <DatePicker
                    id={id}
                    label={label}
                    placeholder={placeholder || 'MM'}
                    disabled={disabled}
                    picker="month"
                    format="MM"
                    isLoading={isLoading}
                    error={errors[id]?.message}
                    value={watch(id) && watch(id) !== '' ? moment(watch(id), 'MM') : undefined}
                    {...register(id, validation)}
                  />
                </Case>
                <Case condition={type === 'yearpicker'}>
                  <DatePicker
                    id={id}
                    label={label}
                    placeholder={placeholder || 'YYYY'}
                    disabled={disabled}
                    picker="year"
                    format="YYYY"
                    isLoading={isLoading}
                    error={errors[id]?.message}
                    value={watch(id) && watch(id) !== '' ? moment(watch(id), 'YYYY') : undefined}
                    {...register(id, validation)}
                  />
                </Case>
                <Case condition={type === 'dropdown'}>
                  <Dropdown
                    id={id}
                    width={width}
                    label={label}
                    loading={isLoading}
                    items={datasources}
                    placeholder={placeholder || 'Select'}
                    disabled={disabled}
                    error={errors[id]?.message}
                    value={watch(id)}
                    onSearch={onSearch}
                  // noSearch
                    {...register(id, validation)}
                  />
                </Case>
                <Case condition={type === 'dropdown-texbox'}>
                  <DropdownTextbox
                    id={id}
                    label={label}
                    loading={isLoading}
                    datasources={datasources}
                    placeholder={placeholder}
                    disabled={disabled}
                    error={errors[id]?.message}
                    value={watch(id)}
                    noSearch
                    {...register(id, validation)}
                  />
                </Case>
                <Case condition={type === 'checkbox'}>
                  <Checkbox
                    id={id}
                    label={label}
                    disabled={disabled}
                    error={errors[id]?.message}
                    value={watch(id)}
                    checked={watch(id)}
                    {...register(id, validation)}
                  />
                </Case>
                <Case condition={type === 'checkbox-horizontal-label'}>
                  <Checkbox
                    id={id}
                    label={label}
                    labelPosition="horizontal"
                    disabled={disabled}
                    error={errors[id]?.message}
                    value={watch(id)}
                    checked={watch(id)}
                    {...register(id, validation)}
                  />
                </Case>
                <Case condition={type === 'custom'}>
                  <Container width={width}>
                    <Label>{label}</Label>
                    {render}
                  </Container>
                </Case>

                <Default><div /></Default>
              </Switch>
            </div>
          </Col>
        );
      }}
    </For>
  );
}

const Container = styled.div`
  display: flex;
  gap: 4px;
  flex-direction: column;
  width: ${(p) => (p.width ? p.width : '100%')};
`;

const Label = styled.div`
  font-weight: 700;
  font-size: 16px;
  line-height: 24px;
  color: #000000;
`;