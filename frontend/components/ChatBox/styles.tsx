import styled from '@emotion/styled';
import { Mention, MentionsInput } from 'react-mentions';

export const ChatArea = styled.div`
    width : 96%;
    margin : 30px 2%;
    border-radius : 10px;
    background-color : rgba(255,255,255,0.1);
`

export const Form = styled.form`
    display : flex;
    justify-content : space-between;
    margin : 0;
    position : relative;
`

export const MentionsTextarea = styled(MentionsInput)`
    background-color : transparent;
    width : 90%;
    resize : none;
    outline : none;
    color : white;
    font-size : 16px;
    height: 42px;
    border : 0;
    line-height: 22px;
    font-family: 'Rubik', sans-serif;
    font-weight : 600;

    & textarea {
        color : white;
        outline : none;
        padding : 10px 10px;
        border : 0;
    }
`

export const Toolbox = styled.div`
    position : absolute;
    right : 0;
    bottom : 0;
`

export const SendButton = styled.button`
    font-size : 20px;
    width : 40px;
    height : 40px;
    padding : 0;
    background-color : transparent;
    border : 0;
    border-radius : 15px;
    color : rgba(255,255,255,0.5);
    cursor : pointer;
    margin : 0 10px 0 0;

    &:hover {
        color : rgba(255,255,255,1);
    }
`

export const EachMention = styled.button<{ focus: boolean }>`
    background-color: #2f3136;
    font-size : 16px;
    padding : 10px;
    border: none;
    display: flex;
    align-items: center;
    color : #ffffff;
    width : 300px;

    & img {
        margin-right: 5px;
        border-radius : 10px;
    }

    ${({ focus }) =>
        focus &&
        `
        background-color:#36393f;
    `};
`;
