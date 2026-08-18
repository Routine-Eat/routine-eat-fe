import { useState } from 'react';

import styled from 'styled-components';

export default function Login() {
  const [password, setPassword] = useState('');

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
        <ForgetBtn>비밀 번호를 잊어버렸어요</ForgetBtn>
        <LoginBtn>로그인</LoginBtn>
      </BtnBox>
    </Contents>
  );
}

const Contents = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  align-items: center;
  padding: 133px 0 200px 0;
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
const ForgetBtn = styled.button`
  display: inline-flex;
  height: 40px;
  padding: 12px;
  justify-content: center;
  align-items: center;
  gap: 12px;
  color: var(--400, #727272);
  text-align: center;
  font-family: 'Wanted Sans Variable';
  font-size: 15px;
  font-style: normal;
  font-weight: 600;
  line-height: 130%; /* 19.5px */
  letter-spacing: -0.15px;
  border-radius: 10px;
  background: var(--50, #f5f5f6);
  border: none;
`;
const LoginBtn = styled.button`
  display: flex;
  width: 320px;
  height: 52px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 12px;
  background: #ff9b44;
  color: #fff;
  text-align: center;
  font-family: 'Wanted Sans Variable';
  font-size: 18px;
  font-style: normal;
  font-weight: 600;
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
  flex-direction: column;
  align-items: center;
  gap: 40px;
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
