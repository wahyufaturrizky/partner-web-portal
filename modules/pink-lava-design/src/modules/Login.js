import React from 'react'
import { Card } from '../components/Card'
import { Input } from '../components/Input'
import { Spacer } from '../components/Spacer'
import { Text } from '../components/Text'
import EyeCrossed from "../assets/eye-crossed.svg"
import { Checkbox } from '../components/Checkbox'
import { Button } from '../components/Button'
import { Col } from '../components/Col'
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";


const schema = yup.object({
  username: yup.string().required('Username is Required'),
  password: yup.string().required('Password is Required'),
  rememberMe: yup.boolean()
}).required();

export const Login = () => {
  const { register, watch, getValues, setValue, handleSubmit, formState:{ errors } } = useForm({
    resolver: yupResolver(schema)
  });
  const watchField = watch('rememberMe');
  const onSubmit = data => console.log(data);

  return (
    <Card width={"473px"}>
      <Col>
        <Col alignItems="center">
          <Text variant="headingLarge">Welcome Back!</Text>
          <Spacer axis="vertical" size={4}/>
          <Text variant="body2" color="grey.light">login to enter dashboard</Text>
        </Col>
        <Spacer size={20} />
          <Input 
            error={errors?.username?.message} 
            {...register("username", {required: true} )} 
            label="Username" 
            placeholder={"Type your NIK, Email, Phone number"}
          />
          <Spacer size={26} />
          <Input 
            error={errors?.password?.message} 
            {...register("password", {required: true} )} 
            label="Password" 
            placeholder={"Type your password"} 
            icon={<EyeCrossed />} 
          />
          <Spacer size={32} />
          <Checkbox 
            onChange={(checked) => setValue("rememberMe", checked)} 
            checked={!!getValues("rememberMe")} 
            text="Remember me" 
          />
          <Spacer size={32} />
          <Button 
            size='xtra' 
            onClick={handleSubmit(onSubmit)} 
            full 
            variant='primary'
          >Login</Button>
      </Col>
    </Card>
  )
}