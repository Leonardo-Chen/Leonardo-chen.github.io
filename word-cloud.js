// 词云数据
const words = [
  { text: "Arduino", value: 10, category: "Hardware Development" },
  { text: "ESP32", value: 9, category: "Hardware Development" },
  { text: "DFPlayer", value: 8, category: "Hardware Development" },
  { text: "LIS3DHTR", value: 7, category: "Hardware Development" },
  { text: "RFID", value: 7, category: "Hardware Development" },
  { text: "ChatGPT API", value: 10, category: "Artificial Intelligence" },
  { text: "AI Drawing Board", value: 9, category: "Artificial Intelligence" },
  { text: "AI filter", value: 9, category: "Artificial Intelligence" },
  { text: "Visual Recognition", value: 10, category: "Artificial Intelligence" },
  { text: "Machine Learning", value: 8, category: "Artificial Intelligence" },
  { text: "Projection Interaction", value: 8, category: "Artificial Intelligence" },
  { text: "LLaMA", value: 10, category: "Artificial Intelligence" },
  { text: "Web Development", value: 7, category: "Web Development" },
  { text: "HTML", value: 7, category: "Web Development" },
  { text: "JavaScript", value: 7, category: "Web Development" },
  { text: "CSS", value: 7, category: "Web Development" },
  { text: "User Experience", value: 8, category: "User Experience Design" },
  { text: "Career Matching", value: 8, category: "User Experience Design" },
  { text: "Team Integration", value: 8, category: "User Experience Design" },
  { text: "Mental Health", value: 9, category: "User Experience Design" },
  { text: "Human-Computer Interaction", value: 8, category: "User Experience Design" },
  { text: "Interaction Design", value: 9, category: "Interactive Art" },
  { text: "AI-Generated Art", value: 9, category: "Interactive Art" },
  { text: "Video Mapping", value: 8, category: "Interactive Art" },
  { text: "Image Recognition", value: 8, category: "Interactive Art" },
  { text: "Contemporary Art", value: 6, category: "Contemporary Art" },
  { text: "Tech & Culture", value: 6, category: "Contemporary Art" },
  { text: "Origami", value: 5, category: "Origami Art" },
  { text: "Italian", value: 9, category: "Language Skills" },
  { text: "English", value: 8, category: "Language Skills" },
  { text: "Chinese", value: 10, category: "Language Skills" },
  { text: "Photography", value: 10, category: "Cultural Arts" },
  { text: "Hand Drawing", value: 9, category: "Cultural Arts" },
  { text: "Guitar", value: 6, category: "Cultural Arts" },
  { text: "Data Analysis", value: 6, category: "Big Data" },
  { text: "Data Visualization", value: 6, category: "Big Data" },
  { text: "Fusion 360", value: 9, category: "Industrial Design" },
  { text: "Laser Cutting", value: 6, category: "Industrial Design" },
  { text: "Illustrator", value: 8, category: "Graphic Design" },
  { text: "Flourish", value: 8, category: "Big Data" },
  { text: "Google Chart", value: 6, category: "Big Data" },
  { text: "Photoshop", value: 8, category: "Graphic Design" }
];

// 颜色映射
const categoryColors = {
  "Hardware Development": "#1844e3",
  "Artificial Intelligence": "#4d7cff",
  "Web Development": "#00a8ff",
  "User Experience Design": "#0097e6",
  "Interactive Art": "#00d2d3",
  "Contemporary Art": "#54a0ff",
  "Origami Art": "#5f27cd",
  "Language Skills": "#341f97",
  "Cultural Arts": "#0abde3",
  "Big Data": "#2e86de",
  "Industrial Design": "#45aaf2",
  "Graphic Design": "#4b7bec"
};

// 创建词云
function createWordCloud() {
  const width = document.getElementById('word-cloud').offsetWidth;
  const height = 600;

  // 创建提示框
  const tooltip = d3.select("#word-cloud")
    .append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("visibility", "hidden")
    .style("background", "rgba(255, 255, 255, 0.7)")
    .style("backdrop-filter", "blur(20px)")
    .style("-webkit-backdrop-filter", "blur(20px)")
    .style("padding", "12px 16px")
    .style("border-radius", "16px")
    .style("border", "1px solid rgba(255, 255, 255, 0.3)")
    .style("box-shadow", 
      "0 8px 32px rgba(0, 0, 0, 0.1), " +
      "inset 0 0 0 1px rgba(255, 255, 255, 0.4)")
    .style("font-family", "Plus Jakarta Sans")
    .style("font-size", "14px")
    .style("color", "#333")
    .style("pointer-events", "none")
    .style("z-index", "1000")
    .style("transition", "all 0.3s ease");

  // 创建SVG容器
  const svg = d3.select("#word-cloud")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${width/2},${height/2})`);

  // 创建词云布局
  const layout = d3.layout.cloud()
    .size([width, height])
    .words(words)
    .padding(5)
    .rotate(() => 0)
    .font("Plus Jakarta Sans")
    .fontSize(d => d.value * 4)
    .on("end", draw);

  layout.start();

  function draw(words) {
    svg.selectAll("text")
      .data(words)
      .enter().append("text")
      .style("font-size", d => `${d.size}px`)
      .style("font-family", "Plus Jakarta Sans")
      .style("fill", d => categoryColors[d.category])
      .attr("text-anchor", "middle")
      .attr("transform", d => `translate(${d.x},${d.y}) rotate(${d.rotate})`)
      .text(d => d.text)
      .style("cursor", "pointer")
      .on("mouseover", function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .style("opacity", 0.7)
          .style("font-weight", "bold");

        tooltip
          .style("visibility", "visible")
          .style("opacity", "0")
          .html(`
            <div style="text-align: center;">
              <strong style="font-size: 16px; color: ${categoryColors[d.category]}">${d.text}</strong>
              <div style="margin-top: 4px; font-size: 13px; color: #666;">Weight: ${d.value}/10</div>
            </div>
          `)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 28) + "px")
          .transition()
          .duration(200)
          .style("opacity", "1")
          .style("transform", "translateY(-5px)");
      })
      .on("mousemove", function(event) {
        tooltip
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 28) + "px");
      })
      .on("mouseout", function() {
        d3.select(this)
          .transition()
          .duration(200)
          .style("opacity", 1)
          .style("font-weight", "normal");

        tooltip
          .transition()
          .duration(200)
          .style("opacity", "0")
          .style("transform", "translateY(0)")
          .end()
          .then(() => tooltip.style("visibility", "hidden"));
      });
  }
}

// 页面加载完成后创建词云
document.addEventListener('DOMContentLoaded', createWordCloud);

// 窗口大小改变时重新创建词云
window.addEventListener('resize', () => {
  d3.select("#word-cloud").selectAll("*").remove();
  createWordCloud();
}); 