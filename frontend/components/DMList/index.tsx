import React, { useCallback, useEffect, useState, FC } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import useSWR from 'swr';
import fetcher from '../../utils/fetcher';
import { IUser, IUserWithOnline } from '../../types/db';
import { BsCaretDownFill, BsOutlet } from "react-icons/bs";

import EachDM from '../EachDM';
import { CollapseButton, DMTitle, Title, ListWrapper, ListTitle, ListIcon } from './styles';

import useSocket from '@hooks/useSocket';

const DMList:FC = () => {

    const { workspace } = useParams<{ workspace?: string}>();
    const { data: userData } = useSWR<IUser>('/api/users', fetcher, {
        dedupingInterval: 2000,
    });
    const { data: memberData } = useSWR<IUserWithOnline[]>(
        userData ? `/api/workspaces/${workspace}/members` : null,
        fetcher,
    );
    
    const [socket] = useSocket(workspace);
    const [DMCollapse, setDMCollapse] = useState(false);
    const [onlineList, setOnlineList] = useState<number[]>([]);

    const toggleDMCollapse = useCallback(() => {
        setDMCollapse((prev) => !prev);
    }, []);

    useEffect(() => {
        console.log('DMList: workspace 바꼈다', workspace);
        setOnlineList([]);
    }, [workspace]);

    useEffect(() => {
        socket?.on('onlineList', (data: number[]) => {
            setOnlineList(data);
        });
        return () => {
            socket?.off('onlineList');
        }
    }, [socket]);

    return (
        <>
            <DMTitle onClick={toggleDMCollapse}>
                <CollapseButton collapse={DMCollapse} >
                    <BsCaretDownFill/>
                </CollapseButton>
                <Title>
                DirectMessage
                </Title>
            </DMTitle>
            {
                !DMCollapse &&
                memberData?.map((member) => {
                    const isOnline = onlineList.includes(member.id);
                    return (
                    <EachDM key={member.id} member={member} isOnline={isOnline} />
                    )
                })
            }
        </>
    )
}

export default DMList;