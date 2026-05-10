# 德州扑克内容消费 App MVP 数据库设计

## 1. 通用字段

核心业务表默认包含：

| 字段 | 类型 | 必填 | 说明 |
|---|---|---:|---|
| id | uuid | 是 | 主键 |
| created_at | timestamptz | 是 | 创建时间 |
| updated_at | timestamptz | 是 | 更新时间 |
| created_by | uuid | 否 | 创建人 |
| updated_by | uuid | 否 | 更新人 |
| status | varchar | 是 | 状态 |
| remark | text | 否 | 备注 |

## 2. 用户与关系

### 2.1 users

| 字段 | 类型 | 必填 | 说明 |
|---|---|---:|---|
| email | varchar | 否 | 邮箱 |
| phone | varchar | 否 | 手机号 |
| password_hash | varchar | 否 | 密码哈希 |
| status | varchar | 是 | active、restricted、banned、deleted |

索引：

- `unique(email)`
- `unique(phone)`
- `idx_users_status`

### 2.2 user_profiles

| 字段 | 类型 | 必填 | 说明 |
|---|---|---:|---|
| user_id | uuid | 是 | 用户 ID |
| nickname | varchar | 是 | 昵称 |
| avatar_url | text | 否 | 头像 |
| bio | varchar | 否 | 简介 |

索引：

- `unique(user_id)`

### 2.3 follows

| 字段 | 类型 | 必填 | 说明 |
|---|---|---:|---|
| follower_id | uuid | 是 | 关注者 |
| following_id | uuid | 是 | 被关注者 |
| status | varchar | 是 | active、cancelled |

索引：

- `unique(follower_id, following_id)`
- `idx_follows_following_id`

## 3. 内容

### 3.1 articles

| 字段 | 类型 | 必填 | 说明 |
|---|---|---:|---|
| title | varchar | 是 | 标题 |
| summary | text | 否 | 摘要 |
| cover_url | text | 否 | 封面 |
| body | text | 是 | 正文 |
| category_id | uuid | 否 | 分类 |
| tags | jsonb | 否 | 标签 |
| author_id | uuid | 否 | 作者 |
| recommendation_weight | int | 是 | 推荐权重 |
| published_at | timestamptz | 否 | 发布时间 |

索引：

- `idx_articles_status_published_at`
- `idx_articles_category_id`

### 3.2 videos

| 字段 | 类型 | 必填 | 说明 |
|---|---|---:|---|
| title | varchar | 是 | 标题 |
| summary | text | 否 | 摘要 |
| cover_url | text | 是 | 封面 |
| video_url | text | 是 | 视频地址 |
| duration_seconds | int | 否 | 时长 |
| category_id | uuid | 否 | 分类 |
| author_id | uuid | 否 | 作者 |
| recommendation_weight | int | 是 | 推荐权重 |
| published_at | timestamptz | 否 | 发布时间 |

索引：

- `idx_videos_status_published_at`
- `idx_videos_category_id`

### 3.3 live_events

| 字段 | 类型 | 必填 | 说明 |
|---|---|---:|---|
| title | varchar | 是 | 标题 |
| summary | text | 否 | 摘要 |
| cover_url | text | 否 | 封面 |
| live_status | varchar | 是 | scheduled、live、ended、replay |
| scheduled_at | timestamptz | 否 | 预计开播时间 |
| replay_url | text | 否 | 回放地址 |
| author_id | uuid | 否 | 主播/讲师 |

索引：

- `idx_live_events_live_status`
- `idx_live_events_scheduled_at`

## 4. 社区与互动

### 4.1 community_posts

| 字段 | 类型 | 必填 | 说明 |
|---|---|---:|---|
| user_id | uuid | 是 | 发布用户 |
| text | text | 否 | 文本内容 |
| image_urls | jsonb | 否 | 图片数组 |
| hand_history_summary | text | 否 | 牌谱摘要 |
| review_reason | text | 否 | 审核原因 |
| published_at | timestamptz | 否 | 发布时间 |

索引：

- `idx_community_posts_user_id`
- `idx_community_posts_status_published_at`

### 4.2 comments

| 字段 | 类型 | 必填 | 说明 |
|---|---|---:|---|
| target_type | varchar | 是 | article、video、post、live、course |
| target_id | uuid | 是 | 目标 ID |
| user_id | uuid | 是 | 评论用户 |
| content | text | 是 | 评论内容 |
| review_reason | text | 否 | 审核原因 |

索引：

- `idx_comments_target`
- `idx_comments_user_id`
- `idx_comments_status`

### 4.3 reactions

| 字段 | 类型 | 必填 | 说明 |
|---|---|---:|---|
| target_type | varchar | 是 | 内容类型 |
| target_id | uuid | 是 | 内容 ID |
| user_id | uuid | 是 | 用户 ID |
| reaction_type | varchar | 是 | like |

索引：

- `unique(target_type, target_id, user_id, reaction_type)`

### 4.4 favorites

| 字段 | 类型 | 必填 | 说明 |
|---|---|---:|---|
| target_type | varchar | 是 | 内容类型 |
| target_id | uuid | 是 | 内容 ID |
| user_id | uuid | 是 | 用户 ID |

索引：

- `unique(target_type, target_id, user_id)`

## 5. 课程与支付

### 5.1 courses

