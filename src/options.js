const fields = {
  apiMode: document.getElementById("apiMode"),
  apiKey: document.getElementById("apiKey"),
  model: document.getElementById("model"),
  modelPreset: document.getElementById("modelPreset"),
  modelOptions: document.getElementById("modelOptions"),
  useJsonResponseFormat: document.getElementById("useJsonResponseFormat"),
  baseUrl: document.getElementById("baseUrl"),
  endpointPath: document.getElementById("endpointPath"),
  extraHeadersJson: document.getElementById("extraHeadersJson"),
  customUrl: document.getElementById("customUrl"),
  customMethod: document.getElementById("customMethod"),
  customHeadersJson: document.getElementById("customHeadersJson"),
  customBodyTemplate: document.getElementById("customBodyTemplate"),
  customResponsePath: document.getElementById("customResponsePath"),
  profileMarkdown: document.getElementById("profileMarkdown"),
  profileSectionEditor: document.getElementById("profileSectionEditor"),
  profileNav: document.getElementById("profileNav"),
  profileTips: document.getElementById("profileTips"),
  profileEditor: document.getElementById("profileEditor"),
  profileFileInput: document.getElementById("profileFileInput"),
  apiFeedback: document.getElementById("apiFeedback"),
  apiPreviewBox: document.getElementById("apiPreviewBox"),
  apiPreview: document.getElementById("apiPreview"),
  status: document.getElementById("status")
};

const BASIC_FIELDS = [
  { key: "name", label: "姓名", type: "text", required: true, placeholder: "例如 李明（示例）" },
  { key: "gender", label: "性别", type: "select", options: ["", "男", "女"] },
  { key: "birthDate", label: "出生日期", type: "date" },
  { key: "ethnicity", label: "民族", type: "text", placeholder: "例如 汉族" },
  { key: "politicalStatus", label: "政治面貌", type: "text", placeholder: "例如 群众 / 团员 / 党员" },
  { key: "nativePlace", label: "籍贯", type: "text", placeholder: "例如 云岭省青山市（示例）" },
  { key: "hukou", label: "生源户口", type: "text", placeholder: "例如 江湾省宁远市（示例）" },
  { key: "currentAddress", label: "当前居住地", type: "text", span: 2, placeholder: "例如 星海市海棠区（示例）" },
  { key: "heightCm", label: "净身高(cm)", type: "text", placeholder: "例如 175" },
  { key: "weightKg", label: "体重(kg)", type: "text", placeholder: "例如 68" },
  { key: "email", label: "电子邮箱", type: "email", placeholder: "liming@example.com" },
  { key: "phone", label: "手机号码", type: "tel", placeholder: "11 位手机号" },
  { key: "emergencyContactName", label: "紧急联系人", type: "text", placeholder: "联系人姓名" },
  { key: "emergencyContactPhone", label: "紧急联系人电话", type: "tel", placeholder: "联系人手机号" },
  { key: "expectedAnnualSalaryWan", label: "期望年收入(万元)", type: "text", placeholder: "例如 25" }
];

const CUSTOM_FIELD_FIELDS = [
  { key: "label", label: "字段名", type: "text", required: true, placeholder: "例如 身份证号 / 微信号 / 证件有效期" },
  { key: "key", label: "内部标识（可选）", type: "text", placeholder: "例如 customId，可留空" },
  { key: "value", label: "字段值", type: "textarea", rows: 3, span: 2, placeholder: "填写要被表单使用的值" },
  { key: "note", label: "备注 / 别名（可选）", type: "text", span: 2, placeholder: "例如 有些网站叫证件号码" }
];

const CUSTOM_FIELD_SECTION_KEYS = ["basic"];

const EDUCATION_FIELDS = [
  { key: "type", label: "教育类型", type: "text", placeholder: "例如 全日制" },
  { key: "startDate", label: "开始时间", type: "month" },
  { key: "endDate", label: "结束时间", type: "month" },
  { key: "school", label: "毕业院校", type: "text", placeholder: "例如 星河大学（示例）" },
  { key: "major", label: "专业", type: "text", placeholder: "例如 计算机科学与技术" },
  { key: "gpaRank", label: "绩点排名", type: "text", placeholder: "例如 前 20%" },
  { key: "educationLevel", label: "学历", type: "text", placeholder: "例如 硕士研究生" },
  { key: "degree", label: "学位", type: "text", placeholder: "例如 硕士" },
  { key: "graduationStatus", label: "毕(结、肄)业", type: "select", options: ["", "在读", "毕业", "结业", "肄业"] },
  { key: "certificateNumber", label: "学历证书号", type: "text", placeholder: "没有可填 无" },
  { key: "isHighest", label: "最高学历", type: "select", options: ["", "是", "否"] },
  { key: "isTransferredUndergrad", label: "是否专升本", type: "select", options: ["", "是", "否"] },
  { key: "isOverseas", label: "是否海外学历", type: "select", options: ["", "是", "否"] }
];

const EXPERIENCE_FIELDS = [
  { key: "startDate", label: "开始时间", type: "month" },
  { key: "endDate", label: "结束时间", type: "month" },
  { key: "organization", label: "实习/实践单位", type: "text", placeholder: "例如 星桥科技有限公司（示例）" },
  { key: "role", label: "实习岗位", type: "text", placeholder: "例如 软件开发实习生" },
  { key: "supervisor", label: "证明人", type: "text", placeholder: "可留空" },
  { key: "supervisorPhone", label: "证明人联系方式", type: "tel", placeholder: "可留空" },
  { key: "description", label: "实践内容与收获", type: "textarea", rows: 5, span: 2, placeholder: "尽量写成有结果、有动作、有数据的描述" }
];

const CAMPUS_FIELDS = [
  { key: "startDate", label: "开始时间", type: "month" },
  { key: "endDate", label: "结束时间", type: "month" },
  { key: "organization", label: "组织名称", type: "text", placeholder: "例如 信息学院学生会（示例）" },
  { key: "role", label: "职务", type: "text", placeholder: "例如 活动负责人" },
  { key: "description", label: "工作职责或活动描述", type: "textarea", rows: 4, span: 2, placeholder: "可留空" }
];

const CERTIFICATE_FIELDS = [
  { key: "name", label: "证书名称", type: "text", placeholder: "例如 CET-6" },
  { key: "date", label: "取得时间", type: "month" },
  { key: "issuer", label: "颁发单位", type: "text", placeholder: "可留空" },
  { key: "level", label: "等级/分数", type: "text", placeholder: "例如 473" },
  { key: "number", label: "证书编号", type: "text", placeholder: "可留空" },
  { key: "note", label: "备注", type: "textarea", rows: 3, span: 2, placeholder: "可留空" }
];

const AWARD_FIELDS = [
  { key: "name", label: "奖惩名称", type: "text", placeholder: "例如 校级优秀学生奖学金" },
  { key: "date", label: "奖惩时间", type: "month" },
  { key: "organization", label: "奖惩单位", type: "text", placeholder: "例如 星河大学（示例）" },
  { key: "level", label: "奖惩层级", type: "text", placeholder: "例如 学院级 / 学校级" },
  { key: "cancelDate", label: "奖惩解除时间", type: "month" },
  { key: "reason", label: "奖惩原因", type: "textarea", rows: 3, span: 2, placeholder: "可留空" }
];

const FAMILY_MEMBER_FIELDS = [
  { key: "name", label: "姓名", type: "text", required: true, placeholder: "家属姓名" },
  { key: "birthDate", label: "出生日期", type: "date" },
  { key: "gender", label: "性别", type: "select", options: ["", "男", "女"] },
  { key: "politicalStatus", label: "政治面貌", type: "text", placeholder: "例如 群众" },
  { key: "educationLevel", label: "学历", type: "text", placeholder: "例如 大专 / 本科" },
  { key: "employer", label: "工作单位", type: "text", placeholder: "例如 蓝杉商贸有限公司（示例）" },
  { key: "title", label: "职务", type: "text", placeholder: "例如 运营主管" },
  { key: "phone", label: "联系电话", type: "tel", placeholder: "若没有请填 无" },
  { key: "note", label: "备注", type: "textarea", rows: 3, span: 2, placeholder: "可留空" }
];

const OTHER_FIELDS = [
  { key: "languageLevel", label: "外语水平", type: "text", placeholder: "例如 CET-6" },
  { key: "languageScore", label: "分数", type: "text", placeholder: "例如 473" },
  { key: "hobbyCategory", label: "特长爱好类别", type: "text", placeholder: "例如 体育类" },
  { key: "hobbyDetail", label: "特长爱好具体内容", type: "text", placeholder: "例如 羽毛球" },
  { key: "selfEvaluation", label: "自我评价", type: "textarea", rows: 6, span: 2, placeholder: "写成几条短句最实用" },
  { key: "source", label: "招聘信息来源", type: "text", placeholder: "例如 微信公众号" },
  { key: "hasDriverLicense", label: "是否获得机动车驾驶证", type: "select", options: ["", "是", "否"] },
  { key: "acceptsTransfer", label: "是否接受调剂", type: "select", options: ["", "是", "否"] }
];

const DECLARATION_FIELDS = [
  { key: "relativesInCompany", label: "是否存在亲属在应聘单位工作", type: "select", options: ["否", "是"] },
  { key: "majorDisease", label: "是否患有影响工作的疾病", type: "select", options: ["否", "是"] },
  { key: "outsideEmploymentOrEquity", label: "是否在第三方企业任职或持股", type: "select", options: ["否", "是"] },
  { key: "badRecord", label: "是否存在不良行为记录", type: "select", options: ["否", "是"] },
  { key: "overseasResidency", label: "是否享有境外长期或永久居留权", type: "select", options: ["否", "是"] }
];

