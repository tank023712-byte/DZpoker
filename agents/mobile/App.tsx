/**
 * 德州扑克教学 App 新视觉首屏实现
 * 修改重点：按 Figma 设计稿重构首页、工具、课程、我的四个核心移动端页面。
 */
import { StatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type RootTabKey = 'home' | 'tools' | 'courses' | 'profile';
type HomeChannelKey =
  | 'following'
  | 'recommend'
  | 'knowledge'
  | 'community'
  | 'video'
  | 'live';

type FeedCard = {
  id: string;
  accent: string;
  badge: string;
  cta?: string;
  meta: string;
  title: string;
};

const colors = {
  panel: '#F6F2E6',
  card: '#FFFCF2',
  ink: '#090E10',
  table: '#09201D',
  tableLift: '#0F312B',
  mint: '#20E0AF',
  mintSoft: '#D5F9EB',
  coral: '#FF5241',
  gold: '#F0B948',
  blue: '#4389F4',
  muted: '#7D837C',
  line: '#DCD2B5',
  white: '#FFFFFF',
};

const rootTabs: Array<{ key: RootTabKey; label: string }> = [
  { key: 'home', label: '首页' },
  { key: 'tools', label: '工具' },
  { key: 'courses', label: '课程' },
  { key: 'profile', label: '我的' },
];

const homeChannels: Array<{ key: HomeChannelKey; label: string }> = [
  { key: 'following', label: '关注' },
  { key: 'recommend', label: '推荐' },
  { key: 'knowledge', label: '知识' },
  { key: 'community', label: '社区' },
  { key: 'video', label: '视频' },
  { key: 'live', label: '直播' },
];

// 首版仍使用本地 mock 数据，后续接入 /api/v1/feed?channel=xxx。
const channelCards: Record<HomeChannelKey, FeedCard[]> = {
  following: [
    {
      id: 'following-1',
      accent: colors.mint,
      badge: '关注',
      title: '你关注的教练更新了 3bet 底池复盘',
      meta: '12 分钟前 · 3 条评论',
      cta: '查看',
    },
    {
      id: 'following-2',
      accent: colors.coral,
      badge: '直播预告',
      title: '今晚复盘线上 MTT 中后期短码决策',
      meta: '20:30 开始 · 128 人预约',
      cta: '预约',
    },
  ],
  recommend: [
    {
      id: 'recommend-1',
      accent: colors.coral,
      badge: '直播中',
      title: '今晚 21:00 牌谱复盘直播',
      meta: 'MTT 决赛桌 · 128 人预约',
      cta: '预约',
    },
    {
      id: 'recommend-2',
      accent: colors.mint,
      badge: '知识',
      title: '位置优势为什么是德州扑克的第一原则',
      meta: '6 分钟阅读 · 收藏 328',
    },
    {
      id: 'recommend-3',
      accent: colors.gold,
      badge: '课程',
      title: '现金桌基础系统课',
      meta: '$29.99 · 18 节 · 支持试看',
      cta: '试看',
    },
  ],
  knowledge: [
    {
      id: 'knowledge-1',
      accent: colors.mint,
      badge: '策略概念',
      title: '翻前范围：新手最该先记住的 4 个边界',
      meta: '入门 · 收藏 328',
    },
    {
      id: 'knowledge-2',
      accent: colors.blue,
      badge: '知识文章',
      title: '翻牌圈顶对弱踢脚，应该控池还是下注？',
      meta: '8 分钟阅读 · 精选',
    },
  ],
  community: [
    {
      id: 'community-1',
      accent: colors.gold,
      badge: '社区',
      title: '这手河牌跟注是不是太薄？',
      meta: '待讨论 · 24 个点赞',
      cta: '讨论',
    },
    {
      id: 'community-2',
      accent: colors.mint,
      badge: '运营精选',
      title: '一手 AQo 的三街决策',
      meta: '牌谱摘要 · 9 条评论',
    },
  ],
  video: [
    {
      id: 'video-1',
      accent: colors.coral,
      badge: '视频',
      title: 'SB vs BB 单挑底池实战讲解',
      meta: '38:12 · 继续观看 12:08',
      cta: '播放',
    },
    {
      id: 'video-2',
      accent: colors.blue,
      badge: '视频课',
      title: '如何识别河牌过度诈唬线',
      meta: '24:40 · 2.1k 播放',
    },
  ],
  live: [
    {
      id: 'live-1',
      accent: colors.coral,
      badge: '直播预告',
      title: '今晚 21:00 牌谱复盘直播',
      meta: '21:00 开始 · 可预约',
      cta: '预约',
    },
    {
      id: 'live-2',
      accent: colors.gold,
      badge: '回放',
      title: '上周 MTT 决赛桌复盘回放',
      meta: '72:05 · 已更新',
    },
  ],
};

const trainingTools = [
  {
    accent: colors.mint,
    title: '胜率计算器',
    summary: '输入手牌、公共牌、玩家人数，得到胜率/平局率/败率。',
    action: '计算',
  },
  {
    accent: colors.coral,
    title: 'AI 实战复盘',
    summary: '粘贴文本牌谱，生成局面摘要、行动线分析、关键错误和改进建议。',
    action: '开始分析',
  },
  {
    accent: colors.gold,
    title: '复盘历史',
    summary: '保留原始输入与结构化结果，方便回看同类错误。',
    action: '查看',
  },
];

const courseChapters = [
  { title: '01 翻前范围与位置', meta: '试看 · 18 min', locked: false },
  { title: '02 翻牌圈持续下注', meta: '已锁定 · 21 min', locked: true },
  { title: '03 转牌压力与控池', meta: '已锁定 · 24 min', locked: true },
  { title: '04 河牌价值下注', meta: '已锁定 · 27 min', locked: true },
];

const profileItems = [
  ['已购课程', '现金桌基础课 · 继续第 02 节', colors.gold],
  ['复盘记录', '18 手牌 · 最近更新 12 分钟前', colors.mint],
  ['我的收藏', '文章 / 视频 / 课程 / 回放', colors.coral],
  ['设置与反馈', '账号、安全、举报与合规说明', colors.blue],
] as const;

export default function App() {
  const [activeRootTab, setActiveRootTab] = useState<RootTabKey>('home');
  const [activeChannel, setActiveChannel] =
    useState<HomeChannelKey>('recommend');

  const activeTabLabel = useMemo(
    () => rootTabs.find((tab) => tab.key === activeRootTab)?.label ?? '首页',
    [activeRootTab],
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style={activeRootTab === 'home' ? 'light' : 'dark'} />
      <View style={styles.app}>
        <View style={styles.content}>{renderActiveTab()}</View>
        <BottomNavigation
          activeTab={activeRootTab}
          onChangeTab={setActiveRootTab}
        />
      </View>
    </SafeAreaView>
  );

  function renderActiveTab() {
    if (activeRootTab === 'home') {
      return (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.homeContent}
        >
          <HeroPanel />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.channelRow}
          >
            {homeChannels.map((channel) => (
              <Pill
                key={channel.key}
                active={activeChannel === channel.key}
                label={channel.label}
                onPress={() => setActiveChannel(channel.key)}
              />
            ))}
          </ScrollView>
          <View style={styles.feedList}>
            {channelCards[activeChannel].map((card) => (
              <FeedCardItem key={card.id} card={card} />
            ))}
          </View>
        </ScrollView>
      );
    }

    if (activeRootTab === 'tools') {
      return (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.pageContent}
        >
          <DarkHeader
            eyebrow="训练工具"
            title="把牌谱拆成可训练动作"
            summary="胜率、行动线、关键错误和替代打法集中在一个训练台。"
          />
          <View style={styles.statPanel}>
            <View>
              <Text style={styles.mutedLabel}>本周训练</Text>
              <Text style={styles.statValue}>18 手牌</Text>
            </View>
            <Text style={styles.statCopy}>胜率判断正确率 72%</Text>
          </View>
          {trainingTools.map((tool) => (
            <ToolCard key={tool.title} {...tool} />
          ))}
        </ScrollView>
      );
    }

    if (activeRootTab === 'courses') {
      return (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.pageContent}
        >
          <CourseHero />
          <Text style={styles.sectionHeading}>课程章节</Text>
          {courseChapters.map((chapter, index) => (
            <ChapterCard
              key={chapter.title}
              chapter={chapter}
              index={index}
            />
          ))}
          <View style={styles.inlineNotice}>
            <Text style={styles.inlineNoticeText}>
              购买后同步学习进度，可在“我的”继续观看
            </Text>
          </View>
        </ScrollView>
      );
    }

    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.pageContent}
      >
        <ProfileHeader />
        <Text style={styles.sectionHeading}>学习资产</Text>
        {profileItems.map(([title, summary, accent]) => (
          <ProfileItem
            key={title}
            title={title}
            summary={summary}
            accent={accent}
          />
        ))}
        <Text style={styles.screenCaption}>{activeTabLabel}</Text>
      </ScrollView>
    );
  }
}

