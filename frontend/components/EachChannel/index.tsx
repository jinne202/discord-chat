import { IChannel, IUser } from '../../types/db';
import fetcher from '@utils/fetcher';
import React, { useEffect, VFC } from 'react';
import { useParams } from 'react-router';
import { NavLink, useLocation } from 'react-router-dom';
import useSWR from 'swr';
import { BsEggFried } from 'react-icons/bs'

import { ListWrapper, ListTitle, ListIcon, MessageCount } from './styles';

interface Props {
  channel: IChannel;
}

const EachChannel: VFC<Props> = ({ channel }) => {
  const { workspace } = useParams<{ workspace?: string }>();
  const location = useLocation();
  const { data: userData } = useSWR<IUser>('/api/users', fetcher, {
    dedupingInterval: 2000, // 2초
  });
  const date = localStorage.getItem(`${workspace}-${channel.name}`) || 0;
  const { data: count, mutate } = useSWR<number>(
    userData ? `/api/workspaces/${workspace}/channels/${channel.name}/unreads?after=${date}` : null,
    fetcher,
  );

  useEffect(() => {
    if (location.pathname === `/workspace/${workspace}/channel/${channel.name}`) {
      mutate(0);
    }
  }, [mutate, location.pathname, workspace, channel]);

  return (
        <NavLink
            key={channel.name}
            to={`/workspace/${workspace}/channel/${channel.name}`}>
            <ListWrapper>
                <ListIcon><BsEggFried/></ListIcon>
                <ListTitle>{channel.name}{(count && count > 0 && <MessageCount>{count}</MessageCount>) || null}</ListTitle>
            </ListWrapper>
        </NavLink>
  );
};

export default EachChannel;