// src/components/EpidemicChart.tsx
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { EpidemicStats } from '../types';

interface Props {
  data: EpidemicStats[];
}

const EpidemicChart: React.FC<Props> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const width = 600
  const height = 250
  useEffect(() => {
    if (!svgRef.current || data.length === 0) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Очистить предыдущий график

    const margin = { top: 20, right: 20, bottom: 50, left: 60 };

    const x = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.day) || 10])
      .range([margin.left, width - margin.right]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.healthy + d.infected + d.recovered) || 200])
      .nice()
      .range([height - margin.bottom, margin.top]);

    // Линия заражённых
    svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "red")
      .attr("stroke-width", 2)
      .attr("d", d3.line<EpidemicStats>()
        .x(d => x(d.day))
        .y(d => y(d.infected))
      );

    // Линия здоровых
    svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "green")
      .attr("stroke-width", 2)
      .attr("d", d3.line<EpidemicStats>()
        .x(d => x(d.day))
        .y(d => y(d.healthy))
      );

    // Линия выздоровевших
    svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "blue")
      .attr("stroke-width", 2)
      .attr("d", d3.line<EpidemicStats>()
        .x(d => x(d.day))
        .y(d => y(d.recovered))
      );

    // Оси

    const xAxis = d3.axisBottom(x).ticks(Math.min(10, data.length));
    const yAxis = d3.axisLeft(y);

    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(xAxis)
      .append("text")
      .attr("x", (width + margin.left - margin.right) / 2)
      .attr("y", 40)
      .attr("text-anchor", "middle")
      .attr("fill", "white")
      .attr('font-size', 13)
      .text("День");

    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(yAxis)
      .append("text")
      .attr("x", -height / 2)
      .attr("y", -40)
      .attr("text-anchor", "middle")
      .attr("transform", "rotate(-90)")
      .attr("fill", "white")
      .attr('font-size', 13)

      .text("Количество людей");

    // Легенда
    const legend = svg.append("g").attr("transform", `translate(${width - 150},20)`);
    legend.append("rect").attr("width", 15).attr("height", 15).attr("fill", "red");
    legend.append("text").attr("x", 20).attr("y", 12).attr("fill", "white").text("Заражённые");

    legend.append("rect").attr("width", 15).attr("height", 15).attr("fill", "green").attr("y", 20);
    legend.append("text").attr("x", 20).attr("y", 32).attr("fill", "white").text("Здоровые");

    legend.append("rect").attr("width", 15).attr("height", 15).attr("fill", "blue").attr("y", 40);
    legend.append("text").attr("x", 20).attr("y", 52).attr("fill", "white").text("Выздоровевшие");

  }, [data]);

  return <svg className='border-1 border-[#3e3c4bc7] rounded-2xl' ref={svgRef} width={width} height={height} />;
};

export default EpidemicChart;