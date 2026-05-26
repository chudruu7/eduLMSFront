// src/modules/admin/Charts.jsx
// SVG-д суурилсан жижиг chart компонентууд (нэмэлт lib шаардлагагүй).

import { useMemo, useState } from 'react';

// ── Helpers ──────────────────────────────────────────────────────
const numberFmt = (n) => Number(n || 0).toLocaleString();

// ── 1) Line chart: огноогоор өсөж буй тоон мэдээлэл (орлого / худалдан авалт) ──
export function LineChart({ data = [], width = 640, height = 200, color = '#4f46e5', label = 'Утга' }) {
  // data: [{ label: 'MM/DD', value: number }]
  const padding = { top: 16, right: 12, bottom: 28, left: 44 };
  const innerW = width - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;
  const maxValue = Math.max(1, ...data.map((d) => d.value || 0));
  const stepX = data.length > 1 ? innerW / (data.length - 1) : innerW;

  const pathD = data
    .map((d, i) => {
      const x = padding.left + i * stepX;
      const y = padding.top + innerH - ((d.value || 0) / maxValue) * innerH;
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(' ');

  const areaD =
    data.length > 0
      ? `${pathD} L ${(padding.left + (data.length - 1) * stepX).toFixed(1)} ${(padding.top + innerH).toFixed(1)} L ${padding.left} ${(padding.top + innerH).toFixed(1)} Z`
      : '';

  const yTicks = 4;
  const ticks = Array.from({ length: yTicks + 1 }, (_, i) => (maxValue * i) / yTicks);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
      {/* gridlines */}
      {ticks.map((t, i) => {
        const y = padding.top + innerH - (t / maxValue) * innerH;
        return (
          <g key={i}>
            <line x1={padding.left} x2={padding.left + innerW} y1={y} y2={y} stroke="#e5e7eb" strokeDasharray="3,3" />
            <text x={padding.left - 8} y={y + 4} fontSize="10" textAnchor="end" fill="#6b7280">
              {numberFmt(Math.round(t))}
            </text>
          </g>
        );
      })}

      {/* area fill */}
      {areaD && <path d={areaD} fill={color} fillOpacity="0.1" />}
      {/* line */}
      {pathD && <path d={pathD} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />}

      {/* points */}
      {data.map((d, i) => {
        const x = padding.left + i * stepX;
        const y = padding.top + innerH - ((d.value || 0) / maxValue) * innerH;
        return <circle key={i} cx={x} cy={y} r="3" fill="#fff" stroke={color} strokeWidth="2" />;
      })}

      {/* x-axis labels (сонгож цөөлж харуулах) */}
      {data.map((d, i) => {
        if (data.length > 10 && i % Math.ceil(data.length / 8) !== 0 && i !== data.length - 1) return null;
        const x = padding.left + i * stepX;
        return (
          <text key={i} x={x} y={height - 8} fontSize="10" textAnchor="middle" fill="#6b7280">
            {d.label}
          </text>
        );
      })}

      {!data.length && (
        <text x={width / 2} y={height / 2} fontSize="12" textAnchor="middle" fill="#9ca3af">
          Дата алга
        </text>
      )}
    </svg>
  );
}

// ── 2) Bar chart: ангилал → тоо ──
export function BarChart({ data = [], width = 640, height = 240, color = '#4f46e5', horizontal = false }) {
  // data: [{ label, value }]
  const padding = horizontal
    ? { top: 10, right: 24, bottom: 10, left: 120 }
    : { top: 10, right: 12, bottom: 40, left: 44 };
  const innerW = width - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;
  const maxValue = Math.max(1, ...data.map((d) => d.value || 0));

  if (horizontal) {
    const barH = data.length ? innerH / data.length - 6 : 0;
    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
        {data.map((d, i) => {
          const barW = ((d.value || 0) / maxValue) * innerW;
          const y = padding.top + i * (barH + 6);
          return (
            <g key={i}>
              <text x={padding.left - 8} y={y + barH / 2 + 4} fontSize="11" textAnchor="end" fill="#374151">
                {d.label}
              </text>
              <rect x={padding.left} y={y} width={barW} height={barH} rx="4" fill={d.color || color} />
              <text x={padding.left + barW + 6} y={y + barH / 2 + 4} fontSize="11" fill="#111827" fontWeight="600">
                {numberFmt(d.value)}
              </text>
            </g>
          );
        })}
        {!data.length && (
          <text x={width / 2} y={height / 2} fontSize="12" textAnchor="middle" fill="#9ca3af">
            Дата алга
          </text>
        )}
      </svg>
    );
  }

  const barW = data.length ? innerW / data.length - 8 : 0;
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
      {/* axis */}
      <line x1={padding.left} x2={padding.left + innerW} y1={padding.top + innerH} y2={padding.top + innerH} stroke="#e5e7eb" />
      {data.map((d, i) => {
        const h = ((d.value || 0) / maxValue) * innerH;
        const x = padding.left + i * (barW + 8) + 4;
        const y = padding.top + innerH - h;
        return (
          <g key={i}>
            <rect x={x} y={y} width={barW} height={h} rx="4" fill={d.color || color} />
            <text x={x + barW / 2} y={padding.top + innerH + 16} fontSize="10" textAnchor="middle" fill="#6b7280">
              {d.label}
            </text>
            {h > 14 && (
              <text x={x + barW / 2} y={y + 12} fontSize="10" textAnchor="middle" fill="#fff" fontWeight="600">
                {numberFmt(d.value)}
              </text>
            )}
          </g>
        );
      })}
      {!data.length && (
        <text x={width / 2} y={height / 2} fontSize="12" textAnchor="middle" fill="#9ca3af">
          Дата алга
        </text>
      )}
    </svg>
  );
}