const RESUME_SECTION_GUIDE = [
  {
    key: "basic",
    title: "基本信息",
    aliases: ["个人信息", "联系方式"],
    placeholder: "- 姓名：李明\n- 性别：男\n- 出生日期：2001-02-20\n- 手机号码：13900000000\n- 电子邮箱：liming@example.com\n- 证件类型：身份证\n- 证件号码：110101200102201238",
    tips: ["姓名、电话、邮箱、证件号建议放在这里。", "同一个值可以写多个常见字段名，例如“电话”和“手机号码”，方便不同网站匹配。"]
  },
  {
    key: "intention",
    title: "求职意向",
    aliases: ["求职意向 添加"],
    placeholder: "- 意向岗位：金融科技岗\n- 预计入职时间：2027-07\n- 期望工作城市：深圳\n- 期望薪资：面议\n- 是否接受调剂：是",
    tips: ["岗位、城市、薪资、到岗时间和调剂意愿都放这里。", "如果不同公司岗位叫法不同，可以追加“目标岗位”“应聘岗位”等别名。"]
  },
  {
    key: "education",
    title: "教育经历",
    aliases: ["教育背景", "学历经历"],
    placeholder: "### 教育经历 1 最高学历\n- 开始时间：2024-09\n- 结束时间：2027-06\n- 学校名称：星河大学\n- 专业名称：软件工程\n- 学历：硕士研究生\n- 学位：硕士\n- GPA分数：3.80\n- 专业排名：前10%",
    tips: ["按最高学历到较早学历排序。", "每段经历用 `### 教育经历 1` 分开，学校、专业、学历、学位、时间尽量写全。"]
  },
  {
    key: "internship",
    title: "实习经历",
    aliases: ["工作/实习经历", "实践经历"],
    placeholder: "### 实习经历 1\n- 开始时间：2025-07\n- 结束时间：2026-03\n- 公司：星桥科技有限公司\n- 部门：金融科技部\n- 职位：软件开发实习生\n- 工作内容：参与招聘系统和数据看板开发。\n- 工作成果：完成 6 个模块交付。",
    tips: ["公司、部门、岗位、时间、地点、工作内容和成果是高频字段。", "证明人信息如果愿意提供，也可以作为字段追加。"]
  },
  {
    key: "work",
    title: "工作经历",
    aliases: ["正式工作经历"],
    placeholder: "### 工作经历 1\n- 开始时间：\n- 结束时间：\n- 公司：\n- 部门：\n- 职位：\n- 工作内容：\n- 工作成果：",
    tips: ["应届生没有正式工作经历可以留空。", "留空模块不会影响资料保存，后续需要时再补。"]
  },
  {
    key: "project",
    title: "项目经历/实践活动",
    aliases: ["项目经历", "实践活动"],
    placeholder: "### 项目经历 1\n- 项目名称：隐私优先的简历表单助手\n- 开始时间：2025-03\n- 结束时间：2025-06\n- 职位：前端负责人\n- 项目内容：设计本地资料库、字段扫描和草稿填写流程。\n- 本人职责：负责浏览器扩展侧边栏和字段匹配。\n- 项目成果：完成可运行原型。",
    tips: ["项目名、角色、项目内容、本人职责、项目成果最好分开写。", "如果网站要求“实践方式”，也可以直接加一行。"]
  },
  {
    key: "student",
    title: "学生工作",
    aliases: ["干部任职经历", "在校职务", "社团工作"],
    placeholder: "### 学生工作 1\n- 组织名称：软件工程学院技术协会\n- 部门：活动部\n- 职务：活动负责人\n- 开始时间：2020-09\n- 结束时间：2022-06\n- 工作内容：组织技术分享和项目交流活动。",
    tips: ["学生会、班委、社团、干部任职都可以放这里。", "如果想区分社团工作和学生工作，可以新增 `## 社团工作` 模块。"]
  },
  {
    key: "awards",
    title: "奖惩情况",
    aliases: ["奖励情况", "荣誉成果"],
    placeholder: "### 奖惩 1\n- 奖惩时间：2022-06\n- 奖惩名称：大学生软件创新赛省级二等奖\n- 颁奖单位：省级大学生软件创新赛组委会\n- 奖励等级：省级\n- 奖惩描述：负责项目原型设计和前端实现。",
    tips: ["建议按时间倒序填写。", "奖项名称、颁奖单位、等级、描述拆开写，自动匹配更稳。"]
  },
  {
    key: "language",
    title: "外语能力",
    aliases: ["语言能力", "英语能力"],
    placeholder: "### 外语能力 1\n- 外语种类：英语\n- 证书名称（技能名称）：大学英语六级\n- 成绩：502\n- 获得时间：2020-12\n- 掌握程度：熟练\n- 听说能力：熟练\n- 读写能力：熟练",
    tips: ["CET、TOEFL、IELTS、GRE、GMAT 都建议写成单独字段。", "如果没有参加某项考试，可以写 `TOEFL：未参加`。"]
  },
  {
    key: "computer",
    title: "计算机技能",
    aliases: ["IT技能", "证书技能"],
    placeholder: "- 计算机水平：熟悉 JavaScript、TypeScript、React、Node.js。\n- 其它技能：熟悉数据结构、数据库基础、问题排查和技术文档撰写。",
    tips: ["技能描述可以是长句，主要作为提醒和文本框填充来源。", "具体证书可以放到“证书”模块。"]
  },
  {
    key: "certificates",
    title: "证书",
    aliases: ["证书信息", "资格证书"],
    placeholder: "### 证书 1\n- 证书获得时间：2020-12\n- 证书名称（技能名称）：大学英语六级\n- 证书编号：CET620201200001\n- 授予单位：全国大学英语六级考试委员会\n- 证书说明：英语能力证明。",
    tips: ["适合放职业资格证、技能证书、荣誉证书。", "证书编号、授予单位和证书说明不是每个网站都要求，但有就可以写。"]
  },
  {
    key: "family",
    title: "家庭情况",
    aliases: ["家庭信息", "家庭及社会关系"],
    placeholder: "### 家庭情况 1 父亲\n- 姓名：李建国\n- 关系：父亲\n- 出生日期：1970-05-12\n- 电话：13800000001\n- 工作单位：蓝杉商贸有限公司\n- 职务：运营主管\n- 政治面貌：群众",
    tips: ["每位家庭成员用一个 `###` 小标题分开。", "常见字段是姓名、关系、出生日期、电话、工作单位、职务、政治面貌。"]
  },
  {
    key: "training",
    title: "培训经历",
    aliases: ["培训"],
    placeholder: "### 培训经历 1\n- 开始时间：\n- 结束时间：\n- 培训名称：\n- 培训机构：\n- 培训地点：\n- 培训课程：\n- 培训内容：",
    tips: ["没有培训经历可以留空。", "如果公司表单要求培训经历，按时间、机构、课程、内容拆分最容易匹配。"]
  },
  {
    key: "papers",
    title: "论文和著作",
    aliases: ["论文著作", "论文"],
    placeholder: "### 论文和著作 1\n- 发表时间：\n- 刊物名称：\n- 刊物层级：\n- 论文名称：\n- 论文描述：",
    tips: ["没有论文著作可以留空。", "刊物名称、论文名称和描述拆开写，方便复制到不同字段。"]
  },
  {
    key: "patent",
    title: "专利",
    aliases: ["专利成果"],
    placeholder: "### 专利 1\n- 发表时间：\n- 专利名称：\n- 专利编号：\n- 专利类型：\n- 专利成果：",
    tips: ["没有专利可以留空。", "如果有多个专利，继续追加 `### 专利 2`。"]
  },
  {
    key: "self",
    title: "自我描述",
    aliases: ["自我评价", "自我介绍"],
    placeholder: "- 自我描述：学习能力强，沟通清晰，重视代码质量、交付稳定性和用户体验。\n- 自我评价：学习能力强，沟通清晰，习惯输出文档和复盘。",
    tips: ["这类内容主要是提醒和复制，不一定适合完全自动填写。", "建议写成 2 到 4 句短句，便于按字数要求裁剪。"]
  },
  {
    key: "declarations",
    title: "有关声明",
    aliases: ["个人声明", "声明"],
    placeholder: "- 是否存在亲属在应聘单位工作：否\n- 是否患有影响工作的疾病：否\n- 是否存在不良行为记录：否\n- 是否享有境外长期或永久居留权：否\n- 是否同意背景调查：是",
    tips: ["声明类问题通常要认真核对，不建议盲填。", "“本行”“本公司”等强行业措辞建议统一写成“应聘单位”。"]
  },
  {
    key: "other",
    title: "其他信息",
    aliases: ["补充信息", "自定义资料"],
    placeholder: "- GitHub：https://github.com/example\n- 个人主页：https://example.com\n- 招聘信息来源：招聘官网",
    tips: ["放没有固定归属但经常会用到的信息。", "如果某类信息越来越多，可以新增独立 `## 大类`。"]
  }
];

const STRUCTURED_RESUME_SECTIONS = [
  {
    key: "basic",
    title: "基本信息",
    kind: "simple",
    fields: profileFields([
      "姓名",
      "姓",
      "名",
      "英文名",
      "姓（拼音）",
      "名（拼音）",
      "性别",
      "出生日期",
      "民族",
      "国籍（国家或地区）",
      "电话",
      "邮箱",
      "微信号",
      "QQ",
      "证件号码类型",
      "证件号码",
      "政治面貌",
      "取得政治面貌时间",
      "婚姻状况",
      "户籍",
      "户籍类型",
      "籍贯",
      "生源地",
      "现居住城市",
      "邮政编码",
      "人事档案所在单位",
      "身高",
      "体重",
      "血型",
      "健康状况",
      "特长",
      "兴趣爱好",
      "高考时间",
      "高考分数",
      "高考科目",
      "工作年限",
      "专业技术职称",
      "紧急联系人",
      "紧急联系人电话",
      "与紧急联系人关系"
    ])
  },
  {
    key: "intention",
    title: "求职意向",
    kind: "repeat",
    itemLabel: "求职意向",
    defaultItems: 1,
    fields: profileFields(["意向岗位", "预计入职时间", "当前薪资", "期望工作城市", "期望薪资", "面试城市", "是否接受调剂"])
  },
  {
    key: "education",
    title: "教育经历",
    kind: "repeat",
    itemLabel: "教育经历",
    defaultItems: 1,
    fields: profileFields([
      "开始时间",
      "结束时间",
      "学校",
      "专业",
      "学号",
      "学制",
      "城市",
      "学位",
      "学历",
      "学习形式",
      "学校类别",
      "录取批次",
      "学院（院系）",
      "培养方式",
      "专业描述",
      "专业课程",
      "研究方向",
      "毕业论文",
      "成绩",
      "班级排名",
      "专业排名",
      "学历证书编号",
      "学位证书编号",
      "辅导员姓名",
      "辅导员联系方式",
      "是否为海外教育经历",
      "升学类型",
      "考试分数",
      "是否有转学经历"
    ])
  },
  {
    key: "internship",
    title: "实习经历",
    kind: "repeat",
    itemLabel: "实习经历",
    defaultItems: 1,
    fields: profileFields([
      "开始时间",
      "结束时间",
      "公司",
      "部门",
      "行业",
      "地点",
      "工资",
      "职位",
      "工作内容",
      "工作成果",
      "证明人姓名",
      "证明人职位",
      "证明人联系方式",
      "离职原因"
    ])
  },
  {
    key: "work",
    title: "工作经历",
    kind: "repeat",
    itemLabel: "工作经历",
    defaultItems: 1,
    fields: profileFields([
      "开始时间",
      "结束时间",
      "公司",
      "部门",
      "行业",
      "地点",
      "工资",
      "职位",
      "工作内容",
      "工作成果",
      "证明人姓名",
      "证明人职位",
      "证明人联系方式",
      "离职原因"
    ])
  },
  {
    key: "project",
    title: "项目经历/实践活动",
    kind: "repeat",
    itemLabel: "项目经历",
    defaultItems: 1,
    fields: profileFields([
      "开始时间",
      "结束时间",
      "职位",
      "部门",
      "项目名称",
      "参与人数",
      "项目内容",
      "实践方式",
      "本人职责",
      "项目成果",
      "项目链接",
      "证明人姓名",
      "证明人职位",
      "证明人联系方式"
    ])
  },
  {
    key: "student",
    title: "学生工作",
    kind: "repeat",
    itemLabel: "学生工作",
    defaultItems: 1,
    fields: profileFields(["开始时间", "结束时间", "组织名称", "部门", "职位", "职务", "工作内容", "本人职责"])
  },
  {
    key: "awards",
    title: "奖惩情况",
    kind: "repeat",
    itemLabel: "奖惩",
    defaultItems: 1,
    fields: profileFields(["奖惩时间", "奖惩名称", "颁奖单位", "奖励等级", "奖惩描述", "证明人"])
  },
  {
    key: "language",
    title: "外语能力",
    kind: "repeat",
    itemLabel: "外语能力",
    defaultItems: 1,
    fields: profileFields(["获得时间", "外语种类", "证书名称（技能名称）", "成绩", "掌握程度", "听说能力", "读写能力", "有效期"])
  },
  {
    key: "computer",
    title: "计算机技能",
    kind: "simple",
    fields: profileFields(["获得时间", "证书名称（技能名称）", "成绩", "掌握程度", "计算机水平", "其它技能"])
  },
  {
    key: "certificates",
    title: "证书",
    kind: "repeat",
    itemLabel: "证书",
    defaultItems: 1,
    fields: profileFields(["证书获得时间", "证书名称（技能名称）", "证书编号", "授予单位", "证书说明"])
  },
  {
    key: "family",
    title: "家庭情况",
    kind: "repeat",
    itemLabel: "家庭情况",
    defaultItems: 2,
    fields: profileFields(["姓名", "关系", "出生日期", "电话", "公司", "职位", "政治面貌", "联系地址"])
  },
  {
    key: "training",
    title: "培训经历",
    kind: "repeat",
    itemLabel: "培训经历",
    defaultItems: 1,
    fields: profileFields(["开始时间", "结束时间", "培训名称", "培训机构", "培训地点", "培训课程", "培训获得证书", "培训内容"])
  },
  {
    key: "papers",
    title: "论文和著作",
    kind: "repeat",
    itemLabel: "论文和著作",
    defaultItems: 1,
    fields: profileFields(["发表时间", "刊物名称", "刊物层级", "论文名称", "论文描述"])
  },
  {
    key: "patent",
    title: "专利",
    kind: "repeat",
    itemLabel: "专利",
    defaultItems: 1,
    fields: profileFields(["发表时间", "专利名称", "专利编号", "专利类型", "专利成果"])
  },
  {
    key: "self",
    title: "自我描述",
    kind: "simple",
    fields: profileFields(["自我描述", "自我评价"])
  },
  {
    key: "declarations",
    title: "有关声明",
    kind: "simple",
    fields: profileFields([
      "是否存在亲属在应聘单位工作",
      "是否患有影响工作的疾病",
      "是否存在不良行为记录",
      "是否享有境外长期或永久居留权",
      "是否拥有外国国籍",
      "是否拥有境外永久居留权",
      "是否同意背景调查",
      "本人声明以上填写内容与事实完全相符"
    ])
  },
  {
    key: "other",
    title: "其他信息",
    kind: "simple",
    fields: profileFields([
      "证券从业资格考试",
      "是否通过基金从业人员资格考试",
      "是否通过期货从业人员资格考试",
      "受到奖励/学术成果",
      "社会/校园活动",
      "爱好及专长",
      "招聘信息来源",
      "GitHub",
      "个人主页"
    ])
  }
];

