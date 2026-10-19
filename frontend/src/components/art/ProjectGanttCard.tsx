'use client';

import React, { useState } from 'react';
import { Locale } from '@/types';

export interface GanttItem {
  id: number;
  type: 'SUMMARY TASK' | 'TASK' | 'MILESTONE';
  subject: string;
  subjectZh?: string;
  phase: 'initiation' | 'planning' | 'execution' | 'monitoring' | 'closing';
  status: 'New' | 'In Progress' | 'Completed';
  startDate: string;
  finishDate: string;
  duration: string;
  progressPercent: number;
  isMilestone?: boolean;
}

export const GANTT_PROJECT_DATA: GanttItem[] = [
  // ── INITIATION (Inisiasi) ──
  {
    id: 40,
    type: 'SUMMARY TASK',
    subject: 'INITIATION (Inisiasi)',
    subjectZh: '项目起步与立项 (Inisiasi)',
    phase: 'initiation',
    status: 'Completed',
    startDate: '09/01/2026',
    finishDate: '09/08/2026',
    duration: '8 days',
    progressPercent: 100,
  },
  {
    id: 41,
    type: 'TASK',
    subject: 'Finalisasi project charter & kick-off',
    subjectZh: '立项书定稿与项目启动会',
    phase: 'initiation',
    status: 'Completed',
    startDate: '09/01/2026',
    finishDate: '09/04/2026',
    duration: '4 days',
    progressPercent: 100,
  },
  {
    id: 42,
    type: 'TASK',
    subject: 'Riset pasar & penentuan 2 subbrand',
    subjectZh: '市场调研与双子品牌定位',
    phase: 'initiation',
    status: 'Completed',
    startDate: '09/01/2026',
    finishDate: '10/15/2026',
    duration: '45 days',
    progressPercent: 95,
  },

  // ── PLANNING (Perencanaan) ──
  {
    id: 43,
    type: 'SUMMARY TASK',
    subject: 'PLANNING (Perencanaan)',
    subjectZh: '规划与成本预算 (Perencanaan)',
    phase: 'planning',
    status: 'In Progress',
    startDate: '09/01/2026',
    finishDate: '10/15/2026',
    duration: '45 days',
    progressPercent: 85,
  },
  {
    id: 44,
    type: 'TASK',
    subject: 'Finalisasi resep & perhitungan HPP (COGS)',
    subjectZh: '标准食谱定型与销货成本测算 (COGS)',
    phase: 'planning',
    status: 'Completed',
    startDate: '09/04/2026',
    finishDate: '09/15/2026',
    duration: '12 days',
    progressPercent: 100,
  },
  {
    id: 45,
    type: 'TASK',
    subject: 'Survei & sewa lokasi dapur',
    subjectZh: '选址调研与中央厨房租赁签约',
    phase: 'planning',
    status: 'Completed',
    startDate: '09/01/2026',
    finishDate: '09/15/2026',
    duration: '15 days',
    progressPercent: 100,
  },
  {
    id: 46,
    type: 'MILESTONE',
    subject: 'Lokasi dapur terkunci ◆',
    subjectZh: '核心厨房铺位锁定 (里程碑)',
    phase: 'planning',
    status: 'Completed',
    startDate: '09/15/2026',
    finishDate: '09/15/2026',
    duration: 'Milestone',
    progressPercent: 100,
    isMilestone: true,
  },
  {
    id: 47,
    type: 'TASK',
    subject: 'Desain & cetak packaging custom',
    subjectZh: '品牌包装定制设计与打样',
    phase: 'planning',
    status: 'In Progress',
    startDate: '09/16/2026',
    finishDate: '10/10/2026',
    duration: '25 days',
    progressPercent: 80,
  },
  {
    id: 48,
    type: 'TASK',
    subject: 'Pengurusan izin usaha (NIB)',
    subjectZh: '商业登记证 (NIB) 与合规资质办理',
    phase: 'planning',
    status: 'In Progress',
    startDate: '09/16/2026',
    finishDate: '10/05/2026',
    duration: '20 days',
    progressPercent: 90,
  },
  {
    id: 49,
    type: 'MILESTONE',
    subject: 'NIB terbit & renovasi selesai ◆',
    subjectZh: 'NIB资质获批及场地装修交付 (里程碑)',
    phase: 'planning',
    status: 'New',
    startDate: '10/15/2026',
    finishDate: '10/15/2026',
    duration: 'Milestone',
    progressPercent: 50,
    isMilestone: true,
  },

  // ── EXECUTION (Pelaksanaan) ──
  {
    id: 50,
    type: 'SUMMARY TASK',
    subject: 'EXECUTION (Pelaksanaan)',
    subjectZh: '运营落地与开业执行 (Pelaksanaan)',
    phase: 'execution',
    status: 'In Progress',
    startDate: '09/16/2026',
    finishDate: '12/07/2026',
    duration: '83 days',
    progressPercent: 45,
  },
  {
    id: 51,
    type: 'TASK',
    subject: 'Pengadaan peralatan dapur',
    subjectZh: '厨房商用设备进场安装',
    phase: 'execution',
    status: 'Completed',
    startDate: '09/16/2026',
    finishDate: '10/05/2026',
    duration: '20 days',
    progressPercent: 100,
  },
  {
    id: 52,
    type: 'TASK',
    subject: 'Pengadaan & setup sistem POS',
    subjectZh: '收银与出票 POS 系统部署调试',
    phase: 'execution',
    status: 'Completed',
    startDate: '09/21/2026',
    finishDate: '10/05/2026',
    duration: '15 days',
    progressPercent: 100,
  },
  {
    id: 53,
    type: 'TASK',
    subject: 'Renovasi ringan dapur',
    subjectZh: '动线优化与厨房轻装修工程',
    phase: 'execution',
    status: 'Completed',
    startDate: '09/16/2026',
    finishDate: '10/15/2026',
    duration: '30 days',
    progressPercent: 100,
  },
  {
    id: 54,
    type: 'TASK',
    subject: 'Rekrutmen 2 staf dapur',
    subjectZh: '后厨双人运营团队招聘',
    phase: 'execution',
    status: 'In Progress',
    startDate: '10/16/2026',
    finishDate: '10/22/2026',
    duration: '7 days',
    progressPercent: 60,
  },
  {
    id: 55,
    type: 'TASK',
    subject: 'Pelatihan staf (SOP penyajian)',
    subjectZh: '后厨出品标准化 SOP 实训',
    phase: 'execution',
    status: 'New',
    startDate: '10/23/2026',
    finishDate: '10/31/2026',
    duration: '9 days',
    progressPercent: 15,
  },
  {
    id: 56,
    type: 'TASK',
    subject: 'Registrasi merchant delivery',
    subjectZh: '美团/外卖平台商户入驻接入',
    phase: 'execution',
    status: 'In Progress',
    startDate: '10/16/2026',
    finishDate: '10/31/2026',
    duration: '16 days',
    progressPercent: 40,
  },
  {
    id: 57,
    type: 'TASK',
    subject: 'Foto menu, deskripsi & setup toko',
    subjectZh: '菜单实拍视觉与线上门店上架',
    phase: 'execution',
    status: 'New',
    startDate: '10/20/2026',
    finishDate: '10/31/2026',
    duration: '12 days',
    progressPercent: 10,
  },
  {
    id: 58,
    type: 'TASK',
    subject: 'Dry run internal',
    subjectZh: '全流程内部压力内测 (Dry Run)',
    phase: 'execution',
    status: 'New',
    startDate: '11/01/2026',
    finishDate: '11/07/2026',
    duration: '7 days',
    progressPercent: 0,
  },
  {
    id: 59,
    type: 'TASK',
    subject: 'Soft launch terbatas & feedback',
    subjectZh: '定向用户试营业与口碑反馈收集',
    phase: 'execution',
    status: 'New',
    startDate: '11/08/2026',
    finishDate: '11/15/2026',
    duration: '8 days',
    progressPercent: 0,
  },
  {
    id: 60,
    type: 'MILESTONE',
    subject: '3 platform live ◆',
    subjectZh: '三大外卖与扫码平台全网公测 (里程碑)',
    phase: 'execution',
    status: 'New',
    startDate: '11/15/2026',
    finishDate: '11/15/2026',
    duration: 'Milestone',
    progressPercent: 0,
    isMilestone: true,
  },
  {
    id: 61,
    type: 'TASK',
    subject: 'Grand Opening + promo aplikasi',
    subjectZh: '盛大开业仪式与应用端立减大促',
    phase: 'execution',
    status: 'New',
    startDate: '11/16/2026',
    finishDate: '11/22/2026',
    duration: '7 days',
    progressPercent: 0,
  },
  {
    id: 62,
    type: 'TASK',
    subject: 'Operasional penuh',
    subjectZh: '全渠道正式稳态运营',
    phase: 'execution',
    status: 'New',
    startDate: '11/16/2026',
    finishDate: '12/07/2026',
    duration: '22 days',
    progressPercent: 0,
  },

  // ── MONITORING & CONTROLLING ──
  {
    id: 63,
    type: 'SUMMARY TASK',
    subject: 'MONITORING & CONTROLLING',
    subjectZh: '全程品控与风险监测 (Monitoring)',
    phase: 'monitoring',
    status: 'In Progress',
    startDate: '09/01/2026',
    finishDate: '12/15/2026',
    duration: '106 days',
    progressPercent: 50,
  },
  {
    id: 64,
    type: 'TASK',
    subject: 'Monitoring jadwal, biaya & risiko',
    subjectZh: '工期进度、支出明细与合规风险监控',
    phase: 'monitoring',
    status: 'In Progress',
    startDate: '09/01/2026',
    finishDate: '12/15/2026',
    duration: '106 days',
    progressPercent: 50,
  },
  {
    id: 65,
    type: 'TASK',
    subject: 'Tracking penjualan harian',
    subjectZh: '每日流水与客单转化率实时跟踪',
    phase: 'monitoring',
    status: 'New',
    startDate: '11/16/2026',
    finishDate: '12/07/2026',
    duration: '22 days',
    progressPercent: 0,
  },
  {
    id: 66,
    type: 'TASK',
    subject: 'Monitoring rating aplikasi',
    subjectZh: '商户评分与消费者评价预警',
    phase: 'monitoring',
    status: 'New',
    startDate: '11/08/2026',
    finishDate: '12/07/2026',
    duration: '30 days',
    progressPercent: 0,
  },

  // ── CLOSING (Penutupan Proyek) ──
  {
    id: 67,
    type: 'SUMMARY TASK',
    subject: 'CLOSING (Penutupan Proyek)',
    subjectZh: '项目审计与损益收尾 (Closing)',
    phase: 'closing',
    status: 'New',
    startDate: '12/08/2026',
    finishDate: '12/15/2026',
    duration: '8 days',
    progressPercent: 0,
  },
  {
    id: 68,
    type: 'TASK',
    subject: 'Rekonsiliasi budget',
    subjectZh: '预算对账与实际资金消耗复盘',
    phase: 'closing',
    status: 'New',
    startDate: '12/08/2026',
    finishDate: '12/11/2026',
    duration: '4 days',
    progressPercent: 0,
  },
  {
    id: 69,
    type: 'TASK',
    subject: 'Proyeksi cash flow & perhitungan BEP',
    subjectZh: '现金流盈余投影与盈亏平衡点 (BEP) 测算',
    phase: 'closing',
    status: 'New',
    startDate: '12/08/2026',
    finishDate: '12/12/2026',
    duration: '5 days',
    progressPercent: 0,
  },
  {
    id: 70,
    type: 'TASK',
    subject: 'Evaluasi kinerja proyek',
    subjectZh: '综合经营绩效与ROI回报评估',
    phase: 'closing',
    status: 'New',
    startDate: '12/08/2026',
    finishDate: '12/14/2026',
    duration: '7 days',
    progressPercent: 0,
  },
  {
    id: 71,
    type: 'TASK',
    subject: 'Penyusunan & submit laporan akhir',
    subjectZh: '编制财务及管理总结报告并归档',
    phase: 'closing',
    status: 'New',
    startDate: '12/10/2026',
    finishDate: '12/15/2026',
    duration: '6 days',
    progressPercent: 0,
  },
];

