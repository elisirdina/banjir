// Toggle dark mode
const darkModeToggle = document.getElementById('darkModeToggle');
darkModeToggle.addEventListener('click', (e) => {
    e.preventDefault();
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    darkModeToggle.textContent = isDarkMode ? '☀ Light Mode' : '🌙 Dark Mode';
});

// Initialize tooltips
const tooltip = d3.select('body')
    .append('div')
    .attr('class', 'tooltip')
    .style('opacity', 0);

// Fetch data from JKM API
async function fetchData() {
    try {
        // Use our proxy server to avoid CORS issues
        const response = await fetch('/api/flood-data');
        const jsonData = await response.json();
        
        // Transform the data to match our expected format
        return jsonData.map(item => ({
            daerah: item.daerah,
            jumlah_mangsa: item.jumlah_mangsa || '0',
            jumlah_keluarga: item.jumlah_keluarga || '0',
            pps_count: parseInt(item.pps_count || '0')
        }));
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}

// Process data for visualization
function processData(data) {
    // Calculate totals for each district
    const districtSummary = data.map(d => ({
        district: d.daerah,
        evacuees: parseInt(d.jumlah_mangsa),
        families: parseInt(d.jumlah_keluarga),
        pps: d.pps_count
    }));

    // Calculate overall totals
    const totals = {
        pps: d3.sum(data, d => d.pps_count),
        evacuees: d3.sum(data, d => parseInt(d.jumlah_mangsa)),
        families: d3.sum(data, d => parseInt(d.jumlah_keluarga))
    };

    return { districtSummary, totals };
}

// Update summary statistics
function updateStats(totals) {
    document.querySelector('#total-pps .stat-value').textContent = totals.pps.toLocaleString();
    document.querySelector('#total-evacuees .stat-value').textContent = totals.evacuees.toLocaleString();
    document.querySelector('#total-families .stat-value').textContent = totals.families.toLocaleString();
    
    // Update last updated time
    const now = new Date();
    document.getElementById('update-time').textContent = now.toLocaleString();
}

// Create bar chart
function createBarChart(data) {
    const margin = {top: 20, right: 20, bottom: 60, left: 60};
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Clear previous chart
    d3.select("#bar-chart").html("");

    const svg = d3.select("#bar-chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand()
        .range([0, width])
        .padding(0.1);

    const y = d3.scaleLinear()
        .range([height, 0]);

    x.domain(data.map(d => d.district));
    y.domain([0, d3.max(data, d => d.evacuees)]);

    // Add X axis
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end");

    // Add Y axis
    svg.append("g")
        .call(d3.axisLeft(y));

    // Add bars
    svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.district))
        .attr("width", x.bandwidth())
        .attr("y", d => y(d.evacuees))
        .attr("height", d => height - y(d.evacuees))
        .on("mouseover", function(event, d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html(`District: ${d.district}<br/>Evacuees: ${d.evacuees}`)
                .style("left", (event.pageX) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });
}

// Create pie chart
function createPieChart(data) {
    const width = 400;
    const height = 400;
    const radius = Math.min(width, height) / 2;

    // Clear previous chart
    d3.select("#pie-chart").html("");

    const svg = d3.select("#pie-chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width/2},${height/2})`);

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const pie = d3.pie()
        .value(d => d.pps);

    const arc = d3.arc()
        .innerRadius(0)
        .outerRadius(radius);

    const arcs = svg.selectAll("arc")
        .data(pie(data))
        .enter()
        .append("g");

    arcs.append("path")
        .attr("d", arc)
        .attr("fill", (d, i) => color(i))
        .on("mouseover", function(event, d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html(`District: ${d.data.district}<br/>PPS Count: ${d.data.pps}`)
                .style("left", (event.pageX) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });
}

// Create data table
function createDataTable(data) {
    const table = d3.select("#data-table")
        .html("")
        .append("table")
        .attr("class", "data-table");

    // Add header
    const header = table.append("thead").append("tr");
    header.append("th").text("District");
    header.append("th").text("PPS");
    header.append("th").text("Evacuees");
    header.append("th").text("Families");

    // Add rows
    const tbody = table.append("tbody");
    const rows = tbody.selectAll("tr")
        .data(data)
        .enter()
        .append("tr");

    rows.append("td").text(d => d.district);
    rows.append("td").text(d => d.pps);
    rows.append("td").text(d => d.evacuees);
    rows.append("td").text(d => d.families);
}

// Initialize dashboard
async function initDashboard() {
    try {
        const rawData = await fetchData();
        const { districtSummary, totals } = processData(rawData);
        
        updateStats(totals);
        createBarChart(districtSummary);
        createPieChart(districtSummary);
        createDataTable(districtSummary);

        // Auto-refresh every 5 minutes
        setTimeout(initDashboard, 5 * 60 * 1000);
    } catch (error) {
        console.error('Error initializing dashboard:', error);
    }
}

// Start the dashboard
initDashboard();