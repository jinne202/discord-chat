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
    setShowInviteWorkspaceModal: (flag: boolean) => void;
}

const InviteWorkspaceModal: VFC<Props> = ({ show, onCloseModal, setShowInviteWorkspaceModal }) => {

    const [newMember, setNewMember, handleNewMember] = useInput('');
    const { workspace } = useParams<{workspace: string; channel: string}>();

    const {data : userData } = useSWR<IUser | false>('/api/users', fetcher);

    const { revalidate: revalidateMember } = useSWR<IChannel[]>(
        userData ? `/api/workspaces/${workspace}/members` : null,
        fetcher,
      );

    const handleInviteMember = useCallback((e) => {
        e.preventDefault();
        if(!newMember || !newMember.trim()) {
            return;
        }
        axios.post(`/api/workspaces/${workspace}/members`, {
            email : newMember,
        }).then(() => {
            revalidateMember();
            setShowInviteWorkspaceModal(false);
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
                        <span>서버 멤버 초대</span>
                        <InputWrapper>
                        <Input type="email" value={newMember} placeholder="이메일" onChange={handleNewMember}/>
                        </InputWrapper>
                    </Label>
                    <SubmitButton type="submit">Invite!</SubmitButton>
                </Form>
        </Modal>
    )
}

export default InviteWorkspaceModal;