// ── 3) Donut chart: хувь хэмжээ (role, payment method) ──
export function DonutChart({ data = [], size = 200, thickness = 32 }) {
  // data: [{ label, value, color }]
  const total = data.reduce((s, d) => s + (d.value || 0), 0) || 1;
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - thickness / 2;

  let cumulative = 0;
  const segments = data.map((d, i) => {
    const startAngle = (cumulative / total) * 2 * Math.PI - Math.PI / 2;
    cumulative += d.value || 0;
    const endAngle = (cumulative / total) * 2 * Math.PI - Math.PI / 2;
    const large = endAngle - startAngle > Math.PI ? 1 : 0;
    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);
    return { d: `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`, color: d.color, key: i };
  });

  return (
    <div className="flex items-center gap-4 flex-wrap">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f3f4f6" strokeWidth={thickness} />
        {segments.map((s) => (
          <path key={s.key} d={s.d} fill="none" stroke={s.color} strokeWidth={thickness} strokeLinecap="butt" />
        ))}
        <text x={cx} y={cy - 4} textAnchor="middle" fontSize="14" fontWeight="700" fill="#111827">
          {numberFmt(total)}
        </text>
        <text x={cx} y={cy + 14} textAnchor="middle" fontSize="10" fill="#6b7280">
          Нийт
        </text>
      </svg>
      <ul className="text-sm space-y-1.5">
        {data.map((d, i) => (
          <li key={i} className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded-sm" style={{ background: d.color }} />
            <span className="text-gray-700">{d.label}</span>
            <span className="font-semibold text-gray-900 ml-1">{numberFmt(d.value)}</span>
            <span className="text-gray-400 text-xs">({Math.round(((d.value || 0) / total) * 100)}%)</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ── 4) Card wrapper ──
export function ChartCard({ title, subtitle, children, right }) {
  return (
    <div className="bg-white p-5 rounded-xl shadow-lg">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-base font-bold text-gray-800">{title}</h3>
          {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
        </div>
        {right}
      </div>
      {children}
    </div>
  );
}

// ── Aggregation helpers ──────────────────────────────────────────
export function groupPurchasesByDay(purchases, days = 30) {
  // Сүүлийн N хоногийн өдөр тус бүрээр орлого + тоо
  const today = new Date();
  const map = new Map();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = `${d.getMonth() + 1}/${d.getDate()}`;
    map.set(key, { label: key, count: 0, revenue: 0 });
  }
  (purchases || []).forEach((p) => {
    const ts = p.createdAt || p.date || p.timestamp || p.paidAt;
    if (!ts) return;
    const d = new Date(ts);
    if (isNaN(d)) return;
    const key = `${d.getMonth() + 1}/${d.getDate()}`;
    const bucket = map.get(key);
    if (!bucket) return;
    bucket.count += 1;
    bucket.revenue += Number(p.amount || p.price || 0);
  });
  return Array.from(map.values());
}

export function groupPurchasesByCourse(purchases, topN = 5) {
  const map = new Map();
  (purchases || []).forEach((p) => {
    const title = p.courseTitle || p?.course?.title || p.title || 'Тодорхойгүй';
    const bucket = map.get(title) || { label: title, value: 0, revenue: 0 };
    bucket.value += 1;
    bucket.revenue += Number(p.amount || p.price || 0);
    map.set(title, bucket);
  });
  return Array.from(map.values())
    .sort((a, b) => b.value - a.value)
    .slice(0, topN);
}

export function groupUsersByRole(users) {
  const colors = { admin: '#4f46e5', teacher: '#16a34a', student: '#f59e0b' };
  const count = { admin: 0, teacher: 0, student: 0, other: 0 };
  (users || []).forEach((u) => {
    const r = u.role || 'other';
    if (count[r] !== undefined) count[r] += 1;
    else count.other += 1;
  });
  const out = [];
  if (count.admin) out.push({ label: 'Админ', value: count.admin, color: colors.admin });
  if (count.teacher) out.push({ label: 'Багш', value: count.teacher, color: colors.teacher });
  if (count.student) out.push({ label: 'Сурагч', value: count.student, color: colors.student });
  if (count.other) out.push({ label: 'Бусад', value: count.other, color: '#9ca3af' });
  return out;
}
