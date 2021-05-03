import React, { useEffect, VFC } from 'react';
import { useParams } from 'react-router';
import { NavLink, useLocation } from 'react-router-dom';
import useSWR from 'swr';
import { IUser } from '../../types/db';
import fetcher from '@utils/fetcher';
import { BsCaretDownFill, BsOutlet } from "react-icons/bs";

import { ListWrapper, ListTitle, ListIcon, MessageCount } from './styles';

interface Props {
    member: IUser;
    isOnline: boolean;
}

const EachDM: VFC<Props> = ({ member, isOnline }) => {
    const { workspace } = useParams<{ workspace?: string }>();
    const location = useLocation();
    const { data: userData } = useSWR<IUser>('/api/users', fetcher, {
      dedupingInterval: 2000, // 2초
    });
    const date = localStorage.getItem(`${workspace}-${member.id}`) || 0;
    const { data: count, mutate } = useSWR<number>(
      userData ? `/api/workspaces/${workspace}/dms/${member.id}/unreads?after=${date}` : null,
      fetcher,
    );
  
    useEffect(() => {
      if (location.pathname === `/workspace/${workspace}/dm/${member.id}`) {
        mutate(0);
      }
    }, [mutate, location.pathname, workspace, member]);
  
    return (
        <NavLink key={member.id} activeClassName="selected" to={`/workspace/${workspace}/dm/${member.id}`}>
        <ListWrapper><ListIcon isOnline={isOnline}><BsOutlet/></ListIcon><ListTitle>{member.nickname}{(count && count > 0 && <MessageCount>{count}</MessageCount>) || null}</ListTitle>
        </ListWrapper>
        </NavLink>
    );
  };
  
export default EachDM;