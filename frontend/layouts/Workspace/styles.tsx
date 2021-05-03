import styled from '@emotion/styled';

export const LayoutWrapper = styled.div`
    font-family: 'Rubik', sans-serif;
`

export const Header = styled.div`
    background-color : #2f3136;
    height : 50px;
    color : white;
    width : 100%;
    display : flex;
    justify-content : space-between;

    & > h3 {
        font-weight : 600;
        font-size : 18px;
        font-family: 'Rubik', sans-serif;
        padding : 14px 0 0 20px;
        margin : 0;
    }
`

export const ChatspaceWrapper = styled.div`
    display : flex;
    flex : 1;
`

export const ChatServer = styled.div`
    width : 72px;
    flex-direction : column;
    background-color : #202225;
    color : white;
    padding : 20px 0 0;
`

export const ChatButton = styled.div`
    width : 50px;
    height : 50px;
    border-radius : 20px;
    margin : 0 0 15px 11px;
    background-color : #36393f;
    color : white;
    display : inline-block;
    font-size : 30px;
    font-weight : 700;
    text-align : center;
    padding : 4px 0 0 0;
    transition: all 0.2s ease;

    &:hover {
        background-color : #6889DC;
    }
`

export const AddButton = styled.div`
    width : 50px;
    height : 50px;
    border-radius : 20px;
    margin : 15px 0 15px 11px;
    background-color : #36393f;
    color : white;
    display : inline-block;
    font-size : 30px;
    font-weight : 700;
    padding : 10px 0 0 10px;
    transition: all 0.2s ease;
    cursor : pointer;

    &:hover {
        background-color : #FFDF66;
    }
`

export const Channels = styled.div`
    width : 260px;
    flex-direction : column;
    background : #2f3136;
    color : white;
    align-items : center;
    position : relative;
`

export const Chats = styled.div`
    flex: 1;
`

export const ServerName = styled.div`
    width : 100%;
    text-overflow : ellipsis;
    color : white;
    font-size : 18px;
    height : 50px;
    border-bottom : 2px solid rgba(0,0,0,0.2);
    padding : 14px 0 0 15px;
    font-family: 'Rubik', sans-serif;
    font-weight : 700;
    display : flex;
    justify-content : space-between;

    & > span {
        font-size : 20px;
        padding : 5px 0 0 5px;
        margin : -3px 20px 0 0;
        cursor : pointer;
        width : 30px;
        height : 30px;
        border-radius : 7px;
        background-color : #2f3136;

        &:hover {
            background-color : rgba(0,0,0,0.2);
        }
    }
`

export const MenuScroll = styled.div`
    height: calc(100vh - 50px);
    overflow-y: auto;
`

export const UserProfile = styled.div`
    height : 60px;
    background-color : #292b2f;
    bottom : 0;
    position : absolute;
    width : 100%;
    display : flex;
`

export const ProfileImgWrapper = styled.div`
    cursor : pointer;
`

export const ProfileImg = styled.img`
    margin : 15px 0 0 15px;
    border-radius : 30px;
    border : 2px solid #6889DC;
`
export const UserName = styled.p`
    font-size : 18px;
    color : white;
    margin : 0;
    font-weight : 700;
    margin : 20px 0 0 15px;
`

export const MenuButton = styled.div`
    border-radius : 5px;
    padding : 10px;
    font-family: 'Rubik', sans-serif;
    font-weight : 700;
    color : #b9bbbe;
    transition: all 0.1s ease;
    cursor : pointer;

    &:hover {
        background-color : #6889DC;
        color : white;
    }
`

export const Form = styled.form``

export const Label = styled.label`

    margin : 0 0 20px 0;
    display : block;

    & > span {
        color : #8e9297;
        font-size : 12px;
        font-weight : 600;
        margin : 0 0 5px 0;
        display : block;
        text-align : left;
    }
`

export const Input = styled.input`
    background-color : rgba(0,0,0,0.1);
    border : 1px solid rgba(0,0,0,0.2);
    border-radius : 5px;
    width : 100%;
    height : 40px;
    font-size : 14px;
    color : white;
    padding : 0 10px;
    outline : none;

    &:focus {
        border : 1px solid #6889DC;
    }
`

export const InputWrapper = styled.div`
`

export const SubmitButton = styled.button`
    background-color : #6889DC;
    width : 100%;
    height : 50px;
    color : white;
    border : 0;
    font-size : 18px;
    font-weight : 600;
    border-radius : 5px;
    cursor : pointer;
    transition: all 0.3s ease;
    margin : 0 0 15px 0;

    &:hover {
        background-color : #587ACF;
    }
`

export const ChatServerModal = styled.div`
    & > h2 {
        padding : 0 0 0 10px;
        margin : 10px 0;
    }
`

export const ChannelListWrapper = styled.div`
    display : flex;
    padding : 7px 0 0 10px;
    margin : 10px;
    background-color : #2f3136;
    border-radius : 5px;
    cursor : pointer;
    height : 40px;

    &:hover {
        background-color : rgba(0,0,0,0.2)
    }
`

export const ChannelTitle = styled.div`
    font-size : 18px;
    font-weight : 700;
`

export const ChannelIcon = styled.div`
    font-size : 20px;
    margin : 3px 10px 0 0;
`