| 字段 | 类型 | 必填 | 说明 |
|---|---|---:|---|
| title | varchar | 是 | 课程标题 |
| summary | text | 否 | 摘要 |
| cover_url | text | 是 | 封面 |
| instructor_id | uuid | 否 | 讲师 |
| price_amount | int | 是 | 价格，最小货币单位 |
| currency | varchar | 是 | 币种 |
| product_id_ios | varchar | 否 | Apple IAP 商品 ID |
| product_id_android | varchar | 否 | Google Play 商品 ID |

索引：

- `idx_courses_status`

### 5.2 course_chapters

| 字段 | 类型 | 必填 | 说明 |
|---|---|---:|---|
| course_id | uuid | 是 | 课程 ID |
| title | varchar | 是 | 章节标题 |
| video_url | text | 否 | 视频地址 |
| duration_seconds | int | 否 | 时长 |
| sort_order | int | 是 | 排序 |
| is_trial | boolean | 是 | 是否试看 |

索引：

- `idx_course_chapters_course_id_sort_order`

### 5.3 orders

| 字段 | 类型 | 必填 | 说明 |
|---|---|---:|---|
| request_id | varchar | 是 | 请求 ID |
| trace_id | varchar | 否 | 链路 ID |
| order_no | varchar | 是 | 订单号 |
| user_id | uuid | 是 | 用户 ID |
| course_id | uuid | 是 | 课程 ID |
| amount | int | 是 | 金额 |
| currency | varchar | 是 | 币种 |
| platform | varchar | 是 | ios、android |
| transaction_id | varchar | 否 | 平台交易 ID |
| idempotency_key | varchar | 是 | 幂等键 |

索引：

- `unique(order_no)`
- `unique(platform, transaction_id)`
- `unique(idempotency_key)`
- `idx_orders_user_id`

### 5.4 course_entitlements

| 字段 | 类型 | 必填 | 说明 |
|---|---|---:|---|
| user_id | uuid | 是 | 用户 ID |
| course_id | uuid | 是 | 课程 ID |
| order_id | uuid | 是 | 订单 ID |
| granted_at | timestamptz | 是 | 发放时间 |
| revoked_at | timestamptz | 否 | 撤权时间 |

索引：

- `unique(user_id, course_id)`

### 5.5 learning_progress

| 字段 | 类型 | 必填 | 说明 |
|---|---|---:|---|
| user_id | uuid | 是 | 用户 ID |
| course_id | uuid | 是 | 课程 ID |
| chapter_id | uuid | 是 | 章节 ID |
| progress_seconds | int | 是 | 观看进度 |
| completed_at | timestamptz | 否 | 完成时间 |

索引：

- `unique(user_id, chapter_id)`

## 6. 工具

### 6.1 equity_calculations

| 字段 | 类型 | 必填 | 说明 |
|---|---|---:|---|
| user_id | uuid | 是 | 用户 ID |
| hero_cards | jsonb | 是 | 手牌 |
| board_cards | jsonb | 否 | 公共牌 |
| players_count | int | 是 | 玩家数 |
| result | jsonb | 是 | 计算结果 |

索引：

- `idx_equity_calculations_user_id_created_at`

### 6.2 ai_review_records

| 字段 | 类型 | 必填 | 说明 |
|---|---|---:|---|
| user_id | uuid | 是 | 用户 ID |
| hand_history_text | text | 是 | 原始牌谱文本 |
| parsed_payload | jsonb | 否 | 解析结果 |
| result | jsonb | 否 | AI 分析结果 |
| error_message | text | 否 | 失败原因 |

索引：

- `idx_ai_review_records_user_id_created_at`
- `idx_ai_review_records_status`

## 7. 审核与审计

### 7.1 moderation_tasks

| 字段 | 类型 | 必填 | 说明 |
|---|---|---:|---|
| target_type | varchar | 是 | 审核对象类型 |
| target_id | uuid | 是 | 审核对象 ID |
| submitter_id | uuid | 否 | 提交人 |
| reviewer_id | uuid | 否 | 审核人 |
| decision | varchar | 否 | approved、rejected |
| reason | text | 否 | 审核原因 |
| reviewed_at | timestamptz | 否 | 审核时间 |

索引：

- `idx_moderation_tasks_status`
- `idx_moderation_tasks_target`

### 7.2 reports

| 字段 | 类型 | 必填 | 说明 |
|---|---|---:|---|
| reporter_id | uuid | 是 | 举报人 |
| target_type | varchar | 是 | 举报对象类型 |
| target_id | uuid | 是 | 举报对象 ID |
| reason | text | 是 | 举报原因 |
| handled_by | uuid | 否 | 处理人 |
| handled_at | timestamptz | 否 | 处理时间 |

索引：

- `idx_reports_status`
- `idx_reports_target`

### 7.3 audit_logs

| 字段 | 类型 | 必填 | 说明 |
|---|---|---:|---|
| operator_id | uuid | 是 | 操作人 |
| operation | varchar | 是 | 操作 |
| target_type | varchar | 是 | 目标类型 |
| target_id | uuid | 是 | 目标 ID |
| before_value | jsonb | 否 | 变更前 |
| after_value | jsonb | 否 | 变更后 |
| ip_address | varchar | 否 | IP |
| user_agent | text | 否 | UA |

索引：

- `idx_audit_logs_operator_id`
- `idx_audit_logs_target`
- `idx_audit_logs_created_at`
