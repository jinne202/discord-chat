import React, { VFC, useCallback, useState, useEffect } from 'react';
import useSWR from 'swr';
import fetcher from '../../utils/fetcher';
import axios from 'axios'
import { Redirect, useParams } from 'react-router';
import { Switch, Route, Link } from 'react-router-dom';
import gravatar from 'gravatar';
import loadable from '@loadable/component';
import { toast } from 'react-toastify';
import { IChannel, IUser } from '../../types/db';
import Modal from '../../components/Modal'
import CreateChannelModal from '../../components/CreateChannelModal';
import InviteWorkspaceModal from '@components/InviteWorkspaceModal';
import InviteChannelModal from '../../components/InviteChannelModal';

import Menu from '../../components/Menu';

import { AiOutlinePlus } from 'react-icons/ai'
import { BsEggFried } from 'react-icons/bs'

const Channel = loadable(() => import('../../pages/Channel'));
const DirectMessage = loadable(() => import('../../pages/DirectMessage'));

import { LayoutWrapper, Header, ProfileImg, ChatspaceWrapper, ChatServer, Channels, Chats, ServerName, MenuScroll, UserProfile, ProfileImgWrapper, UserName, MenuButton, ChatButton, AddButton, Form, Label, Input, SubmitButton, InputWrapper, ChatServerModal, ChannelTitle, ChannelListWrapper, ChannelIcon} from './styles';
import useInput from '@hooks/useInput';
import DMList from '@components/DMList';
import ChannelList from '@components/ChannelList';
import { Socket } from 'node:dgram';
import useSocket from '@hooks/useSocket';

