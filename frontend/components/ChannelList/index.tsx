import React, { FC } from 'react';
import { useParams } from 'react-router-dom';
import useSWR from 'swr';
import fetcher from '../../utils/fetcher';
import { IChannel, IUser } from '../../types/db';
import EachChannel from '../EachChannel';

interface Props {
    channelData?: IChannel[];
}

const ChannelList: FC<Props> = () => {

    const { workspace } = useParams<{ workspace?: string}>();
    const { data: userData } = useSWR<IUser>('/api/users', fetcher, {
        dedupingInterval: 2000,
    });
    
    const { data: channelData } = useSWR<IChannel[]>(userData ? `/api/workspaces/${workspace}/channels` : null, fetcher);


    return (
        <>
            {channelData?.map((channel) => {
                return <EachChannel key={channel.id} channel={channel} />;
            })}
        </>
    )
}

export default ChannelList;