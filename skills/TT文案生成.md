---
name: "a1-art-tiktok-ad-copy"
description: "Generates localized TikTok ad copy for Couplelens. Invoke when user provides country, language, and video type for five trendy ad lines."
---

# Couplelens TikTok 广告语生成

## 使用场景

当用户需要为 Couplelens 的 TikTok 广告投放生成短广告语时使用本 Skill。用户通常会提供：

- 国家或地区
- 输出语言
- 视频类型或素材类型
- 单个需求、一个地区多个视频类型、多个地区多个视频类型，或一个视频类型多个地区

本 Skill 的目标是在执行前先收集该地区近 3 个月 TikTok 热门话题、热门标签、流行表达、文化热点和网络梗，再为每个需求输出 5 条地道、潮流、适合投放的广告语。

## Couplelens 产品语境

Couplelens 是 AI 图像与视频生成平台，广告语应围绕“上传一张图或输入一句话即可生成创意图片/视频”的低门槛体验展开。可使用的产品卖点包括：

- AI 人像写真、氛围感写真
- 动漫头像、3D 卡通形象、吉卜力风格插画
- Action Figure 玩偶风
- 情侣合照、朋友合照、宠物创意照
- 视频换脸、图生视频、图片动起来
- 表情包、艺术字、社交头像和分享型内容
- 海量模板、滤镜、创意玩法、快速生成

不要夸大为官方没有明确承诺的功能，例如“永久免费”“100% 无版权风险”“必火”“官方 TikTok 合作”等。

## TikTok 广告语境

生成文案时应适配 TikTok 投放常见场景：

- 应用安装广告：突出“现在试试”“上传照片即可生成”“几秒做出新头像/视频”等低摩擦行动。
- 应用再营销广告：唤醒已安装或已体验用户，突出新模板、新玩法、节日/热点灵感。
- Spark Ads：语气更像创作者口播或用户推荐，避免过度硬广。
- 非 Spark 信息流广告：开头要有强 hook，适合短视频前 1 秒抓注意力。
- Smart+ 或自动化素材组合：广告语之间必须差异明显，便于系统测试不同切入点。
- AI 混剪/模板广告：适合突出“趋势模板”“跟拍感”“本地热梗”“一键变身”。

## 执行前调研

每次生成前必须先做该地区近 3 个月的 TikTok 趋势调研。优先使用可用的联网检索工具，并尽量选择官方或较权威来源。

调研目标：

- 该国家或地区近 90 天 TikTok 热门话题
- 热门标签和关键词
- 热门音乐、影视、体育、节日、名人、校园、职场、恋爱、宠物、游戏、美妆、二次元等文化热点
- 当地年轻用户常用口语、缩写、梗、反讽表达和行动号召
- 与用户指定视频类型相关的细分热词

推荐检索方向：

- `TikTok Creative Center trends [country] last 90 days`
- `TikTok trending hashtags [country] [month year]`
- `[country] TikTok trends [video type]`
- `[language] Gen Z slang TikTok [country]`
- `[country] viral meme TikTok [last 90 days]`

如果能访问 TikTok Creative Center 或其他趋势数据库，优先使用近 90 天筛选；如果无法直接访问，使用多源网页搜索交叉验证。不要编造趋势数据。若趋势信号不足，应优先使用该地区稳定的文化表达和 Couplelens 产品卖点，并在内部降低梗浓度。

## 输入解析规则

识别用户输入中的三个核心字段：

- `country_or_region`：国家或地区，例如美国、日本、巴西、印尼、德国。
- `language`：广告语输出语言，例如英语、日语、葡萄牙语、印尼语、德语。
- `video_type`：视频种类或素材类型，例如动漫头像、AI 写真、Action Figure、情侣合照、宠物变身、图生视频、视频换脸。

支持以下组合：

- 一个地区 + 一个语言 + 一个视频类型
- 一个地区 + 一个语言 + 多个视频类型
- 多个地区 + 对应语言 + 一个视频类型
- 多个地区 + 多个语言 + 多个视频类型
- 多个地区与多个视频类型成对匹配
- 用户用表格、逗号、顿号、换行、自然语言描述的批量需求

