import React, { useState } from 'react';
import {
  Layout, Header,
  Notification, Spacer, MenuLogout,
  Col, Row, Text, Sidebar,
} from 'pink-lava-ui';
import Router from 'next/router';
import { useNotification } from 'hooks/notification/useNotification';
import styled from 'styled-components';
import {
  ICAccount,
  ICAccountSetting,
  ICLogout,
  ICArrowBottom,
  ICChangeLanguage,
  ICCompany,
  ICFlagIndonesia,
  ICFlagEnglish,
} from 'assets/icon';
import { useQueryHermesCompany } from 'hooks/master-data/hermes/useMasterCompany';
import TabIcon from '../assets/tab.svg';
import CalculatorIcon from '../assets/calculator.svg';
import AccountReceivableIcon from '../assets/fi-br-chart-histogram.svg';
import DollarIcon from '../assets/dollar.svg';
import BankIcon from '../assets/bank.svg';
import ComputerIcon from '../assets/computer.svg';
import DocumentSignedIcon from '../assets/document-signed.svg';

const menu: {[x:string]: any} = [
  { type: 'title', title: 'Overview' },
  {
    key: 'dashboard',
    type: 'menu',
    title: 'Dashboard',
    icon: TabIcon,
    content: () => 'Dashboard',
    onClick: () => Router.push('/dashboard'),
  },
  { type: 'divider' },
  { type: 'title', title: 'FINANCE' },
  {
    key: 'accounting',
    title: 'Accounting',
    icon: CalculatorIcon,
    children: [
      {
        key: 'general-journal',
        title: 'General Journal',
        content: () => 'General Journal',
        onClick: () => Router.push('/accounting/general-journal'),
      },
      {
        key: 'reversal-journal',
        title: 'Reversal Journal',
        content: () => 'Reversal Journal',
        onClick: () => Router.push('/accounting/reversal-journal'),
      },
      {
        key: 'accrual-journal',
        title: 'Accrual Journal',
        content: () => 'Accrual Journal',
        onClick: () => Router.push('/accounting/accrual-journal'),
      },
      {
        key: 'revaluation-forex',
        title: 'Revaluation Forex',
        content: () => 'Revaluation Forex',
        onClick: () => Router.push('/accounting/revaluation-forex'),
      },
    ],
  },
  {
    key: 'budget',
    title: 'Budget',
    icon: DollarIcon,
    children: [
      {
        key: 'create-budget',
        title: 'List',
        content: () => 'Budget List',
        onClick: () => Router.push('/budget/create-budget'),
      },
      {
        key: 'transfer-budget',
        title: 'Transfer',
        content: () => 'Transfer',
        onClick: () => Router.push('/budget/transfer-budget'),
      },
      {
        key: 'supplement-or-return-budget',
        title: 'Supplement or Return',
        content: () => 'Supplement or Return Budget',
        onClick: () => Router.push('/budget/supplement-or-return-budget'),
      },
      // {
      //   key: 'close-budget',
      //   title: 'Close Budget',
      //   content: () => 'Close Budget',
      //   onClick: () => Router.push('/budget/close-budget'),
      // },
      {
        key: 'carry-forward-commitment-budget',
        title: 'Carry Forward Commitment',
        content: () => 'Carry Forward Commitment',
        onClick: () => Router.push('/budget/carry-forward-commitment-budget'),
      },
    ],
  },
  {
    key: 'asset',
    title: 'Asset',
    icon: ComputerIcon,
    children: [
      {
        key: 'asset-create',
        title: 'List',
        content: () => 'Asset List',
        onClick: () => Router.push('/asset/asset-create'),
      },
      {
        key: 'asset-opname',
        title: 'Opname',
        content: () => 'Asset Opname',
        onClick: () => Router.push('/asset/asset-opname'),
      },
      {
        key: 'asset-mutation',
        title: 'Mutation',
        content: () => 'Asset Mutation',
        onClick: () => Router.push('/asset/asset-mutation'),
      },
      {
        key: 'gr-mutation',
        title: 'GR Mutation',
        content: () => 'GR Asset Mutation',
        onClick: () => Router.push('/asset/gr-mutation'),
      },
      {
        key: 'asset-disposal',
        title: 'Disposal',
        content: () => 'Asset Disposal',
        onClick: () => Router.push('/asset/asset-disposal'),
      },
      {
        key: 'asset-depreciation',
        title: 'Depreciation',
        content: () => 'Asset Depreciation',
        onClick: () => Router.push('/asset/asset-depreciation'),
      },
      {
        key: 'adjustment-asset-value',
        title: 'Adjustment Value',
        content: () => 'Adjustment Asset Value',
        onClick: () => Router.push('/asset/adjustment-asset-value'),
      },
    ],
  },
  {
    key: 'cash-bank',
    title: 'Cash & Bank',
    icon: BankIcon,
    content: () => 'Cash & Bank',
    onClick: () => Router.push('/cash-bank'),
  },
  {
    key: 'account-receivable',
    title: 'Account Receivable',
    icon: AccountReceivableIcon,
    children: [
      {
        key: 'account-receivable/list',
        title: 'List',
        content: () => 'Account Receivable List',
        onClick: () => Router.push('/account-receivable/list'),
      },
      {
        key: 'account-receivable/giro',
        title: 'Cek / Giro',
        content: () => 'Cek / Giro',
        onClick: () => Router.push('/account-receivable/giro'),
      },
      {
        key: 'account-receivable/down-payment',
        title: 'Down Payment',
        content: () => 'Down Payment',
        onClick: () => Router.push('/account-receivable/down-payment'),
      },
    ],
  },
  {
    key: 'account-payable',
    title: 'Account Payable',
    icon: AccountReceivableIcon,
    children: [
      {
        key: 'account-payable/vendor-invoicing',
        title: 'Vendor Invoicing',
        content: () => 'Vendor Invoicing',
        onClick: () => Router.push('/account-payable/vendor-invoicing'),
      },
      {
        key: 'account-payable/purchasing-verification',
        title: 'Purchasing Verification',
        content: () => 'Purchasing Verification',
        onClick: () => Router.push('/account-payable/purchasing-verification'),
      },
      {
        key: 'account-payable/post-accounting-verification',
        title: 'Post Accounting Verification',
        content: () => 'Post Accounting Verification',
        onClick: () => Router.push('/account-payable/post-accounting-verification'),
      },
      {
        key: 'account-payable/down-payment',
        title: 'Down Payment',
        content: () => 'Down Payment',
        onClick: () => Router.push('/account-payable/down-payment'),
      },
      {
        key: 'account-payable/invoice-billing',
        title: 'Invoice Billing',
        content: () => 'Invoice Billing',
        onClick: () => Router.push('/account-payable/invoice-billing'),
      },
    ],
  },
  {
    key: 'tax',
    type: 'menu',
    title: 'Tax Verification',
    icon: DollarIcon,
    content: () => 'Tax',
    onClick: () => Router.push('/tax'),
  },
  { type: 'title', title: 'CLAIM' },
  {
    key: 'claim-web',
    title: 'Claim Web',
    icon: DocumentSignedIcon,
    children: [
      {
        key: 'claim-payment',
        title: 'Claim Payment',
        content: () => 'Claim',
        onClick: () => Router.push('/claim-web/claim-payment'),
      },
      {
        key: 'create-claim-web',
        title: 'Create Claim Web',
        content: () => 'Create Claim Web',
        onClick: () => Router.push('/claim-web/create-claim-web'),
      },
      {
        key: 'verification-claim-web',
        title: 'Verification',
        content: () => 'Verification',
        onClick: () => Router.push('/claim-web/verification-claim-web'),
      },
      {
        key: 'tax-verification-claim-web',
        title: 'Tax Verification',
        content: () => 'Tax Verification',
        onClick: () => Router.push('/claim-web/tax-verification-claim-web'),
      },
      {
        key: 'acc-verification-claim-web',
        title: 'Acc Claim Verification',
        content: () => 'Create Claim Web',
        onClick: () => Router.push('/claim-web/acc-verification-claim-web'),
      },
      {
        key: 'down-payment',
        title: 'Down Payment',
        content: () => 'Down Payment',
        onClick: () => Router.push('/claim-web/down-payment'),
      },
    ],
  },
  { type: 'title', title: 'MASTER DATA' },
  {
    key: 'master-data',
    title: 'Master Data FICO',
    icon: TabIcon,
    children: [],
  },
  { type: 'divider' },
];

