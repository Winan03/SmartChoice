
const url = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTxd308XLpCKtS5VLCqvdl_jr_wE2yeUv0bln1jGmPrHMm7A9oU016gNa9m0voSXHNC0MogTP8p5k7A/pub?output=csv&t=' + Date.now();

console.log('Testing connection to Google Sheets...');
console.log('URL:', url);

try {
    const response = await fetch(url);
    console.log('Status Code:', response.status);

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const text = await response.text();
    console.log('\n--- DATA RECEIVED (First 500 chars) ---');
    console.log(text.substring(0, 500));
    console.log('\n--- END OF PREVIEW ---');
    console.log('Total length:', text.length);

} catch (error) {
    console.error('Error:', error);
}
