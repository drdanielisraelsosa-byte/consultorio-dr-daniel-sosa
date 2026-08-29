"use client";

import { isoDate } from "../calendar-utils";
import { MONTHS, YEARS } from "../site-config";

export function CalendarExplorer({
  selected,
  now,
  onSelect,
}: {
  selected: Date;
  now: Date;
  onSelect: (date: Date) => void;
}) {
  const year = selected.getFullYear();
  const month = selected.getMonth();
  const firstDay = (new Date(year, month, 1).getDay() + 6) % 7;
  const count = new Date(year, month + 1, 0).getDate();
  const cells = [...Array(firstDay).fill(null), ...Array.from({ length: count }, (_, i) => i + 1)];

  function chooseYear(y: number) {
    onSelect(new Date(y, Math.max(y === 2026 ? 7 : 0, Math.min(month, 11)), 1));
  }
  function chooseMonth(m: number) {
    if (year === 2026 && m < 7) return;
    onSelect(new Date(year, m, 1));
  }
  function moveMonth(delta: number) {
    const date = new Date(year, month + delta, 1);
    if (date >= new Date(2026, 7, 1) && date <= new Date(2030, 11, 1)) onSelect(date);
  }

  return (
    <details className="calendar-explorer">
      <summary>
        <span><b>Explorar otras fechas</b><small>Ver calendario mensual y años disponibles</small></span>
        <i aria-hidden="true">＋</i>
      </summary>
      <section className="panel month-panel" aria-label="Calendario mensual">
        <div className="panel-head">
          <button className="navbtn" onClick={() => moveMonth(-1)} aria-label="Mes anterior">‹</button>
          <h2>{MONTHS[month]} {year}</h2>
          <button className="navbtn" onClick={() => moveMonth(1)} aria-label="Mes siguiente">›</button>
        </div>
        <details className="period-picker">
          <summary>Cambiar mes o año</summary>
          <div className="year-row">{YEARS.map(y => <button key={y} className={`year-chip ${year === y ? "active" : ""}`} onClick={() => chooseYear(y)}>{y}</button>)}</div>
          <div className="month-row">{MONTHS.map((name, m) => <button key={name} disabled={year === 2026 && m < 7} className={`month-chip ${month === m ? "active" : ""}`} onClick={() => chooseMonth(m)}>{name.slice(0, 3)}</button>)}</div>
        </details>
        <div className="month-grid">
          {["L", "M", "M", "J", "V", "S", "D"].map((d, i) => <div className="weekday" key={i}>{d}</div>)}
          {cells.map((day, i) => {
            if (day === null) return <span className="daycell empty" key={`e${i}`} />;
            const date = new Date(year, month, day);
            const key = isoDate(date);
            const past = date < new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const sunday = date.getDay() === 0;
            const active = key === isoDate(selected);
            const current = key === isoDate(now);
            return <button key={key} disabled={past || sunday} className={`daycell ${past ? "past" : ""} ${sunday ? "sunday" : ""} ${active ? "selected" : ""} ${current ? "today" : ""}`} onClick={() => onSelect(date)}>{day}</button>;
          })}
        </div>
        <p className="mini-note"><b>Horario de atención:</b> 9:00 a 14:00 y 16:00 a 21:00. El periodo de 14:00 a 16:00 está reservado para comida.</p>
      </section>
    </details>
  );
}
