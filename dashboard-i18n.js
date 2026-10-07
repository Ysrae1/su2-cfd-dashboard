/* Complete, reversible presentation translation. Numerical data and option
 * values are never edited; Chinese remains the source language of the page. */
(() => {
  'use strict';
  const han = /[\u3400-\u9fff]/;
  const exact = new Map(Object.entries({
    'SF 实时迭代':'SF Live Iteration',
    'SF 试算 · 实时迭代':'SF Pilot · Live Iteration',
    'SF 试算 · 展示快照':'SF Pilot · Saved Snapshot',
    'SF 试算 · 只读展示快照':'SF Pilot · Read-only Snapshot',
    '近期计算':'Recent', '收起计算':'Close Recent', '返回当前计算':'Current Run',
    '返回最新节点':'Latest Node', '开题前的可行性验证':'Pre-proposal Feasibility',
    '计算历程':'Run History', '计算控制':'Run Controls',
    '计算设置与概览':'Settings & Overview', '通用运行设置':'Runtime Settings',
    '关键参数迭代':'Convergence', '流场对照':'Flow Comparison',
    '计算稳定性检查':'Stability', '当前计算的观察窗口':'Current Run Windows',
    '开始':'Start', '暂停':'Pause', '恢复':'Resume', '直接续算':'Continue',
    '改设置续算':'Adjust & Continue', '重新计算':'Restart', '续算':'Continue',
    '新建分支 · 直接续算':'New Branch', '新建分支 · 改设置续算':'Adjust & Branch',
    '从此节点新建分支':'New Branch', '创建并开始分支':'Start Branch',
    '按新设置续算':'Continue with Changes', '取消':'Cancel',
    'CFL 上限':'CFL Limit', '计算格式':'Discretization', '流动重构阶数':'Flow Reconstruction',
    '空间离散':'Spatial Discretization', '流动更新松弛系数':'Flow Relaxation',
    '一阶诊断':'First Order', '一阶':'First Order',
    '二阶':'Second Order', '原二阶':'Original Second Order',
    '原生自动停止':'Native Auto-stop', 'SU2 原生停止判据':'SU2 Native Stopping Rule',
    '开启':'On', '关闭':'Off', '开启：满足原生判据自动停止':'On: Stop on Native Criteria',
    '关闭：不按原生判据停止':'Off: Ignore Native Criteria',
    '时间上限（分钟）':'Time Limit (min)', '保存默认':'Save Default', '应用到当前':'Apply to Run',
    '稳定性自动停止':'Stability Auto-stop', '开启稳定性自动停止':'Enable Auto-stop',
    '关闭稳定性自动停止':'Disable Auto-stop', '当前迭代步':'Current Iteration',
    '本次续算的步数':'Iterations in this Segment', '已用试算时间':'Elapsed Run Time',
    '实际 CFL':'Actual CFL', '原 30P30N 与当前迭代值':'Original 30P30N vs. Current Values',
    '构型 / 状态':'Configuration / Status', '原 30P30N · 已验收二阶 CFD':'Original 30P30N · Accepted Second-order CFD',
    '当前模型 · 迭代过程值':'Current Model · Iteration Values',
    '当前模型的改动':'Model Changes', '当前 SF · 后翼片改动':'Current SF · Flap Changes',
    '原 30P30N':'Original 30P30N', '当前模型':'Current Model',
    '原 30P30N · 本项目二阶 CFD 基准':'Original 30P30N · Project CFD Reference',
    '全部迭代':'All', '显示步数':'Window Size', '升力系数 CL':'Lift Coefficient CL',
    '阻力系数 CD':'Drag Coefficient CD', '残差（log₁₀）':'Residuals (log₁₀)',
    '密度':'Density', '湍流变量':'Turbulence Variable', '压力':'Pressure',
    '温度':'Temperature', '速度模':'Speed', '无量纲':'Dimensionless',
    '文件原值':'Native File Units', '密度残差':'Density Residual', '湍流残差':'Turbulence Residual',
    'log₁₀ 残差':'log₁₀ Residual', '累计记录步':'Cumulative Recorded Iteration',
    'ΔCL（对数刻度）':'ΔCL (log scale)', 'ΔCD（对数刻度）':'ΔCD (log scale)',
    '升力峰峰变化 ΔCL':'Lift Range ΔCL', '阻力峰峰变化 ΔCD':'Drag Range ΔCD',
    '250 步窗口':'250-iteration Window', '1250 步窗口':'1250-iteration Window',
    '250 步峰峰变化':'250-iteration Range', '1250 步峰峰变化':'1250-iteration Range',
    'CL 峰峰变化':'CL Range', 'CD 峰峰变化':'CD Range', '观察区间':'Window',
    '状态':'Status', '下限':'Min', '上限':'Max', '两图复位':'Reset Views',
    '应用色标':'Apply Range', '上下限恢复默认':'Reset Range', '共同色标':'Shared Range',
    '上图 · 原 30P30N · 已验收二阶流场':'Top · Original 30P30N · Accepted Second-order Field',
    '下图 · 当前模型 · 最新已保存流场':'Bottom · Current Model · Latest Saved Field',
    '下图 · 所选计算 · 最新已保存流场':'Bottom · Selected Run · Latest Saved Field',
    '在任一图中滚轮缩放、拖动平移，两图同步':'Scroll to zoom and drag to pan in either view; both views stay synchronized.',
    '在任一网格图中滚轮缩放、拖动平移，两图同步':'Scroll to zoom and drag to pan in either mesh view; both views stay synchronized.',
    '原始构型参考与当前模型改动':'Original Reference and Model Changes',
    '所选计算任务的历程':'Selected Run History', '计算段节点':'Run Segment Nodes',
    '近期计算导航':'Recent Run Navigation', '选择计算任务':'Select a Run',
    '收起计算历程':'Collapse History', '展开计算历程':'Expand History',
    '展开计算分支':'Expand Branches', '收起计算分支':'Collapse Branches',
    '阶段操作':'Node Actions', '隐藏此阶段':'Hide Segment', '显示此阶段':'Show Segment',
    '保护此节点':'Protect Node', '取消保护':'Remove Protection', '删除此阶段（归档）':'Archive Segment',
    '重要结果 · 已保护':'Important Result · Protected', '重要结果 · 受保护':'Important Result · Protected',
    '重要结果 · 受保护，不能删除':'Important result: protected from deletion.',
    '数值设置沿用':'Numerical settings inherited.', '数值设置变化：':'Numerical changes:',
    '设置变更':'Settings Changed', '初算':'Initial Run', '计算段':'Run Segment',
    '操作未记录':'Operation Not Recorded', '所选计算':'Selected Run',
    'SF 试算':'SF Pilot', 'DS 试算':'DS Pilot', '计算任务':'Run',
    '运行中':'Running', '计算中':'Running', '已暂停':'Paused', '待开始':'Ready',
    '正在启动':'Starting', '启动中':'Starting', '正在停止':'Stopping',
    '已结束':'Ended', '已停止':'Stopped', '计算已停止':'Run stopped', '执行失败':'Failed',
    '超时结束':'Time Limit Reached', '数值发散':'Numerical Divergence',
    '正常退出':'Normal exit', '达到时间上限':'Time limit reached', '达到内存上限':'Memory limit reached',
    '诊断提前结束':'Diagnostic run stopped early', '状态待核对':'Status Unconfirmed',
    '状态未记录':'Status Not Recorded', '当前计算':'Current Run',
    '未记录':'Not Recorded', '读取中':'Loading', '选项':'Options', '选择':'Select',
    '等待计算记录':'Waiting for run data', '等待算例记录':'Waiting for case data',
    '正在读取计算记录…':'Loading run data…', '正在读取诊断算例与控制参数…':'Loading the diagnostic case and run settings…',
    '正在连接…':'Connecting…', '每 2 秒更新':'Updates every 2 s',
    '原生自动停止：读取中':'Native auto-stop: loading', '正在读取通用时间设置…':'Loading time limits…',
    '正在读取停止规则…':'Loading stopping criteria…', '正在读取试算时间上限':'Loading the run time limit',
    '正在读取内存记录':'Loading memory samples', '暂无有效内存采样':'No valid memory samples',
    '正在读取参考工况…':'Loading reference conditions…', '正在读取几何改动记录…':'Loading geometry changes…',
    '正在读取迭代记录…':'Loading iteration history…', '等待更多迭代数据':'Waiting for more iterations',
    '等待足够步数':'Insufficient Iterations', '待检查':'Pending', '窗口达标':'Window Passed',
    '窗口未达标':'Window Not Passed', '暂无近期计算记录':'No recent runs',
    '正在读取所选计算…':'Loading the selected run…', '正在读取所选节点…':'Loading the selected node…',
    '正在读取所选计算的已保存流场…':'Loading the selected run’s saved field…',
    '正在读取所选计算流场…':'Loading the selected run’s field…',
    '等待原始构型流场记录':'Waiting for the original geometry’s saved field',
    '等待已保存流场记录':'Waiting for a saved field', '正在加载原 30P30N 的已保存流场…':'Loading the original 30P30N saved field…',
    '等待已保存流场，或正在渲染最新快照…':'Waiting for a saved field or rendering the latest snapshot…',
    '等待快照算例记录':'Waiting for snapshot provenance', '快照步数未记录':'Snapshot iteration not recorded',
    '正在加载实际网格…':'Loading the original mesh…', '等待实际网格数据。':'Waiting for mesh data.',
    '网格快照加载失败，等待新的快照。':'The mesh snapshot could not be loaded. Waiting for a new snapshot.',
    '正在加载流场网格；PNG 预览保留源色标':'Loading the mesh. The PNG preview retains its original color scale.',
    '所选参数需要交互网格；PNG 预览仅支持 Mach':'This field requires the interactive mesh. PNG previews are available only for Mach.',
    '正在加载下一张网格快照；当前显示上一张已加载快照。':'Loading the next mesh snapshot. The previously loaded snapshot is still displayed.',
    '新网格快照加载失败，保留上一张已加载快照。':'The new mesh snapshot could not be loaded. The previously loaded snapshot is retained.',
    '浏览器不支持 WebGL2；PNG 预览使用源色标，不能同步缩放或调整色标。':'WebGL2 is unavailable. The PNG preview uses its original scale and does not support synchronized navigation or color-range changes.',
    '请输入有限数值，并保证上限大于下限。':'Enter finite values with the maximum greater than the minimum.',
    '当前迭代指标全部达标':'All current iteration criteria passed',
    '已关闭':'Disabled', '已按稳定性条件自动停止':'Stopped automatically on stability criteria',
    '已开启；当前计算已结束，后续计算沿用':'Enabled; this run has ended. The setting is retained for subsequent runs.',
    '已开启；用户暂停期间不触发':'Enabled; inactive while the run is paused.',
    '已开启；等待峰峰变化与残差达标':'Enabled; waiting for force-range and residual criteria.',
    '窗口达标、文件完整且稳定':'window criteria passed; checkpoint complete and stable',
    '窗口达标，等待文件稳定':'window criteria passed; waiting for a stable checkpoint',
    '保存点窗口尚未达标':'checkpoint window criteria not yet passed',
    '峰峰变化或残差未达标':'Force-range or residual criteria not met',
    '等待完整保存点；不会仅凭当前瞬时值停止。':'Waiting for a complete checkpoint. Instantaneous values alone cannot trigger a stop.',
    '已暂停 · 保留当前进度':'Paused · Progress Saved',
    '数值稳定性达标 · 稳定性自动停止':'Numerically Stable · Auto-stopped',
    '数值稳定性达标 · 迭代上限结束':'Numerically Stable · Iteration Limit',
    '数值稳定性达标 · 计算已结束':'Numerically Stable · Ended',
    '数值稳定性达标 · 计算中':'Numerically Stable · Running',
    '计算中 · 等待验收':'Running · Acceptance Pending',
    '稳定性自动停止 · 待最终验收':'Auto-stopped · Final Acceptance Pending',
    '计算结束 · 已通过本次检查':'Ended · Checks Passed',
    '计算结束 · 未通过本次检查':'Ended · Checks Not Passed',
    '计算结束 · 正在验收':'Ended · Acceptance Pending',
    '正在执行计算控制…':'Applying the run action…',
    '参考计算记录尚不可用。':'Reference run data are not yet available.',
    '当前与参考的工况、物理模型及系数归一化一致。':'The current and reference cases use the same operating conditions, physical model, and coefficient normalization.',
    '当前与参考的工况或物理模型未确认一致。':'Matching operating conditions and physical models have not been confirmed.',
    '当前是一阶诊断，系数差异包含离散格式的影响。':'This is a first-order diagnostic. Differences in the coefficients also reflect the discretization scheme.',
    '数值稳定性条件已达标；气动比较的物理验证状态见验收记录。':'Numerical stability criteria have been met. Consult the acceptance record for the physical validation status of aerodynamic comparisons.',
    '当前是二阶续算，仍需检查数值稳定性与保存流场后再比较气动结果。':'This is a second-order continuation. Numerical stability and the saved field must be checked before comparing aerodynamic results.',
    '图线只显示所选节点沿真实检查点来源的来时路径；展开分支可切换节点。绘图窗口与隐藏操作不改变检查标准。':'The curves follow the selected node’s actual checkpoint ancestry. Expand the branches to select another node. Plot windows and hidden segments do not change the acceptance criteria.',
    '这些是计算过程值，尚不能作为已收敛的气动结果。':'These are iteration values, not yet converged aerodynamic results.',
    '当前系数仍不能作为已收敛的气动结果。':'The current coefficients cannot yet be treated as converged aerodynamic results.',
    '本次算例通过检查；不代表物理验证或其他构型已通过。':'This case passed the checks. This does not establish physical validation or acceptance of other configurations.',
    '本次按外部稳定性条件停止并保留已核对检查点；保存流场及质量守恒仍需最终验收。':'The external stability rule stopped this run and retained a verified checkpoint. The saved field and mass conservation still require final acceptance.',
    '当前为一阶诊断，恢复原二阶格式后才能判断目标算例是否收敛。':'This is a first-order diagnostic. Restore the original second-order scheme before assessing convergence of the target case.',
    '所选计算的已保存流场；是否通过验收以该任务记录为准。':'Saved field from the selected run. Its acceptance status is recorded in that run’s assessment.',
    '未验收快照的诊断展示；不能证明收敛或气动验证。':'Diagnostic view of an unqualified snapshot; not proof of convergence or aerodynamic validation',
    '已保存数值稳定流场；物理验证状态见该任务验收记录。':'Saved numerically stable field. See the run’s acceptance record for physical validation status.',
    '原始 30P30N 已验收二阶计算的保存流场；数值参考，非实验数据。':'Saved field from the accepted second-order original 30P30N case. This is a numerical reference, not experimental data.',
    '本项目原始 L3 网格的已验收计算值；不是实验值或通用常数。':'Accepted results on this project’s original L3 mesh. These are neither experimental measurements nor universal constants.',
    '来源：本项目原始 L3 网格的已验收二阶 CFD 计算；这些不是实验值或翼型通用常数。':'Source: the accepted second-order CFD case on this project’s original L3 mesh. These values are neither experimental measurements nor universal airfoil constants.',
    '前缘缝翼与主翼几何未改；顺序为形状修改 → 旋转 → 平移。':'The slat and main element are unchanged. The flap transformations are applied in this order: shape change → rotation → translation.',
    '网格由原始 L3 网格经弹性变形得到，保留原节点与单元拓扑。':'The mesh was elastically deformed from the original L3 mesh, preserving its nodes and element topology.',
    '当前网格未匹配已记录的 SF 改动，暂不标注几何参数。':'The current mesh does not match the recorded SF modification; geometry parameters are not reported.',
    '提交后开始计算；时间、迭代上限与独立验收仍生效。':'Submitting starts the run. Time and iteration limits and independent acceptance checks still apply.',
    '开始、直接续算、改设置续算、重新计算均使用输入的上限；暂停时间不计入。应用到当前不会重启或清零计时；若新上限小于已用时间，计算会在下一次检查时结束。迭代上限仍有效。':'The entered limit applies to new runs, continuations, adjusted continuations, and restarts. Paused time is excluded. Applying it to the current run does not restart the solver or reset elapsed time. If the limit is below elapsed time, the next check ends the run. The iteration limit remains active.',
    '开关即时生效，后续开始与续算沿用；网页关闭后监控仍运行，本地服务需保持开启。自动停止表示稳定性条件达标，保存流场仍需最终验收。':'This setting takes effect immediately and is retained for subsequent runs and continuations. Monitoring continues with the page closed while the local service is running. An automatic stop indicates that stability criteria were met; the saved field still requires final acceptance.',
    '同一任务的迭代历程完整保留；续算处断线，标记与顶部历程节点对应，悬停可查看设置变化。':'The complete history of this task is retained. Lines break at continuations; markers correspond to the history nodes above. Hover over a marker to inspect settings changes.',
    '两图使用相同米制视角与共同 Mach 色标。当前模型每 1000 步保存快照，非逐步动画；其未收敛诊断场不能作为已收敛的气动结果。':'Both views share the same coordinates in metres and Mach color scale. The current model saves snapshots every 1000 iterations, rather than every iteration. An unconverged diagnostic field cannot be treated as a converged aerodynamic result.',
    '峰峰变化 = 窗口内最大值 − 最小值；红色虚线为门槛，两条曲线均低于门槛时该系数达标。使用对数刻度，零变化以轴底空心点标出；每次续算重新计窗，不跨越重启点。以上曲线保留所选任务的迭代历程，显示范围由本节窗口独立控制；250 / 1250 步峰峰变化的计算窗口与验收门槛保持不变。':'Range = maximum − minimum within the window. The red dashed line is the threshold; both curves must fall below it for the coefficient to pass. The axis is logarithmic, with zero ranges shown as hollow markers at its lower edge. Windows restart at each continuation and never cross a restart. The selected task’s history is retained, and this section independently controls the displayed range. The 250 / 1250-iteration calculation windows and acceptance thresholds remain unchanged.',
    'CL 上限 0.0005，CD 上限 0.00001。250 步是原验收窗口；1250 步用于额外观察，避免短窗口掩盖持续振荡。最终验收还包括残差、求解器停止原因及保存流场检查。':'CL range limit: 0.0005; CD range limit: 0.00001. The original acceptance window is 250 iterations. The 1250-iteration window provides an additional check for persistent oscillations that a shorter window might miss. Final acceptance also checks residuals, the solver termination reason, and the saved field.',
    '从所选历史节点的保存结果新建分支，继承其数值设置。':'Create a branch from this historical node’s saved state and inherit its numerical settings.',
    '从所选末端节点的保存结果沿原路径直接续算，继承其数值设置。':'Continue the existing path from this terminal node’s saved state with the same numerical settings.',
    '等待所选节点的可用保存结果。':'Waiting for an available saved state from the selected node.',
    '使用当前计算的保存结果与相同数值设置继续计算。':'Continue from the current run’s saved state with the same numerical settings.',
    '从所选历史节点新建分支；修改设置后提交才开始计算。':'Create a branch from this historical node. The run starts only after the changed settings are submitted.',
    '从所选末端节点沿原路径续算；修改设置后提交才开始计算。':'Continue this terminal node along its existing path. The run starts only after the changed settings are submitted.',
    '修改数值设置后使用当前计算的保存结果续算。':'Change numerical settings and continue from the current run’s saved state.',
    '此节点已有后续阶段；续算将新建分支，原记录保留。':'This node has descendants. Continuing creates a new branch and retains the original records.',
    '此节点位于路径末端；可沿原路径续算，原记录保留。':'This is a terminal node. You can continue its existing path while retaining the original records.',
    '此节点尚无可用的保存结果，无法续算。':'No saved state is available for this node, so continuation is unavailable.',
    '归档此最新新建阶段，并返回之前的计算；原始文件会保留。':'Archive this latest newly initialized segment and return to the previous run. Original files are retained.',
    '存在后续续算依赖，不能删除；可仅隐藏绘图。':'Later continuations depend on this node. It cannot be deleted, but its plot segment can be hidden.',
    '仅最新从固定初态开始或重跑的阶段可删除；其他记录保留，可仅隐藏绘图。':'Only the latest newly initialized or restarted segment can be archived. Other records are retained; their plot segments can be hidden.',
    '本阶段绘图已隐藏，可在右键菜单恢复':'This segment is hidden from plots. Restore it from the context menu.',
    '时间上限需为有效正数，至少 1 秒。':'Enter a positive time limit of at least 1 second.',
    'CFL 上限需为 0.1 至 500 的有效数值。':'Enter a finite CFL limit between 0.1 and 500.',
    '连接中断，保留最后一次数据；正在自动重试。':'Connection lost. The last loaded data are retained while the page reconnects.',
    '读取保存快照':'Loading Saved Snapshot', '只读快照':'Read-only Snapshot',
    '只读保存快照 · 节点切换、曲线窗口和流场交互可用':'Read-only Snapshot · Node Selection, Plot Windows, and Field Navigation Available',
    '仅隐藏或恢复本浏览器的绘图显示；来源和保护记录固定。':'You can hide or restore plot segments in this browser. Provenance and protection records are fixed.',
    '快照资源读取失败，保留已加载数据；请检查页面资源路径。':'A snapshot resource could not be loaded. Previously loaded data are retained. Check the page’s resource paths.',
    '此节点没有可用的已保存流场；未以其他节点的流场替代。':'No saved field is available for this node. A field from another node has not been substituted.',
    '只读展示不提供计算控制。':'Run controls are unavailable in this read-only view.',
    '此计算节点未包含在展示快照中。':'This run node is not included in the saved showcase.',
    '展示资源必须来自本地静态包。':'Showcase resources must come from this static bundle.',
    '真实保存数据；运行状态与验收结论截至导出时刻。':'Original saved data; run status and acceptance conclusions are current as of export.',
    '本地来源记录（路径未公开）':'Local provenance record (path withheld)',
    '切换到英文':'Switch to English', '切换到中文':'Switch to Chinese',
    '界面语言':'Interface Language', '中文':'Chinese', '英文':'English',
    '滑块':'Slider', '数值':'Value', '分支':'Branch', '绘图已隐藏':'Hidden from Plots',
    '；速度模由节点 Velocity 向量求模':'; velocity magnitude is computed from the nodal Velocity vector',
    '当前算例在功能更新前启动，时间修改从下一次计算生效。':'This run predates live time-limit updates; changes apply to the next run.',
    '本次按稳定性规则自动停止并保留已核对检查点':'The stability rule stopped the run and retained a verified checkpoint',
    '本次因迭代上限结束，未使用原生收敛停止':'The run ended at the iteration limit, rather than on native convergence',
    '本次计算已结束':'The run has ended', '计算仍在进行':'The run is still active',
    '续算从此节点新建分支':'Continuing creates a new branch',
    '末端节点可沿原路径直接续算':'This terminal node can continue along its existing path',
    '提交后创建独立分支':'Submitting creates an independent branch',
    '提交后沿原路径追加续算阶段':'Submitting adds a continuation to the existing path',
    '实际网格渲染，节点':'Original mesh rendering: nodal',
    '在线性三角单元内插值。':'is interpolated within linear triangles.',
    '在线性三角单元内插值；速度模由节点 Velocity 向量求模。':'is interpolated within linear triangles. Velocity magnitude is computed from the nodal Velocity vector.',
    '两图使用相同米制视角与共同':'Both views share the same coordinates in metres and',
    '色标。当前模型每 1000 步保存快照，非逐步动画；保存场仍需按验收记录判断可否作为气动结果。':'color scale. Snapshots are saved every 1000 iterations, rather than every iteration. Consult the acceptance record before treating a saved field as an aerodynamic result.',
    '原 30P30N 已验收二阶':'Accepted second-order field for original 30P30N:',
    '流场，与当前流场同步缩放和平移':'field; navigation is synchronized with the current field',
    '当前模型的':'Current model', '流场，与原始流场同步缩放和平移':'field; navigation is synchronized with the original field',
    '此网格快照没有':'This mesh snapshot does not contain', '参数。':'field data.',
    '浏览器不支持 WebGL2；':'WebGL2 is unavailable;', '无对应 PNG 预览。':'has no PNG preview.',
    '该结果的物理验证状态见验收记录。':'See the acceptance record for physical validation status.',
    '算例':'Case', '正在查看历史计算':'Viewing historical run',
    '正在查看保存节点':'Viewing saved node',
    '计算记录：':'Run record: ', '续算来源：':'Continuation source: ', '分支来源：':'Branch source: ',
    '；末端节点可沿原路径直接续算，保留原记录。':'. This terminal node can continue along its existing path. Original records are retained.',
    '；续算从此节点新建分支，保留原记录。':'. Continuing creates a new branch. Original records are retained.',
    '。继承此节点的已保存结果与设置；提交后创建独立分支，原记录保留。':'. This node’s saved state and settings are inherited. Submitting creates an independent branch and retains the original records.',
    '。继承此节点的已保存结果与设置；提交后沿原路径追加续算阶段，原记录保留。':'. This node’s saved state and settings are inherited. Submitting adds a continuation to the existing path and retains the original records.',
    '；图表沿真实祖先路径展示，数据截至导出时刻。':'. The curves follow its actual ancestry; all data are current as of export.',
  }));
  const rules = [];
  const rule = (pattern, translation) => rules.push([pattern, translation]);
  const known = text => exact.get(text) || text;
  const field = text => known(text);
  rule(/^(\d+)分 (\d+)秒$/, (_,m,s)=>`${m}m ${s}s`);
  rule(/^最近 ([\d,]+) 步$/, (_,n)=>`Recent ${n}`);
  rule(/^显示全部 ([\d,]+) 条迭代记录$/, (_,n)=>`Showing all ${n} iterations`);
  rule(/^显示最近 ([\d,]+) 条记录 · 本任务共 ([\d,]+) 条$/, (_,n,total)=>`Showing the latest ${n} of ${total} iterations`);
  rule(/^已隐藏 ([\d,]+) 个阶段，可在节点右键菜单恢复$/, (_,n)=>`${n} hidden segments; restore them from a node’s context menu`);
  rule(/^([\d,]+) 段$/, (_,n)=>`${n} segments`);
  rule(/^门槛 (.+)$/, (_,n)=>`Threshold ${n}`);
  rule(/^共同色标 (.+)$/, (_,n)=>`Shared Range ${translate(n)}`);
  rule(/^(.+?) 共同色标(?: · (.+?))? (.+?)–(.+)$/, (_,f,unit,min,max)=>`${field(f)} Shared Range${unit?` · ${known(unit)}`:''} ${min}–${max}`);
  rule(/^(.+?) 色标(下限|上限)(滑块|数值)$/, (_,f,side,type)=>`${field(f)} color ${side==='下限'?'minimum':'maximum'} ${type==='滑块'?'slider':'value'}`);
  rule(/^(.+?) 色标$/, (_,f)=>`${field(f)} color scale`);
  rule(/^两图使用相同米制视角与共同 (.+?) 色标。当前模型每 1000 步保存快照，非逐步动画；保存场仍需按验收记录判断可否作为气动结果。$/, (_,f)=>`Both views share the same coordinates in metres and ${field(f)} color scale. Snapshots are saved every 1000 iterations, rather than every iteration. Consult the acceptance record before treating a saved field as an aerodynamic result.`);
  rule(/^原 30P30N 已验收二阶 (.+?) 流场，与当前流场同步缩放和平移$/, (_,f)=>`Accepted second-order ${field(f)} field for original 30P30N; navigation is synchronized with the current field`);
  rule(/^当前模型的 (.+?) 流场，与原始流场同步缩放和平移$/, (_,f)=>`${field(f)} field for the current model; navigation is synchronized with the original field`);
  rule(/^(.+?) 的色标下限不得小于 (.+?)，且上限必须大于下限。$/, (_,f,min)=>`The ${field(f)} color minimum must be at least ${min}, and the maximum must be greater than the minimum.`);
  rule(/^实际网格渲染，节点 (.+?) 在线性三角单元内插值(；速度模由节点 Velocity 向量求模)?。$/, (_,f,velocity)=>`Original mesh rendering: nodal ${field(f)} is interpolated within linear triangles.${velocity?' Velocity magnitude is computed from the nodal Velocity vector.':''}`);
  rule(/^浏览器不支持 WebGL2；(.+?) 无对应 PNG 预览。$/, (_,f)=>`WebGL2 is unavailable, and there is no PNG preview for ${field(f)}.`);
  rule(/^此网格快照没有 (.+?) 参数。$/, (_,f)=>`This mesh snapshot does not contain ${field(f)}.`);
  rule(/^(.+?)的 Mach 分布，PNG 源色标 (.+?) 至 (.+)$/, (_,f,min,max)=>`${known(f)} Mach distribution; original PNG range ${min} to ${max}`);
  rule(/^快照第 ([\d,]+) 步$/, (_,n)=>`Snapshot iteration ${n}`);
  rule(/^算例 (.+)$/, (_,run)=>`Case ${run}`);
  rule(/^源文件更新于 (.+)$/, (_,date)=>`Source saved ${date}`);
  rule(/^更新于 (.+?) · 每 2 秒读取$/, (_,time)=>`Updated ${time} · Read every 2 s`);
  rule(/^快照于 (.+)$/, (_,time)=>`Snapshot ${time}`);
  rule(/^采样峰值内存 (.+?) GiB$/, (_,n)=>`Sampled peak memory ${n} GiB`);
  rule(/^剩余时间上限 (.+)$/, (_,time)=>`Time remaining ${translate(time)}`);
  rule(/^试算上限 (.+)$/, (_,time)=>`Run limit ${translate(time)}`);
  rule(/^默认上限 (.+?) · 当前算例上限 (.+?)(。.*)?$/, (_,def,run,suffix)=>`Default limit ${translate(def)} · Current run limit ${translate(run)}${suffix&&suffix!=='。'?' · This run predates live limit updates; changes apply to the next run.':'.'}`);
  rule(/^参考工况：Ma (.+?) · Re (.+?) · 迎角 (.+?)° · 参考弦长 (.+?) m · SA-noft2。$/, (_,ma,re,aoa,chord)=>`Reference conditions: Ma ${ma} · Re ${re} · AoA ${aoa}° · Reference chord ${chord} m · SA-noft2.`);
  rule(/^当前实际计算格式：(.+?)。弯度与厚度参数按局部后翼片弦长归一化；平移按整机参考弦长归一化。$/, (_,order)=>`Current discretization: ${known(order)}. Camber and thickness are normalized by the local flap chord; translation is normalized by the overall reference chord.`);
  rule(/^后翼片沿全局 x 平移 (.+?) mm（(.+?)% 参考弦长），沿 y 平移 (.+?) mm（(.+?)% 参考弦长）。$/, (_,dx,xp,dy,yp)=>`The flap is translated by ${dx} mm in global x (${xp}% of the reference chord) and ${dy} mm in global y (${yp}% of the reference chord).`);
  rule(/^绕原后翼片前缘逆时针旋转 (.+?)°。$/, (_,angle)=>`The flap is rotated ${angle}° counterclockwise about its original leading edge.`);
  rule(/^弯度模态：(.+?)% 局部后翼片弦长，法向峰值约 (.+?) mm。$/, (_,percent,mm)=>`Camber mode: ${percent}% of the local flap chord, with a peak normal displacement of approximately ${mm} mm.`);
  rule(/^厚度模态：每侧 (.+?)% 局部后翼片弦长，两侧厚度增量的模态峰值约 (.+?) mm。$/, (_,percent,mm)=>`Thickness mode: ${percent}% of the local flap chord per side, with a peak total thickness increase of approximately ${mm} mm.`);
  rule(/^数值稳定性条件已达标；(本次按稳定性规则自动停止并保留已核对检查点|本次因迭代上限结束，未使用原生收敛停止|本次计算已结束|计算仍在进行)。该结果的物理验证状态见验收记录。(.*)$/, (_,reason,tail)=>`Numerical stability criteria have been met. ${({'本次按稳定性规则自动停止并保留已核对检查点':'The stability rule stopped the run and retained a verified checkpoint.','本次因迭代上限结束，未使用原生收敛停止':'The run ended at the iteration limit, not on native convergence.','本次计算已结束':'The run has ended.','计算仍在进行':'The run is still active.'})[reason]} See the acceptance record for physical validation status.${tail?' '+translate(tail.trim()):''}`);
  rule(/^250 \/ 1250 步窗口均满足 ΔCL ≤ (.+?)、ΔCD ≤ (.+?)；密度与湍流变量的 log₁₀ 残差均 ≤ (.+?) \/ (.+?)。触发前核对最新完整检查点的同一组条件。$/, (_,cl,cd,rho,nu)=>`Both 250 / 1250-iteration windows must satisfy ΔCL ≤ ${cl} and ΔCD ≤ ${cd}; the density and turbulence log₁₀ residuals must be ≤ ${rho} / ${nu}. The same criteria are checked against the latest complete checkpoint before stopping.`);
  rule(/^保存点第 ([\d,]+) 步：(.+?)。$/, (_,n,state)=>`Checkpoint ${n}: ${known(state)}.`);
  rule(/^原生自动停止：(开启|关闭|读取中)$/, (_,state)=>`Native auto-stop: ${known(state)}`);
  rule(/^原生停止(开启|关闭)$/, (_,state)=>`Native stop ${known(state)}`);
  rule(/^计算状态：(.+)$/, (_,state)=>`Run status: ${known(state)}`);
  rule(/^计算格式：(.+)$/, (_,order)=>`Discretization: ${translate(order)}`);
  rule(/^开始时间：(.+)$/, (_,time)=>`Started: ${time}`);
  rule(/^状态：(.+)$/, (_,state)=>`Status: ${known(state)}`);
  rule(/^通用时间上限：(.+)$/, (_,time)=>`Runtime limit: ${translate(time)}`);
  rule(/^父检查点：(.+)$/, (_,n)=>`Parent checkpoint: ${known(n)}`);
  rule(/^检查点 (.+)$/, (_,n)=>`Checkpoint ${n}`);
  rule(/^续算来源：(.+)$/, (_,run)=>`Continuation source: ${run}`);
  rule(/^计算记录：(.+)$/, (_,run)=>`Run record: ${run}`);
  rule(/^累计记录 (.+)$/, (_,n)=>`Cumulative iteration ${n}`);
  rule(/^本段原迭代 (.+)$/, (_,n)=>`Original segment iteration ${known(n)}`);
  rule(/^第 ([\d,]+) (?:阶段|段) · (.+)$/, (_,n,operation)=>`Segment ${n} · ${known(operation)}`);
  rule(/^第 ([\d,]+) 段，(.+?)(，绘图已隐藏)?，(.+)$/, (_,n,op,hidden,run)=>`Segment ${n}, ${known(op)}${hidden?', hidden from plots':''}, ${run}`);
  rule(/^([\d,]+) 个家族节点 · 当前来时路径 ([\d,]+) 段 · 右键(隐藏或新建分支|隐藏或恢复显示)$/, (_,nodes,path,actions)=>`${nodes} family nodes · ${path} segments on the selected path · Right-click to ${actions==='隐藏或新建分支'?'hide or branch':'hide or restore'}`);
  rule(/^正在查看历史计算 (.+?)；(续算从此节点新建分支|末端节点可沿原路径直接续算)，保留原记录。$/, (_,run,branch)=>`Viewing historical run ${run}. ${branch==='续算从此节点新建分支'?'Continuing creates a new branch.':'This terminal node can continue along its existing path.'} Original records are retained.`);
  rule(/^正在查看保存节点 (.+?)；图表沿真实祖先路径展示，数据截至导出时刻。$/, (_,run)=>`Viewing saved node ${run}. The curves follow its actual ancestry; all data are current as of export.`);
  rule(/^(分支|续算)来源：(.+?)。继承此节点的已保存结果与设置；(提交后创建独立分支|提交后沿原路径追加续算阶段)，原记录保留。$/, (_,kind,run,action)=>`${kind==='分支'?'Branch':'Continuation'} source: ${run}. This node’s saved state and settings are inherited. Submitting ${action==='提交后创建独立分支'?'creates an independent branch':'adds a continuation to the existing path'}, retaining the original records.`);
  rule(/^(.+?) · 原生停止(开启|关闭) · (修改设置后续算|从固定初态开始)$/, (_,head,state,mode)=>`${translate(head)} · Native stop ${known(state)} · ${mode==='修改设置后续算'?'Adjusted Continuation':'Initialized from Fixed State'}`);
  rule(/^(CFL 上限|空间离散|原生自动停止|流动更新松弛系数) (.+)$/, (_,label,value)=>`${known(label)} ${known(value)}`);
  rule(/^(CFL 上限|流动重构阶数|原生自动停止|空间离散|流动更新松弛系数)：(.+)$/, (_,label,value)=>`${known(label)}: ${translate(value)}`);
  rule(/^(流场绘图参数|计算格式|原生自动停止)：(.+)$/, (_,label,value)=>`${known(label)}: ${known(value)}`);
  rule(/^(监控异常|控制失败|删除未完成|保护状态未更新)：(.+)$/, (_,label,error)=>`${({'监控异常':'Monitor error','控制失败':'Run action failed','删除未完成':'Archive failed','保护状态未更新':'Protection update failed'})[label]}: ${translate(error)}`);
  rule(/^操作未完成（HTTP (.+?)）$/, (_,status)=>`Action failed (HTTP ${status})`);
  rule(/^(.+?)关键参数迭代(.*)$/, (_,prefix,suffix)=>`${prefix}Convergence${suffix}`);

  // These are complete accessibility labels rather than visible interface prose.
  const accessibility = {
    '关键参数迭代绘图窗口':'Convergence plot window',
    '关键参数迭代最近步数滑块':'Convergence recent-iteration slider',
    '关键参数迭代最近步数数值':'Convergence recent-iteration count',
    '计算稳定性检查绘图窗口':'Stability plot window',
    '计算稳定性检查最近步数滑块':'Stability recent-iteration slider',
    '计算稳定性检查最近步数数值':'Stability recent-iteration count',
    '升力系数随迭代步数变化':'Lift coefficient versus iteration',
    '阻力系数随迭代步数变化':'Drag coefficient versus iteration',
    '密度与湍流残差随迭代步数变化':'Density and turbulence residuals versus iteration',
    '升力系数250与1250步滑动窗口峰峰变化，门槛0.0005':'Lift ranges over 250 and 1250-iteration windows; threshold 0.0005',
    '阻力系数250与1250步滑动窗口峰峰变化，门槛0.00001':'Drag ranges over 250 and 1250-iteration windows; threshold 0.00001',
    '流场绘图参数':'Flow Field', '上下流场说明':'Descriptions of Both Flow Views',
    '已用时间占试算上限':'Elapsed time as a fraction of the run limit',
    '原 30P30N 已验收二阶流场的 Mach 分布':'Mach distribution from the accepted second-order original 30P30N field',
    '实际网格的 Mach 流场，可用滚轮缩放、拖动平移':'Mach field on the original mesh; scroll to zoom and drag to pan',
    '最新已保存流场的 Mach 分布，色标固定为 0 至 0.5':'Latest saved Mach field with a fixed color range of 0 to 0.5',
  };
  for (const pair of Object.entries(accessibility)) exact.set(...pair);

  // Math is already rendered into spans. Align the intervening text using the
  // original scientific tokens, preserving the math subtree and its typography.
  const scientific = /ΔC_?[LD]|C_?[LDp]|Cₚ|log₁₀/g;
  for (const [zh,en] of Array.from(exact)) {
    const a=[...zh.matchAll(scientific)],b=[...en.matchAll(scientific)];
    if(!a.length||a.length!==b.length||a.some((x,i)=>x[0]!==b[i][0]))continue;
    const zs=zh.split(scientific),es=en.split(scientific);
    zs.forEach((fragment,i)=>{if(han.test(fragment)&&fragment.trim())exact.set(fragment.trim(),es[i].trim());});
  }
  // The stability criteria are dynamically filled and then typeset as math.
  exact.set('250 / 1250 步窗口均满足','Both 250 / 1250-iteration windows must satisfy');
  rule(/^；密度与湍流变量的$/,()=>'; the density and turbulence');
  rule(/^(.+?)；密度与湍流变量的$/,(_,value)=>`${value}; the density and turbulence`);
  rule(/^残差均 ≤ (.+?) \/ (.+?)。触发前核对最新完整检查点的同一组条件。$/,(_,rho,nu)=>`residuals must be ≤ ${rho} / ${nu}. The same criteria are checked against the latest complete checkpoint before stopping.`);
  rule(/^色标下限不得小于 (.+?)，且上限必须大于下限。$/,(_,n)=>`color minimum must be at least ${n}, and the maximum must be greater than the minimum.`);
  rule(/^只读展示快照 · 导出于$/,()=> 'Read-only Snapshot · Exported');
  rule(/^只读展示快照 · 导出于 (.+)$/,(_,date)=>`Read-only Snapshot · Exported ${date}`);

  const reverse = new Map();
  for (const [zh,en] of exact) if(!reverse.has(en)) reverse.set(en,zh);
  const unknown = new Set();
  function translate(source, depth=0) {
    if(!han.test(source)||depth>5)return source;
    const lead=source.match(/^\s*/)[0],tail=source.match(/\s*$/)[0],body=source.trim();
    if(exact.has(body))return lead+exact.get(body)+tail;
    for(const [pattern,replacement] of rules)if(pattern.test(body))return lead+body.replace(pattern,replacement)+tail;
    // Metadata chips, settings transitions, and separate sentences are complete
    // semantic units; translating each preserves natural English syntax.
    if(body.includes(' · '))return lead+body.split(' · ').map(part=>translate(part,depth+1)).join(' · ')+tail;
    if(body.includes(' → '))return lead+body.split(' → ').map(part=>translate(part,depth+1)).join(' → ')+tail;
    if(/。\s*\S/.test(body))return lead+body.match(/[^。]+(?:。|$)/g).map(part=>translate(part.trim(),depth+1)).join(' ')+tail;
    if(body==='、')return ', ';
    if(body==='。')return '.';
    if(body.startsWith('· '))return lead+'· '+translate(body.slice(2),depth+1)+tail;
    if(body.startsWith('，'))return lead+', '+translate(body.slice(1),depth+1)+tail;
    unknown.add(body);
    return source;
  }

  const records = new WeakMap(),attributeRecords = new WeakMap();
  const attrs=['aria-label','aria-description','aria-valuetext','title','alt','placeholder'];
  let language='zh',observer=null,scheduled=false;
  try { language=localStorage.getItem('sf-dashboard-language')==='en'?'en':'zh'; } catch(error) {}
  try { const requested=new URL(window.location.href).searchParams.get('lang');
    if(requested==='en'||requested==='zh')language=requested;
  } catch(error) {}
  function remembered(map,object,key,current) {
    let state=map.get(object);
    if(key!==null){if(!state){state=new Map();map.set(object,state);}const old=state.get(key);
      if(!old||old.rendered!==current){const next={source:reverse.get(current.trim())||current,rendered:current};state.set(key,next);return next;}return old;}
    if(!state||state.rendered!==current){state={source:reverse.get(current.trim())||current,rendered:current};map.set(object,state);}return state;
  }
  function process(root=document.documentElement) {
    if(!root||root.nodeType!==Node.ELEMENT_NODE)return;
    const nodes=[root,...root.querySelectorAll('*')];
    for(const element of nodes) {
      if(element.closest('script,style,.katex,code,pre,#languageToggle'))continue;
      for(const name of attrs)if(element.hasAttribute(name)) {
        const current=element.getAttribute(name),state=remembered(attributeRecords,element,name,current);
        const result=language==='en'?translate(state.source):state.source;
        state.rendered=result;if(current!==result)element.setAttribute(name,result);
      }
    }
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode(node){
      return node.parentElement?.closest('script,style,.katex,code,pre,#languageToggle')?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT;
    }});
    while(walker.nextNode()) {
      const node=walker.currentNode,state=remembered(records,node,null,node.nodeValue);
      const result=language==='en'?translate(state.source):state.source;
      state.rendered=result;if(node.nodeValue!==result)node.nodeValue=result;
    }
    document.documentElement.lang=language==='en'?'en':'zh-CN';
    const toggle=document.getElementById('languageToggle');
    if(toggle){const label=language==='en'?'中':'EN';if(toggle.textContent!==label)toggle.textContent=label;
      const name=language==='en'?'Switch to Chinese':'切换到英文';
      if(toggle.getAttribute('aria-label')!==name)toggle.setAttribute('aria-label',name);
      if(toggle.title!==name)toggle.title=name;toggle.setAttribute('aria-pressed',String(language==='en'));}
  }
  function schedule(records) {
    // Self-authored mutations already equal their remembered rendering. Ignore
    // them; this avoids observer loops without disabling real dynamic updates.
    const relevant=records.some(m=>m.type==='childList'||m.type==='characterData'&&m.target.nodeValue!==recordsText(m.target)||m.type==='attributes'&&m.target.getAttribute(m.attributeName)!==attributeRecords.get(m.target)?.get(m.attributeName)?.rendered);
    if(!relevant||scheduled)return;scheduled=true;
    queueMicrotask(()=>{scheduled=false;process();});
  }
  const recordsText=node=>records.get(node)?.rendered;
  function setLanguage(next) {
    language=next==='en'?'en':'zh';
    try{localStorage.setItem('sf-dashboard-language',language);}catch(error){}
    try{const url=new URL(window.location.href);url.searchParams.set('lang',language);
      window.history.replaceState(null,'',url);
    }catch(error){}
    process();window.dispatchEvent(new CustomEvent('dashboard-languagechange',{detail:{language}}));
  }
  window.dashboardI18n=Object.freeze({setLanguage,toggle:()=>setLanguage(language==='en'?'zh':'en'),
    getLanguage:()=>language,translate,refresh:()=>process(),untranslated:()=>Array.from(unknown).sort()});
  function start(){const toggle=document.getElementById('languageToggle');
    if(toggle)toggle.addEventListener('click',()=>setLanguage(language==='en'?'zh':'en'));
    process();observer=new MutationObserver(schedule);
    observer.observe(document.documentElement,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:attrs});}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
