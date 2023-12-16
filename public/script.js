
async function getRandomNumber() {
    try {
      const response = await fetch('https://jffun.cyclic.app/getText');
      const resText = await response.text()
      console.log(resText)
    } catch (error) {
      console.error('Error fetching random number:', error);
    }
  }
async function getUser (){
    try {
        const response = await fetch('https://jffun.cyclic.app/getUser');
        console.log(response)
        const resText = await response.json()
        console.log(resText)
      } catch (error) {
        console.error('Error fetching random number:', error);
      }
}