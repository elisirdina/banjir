// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add active class to navigation items based on scroll position
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav ul li a');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (window.pageYOffset >= sectionTop - 60) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').substring(1) === current) {
            link.classList.add('active');
        }
    });
});

// Fetch data from the API
async function fetchData() {
    try {
        const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
        const apiUrl = 'https://infobencanajkmv2.jkm.gov.my/api/data-dashboard-table-pps.php?a=0&b=0&seasonmain_id=208&seasonnegeri_id=';
        
        const response = await fetch(proxyUrl + apiUrl, {
            mode: 'cors',
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Fetched data:', result);

        // Extract the "ppsbuka" array
        const data = result.ppsbuka || []; // Default to an empty array if undefined
        return data;

    } catch (error) {
        console.error('Error fetching data:', error);
        return getSampleData();
    }
}

// Sample data for demonstration when API is not accessible
function getSampleData() {
    return [
        {
            negeri: "KELANTAN",
            daerah: "KOTA BHARU",
            nama_pps: "SK KEDAI LALAT",
            jumlah_keluarga: "50",
            jumlah_mangsa: "186"
        },
        {
            negeri: "KELANTAN",
            daerah: "PASIR MAS",
            nama_pps: "SK KUBANG KERIAN",
            jumlah_keluarga: "45",
            jumlah_mangsa: "167"
        },
        {
            negeri: "TERENGGANU",
            daerah: "BESUT",
            nama_pps: "SK BUKIT PAYONG",
            jumlah_keluarga: "30",
            jumlah_mangsa: "120"
        },
        {
            negeri: "TERENGGANU",
            daerah: "KUALA TERENGGANU",
            nama_pps: "SK GONG BADAK",
            jumlah_keluarga: "25",
            jumlah_mangsa: "98"
        },
        {
            negeri: "PAHANG",
            daerah: "KUANTAN",
            nama_pps: "SK TANJUNG LUMPUR",
            jumlah_keluarga: "35",
            jumlah_mangsa: "142"
        }
    ];
}

// Update statistics cards
function updateStats(data) {
    const totalPPS = data.length;
    const totalEvacuees = data.reduce((sum, item) => sum + parseInt(item.mangsa || 0), 0);
    const totalFamilies = data.reduce((sum, item) => sum + parseInt(item.keluarga || 0), 0);

    document.querySelector('#total-pps .stat-value').textContent = totalPPS.toLocaleString();
    document.querySelector('#total-evacuees .stat-value').textContent = totalEvacuees.toLocaleString();
    document.querySelector('#total-families .stat-value').textContent = totalFamilies.toLocaleString();
}

// Create bar chart for evacuees by state
function createStateChart(data) {
    // Group data by state
    const stateData = d3.group(data, d => d.negeri);
    const stateEvacuees = Array.from(stateData, ([state, items]) => ({
        state,
        evacuees: d3.sum(items, d => parseInt(d.jumlah_mangsa))
    })).sort((a, b) => b.evacuees - a.evacuees);

    // Set up dimensions
    const margin = {top: 20, right: 20, bottom: 60, left: 60};
    const width = document.querySelector('#state-chart .chart-area').clientWidth - margin.left - margin.right;
    const height = document.querySelector('#state-chart .chart-area').clientHeight - margin.top - margin.bottom;

    // Clear previous chart
    d3.select('#state-chart .chart-area').html('');

    // Create SVG
    const svg = d3.select('#state-chart .chart-area')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    // Create scales
    const x = d3.scaleBand()
        .domain(stateEvacuees.map(d => d.state))
        .range([0, width])
        .padding(0.1);

    const y = d3.scaleLinear()
        .domain([0, d3.max(stateEvacuees, d => d.evacuees)])
        .range([height, 0]);

    // Create axes
    svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll('text')
        .attr('transform', 'rotate(-45)')
        .style('text-anchor', 'end');

    svg.append('g')
        .call(d3.axisLeft(y));

    // Create bars
    svg.selectAll('rect')
        .data(stateEvacuees)
        .enter()
        .append('rect')
        .attr('x', d => x(d.state))
        .attr('y', d => y(d.evacuees))
        .attr('width', x.bandwidth())
        .attr('height', d => height - y(d.evacuees))
        .attr('fill', '#3498db');
}

// Create pie chart for PPS distribution
function createPPSChart(data) {
    // Group data by district
    const districtData = d3.group(data, d => d.daerah);
    const districtCounts = Array.from(districtData, ([district, items]) => ({
        district,
        count: items.length
    })).sort((a, b) => b.count - a.count);

    // Set up dimensions
    const width = document.querySelector('#pps-chart .chart-area').clientWidth;
    const height = document.querySelector('#pps-chart .chart-area').clientHeight;
    const radius = Math.min(width, height) / 2;

    // Clear previous chart
    d3.select('#pps-chart .chart-area').html('');

    // Create SVG
    const svg = d3.select('#pps-chart .chart-area')
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', `translate(${width/2},${height/2})`);

    // Create color scale
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    // Create pie chart
    const pie = d3.pie()
        .value(d => d.count);

    const arc = d3.arc()
        .innerRadius(radius * 0.3)
        .outerRadius(radius * 0.6);

    // Add the arcs
    const arcs = svg.selectAll('arc')
        .data(pie(districtCounts))
        .enter()
        .append('g');

    arcs.append('path')
        .attr('d', arc)
        .attr('fill', (d, i) => color(i));

    // Add labels
    arcs.append('text')
        .attr('transform', d => `translate(${arc.centroid(d)})`)
        .attr('text-anchor', 'middle')
        .text(d => d.data.district)
        .style('font-size', '10px')
        .style('fill', 'white');
}

// Populate data table
function populateTable(data) {
    const tbody = document.querySelector('#pps-table tbody');
    tbody.innerHTML = '';

    data.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.nama}</td>
            <td>${item.negeri}</td>
            <td>${item.daerah}</td>
            <td>${item.mukim}</td>
            <td>${parseInt(item.buka).toLocaleString()}</td>
            <td>${parseInt(item.kapasiti).toLocaleString()}</td>
            <td>${parseInt(item.mangsa).toLocaleString()}</td>
            <td>${parseInt(item.keluarga).toLocaleString()}</td>
            <td>${parseInt(item.lelaki_dewasa).toLocaleString()}</td>
            <td>${parseInt(item.perempuan_dewasa).toLocaleString()}</td>
            <td>${parseInt(item.kanak_lelaki).toLocaleString()}</td>
            <td>${parseInt(item.kanak_perempuan).toLocaleString()}</td>
            <td>${parseInt(item.bayi_lelaki).toLocaleString()}</td>
            <td>${parseInt(item.bayi_perempuan).toLocaleString()}</td>
        `;
        tbody.appendChild(row);
    });
}

// Update last updated timestamp
function updateTimestamp() {
    const now = new Date();
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short'
    };
    document.getElementById('last-updated').textContent = `Last updated: ${now.toLocaleDateString('en-MY', options)}`;
}

// Initialize dashboard
async function initDashboard() {
    // Show loading state
    document.querySelectorAll('.stat-value').forEach(el => {
        el.textContent = 'Loading...';
    });

    const data = await fetchData();
    if (data && data.length > 0) {
        // Prepare chart data
        const chartData = {
            labels: data.map(item => item.nama_pps), // Extract PPS names
            datasets: [{
                data: data.map(item => parseInt(item.jumlah_mangsa)), // Extract evacuee counts
                label: 'Number of Evacuees'
            }]
        };

        console.log('Chart Data:', chartData); // Debugging purposes

        updateStats(data);
        createStateChart(data);
        createPPSChart(data);
        populateTable(data);
        updateTimestamp();
    } else {
        // Handle errors
        document.querySelectorAll('.stat-value').forEach(el => {
            el.textContent = 'Error loading data';
        });
        document.querySelector('#state-chart .chart-area').innerHTML = '<p class="error-message">Error loading chart data</p>';
        document.querySelector('#pps-chart .chart-area').innerHTML = '<p class="error-message">Error loading chart data</p>';
        document.querySelector('#pps-table tbody').innerHTML = '<tr><td colspan="5">Error loading table data</td></tr>';
        document.getElementById('last-updated').textContent = 'Failed to update data';
    }
}

// Handle window resize
window.addEventListener('resize', () => {
    initDashboard();
});

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initDashboard);