const Workspace: VFC = () => {

    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showCreatCSModal ,setShowCreateCSModal] = useState(false);
    const [showCSModal, setShowCSModal] = useState(false);
    const [showCreateChannelModal, setShowCreateChannelModal] = useState(false);
    const [showInviteWorkspaceModal, setShowInviteWorkspaceModal] = useState(false);
    const [showInviteChannelModal, setShowInviteChannelModal] = useState(false);
    const [newChatServer, setNewChatServer, handleNewChatServer] = useInput('');
    const [newChatUrl, setNewChatUrl, handleNewChatUrl] = useInput('');

    const { workspace } = useParams<{ workspace : string}>();

    const {data : userData, error, revalidate, mutate} = useSWR<IUser | false>('/api/users', fetcher, {
        dedupingInterval : 2000,
    });

    

    const { data : channelData } = useSWR<IChannel[]>(
        userData ? `/api/workspaces/${workspace}/channels` : null
        , fetcher
    );
    const [socket, disconnect] = useSocket(workspace);

    useEffect(() => {
        if (channelData && userData && socket ) {
            console.log(socket);
            socket.emit('login', { id : userData.id, channels: channelData.map((v) => v.id)})
        }
    }, [socket, channelData, userData]);

    useEffect(() => {
        return () => {
            disconnect();
        }
    }, [workspace, disconnect]);

    const onLogout = useCallback(() => {
        axios.post('/api/users/logout', null, {
            withCredentials : true,
        }).then(() => {
            mutate(false, false);
        })
    }, [mutate]);

    const handleUserProfile = useCallback(() => {
        setShowUserMenu((prev) => !prev)
    }, []);

    const handleCreateChatServer = useCallback(() => {
        setShowCreateCSModal(true);
    }, []);

    const onCloseModal = useCallback(() => {
        setShowCreateCSModal(false);
        setShowCreateChannelModal(false);
        setShowInviteWorkspaceModal(false);
        setShowInviteChannelModal(false);
    }, []);

    const onCreateChatServer = useCallback((e) => {
        e.preventDefault();
        if (!newChatServer || !newChatServer.trim()) return;
        if (!newChatUrl || !newChatUrl.trim()) return;
        
        axios.post('/api/workspaces', {
            workspace : newChatServer,
            url : newChatUrl
        }).then(() => {
            revalidate();
            setShowCreateCSModal(false);
            setNewChatServer('');
            setNewChatUrl('');
        }).catch((error) => {
            console.dir(error);
            toast.error(error.response?.data, {
                position : 'bottom-center'
            })
        });
    }, [newChatServer, newChatUrl]);

    const toggleChatServerModal = useCallback(() => {
        setShowCSModal((prev) => !prev);
    }, []);

    const handleAddChannel = useCallback(() => {
        setShowCreateChannelModal(true);
    }, [])

    const handleInviteWorkspace = useCallback(() => {
        setShowInviteWorkspaceModal(true);
    }, []);

    if (!userData) {
        return <Redirect to="/login"/>;
    }

    return (
        <LayoutWrapper>
            <ChatspaceWrapper>
                <ChatServer>
                    {userData?.Workspaces.map((ws) => {
                    return (
                        <Link key={ws.id} to={`/workspace/${ws.url}/channel/일반`}>
                            <ChatButton>{ws.name.slice(0, 1).toUpperCase()}</ChatButton>
                        </Link>
                    )
                    })}
                    <AddButton onClick={handleCreateChatServer}><AiOutlinePlus/></AddButton>
                </ChatServer>
                <Channels>
                    <ServerName>{userData?.Workspaces.find((v) => v.url === workspace)?.name}<span onClick={toggleChatServerModal}><AiOutlinePlus/></span></ServerName>
                    <MenuScroll>
                        <Menu style={{ top : 60, left : 85}} show={showCSModal} onCloseModal={toggleChatServerModal}>
                            <ChatServerModal>
                                <h2>서버이름^^</h2>
                                <MenuButton onClick={handleInviteWorkspace}>워크스페이스에 사용자 초대</MenuButton>
                                <MenuButton onClick={handleAddChannel}>채널 만들기</MenuButton>
                            </ChatServerModal>
                        </Menu>
                        <ChannelList/>
                        <DMList/>
                    </MenuScroll>
                    <UserProfile>
                            <ProfileImgWrapper onClick={handleUserProfile}>
                            <ProfileImg src={gravatar.url(userData.nickname, { s: '30px', d: 'retro'
                            })} alt={userData.nickname}/>
                            </ProfileImgWrapper>
                            {showUserMenu && 
                            <Menu style={{ bottom : 70, left : 85}} show={showUserMenu} onCloseModal={handleUserProfile}>
                                <MenuButton onClick={onLogout}>Logout</MenuButton>    
                            </Menu>}
                            <UserName>{userData.nickname}</UserName>
                    </UserProfile>
                </Channels>
                <Chats>
                    <Switch>
                        <Route path="/workspace/:workspace/channel/:channel" component={Channel}/>
                        <Route path="/workspace/:workspace/dm/:id" component={DirectMessage}/>
                    </Switch>
                </Chats>
            </ChatspaceWrapper>
            <Modal show={showCreatCSModal} onCloseModal={onCloseModal}>
                <Form onSubmit={onCreateChatServer}>
                    <Label>
                        <span>서버 이름</span>
                        <InputWrapper>
                        <Input value={newChatServer} onChange={handleNewChatServer}/>
                        </InputWrapper>
                    </Label>
                    <Label>
                        <span>서버 주소</span>
                        <Input value={newChatUrl} onChange={handleNewChatUrl}/>
                    </Label>
                    <SubmitButton type="submit">create!</SubmitButton>
                </Form>
            </Modal>
            <CreateChannelModal show={showCreateChannelModal} onCloseModal={onCloseModal} setShowCreateChannelModal={setShowCreateChannelModal}/>
            <InviteWorkspaceModal show={showInviteWorkspaceModal} onCloseModal={onCloseModal} setShowInviteWorkspaceModal={setShowInviteWorkspaceModal}/>
            <InviteChannelModal show={showInviteChannelModal} onCloseModal={onCloseModal} setShowInviteChannelModal={setShowInviteChannelModal}/>
        </LayoutWrapper>
    )
}

export default Workspace;