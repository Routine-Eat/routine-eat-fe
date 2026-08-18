import { useEffect, useMemo, useState } from 'react';

import styled from 'styled-components';

import { getCookingEquipments, postInitCookingEquipments } from '@/api/cookingEquipmentApi';

import clearIcon from '../../../assets/onboarding/tools/clear.svg';
import fireIcon from '../../../assets/onboarding/tools/fire.svg';
import knifeIcon from '../../../assets/onboarding/tools/knife.svg';
import panIcon from '../../../assets/onboarding/tools/pan.svg';
import removeIcon from '../../../assets/onboarding/tools/remove.svg';
import searchIcon from '../../../assets/onboarding/tools/search.svg';

/* API 호출 실패 시 보여줄 기존 더미데이터 */
const CATEGORIES = [
  {
    id: 'appliances',
    title: '조리기기',
    icon: fireIcon,
    items: [
      { id: 'gas', name: '가스레인지' },
      { id: 'microwave', name: '전자레인지' },
      { id: 'oven', name: '오븐' },
      { id: 'ricecooker', name: '밥솥' },
      { id: 'airfryer', name: '에어프라이어' },
    ],
  },
  {
    id: 'basic',
    title: '기본 조리도구',
    icon: panIcon,
    items: [
      { id: 'pan', name: '프라이팬' },
      { id: 'pot', name: '냄비' },
      { id: 'blender', name: '믹서기' },
    ],
  },
  {
    id: 'prep',
    title: '준비·손질 도구',
    icon: knifeIcon,
    items: [
      { id: 'board', name: '도마' },
      { id: 'knife', name: '칼/가위' },
      { id: 'sieve', name: '채망' },
    ],
  },
];

/* 백엔드 데이터를 화면 카테고리 형태로 변환 */
const makeCategories = (data) => [
  {
    id: 'appliances',
    title: '조리기기',
    icon: fireIcon,
    items: data
      .filter((item) => item.cookingEquipmentType === 'APPLIANCE')
      .map((item) => ({
        id: item.cookingEquipmentId,
        name: item.cookingEquipmentName,
      })),
  },
  {
    id: 'basic',
    title: '기본 조리도구',
    icon: panIcon,
    items: data
      .filter(
        (item) => item.cookingEquipmentType === 'UTENSIL' || item.cookingEquipmentType === 'ETC'
      )
      .map((item) => ({
        id: item.cookingEquipmentId,
        name: item.cookingEquipmentName,
      })),
  },
  {
    id: 'prep',
    title: '준비·손질 도구',
    icon: knifeIcon,
    items: data
      .filter((item) => item.cookingEquipmentType === 'PREP_TOOL')
      .map((item) => ({
        id: item.cookingEquipmentId,
        name: item.cookingEquipmentName,
      })),
  },
];

function ThirdStep({ selectedIds, onToggle }) {
  const [query, setQuery] = useState('');
  const [categories, setCategories] = useState(CATEGORIES);

  /* 조리도구 전체 조회 API — 목록이 없으면 세팅 후 재조회 */
  useEffect(() => {
    const fetchCookingEquipments = async () => {
      try {
        let response = await getCookingEquipments();
        const list = response.data ?? [];

        if (list.length === 0) {
          await postInitCookingEquipments();
          response = await getCookingEquipments();
        }

        setCategories(makeCategories(response.data ?? []));
      } catch (error) {
        console.error('조리도구 조회 실패:', error);
      }
    };

    fetchCookingEquipments();
  }, []);

  const q = query.trim();

  /* 검색어가 있으면 카테고리 안 도구 필터 */
  const sections = useMemo(() => {
    if (!q) return categories;

    return categories
      .map((cat) => ({
        ...cat,
        items: cat.items.filter((item) => item.name.includes(q)),
      }))
      .filter((cat) => cat.items.length > 0);
  }, [q, categories]);

  return (
    <Wrap>
      {/* 제목·부제 텍스트 블록 */}
      <Header>
        <Title>조리 환경을 알려주세요</Title>
        <Subtitle>
          사용할 수 있는 조리 도구에 맞춰
          <br />
          레시피를 추천해드릴게요.
        </Subtitle>
      </Header>

      {/* 검색 입력 박스 */}
      <SearchBox>
        <SearchIcon src={searchIcon} alt="" />

        <SearchInput
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="추천에 없다면 검색을 통해 찾아보세요"
          aria-label="조리 도구 검색"
        />

        {q && (
          <ClearBtn type="button" onClick={() => setQuery('')} aria-label="검색어 지우기">
            <ClearImg src={clearIcon} alt="" />
          </ClearBtn>
        )}
      </SearchBox>

      {/* 카테고리 섹션 목록 */}
      <Sections>
        {sections.map((cat) => (
          <Section key={cat.id}>
            <SectionLabel>
              <SectionIcon src={cat.icon} alt="" />
              <SectionTitle>{cat.title}</SectionTitle>
            </SectionLabel>

            <ChipRow>
              {cat.items.map((item) => {
                const active = selectedIds.includes(item.id);

                return (
                  <Chip
                    key={item.id}
                    type="button"
                    $active={active}
                    onClick={() => onToggle(item.id)}
                  >
                    {item.name}
                  </Chip>
                );
              })}
            </ChipRow>
          </Section>
        ))}
      </Sections>
    </Wrap>
  );
}