// const listTab = [
//   { title: 'Home', url: '/' },
//   { title: 'Marketing', url: '/marketing' },
//   { title: 'Sales', url: '/sales' },
//   { title: 'Logistic', url: '/logistic' },
//   { title: 'Finance', url: '/' },
//   { title: 'Bp Support', url: '/' },
//   { title: 'eDot', url: '/' },
// ];
// const defaultTab = 'Finance';
const itemsMenu = [
  { label: 'Config', url: '/dashboard?menu=config' },
  { label: 'Master Data Management', url: '/dashboard?menu=mdm' },
  { label: 'Finance', url: '/fico' },
];

const getLinkViewDetail = (screenCode: any) => {
  const approvalEngineScreen = {
    'mdm.salesman': 'salesman',
    'mdm.pricing.structure': 'pricing-structure',
  };

  const url = `/${approvalEngineScreen[screenCode]}`;
  return url;
};

const flexStyles = {
  display: 'flex',
  alignItems: 'center',
  gap: '.5rem',
  paddingBottom: '1rem',
  fontSize: '14px',
  cursor: 'pointer',
};

function AdminLayout({ children }) {
  const [isChangeLang, setIsChangeLang] = useState(false);

  const notification = useNotification();
  const getListNotification = notification.getList({});
  const totalUnread = getListNotification?.data?.total_unread;
  const notifItems = getListNotification?.data?.rows?.map((items) => ({
    key: items?.id,
    id: items?.id,
    isRead: !!items?.read_date,
    content: items?.message || '-',
    link: getLinkViewDetail(items?.screen_code),
  }));

  // eslint-disable-next-line no-unused-vars
  const queryCompanies = useQueryHermesCompany({
    onSuccess: (res) => {
      const companies = res.rows;
      const defaultCompany = localStorage.getItem('companyId') !== 'undefined' ? localStorage.getItem('companyId') : res.rows[0].id;

      if (!defaultCompany || localStorage.getItem('companyId') === 'undefined') {
        localStorage.setItem('companyId', res.rows?.[0].id);
        localStorage.setItem('companyCode', res.rows?.[0].code);
      }

      menu.unshift({
        type: 'dropdown',
        items: companies,
        onChange: (value) => handleChangeCompany(companies, value),
        default: companies.find((company) => company.id === Number(defaultCompany)),
      });
    },
  });

  const handleChangeCompany = (companies, value) => {
    const selectedCompany = companies.find((comp) => comp.name === value);
    localStorage.setItem('companyId', selectedCompany.id);
    localStorage.setItem('companyCode', selectedCompany.code);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sidebar
        style={{ height: '100% !mportant' }}
        logoSubtitle="Nabati Group"
        logo="/fico/logo-nabati.svg"
        menu={menu}
        defaultMenu="dashboard"
      />
      <Layout className="site-layout">
        <Header
          mode="horizontal"
          onClick={(e) => { window.location.href = itemsMenu[e.key]?.url; }}
          selectedKeys={['2']}
          items={itemsMenu}
        >
          <div
            style={{
              display: 'flex',
              // paddingTop: ".7rem",
              // marginBottom: ".78rem",
              background: '#fff',
              alignItems: 'center',
            }}
          >
            <Notification
              iconSize={25}
              totalUnread={totalUnread}
              items={notifItems}
              viewAll={() => {
                window.location.href = '/notification';
              }}
            />
            <Spacer size={15} />

            {!isChangeLang && (
            <MenuLogout
              menu={(
                <WrapperMenuLogout>
                  <WrapeprProfile>
                    <ICAccount />
                    <div>
                      <TextName>Admin</TextName>
                      <TextRole>Super User</TextRole>
                    </div>
                  </WrapeprProfile>
                  <a
                    style={{ color: '#000' }}
                    target="_blank"
                    href="https://accounts.edot.id/infopribadi"
                    rel="noopener noreferrer"
                  >
                    <div style={flexStyles}>
                      <ICAccountSetting />
                      <p>Account Settings</p>
                    </div>
                  </a>
                  <div style={flexStyles}>
                    <ICCompany />
                    <p>Company List</p>
                  </div>
                  <div role="none" style={flexStyles} onClick={() => setIsChangeLang(true)}>
                    <ICChangeLanguage />
                    <p>Change Language</p>
                  </div>
                  <div
                    role="none"
                    style={{ ...flexStyles, paddingBottom: 0 }}
                    onClick={() => {
                      localStorage.clear();
                      window.location.href = '/login';
                    }}
                  >
                    <ICLogout />
                    <p>Logout</p>
                  </div>
                </WrapperMenuLogout>
                )}
            >
              <MenuDropdown>
                <div
                  style={{
                    gap: '5px', display: 'flex', alignItems: 'center', fontSize: '14px',
                  }}
                >
                  <ICAccount size={64} />
                  <div>
                    <TextName>Admin</TextName>
                  </div>
                </div>
                <ICArrowBottom />
              </MenuDropdown>
            </MenuLogout>
            )}

            {isChangeLang && (
              <LanguageOption>
                <Col>
                  <div
                    role="none"
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      localStorage.setItem('lan', 'id-ID');
                      setIsChangeLang(false);
                    }}
                  >
                    <Text variant="headingRegular">Change Language</Text>
                    <Row gap="12px" alignItems="center">
                      <ICFlagIndonesia />
                      <p>Indonesia</p>
                    </Row>
                  </div>

                  <div
                    role="none"
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      localStorage.setItem('lan', 'en-US');
                      setIsChangeLang(false);
                    }}
                  >
                    <Row gap="12px" alignItems="center">
                      <ICFlagEnglish />
                      <p>English</p>
                    </Row>
                  </div>
                </Col>
              </LanguageOption>
            )}
          </div>
        </Header>
        <div style={{ padding: '20px' }}>{children}</div>
      </Layout>
    </Layout>
  );
}

const WrapeprProfile = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border-bottom: 1px solid #f4f4f4;
  padding-bottom: 1rem;
  margin-bottom: 1rem;
  cursor: pointer;
`;

const WrapperMenuLogout = styled.div`
  width: 200px;
  // height: 272px;
  background: #ffffff;
  box-shadow: 0px 4px 16px rgba(170, 170, 170, 0.15);
  border-radius: 16px;
  padding: 20px;
  margin-top: -60px;
`;

const MenuDropdown = styled.div`
  border: 1.5px solid #aaaaaa;
  margin-right: 1rem;
  border-radius: 24px;
  width: 180px;
  height: 3rem;
  padding: 16px 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const TextName = styled.p`
  margin: 0;
  fontSize: '16px',
  fontWeight: 600;
  color: #000000;
`;

const TextRole = styled.p`
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 24px;
  margin: 0;
  color: #666666;
`;

const LanguageOption = styled.div`
  top: 1rem;
  right: 1rem;
  position: absolute;
  background-color: white;
  width: 200px;
  // height: 160px;
  box-shadow: 0px 4px 16px rgba(170, 170, 170, 0.15);
  border-radius: 16px;
  padding: 20px;
  padding-bottom: 0px;
`;

export default AdminLayout;