function HeroPanel() {
  return (
    <View style={styles.hero}>
      <View style={styles.heroGlow} />
      <Text style={styles.heroEyebrow}>POKER STUDY</Text>
      <Text style={styles.heroTitle}>今天训练哪条决策线？</Text>
      <Text style={styles.heroSummary}>
        从内容、工具到课程，把每一手牌变成可验证的策略。
      </Text>
      <View style={styles.heroCards}>
        <PokerTile rank="A" suit="♠" tone="light" />
        <PokerTile rank="K" suit="♥" tone="coral" raised />
      </View>
      <View style={styles.heroActions}>
        <Pressable style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>AI 复盘</Text>
        </Pressable>
        <Pressable style={styles.ghostButton}>
          <Text style={styles.ghostButtonText}>继续学习</Text>
        </Pressable>
      </View>
    </View>
  );
}

function DarkHeader({
  eyebrow,
  summary,
  title,
}: {
  eyebrow: string;
  summary: string;
  title: string;
}) {
  return (
    <View style={styles.darkHeader}>
      <Text style={styles.heroEyebrow}>{eyebrow}</Text>
      <Text style={styles.darkHeaderTitle}>{title}</Text>
      <Text style={styles.darkHeaderSummary}>{summary}</Text>
    </View>
  );
}

