import styled from 'styled-components';

import remove from '@/assets/onboarding/tools/remove.svg';
import { getEquipmentIcon, getEtcIcon, getIngredientIcon } from '@/constants/iconsMap';

export default function PillButton({
  kind, // 종류 : INGREDIENT(식재료)/EQUIPMENT(조리도구)/ETC(기타)
  detailType, // 각 종류의 대분류 (ex: 식재료-FRUIT/SUGAR... 조리도구-APPLIANCE/UTENSIL... 기타-필요 없음)
  name, // 이름
  amountValue, // 보유량 - 식재료에만 쓰일 예정
  onClick, // 클릭 시 이벤트
  onMouseDown,
  isSelected, // 선택 됐는지 여부 (true/false)
  deleteAvailable, // 제거 가능한지 여부 = X 버튼 표시 여부 (true/false)
}) {
  const iconUrl = (kind) => {
    if (kind === 'INGREDIENT') {
      return getIngredientIcon(name, detailType);
    } else if (kind === 'EQUIPMENT') {
      return getEquipmentIcon(name, detailType);
    } else {
      return getEtcIcon(name);
    }
  };
  return (
    <Case type="button" $isSelected={isSelected} onMouseDown={onMouseDown} onClick={onClick}>
      {deleteAvailable && <XBtn src={remove} />}
      <Icon src={iconUrl(kind)} alt="" />
      {name}
      <Amount>{amountValue}</Amount>
    </Case>
  );
}

const Case = styled.button`
  display: flex;
  flex-shrink: 0;
  box-sizing: border-box;
  padding: 8px 13px;
  justify-content: center;
  align-items: center;
  gap: 6px;
  appearance: none;
  white-space: nowrap;
  border-radius: 30px;
  background: ${({ $isSelected }) => ($isSelected ? '#D6F3A1' : '#fff')};
  border: 2px solid #fff;
  outline: 2px solid ${({ $isSelected }) => ($isSelected ? '#C2EE73' : '#fff')};
  outline-offset: -2px;
  -webkit-tap-highlight-color: transparent;

  /* 온보딩그림자 */
  box-shadow:
    0 0 8px 0 rgba(3, 3, 3, 0.05),
    0 0 30px 0 rgba(3, 3, 3, 0.05);
  color: var(--900, #030303);
  font-family: 'Wanted Sans Variable';
  font-size: 15px;
  font-style: normal;
  font-weight: 600;
  line-height: 120%; /* 18px */

  &:focus,
  &:focus-visible,
  &:active {
    outline: 2px solid ${({ $isSelected }) => ($isSelected ? '#C2EE73' : '#fff')};
    outline-offset: -2px;
  }
`;
const Icon = styled.img`
  display: block;
  width: 19px;
  height: 19px;
  flex-shrink: 0;
  object-fit: contain;
`;
const XBtn = styled.img`
  margin-right: 2px;
`;
const Amount = styled.div`
  color: var(--500, #5a5a5b);
  font-family: 'Wanted Sans Variable';
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: 120%; /* 14.4px */
`;
