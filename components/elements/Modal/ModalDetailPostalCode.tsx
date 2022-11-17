import React, { useState } from "react";
import { Button, Spacer, Modal, Input, Dropdown, Spin, Row } from "pink-lava-ui";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import {
  useCountries,
  useCountryStructures,
  useUpdatePostalCode,
} from "../../../hooks/mdm/postal-code/usePostalCode";
import { lang } from "lang";

const schema = yup
  .object({
    code: yup.string().required("Postal Code is Required"),
  })
  .required();

export const ModalDetailPostalCode: any = ({
  visible,
  defaultValue,
  onCancel,
  error,
  dataModal,
  refetchPostalCode,
}: {
  visible: any;
  defaultValue: any;
  onCancel: any;
  onOk: any;
  error: any;
  dataModal: any;
  refetchPostalCode: any;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: defaultValue,
    resolver: yupResolver(schema),
  });

  const [search, setSearch] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(dataModal.country);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCountryStructures, setSelectedCountryStructures] = useState([]);
  const t = localStorage.getItem("lan") || "en-US";
  const { data: countries, isLoading: isLoadingCountries } = useCountries({
    options: {
      onSuccess: () => {},
    },
    query: {
      search,
    },
  });

  const { data: dataCountryStructures, isFetching: isFetchingCountryStructures } =
    useCountryStructures({
      country: selectedCountry,
      options: {
        onSuccess: () => {},
      },
    });

  const errorsApi = error?.errors;

  const { mutate: mutateUpdatePostalCode } = useUpdatePostalCode({
    postalCode_id: dataModal.id,
    options: {
      onSuccess: (data: any) => {
        if (data) {
          setIsLoading(false);
          window.alert("Postal code updated successfully");
          refetchPostalCode();
          onCancel();
        }
      },
    },
  });

  const onSubmit = (data: any) => {
    setIsLoading(true);
    let payload = {
      ...data,
      country: selectedCountry,
      structures: selectedCountryStructures,
    };
    mutateUpdatePostalCode(payload);
  };

  return (
    <Modal
      visible={visible}
      onCancel={onCancel}
      title={lang[t].postalCode.modalTitleUpdate.postalCode}
      footer={
        !isLoadingCountries && (
          <div
            style={{
              display: "flex",
              marginBottom: "12px",
              marginRight: "12px",
              justifyContent: "flex-end",
              gap: "12px",
            }}
          >
            <Button onClick={handleSubmit(onSubmit)} variant="primary" size="big">
              {isLoading ? "Loading" : lang[t].postalCode.primary.save}
            </Button>
          </div>
        )
      }
      content={
        <>
          <Spacer size={20} />
          {isLoadingCountries ? (
            <Row justifyContent="center">
              <Spin tip="Loading data..." />
            </Row>
          ) : (
            <>
              <Dropdown
                label={lang[t].postalCode.postalCountryName}
                width={"100%"}
                defaultValue={dataModal?.countryRecord?.name}
                items={countries.rows.map((data: any) => ({ id: data.id, value: data.name }))}
                placeholder={"Select"}
                handleChange={(value: any) => setSelectedCountry(value)}
                onSearch={(search: any) => setSearch(search)}
              />

              <Spacer size={20} />
              {console.log("@dataCountryStructures", dataCountryStructures)}

              {dataCountryStructures ? (
                dataCountryStructures?.rows.map((data: any, index: any) => {
                  console.log("@data", data);

                  return (
                    <Dropdown
                      key={index}
                      label={data.name}
                      defaultValue={data.structures[0]?.values[0]?.name}
                      noSearch
                      width={"100%"}
                      items={data.structures[0]?.values.map((dataStructures: any) => ({
                        id: dataStructures.id,
                        value: dataStructures.name,
                      }))}
                      placeholder={"Select"}
                      handleChange={(value: any) =>
                        setSelectedCountryStructures([...selectedCountryStructures, value])
                      }
                    />
                  );
                })
              ) : isFetchingCountryStructures ? (
                <Spin tip="Loading data..." />
              ) : null}

              <Spacer size={20} />
              <Input
                error={errors?.code?.message}
                {...register("code", { required: true })}
                label={lang[t].postalCode.postalCode}
                defaultValue={dataModal?.code}
                placeholder={"e.g 40551"}
              />
              <Spacer size={20} />
            </>
          )}
        </>
      }
    />
  );
};
