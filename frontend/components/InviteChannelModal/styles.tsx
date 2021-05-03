import styled from '@emotion/styled';

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