import styled from "styled-components";
import { mdmDownloadService } from "lib/client";
import { Button } from "pink-lava-ui";

import DownloadSvg from "assets/icons/ic-download.svg";
import UploadSvg from "assets/icons/ic-upload.svg";

export const options = ({ status: { active, inactive, waiting, reject, draft } }) => [
  {
    label: <Flex> Active {active > 0 && <Notif>{active}</Notif>}</Flex>,
    value: "Active",
  },
  {
    label: <Flex> Inactive {inactive > 0 && <Notif>{inactive}</Notif>} </Flex>,
    value: "Inactive",
  },
  {
    label: <Flex> Waiting for Approval {waiting > 0 && <Notif>{waiting}</Notif>} </Flex>,
    value: "Waiting for Approval",
  },
  {
    label: <Flex> Rejected {reject > 0 && <Notif>{reject}</Notif>} </Flex>,
    value: "Rejected",
  },
  {
    label: <Flex>Draft {draft > 0 && <Notif>{draft}</Notif>}</Flex>,
    value: "Draft",
  },
];

export const downloadOptions = () => [
  {
    key: 1,
    value: (
      <FlexElement>
        <DownloadSvg />
        <p>Download Template</p>
      </FlexElement>
    ),
  },
  {
    key: 2,
    value: (
      <FlexElement>
        <UploadSvg />
        <p>Upload Template</p>
      </FlexElement>
    ),
  },
  {
    key: 3,
    value: (
      <FlexElement>
        <DownloadSvg />
        <p>Download Data</p>
      </FlexElement>
    ),
  },
];

export const downloadFileSalesDivision = (params) =>
  mdmDownloadService("/sales-division/template/download", { params }).then((res) => {
    let dataUrl = window.URL.createObjectURL(new Blob([res.data]));
    let tempLink = document.createElement("a");
    tempLink.href = dataUrl;
    tempLink.setAttribute("download", `sales_division${new Date().getTime()}.xlsx`);
    tempLink.click();
  });

export const dropdownStatus = [
  { id: "Active", value: "Active" },
  { id: "Inactive", value: "Inactive" },
];

export const columnsDetailCustomers = [
  {
    title: "Branch Name",
    dataIndex: "branch",
  },
  {
    title: "Visit Frequency",
    dataIndex: "frequency",
  },
  {
    title: "Visit Day",
    dataIndex: "day",
  },
  {
    title: "Date",
    dataIndex: "date",
  },
  {
    title: "Start Time",
    dataIndex: "startTime",
  },
  {
    title: "End Time",
    dataIndex: "endTime",
  },
  {
    title: "Duration",
    dataIndex: "duration",
  },
];

// export const columnsSalesDivision = [
//   {
//     title: "Division ID",
//     dataIndex: "code",
//     width: "30%"
//   },
//   {
//     title: "Division Name",
//     dataIndex: "divisiName",
//     width: "30%"
//   },
//   {
//     title: "Product",
//     dataIndex: "product",
//     width: "20%"
//   },
//   {
//     title: "Action",
//     render: (items) => (
//       <Button
//         size="small"
//         onClick={() => {
//           setFormsUpdate({ ...items })
//           setVisible({ ...visible, update: true })
//         }}
//         variant="tertiary"
//       >
//         View Detail
//       </Button>
//     )
//   },
// ]

const Notif = styled.div`
  background: #ffffff;
  border: 1px solid #eb008b;
  box-sizing: border-box;
  border-radius: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 20px;
  height: 20px;
  font-weight: 600;
  font-size: 10px;
  line-height: 14px;
  color: #eb008b;
`;

const Flex = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 7.5px;
`;

const FlexElement = styled.div`
  display: flex;
  alignitems: center;
  gap: 5;
`;
