# SF Dashboard Showcase / SF 试算展示

这是当前 SF 计算家族的只读保存快照，包含全部 **13 个真实节点**、各自祖先路径的原始迭代曲线，以及 **13 份节点交互流场和 1 份已验收原 30P30N 基准流场**。默认打开受保护的重要节点 12；最新节点 13 与其他分支仍可选择。保存状态与验收结论截至数据导出时刻 **2026-10-08 03:41:17（北京时间） / 2026-10-07T19:41:17Z**。

节点切换、曲线窗口、双图同步缩放与平移、绘图变量和共同色标范围均可交互。本页面不提供求解器控制；隐藏阶段只影响当前浏览器的绘图显示。展示包不含重启文件、求解器日志、机器清单或凭据。未验收诊断场与已验收数值基准保留各自来源与解释。

- [中文入口](https://ysrae1.github.io/aero-topology-dashboard/?lang=zh)
- [English version](https://ysrae1.github.io/aero-topology-dashboard/?lang=en)
- 数据来源与大小统计：`bundle-summary.json`。所有字体和绘图资源随包提供，不依赖 CDN。

本地查看：在本目录中启动静态服务，再打开 [本地入口](http://127.0.0.1:8000/?lang=zh)。

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

## English

This read-only snapshot contains all **13 real nodes** of the current SF run family, their original iteration histories along actual checkpoint ancestry, and **13 interactive node fields plus one accepted original 30P30N reference field**. Protected result **node 12** opens by default; node 13 and every other branch remain selectable. Run status and acceptance conclusions are current as of **2026-10-07T19:41:17Z**.

Node selection, plot windows, synchronized zoom and pan, field selection, and shared color ranges remain interactive. Solver controls are unavailable. Hiding a segment changes only its display in the current browser. The bundle contains no restart files, solver logs, machine manifests, or credentials. Unaccepted diagnostic fields and the accepted numerical reference retain distinct provenance and interpretation.

Use the language links above, or append `?lang=en` / `?lang=zh` to the page URL. For local viewing, run the command above from this directory and open [the local English page](http://127.0.0.1:8000/?lang=en). `bundle-summary.json` records sources, counts, missing fields, and sizes. Fonts and visualization assets are bundled locally; no CDN is required.