function CourseHero() {
  return (
    <View style={styles.courseHero}>
      <Text style={styles.courseTitle}>现金桌基础系统课</Text>
      <Text style={styles.courseMentor}>讲师 AceLin · 18 节 · 6 个作业</Text>
      <View style={styles.coursePriceBox}>
        <Text style={styles.coursePriceLabel}>单课购买</Text>
        <Text style={styles.coursePrice}>$29.99</Text>
      </View>
      <View style={styles.courseCards}>
        <PokerTile rank="J" suit="♠" tone="light" />
        <PokerTile rank="10" suit="♥" tone="coral" raised />
      </View>
      <Pressable style={styles.courseBuyButton}>
        <Text style={styles.primaryButtonText}>购买并继续学习</Text>
      </Pressable>
    </View>
  );
}

function ProfileHeader() {
  return (
    <View style={styles.profileHeader}>
      <View style={styles.profileTop}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>T</Text>
        </View>
        <View style={styles.profileCopy}>
          <Text style={styles.profileName}>未登录用户</Text>
          <Text style={styles.profileSummary}>
            登录后同步收藏、课程、复盘与关注关系。
          </Text>
        </View>
      </View>
      <Pressable style={styles.loginButton}>
        <Text style={styles.primaryButtonText}>登录 / 注册</Text>
      </Pressable>
      <View style={styles.metricRow}>
        <MetricCard label="关注" value="12" />
        <MetricCard label="粉丝" value="89" />
        <MetricCard label="收藏" value="328" />
      </View>
    </View>
  );
}

