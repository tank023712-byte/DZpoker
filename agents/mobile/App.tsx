/**
 * 德州扑克内容消费 App MVP 首屏骨架
 * 修改重点：实现底部 4 个一级 Tab，以及首页内 6 个内容频道的可切换导航。
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

type ContentCard = {
  id: string;
  title: string;
  summary: string;
  typeLabel: string;
  meta: string;
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

// 首屏先使用本地 mock 数据，后续替换为 /api/v1/feed?channel=xxx 聚合流接口。
const channelCards: Record<HomeChannelKey, ContentCard[]> = {
  following: [
    {
      id: 'following-1',
      title: '你关注的教练更新了 3bet 底池复盘',
      summary: '从按钮位开局范围到转牌持续下注，拆解一手常见但容易过度防守的牌局。',
      typeLabel: '关注动态',
      meta: '12 分钟前 · 3 条评论',
    },
    {
      id: 'following-2',
      title: '关注作者发布直播预告',
      summary: '今晚复盘线上 MTT 中后期短码决策，支持预约提醒。',
      typeLabel: '直播预告',
      meta: '20:30 开始 · 128 人预约',
    },
  ],
  recommend: [
    {
      id: 'recommend-1',
      title: '翻牌圈顶对弱踢脚，应该控池还是下注？',
      summary: '推荐流混合展示文章、视频、社区动态、课程卡片与直播入口。',
      typeLabel: '推荐',
      meta: '精选 · 8 分钟阅读',
    },
    {
      id: 'recommend-2',
      title: '从入门到稳定盈利：现金桌基础课',
      summary: '单课购买课程，含 18 节系统训练和 6 个实战作业。',
      typeLabel: '课程',
      meta: '$29.99 · 支持试看',
    },
  ],
  knowledge: [
    {
      id: 'knowledge-1',
      title: '位置优势为什么是德州扑克的第一原则',
      summary: '用按钮位、盲注位和前位的 EV 差异解释策略基础。',
      typeLabel: '知识文章',
      meta: '小编上传 · 6 分钟阅读',
    },
    {
      id: 'knowledge-2',
      title: '翻前范围：新手最该先记住的 4 个边界',
      summary: '不背死表，先理解位置、筹码深度、对手类型和后手行动。',
      typeLabel: '策略概念',
      meta: '入门 · 收藏 328',
    },
  ],
  community: [
    {
      id: 'community-1',
      title: '用户动态：这手河牌跟注是不是太薄？',
      summary: '社区内容默认先审后发，通过后进入社区频道信息流。',
      typeLabel: '社区',
      meta: '待讨论 · 24 个点赞',
    },
    {
      id: 'community-2',
      title: '冷启动精选：一手 AQo 的三街决策',
      summary: '运营后台可发布冷启动内容，维持社区早期内容密度。',
      typeLabel: '运营精选',
      meta: '牌谱摘要 · 9 条评论',
    },
  ],
  video: [
    {
      id: 'video-1',
      title: '中长视频：SB vs BB 单挑底池实战讲解',
      summary: '支持播放进度、收藏、点赞、评论和弱网重试。',
      typeLabel: '视频',
      meta: '38:12 · 继续观看 12:08',
    },
    {
      id: 'video-2',
      title: '如何识别河牌过度诈唬线',
      summary: '用 5 个真实牌例理解下注尺度与范围极化。',
      typeLabel: '视频课',
      meta: '24:40 · 2.1k 播放',
    },
  ],
  live: [
    {
      id: 'live-1',
      title: '今晚 21:00 牌谱复盘直播',
      summary: '首版直播频道展示预告、直播中状态和回放入口。',
      typeLabel: '直播预告',
      meta: '21:00 开始 · 可预约',
    },
    {
      id: 'live-2',
      title: '上周 MTT 决赛桌复盘回放',
      summary: '直播回放作为内容消费入口，实时推流与聊天室留到二期。',
      typeLabel: '回放',
      meta: '72:05 · 已更新',
    },
  ],
};

const tools = [
  {
    title: '胜率计算器',
    summary: '输入手牌、公共牌和玩家人数，计算胜率、平局率和败率。',
  },
  {
    title: 'AI 实战复盘',
    summary: '粘贴文本牌谱，生成局面摘要、行动线分析、关键错误和改进建议。',
  },
  {
    title: '复盘历史',
    summary: '查看已保存的 AI 复盘记录，后续可关联课程和训练计划。',
  },
];

const courses = [
  {
    title: '现金桌基础系统课',
    summary: '18 节课 · 支持试看 · 单课购买',
  },
  {
    title: '翻后决策进阶课',
    summary: '24 节课 · 章节学习进度 · 退款后自动撤权',
  },
  {
    title: 'MTT 中后期短码策略',
    summary: '12 节课 · 直播回放补充 · 作业复盘',
  },
];

export default function App() {
  const [activeRootTab, setActiveRootTab] = useState<RootTabKey>('home');
  const [activeChannel, setActiveChannel] =
    useState<HomeChannelKey>('recommend');

  const activeRootLabel = useMemo(
    () => rootTabs.find((tab) => tab.key === activeRootTab)?.label ?? '首页',
    [activeRootTab],
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.shell}>
        <View style={styles.header}>
          <Text style={styles.kicker}>Poker Study</Text>
          <Text style={styles.title}>{activeRootLabel}</Text>
        </View>

        <View style={styles.content}>{renderActiveTab()}</View>

        <View style={styles.bottomTabs}>
          {rootTabs.map((tab) => {
            const isActive = activeRootTab === tab.key;

            return (
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ selected: isActive }}
                key={tab.key}
                onPress={() => setActiveRootTab(tab.key)}
                style={[styles.bottomTab, isActive && styles.bottomTabActive]}
              >
                <Text
                  style={[
                    styles.bottomTabText,
                    isActive && styles.bottomTabTextActive,
                  ]}
                >
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );

  function renderActiveTab() {
    if (activeRootTab === 'home') {
      return (
        <View style={styles.flex}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.channelTabs}
            contentContainerStyle={styles.channelTabsContent}
          >
            {homeChannels.map((channel) => {
              const isActive = activeChannel === channel.key;

              return (
                <Pressable
                  accessibilityRole="button"
                  accessibilityState={{ selected: isActive }}
                  key={channel.key}
                  onPress={() => setActiveChannel(channel.key)}
                  style={[
                    styles.channelTab,
                    isActive && styles.channelTabActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.channelTabText,
                      isActive && styles.channelTabTextActive,
                    ]}
                  >
                    {channel.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          >
            {channelCards[activeChannel].map((card) => (
              <ContentCardItem key={card.id} card={card} />
            ))}
          </ScrollView>
        </View>
      );
    }

    if (activeRootTab === 'tools') {
      return (
        <ScrollView contentContainerStyle={styles.listContent}>
          <SectionIntro
            title="训练工具"
            summary="先落地胜率计算器、文本牌谱 AI 复盘和复盘历史，后续扩展手牌范围训练。"
          />
          {tools.map((tool) => (
            <SimpleCard key={tool.title} title={tool.title} summary={tool.summary} />
          ))}
        </ScrollView>
      );
    }

    if (activeRootTab === 'courses') {
      return (
        <ScrollView contentContainerStyle={styles.listContent}>
          <SectionIntro
            title="单课购买"
            summary="课程支持试看、章节目录、平台内购、权益校验和学习进度。"
          />
          {courses.map((course) => (
            <SimpleCard
              key={course.title}
              title={course.title}
              summary={course.summary}
            />
          ))}
        </ScrollView>
      );
    }

    return (
      <ScrollView contentContainerStyle={styles.listContent}>
        <View style={styles.profilePanel}>
          <View style={styles.avatar} />
          <View style={styles.profileText}>
            <Text style={styles.profileName}>未登录用户</Text>
            <Text style={styles.profileSummary}>
              登录后查看关注、粉丝、收藏、已购课程、学习记录和复盘历史。
            </Text>
          </View>
        </View>
        <SimpleCard title="用户主页" summary="头像、昵称、简介、动态和关注关系。" />
        <SimpleCard title="我的收藏" summary="文章、视频、课程、直播回放统一收藏入口。" />
        <SimpleCard title="设置与反馈" summary="账号设置、举报反馈、注销和合规说明。" />
      </ScrollView>
    );
  }
}

function ContentCardItem({ card }: { card: ContentCard }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.typeBadge}>{card.typeLabel}</Text>
        <Text style={styles.meta}>{card.meta}</Text>
      </View>
      <Text style={styles.cardTitle}>{card.title}</Text>
      <Text style={styles.cardSummary}>{card.summary}</Text>
      <View style={styles.cardActions}>
        <Text style={styles.actionText}>点赞</Text>
        <Text style={styles.actionText}>收藏</Text>
        <Text style={styles.actionText}>评论</Text>
        <Text style={styles.actionText}>举报</Text>
      </View>
    </View>
  );
}

function SectionIntro({ title, summary }: { title: string; summary: string }) {
  return (
    <View style={styles.sectionIntro}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.sectionSummary}>{summary}</Text>
    </View>
  );
}

function SimpleCard({ title, summary }: { title: string; summary: string }) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardSummary}>{summary}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F4F2EE',
  },
  shell: {
    flex: 1,
    backgroundColor: '#F4F2EE',
  },
  flex: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
  },
  kicker: {
    color: '#2D6A4F',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  title: {
    color: '#161A1D',
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 0,
  },
  content: {
    flex: 1,
  },
  channelTabs: {
    maxHeight: 52,
  },
  channelTabsContent: {
    paddingHorizontal: 16,
    paddingBottom: 10,
    gap: 8,
  },
  channelTab: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#DDD7CC',
    borderRadius: 8,
    borderWidth: 1,
    height: 40,
    justifyContent: 'center',
    minWidth: 64,
    paddingHorizontal: 14,
  },
  channelTabActive: {
    backgroundColor: '#2D6A4F',
    borderColor: '#2D6A4F',
  },
  channelTabText: {
    color: '#5D625F',
    fontSize: 14,
    fontWeight: '700',
  },
  channelTabTextActive: {
    color: '#FFFFFF',
  },
  listContent: {
    gap: 12,
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2DDD3',
    borderRadius: 8,
    borderWidth: 1,
    padding: 16,
  },
  cardHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  typeBadge: {
    backgroundColor: '#E7F1EC',
    borderRadius: 6,
    color: '#245A43',
    fontSize: 12,
    fontWeight: '800',
    overflow: 'hidden',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  meta: {
    color: '#767B78',
    flexShrink: 1,
    fontSize: 12,
    marginLeft: 12,
    textAlign: 'right',
  },
  cardTitle: {
    color: '#171B1E',
    fontSize: 18,
    fontWeight: '800',
    lineHeight: 24,
    marginBottom: 8,
  },
  cardSummary: {
    color: '#565C58',
    fontSize: 14,
    lineHeight: 21,
  },
  cardActions: {
    borderColor: '#ECE7DD',
    borderTopWidth: 1,
    flexDirection: 'row',
    gap: 18,
    marginTop: 14,
    paddingTop: 12,
  },
  actionText: {
    color: '#2D6A4F',
    fontSize: 13,
    fontWeight: '700',
  },
  sectionIntro: {
    backgroundColor: '#123C35',
    borderRadius: 8,
    padding: 18,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 8,
  },
  sectionSummary: {
    color: '#DCE8E2',
    fontSize: 14,
    lineHeight: 21,
  },
  profilePanel: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#E2DDD3',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    padding: 16,
  },
  avatar: {
    backgroundColor: '#2D6A4F',
    borderRadius: 28,
    height: 56,
    marginRight: 14,
    width: 56,
  },
  profileText: {
    flex: 1,
  },
  profileName: {
    color: '#171B1E',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 6,
  },
  profileSummary: {
    color: '#565C58',
    fontSize: 13,
    lineHeight: 19,
  },
  bottomTabs: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2DDD3',
    borderTopWidth: 1,
    flexDirection: 'row',
    paddingBottom: 10,
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  bottomTab: {
    alignItems: 'center',
    borderRadius: 8,
    flex: 1,
    height: 42,
    justifyContent: 'center',
  },
  bottomTabActive: {
    backgroundColor: '#E7F1EC',
  },
  bottomTabText: {
    color: '#606663',
    fontSize: 14,
    fontWeight: '700',
  },
  bottomTabTextActive: {
    color: '#245A43',
  },
});