const PROFILE_SECTIONS = [
  {
    key: "basic",
    title: "基本信息",
    note: "先把最常被招聘网站读取的字段填齐。",
    columns: "cols-2",
    customFields: true,
    fields: BASIC_FIELDS
  },
  {
    key: "education",
    title: "教育经历",
    note: "一般至少保留一条，最上面通常是最高学历。",
    columns: "cols-2",
    itemLabel: "教育经历",
    fields: EDUCATION_FIELDS
  },
  {
    key: "experiences",
    title: "实习经历 / 项目实践",
    note: "可以混合写实习和项目，AI 会按语义去识别。",
    columns: "cols-2",
    itemLabel: "经历",
    fields: EXPERIENCE_FIELDS
  },
  {
    key: "campus",
    title: "学生社团经历",
    note: "如果没有就留空，后续可以直接删掉卡片。",
    columns: "cols-2",
    itemLabel: "社团经历",
    fields: CAMPUS_FIELDS
  },
  {
    key: "family",
    title: "家庭及社会关系",
    note: "至少保留父亲和母亲两项信息。",
    columns: "cols-2",
    members: [
      { key: "father", title: "父亲" },
      { key: "mother", title: "母亲" }
    ],
    fields: FAMILY_MEMBER_FIELDS
  },
  {
    key: "certificates",
    title: "证书信息",
    note: "有证书就填，没有就留空。",
    columns: "cols-2",
    itemLabel: "证书",
    fields: CERTIFICATE_FIELDS
  },
  {
    key: "awards",
    title: "奖惩信息",
    note: "按时间倒序放最常见。",
    columns: "cols-2",
    itemLabel: "奖惩",
    fields: AWARD_FIELDS
  },
  {
    key: "other",
    title: "其他信息",
    note: "这部分通常是简历补充项。",
    columns: "cols-2",
    fields: OTHER_FIELDS
  },
  {
    key: "declarations",
    title: "有关声明",
    note: "默认都给出“否”，如果情况有变化再改。",
    columns: "cols-1",
    fields: DECLARATION_FIELDS
  }
];

let defaults = null;
let profileState = null;
let activeProfileSectionKey = "";
let profileSectionSyncFrame = 0;

document.getElementById("settingsForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  await saveApiSettings();
});
document.getElementById("refreshModels").addEventListener("click", refreshModelList);
document.getElementById("testConnection").addEventListener("click", testConnection);
document.getElementById("saveProfile").addEventListener("click", saveProfile);
document.getElementById("exportProfile").addEventListener("click", exportProfile);
document.getElementById("importProfile").addEventListener("click", () => fields.profileFileInput.click());
document.getElementById("resetProfile").addEventListener("click", resetProfile);
document.getElementById("clearLocalData").addEventListener("click", clearLocalData);
fields.modelPreset.addEventListener("change", () => {
  if (fields.modelPreset.value) {
    fields.model.value = fields.modelPreset.value;
    setInlineFeedback(`已选择候选模型：${fields.modelPreset.value}`);
  }
});
fields.model.addEventListener("input", syncModelPresetFromCurrentModel);
fields.apiMode.addEventListener("change", async () => {
  updateModeBlocks();
  await maybeAutoRefreshModelList();
});
fields.baseUrl.addEventListener("change", () => maybeAutoRefreshModelList());
fields.customUrl.addEventListener("change", () => maybeAutoRefreshModelList());
fields.profileFileInput.addEventListener("change", importProfileFromFile);
fields.profileEditor.addEventListener("click", handleProfileEditorClick);
fields.profileSectionEditor.addEventListener("input", syncProfileMarkdownFromSections);
fields.profileSectionEditor.addEventListener("focusin", handleProfileSectionFocus);
fields.profileSectionEditor.addEventListener("click", handleStructuredProfileClick);
window.addEventListener("scroll", scheduleProfileSectionSync, { passive: true });
window.addEventListener("resize", scheduleProfileSectionSync);

loadSettings();

async function loadSettings() {
  try {
    const settings = await sendRuntimeMessage({ type: "AI_RESUME_GET_SETTINGS" });
    defaults = settings.defaults;
    applyApiConfig(settings.apiConfig);
    profileState = prepareProfileForRender(settings.profile);
    fields.profileMarkdown.value = getProfileMarkdownFromSettings(settings);
    renderProfileNav();
    renderProfileTips(RESUME_SECTION_GUIDE[0]?.key);
    renderMarkdownSectionEditor(fields.profileMarkdown.value);
    scheduleProfileSectionSync();
    updateModeBlocks();
    setStatus("设置已加载。");
    await maybeAutoRefreshModelList({ silent: true });
  } catch (error) {
    setStatus(`加载失败：${error.message}`, true);
  }
}

function applyApiConfig(config) {
  fields.apiMode.value = config.mode || "openai-compatible";
  fields.apiKey.value = config.apiKey || "";
  fields.model.value = config.model || "";
  fields.useJsonResponseFormat.checked = Boolean(config.useJsonResponseFormat);
  fields.baseUrl.value = config.baseUrl || "";
  fields.endpointPath.value = config.endpointPath || "";
  fields.extraHeadersJson.value = config.extraHeadersJson || "{}";
  fields.customUrl.value = config.customUrl || "";
  fields.customMethod.value = config.customMethod || "POST";
  fields.customHeadersJson.value = config.customHeadersJson || "{}";
  fields.customBodyTemplate.value = config.customBodyTemplate || "";
  fields.customResponsePath.value = config.customResponsePath || "";
}

function collectApiConfig() {
  validateJsonObject(fields.extraHeadersJson.value, "额外 Headers JSON");
  validateJsonObject(fields.customHeadersJson.value, "Custom Headers JSON");

  return {
    mode: fields.apiMode.value,
    apiKey: fields.apiKey.value.trim(),
    model: fields.model.value.trim(),
    useJsonResponseFormat: fields.useJsonResponseFormat.checked,
    baseUrl: fields.baseUrl.value.trim(),
    endpointPath: fields.endpointPath.value.trim(),
    extraHeadersJson: fields.extraHeadersJson.value.trim() || "{}",
    customUrl: fields.customUrl.value.trim(),
    customMethod: fields.customMethod.value,
    customHeadersJson: fields.customHeadersJson.value.trim() || "{}",
    customBodyTemplate: fields.customBodyTemplate.value,
    customResponsePath: fields.customResponsePath.value.trim()
  };
}

async function saveApiSettings() {
  try {
    const apiConfig = collectApiConfig();
    await sendRuntimeMessage({
      type: "AI_RESUME_SAVE_SETTINGS",
      payload: { apiConfig }
    });
    setStatus("API 设置保存成功。");
    setInlineFeedback("API 设置已保存到本机。");
  } catch (error) {
    setStatus(`保存失败：${error.message}`, true);
    setInlineFeedback(`保存失败：${error.message}`, true);
  }
}

async function saveProfile() {
  try {
    syncProfileMarkdownFromSections();
    const profileMarkdown = fields.profileMarkdown.value;
    await sendRuntimeMessage({
      type: "AI_RESUME_SAVE_SETTINGS",
      payload: { profileMarkdown }
    });
    setStatus("简历资料保存成功，已写入本机的 chrome.storage.local。");
    setInlineFeedback("Markdown 小抄已保存到本机。");
  } catch (error) {
    setStatus(`保存资料失败：${error.message}`, true);
    setInlineFeedback(`保存资料失败：${error.message}`, true);
  }
}

