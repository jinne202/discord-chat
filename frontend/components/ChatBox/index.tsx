import React, { useCallback, useEffect, useRef, VFC } from 'react';
import autosize from 'autosize';
import { useParams } from 'react-router';
import { Mention, SuggestionDataItem } from 'react-mentions';
import useSWR from 'swr';
import gravatar from 'gravatar';
import fetcher from '../../utils/fetcher';
import { IUser } from '../../types/db';

import { FiSend } from "react-icons/fi";
import { ChatArea, Form, MentionsTextarea, Toolbox, SendButton, EachMention } from './styles';

interface Props {
    chat: string;
    handleSubmitForm: (e: any) => void;
    handleChangeChat: (e: any) => void;
    placeholder?: string;
}

const ChatBox: VFC<Props> = ({ chat, handleSubmitForm, handleChangeChat, placeholder }) => {

    const { workspace } = useParams<{ workspace : string}>();

    const {data : userData, error, revalidate, mutate} = useSWR<IUser | false>('/api/users', fetcher, {
        dedupingInterval : 2000,
    });

    const { data: memberData } = useSWR<IUser[]>(userData ? `/api/workspaces/${workspace}/members` : null, fetcher);

    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (textareaRef.current) {
            autosize(textareaRef.current);
        }
    }, [textareaRef.current]);

    const handleKeydownChat = useCallback((e) => {
        if (e.key === 'Enter') {
            if (!e.shiftKey) {
              e.preventDefault();
              handleSubmitForm(e);
            }
          }
    }, [chat]);

    const renderSuggestion = useCallback((
        suggestion: SuggestionDataItem, 
        search: string, 
        highlightedDisplay: React.ReactNode, 
        index: number, 
        focus: boolean
        ): React.ReactNode => {
        if (!memberData) return;
        return (
                <EachMention focus={focus}>
                    <img src={gravatar.url(memberData[index].email, {s : '20px', d: 'retro'})} alt={memberData[index].nickname}/>
                    <span>{highlightedDisplay}</span>
                </EachMention>
        )
    }, []);
    return (
        <ChatArea>
            <Form onSubmit={handleSubmitForm}>
                <MentionsTextarea value={chat} onChange={handleChangeChat} onKeyPress={handleKeydownChat} placeholder={placeholder} inputRef={textareaRef} allowSuggestionsAboveCursor>
                    <Mention appendSpaceOnAdd trigger="@" data={memberData?.map((v) => ({ id : v.id, display : v.nickname})) || []} renderSuggestion={renderSuggestion}/>
                </MentionsTextarea>
                <Toolbox>
                    <SendButton type="submit"><FiSend/></SendButton>
                </Toolbox>
            </Form>
        </ChatArea>
    )
}

export default ChatBox;