document.addEventListener('DOMContentLoaded', () => {
    
    // --- Subnet Calculator Logic ---
    const subnetForm = document.getElementById('subnet-form');
    if (subnetForm) {
        const cidrSelect = document.getElementById('cidr');
        
        // Populate CIDR dropdown /32 to /1
        for (let i = 32; i >= 1; i--) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = `/${i}`;
            if (i === 24) option.selected = true; // Default to /24
            cidrSelect.appendChild(option);
        }

        subnetForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const ip = document.getElementById('ipAddress').value.trim();
            const cidr = parseInt(document.getElementById('cidr').value);

            // Basic IPv4 validation
            const ipRegex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
            if (!ipRegex.test(ip)) {
                alert('Please enter a valid IPv4 address.');
                return;
            }

            calculateSubnet(ip, cidr);
        });
    }

    // --- IP Checker Logic (Mockup for now) ---
    const ipForm = document.getElementById('ip-form');
    if (ipForm) {
        ipForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const ip = document.getElementById('checkIpAddress').value.trim() || '';
            const resultsBox = document.getElementById('ip-results');
            
            // In a real app, you would call an API like ipapi.co
            // fetch(`https://ipapi.co/${ip}/json/`)
            
            // For now, we just show a mockup result
            document.getElementById('res-ip').textContent = ip || "Your Public IP";
            document.getElementById('res-type').textContent = "IPv4";
            document.getElementById('res-location').textContent = "Simulated Location, Earth";
            document.getElementById('res-isp').textContent = "Mock ISP Provider";
            
            resultsBox.classList.add('active');
        });
    }
});

// Helper function to calculate subnet details
function calculateSubnet(ip, cidr) {
    // Convert IP to integer
    const ipParts = ip.split('.').map(Number);
    const ipInt = (ipParts[0] << 24) | (ipParts[1] << 16) | (ipParts[2] << 8) | ipParts[3];

    // Calculate mask
    const maskInt = ~((1 << (32 - cidr)) - 1);
    
    // Calculate network and broadcast
    const networkInt = ipInt & maskInt;
    const broadcastInt = networkInt | ~maskInt;

    // Convert back to string
    const intToIp = (int) => {
        return [
            (int >>> 24) & 255,
            (int >>> 16) & 255,
            (int >>> 8) & 255,
            int & 255
        ].join('.');
    };

    const networkIp = intToIp(networkInt);
    const broadcastIp = intToIp(broadcastInt);
    const maskIp = intToIp(maskInt);
    
    let totalHosts = 0;
    let usableRange = "N/A";

    if (cidr <= 30) {
        totalHosts = Math.pow(2, 32 - cidr) - 2;
        usableRange = `${intToIp(networkInt + 1)} - ${intToIp(broadcastInt - 1)}`;
    } else if (cidr === 31) {
        totalHosts = 2; // Point to point
        usableRange = `${networkIp} - ${broadcastIp}`;
    } else if (cidr === 32) {
        totalHosts = 1;
        usableRange = networkIp;
    }

    // Display Results
    document.getElementById('res-network').textContent = networkIp;
    document.getElementById('res-broadcast').textContent = broadcastIp;
    document.getElementById('res-mask').textContent = maskIp;
    document.getElementById('res-total').textContent = totalHosts.toLocaleString();
    document.getElementById('res-range').textContent = usableRange;

    document.getElementById('subnet-results').classList.add('active');
}
