import useInput from '@hooks/useInput';
import axios from 'axios';
import React, { useCallback, VFC } from 'react';
import { useParams } from 'react-router';
import { toast } from 'react-toastify';
import Modal from '../Modal';
import useSWR from 'swr';
import fetcher from '../../utils/fetcher';
import { IUser } from '../../types/db';

import { Form, Label, Input, InputWrapper, SubmitButton } from './styles';

interface Props {
    show: boolean;
    onCloseModal: () => void;
    setShowInviteChannelModal: (flag: boolean) => void;
}

const InviteChannelModal: VFC<Props> = ({ show, onCloseModal, setShowInviteChannelModal }) => {

    const [newMember, setNewMember, handleNewMember] = useInput('');
    const { workspace, channel } = useParams<{ workspace: string; channel: string }>();

    const {data : userData } = useSWR<IUser | false>('/api/users', fetcher);

    const { revalidate: revalidateMembers } = useSWR<IUser[]>(
        userData && channel ? `/api/workspaces/${workspace}/channels/${channel}/members` : null,
        fetcher,
    );

    const handleInviteMember = useCallback((e) => {
        e.preventDefault();
        if(!newMember || !newMember.trim()) {
            return;
        }
        axios.post(`/api/workspaces/${workspace}/channels/${channel}/members`, {
            email : newMember,
        }).then(() => {
            revalidateMembers();
            setShowInviteChannelModal(false);
            setNewMember('');
        }).catch((error) => {
            console.dir(error);
            toast.error(error.response?.data, {position : 'bottom-center'});
        });
    }, [workspace, newMember]);

    return(
        <Modal show={show} onCloseModal={onCloseModal}>
                <Form onSubmit={handleInviteMember}>
                    <Label>
                        <span>채널 멤버 초대</span>
                        <InputWrapper>
                        <Input type="email" value={newMember} placeholder="이메일" onChange={handleNewMember}/>
                        </InputWrapper>
                    </Label>
                    <SubmitButton type="submit">Invite!</SubmitButton>
                </Form>
        </Modal>
    )
}

export default InviteChannelModal;