如果用户没有明确说明匹配关系：

- 当地区数量和视频类型数量相同，默认按顺序一一匹配。
- 当只有一个地区和多个视频类型，默认该地区分别匹配所有视频类型。
- 当多个地区和一个视频类型，默认每个地区都匹配该视频类型。
- 当多个地区和多个视频类型数量不同，默认做笛卡尔积组合，除非用户语义明显表示一一匹配。

缺少国家/地区、语言或视频类型时，先向用户提出最少必要澄清，不要直接生成。

## 广告语生成规则

每个需求必须输出 5 条广告语，并遵守：

- 每条广告语不超过 100 个字符。
- 五条之间不能重复，不能只是换词复写。
- 不使用文前序号、项目符号、破折号或 emoji。
- 每条广告语单独一行。
- 文案必须使用用户指定语言。
- 语言要符合当地 TikTok 用户表达，不要机器翻译腔。
- 可以自然融入当地近 3 个月热门话题、热梗、节日或流行表达，但不要强塞。
- 不要使用低俗、歧视、政治煽动、医疗/金融承诺、侵犯肖像权或误导性声明。
- 不要生成贬低用户外貌、种族、性别、年龄、宗教、国籍或身体特征的文案。
- 不要承诺“ guaranteed viral / 一定爆火 / 变成明星本人”等不可验证结果。
- 避免过长解释，用户只要广告语时只输出广告语。

广告语建议结构：

- 热点 hook + Couplelens 能力 + 轻 CTA
- 本地梗/口语 + 视频类型结果 + 轻 CTA
- 痛点反转 + 一张照片/一句提示词 + 生成结果
- 创作者口吻 + 分享场景 + 模板玩法
- 趋势挑战感 + 快速变身 + App 行动

## 批量输出格式

单个需求：

直接输出 5 行广告语，不加标题、不加解释。

批量需求：

每个需求块先输出一行纯文本标题，格式为：

`国家/地区｜语言｜视频类型`

标题下方输出 5 行广告语。不同需求块之间空一行。广告语行本身不得带序号、项目符号或 emoji。

如果用户明确要求“只要广告语，不要标题”，则每个需求块之间只用空行分隔，但必须保持每块 5 行。

## 质量检查

输出前逐条检查：

- 是否正好每个需求 5 条
- 是否每条小于等于 100 个字符
- 是否没有序号、项目符号、emoji
- 是否没有重复表达
- 是否使用了指定语言
- 是否匹配指定国家/地区文化
- 是否与指定视频类型直接相关
- 是否适合 TikTok 广告投放
- 是否没有不实承诺或敏感违规内容

如果有任一项不满足，先修改再输出。

## 示例

用户输入：

`美国，英语，Action Figure 视频`

输出：

Turn your selfie into the action figure version everyone wishes they had
Your camera roll called. It wants a main-character upgrade
Make a collectible-style you before the trend moves on
One photo, one AI figure, zero boring profile pics
This is your sign to turn today’s selfie into shelf-worthy art

用户输入：

`日本日语：动漫头像、情侣合照；巴西葡语：宠物变身`

输出：

日本｜日语｜动漫头像
その自撮り、次の推しビジュに変えてみない？
盛れるだけじゃない、Couplelensでアニメ主人公感まで作れる
一枚の写真で、SNSアイコンを一気に今っぽく
いつもの顔写真を、タイムラインで止まるアニメ顔へ
今日の気分に合わせて、AIで新しい自分を着替えよう

日本｜日语｜情侣合照
二人の写真を、保存したくなる物語みたいに
普通のツーショットを、Couplelensで映画のワンシーンへ
記念日じゃなくても、今日はちょっと特別な一枚に
その写真、もっと甘くて今っぽいカップル感にしよう
一枚アップするだけで、二人の雰囲気がちゃんと映える

巴西｜葡语｜宠物变身
Transforme seu pet no personagem que a sua For You merecia ver
Uma foto do pet, um visual novo e muita vontade de compartilhar
Seu bichinho já é famoso em casa. Falta só o look de trend
De fofinho a protagonista do feed em poucos cliques
Use Couplelens e dê ao seu pet uma versão impossível de ignorar
