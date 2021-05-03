import React, { useCallback, FC, RefObject } from 'react';
import { IDM, IChat } from 'types/db';
import Chat from '../Chat';
import { Scrollbars } from 'react-custom-scrollbars';

import { ChatListWrapper, Date } from './styles';
import { EFAULT } from 'node:constants';

interface Props {
    chatSections: {[key: string]: (IDM | IChat)[] };
    setSize: (f: (size: number) => number) => Promise<(IDM | IChat)[][] | undefined>
    isEmpty: boolean;
    isReachingEnd: boolean;
    scrollRef : RefObject<Scrollbars>;
}

const ChatList: FC<Props> = ({ scrollRef, isReachingEnd, isEmpty, chatSections, setSize }) => {

    const onScroll = useCallback((values) => {
        if(values.scrollTop === 0 && !isReachingEnd) {
            console.log("top");
            // 데이터 추가 로딩
            setSize((size) => size + 1).then(() => {
                //스크롤 위치 유지
                if (scrollRef?.current) {
                    scrollRef.current?.scrollTop(scrollRef.current?.getScrollHeight() - values.scrollHeight)
                }
            })
        }
    }, [])

    return (
        <ChatListWrapper>
            <Scrollbars autoHide ref={scrollRef} onScrollFrame={onScroll}>
            {Object.entries(chatSections).map(([date, chats]) => {
                return (
                    <div>
                        <Date>{date}</Date>
                        {chats.map((chat) => (
                            <Chat key={chat.id} data={chat}/>
                        ))}
                    </div>
                )
            })}
            </Scrollbars>
        </ChatListWrapper>
    )
}

export default ChatList;