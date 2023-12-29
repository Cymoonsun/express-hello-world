import { picUploader } from "./components/picUploader.js";
import { picsCarousel } from "./components/picsCarousel.js";

class GreetUser extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = "Loading...";
  }

  async fetchUserData() {
    try {
      const user = await fetchUser();
      const upl = new picUploader(user);
      const carousel = new picsCarousel(user)
      this.innerHTML = /*html*/`
      <div class="text-white bg-sky-950 h-full">
        <div id="sticky-header" class="sticky top-0 h8 flex flex-row justify-end gap-6 me-6 text-lg">
          <div id="friendRequestsBtn" class="cursor-pointer">&#129309;</div>
          <div id="openMenuBtn" class="cursor-pointer">&#8801;</div>
        </div>
        <div>
          <div id="picsCarouselSection"></div>
        </div>
        <div id="picUploaderSection"></div>

        <div id="menu" class="hidden h-screen w-full fixed top-0 left-0 bg-black">
          <div class="flex flex-col gap-2">
            <div id="closeMenuX" class="ms-auto pe-4">&#10005;</div>
            <div id="hLogoutBtn">Logout</div>
          </div>
        </div>
        <div id="duckLoader" class="h-full w-full flex justify-center items-center bg-violet-900 fixed top-0 left-0"><img src="/media/dduck.gif" alt="no duck?" /></div>
      </div>
      `
      $(this).find("#picUploaderSection").append(upl);
      $("#picsCarouselSection").append(carousel)
    } catch (error) {
      console.error('Error fetching user data:', error);
      this.innerHTML = 'Error fetching user data';
    }
  }

  async connectedCallback() {
    await this.fetchUserData();
    $("#hLogoutBtn").on("click",async function(){
      const logoutFetch = await fetch("/logout")
      location.reload()
    })
    $("#openMenuBtn").on("click",function(){
      $("#menu").removeClass("hidden")
      gsap.from("#menu", { opacity: 0, duration: .25 });
    })
    $("#closeMenuX").click(()=>{
      $("#menu").addClass("hidden")
    })
  }
}

customElements.define('greet-user', GreetUser);

async function fetchUser() {
  let f = await fetch('/api/user');
  let j = await f.json();
  return j;
}
