import styled from '@emotion/styled';

export const DMPageWrapper = styled.div`
    background-color : #36393f;
    display : flex;
    flex-wrap : wrap;
    flex-flow : column;
    height : 100vh;
`

export const Header = styled.div`
    color : white;
    font-size : 18px;
    height : 50px;
    border-bottom : 2px solid rgba(0,0,0,0.2);
    padding : 14px 0 0 15px;
    font-family: 'Rubik', sans-serif;
    font-weight : 700;
    width : 100%;
`
export const DragOver = styled.div`
    position: absolute;
    height : 100vh;
    left: 0;
    width: 100%;
    background: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color : rgba(0,0,0,0.5);
`

export const DragText = styled.div`
    font-size : 24px;
    color : #6889DC;
    background-color : white;
    padding : 10px 20px;
`