interface ProjectGanttCardProps {
  locale?: Locale;
}

export const ProjectGanttCard: React.FC<ProjectGanttCardProps> = ({ locale = 'en' }) => {
  const [activePhase, setActivePhase] = useState<'all' | 'initiation' | 'planning' | 'execution' | 'monitoring' | 'closing'>('all');
  const [viewMode, setViewMode] = useState<'gantt' | 'table'>('gantt');

  const filteredItems = activePhase === 'all'
    ? GANTT_PROJECT_DATA
    : GANTT_PROJECT_DATA.filter((item) => item.phase === activePhase);

  return (
    <div className="w-full bg-white rounded-[16px] border border-[rgba(15,23,42,0.12)] p-4 shadow-sm overflow-hidden my-3">
      {/* Header with Title & Badges */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center font-bold text-xs">
            📊
          </div>
          <div>
            <h3 className="text-[14px] font-bold text-slate-900 leading-snug">
              {locale === 'zh'
                ? '智能体项目执行时间线与甘特里程碑 (Ask Chop 推荐)'
                : 'Project Schedule & Gantt Milestone Plan (Ask Chop)'}
            </h3>
            <p className="text-[11px] text-slate-500">
              {locale === 'zh'
                ? '5大执行阶段 · 32个任务项 · 包含 HPP (COGS)、POS 部署及 BEP 测算'
                : '5 Execution Phases · 32 Tasks · Including HPP (COGS), POS & BEP Projection'}
            </p>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto bg-slate-100 p-1 rounded-lg">
          <button
            type="button"
            onClick={() => setViewMode('gantt')}
            className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-all cursor-pointer ${
              viewMode === 'gantt'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            {locale === 'zh' ? '甘特进度图' : 'Gantt Chart'}
          </button>
          <button
            type="button"
            onClick={() => setViewMode('table')}
            className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-all cursor-pointer ${
              viewMode === 'table'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            {locale === 'zh' ? '明细表' : 'Table List'}
          </button>
        </div>
      </div>

      {/* Phase Filters */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-2.5 no-scrollbar">
        {[
          { key: 'all', labelEn: 'All Phases', labelZh: '全部阶段' },
          { key: 'initiation', labelEn: '1. Initiation', labelZh: '1. 起步立项' },
          { key: 'planning', labelEn: '2. Planning', labelZh: '2. 成本规划' },
          { key: 'execution', labelEn: '3. Execution', labelZh: '3. 开业落地' },
          { key: 'monitoring', labelEn: '4. Monitoring', labelZh: '4. 品控监测' },
          { key: 'closing', labelEn: '5. Closing', labelZh: '5. 审计收尾' },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActivePhase(tab.key as any)}
            className={`px-2.5 py-1 rounded-full text-[11.5px] font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activePhase === tab.key
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {locale === 'zh' ? tab.labelZh : tab.labelEn}
          </button>
        ))}
      </div>

      {/* Gantt Motion View */}
      {viewMode === 'gantt' ? (
        <div className="w-full overflow-x-auto mt-2">
          <div className="min-w-[620px]">
            {/* Header Timeline Legend */}
            <div className="grid grid-cols-12 gap-2 text-[10.5px] font-bold text-slate-500 uppercase px-2 py-1.5 bg-slate-50 rounded-lg mb-2">
              <span className="col-span-5">{locale === 'zh' ? '任务主题与里程碑' : 'Task & Milestone'}</span>
              <span className="col-span-2 text-center">{locale === 'zh' ? '工期' : 'Duration'}</span>
              <span className="col-span-5">{locale === 'zh' ? '执行进度与时间跨度' : 'Timeline Progress'}</span>
            </div>

            {/* Tasks list */}
            <div className="space-y-1.5 max-h-[360px] overflow-y-auto pr-1">
              {filteredItems.map((item) => {
                const isSummary = item.type === 'SUMMARY TASK';
                const isMilestone = item.isMilestone;

                return (
                  <div
                    key={item.id}
                    className={`grid grid-cols-12 gap-2 items-center px-2 py-1.5 rounded-lg text-[12px] transition-colors ${
                      isSummary
                        ? 'bg-amber-50/70 font-bold text-amber-950 border border-amber-200/60'
                        : isMilestone
                        ? 'bg-emerald-50/70 font-semibold text-emerald-950 border border-emerald-200/60'
                        : 'bg-white hover:bg-slate-50/80 border border-slate-100 text-slate-800'
                    }`}
                  >
                    {/* ID & Title */}
                    <div className="col-span-5 flex items-center gap-1.5 truncate">
                      <span className={`text-[10px] font-mono px-1 py-0.5 rounded ${
                        isSummary ? 'bg-amber-200 text-amber-800' : isMilestone ? 'bg-emerald-200 text-emerald-800' : 'bg-slate-100 text-slate-600'
                      }`}>
                        #{item.id}
                      </span>
                      <span className="truncate" title={item.subject}>
                        {locale === 'zh' && item.subjectZh ? item.subjectZh : item.subject}
                      </span>
                    </div>

                    {/* Duration & Status */}
                    <div className="col-span-2 text-center text-[11px] font-mono">
                      <span className={`px-1.5 py-0.5 rounded-full text-[10.5px] ${
                        item.status === 'Completed'
                          ? 'bg-green-100 text-green-700 font-semibold'
                          : item.status === 'In Progress'
                          ? 'bg-blue-100 text-blue-700 font-semibold'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {item.duration}
                      </span>
                    </div>

                    {/* Progress Bar / Milestone Diamond */}
                    <div className="col-span-5 flex items-center gap-2">
                      {isMilestone ? (
                        <div className="flex items-center gap-2 w-full">
                          <span className="inline-block w-3.5 h-3.5 rotate-45 bg-emerald-500 border-2 border-white shadow-xs" />
                          <span className="text-[10px] font-semibold text-emerald-700">
                            {locale === 'zh' ? '关键里程碑节点' : 'Target Milestone'} ({item.finishDate})
                          </span>
                        </div>
                      ) : (
                        <div className="w-full flex items-center gap-2">
                          <div className="flex-1 h-3 rounded-full bg-slate-100 overflow-hidden relative">
                            <div
                              className={`h-full rounded-full transition-all duration-700 ${
                                isSummary
                                  ? 'bg-gradient-to-r from-amber-400 to-orange-500'
                                  : 'bg-gradient-to-r from-blue-500 to-indigo-600'
                              }`}
                              style={{ width: `${item.progressPercent}%` }}
                            />
                          </div>
                          <span className="text-[10px] font-mono font-semibold text-slate-500 w-8 text-right">
                            {item.progressPercent}%
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* Table List View */
        <div className="w-full overflow-x-auto mt-2">
          <table className="w-full text-left text-[11.5px] border-collapse min-w-[580px]">
            <thead>
              <tr className="bg-slate-50 text-slate-500 border-b border-slate-200">
                <th className="p-2 font-bold">ID</th>
                <th className="p-2 font-bold">Type</th>
                <th className="p-2 font-bold">Subject</th>
                <th className="p-2 font-bold">Status</th>
                <th className="p-2 font-bold">Start Date</th>
                <th className="p-2 font-bold">Finish Date</th>
                <th className="p-2 font-bold">Duration</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr
                  key={item.id}
                  className={`border-b border-slate-100 transition-colors ${
                    item.type === 'SUMMARY TASK'
                      ? 'bg-amber-50/50 font-bold'
                      : item.type === 'MILESTONE'
                      ? 'bg-emerald-50/50 font-semibold'
                      : 'hover:bg-slate-50'
                  }`}
                >
                  <td className="p-2 font-mono text-slate-500">#{item.id}</td>
                  <td className="p-2">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      item.type === 'SUMMARY TASK'
                        ? 'bg-amber-100 text-amber-800'
                        : item.type === 'MILESTONE'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {item.type}
                    </span>
                  </td>
                  <td className="p-2 text-slate-800">
                    {locale === 'zh' && item.subjectZh ? item.subjectZh : item.subject}
                  </td>
                  <td className="p-2">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      item.status === 'Completed'
                        ? 'bg-emerald-100 text-emerald-700'
                        : item.status === 'In Progress'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="p-2 font-mono text-slate-600">{item.startDate}</td>
                  <td className="p-2 font-mono text-slate-600">{item.finishDate}</td>
                  <td className="p-2 font-mono text-slate-700 font-semibold">{item.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Summary Footer */}
      <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between text-[11px] text-slate-500 gap-2">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
            <span>Summary Phase</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />
            <span>Active Task</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rotate-45 bg-emerald-500 inline-block" />
            <span>Milestone (Lokasi & POS)</span>
          </span>
        </div>
        <div className="font-semibold text-slate-700">
          {locale === 'zh' ? '总工期：106工作日' : 'Total Schedule Horizon: 106 Business Days'}
        </div>
      </div>
    </div>
  );
};
