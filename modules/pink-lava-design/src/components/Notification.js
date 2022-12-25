import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Badge, Divider } from 'antd';
import { Row } from './Row';
import { BellOutlined } from '@ant-design/icons';
import { Button } from './Button';

export const Notification = ({ items, totalUnread, viewAll, iconSize = 30 }) => {
    const [show, setShow] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) {
                setShow(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div ref={ref}>
            <Badge dot={totalUnread > 0} offset={[-4, 4]}>
                <BellOutlined
                    style={{ fontSize: iconSize, cursor: 'pointer' }}
                    onClick={() => {
                        setShow(!show);
                    }}
                />
            </Badge>

            {show && (
                <NotificationContainer>
                    <NotificationHeader>
                        <p
                            style={{
                                fontWeight: '600',
                                fontSize: '24px',
                                lineHeight: '32.74px',
                                marginBottom: 0,
                            }}>
                            Notification
                        </p>
                        {totalUnread > 0 && <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                            <Badge count={`${totalUnread} New`} style={{ backgroundColor: '#EB008B' }} />
                        </div>}
                    </NotificationHeader>
                    <Divider style={{ margin: 0 }} />
                    <NotificationContent>
                        {items.length ? (
                            items.map((el, index) => (
                                <Row
                                    key={index}
                                    style={{
                                        padding: '15px',
                                        backgroundColor: el.isRead ? '#FFFFFF' : '#F4FBFC',
                                        ...(items.length === index + 1 && {
                                            borderBottomLeftRadius: '16px',
                                            borderBottomRightRadius: '16px',
                                        }),
                                        ...(!(items.length === index + 1) && {
                                            borderBottom: '1px solid #f4f4f4',
                                        }),
                                    }}
                                    onClick={() => {
                                        el.link && el.link()
                                    }}
                                >
                                    {el.content}
                                </Row>
                            ))
                        ) : (
                            <div
                                style={{
                                    fontWeight: 'bold',
                                    display: 'flex',
                                    justifyContent: 'center',
                                }}>
                                Tidak Ada Notifikasi
                            </div>
                        )}
                    </NotificationContent>
                    {totalUnread > 0 && 
                        <NotificationViewAll onClick={() => {
                            viewAll && viewAll();
                            setShow(!show);
                        }}>
                            <Button variant="ghost">View All</Button>
                        </NotificationViewAll>
                    }
                </NotificationContainer>
            )}
        </div>
    );
};

const NotificationViewAll = styled.div`
    height: 48px;
    display: flex;
    justify-content: center;
    align-items: center;
`

const NotificationContainer = styled.div`
    z-index: 1031;
    position: fixed;
    inset: 0 0 auto auto;
    margin: 0px;
    transform: translate3d(-15px, 60px, 0px);
    display: flex;
    flex-direction: column;
    list-style: none;
    width: 552px;
    animation: all 0.3s ease 1;
    border-radius: 16px;
    background-color: #fff;
    box-shadow: 0 0 50px 0 rgb(82 63 105 / 15%);
`;

const NotificationHeader = styled.div`
    display: flex;
    padding: 15px;
    gap: 10px;
`;

const NotificationContent = styled.div``;