function PokerTile({
  raised,
  rank,
  suit,
  tone,
}: {
  raised?: boolean;
  rank: string;
  suit: string;
  tone: 'coral' | 'light';
}) {
  const isCoral = tone === 'coral';

  return (
    <View
      style={[
        styles.pokerTile,
        isCoral ? styles.pokerTileCoral : styles.pokerTileLight,
        raised && styles.pokerTileRaised,
      ]}
    >
      <Text
        style={[styles.pokerRank, isCoral && styles.pokerTextLight]}
        numberOfLines={1}
      >
        {rank}
      </Text>
      <Text style={[styles.pokerSuit, isCoral && styles.pokerTextLight]}>
        {suit}
      </Text>
    </View>
  );
}

function Pill({
  active,
  label,
  onPress,
}: {
  active: boolean;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={[styles.pill, active && styles.pillActive]}
    >
      <Text style={[styles.pillText, active && styles.pillTextActive]}>
        {label}
      </Text>
    </Pressable>
  );
}

function FeedCardItem({ card }: { card: FeedCard }) {
  return (
    <View style={styles.feedCard}>
      <View style={[styles.cardAccent, { backgroundColor: card.accent }]} />
      <Text style={[styles.feedBadge, { color: card.accent }]}>{card.badge}</Text>
      <Text style={styles.feedTitle}>{card.title}</Text>
      <View style={styles.feedFooter}>
        <Text style={styles.feedMeta}>{card.meta}</Text>
        {card.cta ? (
          <Pressable
            style={[
              styles.cardAction,
              card.accent === colors.gold && styles.cardActionGold,
            ]}
          >
            <Text
              style={[
                styles.cardActionText,
                card.accent === colors.gold && styles.cardActionTextGold,
              ]}
            >
              {card.cta}
            </Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

function ToolCard({
  accent,
  action,
  summary,
  title,
}: {
  accent: string;
  action: string;
  summary: string;
  title: string;
}) {
  return (
    <View style={styles.toolCard}>
      <View style={[styles.cardAccent, { backgroundColor: accent }]} />
      <Text style={styles.toolTitle}>{title}</Text>
      <Text style={styles.toolSummary}>{summary}</Text>
      <Pressable style={styles.compactDarkButton}>
        <Text style={styles.compactDarkButtonText}>{action}</Text>
      </Pressable>
    </View>
  );
}

function ChapterCard({
  chapter,
  index,
}: {
  chapter: { locked: boolean; meta: string; title: string };
  index: number;
}) {
  const accent = index === 0 ? colors.mint : colors.line;

  return (
    <View style={styles.chapterCard}>
      <View style={[styles.cardAccent, { backgroundColor: accent }]} />
      <View style={styles.chapterCopy}>
        <Text style={styles.chapterTitle}>{chapter.title}</Text>
        <Text style={styles.chapterMeta}>{chapter.meta}</Text>
      </View>
      <View style={[styles.chapterStatus, !chapter.locked && styles.chapterOpen]}>
        <Text style={styles.chapterStatusText}>
          {chapter.locked ? '锁定' : '试看'}
        </Text>
      </View>
    </View>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metricCard}>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );
}

function ProfileItem({
  accent,
  summary,
  title,
}: {
  accent: string;
  summary: string;
  title: string;
}) {
  return (
    <View style={styles.profileItem}>
      <View style={[styles.cardAccent, { backgroundColor: accent }]} />
      <View style={styles.profileItemCopy}>
        <Text style={styles.profileItemTitle}>{title}</Text>
        <Text style={styles.profileItemSummary}>{summary}</Text>
      </View>
      <Text style={[styles.profileArrow, { color: accent }]}>›</Text>
    </View>
  );
}

function BottomNavigation({
  activeTab,
  onChangeTab,
}: {
  activeTab: RootTabKey;
  onChangeTab: (tab: RootTabKey) => void;
}) {
  return (
    <View style={styles.bottomNavWrap}>
      <View style={styles.bottomNav}>
        {rootTabs.map((tab) => {
          const isActive = activeTab === tab.key;

          return (
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ selected: isActive }}
              key={tab.key}
              onPress={() => onChangeTab(tab.key)}
              style={[styles.bottomNavItem, isActive && styles.bottomNavActive]}
            >
              <Text
                style={[
                  styles.bottomNavText,
                  isActive && styles.bottomNavTextActive,
                ]}
              >
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.panel,
    flex: 1,
  },
  app: {
    backgroundColor: colors.panel,
    flex: 1,
  },
  content: {
    flex: 1,
  },
  homeContent: {
    paddingBottom: 104,
  },
  pageContent: {
    paddingBottom: 104,
  },
  hero: {
    backgroundColor: colors.table,
    height: 265,
    overflow: 'hidden',
    paddingHorizontal: 22,
    paddingTop: 26,
  },
  heroGlow: {
    backgroundColor: colors.mint,
    borderRadius: 100,
    height: 200,
    opacity: 0.16,
    position: 'absolute',
    right: -12,
    top: -48,
    width: 200,
  },
  heroEyebrow: {
    color: colors.mint,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
  heroTitle: {
    color: colors.white,
    fontSize: 29,
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: 34,
    marginTop: 16,
    maxWidth: 270,
  },
  heroSummary: {
    color: '#C7E5DB',
    fontSize: 14,
    lineHeight: 21,
    marginTop: 10,
    maxWidth: 292,
  },
  heroCards: {
    flexDirection: 'row',
    position: 'absolute',
    right: 38,
    top: 92,
  },
  pokerTile: {
    alignItems: 'center',
    borderRadius: 10,
    height: 70,
    justifyContent: 'center',
    marginLeft: 8,
    width: 54,
  },
  pokerTileLight: {
    backgroundColor: colors.white,
  },
  pokerTileCoral: {
    backgroundColor: colors.coral,
  },
  pokerTileRaised: {
    marginTop: -20,
  },
  pokerRank: {
    color: colors.ink,
    fontSize: 24,
    fontWeight: '900',
    lineHeight: 26,
  },
  pokerSuit: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: '900',
    lineHeight: 20,
  },
  pokerTextLight: {
    color: colors.white,
  },
  heroActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 18,
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: colors.mint,
    borderRadius: 14,
    height: 42,
    justifyContent: 'center',
    width: 132,
  },
  primaryButtonText: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: '900',
  },
  ghostButton: {
    alignItems: 'center',
    backgroundColor: colors.tableLift,
    borderColor: '#2E6B5C',
    borderRadius: 14,
    borderWidth: 1,
    height: 42,
    justifyContent: 'center',
    width: 120,
  },
  ghostButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '800',
  },
  channelRow: {
    gap: 8,
    paddingHorizontal: 22,
    paddingTop: 22,
  },
  pill: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderColor: colors.line,
    borderRadius: 17,
    borderWidth: 1,
    height: 34,
    justifyContent: 'center',
    minWidth: 58,
    paddingHorizontal: 16,
  },
  pillActive: {
    backgroundColor: colors.ink,
    borderColor: colors.ink,
  },
  pillText: {
    color: colors.ink,
    fontSize: 13,
    fontWeight: '900',
  },
  pillTextActive: {
    color: colors.mint,
  },
  feedList: {
    gap: 16,
    paddingHorizontal: 22,
    paddingTop: 20,
  },
  feedCard: {
    backgroundColor: colors.card,
    borderColor: colors.line,
    borderRadius: 18,
    borderWidth: 1,
    minHeight: 116,
    overflow: 'hidden',
    paddingBottom: 18,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 18,
  },
  cardAccent: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    top: 0,
    width: 5,
  },
  feedBadge: {
    fontSize: 13,
    fontWeight: '900',
    marginBottom: 12,
  },
  feedTitle: {
    color: colors.ink,
    fontSize: 20,
    fontWeight: '900',
    lineHeight: 25,
  },
  feedFooter: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  feedMeta: {
    color: colors.muted,
    flex: 1,
    fontSize: 13,
  },
  cardAction: {
    alignItems: 'center',
    backgroundColor: colors.ink,
    borderRadius: 12,
    height: 34,
    justifyContent: 'center',
    marginLeft: 12,
    width: 70,
  },
  cardActionGold: {
    backgroundColor: colors.gold,
  },
  cardActionText: {
    color: colors.mint,
    fontSize: 13,
    fontWeight: '900',
  },
  cardActionTextGold: {
    color: colors.ink,
  },
  darkHeader: {
    backgroundColor: colors.table,
    minHeight: 226,
    paddingHorizontal: 22,
    paddingTop: 38,
  },
  darkHeaderTitle: {
    color: colors.white,
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: 34,
    marginTop: 16,
    maxWidth: 302,
  },
  darkHeaderSummary: {
    color: '#C7E5DB',
    fontSize: 14,
    lineHeight: 21,
    marginTop: 12,
    maxWidth: 302,
  },
  statPanel: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderColor: colors.line,
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 22,
    marginTop: -58,
    padding: 20,
  },
  mutedLabel: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '800',
  },
  statValue: {
    color: colors.ink,
    fontSize: 30,
    fontWeight: '900',
    marginTop: 8,
  },
  statCopy: {
    color: colors.table,
    fontSize: 15,
    fontWeight: '900',
    lineHeight: 20,
    maxWidth: 140,
  },
  toolCard: {
    backgroundColor: colors.card,
    borderColor: colors.line,
    borderRadius: 18,
    borderWidth: 1,
    marginHorizontal: 22,
    marginTop: 16,
    minHeight: 132,
    overflow: 'hidden',
    padding: 20,
  },
  toolTitle: {
    color: colors.ink,
    fontSize: 22,
    fontWeight: '900',
  },
  toolSummary: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 10,
    maxWidth: 278,
  },
  compactDarkButton: {
    alignItems: 'center',
    backgroundColor: colors.ink,
    borderRadius: 13,
    height: 36,
    justifyContent: 'center',
    marginTop: 18,
    width: 112,
  },
  compactDarkButtonText: {
    color: colors.mint,
    fontSize: 13,
    fontWeight: '900',
  },
  courseHero: {
    backgroundColor: colors.ink,
    minHeight: 310,
    overflow: 'hidden',
    paddingHorizontal: 24,
    paddingTop: 38,
  },
  courseTitle: {
    color: colors.white,
    fontSize: 30,
    fontWeight: '900',
    lineHeight: 34,
    maxWidth: 260,
  },
  courseMentor: {
    color: '#C7E5DB',
    fontSize: 14,
    marginTop: 14,
  },
  coursePriceBox: {
    backgroundColor: colors.mint,
    borderRadius: 18,
    height: 76,
    justifyContent: 'center',
    marginTop: 28,
    paddingHorizontal: 18,
    width: 160,
  },
  coursePriceLabel: {
    color: colors.ink,
    fontSize: 13,
    fontWeight: '800',
  },
  coursePrice: {
    color: colors.ink,
    fontSize: 26,
    fontWeight: '900',
    marginTop: 4,
  },
  courseCards: {
    flexDirection: 'row',
    position: 'absolute',
    right: 38,
    top: 132,
  },
  courseBuyButton: {
    alignItems: 'center',
    backgroundColor: colors.mint,
    borderRadius: 16,
    bottom: 22,
    height: 46,
    justifyContent: 'center',
    left: 24,
    position: 'absolute',
    right: 24,
  },
  sectionHeading: {
    color: colors.ink,
    fontSize: 22,
    fontWeight: '900',
    marginHorizontal: 24,
    marginTop: 28,
  },
  chapterCard: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderColor: colors.line,
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: 'row',
    height: 72,
    marginHorizontal: 24,
    marginTop: 16,
    overflow: 'hidden',
    paddingLeft: 20,
    paddingRight: 18,
  },
  chapterCopy: {
    flex: 1,
  },
  chapterTitle: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: '800',
  },
  chapterMeta: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 7,
  },
  chapterStatus: {
    alignItems: 'center',
    backgroundColor: colors.panel,
    borderColor: colors.line,
    borderRadius: 11,
    borderWidth: 1,
    height: 30,
    justifyContent: 'center',
    width: 52,
  },
  chapterOpen: {
    backgroundColor: colors.mint,
    borderColor: colors.mint,
  },
  chapterStatusText: {
    color: colors.ink,
    fontSize: 12,
    fontWeight: '900',
  },
  inlineNotice: {
    backgroundColor: colors.card,
    borderColor: colors.line,
    borderRadius: 16,
    borderWidth: 1,
    marginHorizontal: 24,
    marginTop: 20,
    padding: 14,
  },
  inlineNoticeText: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 16,
  },
  profileHeader: {
    backgroundColor: colors.table,
    paddingHorizontal: 24,
    paddingTop: 44,
  },
  profileTop: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  avatar: {
    alignItems: 'center',
    backgroundColor: colors.mint,
    borderRadius: 36,
    height: 72,
    justifyContent: 'center',
    width: 72,
  },
  avatarText: {
    color: colors.ink,
    fontSize: 38,
    fontWeight: '900',
  },
  profileCopy: {
    flex: 1,
    marginLeft: 16,
  },
  profileName: {
    color: colors.white,
    fontSize: 24,
    fontWeight: '900',
  },
  profileSummary: {
    color: '#C7E5DB',
    fontSize: 13,
    lineHeight: 18,
    marginTop: 8,
  },
  loginButton: {
    alignItems: 'center',
    backgroundColor: colors.mint,
    borderRadius: 16,
    height: 46,
    justifyContent: 'center',
    marginTop: 32,
  },
  metricRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 22,
    transform: [{ translateY: 34 }],
  },
  metricCard: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 18,
    flex: 1,
    height: 64,
    justifyContent: 'center',
  },
  metricValue: {
    color: colors.ink,
    fontSize: 22,
    fontWeight: '900',
  },
  metricLabel: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 4,
  },
  profileItem: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderColor: colors.line,
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: 'row',
    height: 72,
    marginHorizontal: 24,
    marginTop: 16,
    overflow: 'hidden',
    paddingLeft: 20,
    paddingRight: 18,
  },
  profileItemCopy: {
    flex: 1,
  },
  profileItemTitle: {
    color: colors.ink,
    fontSize: 17,
    fontWeight: '900',
  },
  profileItemSummary: {
    color: colors.muted,
    fontSize: 13,
    marginTop: 7,
  },
  profileArrow: {
    fontSize: 28,
    fontWeight: '900',
  },
  screenCaption: {
    color: colors.muted,
    fontSize: 12,
    marginHorizontal: 24,
    marginTop: 20,
  },
  bottomNavWrap: {
    bottom: 14,
    left: 14,
    position: 'absolute',
    right: 14,
  },
  bottomNav: {
    backgroundColor: colors.ink,
    borderRadius: 22,
    flexDirection: 'row',
    height: 58,
    padding: 10,
  },
  bottomNavItem: {
    alignItems: 'center',
    borderRadius: 15,
    flex: 1,
    justifyContent: 'center',
  },
  bottomNavActive: {
    backgroundColor: colors.mintSoft,
  },
  bottomNavText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '900',
  },
  bottomNavTextActive: {
    color: colors.ink,
  },
});
