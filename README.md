# SU2 CFD Dashboard / SU2 CFD 结果展示

这是面向 **SU2 CFD 保存结果的前端展示页**。公开版本是静态只读快照，包含 **3 个计算任务、22 个真实节点、22 份节点交互流场和 1 份原 30P30N 基准流场**。各任务保留真实父子关系、检查点来源和所选节点的原始祖先路径曲线；近期计算侧栏可切换任务。默认打开受保护的重要节点 12；SF 最新节点 13 与其他分支仍可选择。

| 任务 | 节点数 | 代表节点 |
| --- | ---: | --- |
| SF 试算 | 13 | 默认重要节点 12 |
| 原 30P30N · L1 | 2 | `l1_4w_cfl50_restart` |
| 原 30P30N · L3 | 7 | `feas_l3_common_linear01` |

SF 数据导出于 **2026-10-07T19:41:17Z**，两项历史任务追加导出于 **2026-10-07T20:34:30Z**。各节点保留各自保存时间。L3 基准保留原登记验收身份；其任务页面同时保留当前附加 1250 步检查未通过的真实状态，两种检查并不等同。L1 与 L3 使用各自原始基准网格记录，没有沿用 SF 后翼片变形参数。

节点切换、曲线窗口、双图同步缩放与平移、双指触控缩放、绘图变量和共同色标范围均可交互。公开页未连接求解器，计算控制和节点修改按钮保留为不可用状态，原因统一显示在页首；隐藏阶段只影响当前浏览器的绘图显示。展示包不含重启文件、求解器日志、机器清单或凭据。未验收诊断场与已验收数值基准保留各自来源与解释。当前包展示已整理的保存结果；导入其他 SU2 工程需要对应的数据导出与来源映射。

- [中文入口](https://ysrae1.github.io/su2-cfd-dashboard/?lang=zh)
- [English version](https://ysrae1.github.io/su2-cfd-dashboard/?lang=en)
- 数据来源与大小统计：`bundle-summary.json`。所有字体和绘图资源随包提供，不依赖 CDN。

本地查看：在本目录中启动静态服务，再打开 [本地入口](http://127.0.0.1:8000/?lang=zh)。

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

## English

This frontend presents **saved SU2 CFD results**. The public page is a static, read-only snapshot with **three tasks, 22 real nodes, 22 interactive node fields, and one original 30P30N reference field**. Each task retains its actual parent relationships, checkpoint provenance, and original histories along the selected node’s ancestry. Select a task from Recent: the 13-node SF pilot, the 2-node original 30P30N L1 task (`l1_4w_cfl50_restart`), or the 7-node original 30P30N L3 task (`feas_l3_common_linear01`). Protected SF result **node 12** opens by default; SF node 13 and every branch remain selectable.

The SF data were exported at **2026-10-07T19:41:17Z**; the two historical tasks were appended at **2026-10-07T20:34:30Z**. Each node retains its own saved-field timestamp. The L3 reference retains its original registered acceptance, while its task page also preserves the failed additional 1250-iteration check. These are distinct criteria. The L1 and L3 tasks retain their original benchmark mesh records, without the SF flap-deformation parameters.

Node selection, plot windows, synchronized zoom and pan, touch zoom, field selection, and shared color ranges remain interactive. The public page is not connected to a solver. Run controls and node-edit options are visible but disabled; the page header explains why. Hiding a segment changes only its display in the current browser. The bundle contains no restart files, solver logs, machine manifests, or credentials. Unaccepted diagnostic fields and the accepted numerical reference retain distinct provenance and interpretation. This bundle presents curated saved results; using another SU2 case requires matching data export and provenance mapping.

Use the language links above, or append `?lang=en` / `?lang=zh` to the page URL. For local viewing, run the command above from this directory and open [the local English page](http://127.0.0.1:8000/?lang=en). `bundle-summary.json` records sources, counts, missing fields, and sizes. Fonts and visualization assets are bundled locally; no CDN is required.
