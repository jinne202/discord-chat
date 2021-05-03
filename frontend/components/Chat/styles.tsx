import styled from '@emotion/styled';

export const ChatWrapper = styled.div`
    width : 100%;
    display : flex;
    padding : 10px 15px;
`

export const ChatImg = styled.div`
    padding : 3px 0 0 0;
    margin : 0 20px 0 0;

    & > img {
        border-radius : 20px;
    }
`

export const ChatBox = styled.div`
`

export const UserNickname = styled.div`
    font-size : 16px;
    font-weight : 600;
    color : white;
`

export const ChatDate = styled.span`
    font-size : 12px;
    color :#72767d;
    font-weight : 400;
    margin : 0 0 0 10px;
`

export const ChatContents = styled.div`
    font-size : 16px;
    font-weight : 600;
    color : white;
`


export const MentionMember = styled.div`
    color : #58DEA5;
    display : inline-block;
    
`