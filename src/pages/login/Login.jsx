import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import styled from 'styled-components';

import { getUserByLoginNumber, postCreateUser } from '@/api/userApi';
import { useUserStore } from '@/hooks/useUserStore';

import LogoIcon from "@/assets/common/logo.svg"

export default function Login() {
  const [password, setPassword] = useState('');
  const userLogin = useUserStore((state) => state.login);
  const navigate = useNavigate();

  const onLogin = async (password) => {
    if (password.length < 4) {
      console.log('비밀번호를 입력해주세요.');
      return;
    }
    let userData;
    try {
      userData = (await getUserByLoginNumber(password)).data;
      userLogin(userData);
      if (userData.userSkillLevel == null) {
        navigate('/onboarding');
      } else {
        navigate('/');
      }
    } catch (error) {
      console.log('로그인 실패하여 새로운 사용자 생성');
      try {
        userData = (await postCreateUser(password)).data;
        userLogin(userData);
        navigate('/onboarding');
      } catch (error) {
        console.log('새로운 사용자 생성 실패');
      }
    }
  };
  return (
    <Contents>
      <Box>
      <Logo src={LogoIcon}/>
      <PwBox>
        <Pw><p>안녕하세요!</p>비밀번호를 입력해주세요</Pw>
        <InputGroup>
          <PwInput $isInput={password.length >= 1} />
          <PwInput $isInput={password.length >= 2} />
          <PwInput $isInput={password.length >= 3} />
          <PwInput $isInput={password.length >= 4} />
          <Input
            type="number"
            onInput={(e) => {
              if (e.target.value.length > 4) {
                e.target.value = e.target.value.slice(0, 4);
              }
            }}
            onChange={(e) => setPassword(e.target.value.slice(0, 4))}
          />
        </InputGroup>
      </PwBox>
      <BtnBox>
        <Explanation>
            <p>
          심사용 로그인은 <span style={{ fontWeight: 700 }}>0825</span>를 입력해주세요
          </p>
        </Explanation>
        
      </BtnBox>
      </Box>
      <LoginBtn onClick={() => onLogin(password)}>로그인</LoginBtn>
    </Contents>
  );
}

const Contents = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  align-items: center;
  padding: 133px 23px 36px 23px;
  justify-content: space-between;
`;
const Logo = styled.img`
`;
const Box=styled.div`
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  justify-content: space-between;
  height: 380px;
`
const Pw = styled.div`
  color: var(--900, #030303);
  text-align: center;
  font-family: 'Wanted Sans Variable';
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: 60%; /* 28.6px */
  letter-spacing: -0.22px;
`;
const PwInput = styled.div`
  width: 24px;
  height: 24px;
  aspect-ratio: 1/1;
  background-color: ${({ $isInput }) => ($isInput ? '#D6F3A1' : '#f5f5f6')};
  border-radius: 50%;
  border: ${({ $isInput }) => ($isInput ? '2px solid #C2EE73' : '2px solid #d9d9da')};
`;
const Explanation = styled.div`
  display: flex;
  width: 100%;
  height: 52px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 12px;
  border: 1px solid var(--100, #d9d9da);
  background: #fff;
  color: var(--500, #5a5a5b);
  font-family: 'Wanted Sans Variable';
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 130%; /* 20.8px */
  letter-spacing: -0.16px;
`;
const LoginBtn = styled.button`
  display: flex;
  width: 100%;
  height: 52px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 12px;
  background: #96D960;
  color: #fff;
  text-align: center;
  font-family: 'Wanted Sans Variable';
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  border: none;
  margin-top: auto;
  transition:
    transform 100ms ease,
    background-color 100ms ease,
    color 100ms ease,
    font-size 100ms ease;

  &:active {
    background: #36a73c;
    color: #c6f5a6;
    font-size: 17px;
    transform: scale(0.97);
  }
`;
const PwBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
`;
const BtnBox = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
  gap: 12px;
`;
const InputGroup = styled.div`
  position: relative;
  display: flex;
  gap: 20px;
  align-items: center;
`;
const Input = styled.input`
  position: absolute;
  width: 164px;
  height: 32px;
  opacity: 0;
`;
