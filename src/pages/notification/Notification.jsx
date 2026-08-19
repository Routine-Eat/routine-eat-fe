import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import styled from 'styled-components';

import { getNotifications } from '../../api/notificationApi';
import iconMeal from '../../assets/notification/icon-meal.svg';
import iconReport from '../../assets/notification/icon-report.svg';
import iconShopping from '../../assets/notification/icon-shopping.svg';
import BackButton from '../../common/button/BackButton';
import { useUserStore } from '../../hooks/useUserStore';
import NotificationReportModal from './NotificationReportModal';

const PAGE_SIZE = 10;

const iconByType = {
  THREE_MEAL_REPORT_ARRIVED: iconReport,
  MEAL_PLAN_COMPLETED: iconMeal,
};

const formatNotificationTime = (createdAt) => {
  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) return '';

  const diffMs = Date.now() - date.getTime();
  const mins = Math.floor(diffMs / 60000);
  const hours = Math.floor(diffMs / 3600000);

  if (mins < 1) return '방금 전';
  if (mins < 60) return `${mins}분 전`;
  if (hours < 24) return `${hours}시간 전`;
  return `${date.getMonth() + 1}월 ${date.getDate()}일`;
};

function Notification() {
  const navigate = useNavigate();
  const userLoginNumber = useUserStore((state) => state.userLoginNumber);
  const [items, setItems] = useState([]);
  const [hasNext, setHasNext] = useState(false);
  const [nextCursor, setNextCursor] = useState(1);
  const [loading, setLoading] = useState(false);
  const [reportItem, setReportItem] = useState(null);
  const loadingRef = useRef(false);

  const fetchPage = useCallback(
    async ({ cursor = 1, append = false } = {}) => {
      if (!userLoginNumber || loadingRef.current) return;

      loadingRef.current = true;
      setLoading(true);

      try {
        const response = await getNotifications({
          userNumber: userLoginNumber,
          cursor,
          size: PAGE_SIZE,
        });
        const payload = response.data ?? response;
        const content = payload.content ?? [];
        setItems((prev) => {
          if (!append) return content;
          const seen = new Set(prev.map((item) => item.notificationId));
          return [...prev, ...content.filter((item) => !seen.has(item.notificationId))];
        });
        setHasNext(Boolean(payload.hasNext));
        setNextCursor(payload.nextCursor ?? cursor + 1);
      } catch (error) {
        console.error('알림 목록 조회 실패:', error);
      } finally {
        loadingRef.current = false;
        setLoading(false);
      }
    },
    [userLoginNumber]
  );

  useEffect(() => {
    fetchPage({ cursor: 1, append: false });
  }, [fetchPage]);

  const handleScroll = (event) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    if (scrollHeight - scrollTop - clientHeight > 80) return;
    if (!hasNext || loadingRef.current) return;
    fetchPage({ cursor: nextCursor, append: true });
  };

  const openReport = (item) => {
    if (item.notificationType !== 'THREE_MEAL_REPORT_ARRIVED') return;
    setReportItem(item);
  };

  return (
    <Page>
      <TopBar>
        <BackButton onClick={() => navigate(-1)} />
        <PageTitle>알림</PageTitle>
        <TopSpacer />
      </TopBar>

      <List onScroll={handleScroll}>
        {items.map((item) => {
          const isReport = item.notificationType === 'THREE_MEAL_REPORT_ARRIVED';
          return (
            <Item
              key={item.notificationId}
              type="button"
              $clickable={isReport}
              onClick={() => openReport(item)}
            >
              <ItemHead>
                <TitleRow>
                  <TypeIcon
                    src={iconByType[item.notificationType] ?? iconShopping}
                    alt=""
                  />
                  <ItemTitle>{item.notificationTitle}</ItemTitle>
                </TitleRow>
                <ItemTime>{formatNotificationTime(item.createdAt)}</ItemTime>
              </ItemHead>
              <ItemBody>{item.notificationContent}</ItemBody>
            </Item>
          );
        })}
        {!loading && items.length === 0 && <Empty>알림이 없어요</Empty>}
      </List>

      {reportItem && (
        <NotificationReportModal
          contentId={reportItem.contentId}
          onClose={() => setReportItem(null)}
        />
      )}
    </Page>
  );
}

export default Notification;

const Page = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  background: #fff;
`;

const TopBar = styled.header`
  display: grid;
  grid-template-columns: 48px 1fr 48px;
  align-items: center;
  box-sizing: border-box;
  padding: 12px 22px 14px;
  padding-top: max(30px, env(safe-area-inset-top));
  background: #fff;
`;

const TopSpacer = styled.span`
  width: 48px;
`;

const PageTitle = styled.h1`
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  line-height: 1.3;
  color: #2e2e2e;
  text-align: center;
`;

const List = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 48px;
  min-height: 0;
  padding: 40px 22px 40px;
  overflow-y: auto;
`;

const Item = styled.button`
  display: flex;
  flex-direction: column;
  gap: 9px;
  width: 100%;
  padding: 0;
  border: none;
  background: transparent;
  text-align: left;
  cursor: ${({ $clickable }) => ($clickable ? 'pointer' : 'default')};
`;

const ItemHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  width: 100%;
`;

const TitleRow = styled.div`
  display: flex;
  flex: 1;
  gap: 8px;
  align-items: center;
  min-width: 0;
`;

const TypeIcon = styled.img`
  display: block;
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  object-fit: contain;
`;

const ItemTitle = styled.p`
  margin: 0;
  overflow: hidden;
  font-size: 15px;
  font-weight: 600;
  line-height: 1.3;
  color: #adadad;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ItemTime = styled.p`
  flex-shrink: 0;
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  line-height: 1.3;
  color: #adadad;
  white-space: nowrap;
`;

const ItemBody = styled.p`
  margin: 0;
  padding-left: 32px;
  font-size: 15px;
  font-weight: 500;
  line-height: 1.4;
  letter-spacing: -0.15px;
  color: #444;
  white-space: pre-line;
`;

const Empty = styled.p`
  margin: 80px 0 0;
  font-size: 15px;
  font-weight: 500;
  color: #adadad;
  text-align: center;
`;