/* 하단 선택된 조리도구 칩 */
export function SelectedToolChips({ selectedIds, onRemove }) {
  const [tools, setTools] = useState([]);

  /* 선택된 ID와 이름을 연결하기 위해 실제 API 데이터 조회 */
  useEffect(() => {
    const fetchCookingEquipments = async () => {
      try {
        const response = await getCookingEquipments();

        const allTools = response.data.map((item) => ({
          id: item.cookingEquipmentId,
          name: item.cookingEquipmentName,
        }));

        setTools(allTools);
      } catch (error) {
        console.error('선택 조리도구 조회 실패:', error);
      }
    };

    fetchCookingEquipments();
  }, []);

  const items = selectedIds.map((id) => tools.find((item) => item.id === id)).filter(Boolean);

  if (!items.length) return null;

  return (
    <SelectedRow>
      {items.map((item) => (
        <SelectedChip key={item.id} type="button" onClick={() => onRemove(item.id)}>
          <RemoveImg src={removeIcon} alt="" />
          {item.name}
        </SelectedChip>
      ))}
    </SelectedRow>
  );
}

/* ——— 레이아웃 ——— */

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  padding: 40px 20px 180px;
  overflow-y: auto;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 0 12px;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  line-height: 1.3;
  letter-spacing: -0.48px;
  color: #030303;
`;

const Subtitle = styled.p`
  margin: 0;
  font-size: 16px;
  font-weight: 500;
  line-height: 1.3;
  color: #bebebf;
`;

const SearchBox = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 340px;
  height: 48px;
  margin: 37px auto 0;
  border-radius: 12px;
  background: #fff;
  box-shadow:
    0 0 8px rgba(3, 3, 3, 0.05),
    0 0 30px rgba(3, 3, 3, 0.05);
`;

const SearchIcon = styled.img`
  position: absolute;
  left: 20px;
  width: 22px;
  height: 22px;
`;

const SearchInput = styled.input`
  width: 100%;
  height: 100%;
  border: none;
  background: transparent;
  padding: 0 44px 0 52px;
  font-size: 15px;
  font-weight: 500;
  color: #1a1a1a;
  outline: none;

  &::placeholder {
    color: #bebebf;
  }
`;

const ClearBtn = styled.button`
  position: absolute;
  right: 16px;
  display: flex;
  border: none;
  background: transparent;
  padding: 0;
  cursor: pointer;
`;

const ClearImg = styled.img`
  width: 16px;
  height: 16px;
`;

const Sections = styled.div`
  display: flex;
  flex-direction: column;
  gap: 28px;
  margin-top: 28px;
  padding: 0 12px;
`;

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SectionLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  height: 20px;
`;

const SectionIcon = styled.img`
  width: 20px;
  height: 20px;
  object-fit: contain;
`;

const SectionTitle = styled.span`
  font-size: 16px;
  font-weight: 500;
  line-height: 1.3;
  color: #8b8b8b;
`;

const ChipRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px 4px;
`;

const Chip = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 36px;
  padding: 0 16px;
  border: none;
  border-radius: 30px;
  background: ${({ $active }) => ($active ? '#d6f3a1' : '#fff')};
  box-shadow:
    0 0 4px rgba(3, 3, 3, 0.05),
    0 0 15px rgba(3, 3, 3, 0.05);
  font-size: 15px;
  font-weight: 600;
  line-height: 1.2;
  color: #1a1a1a;
  white-space: nowrap;
  cursor: pointer;
`;

const SelectedRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  width: 100%;
  margin-bottom: 24px;
`;

const SelectedChip = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  height: 36px;
  padding: 0 15px;
  border: none;
  border-radius: 30px;
  background: #fff;
  box-shadow:
    0 0 8px rgba(3, 3, 3, 0.05),
    0 0 30px rgba(3, 3, 3, 0.05);
  font-size: 15px;
  font-weight: 600;
  line-height: 1.2;
  color: #1a1a1a;
  white-space: nowrap;
  cursor: pointer;
`;

const RemoveImg = styled.img`
  width: 16px;
  height: 16px;
`;

export default ThirdStep;
