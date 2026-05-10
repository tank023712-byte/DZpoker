# 德州扑克内容消费 App MVP API 文档

## 1. 通用约定

统一响应结构：

```json
{
  "code": 0,
  "message": "success",
  "data": {},
  "request_id": "string"
}
```

分页参数：

| 参数 | 类型 | 说明 |
|---|---|---|
| page | number | 页码，从 1 开始 |
| page_size | number | 每页数量 |
| cursor | string | 游标分页时使用 |

通用错误码：

| code | 说明 |
|---:|---|
| 0 | 成功 |
| 40001 | 参数错误 |
| 40100 | 未登录 |
| 40300 | 无权限 |
| 40400 | 资源不存在 |
| 40900 | 状态冲突 |
| 42900 | 请求过于频繁 |
| 50000 | 系统错误 |

## 2. 用户接口

### 2.1 注册/登录

- 方法：`POST`
- 路径：`/api/v1/auth/login`
- 参数：`account`、`login_type`、`code` 或 `password`
- 权限：游客
- 幂等：否

### 2.2 获取当前用户

- 方法：`GET`
- 路径：`/api/v1/users/me`
- 权限：登录用户

### 2.3 更新资料

- 方法：`PATCH`
- 路径：`/api/v1/users/me/profile`
- 参数：`avatar_url`、`nickname`、`bio`
- 权限：登录用户
- 日志：记录资料修改

### 2.4 关注/取关

- 方法：`POST` / `DELETE`
- 路径：`/api/v1/users/{user_id}/follow`
- 权限：登录用户
- 幂等：同一用户重复关注或取关返回当前状态

## 3. 首页聚合接口

### 3.1 获取首页频道流

- 方法：`GET`
- 路径：`/api/v1/feed`
- 参数：`channel`、`page_size`、`cursor`
- `channel` 可选：`following`、`recommend`、`knowledge`、`community`、`video`、`live`
- 权限：游客可访问公开内容；关注频道登录后返回关注内容
- 响应字段：`items`、`next_cursor`

内容卡片统一字段：

| 字段 | 说明 |
|---|---|
| id | 内容 ID |
| type | article、video、post、course、live |
| title | 标题 |
| summary | 摘要 |
| cover_url | 封面 |
| author | 作者信息 |
| status | 展示状态 |
| metrics | 点赞、评论、收藏、浏览/播放 |
| published_at | 发布时间 |

## 4. 内容接口

### 4.1 文章详情

- 方法：`GET`
- 路径：`/api/v1/articles/{article_id}`
- 权限：游客可访问已发布内容

### 4.2 视频详情

- 方法：`GET`
- 路径：`/api/v1/videos/{video_id}`
- 权限：游客可访问已发布内容

### 4.3 直播详情

- 方法：`GET`
- 路径：`/api/v1/lives/{live_id}`
- 权限：游客可访问已发布内容

### 4.4 点赞/收藏/举报

- 方法：`POST` / `DELETE`
- 路径：`/api/v1/content/{content_type}/{content_id}/like`
- 路径：`/api/v1/content/{content_type}/{content_id}/favorite`
- 路径：`POST /api/v1/content/{content_type}/{content_id}/report`
- 权限：登录用户
- 幂等：点赞和收藏重复提交返回当前状态

## 5. 社区接口

### 5.1 发布动态

- 方法：`POST`
- 路径：`/api/v1/community/posts`
- 参数：`text`、`image_urls`、`hand_history_summary`
- 权限：登录用户
- 规则：默认进入 `pending_review`
- 日志：记录发布来源和审核状态

### 5.2 动态详情

- 方法：`GET`
- 路径：`/api/v1/community/posts/{post_id}`
- 权限：已发布内容公开可见；待审核内容仅作者和后台可见

### 5.3 评论

- 方法：`POST`
- 路径：`/api/v1/comments`
- 参数：`target_type`、`target_id`、`content`
- 权限：登录用户
- 规则：默认进入 `pending_review`

## 6. 工具接口

### 6.1 胜率计算

- 方法：`POST`
- 路径：`/api/v1/tools/equity/calculate`
- 参数：`hero_cards`、`board_cards`、`players_count`
- 权限：登录用户
- 响应字段：`win_rate`、`tie_rate`、`lose_rate`

### 6.2 创建 AI 复盘

- 方法：`POST`
- 路径：`/api/v1/tools/ai-reviews`
- 参数：`hand_history_text`
- 权限：登录用户
- 响应字段：`review_id`、`status`、`summary`、`action_analysis`、`mistakes`、`suggestions`
- 失败处理：解析失败返回 40001；AI 超时返回可重试状态

### 6.3 复盘历史

- 方法：`GET`
- 路径：`/api/v1/tools/ai-reviews`
- 权限：登录用户
- 分页：支持 cursor

## 7. 课程接口

### 7.1 课程列表

- 方法：`GET`
- 路径：`/api/v1/courses`
- 参数：`category`、`page_size`、`cursor`
- 权限：游客

### 7.2 课程详情

- 方法：`GET`
- 路径：`/api/v1/courses/{course_id}`
- 权限：游客
- 响应字段：课程信息、章节列表、试看状态、购买状态

### 7.3 校验课程权益

- 方法：`GET`
- 路径：`/api/v1/courses/{course_id}/entitlement`
- 权限：登录用户

### 7.4 提交支付凭证

- 方法：`POST`
- 路径：`/api/v1/orders/verify-receipt`
- 参数：`platform`、`course_id`、`product_id`、`receipt`
- 权限：登录用户
- 幂等：按 `platform + transaction_id` 去重
- 日志：记录校验结果、订单状态和权益状态

## 8. 后台接口

后台接口统一前缀：`/api/admin/v1`

| 接口 | 方法 | 路径 | 权限 |
|---|---|---|---|
| 内容 CRUD | GET/POST/PATCH | `/contents` | 运营/管理员 |
| 课程 CRUD | GET/POST/PATCH | `/courses` | 运营/管理员 |
| 直播管理 | GET/POST/PATCH | `/lives` | 运营/管理员 |
| 审核队列 | GET/PATCH | `/moderation/tasks` | 审核运营/管理员 |
| 用户管理 | GET/PATCH | `/users` | 管理员 |
| 订单查询 | GET | `/orders` | 运营/管理员 |
| 操作日志 | GET | `/audit-logs` | 管理员 |

后台写接口必须记录 `operator_id`、`operation`、`target_type`、`target_id`、`before_value`、`after_value`、`created_at`。
