import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router';
import { Redirect } from 'react-router-dom';
import useSWR, { mutate, useSWRInfinite } from 'swr';
import { Scrollbars } from 'react-custom-scrollbars';
import InviteChannelModal from '../../components/InviteChannelModal';

import { ChannelWrapper, Header, InviteButton, DragOver, DragText } from './styles';
import fetcher from '@utils/fetcher';
import ChatBox from '@components/ChatBox';
import ChatList from '@components/ChatList';
import useInput from '@hooks/useInput';
import axios from 'axios';
import { IChat, IUser, IChannel } from 'types/db';
import makeSection from '@utils/makeSection';
import useSocket from '@hooks/useSocket';
import { AiOutlinePlus } from 'react-icons/ai'

const Channel = () => {

    const { workspace, channel } = useParams<{ workspace: string; channel: string }>();
    const [socket] = useSocket(workspace);
    
    const { data: myData } = useSWR('/api/users', fetcher);
    const { data: channelData } = useSWR<IChannel>(`/api/workspaces/${workspace}/channels/${channel}`, fetcher);

    const { data: chatData, mutate: mutateChat, revalidate, setSize } = useSWRInfinite<IChat[]>(
        (index) => `/api/workspaces/${workspace}/channels/${channel}/chats?perPage=20&page=${index + 1}`,
        fetcher,
        {
            onSuccess(data) {
              if (data?.length === 1) {
                setTimeout(() => {
                  scrollbarRef.current?.scrollToBottom();
                }, 100);
              }
            },
        },
    );
    
    const { data: channelMembersData } = useSWR<IUser[]>(
        myData ? `/api/workspaces/${workspace}/channels/${channel}/members` : null,
        fetcher,
    );

    const [chat, setChat, handleChangeChat] = useInput('');
    const [showInviteChannelModal, setShowInviteChannelModal] = useState(false);
    const scrollbarRef = useRef<Scrollbars>(null);

    const isEmpty = chatData?.[0]?.length === 0;
    const isReachingEnd = isEmpty || (chatData && chatData[chatData.length -1]?.length < 20) || false;

    const [dragOver , setDragOver] = useState(false);

    const handleSubmitForm = useCallback((e) => {
        e.preventDefault();
        console.log(chat);
        if (chat?.trim() && chatData && channelData) {
            const savedChat = chat;
            mutateChat((prevChatData) => {
                prevChatData?.[0].unshift({
                    id: (chatData[0][0]?.id || 0) + 1,
                    content: savedChat,
                    UserId: myData.id,
                    User: myData,
                    ChannelId: channelData.id,
                    Channel: channelData,
                    createdAt: new Date(),
                });
                return prevChatData;
            }, false).then(() => {
                setChat('');
                localStorage.setItem(`${workspace}-${channel}`, new Date().getTime().toString());
                scrollbarRef.current?.scrollToBottom();
            });
            axios.post(`/api/workspaces/${workspace}/channels/${channel}/chats`, {
            content: chat,
            }).then(() => {
                revalidate();
            })
            .catch(console.error);
        }
    }, [chat, chatData, myData, channelData, workspace, channel]);

    const onMessage = useCallback((data: IChat) => {
        if (data.Channel.name === channel && (data.content.startsWith('uploads\\') || data.UserId !== myData?.id)) {
            mutateChat((chatData) => {
                chatData?.[0].unshift(data);
                return chatData;
            }, false).then(() => {
                if (scrollbarRef.current) {
                    if(
                        scrollbarRef.current.getScrollHeight() < scrollbarRef.current?.getScrollHeight() + scrollbarRef.current?.getScrollTop() + 150
                    ) {
                        console.log('scrolltobottom!');
                        setTimeout(() => {
                            scrollbarRef.current?.scrollToBottom();
                        }, 50);
                    }
                }
            })
        }
    }, [channel, myData])

    useEffect(() => {
        socket?.on('message', onMessage);
        return() => {
            socket?.off('message', onMessage);
        }
    }, [socket, onMessage]);

    // 로딩시 스크롤바 제일 아래로
    useEffect(() => {
        localStorage.setItem(`${workspace}-${channel}`, new Date().getTime().toString());
    }, [workspace, channel]);

    const handleInviteChannel = useCallback(() => {
        setShowInviteChannelModal(true);
    }, []);
    
    const onCloseModal = useCallback(() => {
        setShowInviteChannelModal(false);
    }, []);

    const onDrop = useCallback((e) => {
        e.preventDefault();
        console.log(e);
        const formData = new FormData();
        if (e.dataTransfer.items) {
            for (let i = 0; i < e.dataTransfer.items.length; i++) {
            if (e.dataTransfer.items[i].kind === 'file') {
                const file = e.dataTransfer.items[i].getAsFile();
                console.log('... file[' + i + '].name = ' + file.name);
                formData.append('image', file);
            }
            }
        } else {
            for (let i = 0; i < e.dataTransfer.files.length; i++) {
            console.log('... file[' + i + '].name = ' + e.dataTransfer.files[i].name);
            formData.append('image', e.dataTransfer.files[i]);
            }
        }
        axios.post(`/api/workspaces/${workspace}/channels/${channel}/images`, formData).then(() => {
            setDragOver(false);
            localStorage.setItem(`${workspace}-${channel}`, new Date().getTime().toString());
            revalidate();
        });
        },
    [channel, workspace]
    );
    

    const onDragOver = useCallback((e) => {
        e.preventDefault();
        console.log(e);
        setDragOver(true);
    }, []);

    if (!myData || !myData) {
        return null;
    }

    const chatSections = makeSection(chatData ? chatData.flat().reverse() : []);

    return (
        <ChannelWrapper onDrop={onDrop} onDragOver={onDragOver}>
            <Header>#{channel}
            <span>Member {channelMembersData?.length}</span>
            <InviteButton
            onClick={handleInviteChannel}
            ><AiOutlinePlus/></InviteButton>
            </Header>
            <ChatList chatSections={chatSections} scrollRef={scrollbarRef} setSize={setSize} isEmpty={isEmpty} isReachingEnd={isReachingEnd}/>
            <ChatBox chat={chat} handleChangeChat={handleChangeChat} handleSubmitForm = {handleSubmitForm} placeholder={`#${channel}에 메세지 보내기`}/>
            <InviteChannelModal show={showInviteChannelModal} onCloseModal={onCloseModal} setShowInviteChannelModal={setShowInviteChannelModal}/>
            {dragOver && <DragOver><DragText>Uploading</DragText></DragOver>}
        </ChannelWrapper>
    )
}

export default Channel;