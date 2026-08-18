import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import styled from 'styled-components';

import editIcon from '../../assets/mypage/edit.svg';
import BackButton from '../../common/button/BackButton';
import IngredientsTab from './IngredientsTab';
import RecipeTab from './RecipeTab';
import ToolsTab from './ToolsTab';

const MAIN_TABS = [
  { id: 'recipe', label: '레시피•식단' },
  { id: 'ingredients', label: '재료' },
  { id: 'tools', label: '도구' },
];

function Mypage() {
  const navigate = useNavigate();
  const [mainTab, setMainTab] = useState('recipe');
  const [selectedIds, setSelectedIds] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const canEdit = mainTab === 'ingredients' || mainTab === 'tools';

  const finishEditing = () => {
    setIsEditing(false);
    setSelectedIds([]);
  };

  const switchTab = (tabId) => {
    setMainTab(tabId);
    setIsEditing(false);
    setSelectedIds([]);
  };

  return (
    <Page>
      {/* 마이페이지 전용 상단바 */}
      <TopBar>
        <TopRow>
          <SideLeft>
            <BackButton onClick={() => navigate(-1)} />
          </SideLeft>
          <Title>my</Title>
          <SideRight>
            {canEdit && isEditing ? (
              <DoneBtn type="button" onClick={finishEditing}>
                완료
              </DoneBtn>
            ) : canEdit ? (
              <IconBtn type="button" aria-label="편집" onClick={() => setIsEditing(true)}>
                <EditImg src={editIcon} alt="" />
              </IconBtn>
            ) : null}
          </SideRight>
        </TopRow>

        <MainTabs>
          {MAIN_TABS.map((tab) => (
            <MainTab
              key={tab.id}
              type="button"
              $active={mainTab === tab.id}
              onClick={() => switchTab(tab.id)}
            >
              {tab.label}
            </MainTab>
          ))}
        </MainTabs>
      </TopBar>

      <Content>
        {mainTab === 'ingredients' && (
          <IngredientsTab
            isEditing={isEditing}
            selectedIds={selectedIds}
            setSelectedIds={setSelectedIds}
          />
        )}
        {mainTab === 'recipe' && <RecipeTab />}
        {mainTab === 'tools' && (
          <ToolsTab
            isEditing={isEditing}
            selectedIds={selectedIds}
            setSelectedIds={setSelectedIds}
          />
        )}
      </Content>
    </Page>
  );
}

/* 마이페이지 전체 화면 */
const Page = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #fff;
`;

/* 상단 헤더 영역 (뒤로가기·제목·탭) */
const TopBar = styled.header`
  position: sticky;
  top: 0;
  z-index: 10;
  /* 피그마 기준 상태바(시간 등) 영역 54px 확보 */
  padding-top: max(30px, env(safe-area-inset-top));
  background: #fff;
  box-shadow: 0 1px 14.6px -1px rgba(201, 201, 189, 0.32);
`;

/* 상단 한 줄 — 3열 그리드로 제목 중앙 고정 */
const TopRow = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  height: 56px;
  padding: 0 16px;
`;

/* 왼쪽 슬롯(뒤로가기) */
const SideLeft = styled.div`
  justify-self: start;
`;

/* 오른쪽 슬롯(편집/완료) — 너비 변해도 제목 위치 유지 */
const SideRight = styled.div`
  justify-self: end;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  min-width: 28px;
  min-height: 28px;
`;

/* 가운데 "my" 제목 — 그리드 중앙열 */
const Title = styled.h1`
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #232323;
  text-align: center;
`;

/* 뒤로가기·편집 아이콘 버튼 */
const IconBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  background: transparent;
  font-size: 22px;
  color: #232323;
  cursor: pointer;
`;

/* 편집 연필 아이콘 이미지 */
const EditImg = styled.img`
  width: 20px;
  height: 20px;
`;

/* 선택 모드 "완료" 텍스트 버튼 — 피그마 #777 13px */
const DoneBtn = styled.button`
  border: none;
  background: transparent;
  padding: 0;
  font-size: 13px;
  font-weight: 500;
  color: #777;
  white-space: nowrap;
  cursor: pointer;
`;

/* 메인 탭 줄 (레시피·식단 / 재료 / 도구) */
const MainTabs = styled.div`
  display: flex;
  justify-content: center;
  gap: 4px;
`;

/* 개별 메인 탭 버튼 (+ 선택 시 초록 밑줄) */
const MainTab = styled.button`
  position: relative;
  width: 120px;
  height: 48px;
  border: none;
  background: transparent;
  font-size: 14px;
  font-weight: 600;
  color: ${({ $active }) => ($active ? '#72d472' : '#777')};
  cursor: pointer;

  &::after {
    content: '';
    display: ${({ $active }) => ($active ? 'block' : 'none')};
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 2px;
    background: #72d472;
  }
`;

/* 탭 아래 본문 영역 */
const Content = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  overflow: hidden;
`;

export default Mypage;
