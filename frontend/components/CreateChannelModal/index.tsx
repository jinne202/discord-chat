import useInput from '@hooks/useInput';
import axios from 'axios';
import React, { useCallback, VFC } from 'react';
import { useParams } from 'react-router';
import { toast } from 'react-toastify';
import Modal from '../Modal';
import useSWR from 'swr';
import fetcher from '../../utils/fetcher';
import { IChannel, IUser } from '../../types/db';

import { Form, Label, Input, InputWrapper, SubmitButton } from './styles';

interface Props {
    show: boolean;
    onCloseModal: () => void;
    setShowCreateChannelModal: (flag: boolean) => void;
}

const CreateChannelModal: VFC<Props> = ({ show, onCloseModal, setShowCreateChannelModal }) => {

    const [newChannel, setNewChannel, handleNewChannel] = useInput('');
    const { workspace, channel } = useParams<{workspace: string; channel: string}>();

    const {data : userData, error, revalidate, mutate} = useSWR<IUser | false>('/api/users', fetcher, {
        dedupingInterval : 2000,
    });

    const { data : channelData, revalidate: revalidateChannel } = useSWR<IChannel[]>(
        userData ? `/api/workspaces/${workspace}/channels` : null
        , fetcher
    );

    const handleCreateChannel = useCallback((e) => {
        e.preventDefault();
        axios.post(`/api/workspaces/${workspace}/channels`, {
            name : newChannel,
        }, {
            withCredentials : true,
        }).then(() => {
            setShowCreateChannelModal(false);
            revalidateChannel();
            setNewChannel('');
        }).catch((error) => {
            console.dir(error);
            toast.error(error.response?.data, {position : 'bottom-center'});
        });
    }, [newChannel]);

    return(
        <Modal show={show} onCloseModal={onCloseModal}>
                <Form onSubmit={handleCreateChannel}>
                    <Label>
                        <span>채널 이름</span>
                        <InputWrapper>
                        <Input value={newChannel} onChange={handleNewChannel}/>
                        </InputWrapper>
                    </Label>
                    <SubmitButton type="submit">create!</SubmitButton>
                </Form>
        </Modal>
    )
}

export default CreateChannelModal;