import { useEffect, useRef, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';

import styled, { keyframes } from 'styled-components';

import adBannerImg from '../../assets/feed/ad-banner.png';
import chevronIcon from '../../assets/feed/chevron.svg';
import filterIcon from '../../assets/feed/filter.svg';
import foodImg from '../../assets/feed/food.png';
import searchIcon from '../../assets/feed/search.svg';
import toTopChevronIcon from '../../assets/feed/to-top-chevron.svg';
import { deleteFavoriteRecipe, postFavoriteRecipe } from '../../api/favoriteRecipe';
import { deleteRecipeSearchHistory, getRecipeSearchHistory, getRecipes, searchRecipes } from '../../api/recipe';
import loaderSvg from '../../common/loader.svg';
import MenuCard from '../../common/menuCard/MenuCard';
import { useUserStore } from '../../hooks/useUserStore';
import Header from '../../layout/header/Header';
import FilterPanel, { DEFAULT_FILTER } from './FilterPanel';

const HEADER_SLIDE_MS = 450;
const SEARCH_TRANSITION_MS = 280;
const SEARCH_EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

const SORTS = ['기본순', '재료 일치도순'];

const TIME_REQUIRED_MAP = {
  '15분 이하': 'WITHIN_15_MINUTES',
  '15분~30분': 'WITHIN_30_MINUTES',
  '30분 이상': 'OVER_30_MINUTES',
};

const CATEGORY_MAP = {
  한식: 'KOREAN',
  중식: 'CHINESE',
  일식: 'JAPANESE',
  양식: 'WESTERN',
  기타: 'OTHER',
};

const formatTimeRequired = (minutes) => {
  if (minutes == null || minutes === '') return '';
  const value = Number(minutes);
  if (!Number.isFinite(value)) return '';
  if (value >= 60) return `${Math.floor(value / 60)}시간 소요`;
  return `${value}분 소요`;
};

const mapRecipeCard = (item) => {
  const level = Number(String(item.difficultyLevel ?? '').replace('LEVEL_', ''));

  return {
    id: item.recipeId,
    title: item.menuName,
    image: item.thumbnailUrl || foodImg,
    time: formatTimeRequired(item.timeRequired),
    utilization:
      item.foodIngredientUsingPercent != null
        ? `재료 활용률 ${item.foodIngredientUsingPercent}%`
        : '',
    difficulty: Number.isFinite(level) && level > 0 ? level : 1,
    isSaved: Boolean(item.isFavoriteRecipe),
  };
};

const mapRecipeGroup = (group) => (group?.content ?? []).map(mapRecipeCard);

const buildFeedSections = (payload = {}) => {
  const remainName = payload.remainFoodIngredientName;
  const sections = [
    {
      id: 'simple',
      title: '퇴근 후 15분 간단 레시피',
      recipes: mapRecipeGroup(payload.simpleRecipe),
      hasMore: Boolean(payload.simpleRecipe?.hasNext),
    },
    { type: 'banner', id: 'b1' },
    {
      id: 'remain',
      title: remainName ? `남은 ${remainName} 먼저 쓰기` : '남은 재료 먼저 쓰기',
      recipes: mapRecipeGroup(payload.remainFoodIngredient),
      hasMore: Boolean(payload.remainFoodIngredient?.hasNext),
    },
    {
      id: 'diet',
      title: '다이어트 레시피',
      recipes: mapRecipeGroup(payload.dietRecipe),
      hasMore: Boolean(payload.dietRecipe?.hasNext),
    },
    {
      id: 'gluten',
      title: '글루텐 프리 레시피',
      recipes: mapRecipeGroup(payload.glutenFreeRecipe),
      hasMore: Boolean(payload.glutenFreeRecipe?.hasNext),
    },
  ];

  return sections.filter((section) => section.type === 'banner' || section.recipes.length > 0);
};

const hiddenSearchKey = (userNumber) => `feed-hidden-search:${userNumber}`;

const loadHiddenSearchTerms = (userNumber) => {
  try {
    const raw = sessionStorage.getItem(hiddenSearchKey(userNumber));
    const list = raw ? JSON.parse(raw) : [];
    return new Set(Array.isArray(list) ? list : []);
  } catch {
    return new Set();
  }
};

const saveHiddenSearchTerms = (userNumber, terms) => {
  if (!userNumber) return;
  sessionStorage.setItem(hiddenSearchKey(userNumber), JSON.stringify([...terms]));
};

function Feed() {
  const navigate = useNavigate();
  const { userLoginNumber } = useUserStore();
  const { feedSearchMode, setFeedSearchMode } = useOutletContext() ?? {};
  const inputRef = useRef(null);
  const pageRef = useRef(null);
  const headerRef = useRef(null);
  const pinTimerRef = useRef(null);
  const pinScrollCleanupRef = useRef(null);
  const hiddenSearchTermsRef = useRef(loadHiddenSearchTerms(userLoginNumber));

  useEffect(() => {
    hiddenSearchTermsRef.current = loadHiddenSearchTerms(userLoginNumber);
  }, [userLoginNumber]);
  const [headerPinned, setHeaderPinned] = useState(false);
  const [headerShown, setHeaderShown] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [submitted, setSubmitted] = useState('');
  const [searchMode, setSearchMode] = useState(false);
  const [recent, setRecent] = useState([]);
  const [sortBy, setSortBy] = useState(SORTS[0]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filter, setFilter] = useState(DEFAULT_FILTER);
  const isFilterActive = JSON.stringify(filter) !== JSON.stringify(DEFAULT_FILTER);

  const submittedWord = submitted.trim();
  const showRecent = searchMode && !submittedWord;
  const showResults = searchMode && !!submittedWord;

  const setMode = (next) => {
    setSearchMode(next);
    setFeedSearchMode?.(next);
    if (next) {
      pageRef.current?.scrollTo(0, 0);
      window.scrollTo(0, 0);
    }
  };

  // 공통 헤더 클릭으로 Layout이 검색을 끈 경우 Feed 상태 동기화
  useEffect(() => {
    if (feedSearchMode === false && searchMode) {
      setSearchMode(false);
      setQuery('');
      setSubmitted('');
      inputRef.current?.blur();
    }
  }, [feedSearchMode, searchMode]);

  useEffect(() => {
    if (!userLoginNumber) return undefined;

    let cancelled = false;
    setLoading(true);

    const fetchRecipes = async () => {
      try {
        const response = await getRecipes({
          userNumber: userLoginNumber,
          cursor: 1,
          size: 7,
          timeRequired: TIME_REQUIRED_MAP[filter.cookTime],
          difficultyLevel: filter.difficultyAny ? undefined : `LEVEL_${filter.difficulty}`,
          category: CATEGORY_MAP[filter.category],
          sortType: sortBy === SORTS[1] ? 'FOOD_INTEGRATION' : 'DEFAULT',
        });
        if (cancelled) return;
        const payload = response.data ?? response;
        setSections(buildFeedSections(payload));
      } catch (error) {
        console.error('레시피 목록 조회 실패:', error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchRecipes();
    return () => {
      cancelled = true;
    };
  }, [userLoginNumber, filter, sortBy]);

  useEffect(() => {
    if (!userLoginNumber || !showResults) return undefined;

    let cancelled = false;
    setSearchLoading(true);

    const fetchSearchRecipes = async () => {
      try {
        const response = await searchRecipes({
          userNumber: userLoginNumber,
          searchWord: submittedWord,
          cursor: 1,
          size: 10,
          timeRequired: TIME_REQUIRED_MAP[filter.cookTime],
          difficultyLevel: filter.difficultyAny ? undefined : `LEVEL_${filter.difficulty}`,
          category: CATEGORY_MAP[filter.category],
          sortType: sortBy === SORTS[1] ? 'FOOD_INTEGRATION' : 'DEFAULT',
        });
        if (cancelled) return;
        const payload = response.data ?? response;
        setSearchResults((payload.content ?? []).map(mapRecipeCard));
      } catch (error) {
        console.error('레시피 검색 실패:', error);
      } finally {
        if (!cancelled) setSearchLoading(false);
      }
    };

    fetchSearchRecipes();
    return () => {
      cancelled = true;
    };
  }, [userLoginNumber, showResults, submittedWord, filter, sortBy]);

  useEffect(() => {
    if (!userLoginNumber) return undefined;
    if (submittedWord) return undefined;

    let cancelled = false;

    const fetchSearchHistory = async () => {
      try {
        const response = await getRecipeSearchHistory(userLoginNumber);
        if (cancelled) return;
        const payload = response.data ?? response;
        const hidden = hiddenSearchTermsRef.current;
        setRecent(
          (payload.searchHistoryList ?? []).filter(
            (term) => typeof term === 'string' && term.trim() && !hidden.has(term)
          )
        );
      } catch (error) {
        console.error('최근 검색 기록 조회 실패:', error);
      }
    };

    fetchSearchHistory();
    return () => {
      cancelled = true;
    };
  }, [userLoginNumber, submittedWord]);

  useEffect(
    () => () => {
      if (pinTimerRef.current) window.clearTimeout(pinTimerRef.current);
      pinScrollCleanupRef.current?.();
    },
    []
  );

  const unpinHeader = () => {
    setHeaderPinned(false);
    setHeaderShown(false);
  };

  const scrollToTop = () => {
    const headerEl = headerRef.current;
    const height = headerEl?.offsetHeight ?? 0;
    const headerOffscreen = !headerEl || headerEl.getBoundingClientRect().bottom <= 0;
    let scrollTarget = pageRef.current;

    while (scrollTarget?.parentElement && scrollTarget.scrollTop <= 0) {
      scrollTarget = scrollTarget.parentElement;
    }

    const target =
      scrollTarget && scrollTarget.scrollTop > 0 ? scrollTarget : window;

    if (headerOffscreen && height > 0) {
      setHeaderHeight(height);
      setHeaderPinned(true);
      setHeaderShown(false);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setHeaderShown(true));
      });

      if (pinTimerRef.current) window.clearTimeout(pinTimerRef.current);
      pinScrollCleanupRef.current?.();
      const scrollSources = [
        ...new Set([target, pageRef.current, window].filter(Boolean)),
      ];
      const getScrollTop = (source) =>
        source === window ? window.scrollY : source.scrollTop;
      const previousScrollTops = new Map(
        scrollSources.map((source) => [source, getScrollTop(source)])
      );
      let hidingHeader = false;

      const finishToTopScroll = () => {
        target.removeEventListener('scrollend', finishToTopScroll);
        if (pinTimerRef.current) window.clearTimeout(pinTimerRef.current);
      };

      const handleScroll = (event) => {
        const source = event.currentTarget;
        const currentScrollTop = getScrollTop(source);
        const previousScrollTop = previousScrollTops.get(source) ?? currentScrollTop;

        if (currentScrollTop > previousScrollTop) {
          hidingHeader = true;
          setHeaderShown(false);
        } else if (currentScrollTop < previousScrollTop - 1 && currentScrollTop <= 1) {
          hidingHeader = false;
          setHeaderShown(true);
        }

        if (hidingHeader && currentScrollTop >= height) {
          pinScrollCleanupRef.current?.();
          unpinHeader();
        }

        previousScrollTops.set(source, currentScrollTop);
      };

      pinScrollCleanupRef.current = () => {
        target.removeEventListener('scrollend', finishToTopScroll);
        scrollSources.forEach((source) =>
          source.removeEventListener('scroll', handleScroll)
        );
        pinScrollCleanupRef.current = null;
      };

      target.addEventListener('scrollend', finishToTopScroll, { once: true });
      scrollSources.forEach((source) =>
        source.addEventListener('scroll', handleScroll, { passive: true })
      );
      pinTimerRef.current = window.setTimeout(finishToTopScroll, 2500);
    }

    target.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const enterSearch = () => setMode(true);

  const applyQuery = (term) => {
    const next = term.trim();
    if (!next) return;
    hiddenSearchTermsRef.current.delete(next);
    saveHiddenSearchTerms(userLoginNumber, hiddenSearchTermsRef.current);
    setQuery(next);
    setSubmitted(next);
    setMode(true);
  };

  const clearRecent = async (event) => {
    event?.stopPropagation();
    if (recent.length === 0) return;
    recent.forEach((term) => hiddenSearchTermsRef.current.add(term));
    saveHiddenSearchTerms(userLoginNumber, hiddenSearchTermsRef.current);
    setRecent([]);
    if (!userLoginNumber) return;
    try {
      await deleteRecipeSearchHistory(userLoginNumber);
      hiddenSearchTermsRef.current = new Set();
      saveHiddenSearchTerms(userLoginNumber, hiddenSearchTermsRef.current);
    } catch (error) {
      console.error('최근 검색 기록 삭제 실패:', error);
    }
  };

  const patchSaved = (recipeId, isSaved) => {
    setSections((prev) =>
      prev.map((section) =>
        section.type === 'banner'
          ? section
          : {
              ...section,
              recipes: section.recipes.map((item) =>
                item.id === recipeId ? { ...item, isSaved } : item
              ),
            }
      )
    );
    setSearchResults((prev) =>
      prev.map((item) => (item.id === recipeId ? { ...item, isSaved } : item))
    );
  };

  const findRecipe = (id) => {
    const fromSearch = searchResults.find((item) => item.id === id);
    if (fromSearch) return fromSearch;
    for (const section of sections) {
      const found = section.recipes?.find((item) => item.id === id);
      if (found) return found;
    }
    return undefined;
  };

  const toggleSave = async (id) => {
    if (!userLoginNumber) {
      console.error('사용자 정보가 없습니다.');
      return;
    }

    const recipe = findRecipe(id);
    if (recipe?.isSaved) {
      try {
        await deleteFavoriteRecipe(id, userLoginNumber);
        patchSaved(id, false);
      } catch (error) {
        console.error('레시피 찜 해제 실패:', error);
      }
      return;
    }

    try {
      await postFavoriteRecipe(id, userLoginNumber);
      patchSaved(id, true);
    } catch (error) {
      if (error.response?.status === 409) {
        patchSaved(id, true);
        return;
      }
      console.error('레시피 찜 등록 실패:', error);
    }
  };

  return (
    // 피드 스크롤 페이지 — 세로 전체 영역
    <Page ref={pageRef}>
      {headerPinned && <HeaderSpacer $height={headerHeight} />}
      <FeedTop ref={headerRef} $pinned={headerPinned} $shown={headerShown}>
        <Header
          searchActive={searchMode}
          onExitSearch={() => {
            setMode(false);
            setQuery('');
            setSubmitted('');
            inputRef.current?.blur();
          }}
        />
        <SearchRow $searchActive={searchMode}>
          <SearchBox>
            <SearchIcon src={searchIcon} alt="" />
            <SearchInput
              ref={inputRef}
              type="search"
              placeholder="재료나 요리 이름을 검색해 보세요"
              value={query}
              onFocus={enterSearch}
              onChange={(e) => {
                const next = e.target.value;
                setQuery(next);
                setMode(true);
                if (!next.trim()) setSubmitted('');
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') applyQuery(query);
              }}
            />
          </SearchBox>
          <FilterBtn
            type="button"
            aria-label="필터"
            aria-expanded={filterOpen}
            aria-pressed={isFilterActive}
            onClick={() => setFilterOpen(true)}
          >
            <FilterImg src={filterIcon} alt="" />
            {isFilterActive && <FilterDot aria-hidden />}
          </FilterBtn>
        </SearchRow>
        <SortRow $open={!showRecent} inert={showRecent ? true : undefined}>
          <SortRowInner>
            <SortBtn
              type="button"
              aria-label="정렬 전환"
              onClick={() => setSortBy((prev) => (prev === SORTS[0] ? SORTS[1] : SORTS[0]))}
            >
              <SortLabel>{sortBy}</SortLabel>
              <ChevronWrap>
                <Chevron src={chevronIcon} alt="" />
              </ChevronWrap>
            </SortBtn>
          </SortRowInner>
        </SortRow>
      </FeedTop>

      {/* 필터 모달 */}
      <FilterPanel
        open={filterOpen}
        value={filter}
        onApply={setFilter}
        onClose={() => setFilterOpen(false)}
      />

      {/* 검색 포커스·빈 입력 — 최근 검색어 (피그마 1355:11856) */}
      {!showResults && (
        <RecentBlock $open={showRecent} aria-hidden={!showRecent} inert={showRecent ? undefined : true}>
          <RecentInner $open={showRecent}>
            <RecentHeader>
              <RecentTitle>최근 검색어</RecentTitle>
              <ClearRecentBtn
                type="button"
                onClick={clearRecent}
                $hidden={recent.length === 0}
                tabIndex={recent.length === 0 ? -1 : 0}
                aria-hidden={recent.length === 0}
              >
                전체 지우기
              </ClearRecentBtn>
            </RecentHeader>
            <RecentChips>
              {recent.map((term) => (
                <RecentChip key={term} type="button" onClick={() => applyQuery(term)}>
                  {term}
                </RecentChip>
              ))}
            </RecentChips>
          </RecentInner>
        </RecentBlock>
      )}

      {/* 검색어 입력 후 — 정렬 + 2열 결과 (피그마 1353:3642) */}
      {showResults && searchLoading && (
        <LoaderWrap>
          <LoaderImg src={loaderSvg} alt="" />
        </LoaderWrap>
      )}
      {showResults && !searchLoading && (
        <ResultGrid>
          {searchResults.map((r) => (
            <MenuCard
              key={r.id}
              image={r.image}
              title={r.title}
              time={r.time}
              utilization={r.utilization}
              difficulty={r.difficulty}
              isSaved={r.isSaved}
              onClick={() => navigate(`/recipes/${r.id}`)}
              onToggleSave={() => toggleSave(r.id)}
            />
          ))}
        </ResultGrid>
      )}

      {/* 기본 피드 — 섹션 가로 스크롤 */}
      {!showResults && (
        <FeedBody $open={!searchMode} aria-hidden={searchMode} inert={searchMode ? true : undefined}>
          {loading ? (
            <LoaderWrap>
              <LoaderImg src={loaderSvg} alt="" />
            </LoaderWrap>
          ) : (
            <>
              {sections.map((block, i) => {
              if (block.type === 'banner') {
                return (
                  <Banner key={block.id}>
                    <BannerImg src={adBannerImg} alt="웜도시락 소불고기 곤드레밥 마켓에서 구매하기" />
                  </Banner>
                );
              }

              const prev = sections[i - 1];
              const top = !prev ? 26 : prev.type === 'banner' ? 0 : 48;

              return (
                <Section key={block.id} $top={top}>
                  <SectionHeader>
                    <SectionTitle>{block.title}</SectionTitle>
                    {block.hasMore && (
                      <MoreButton
                        type="button"
                        onClick={() =>
                          navigate(`/feed/${block.id}`, {
                            state: {
                              title: block.title,
                              filter,
                              sortBy,
                            },
                          })
                        }
                      >
                        더보기
                      </MoreButton>
                    )}
                  </SectionHeader>
                  <CardRow>
                    {block.recipes.map((r) => (
                      <MenuCard
                        key={`${block.id}-${r.id}`}
                        image={r.image}
                        title={r.title}
                        time={r.time}
                        utilization={r.utilization}
                        difficulty={r.difficulty}
                        isSaved={r.isSaved}
                        onClick={() => navigate(`/recipes/${r.id}`)}
                        onToggleSave={() => toggleSave(r.id)}
                      />
                    ))}
                  </CardRow>
                </Section>
              );
            })}
            <ToTopWrap>
              <ToTopBtn type="button" aria-label="맨 위로" onClick={scrollToTop}>
                <ToTopChevron src={toTopChevronIcon} alt="" />
              </ToTopBtn>
            </ToTopWrap>
            </>
          )}
        </FeedBody>
      )}
    </Page>
  );
}

export default Feed;

/* —— 페이지: 세로 스크롤 컬럼 —— */
const Page = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding-bottom: 28px;
  background: #fffefd;
`;

const LoaderWrap = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  z-index: 15;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translate(-50%, -50%);
  pointer-events: none;
`;

const LoaderImg = styled.img`
  display: block;
  width: 40px;
  height: 40px;
`;

const HeaderSpacer = styled.div`
  flex-shrink: 0;
  height: ${({ $height }) => $height}px;
`;

const FeedTop = styled.div`
  z-index: 25;
  flex-shrink: 0;
  background: #fffefd;
  padding-bottom: 4px;

  ${({ $pinned, $shown }) =>
    $pinned
      ? `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    width: 100%;
    margin: 0 auto;
    transform: translateY(${$shown ? '0' : '-100%'});
    transition: ${$shown ? `transform ${HEADER_SLIDE_MS}ms cubic-bezier(0.22, 1, 0.36, 1)` : 'none'};
  `
      : ''}
`;

/* —— 검색 행: 검색창 + 필터 버튼 가로 —— */
const SearchRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: ${({ $searchActive }) => ($searchActive ? '11px' : '16px')};
  padding: 0 20px;
  transition: margin-top ${SEARCH_TRANSITION_MS}ms ${SEARCH_EASE};

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

/* —— 검색 박스: 둥근 사각(radius 12) —— */
const SearchBox = styled.div`
  position: relative;
  flex: 1;
  min-width: 0;
  height: 48px;
  overflow: hidden;
  border-radius: 12px;
  background: #fff;
  box-shadow:
    0 0 8px 0 rgba(3, 3, 3, 0.05),
    0 0 30px 0 rgba(3, 3, 3, 0.05);
`;

/* —— 돋보기 아이콘: 22×22 —— */
const SearchIcon = styled.img`
  position: absolute;
  top: 13px;
  left: 16px;
  width: 22px;
  height: 22px;
  pointer-events: none;
`;

/* —— 검색 입력 —— */
const SearchInput = styled.input`
  width: 100%;
  height: 100%;
  padding: 0 16px 0 50px;
  border: none;
  background: transparent;
  font-size: 15px;
  font-weight: 500;
  line-height: 1.3;
  color: #2e2e2e;
  outline: none;

  &::placeholder {
    color: #bebebf;
  }

  &::-webkit-search-decoration,
  &::-webkit-search-cancel-button {
    appearance: none;
  }
`;

/* —— 필터 버튼: 둥근 사각 48×48 —— */
const FilterBtn = styled.button`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  padding: 0;
  border: none;
  border-radius: 10px;
  background: #fff;
  box-shadow:
    0 0 8px 0 rgba(3, 3, 3, 0.05),
    0 0 30px 0 rgba(3, 3, 3, 0.05);
  cursor: pointer;
`;

/* —— 필터(슬라이더) 아이콘: 22×22 —— */
const FilterImg = styled.img`
  display: block;
  width: 22px;
  height: 22px;
`;

/* —— 필터 적용 점: 6×6, top 10 / left 34 (피그마 1355:11855) —— */
const FilterDot = styled.span`
  position: absolute;
  top: 10px;
  left: 34px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #96d960;
`;

/* —— 최근 검색어 블록 —— */
const RecentBlock = styled.section`
  display: grid;
  grid-template-rows: ${({ $open }) => ($open ? '1fr' : '0fr')};
  margin-top: ${({ $open }) => ($open ? '24px' : '0')};
  padding: ${({ $open }) => ($open ? '0 20px 16px 14px' : '0 20px 0 14px')};
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  transform: ${({ $open }) => ($open ? 'none' : 'translateY(10px)')};
  pointer-events: ${({ $open }) => ($open ? 'auto' : 'none')};
  transition:
    grid-template-rows ${SEARCH_TRANSITION_MS}ms ${SEARCH_EASE},
    margin-top ${SEARCH_TRANSITION_MS}ms ${SEARCH_EASE},
    padding ${SEARCH_TRANSITION_MS}ms ${SEARCH_EASE},
    opacity ${SEARCH_TRANSITION_MS}ms ${SEARCH_EASE},
    transform ${SEARCH_TRANSITION_MS}ms ${SEARCH_EASE};

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

const RecentInner = styled.div`
  overflow: ${({ $open }) => ($open ? 'visible' : 'hidden')};
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

/* —— 최근 검색어 제목 행 —— */
const RecentHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 6px 0 14px;
`;

/* —— 최근 검색어 제목 —— */
const RecentTitle = styled.h2`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  line-height: 1.3;
  letter-spacing: -0.16px;
  color: #2e2e2e;
`;

const ClearRecentBtn = styled.button`
  padding: 4px 0 4px 12px;
  border: none;
  background: transparent;
  font-size: 13px;
  font-weight: 600;
  line-height: 1.3;
  letter-spacing: -0.13px;
  color: #8b8b8b;
  cursor: pointer;
  visibility: ${({ $hidden }) => ($hidden ? 'hidden' : 'visible')};
  pointer-events: ${({ $hidden }) => ($hidden ? 'none' : 'auto')};
`;

/* —— 최근 검색어 칩 가로 줄 —— */
const RecentChips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 0 0 8px 12px;
`;

/* —— 최근 검색어 칩: pill —— */
const RecentChip = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  border: none;
  border-radius: 30px;
  background: #fff;
  box-shadow:
    0 0 8px 0 rgba(3, 3, 3, 0.05),
    0 0 30px 0 rgba(3, 3, 3, 0.05);
  font-size: 14px;
  font-weight: 500;
  line-height: 1.2;
  letter-spacing: -0.42px;
  color: #727272;
  cursor: pointer;
`;

/* —— 정렬 행: 오른쪽 정렬 —— */
const SortRow = styled.div`
  display: grid;
  grid-template-rows: ${({ $open }) => ($open ? '1fr' : '0fr')};
  margin-top: ${({ $open }) => ($open ? '12px' : '0')};
  padding: 0 22px 0 20px;
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  pointer-events: ${({ $open }) => ($open ? 'auto' : 'none')};
  transition:
    grid-template-rows ${SEARCH_TRANSITION_MS}ms ${SEARCH_EASE},
    margin-top ${SEARCH_TRANSITION_MS}ms ${SEARCH_EASE},
    opacity ${SEARCH_TRANSITION_MS}ms ${SEARCH_EASE};

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

const SortRowInner = styled.div`
  overflow: hidden;
  min-height: 0;
  display: flex;
  justify-content: flex-end;
`;

/* —— 정렬 버튼: 텍스트+아이콘 가로 —— */
const SortBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  height: 28px;
  padding: 4px;
  border: none;
  background: transparent;
  cursor: pointer;
`;

/* —— 정렬 라벨 텍스트 —— */
const SortLabel = styled.span`
  font-size: 15px;
  font-weight: 500;
  line-height: 1.3;
  color: #8b8b8b;
  white-space: nowrap;
`;

/* —— 쉐브론 래퍼: 피그마 11×6 슬롯 —— */
const ChevronWrap = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 11px;
  height: 6px;
`;

/* —— 쉐브론: 피그마 `>` (6×11) 를 90° 회전 —— */
const Chevron = styled.img`
  display: block;
  width: 6px;
  height: 11px;
  transform: rotate(90deg);
`;

const feedSearchFadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

/* —— 검색 결과 2열 그리드 —— */
const ResultGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 168px);
  column-gap: 12px;
  row-gap: 32px;
  justify-content: center;
  margin-top: 24px;
  padding: 0 20px;
  animation: ${feedSearchFadeIn} ${SEARCH_TRANSITION_MS}ms ${SEARCH_EASE};

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const FeedBody = styled.div`
  display: ${({ $open }) => ($open ? 'block' : 'none')};
`;

/* —— 섹션: 제목 + 카드 줄 —— */
const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: ${({ $top }) => $top}px;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
`;

/* —— 섹션 제목 텍스트 —— */
const SectionTitle = styled.h2`
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  line-height: 1.3;
  letter-spacing: -0.18px;
  color: #1a1a1a;
`;

const MoreButton = styled.button`
  padding: 0;
  border: none;
  background: transparent;
  font-size: 16px;
  font-weight: 600;
  line-height: 1.2;
  letter-spacing: -0.32px;
  color: #adadad;
  cursor: pointer;
`;

/* —— 카드 가로 스크롤 트랙 —— */
const CardRow = styled.div`
  display: flex;
  gap: 8px;
  padding: 0 20px;
  overflow-x: auto;

  &::-webkit-scrollbar {
    display: none;
  }
`;

/* —— 광고 배너: 가로 full —— */
const Banner = styled.div`
  flex-shrink: 0;
  width: 100%;
  margin: 28px 0;
  overflow: hidden;
`;

const BannerImg = styled.img`
  display: block;
  width: 100%;
  height: auto;
  object-fit: cover;
`;

const ToTopWrap = styled.div`
  position: fixed;
  right: max(20px, calc(50% - 175px));
  bottom: 112px;
  z-index: 19;
  display: flex;
  width: 40px;
  height: 40px;
`;

const ToTopBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  padding: 0;
  border: none;
  border-radius: 1000px;
  background: #fff;
  box-shadow:
    0 0 5px rgba(3, 3, 3, 0.06),
    0 0 20px rgba(3, 3, 3, 0.08);
  cursor: pointer;
`;

const ToTopChevron = styled.img`
  display: block;
  width: 24px;
  height: 24px;
  transform: rotate(90deg);
`;
