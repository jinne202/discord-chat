import React, { VFC, memo, useMemo } from 'react';
import { IDM, IChat, IUser } from 'types/db';
import { Link, useParams } from 'react-router-dom';
import gravatar from 'gravatar';
import dayjs from 'dayjs'
import regexifyString from 'regexify-string';

import { ChatWrapper, ChatImg, ChatBox, UserNickname, ChatDate, ChatContents, MentionMember } from './styles';

interface Props {
    data: IDM | IChat;
}

const Chat:VFC<Props> = ({ data }) => {

    const user: IUser = 'Sender' in data ? data.Sender : data.User;

    const { workspace } = useParams<{ workspace: string; channel: string}>();

    const result = useMemo(
        () =>
          data.content.startsWith('uploads/') ? (
            <img src={`http://localhost:3095/${data.content}`} style={{ maxHeight: 500 }} />
          ) : (
            regexifyString({
              input: data.content,
              pattern: /@\[(.+?)]\((\d+?)\)|\n/g,
              decorator(match, index) {
                const arr: string[] | null = match.match(/@\[(.+?)]\((\d+?)\)/)!;
                if (arr) {
                  return (
                    <Link key={match + index} to={`/workspace/${workspace}/dm/${arr[2]}`}>
                    <MentionMember>
                      @{arr[1]}
                    </MentionMember>
                    </Link>
                  );
                }
                return <br key={index} />;
              },
            })
          ),
        [workspace, data.content],
    );

    return(
        <ChatWrapper>
            <ChatImg>
                <img src={gravatar.url(user.email, {s: '40px', d: 'retro'})} alt={user.nickname}/>
            </ChatImg>
            <ChatBox>
                <UserNickname>
                    {user.nickname}
                    <ChatDate>
                        {dayjs(data.createdAt).format('MM-DD h:mm A')}
                    </ChatDate>
                </UserNickname>
                <ChatContents>
                    {result}
                </ChatContents>
            </ChatBox>
        </ChatWrapper>
    )
};

export default memo(Chat);