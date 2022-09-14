import React, { useEffect, useState } from "react";
import { Button, Spacer, Modal, Input, DropdownMenuOptionCustome } from "pink-lava-ui";
import styled from "styled-components";
import { useFetchDetailSalesman } from "hooks/mdm/salesman/useSalesmanDivision";

const ModalAddSalesDivision = ({ listProducts, formsUpdate, onCancel, visible, onOk }: any) => {
  const [itemSelected, setItemSelected] = useState<string[]>([]);
  const [forms, setForms] = useState({
    name: "",
    description: "",
  });
  const isDisabledButton = !(itemSelected?.length > 0 && forms?.name?.length > 3);

	const { data: detailSalesman } = useFetchDetailSalesman({
		id: formsUpdate?.id,
		options: {
			onSuccess: () => { },
			enabled: visible === true && formsUpdate?.code?.length > 1
		}
	})

  useEffect(() => {
    if (formsUpdate && visible) {
      setForms({
        name: formsUpdate?.divisiName,
        description: formsUpdate?.shortDesc,
      });
      setItemSelected(detailSalesman?.product?.split(","));
    }
  }, [formsUpdate, detailSalesman, visible]);

	return (
		<Modal
			width={500}
			visible={visible}
			onCancel={onCancel}
			title="Create Division"
			footer={
				<Footer>
					<Button
						onClick={onCancel}
						full
						variant="tertiary"
						size="big">
						Cancel
					</Button>
					<Button
						onClick={() => onOk({
							...forms,
							itemSelected
						})}
						full
						variant="primary"
						size="big"
						disabled={isDisabledButton}
					>
						Save
					</Button>
				</Footer>
			}
			content={
				<Container>
					<Spacer size={20} />
					<Input
						value={forms.name}
						onChange={({ target }: any) =>
							setForms({ ...forms, name: target.value })}
						required
						label="Division Name"
					/>
					<Spacer size={20} />
					<Input
						value={forms.description}
						onChange={({ target }: any) =>
							setForms({ ...forms, description: target.value })} 
							label="Short Description"
					/>
					<Spacer size={20} />
					<DropdownMenuOptionCustome
						label="Product"
						isAllowClear
						required
						handleChangeValue={(value: string[]) => setItemSelected(value)}
						valueSelectedItems={itemSelected}
						noSearch
						listItems={listProducts?.map(({ name, productId }:
							{ name: string, productId: string  }) => {
							return { value: productId , label: name }
						})}
						/>
					<Spacer size={30} />
				</Container>
			}
		/>
	);
};

const Footer = styled.div`
  display: flex;
  marginbottom: 12px;
  marginright: 12px;
  justifycontent: flex-end;
  gap: 12px;
`;

const Container = styled.div``;

export default ModalAddSalesDivision;
