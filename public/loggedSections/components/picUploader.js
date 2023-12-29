export class picUploader extends HTMLElement {
    constructor(user) {
        super();
        this.userSession = user;
        this.innerHTML = /*html*/`
            <div id="openUploadPageBtn" class="uploadSectionToggler fixed rounded-t-full rounded-s-full bg-sky-600 h-8 w-8 bottom-1 end-1 flex justify-center items-center">
                <div>
                    +
                </div>
            </div>
            <div id="actualUploadPage" class="fixed bottom-0 left-0 rounded-t-xl hidden bg-sky-600">
                <div class="uploadSectionToggler ms-auto pe-4 w-fit">&#10005;</div>
                <form method="POST" action="/user/uploadPic" enctype="multipart/form-data">
                    <h1>Upload ur pic, m8</h1>
                    <input required type="file" name="upPic" >
                    <br />
                    <button type="submit">Submit</button>
                </form>
            </div>
           
        `;
    }

    connectedCallback() {
        $(".uploadSectionToggler").on("click", () => {
            $("#openUploadPageBtn").toggleClass("hidden");
            $("#actualUploadPage").toggleClass("hidden");
            if(!$("#actualUploadPage").hasClass("hidden")){
                gsap.from("#actualUploadPage", { opacity: 0, y: 100, duration: .25 });
            }
        });
    }
    
}
customElements.define('pic-uploader', picUploader);



