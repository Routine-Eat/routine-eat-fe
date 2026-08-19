import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import styled from 'styled-components';

import { getUserByLoginNumber, postCreateUser } from '@/api/userApi';
import { useUserStore } from '@/hooks/useUserStore';

export default function Login() {
  const [password, setPassword] = useState('');
  const userLogin = useUserStore((state) => state.login);
  const navigate = useNavigate();

  const onLogin = async (password) => {
    if (password.length < 1) {
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
      <Logo>Routine-Eat</Logo>
      <PwBox>
        <Pw>비밀번호를 입력해주세요</Pw>
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
        <LoginBtn onClick={() => onLogin(password)}>로그인</LoginBtn>
      </BtnBox>
    </Contents>
  );
}

const Contents = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  align-items: center;
  padding: 133px 23px 200px 23px;
  justify-content: space-between;
`;
const Logo = styled.div`
  color: var(--900, #030303);
  text-align: center;
  font-family: 'Google Sans Flex';
  font-size: 30px;
  font-style: normal;
  font-weight: 700;
  line-height: 130%; /* 39px */
  letter-spacing: -0.3px;
`;
const Pw = styled.div`
  color: var(--900, #030303);
  text-align: center;
  font-family: 'Wanted Sans Variable';
  font-size: 22px;
  font-style: normal;
  font-weight: 500;
  line-height: 130%; /* 28.6px */
  letter-spacing: -0.22px;
`;
const PwInput = styled.div`
  width: 32px;
  height: 32px;
  aspect-ratio: 1/1;
  background-color: ${({ $isInput }) => ($isInput ? '#FFE6BD' : '#f5f5f6')};
  border-radius: 50%;
  border: ${({ $isInput }) => ($isInput ? '2px solid #FF9B44' : '2px solid #d9d9da')};
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
  gap: 12px;
  align-items: center;
`;
const Input = styled.input`
  position: absolute;
  width: 164px;
  height: 32px;
  opacity: 0;
`;
