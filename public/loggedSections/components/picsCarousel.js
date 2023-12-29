export class picsCarousel extends HTMLElement{
    constructor(user){
        super()
        this.innerHTML = /*html*/`
            <div id="picsCarouselContainer" class="flex flex-col gap-6 justify-center items-center p-5 h-3/4 scroll-auto">
                
            </div>
        `
    }

    connectedCallback(){
        $.ajax({
            url:"/getPicFlow",
            type:"GET",
            success:function(data){
                if(data.result){
                    let list = data.data.pics
                    let wrapper=""
                    for(let pic of list.reverse()){
                        let guesses = data.data.guesses
                        if(guesses && guesses.find(finder=>finder.pic == pic.picStamp)){
                            wrapper+=/*html*/`
                            <div class="w-1/2">
                                <img data-picStamp="${pic.picStamp}" src="${pic.imageUrl}" >
                                <div>U guessed ${guesses.find(finder=>finder.pic == pic.picStamp).guess}, It was ${pic.userRef}</div>
                            </div>
                        `
                        }
                        else{
                            wrapper+=/*html*/`
                            <div class="w-1/2">
                                <img data-picStamp="${pic.picStamp}" src="${pic.imageUrl}" >
                                <label>Your guess here &darr;</label>
                                <input class="bg-sky-800 border border-transparent focus:outline-transparent border-b-white">
                                <div class="sendPicGuessBtn">Send</div>
                            </div>
                        `
                        }
                    }
                    $("#picsCarouselContainer").append(wrapper)
                    $(".sendPicGuessBtn").click(function(){
                        if(!$(this).siblings("input").val()) return
                        let requestBody = {
                            picStamp: $(this).siblings("img").attr("data-picStamp"),
                            guess: $(this).siblings("input").val()
                        }
                        $.ajax({
                            url:"/sendGuess",
                            type:"POST",
                            data:requestBody,
                            success:(json)=>{
                                let box = $(this).parent()
                                box.children(":not(img)").remove()
                                box.append(`
                                    <div>U guessed ${requestBody.guess}, It was ${json.data.userRef}</div>
                                `)
                            }
                        })
                    })
                    goDuck(false)
                }
            },
            error:function(err){
                console.log(err)
            }
        })
    }
}

customElements.define("pics-carousel", picsCarousel)