# SU2 CFD Dashboard / SU2 CFD 结果展示

这是面向 **SU2 CFD 保存结果的前端展示页**。公开版本是静态只读快照，保留原有 SF、30P30N L1/L3 历史，并新增两条 DS 流程。共 **5 个任务、33 个真实节点**：27 个气动计算节点、6 个纯网格节点。纯网格节点没有流场、残差或气动力结果。默认打开重要 SF 保存节点（原第 12 节点），其他节点可从近期计算和流程历程选择。

| 任务 | 节点数 | 内容 |
| --- | ---: | --- |
| SF 保存计算 | 13 | 原始分支、续算与重要保存节点 |
| 原 30P30N · L1 | 2 | 原始基准计算 |
| 原 30P30N · L3 | 7 | 原始基准与数值检查 |
| DS · 网格调整与数值收敛 | 9 | 10:13 起五版网格 → 11:16 起四段 SA 计算；几何缺陷归档 |
| DS · 修改构型 · 网格变形与 SA 二阶 | 2 | 12:26 变形网格预览 → 12:28 SA 二阶；几何缺陷归档 |

上述时间均为 **2026-10-08 中国标准时间（UTC+8）**。两条 DS 流程均存在后续确认的**前缘几何闭合采样缺陷**，放在“失败案例”并在页面顶部说明原因。网格调整和部分保存场通过的数值收敛检查仍真实保留；这不代表目标几何已经合格，相关气动力不能用作有效构型比较。网格输入连线表示工作流程来源，不表示继承了该网格节点的 CFD 检查点。

新 DS 节点与其参考视图支持“仅网格”，显示真实三角形／四边形单元边，不添加四边形显示对角线。原 22 个历史节点的曲线及保存场保留；其旧版显示文件没有原始单元边，无法在这些旧文件上还原真实网格。各节点的保存时间、检查点来源及数值状态见页面和 `bundle-summary.json`。数值通过、几何合格、网格独立性和物理验证分别评价。

节点切换、独立曲线窗口、双图同步缩放与平移、触控缩放、绘图变量和共同色标均可交互。公开页未连接求解器；计算控制和节点修改入口保留外观但不可执行，隐藏只影响当前浏览器。展示包不含重启文件、求解器日志、机器清单或凭据。当前页面适配已整理的 SU2 数据；导入其他工程需要对应的数据导出与来源映射。

- [中文入口](https://ysrae1.github.io/su2-cfd-dashboard/?lang=zh)
- [English version](https://ysrae1.github.io/su2-cfd-dashboard/?lang=en)
- 数据来源、导出时间、节点清单与体积统计：`bundle-summary.json`。字体和绘图资源随包提供，不依赖 CDN。

本地查看：在本目录启动静态服务，再打开 [本地入口](http://127.0.0.1:8000/?lang=zh)。

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

## English

This frontend displays **saved SU2 CFD results** as a static, read-only snapshot. It retains the original SF and 30P30N L1/L3 histories and adds two DS workflows: **five tasks and 33 real nodes**, comprising 27 calculation nodes and six mesh-only nodes. Mesh-only nodes contain no computed flow, residuals or forces. The important saved SF node (original node 12) remains the default.

The DS mesh-adjustment workflow contains five mesh revisions followed by four SA calculation stages. The modified-DS workflow contains its deformed-mesh preview and second-order SA calculation. Their respective start times were 10:13/11:16 and 12:26/12:28 on 8 October 2026, China Standard Time (UTC+8).

**Both historical DS workflows contain a confirmed leading-edge closure sampling defect.** They are archived under Failed Cases, with the reason visible at the top of each node. Successful numerical convergence checks remain available as recorded evidence of the computational process; they do not qualify the intended geometry or support a valid aerodynamic configuration comparison. Mesh-input edges describe workflow provenance, not CFD restart inheritance.

New DS nodes and their reference view support mesh-only display using original triangle/quad cell edges. The original 22 historical node fields and curves are preserved; their older display files lack original cell edges and cannot reconstruct the true mesh. Node provenance, saved times, raw numerical status and export details remain traceable. Numerical convergence, geometry qualification, grid independence and physical validation are distinct.

Node selection, plot windows, synchronized zoom/pan, touch zoom, field selection and shared color ranges remain interactive. Run controls and node edits are visible but disabled because the public page is not connected to a solver. Hiding affects only the current browser. No restart files, solver logs, machine manifests or credentials are included. Other SU2 projects require a corresponding data export and provenance mapping.

Use the language links above. For local viewing, run the command above and open [the local English page](http://127.0.0.1:8000/?lang=en). Fonts and visualization assets are bundled; no CDN is required.
