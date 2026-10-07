(() => {
  'use strict';
  const config = {"readonly": true, "current_run": "feas_sf_def_changed_first_order_cont_20261007T180651628698Z", "default_run": "feas_sf_def_changed_first_order_cont_20261007T161837029606Z", "exported_utc": "2026-10-07T19:41:17.751359+00:00", "runs": {"feas_sf_def_changed_example": "data/feas_sf_def_changed_example.json", "feas_sf_def_changed_force_stop": "data/feas_sf_def_changed_force_stop.json", "feas_sf_def_changed_cfl10": "data/feas_sf_def_changed_cfl10.json", "feas_sf_def_changed_first_order": "data/feas_sf_def_changed_first_order.json", "feas_sf_def_changed_first_order_cont": "data/feas_sf_def_changed_first_order_cont.json", "feas_sf_def_changed_first_order_cont_20261007T151301943956Z": "data/feas_sf_def_changed_first_order_cont_20261007T151301943956Z.json", "feas_sf_def_changed_first_order_cont_20261007T151510435645Z": "data/feas_sf_def_changed_first_order_cont_20261007T151510435645Z.json", "feas_sf_def_changed_first_order_cont_20261007T152648650580Z": "data/feas_sf_def_changed_first_order_cont_20261007T152648650580Z.json", "feas_sf_def_changed_first_order_cont_20261007T153022213278Z": "data/feas_sf_def_changed_first_order_cont_20261007T153022213278Z.json", "feas_sf_def_changed_first_order_cont_20261007T153826059584Z": "data/feas_sf_def_changed_first_order_cont_20261007T153826059584Z.json", "feas_sf_def_changed_first_order_cont_20261007T155355416991Z": "data/feas_sf_def_changed_first_order_cont_20261007T155355416991Z.json", "feas_sf_def_changed_first_order_cont_20261007T161837029606Z": "data/feas_sf_def_changed_first_order_cont_20261007T161837029606Z.json", "feas_sf_def_changed_first_order_cont_20261007T180651628698Z": "data/feas_sf_def_changed_first_order_cont_20261007T180651628698Z.json"}};
  window.DASHBOARD_SHOWCASE = Object.freeze(config);
  const base = new URL('.', document.currentScript.src);
  const originalFetch = window.fetch.bind(window), cache = new Map();
  function aborted() { return new DOMException('Request aborted', 'AbortError'); }
  window.fetch = async function(input, init = {}) {
    const url = new URL(typeof input === 'string' || input instanceof URL ? input : input.url, base);
    const method = String(init.method || input?.method || 'GET').toUpperCase();
    if (method !== 'GET' || /\/api\/control$/.test(url.pathname))
      throw new Error('只读展示不提供计算控制。');
    if (/\/api\/progress$/.test(url.pathname)) {
      const run = url.searchParams.get('run') || config.current_run, relative = config.runs[run];
      if (!relative) return new Response(JSON.stringify({error:'此计算节点未包含在展示快照中。'}), {status:404});
      if (init.signal?.aborted) throw aborted();
      let data = cache.get(run);
      if (!data) {
        const response = await originalFetch(new URL(relative, base), init);
        if (!response.ok) return response;
        data = await response.json();
        for (const key of ['flow_snapshot', 'baseline_flow_snapshot'])
          for (const field of ['mesh_url', 'image_url'])
            if (data[key]?.[field]) data[key][field] = new URL(data[key][field], base).href;
        cache.set(run, data);
      }
      if (init.signal?.aborted) throw aborted();
      return new Response(JSON.stringify(data), {status:200, headers:{'Content-Type':'application/json; charset=utf-8'}});
    }
    // Static assets may only be read from this self-contained bundle.
    if (url.origin !== base.origin || !url.pathname.startsWith(base.pathname))
      throw new Error('展示资源必须来自本地静态包。');
    return originalFetch(url, init);
  };
  window.showcaseLockControls = function() {
    for (const id of ['controlStart','controlPause','controlResume','controlContinue',
      'controlReconfigure','controlRestart','continuationCfl','continuationOrder',
      'continuationNativeStop','continuationSubmit','runtimeTimeout','runtimeSave',
      'runtimeApply','stabilityStopToggle','stageBranch','stageProtect','stageDelete']) {
      const control = document.getElementById(id);
      if (control) { control.disabled = true; control.title = '只读快照'; }
    }
    const message = document.getElementById('controlMessage');
    if (message) message.textContent = '只读保存快照 · 节点切换、曲线窗口和流场交互可用';
    const note = document.getElementById('stageContextNote');
    if (note) note.textContent = '仅隐藏或恢复本浏览器的绘图显示；来源和保护记录固定。';
  };
})();
