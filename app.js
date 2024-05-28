document.addEventListener('DOMContentLoaded', () => {
    const fromCurrencySelect = document.getElementById('from-currency');
    const toCurrencySelect = document.getElementById('to-currency');
    const amountInput = document.getElementById('amount');
    const convertBtn = document.getElementById('convert-btn');
    const transactionList = document.getElementById('transaction-list');

    // Use the alternative free API
    const apiUrl = 'https://api.exchangerate-api.com/v4/latest/USD';

    // The list of five currencies we are interested in
    const selectedCurrencies = ['USD', 'EUR', 'INR', 'JPY', 'AED'];

    // Fetch the list of currencies
    fetch(apiUrl)
        .then(response => {
            console.log('Response status:', response.status); // Debugging line
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log('Fetched data:', data); // Debugging line to log entire response

            if (!data.rates) {
                console.error('API response does not contain rates property:', data); // Debugging line for error detail
                throw new Error('Rates data is missing in the API response');
            }

            const currencies = Object.keys(data.rates);
            console.log('Currencies:', currencies); // Debugging line

            // Populate the select elements with the selected currencies only
            selectedCurrencies.forEach(currency => {
                const optionFrom = document.createElement('option');
                optionFrom.value = currency;
                optionFrom.textContent = currency;
                fromCurrencySelect.appendChild(optionFrom);

                const optionTo = document.createElement('option');
                optionTo.value = currency;
                optionTo.textContent = currency;
                toCurrencySelect.appendChild(optionTo);
            });
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });

    let transactions = [];

    convertBtn.addEventListener('click', () => {
        const fromCurrency = fromCurrencySelect.value;
        const toCurrency = toCurrencySelect.value;
        const amount = amountInput.value;

        if (amount === '' || isNaN(amount)) {
            alert('Please enter a valid amount');
            return;
        }

        const conversionUrl = `https://api.exchangerate-api.com/v4/latest/${fromCurrency}`;

        fetch(conversionUrl)
            .then(response => response.json())
            .then(data => {
                const rate = data.rates[toCurrency];
                const convertedAmount = amount * rate;
                const transaction = `${amount} ${fromCurrency} = ${convertedAmount.toFixed(2)} ${toCurrency}`;

                transactions.unshift(transaction);
                if (transactions.length > 5) {
                    transactions.pop();
                }
                updateTransactionList();
            })
            .catch(error => {
                console.error('Conversion fetch error:', error);
            });
    });

    function updateTransactionList() {
        transactionList.innerHTML = '';
        transactions.forEach(transaction => {
            const li = document.createElement('li');
            li.textContent = transaction;
            transactionList.appendChild(li);
        });
    }
});
