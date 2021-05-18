import React, { useCallback, useState } from 'react';
import styled from '@emotion/styled';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import useSWR from 'swr';
import fetcher from '../../utils/fetcher';
import useInput from '../../hooks/useInput';

const RegisterPage = () => {

    const {data, error, revalidate} = useSWR('/api/users', fetcher);

    const [email, setEmail, handleEmail] = useInput('');
    const [nickname, setNickname, handleNickname] = useInput('');
    const [password, setPassword] = useState('');
    const [passwordCheck, setPasswordCheck] = useState('');
    const [mismatchPassword, setMismatchPassword] = useState(false);
    const [signUpError, setSignUpError] = useState('');
    const [signUpSuccess, setSignUpSuccess] = useState(false);

    const handlePassword = useCallback((e) => {
        setPassword(e.target.value)
        setMismatchPassword(e.target.value !== passwordCheck);
    }, [passwordCheck]);

    const handlePasswordCheck = useCallback((e) => {
        setPasswordCheck(e.target.value)
        setMismatchPassword(e.target.value !== password);
    }, [password]);

    const handleSubmit = useCallback((e) => {
        e.preventDefault();
        if (!mismatchPassword) {
            setSignUpError('');
            setSignUpSuccess(false);
            axios.post('/api/users', {
                email,
                nickname,
                password
            }).then((response) => {
                    setSignUpSuccess(true);
                })
                .catch((error) => {
                    setSignUpError(error.response.data);
                })
                .finally(() => {});
        }
    }, [email, nickname, password, passwordCheck, mismatchPassword]);

    if (data === undefined) {
        return <div>loading...</div>
    }

    if (data) {
        return <Redirect to="workspace/channel"/>
    }

    return(
        <RegisterPageWrapper>
            <RegisterFormWrapper>
            <Title>REGISTER</Title>
            <Form onSubmit={handleSubmit}>
                <Label>
                    <span>이메일</span>
                    <InputWrapper>
                        <RegisterInput type="email" name="email" value={email} onChange={handleEmail} required/>
                    </InputWrapper>
                </Label>
                <Label>
                    <span>닉네임</span>
                    <InputWrapper>
                        <RegisterInput type="text" name="email" value={nickname} onChange={handleNickname} required/>
                    </InputWrapper>
                </Label>
                <Label>
                    <span>비밀번호</span>
                    <InputWrapper>
                        <RegisterInput type="password" name="email" value={password} onChange={handlePassword} required/>
                    </InputWrapper>
                </Label>
                <Label>
                    <span>비밀번호 체크</span>
                    <InputWrapper>
                        <RegisterInput type="password" name="email" value={passwordCheck} onChange={handlePasswordCheck} required/>
                    </InputWrapper>
                </Label>
                {mismatchPassword && <Error>비밀번호가 일치하지 않습니다</Error>}
                {signUpError && <Error>{signUpError}</Error>}
                <SubmitButton type="submit">
                    계속하기
                </SubmitButton>
            </Form>
            <Link to="/login">
            <GoLogin>이미 계정이 있으신가요?</GoLogin>
            </Link>
            </RegisterFormWrapper>
        </RegisterPageWrapper>
    )
}

const RegisterPageWrapper = styled.div`
    background-color : #2f3136;
    min-height : 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
`

const RegisterFormWrapper = styled.div`
    width : 480px;
    max-width: 480px;
    margin : 0 auto;
    padding : 32px;
    font-size : 18px;
    box-shadow : 0 2px 10px 0 rgb(0 0 0 / 20%);
    border-radius : 5px;
    box-sizing : border-box;
    background-color : #36393f;

    & > a {
        text-decoration : none;
    }
`

const Title = styled.h2`
    color : white;
    text-align : center;
    font-weight : 800;
`

const Form = styled.form`
`

const Label = styled.label`

    margin : 0 0 20px 0;
    display : block;

    & > span {
        color : #8e9297;
        font-size : 12px;
        font-weight : 600;
        margin : 0 0 5px 0;
        display : block;
    }
`

const InputWrapper = styled.div`
`

const RegisterInput = styled.input`
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

const SubmitButton = styled.button`
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

    &:hover {
        background-color : #587ACF;
    }
`

const GoLogin = styled.p`
    color : #6889DC;
    font-size : 14px;
    font-weight : 600;
    cursor : pointer;
    display : inline-block;
    border-bottom : 1px solid transparent;
    transition: all 0.3s ease;
    
    &:hover {
        border-bottom : 1px solid #6889DC;
    }
`

const Error = styled.div`
    color : #FF5B5B;
    font-size : 12px;
    margin : 0 0 20px 0;
    font-weight : 600;
`

export default RegisterPage;