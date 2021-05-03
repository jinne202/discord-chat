import React, { useCallback, useEffect, useRef, useState } from 'react';
import gravatar from 'gravatar';
import { useParams } from 'react-router';
import useSWR, { mutate, useSWRInfinite } from 'swr';
import { Scrollbars } from 'react-custom-scrollbars';

import { DMPageWrapper, Header, DragOver, DragText } from './styles';
import fetcher from '@utils/fetcher';
import ChatBox from '@components/ChatBox';
import ChatList from '@components/ChatList';
import useInput from '@hooks/useInput';
import axios from 'axios';
import { IDM } from 'types/db';
import makeSection from '@utils/makeSection';
import useSocket from '@hooks/useSocket';

const DirectMessage = () => {

    const { workspace, id } = useParams<{ workspace: string, id:string }>();

    const { data: userData } = useSWR(`/api/workspaces/${workspace}/users/${id}`, fetcher);

    const { data: myData } = useSWR(`/api/users`, fetcher);

    const { data: chatData, mutate: mutateChat, revalidate, setSize} = useSWRInfinite<IDM[]>(
        (index) => `/api/workspaces/${workspace}/dms/${id}/chats?perPage=20&page=${index + 1}`, fetcher, 
        {
            onSuccess(data) {
              if (data?.length === 1) {
                setTimeout(() => {
                  scrollbarRef.current?.scrollToBottom();
                }, 100);
              }
            }
        },
    );

    const [socket] = useSocket(workspace);
    const isEmpty = chatData?.[0]?.length === 0;
    const isReachingEnd = isEmpty || (chatData && chatData[chatData.length -1]?.length < 20) || false;

    const [chat, setChat, handleChangeChat] = useInput('');

    const scrollbarRef = useRef<Scrollbars>(null);

    const [dragOver , setDragOver] = useState(false);

    const handleSubmitForm = useCallback((e) => {
        e.preventDefault();
        console.log(chat);
        if (chat?.trim() && chatData) {
            const savedChat = chat;
            mutateChat((prevChatData) => {
                prevChatData?.[0].unshift({
                    id: (chatData[0][0]?.id) || 0 + 1,
                    content: savedChat,
                    SenderId: myData.id,
                    Sender: myData,
                    ReceiverId: userData.id,
                    Receiver: userData,
                    createdAt: new Date(),
                });
                return prevChatData;
            }, false).then(() => {
                localStorage.setItem(`${workspace}-${id}`, new Date().getTime().toString());
                setChat('');
                if (scrollbarRef.current) {
                    console.log('scrollToBottom!', scrollbarRef.current?.getValues());
                    scrollbarRef.current.scrollToBottom();
                }
            })
            axios.post(`/api/workspaces/${workspace}/dms/${id}/chats`, {
                content: chat,
            }).then(() => {
                revalidate();
            })
            .catch(console.error);
        }
    }, [chat, chatData, myData, userData, workspace, id]);

    const onMessage = useCallback((data: IDM) => {
        if (data.SenderId === Number(id) && myData.id !== Number(id)) {
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
    }, [])

    useEffect(() => {
        socket?.on('dm', onMessage);
        return() => {
            socket?.off('dm', onMessage);
        }
    }, [socket, onMessage]);

    // 로딩시 스크롤바 제일 아래로
    useEffect(() => {
        if (chatData?.length === 1) {
          console.log('toBottomWhenLoaded', chatData, scrollbarRef.current?.getValues());
          setTimeout(() => {
            scrollbarRef.current?.scrollToBottom();
          }, 100);
        }
    }, [chatData]);

    useEffect(() => {
        localStorage.setItem(`${workspace}-${id}`, new Date().getTime().toString());
    }, [workspace, id]);
    

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
            axios.post(`/api/workspaces/${workspace}/dms/${id}/images`, formData).then(() => {
                setDragOver(false);
                localStorage.setItem(`${workspace}-${id}`, new Date().getTime().toString());
                revalidate();
            });
            },
        [revalidate, workspace, id],
    );
    

    const onDragOver = useCallback((e) => {
        e.preventDefault();
        console.log(e);
        setDragOver(true);
    }, []);

    if (!userData || !myData) {
        return null;
    }

    const chatSections = makeSection(chatData ? chatData.flat().reverse() : []);

    return (
        <DMPageWrapper onDrop={onDrop} onDragOver={onDragOver}>
            <Header>{userData.nickname}</Header>
            <ChatList chatSections={chatSections} scrollRef={scrollbarRef} setSize={setSize} isEmpty={isEmpty} isReachingEnd={isReachingEnd}/>
            <ChatBox chat={chat} handleChangeChat={handleChangeChat} handleSubmitForm = {handleSubmitForm} placeholder={`@${userData.nickname}에게 메세지 보내기`}/>
            {dragOver && <DragOver><DragText>Uploading</DragText></DragOver>}
        </DMPageWrapper>
    )
}

export default DirectMessage;