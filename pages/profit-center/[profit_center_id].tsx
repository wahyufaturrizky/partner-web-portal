import { useDetailProfitCenter } from 'hooks/mdm/profit-center/useProfitCenter';
import { useRouter } from 'next/router'
import React from 'react'
import ProfitCenterCreate from './create';

export default function ProfitCenterDetail() {
  const router = useRouter()
  const companyId = localStorage.getItem("companyId")
  const companyCode = localStorage.getItem("companyCode")
  const { profit_center_id } = router.query;

  const { 
    data: detailProfitCenter,      
    isLoading: isLoadingProfit,
    isFetching: isFetchingProfit  } = useDetailProfitCenter({
    options: {
      onSuccess: () => {}
    },
    companyId: companyCode,
    id: profit_center_id
  }) 
   
  const propsDropdownField = {
    detailProfitCenter,
    isLoadingProfit,
    isFetchingProfit
  }
  return (
    <ProfitCenterCreate isUpdate = {true} {...propsDropdownField}/>
  )
}
