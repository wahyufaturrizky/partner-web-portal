import styled from 'styled-components';
import React from 'react';
import { ReactComponent as ArrowLeft } from '../assets/arrow-left.svg';
import { ReactComponent as ArrowRight } from '../assets/arrow-right.svg';

export const Pagination = ({ pagination }) => {
    const {
        page, // current page
        totalPages, // total number of pages
        size, // size of the pagination, considering arrows and numbers
        totalItems, // valid total number of items
        itemsPerPage, // valid number of items per page
    } = pagination;

    const arrayPageSize = [20, 40, 60, 80, 100];
    // let i = 0;
    // while(i < totalItems) {
    //   i += itemsPerPage;
    //   arrayPageSize.push(i);
    // }

    const arrayPageNumber = Array.from(Array(totalPages).keys());

    const showingStart = (page - 1) * itemsPerPage + 1;
    const leftItem = totalItems - ((page - 1) * itemsPerPage);
    const showingEnd = leftItem < itemsPerPage ? totalItems : page * itemsPerPage
    return (
        <Container>
            <Flex style={{ justifyContent: 'space-between' }}>
                <Flex>
                    <Text>Items per page</Text>
                    <Select
                        value={itemsPerPage}
                        onChange={(e) => {
                            pagination.setItemsPerPage(Number(e.target.value));
                        }}>
                        {arrayPageSize.map((pageSize) => (
                            <option key={pageSize} value={pageSize}>
                                {pageSize}
                            </option>
                        ))}
                    </Select>
                    <Text>
                        Showing {showingStart}-{showingEnd} of{' '}
                        {totalItems} items
                    </Text>
                </Flex>

                <Flex style={{ gap: '16px' }}>
                    <Flex style={{ gap: '12px' }}>
                        <Select
                            value={page}
                            onChange={(e) => {
                                pagination.goTo(Number(e.target.value));
                            }}>
                            {arrayPageNumber.map((pageSize) => (
                                <option key={pageSize + 1} value={pageSize + 1}>
                                    {pageSize + 1}
                                </option>
                            ))}
                        </Select>
                        <Text>of {totalPages} Pages</Text>
                    </Flex>
                    <Flex style={{ gap: '4px' }}>
                        <ArrowLeft
                            style={{ cursor: 'pointer' }}
                            onClick={() => pagination.previous()}
                        />
                        <ArrowRight
                            style={{ cursor: 'pointer' }}
                            onClick={() => pagination.next()}
                        />
                    </Flex>
                </Flex>
            </Flex>
        </Container>
    );
};

const Select = styled.select`
    background: #ffffff;
    border: 1px solid #888888;
    box-sizing: border-box;
    border-radius: 4px;
    width: 48px;
    height: 32px;
`;

const Flex = styled.div`
    display: flex;
    gap: 8px;
    align-items: center;
`;

const Text = styled.div`
    font-weight: 400;
    font-size: 14px;
    line-height: 24px;
    color: #000000;
`;

const Container = styled.div`
    background: #ffffff;
    border-radius: 8px;
    width: 100%;
    height: 40px;
    padding: 4px 0px;
`;
