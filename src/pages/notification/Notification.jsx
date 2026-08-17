import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import BackButton from '../../common/button/BackButton';

function Notification() {
  const navigate = useNavigate();

  return (
    <Page>
      <TopBar>
        <BackButton onClick={() => navigate(-1)} />
      </TopBar>
      <Title>알림페이지입니다</Title>
    </Page>
  );
}

const Page = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  background: #fff;
`;

const TopBar = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 20px 14px;
  padding-top: max(30px, env(safe-area-inset-top));
`;

const Title = styled.h1`
  margin: 16px 20px 0;
  font-size: 18px;
  font-weight: 600;
`;

export default Notification;
