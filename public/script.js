
async function getRandomNumber() {
    try {
      const response = await fetch('https://jffun.cyclic.app/getText');
      console.log(response)
    } catch (error) {
      console.error('Error fetching random number:', error);
    }
  }