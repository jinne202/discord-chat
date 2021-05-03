import styled from '@emotion/styled';

export const CreateModal = styled.div`
  position: fixed;
  text-align: center;
  left: 0;
  bottom: 0;
  top: 0;
  right: 0;
  z-index: 1022;

  & > div {
    margin-top: 200px;
    display: inline-block;
    width: 440px;
    background-color : #4f545c;
    box-shadow : 0 2px 10px 0 rgb(0 0 0 / 20%);
    border-radius: 10px;
    user-select: none;
    max-width: 440px;
    padding: 30px 40px 0;
    z-index: 1012;
    position: relative;
  }
`;