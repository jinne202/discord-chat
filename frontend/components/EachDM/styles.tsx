import styled from '@emotion/styled';

export const CollapseButton = styled.button<{ collapse: boolean }>`
  background: transparent;
  border: none;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  color: white;
  margin : 0 0 0 15px;
  cursor: pointer;
  font-size: 18px;
  outline : none;
  transition: all 0.1s ease;

  ${({ collapse }) =>
    collapse &&
    `
      transform: rotate(-90deg)
  `};
`;

export const DMTitle = styled.div`
  display : flex;
  margin : 70px 0 0 0;
  cursor : pointer;
`

export const Title = styled.div`
  font-size: 18px;
  font-weight : 600;
  margin : 0 0 0 6px;
`

export const ListWrapper = styled.div`
    display : flex;
    padding : 7px 0 0 40px;
    margin : 10px;
    background-color : #2f3136;
    border-radius : 5px;
    cursor : pointer;
    height : 40px;

    &:hover {
        background-color : rgba(0,0,0,0.2)
    }
`

export const ListTitle = styled.div`
    font-size : 18px;
    font-weight : 700;
    text-decoration : none;
    color : white;
    display : flex;
    justify-content : space-between;
    width : 80%;
`

export const ListIcon = styled.div<{ isOnline: boolean }>`
    font-size : 20px;
    margin : 2px 10px 0 0;
    color : white;

    ${({ isOnline }) =>
    isOnline &&
    `
      color : #58DEA5;
  `};
`

export const MessageCount = styled.span`
  color : white;
  font-size : 14px;
  background-color : #FF5B5B;
  padding : 5px 10px;
  height : 28px;
  border-radius : 20px;
  font-weight : 500;
  min-width : 30px;
  text-align : center;
`