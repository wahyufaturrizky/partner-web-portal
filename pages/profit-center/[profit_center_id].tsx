import { useDetailProfitCenter } from 'hooks/mdm/profit-center/useProfitCenter';
import { useRouter } from 'next/router'
import React from 'react'
import ProfitCenterCreate from './create';

export default function ProfitCenterDetail() {
  const router = useRouter()
  const { profit_center_id } = router.query;
  const { data: detailProfitCenter } = useDetailProfitCenter({
    options: {
      onSuccess: () => {}
    },
    companyId: "KSNI",
    id: profit_center_id
  }) 
   
  const propsDropdownField = {
    detailProfitCenter
  }
  return (
    <ProfitCenterCreate isUpdate = {true} {...propsDropdownField}/>
  )
}
