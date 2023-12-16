
async function getRandomNumber() {
    try {
      const response = await fetch('https://jffun.cyclic.app/getRandomNumber');
      const data = await response.json();
      document.getElementById('randomNumber').innerText = `Random Number: ${data.randomNumber}`;
    } catch (error) {
      console.error('Error fetching random number:', error);
    }
  }