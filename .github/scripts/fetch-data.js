const axios = require('axios')
const fs = require('fs').promises;
const path = require('path');

async function fetchFloodData() {
    try {
        // Fetch data from JKM API
        const response = await axios.get('https://infobencanajkmv2.jkm.gov.my/api/data-dashboard-table-pps.php', {
            params: {
                seasonmain_id: '208',
                seasonnegeri_id: ''
            },
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        // Process the data
        const processedData = {
            data: response.data,
            last_updated: new Date().toISOString(),
            metadata: {
                source: 'JKM InfoBencana',
                url: 'https://infobencanajkmv2.jkm.gov.my',
                update_frequency: '30 minutes'
            }
        };

        // Write to file
        const filePath = path.join(__dirname, '../../docs/data/flood_data.json');
        await fs.writeFile(filePath, JSON.stringify(processedData, null, 2));
        console.log('Data updated successfully');
    } catch (error) {
        console.error('Error fetching data:', error.message);
        process.exit(1);
    }
}

fetchFloodData();