async function exportProfile() {
  try {
    syncProfileMarkdownFromSections();
    const profileMarkdown = fields.profileMarkdown.value;
    const blob = new Blob([profileMarkdown], {
      type: "text/markdown;charset=utf-8"
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `resume-cheatsheet-${new Date().toISOString().slice(0, 10)}.md`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setStatus("已导出本地资料 Markdown。");
  } catch (error) {
    setStatus(`导出失败：${error.message}`, true);
  }
}

async function importProfileFromFile() {
  const file = fields.profileFileInput.files?.[0];
  if (!file) {
    return;
  }

  try {
    const text = await file.text();
    const imported = parseImportedProfileText(text, file.name);
    fields.profileMarkdown.value = imported.profileMarkdown;
    renderMarkdownSectionEditor(fields.profileMarkdown.value);
    await sendRuntimeMessage({
      type: "AI_RESUME_SAVE_SETTINGS",
      payload: imported.profile ? { profile: imported.profile, profileMarkdown: imported.profileMarkdown } : { profileMarkdown: imported.profileMarkdown }
    });
    setStatus("已导入并保存到本机。侧边栏会立即读取这份 Markdown 小抄。");
    setInlineFeedback(imported.profile ? "旧 JSON 已转换为 Markdown 并保存。" : "Markdown 小抄已保存到本机。");
  } catch (error) {
    setStatus(`导入失败：${error.message}`, true);
    setInlineFeedback(`导入失败：${error.message}`, true);
  } finally {
    fields.profileFileInput.value = "";
  }
}

function resetProfile() {
  const confirmed = window.confirm("这会用 Markdown 模板覆盖当前资料编辑区，是否继续？");
  if (!confirmed) {
    return;
  }

  fields.profileMarkdown.value = defaults?.profileMarkdown || profileToMarkdown(createEmptyProfile());
  renderMarkdownSectionEditor(fields.profileMarkdown.value);
  setStatus("已恢复空白模板。点击保存后生效。");
}

async function clearLocalData() {
  const confirmed = window.confirm("这会清空本机保存的简历资料和 API 设置，只影响当前浏览器。是否继续？");
  if (!confirmed) {
    return;
  }

  try {
    await sendRuntimeMessage({ type: "AI_RESUME_CLEAR_SETTINGS" });
    await loadSettings();
    setStatus("本地数据已清空，已恢复默认模板。");
  } catch (error) {
    setStatus(`清空失败：${error.message}`, true);
  }
}

async function testConnection() {
  try {
    const apiConfig = collectApiConfig();
    setStatus("正在测试连接，不会发送你的资料值...");
    setInlineFeedback("正在测试连接...");
    setApiPreview("");
    const result = await sendRuntimeMessage({
      type: "AI_RESUME_TEST_CONNECTION",
      payload: { apiConfig }
    });
    setStatus("连接正常，响应预览已显示在 API 设置下方。");
    setInlineFeedback(result.contentPreview ? "连接正常，响应预览见下方。" : "连接正常。");
    setApiPreview(formatConnectionPreview(result));
  } catch (error) {
    setStatus(`测试失败：${error.message}`, true);
    setInlineFeedback(`测试失败：${error.message}`, true);
    setApiPreview("");
  }
}

async function refreshModelList(options = {}) {
  try {
    const apiConfig = collectApiConfig();
    if (!shouldAttemptModelList(apiConfig)) {
      if (!options.silent) {
        const message = "当前配置还不能自动推断模型列表，请先补全 Base URL 或 Custom API URL。";
        setStatus(message, true);
        setInlineFeedback(message, true);
      }
      return;
    }

    if (!options.silent) {
      setStatus("正在刷新模型列表...");
      setInlineFeedback("正在刷新模型列表...");
    }

    const result = await sendRuntimeMessage({
      type: "AI_RESUME_LIST_MODELS",
      payload: { apiConfig }
    });
    renderModelOptions(Array.isArray(result.models) ? result.models : []);

    const count = Array.isArray(result.models) ? result.models.length : 0;
    const message = count > 0 ? `已加载 ${count} 个模型候选，仍可手动输入任意模型名。` : "模型列表为空，仍可手动输入模型名。";
    setStatus(message);
    setInlineFeedback(message);
  } catch (error) {
    if (!options.silent) {
      setStatus(`刷新模型列表失败：${error.message}`, true);
      setInlineFeedback(`刷新模型列表失败：${error.message}`, true);
    }
  }
}

async function maybeAutoRefreshModelList(options = {}) {
  const safeOptions = options && typeof options === "object" ? options : {};
  try {
    const apiConfig = collectApiConfig();
    if (!shouldAttemptModelList(apiConfig)) {
      return;
    }

    if (apiConfig.mode === "openai-compatible" && apiConfig.baseUrl) {
      await refreshModelList({ ...safeOptions, silent: true });
    } else if (apiConfig.mode === "custom" && apiConfig.customUrl) {
      await refreshModelList({ ...safeOptions, silent: true });
    }
  } catch (error) {
    if (!safeOptions.silent) {
      setInlineFeedback(`模型列表自动检测失败：${error.message}`, true);
    }
  }
}

function shouldAttemptModelList(apiConfig) {
  if (apiConfig.mode === "openai-compatible") {
    return Boolean(apiConfig.baseUrl);
  }

  return Boolean(apiConfig.customUrl) && deriveModelListUrl(apiConfig.customUrl) !== "";
}

function renderModelOptions(models) {
  const currentModel = fields.model.value.trim();
  const normalizedModels = models
    .map((model) => ({
      id: String(model.id || "").trim(),
      name: String(model.name || model.id || "").trim()
    }))
    .filter((model) => model.id);

  fields.modelOptions.innerHTML = models
    .map((model) => {
      const id = escapeHtml(model.id || "");
      const label = model.name && model.name !== model.id ? ` (${escapeHtml(model.name)})` : "";
      return `<option value="${id}" label="${label}"></option>`;
    })
    .join("");

  fields.modelPreset.innerHTML = [
    '<option value="">手动输入 / 不使用候选</option>',
    ...normalizedModels.map((model) => {
      const label = model.name && model.name !== model.id ? `${model.id} (${model.name})` : model.id;
      return `<option value="${escapeHtml(model.id)}">${escapeHtml(label)}</option>`;
    })
  ].join("");
  fields.modelPreset.value = normalizedModels.some((model) => model.id === currentModel) ? currentModel : "";
}

function syncModelPresetFromCurrentModel() {
  const currentModel = fields.model.value.trim();
  const matchedOption = Array.from(fields.modelPreset.options).find((option) => option.value === currentModel);
  fields.modelPreset.value = matchedOption ? currentModel : "";
}

function profileFields(labels) {
  return labels.map((label) => profileField(label));
}

function profileField(label, overrides = {}) {
  const normalized = String(label || "");
  const isLongText = /内容|描述|职责|成果|课程|评价|说明|原因|地址|专业描述|专业课程|毕业论文|技能|活动|学术成果|自我/.test(normalized);
  const isDate = /出生日期/.test(normalized);
  const isMonth = /时间|日期|年月|发表|获得|取得|入职/.test(normalized) && !isDate && !/有效期/.test(normalized);
  const isChoice = /^(性别|血型|婚姻状况|健康状况|高考科目|学历|学位|学制|学习形式|学校类别|录取批次|培养方式|升学类型|户籍类型|政治面貌|专业技术职称|外语种类|掌握程度|听说能力|读写能力|奖励等级|证件号码类型|与紧急联系人关系|关系)$/.test(normalized) || /^是否|^有无/.test(normalized);

  const field = {
    key: normalizeProfileSectionTitle(normalized) || `field_${Math.random().toString(36).slice(2)}`,
    label: normalized,
    type: isLongText ? "textarea" : isChoice ? "select" : isDate ? "date" : isMonth ? "month" : "text",
    rows: isLongText ? 4 : undefined,
    span: isLongText,
    placeholder: buildStructuredPlaceholder(normalized),
    ...overrides
  };

  if (field.type === "select") {
    field.options = getStructuredFieldOptions(normalized);
  }
  return field;
}

function getStructuredFieldOptions(label) {
  if (/性别/.test(label)) {
    return ["", "男", "女"];
  }
  if (/是否|有无/.test(label)) {
    return ["", "是", "否"];
  }
  if (/血型/.test(label)) {
    return ["", "A型", "B型", "AB型", "O型", "其他"];
  }
  if (/婚姻状况/.test(label)) {
    return ["", "未婚", "已婚", "离异", "其他"];
  }
  if (/健康状况/.test(label)) {
    return ["", "健康", "良好", "一般", "其他"];
  }
  if (/高考科目/.test(label)) {
    return ["", "理科", "文科", "综合改革"];
  }
  if (/证件号码类型/.test(label)) {
    return ["", "身份证", "护照", "港澳居民来往内地通行证", "台湾居民来往大陆通行证", "其他"];
  }
  if (/学历/.test(label)) {
    return ["", "博士研究生", "硕士研究生", "本科", "大专", "高中", "其他"];
  }
  if (/学位/.test(label)) {
    return ["", "博士", "硕士", "学士", "无"];
  }
  if (/学制/.test(label)) {
    return ["", "2年", "2.5年", "3年", "4年", "5年", "其他"];
  }
  if (/学习形式/.test(label)) {
    return ["", "全日制", "非全日制"];
  }
  if (/学校类别/.test(label)) {
    return ["", "985", "211", "双一流", "普通本科", "普通高校", "海外院校", "其他"];
  }
  if (/录取批次/.test(label)) {
    return ["", "本科提前批", "本科一批", "本科二批", "专科批", "普通批", "强基计划", "综合评价", "保送生", "其他"];
  }
  if (/培养方式/.test(label)) {
    return ["", "非定向", "定向", "统招统分", "委托培养", "自费"];
  }
  if (/升学类型/.test(label)) {
    return ["", "普通高等学校招生全国统一考试（高考）", "全国硕士研究生统一招生考试", "推荐免试", "自主招生", "港澳台联招", "海外申请", "其他"];
  }
  if (/户籍类型/.test(label)) {
    return ["", "居民户", "农业户口", "非农业户口", "家庭户口", "集体户口", "其他"];
  }
  if (/政治面貌/.test(label)) {
    return ["", "中共党员", "中共预备党员", "共青团员", "群众", "其他"];
  }
  if (/专业技术职称/.test(label)) {
    return ["", "无", "初级", "中级", "副高级", "正高级", "其他"];
  }
  if (/外语种类/.test(label)) {
    return ["", "英语", "日语", "法语", "德语", "其他"];
  }
  if (/掌握程度|听说能力|读写能力/.test(label)) {
    return ["", "熟练", "良好", "一般"];
  }
  if (/奖励等级/.test(label)) {
    return ["", "国家级", "省级", "市级", "校级", "院级", "其他"];
  }
  if (/关系|与紧急联系人关系/.test(label)) {
    return ["", "父亲", "母亲", "配偶", "兄弟姐妹", "朋友", "其他"];
  }
  return [""];
}

function buildStructuredPlaceholder(label) {
  if (/姓名/.test(label)) {
    return "例如 李明（示例）";
  }
  if (/电话|手机/.test(label)) {
    return "例如 13900000000";
  }
  if (/邮箱/.test(label)) {
    return "例如 liming@example.com";
  }
  if (/证件号码/.test(label)) {
    return "示例身份证号或其他证件号";
  }
  if (/学校|公司|机构|单位/.test(label)) {
    return "填写完整名称";
  }
  if (/内容|描述|职责|成果|评价/.test(label)) {
    return "用完整句子描述，后续可按网站字数要求裁剪";
  }
  return "";
}

function renderProfileNav() {
  if (!fields.profileNav) {
    return;
  }

  fields.profileNav.innerHTML = RESUME_SECTION_GUIDE.map((section) => {
    return `
      <a href="#profile-section-${escapeHtml(section.key)}" data-profile-nav="${escapeHtml(section.key)}">
        <span class="nav-title">${escapeHtml(section.title)}</span>
        <span class="completion-badge is-empty" data-completion-badge>0/0</span>
      </a>
    `;
  }).join("");

  fields.profileNav.querySelectorAll("[data-profile-nav]").forEach((link) => {
    link.addEventListener("click", () => {
      setActiveProfileSection(link.dataset.profileNav || "", { force: true });
      window.setTimeout(scheduleProfileSectionSync, 80);
    });
  });
}

function renderProfileTips(activeKey = "") {
  if (!fields.profileTips) {
    return;
  }

  const guideSection = RESUME_SECTION_GUIDE.find((section) => section.key === activeKey);
  const domSection = fields.profileSectionEditor?.querySelector(`[data-profile-section="${CSS.escape(activeKey || "")}"]`);
  const activeSection = guideSection || {
    key: activeKey || RESUME_SECTION_GUIDE[0]?.key,
    title: domSection?.dataset.sectionTitle || RESUME_SECTION_GUIDE[0]?.title || "基本信息",
    tips: ["这是自定义模块，保存时会继续保留。"]
  };
  const globalTips = [
    "像网申页面一样直接填字段；保存时会在后台转换成 Markdown。",
    "同一个值如果不同网站叫法不同，可以点“添加自定义字段”补充别名。",
    "没有的经历可以留空；经历类模块可以添加多条。",
    "资料只保存在本机 chrome.storage.local，不会同步到云端。",
    "AI 只接收页面字段和资料字段目录，不接收你填写的资料值。"
  ];

  fields.profileTips.innerHTML = `
    <article class="tip-card">
      <div class="tip-kicker">当前模块</div>
      <h3>${escapeHtml(activeSection.title || "基本信息")}</h3>
      ${(activeSection?.tips || []).map((tip) => `<p>${escapeHtml(tip)}</p>`).join("")}
    </article>
    <article class="tip-card">
      <div class="tip-kicker">通用规则</div>
      ${globalTips.map((tip) => `<p>${escapeHtml(tip)}</p>`).join("")}
    </article>
  `;

  fields.profileNav?.querySelectorAll("[data-profile-nav]").forEach((link) => {
    link.classList.toggle("active", link.dataset.profileNav === activeSection.key);
  });
}

function setActiveProfileSection(sectionKey, options = {}) {
  if (!sectionKey) {
    return;
  }
  if (!options.force && activeProfileSectionKey === sectionKey) {
    return;
  }

  activeProfileSectionKey = sectionKey;
  renderProfileTips(sectionKey);
}

function scheduleProfileSectionSync() {
  if (profileSectionSyncFrame) {
    return;
  }

  profileSectionSyncFrame = window.requestAnimationFrame(() => {
    profileSectionSyncFrame = 0;
    syncActiveProfileSectionFromScroll();
  });
}

function syncActiveProfileSectionFromScroll() {
  if (!fields.profileSectionEditor) {
    return;
  }

  const sections = Array.from(fields.profileSectionEditor.querySelectorAll("[data-profile-section]"));
  if (sections.length === 0) {
    return;
  }

  const anchorY = Math.min(Math.max(window.innerHeight * 0.26, 120), 220);
  let activeSection = sections[0];
  let activeScore = Number.POSITIVE_INFINITY;

  for (const section of sections) {
    const rect = section.getBoundingClientRect();
    if (rect.bottom < 80) {
      continue;
    }

    const distance = rect.top <= anchorY ? Math.abs(rect.top - anchorY) * 0.35 : Math.abs(rect.top - anchorY);
    if (distance < activeScore) {
      activeScore = distance;
      activeSection = section;
    }
  }

  setActiveProfileSection(activeSection.dataset.profileSection || "");
}

function handleProfileSectionFocus(event) {
  const card = event.target.closest("[data-profile-section]");
  if (!card) {
    return;
  }
  setActiveProfileSection(card.dataset.profileSection || "", { force: true });
}

function handleStructuredProfileClick(event) {
  const button = event.target.closest("button[data-action]");
  if (!button) {
    return;
  }

  const action = button.dataset.action;
  const sectionEl = button.closest("[data-profile-section]");
  const sectionKey = sectionEl?.dataset.profileSection || "";
  const section = getStructuredSectionConfig(sectionKey) || {
    key: sectionKey,
    title: sectionEl?.dataset.sectionTitle || "自定义资料",
    kind: "simple",
    fields: []
  };
  if (!section) {
    return;
  }

  if (action === "add-structured-item") {
    const itemsRoot = sectionEl.querySelector("[data-structured-items]");
    const index = itemsRoot ? itemsRoot.querySelectorAll("[data-structured-item]").length : 0;
    itemsRoot?.insertAdjacentHTML("beforeend", renderStructuredItem(section, createBlankStructuredItem(section, index), index));
    syncProfileMarkdownFromSections();
    updateProfileCompletion();
    setStatus(`已添加一条 ${section.itemLabel || section.title}。`);
    return;
  }

  if (action === "remove-structured-item") {
    button.closest("[data-structured-item]")?.remove();
    syncProfileMarkdownFromSections();
    updateProfileCompletion();
    setStatus(`已删除一条 ${section.itemLabel || section.title}。`);
    return;
  }

  if (action === "add-custom-row") {
    const target = button.closest("[data-custom-area]")?.querySelector("[data-custom-rows]");
    target?.insertAdjacentHTML("beforeend", renderCustomStructuredRow());
    syncProfileMarkdownFromSections();
    updateProfileCompletion();
    setStatus("已添加自定义字段。");
    return;
  }

  if (action === "remove-custom-row") {
    button.closest("[data-custom-row]")?.remove();
    syncProfileMarkdownFromSections();
    updateProfileCompletion();
    setStatus("已删除自定义字段。");
  }
}

function renderMarkdownSectionEditor(markdown) {
  if (!fields.profileSectionEditor) {
    return;
  }

  const parsed = parseStructuredProfileMarkdown(markdown);
  const known = STRUCTURED_RESUME_SECTIONS.map((section) => renderStructuredSection(section, parsed.sections[section.key])).join("");

  const extras = parsed.extraSections
    .map((section, index) => {
      const key = `extra-${index}`;
      return renderStructuredSection(
        {
          key,
          title: section.title,
          kind: "simple",
          fields: [],
          isExtra: true
        },
        {
          custom: section.custom?.length ? section.custom : parseKeyValueLines(section.body).custom
        }
      );
    })
    .join("");

  fields.profileSectionEditor.innerHTML = known + extras;
  scheduleProfileSectionSync();
  updateProfileCompletion();
}

function renderStructuredSection(section, data = null) {
  const config = {
    ...section,
    kind: section.kind || "simple"
  };
  const isRepeat = config.kind === "repeat";
  const parsedData = data || (isRepeat ? { items: [] } : { values: {}, custom: [] });
  const sectionDescription = config.isExtra
    ? "导入资料里的自定义模块，会继续保存。"
    : isRepeat
      ? "像网申页面一样逐条维护；没有内容可以留空。"
      : "直接填写字段；没有内容可以留空。";

  const action = isRepeat
    ? `<button class="structured-add" type="button" data-action="add-structured-item">+ 添加一条</button>`
    : "";

  const body = isRepeat
    ? renderStructuredRepeater(config, parsedData.items)
    : renderStructuredSimple(config, parsedData);

  return `
    <section id="profile-section-${escapeHtml(section.key)}" class="profile-edit-section" data-profile-section="${escapeHtml(section.key)}" data-section-title="${escapeHtml(section.title)}" data-extra-section="${config.isExtra ? "true" : "false"}">
      <div class="profile-edit-head">
        <div>
          <div class="profile-title-row">
            <h3>${escapeHtml(section.title)}</h3>
            <span class="completion-badge is-empty" data-completion-badge>0/0</span>
          </div>
          <p>${escapeHtml(sectionDescription)}</p>
        </div>
        ${action}
      </div>
      ${body}
    </section>
  `;
}

function renderStructuredSimple(section, data = {}) {
  const values = data.values || {};
  const custom = data.custom || [];
  return `
    <div class="structured-grid">
      ${(section.fields || []).map((field) => renderStructuredField(field, values[field.label])).join("")}
    </div>
    ${renderStructuredCustomArea(custom)}
  `;
}

function renderStructuredRepeater(section, items = []) {
  const list = Array.isArray(items) && items.length > 0
    ? items
    : Array.from({ length: Math.max(1, Number(section.defaultItems || 1)) }, (_unused, index) => createBlankStructuredItem(section, index));
  return `
    <div class="structured-items" data-structured-items>
      ${list.map((item, index) => renderStructuredItem(section, item, index)).join("")}
    </div>
  `;
}

function renderStructuredItem(section, item, index) {
  const title = item?.title || `${section.itemLabel || section.title} ${index + 1}`;
  return `
    <article class="structured-item" data-structured-item>
      <div class="structured-item-head">
        <input class="structured-item-title" data-item-title value="${escapeHtml(title)}" aria-label="${escapeHtml(section.itemLabel || section.title)}标题" />
        <button class="structured-remove" type="button" data-action="remove-structured-item">删除</button>
      </div>
      <div class="structured-grid">
        ${(section.fields || []).map((field) => renderStructuredField(field, item?.values?.[field.label])).join("")}
      </div>
      ${renderStructuredCustomArea(item?.custom || [])}
    </article>
  `;
}

function renderStructuredField(field, value = "") {
  const id = `structured_${field.key}_${Math.random().toString(36).slice(2)}`;
  const fieldClass = field.span ? "structured-field span-2" : "structured-field";
  const valueText = value == null ? "" : String(value);
  let control = "";

  if (field.type === "textarea") {
    control = `<textarea id="${id}" data-field-label="${escapeHtml(field.label)}" rows="${field.rows || 4}" placeholder="${escapeHtml(field.placeholder || "")}">${escapeHtml(valueText)}</textarea>`;
  } else if (field.type === "select") {
    const options = (field.options || ["", "是", "否"])
      .map((option) => {
        const selected = String(option) === valueText ? " selected" : "";
        return `<option value="${escapeHtml(option)}"${selected}>${escapeHtml(option)}</option>`;
      })
      .join("");
    control = `<select id="${id}" data-field-label="${escapeHtml(field.label)}">${options}</select>`;
  } else {
    control = `<input id="${id}" data-field-label="${escapeHtml(field.label)}" type="${escapeHtml(field.type || "text")}" value="${escapeHtml(valueText)}" placeholder="${escapeHtml(field.placeholder || "")}" />`;
  }

  return `
    <label class="${fieldClass}" for="${id}">
      <span>${escapeHtml(field.label)}</span>
      ${control}
    </label>
  `;
}

function renderStructuredCustomArea(customRows = []) {
  return `
    <div class="structured-custom" data-custom-area>
      <div class="structured-custom-head">
        <span>自定义字段</span>
        <button type="button" data-action="add-custom-row">+ 添加自定义字段</button>
      </div>
      <div class="structured-custom-rows" data-custom-rows>
        ${(customRows || []).map((row) => renderCustomStructuredRow(row)).join("")}
      </div>
    </div>
  `;
}

function renderCustomStructuredRow(row = {}) {
  return `
    <div class="structured-custom-row" data-custom-row>
      <input data-custom-label value="${escapeHtml(row.label || "")}" placeholder="字段名，例如 个人主页" />
      <input data-custom-value value="${escapeHtml(row.value || "")}" placeholder="字段值" />
      <button type="button" data-action="remove-custom-row">删除</button>
    </div>
  `;
}

function parseStructuredProfileMarkdown(markdown) {
  const result = { sections: {}, extraSections: [] };
  let currentTitle = "";
  let currentLines = [];

  const flush = () => {
    if (!currentTitle) {
      return;
    }
    const section = getStructuredSectionByTitle(currentTitle);
    const body = currentLines.join("\n").trim();
    if (section) {
      result.sections[section.key] = mergeStructuredSectionData(
        section,
        result.sections[section.key],
        parseStructuredSectionBody(section, body)
      );
    } else {
      result.extraSections.push({
        title: currentTitle,
        body,
        custom: parseKeyValueLines(body).custom
      });
    }
  };

  for (const rawLine of String(markdown || "").split(/\r?\n/)) {
    const heading = rawLine.match(/^##\s+(.+)$/);
    if (heading) {
      flush();
      currentTitle = heading[1].replace(/#+\s*$/, "").trim();
      currentLines = [];
      continue;
    }
    if (!currentTitle) {
      continue;
    }
    currentLines.push(rawLine);
  }
  flush();

  return result;
}

function parseStructuredSectionBody(section, body) {
  if (section.kind === "repeat") {
    return { items: parseRepeatedStructuredItems(section, body) };
  }
  return parseSimpleStructuredValues(section, body);
}

function parseRepeatedStructuredItems(section, body) {
  const items = [];
  let currentTitle = "";
  let currentLines = [];

  const flush = () => {
    if (!currentTitle && currentLines.length === 0) {
      return;
    }
    const parsed = parseSimpleStructuredValues(section, currentLines.join("\n"));
    items.push({
      title: currentTitle || `${section.itemLabel || section.title} ${items.length + 1}`,
      values: parsed.values,
      custom: parsed.custom
    });
  };

  for (const rawLine of String(body || "").split(/\r?\n/)) {
    const heading = rawLine.match(/^###\s+(.+)$/);
    if (heading) {
      flush();
      currentTitle = heading[1].replace(/#+\s*$/, "").trim();
      currentLines = [];
      continue;
    }
    currentLines.push(rawLine);
  }
  flush();

  if (items.length === 0 && String(body || "").trim()) {
    const parsed = parseSimpleStructuredValues(section, body);
    items.push({
      title: `${section.itemLabel || section.title} 1`,
      values: parsed.values,
      custom: parsed.custom
    });
  }

  return items;
}

function parseSimpleStructuredValues(section, body) {
  const values = {};
  const custom = [];
  const parsed = parseKeyValueLines(body);

  for (const row of parsed.rows) {
    const field = matchStructuredField(section, row.label);
    if (field) {
      values[field.label] = row.value;
    } else if (row.label || row.value) {
      custom.push(row);
    }
  }

  return { values, custom };
}

function parseKeyValueLines(body) {
  const rows = [];
  const custom = [];
  let current = null;

  for (const rawLine of String(body || "").split(/\r?\n/)) {
    const line = rawLine.replace(/\t/g, "  ");
    const trimmed = line.trim();
    if (!trimmed || /^#{1,6}\s+/.test(trimmed) || trimmed.startsWith(">")) {
      continue;
    }

    const bullet = trimmed.match(/^[-*+]\s+([^:：]+?)\s*[:：]\s*(.*)$/);
    const keyValue = bullet || trimmed.match(/^([^:：]{1,80})\s*[:：]\s*(.*)$/);
    if (keyValue) {
      current = {
        label: normalizePlainText(keyValue[1], 80),
        value: String(keyValue[2] || "").trim()
      };
      rows.push(current);
      custom.push(current);
      continue;
    }

    if (current && /^\s{2,}/.test(line)) {
      current.value = `${current.value}\n${trimmed}`.trim();
    }
  }

  return { rows, custom };
}

function mergeStructuredSectionData(section, previous, next) {
  if (!previous) {
    return next;
  }
  if (section.kind === "repeat") {
    return {
      items: [...(previous.items || []), ...(next.items || [])]
    };
  }
  return {
    values: { ...(previous.values || {}), ...(next.values || {}) },
    custom: [...(previous.custom || []), ...(next.custom || [])]
  };
}

function getStructuredSectionByTitle(title) {
  const normalized = normalizeProfileSectionTitle(title);
  return STRUCTURED_RESUME_SECTIONS.find((section) => {
    const guide = RESUME_SECTION_GUIDE.find((item) => item.key === section.key);
    const candidates = [section.title, ...(guide?.aliases || [])].map(normalizeProfileSectionTitle);
    return candidates.includes(normalized);
  }) || null;
}

function getStructuredSectionConfig(key) {
  return STRUCTURED_RESUME_SECTIONS.find((section) => section.key === key) || null;
}

function matchStructuredField(section, label) {
  const normalized = normalizeProfileSectionTitle(label);
  return (section.fields || []).find((field) => {
    const candidates = [field.label, ...(field.aliases || [])].map(normalizeProfileSectionTitle);
    return candidates.includes(normalized);
  }) || null;
}

function createBlankStructuredItem(section, index = 0) {
  return {
    title: `${section.itemLabel || section.title} ${index + 1}`,
    values: {},
    custom: []
  };
}

function normalizeProfileSectionTitle(value) {
  return String(value || "")
    .replace(/[()（）/／、\s]/g, "")
    .replace(/添加|HOT|NEW/g, "")
    .trim();
}

function normalizePlainText(value, maxLength = 120) {
  const text = String(value || "").replace(/\s+/g, " ").trim();
  return text.length > maxLength ? text.slice(0, maxLength) : text;
}

function syncProfileMarkdownFromSections() {
  if (!fields.profileSectionEditor || !fields.profileMarkdown) {
    return;
  }
  fields.profileMarkdown.value = collectMarkdownFromSectionEditor();
  updateProfileCompletion();
}

function updateProfileCompletion() {
  if (!fields.profileSectionEditor) {
    return;
  }

  const sections = Array.from(fields.profileSectionEditor.querySelectorAll("[data-profile-section]"));
  for (const sectionEl of sections) {
    const completion = getSectionCompletion(sectionEl);
    const text = `${completion.filled}/${completion.total}`;
    const state = getCompletionState(completion);

    sectionEl.querySelectorAll("[data-completion-badge]").forEach((badge) => {
      updateCompletionBadge(badge, text, state);
    });

    const navBadge = fields.profileNav?.querySelector(`[data-profile-nav="${CSS.escape(sectionEl.dataset.profileSection || "")}"] [data-completion-badge]`);
    if (navBadge) {
      updateCompletionBadge(navBadge, text, state);
    }
  }
}

function getSectionCompletion(sectionEl) {
  const controls = Array.from(sectionEl.querySelectorAll("[data-field-label]"));
  const customRows = Array.from(sectionEl.querySelectorAll("[data-custom-row]"));
  const total = controls.length + customRows.length;
  const filled = controls.filter((control) => String(control.value || "").trim() !== "").length
    + customRows.filter((row) => {
      const label = String(row.querySelector("[data-custom-label]")?.value || "").trim();
      const value = String(row.querySelector("[data-custom-value]")?.value || "").trim();
      return label !== "" && value !== "";
    }).length;

  return { filled, total };
}

function getCompletionState(completion) {
  if (!completion.total) {
    return "empty";
  }
  const ratio = completion.filled / completion.total;
  if (ratio >= 0.8) {
    return "good";
  }
  if (ratio >= 0.35) {
    return "partial";
  }
  return "empty";
}

function updateCompletionBadge(badge, text, state) {
  badge.textContent = text;
  badge.classList.toggle("is-good", state === "good");
  badge.classList.toggle("is-partial", state === "partial");
  badge.classList.toggle("is-empty", state === "empty");
}

function collectMarkdownFromSectionEditor() {
  const lines = [
    "# 简历资料小抄",
    "",
    "> 本文件只保存在本机。设置页用结构化表单填写，保存时自动转换为 Markdown，侧边栏和一键填写都会读取这份内容。",
    ""
  ];

  fields.profileSectionEditor.querySelectorAll("[data-profile-section]").forEach((section) => {
    const title = section.dataset.sectionTitle || "";
    const body = collectStructuredSectionMarkdown(section).trim();
    if (!title || !body) {
      return;
    }
    lines.push(`## ${title}`, body, "");
  });

  return `${lines.join("\n").replace(/\n{3,}/g, "\n\n").trim()}\n`;
}

function collectStructuredSectionMarkdown(sectionEl) {
  const section = getStructuredSectionConfig(sectionEl.dataset.profileSection || "");
  if (section?.kind === "repeat") {
    const blocks = [];
    sectionEl.querySelectorAll("[data-structured-item]").forEach((itemEl, index) => {
      const title = normalizePlainText(itemEl.querySelector("[data-item-title]")?.value || `${section.itemLabel || section.title} ${index + 1}`, 120);
      const lines = collectStructuredFieldsFromScope(itemEl);
      if (lines.length > 0) {
        blocks.push([`### ${title}`, ...lines].join("\n"));
      }
    });
    return blocks.join("\n\n");
  }

  return collectStructuredFieldsFromScope(sectionEl).join("\n");
}

function collectStructuredFieldsFromScope(scope) {
  const lines = [];
  scope.querySelectorAll("[data-field-label]").forEach((control) => {
    const label = control.dataset.fieldLabel || "";
    const value = String(control.value || "").trim();
    if (label && value) {
      lines.push(`- ${label}：${value}`);
    }
  });

  scope.querySelectorAll("[data-custom-row]").forEach((row) => {
    const label = normalizePlainText(row.querySelector("[data-custom-label]")?.value || "", 80);
    const value = String(row.querySelector("[data-custom-value]")?.value || "").trim();
    if (label && value) {
      lines.push(`- ${label}：${value}`);
    }
  });

  return lines;
}

function handleProfileEditorClick(event) {
  const button = event.target.closest("button[data-action]");
  if (!button) {
    return;
  }

  const action = button.dataset.action;
  const sectionKey = button.dataset.section;

  if (action === "add-item" && sectionKey) {
    profileState = collectProfileFromEditor();
    const section = getSectionConfig(sectionKey);
    if (!section) {
      return;
    }
    profileState[sectionKey] = Array.isArray(profileState[sectionKey]) ? profileState[sectionKey] : [];
    profileState[sectionKey].push(createBlankArrayItem(sectionKey));
    renderProfileEditor(profileState);
    setStatus(`已添加一条 ${section.title}。`);
    return;
  }

  if (action === "remove-item" && sectionKey) {
    const index = Number(button.dataset.index);
    if (!Number.isFinite(index)) {
      return;
    }

    profileState = collectProfileFromEditor();
    const current = Array.isArray(profileState[sectionKey]) ? profileState[sectionKey] : [];
    current.splice(index, 1);
    profileState[sectionKey] = current;
    renderProfileEditor(profileState);
    setStatus(`已删除一条 ${getSectionConfig(sectionKey)?.title || sectionKey}。`);
    return;
  }

  if (action === "add-custom-field" && sectionKey) {
    profileState = collectProfileFromEditor();
    const list = ensureCustomFieldList(profileState, sectionKey);
    list.push(createBlankCustomField());
    renderProfileEditor(profileState);
    setStatus(`已添加一个${getSectionConfig(sectionKey)?.title || "资料"}自定义字段。`);
    return;
  }

  if (action === "remove-custom-field" && sectionKey) {
    const index = Number(button.dataset.index);
    if (!Number.isFinite(index)) {
      return;
    }

    profileState = collectProfileFromEditor();
    const list = ensureCustomFieldList(profileState, sectionKey);
    list.splice(index, 1);
    renderProfileEditor(profileState);
    setStatus("已删除自定义字段。");
  }
}

function renderProfileEditor(profile) {
  const html = PROFILE_SECTIONS.map((section) => renderSection(section, profile)).join("");
  fields.profileEditor.innerHTML = html;
}

function renderSection(section, profile) {
  if (section.key === "family") {
    return renderFamilySection(section, profile);
  }

  if (Array.isArray(section.fields) && section.key in profile && Array.isArray(profile[section.key])) {
    return renderArraySection(section, profile[section.key]);
  }

  return renderSimpleSection(section, getByPath(profile, section.key) || {}, getByPath(profile, `customFields.${section.key}`) || []);
}

function renderSimpleSection(section, data, customFields = []) {
  const fieldsHtml = section.fields.map((spec) => renderField(spec, `${section.key}.${spec.key}`, getByPath(data, spec.key))).join("");
  const customFieldsHtml = section.customFields ? renderCustomFields(section, customFields) : "";
  return `
    <section class="section" data-section="${escapeHtml(section.key)}">
      <div class="section-head">
        <div>
          <div class="section-title">${escapeHtml(section.title)}</div>
          <div class="section-note">${escapeHtml(section.note || "")}</div>
        </div>
      </div>
      <div class="field-grid ${section.columns || "cols-2"}">${fieldsHtml}</div>
      ${customFieldsHtml}
    </section>
  `;
}

function renderCustomFields(section, customFields) {
  const list = Array.isArray(customFields) ? customFields : [];
  const cards = list
    .map((item, index) => {
      const fieldsHtml = CUSTOM_FIELD_FIELDS.map((spec) => {
        const path = `customFields.${section.key}.${index}.${spec.key}`;
        return renderField(spec, path, getByPath(item, spec.key));
      }).join("");

      return `
        <article class="repeater-card custom-field-card">
          <div class="repeater-card-head">
            <div class="repeater-card-title">自定义字段 ${index + 1}</div>
            <div class="inline-actions">
              <button type="button" data-action="remove-custom-field" data-section="${escapeHtml(section.key)}" data-index="${index}">删除</button>
            </div>
          </div>
          <div class="field-grid cols-2">${fieldsHtml}</div>
        </article>
      `;
    })
    .join("");

  return `
    <div class="custom-fields">
      <div class="section-head subsection-head">
        <div>
          <div class="section-title">自定义字段</div>
          <div class="section-note">补充固定模板没有覆盖的信息，AI 会按字段名、备注和值去匹配网页表单。</div>
        </div>
        <div class="inline-actions">
          <button type="button" data-action="add-custom-field" data-section="${escapeHtml(section.key)}">+ 添加字段</button>
        </div>
      </div>
      ${
        cards
          ? `<div class="repeater">${cards}</div>`
          : '<div class="empty-note">还没有自定义字段。需要身份证号、微信号、证件有效期等信息时，可以点“+ 添加字段”。</div>'
      }
    </div>
  `;
}

function renderArraySection(section, items) {
  const list = items.length ? items : [createBlankArrayItem(section.key)];
  const cards = list
    .map((item, index) => {
      const fieldsHtml = section.fields.map((spec) => {
        const path = `${section.key}.${index}.${spec.key}`;
        return renderField(spec, path, getByPath(item, spec.key));
      }).join("");

      return `
        <article class="repeater-card" data-array-item="${escapeHtml(section.key)}" data-index="${index}">
          <div class="repeater-card-head">
            <div class="repeater-card-title">${escapeHtml(section.itemLabel || section.title)} ${index + 1}</div>
            <div class="inline-actions">
              <button type="button" data-action="remove-item" data-section="${escapeHtml(section.key)}" data-index="${index}">删除</button>
            </div>
          </div>
          <div class="field-grid ${section.columns || "cols-2"}">${fieldsHtml}</div>
        </article>
      `;
    })
    .join("");

  return `
    <section class="section" data-section="${escapeHtml(section.key)}">
      <div class="section-head">
        <div>
          <div class="section-title">${escapeHtml(section.title)}</div>
          <div class="section-note">${escapeHtml(section.note || "")}</div>
        </div>
        <div class="inline-actions">
          <button type="button" data-action="add-item" data-section="${escapeHtml(section.key)}">+ 添加</button>
        </div>
      </div>
      <div class="repeater">
        ${cards}
      </div>
    </section>
  `;
}

function renderFamilySection(section, profile) {
  const family = getByPath(profile, "family") || {};
  const cards = section.members
    .map((member) => {
      const memberData = getByPath(family, member.key) || {};
      const fieldsHtml = section.fields.map((spec) => renderField(spec, `family.${member.key}.${spec.key}`, getByPath(memberData, spec.key))).join("");
      return `
        <article class="repeater-card">
          <div class="repeater-card-head">
            <div class="repeater-card-title">${escapeHtml(member.title)}</div>
          </div>
          <div class="field-grid ${section.columns || "cols-2"}">${fieldsHtml}</div>
        </article>
      `;
    })
    .join("");

  return `
    <section class="section" data-section="${escapeHtml(section.key)}">
      <div class="section-head">
        <div>
          <div class="section-title">${escapeHtml(section.title)}</div>
          <div class="section-note">${escapeHtml(section.note || "")}</div>
        </div>
      </div>
      <div class="repeater">
        ${cards}
      </div>
    </section>
  `;
}

function renderField(spec, path, value) {
  const id = `profile_${path.replace(/[^a-zA-Z0-9_-]+/g, "_")}`;
  const spanClass = spec.span ? "field span-2" : "field";
  const labelClass = spec.required ? "field-label required" : "field-label";
  const valueText = value == null ? "" : String(value);
  const placeholder = escapeHtml(spec.placeholder || "");

  let control = "";
  if (spec.type === "textarea") {
    control = `<textarea id="${id}" data-profile-path="${escapeHtml(path)}" rows="${spec.rows || 4}" placeholder="${placeholder}">${escapeHtml(valueText)}</textarea>`;
  } else if (spec.type === "select") {
    const optionSource = spec.options || [];
    const optionsList = optionSource.some((option) => {
      const optionValue = typeof option === "string" ? option : option.value;
      return optionValue === "";
    })
      ? optionSource
      : ["", ...optionSource];

    const options = optionsList
      .map((option) => {
        const optionValue = typeof option === "string" ? option : option.value;
        const optionLabel = typeof option === "string" ? option : option.label;
        const selected = String(valueText) === String(optionValue) ? " selected" : "";
        return `<option value="${escapeHtml(optionValue || "")}"${selected}>${escapeHtml(optionLabel || optionValue || "")}</option>`;
      })
      .join("");
    control = `<select id="${id}" data-profile-path="${escapeHtml(path)}">${options}</select>`;
  } else {
    control = `<input id="${id}" data-profile-path="${escapeHtml(path)}" type="${escapeHtml(spec.type || "text")}" value="${escapeHtml(valueText)}" placeholder="${placeholder}" />`;
  }

  return `
    <div class="${spanClass}"${spec.span ? ' style="grid-column: 1 / -1;"' : ""}>
      <label class="${labelClass}" for="${id}">${escapeHtml(spec.label)}</label>
      ${control}
    </div>
  `;
}

function collectProfileFromEditor() {
  const profile = createEmptyProfile();
  const controls = fields.profileEditor.querySelectorAll("[data-profile-path]");

  controls.forEach((control) => {
    const path = control.dataset.profilePath;
    if (!path) {
      return;
    }

    let value = "";
    if (control instanceof HTMLSelectElement) {
      value = control.value;
    } else if (control instanceof HTMLTextAreaElement || control instanceof HTMLInputElement) {
      value = control.value;
    } else {
      value = control.textContent || "";
    }

    setByPath(profile, path, value);
  });

  return pruneProfile(profile);
}

function pruneProfile(profile) {
  const output = deepClone(profile);

  for (const section of ["education", "experiences", "campus", "certificates", "awards"]) {
    if (!Array.isArray(output[section])) {
      output[section] = [];
      continue;
    }

    output[section] = output[section]
      .map((item) => pruneObject(item))
      .filter((item) => !isEmptyObject(item));
  }

  output.basic = pruneObject(output.basic);
  output.family = {
    father: pruneObject(output.family?.father || {}),
    mother: pruneObject(output.family?.mother || {})
  };
  output.other = pruneObject(output.other);
  output.declarations = pruneObject(output.declarations);
  output.customFields = pruneCustomFields(output.customFields);

  return output;
}

function prepareProfileForRender(storedProfile) {
  const base = createEmptyProfile();
  const source = storedProfile && typeof storedProfile === "object" ? storedProfile : {};
  const merged = deepMerge(base, source);

  merged.basic = deepMerge(createEmptyProfile().basic, merged.basic);
  merged.family = {
    father: deepMerge(createEmptyFamilyMember("父亲"), merged.family?.father),
    mother: deepMerge(createEmptyFamilyMember("母亲"), merged.family?.mother)
  };
  merged.other = deepMerge(createEmptyProfile().other, merged.other);
  merged.declarations = deepMerge(createEmptyProfile().declarations, merged.declarations);
  merged.customFields = prepareCustomFieldsForRender(merged.customFields);

  for (const section of ["education", "experiences", "campus", "certificates", "awards"]) {
    if (!Array.isArray(merged[section]) || merged[section].length === 0) {
      merged[section] = [createBlankArrayItem(section)];
      continue;
    }

    merged[section] = merged[section].map((item) => deepMerge(createBlankArrayItem(section), item));
  }

  return merged;
}

function createEmptyProfile() {
  return {
    basic: {
      name: "",
      gender: "",
      birthDate: "",
      ethnicity: "",
      politicalStatus: "",
      nativePlace: "",
      hukou: "",
      currentAddress: "",
      heightCm: "",
      weightKg: "",
      email: "",
      phone: "",
      emergencyContactName: "",
      emergencyContactPhone: "",
      expectedAnnualSalaryWan: ""
    },
    education: [],
    experiences: [],
    campus: [],
    family: {
      father: createEmptyFamilyMember("父亲"),
      mother: createEmptyFamilyMember("母亲")
    },
    certificates: [],
    awards: [],
    customFields: {
      basic: []
    },
    other: {
      languageLevel: "",
      languageScore: "",
      hobbyCategory: "",
      hobbyDetail: "",
      selfEvaluation: "",
      source: "",
      hasDriverLicense: "",
      acceptsTransfer: ""
    },
    declarations: {
      relativesInCompany: "否",
      majorDisease: "否",
      outsideEmploymentOrEquity: "否",
      badRecord: "否",
      overseasResidency: "否"
    }
  };
}

function createBlankCustomField() {
  return {
    label: "",
    key: "",
    value: "",
    note: ""
  };
}

function ensureCustomFieldList(profile, sectionKey) {
  if (!profile.customFields || typeof profile.customFields !== "object") {
    profile.customFields = {};
  }
  if (!Array.isArray(profile.customFields[sectionKey])) {
    profile.customFields[sectionKey] = [];
  }
  return profile.customFields[sectionKey];
}

function prepareCustomFieldsForRender(customFields) {
  const result = {};
  for (const sectionKey of CUSTOM_FIELD_SECTION_KEYS) {
    const list = Array.isArray(customFields?.[sectionKey]) ? customFields[sectionKey] : [];
    result[sectionKey] = list.map((item) => deepMerge(createBlankCustomField(), item));
  }
  return result;
}

function pruneCustomFields(customFields) {
  const result = {};
  for (const sectionKey of CUSTOM_FIELD_SECTION_KEYS) {
    const list = Array.isArray(customFields?.[sectionKey]) ? customFields[sectionKey] : [];
    const pruned = list
      .map((item) => pruneObject(item))
      .filter((item) => !isEmptyObject(item));
    if (pruned.length > 0) {
      result[sectionKey] = pruned;
    }
  }
  return result;
}

function createEmptyFamilyMember(role) {
  return {
    relationship: role,
    name: "",
    birthDate: "",
    gender: role === "父亲" ? "男" : "女",
    politicalStatus: "",
    educationLevel: "",
    employer: "",
    title: "",
    phone: "",
    note: ""
  };
}

function createBlankArrayItem(sectionKey) {
  const section = getSectionConfig(sectionKey);
  const item = {};
  for (const field of section?.fields || []) {
    item[field.key] = field.defaultValue ?? "";
  }
  return item;
}

function getSectionConfig(sectionKey) {
  return PROFILE_SECTIONS.find((section) => section.key === sectionKey);
}

function validateJsonObject(text, label) {
  if (!text.trim()) {
    return;
  }

  const parsed = JSON.parse(text);
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error(`${label} 必须是 JSON 对象。`);
  }
}

function extractProfileFromImportedData(parsed) {
  if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
    if (parsed.profile && typeof parsed.profile === "object") {
      return parsed.profile;
    }

    if (parsed.basic || parsed.education || parsed.family || parsed.declarations || parsed.customFields) {
      return parsed;
    }
  }

  throw new Error("导入文件必须是资料对象，或包含 profile 字段的 JSON。");
}

function getProfileMarkdownFromSettings(settings) {
  if (typeof settings?.profileMarkdown === "string" && settings.profileMarkdown.trim()) {
    return settings.profileMarkdown;
  }

  return profileToMarkdown(settings?.profile || createEmptyProfile());
}

function parseImportedProfileText(text, fileName = "") {
  const trimmed = String(text || "").trim();
  if (!trimmed) {
    throw new Error("导入文件是空的。");
  }

  const looksLikeJson = /\.json$/i.test(fileName) || /^[\[{]/.test(trimmed);
  if (looksLikeJson) {
    const parsed = JSON.parse(trimmed);
    if (typeof parsed.profileMarkdown === "string") {
      return { profileMarkdown: parsed.profileMarkdown };
    }

    const profile = extractProfileFromImportedData(parsed);
    return {
      profile,
      profileMarkdown: profileToMarkdown(profile)
    };
  }

  return { profileMarkdown: text };
}

function profileToMarkdown(profile) {
  const source = isPlainObject(profile) ? profile : {};
  const lines = [
    "# 简历资料小抄",
    "",
    "> 本文件只保存在本机。按 `## 大类` 和 `- 字段：值` 追加内容，侧边栏会自动按大类展示。",
    ""
  ];

  addMarkdownSimpleSection(lines, "基本信息", source.basic || {}, BASIC_FIELDS.map(fieldSpecToMarkdownDef));
  addMarkdownRepeatedSection(lines, "教育经历", source.education, EDUCATION_FIELDS.map(fieldSpecToMarkdownDef), "教育经历");
  const splitExperience = splitMarkdownExperienceItems(source.experiences);
  addMarkdownRepeatedSection(lines, "实习经历", splitExperience.internships, EXPERIENCE_FIELDS.map(fieldSpecToMarkdownDef), "实习经历");
  addMarkdownRepeatedSection(lines, "项目经历", splitExperience.projects, EXPERIENCE_FIELDS.map(fieldSpecToMarkdownDef), "项目经历");
  addMarkdownRepeatedSection(lines, "社团工作", source.campus, CAMPUS_FIELDS.map(fieldSpecToMarkdownDef), "社团工作");
  addMarkdownFamilySection(lines, source.family || {});
  addMarkdownRepeatedSection(lines, "证书技能", source.certificates, CERTIFICATE_FIELDS.map(fieldSpecToMarkdownDef), "证书");
  addMarkdownRepeatedSection(lines, "奖惩情况", source.awards, AWARD_FIELDS.map(fieldSpecToMarkdownDef), "奖惩");
  addMarkdownSimpleSection(lines, "其他信息", source.other || {}, OTHER_FIELDS.map(fieldSpecToMarkdownDef));
  addMarkdownSimpleSection(lines, "有关声明", source.declarations || {}, DECLARATION_FIELDS.map(fieldSpecToMarkdownDef));
  addMarkdownCustomFields(lines, source.customFields);

  return `${lines.join("\n").replace(/\n{3,}/g, "\n\n").trim()}\n`;
}

function fieldSpecToMarkdownDef(spec) {
  return [spec.key, spec.label];
}

function addMarkdownSimpleSection(lines, title, data, defs) {
  lines.push(`## ${title}`);
  for (const [key, label] of defs) {
    lines.push(`- ${label}：${formatMarkdownValue(data?.[key])}`);
  }
  lines.push("");
}

function addMarkdownRepeatedSection(lines, title, items, defs, itemLabel) {
  lines.push(`## ${title}`);
  const list = Array.isArray(items) && items.length > 0 ? items : [{}];
  list.forEach((item, index) => {
    if (list.length > 1 || !isEmptyMarkdownObject(item)) {
      lines.push(`### ${itemLabel} ${index + 1}`);
    }
    for (const [key, label] of defs) {
      lines.push(`- ${label}：${formatMarkdownValue(item?.[key])}`);
    }
    lines.push("");
  });
}

function addMarkdownFamilySection(lines, family) {
  lines.push("## 家庭信息");
  for (const [key, title] of [
    ["father", "父亲"],
    ["mother", "母亲"]
  ]) {
    lines.push(`### ${title}`);
    const member = family?.[key] || {};
    for (const spec of FAMILY_MEMBER_FIELDS) {
      lines.push(`- ${spec.label}：${formatMarkdownValue(member[spec.key])}`);
    }
    lines.push("");
  }
}

function splitMarkdownExperienceItems(items) {
  const list = Array.isArray(items) ? items : [];
  const projects = [];
  const internships = [];

  for (const item of list) {
    const organization = String(item?.organization || "");
    const role = String(item?.role || "");
    const looksLikeProject = /项目|作品|系统|平台|Agent|RAG|后台|助手/i.test(`${organization} ${role}`);
    if (looksLikeProject && !/公司|集团|银行|证券|科技|有限|中心|研究院/.test(organization)) {
      projects.push(item);
    } else {
      internships.push(item);
    }
  }

  return { internships, projects };
}

function addMarkdownCustomFields(lines, customFields) {
  const basicFields = Array.isArray(customFields?.basic) ? customFields.basic : [];
  if (basicFields.length === 0) {
    return;
  }

  lines.push("## 自定义资料");
  for (const item of basicFields) {
    const label = item?.label || item?.key || "自定义字段";
    lines.push(`- ${label}：${formatMarkdownValue(item?.value)}`);
    if (item?.note) {
      lines.push(`  备注：${formatMarkdownValue(item.note)}`);
    }
  }
  lines.push("");
}

function formatMarkdownValue(value) {
  if (value == null) {
    return "";
  }

  if (typeof value === "object") {
    return JSON.stringify(value);
  }

  return String(value).replace(/\s*\n+\s*/g, " ").trim();
}

function isEmptyMarkdownObject(value) {
  if (!isPlainObject(value)) {
    return true;
  }

  return Object.values(value).every((child) => child == null || String(child).trim() === "");
}

function updateModeBlocks() {
  const mode = fields.apiMode.value;
  document.querySelectorAll(".mode-block").forEach((block) => {
    block.hidden = block.dataset.mode !== mode;
  });
}

function setStatus(message, isError = false) {
  fields.status.textContent = message;
  fields.status.classList.toggle("error", isError);
}

function setInlineFeedback(message, isError = false) {
  if (!fields.apiFeedback) {
    return;
  }

  fields.apiFeedback.textContent = message;
  fields.apiFeedback.classList.toggle("error", isError);
}

function setApiPreview(message) {
  if (!fields.apiPreviewBox || !fields.apiPreview) {
    return;
  }

  const text = String(message || "").trim();
  fields.apiPreviewBox.hidden = !text;
  fields.apiPreview.textContent = text;
}

function formatConnectionPreview(result) {
  const parts = [];
  if (result?.parsed !== undefined) {
    parts.push(`解析结果:\n${JSON.stringify(result.parsed, null, 2).slice(0, 3000)}`);
  }
  if (result?.contentPreview) {
    parts.push(`原始响应预览:\n${String(result.contentPreview).slice(0, 3000)}`);
  }
  return parts.join("\n\n") || "连接正常，但接口没有返回可预览内容。";
}

function sendRuntimeMessage(message) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(message, (response) => {
      const error = chrome.runtime.lastError;
      if (error) {
        reject(new Error(error.message));
        return;
      }
      if (!response?.ok) {
        reject(new Error(response?.error || "Runtime message failed."));
        return;
      }
      resolve(response.data);
    });
  });
}

function deriveModelListUrl(sourceUrl) {
  if (!sourceUrl) {
    return "";
  }

  try {
    const url = new URL(sourceUrl);
    if (url.pathname.endsWith("/chat/completions")) {
      url.pathname = url.pathname.replace(/\/chat\/completions$/, "/models");
      return url.toString();
    }
    if (url.pathname.endsWith("/completions")) {
      url.pathname = url.pathname.replace(/\/completions$/, "/models");
      return url.toString();
    }
    if (url.pathname.endsWith("/responses")) {
      url.pathname = url.pathname.replace(/\/responses$/, "/models");
      return url.toString();
    }
    if (!url.pathname || url.pathname === "/") {
      url.pathname = "/models";
      return url.toString();
    }
  } catch {
    return "";
  }

  return "";
}

function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

function isPlainObject(value) {
  return Object.prototype.toString.call(value) === "[object Object]";
}

function deepMerge(target, source) {
  if (Array.isArray(target)) {
    if (!Array.isArray(source)) {
      return deepClone(target);
    }
    return source.map((item, index) => {
      const template = target[index] ?? target[0] ?? {};
      return deepMerge(template, item);
    });
  }

  if (isPlainObject(target)) {
    const result = deepClone(target);
    if (!isPlainObject(source)) {
      return result;
    }

    for (const [key, value] of Object.entries(source)) {
      if (Array.isArray(value)) {
        result[key] = deepMerge(Array.isArray(result[key]) ? result[key] : [], value);
      } else if (isPlainObject(value)) {
        result[key] = deepMerge(isPlainObject(result[key]) ? result[key] : {}, value);
      } else if (value !== undefined) {
        result[key] = value;
      }
    }
    return result;
  }

  return source === undefined ? deepClone(target) : source;
}

function setByPath(object, path, value) {
  const parts = String(path)
    .replace(/\[(\d+)\]/g, ".$1")
    .split(".")
    .filter(Boolean);

  let current = object;
  for (let i = 0; i < parts.length; i += 1) {
    const part = parts[i];
    const last = i === parts.length - 1;
    const nextPart = parts[i + 1];
    const isIndex = /^\d+$/.test(part);

    if (last) {
      if (isIndex) {
        current[Number(part)] = value;
      } else {
        current[part] = value;
      }
      return;
    }

    if (isIndex) {
      const index = Number(part);
      if (!Array.isArray(current)) {
        return;
      }
      if (current[index] == null) {
        current[index] = /^\d+$/.test(nextPart) ? [] : {};
      }
      current = current[index];
      continue;
    }

    if (current[part] == null) {
      current[part] = /^\d+$/.test(nextPart) ? [] : {};
    }
    current = current[part];
  }
}

function getByPath(object, path) {
  if (!object || !path) {
    return undefined;
  }

  const parts = String(path)
    .replace(/\[(\d+)\]/g, ".$1")
    .split(".")
    .filter(Boolean);

  let current = object;
  for (const part of parts) {
    if (current == null) {
      return undefined;
    }
    current = current[part];
  }
  return current;
}

function pruneObject(value) {
  if (Array.isArray(value)) {
    return value.map((item) => pruneObject(item)).filter((item) => !isEmptyObject(item));
  }

  if (!isPlainObject(value)) {
    return value;
  }

  const result = {};
  for (const [key, child] of Object.entries(value)) {
    if (Array.isArray(child)) {
      const prunedArray = child.map((item) => pruneObject(item)).filter((item) => !isEmptyObject(item));
      if (prunedArray.length > 0) {
        result[key] = prunedArray;
      }
      continue;
    }

    if (isPlainObject(child)) {
      const pruned = pruneObject(child);
      if (!isEmptyObject(pruned)) {
        result[key] = pruned;
      }
      continue;
    }

    if (child !== "" && child != null) {
      result[key] = child;
    }
  }
  return result;
}

function isEmptyObject(value) {
  if (Array.isArray(value)) {
    return value.length === 0;
  }
  if (!isPlainObject(value)) {
    return value === "" || value == null;
  }
  return Object.keys(value).length === 0;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
