

var myspace2k8 = {
    House: "",
}
myspace2k8.start = function () {
    var minis = document.getElementsByClassName("mini-bill")

    for (var i = 0; i < minis.length; i++) {
        minis[i].addEventListener("click", myspace2k8.showBill)
    }
    myspace2k8.getData()
    myspace2k8.codeForModal()
}
myspace2k8.showBill = function (event) {
    var title = this.children[0].innerText;
    var content = this.children[1].innerText;
    var author = this.children[2].innerText;
    var container = document.getElementById("main-bill-container")


    //creating containers for divs
    container.innerHTML = "";
    var outerDiv = document.createElement("div");
    container.appendChild(outerDiv);
    outerDiv.innerHTML = this.innerHTML

    myspace2k8.createBeitHaComments();
    myspace2k8.storeCurrentPost(title, content, author)
}

myspace2k8.createBeitHaComments = function () {
    var Beit = document.createElement("div");
    Beit.id = "Beit";
    myspace2k8.House = Beit;
    myspace2k8.configureBeitsContents()
    myspace2k8.addEntranceToBeit()

}
myspace2k8.configureBeitsContents = function () {
    var speak = document.createElement("input");
    speak.id = "commentor"
    speak.setAttribute("type", "search");

    var button = document.createElement("button")
    button.className = "say-comment"
    button.innerText = "post"


    var inner = document.createElement('div');
    inner.className = "inner";

    var outer = document.createElement('div');
    outer.className = "outer";

    inner.appendChild(speak);
    inner.appendChild(button)

    var Beit = myspace2k8.House;

    Beit.appendChild(outer);
    Beit.appendChild(inner);
    myspace2k8.House = Beit;

}
myspace2k8.addEntranceToBeit = function () {
    var container = document.getElementById('main-bill-container');

    var button = document.createElement("button");
    button.id = "entrance-to-beit";
    button.innerText = "enter";

    container.appendChild(button)
    button.addEventListener("click", myspace2k8.enterBeit)

}
myspace2k8.enterBeit = function () {
    var yard = document.getElementById("main-bill-container");
    var Beit = myspace2k8.House;
    yard.append(Beit)
    myspace2k8.enableSpeak()
    myspace2k8.renderComments()
}
myspace2k8.getData = function () {
    $.get("/socialboard/data", function (data) {
        myspace2k8.storedPosts = JSON.parse(data)
    })
    $.get("/socialboard/getcomments", function (data) {
        myspace2k8.storedComments = JSON.parse(data)
    })
}
myspace2k8.enableSpeak = function () {
    var button = document.getElementsByClassName("say-comment");
    button[0].addEventListener("click", myspace2k8.hearComment)
}
myspace2k8.hearComment = function () {
    // Need to get the id, perhaps store the main in this object at some point. 
    //Need to send the content as well
    var id = myspace2k8.currentPost.id;
    var content = document.getElementById('commentor').value

    if (content.value != "") {
        $.ajax({
            type: "POST",
            url: "/socialboard/hear-comments/",
            headers: { "X-CSRFToken": getCookie("csrftoken") },
            datatype: 'json',
            data: {
                id: id,
                content: content
            },
            success: function (response) {
                console.log(response)
            },
            error: function (response) {
                console.log(response)
            }
        })
    }



}
myspace2k8.storeCurrentPost = function (title, content, author) {

    var posts = myspace2k8.storedPosts;
    for (var i = 0; i < posts.length; i++) {

        if ((posts[i]["fields"]["title"] == title) && (posts[i]["fields"]["content"] == content) && (posts[i]['fields']["author"] == author)) {
            myspace2k8.currentPost = posts[i]["fields"]
            myspace2k8.currentPost.id = posts[i]["pk"]

            myspace2k8.addMatchingComments(posts[i]["pk"])
        }
    }
}
myspace2k8.addMatchingComments = function (id) {

    comments = myspace2k8.storedComments;

    relComments = [];
    for (var i = 0; i < comments.length; i++) {
        if (comments[i]["fields"]["post"] == id) {
            relComments.push({
                content: comments[i]["fields"]["content"],
                author: comments[i]["fields"]["author"]
            })
        }
        myspace2k8.currentPost.comments = relComments

    }
}

myspace2k8.displayRegistrationForm = function () {
    document.getElementById("test").innerHTML = myspace2k8.registrationForm;
}
myspace2k8.codeForModal = function () {
    // Get the modal
    var modal = document.getElementById("myModal");

    // Get the button that opens the modal
    var btn = document.getElementById("myBtn");

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

    // When the user clicks on the button, open the modal 
    btn.onclick = function () {
        modal.style.display = "block";
    }

    // When the user clicks on <span> (x), close the modal
    span.onclick = function () {
        modal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}
myspace2k8.renderComments=function(){
    var comments= myspace2k8.currentPost.comments;
    var template=myspace2k8.commentTemplate;
    var location=$("#Beit")
    for(var i=0; i<comments.length;i++){
        Beit.prepend(myspace2k8.commentTemplate(comments[i].content))
    }
    console.log(comments)
}
myspace2k8.commentTemplate=function(content){
    console.log(content)
    var div=document.createElement("div");
    div.className="single-comment";
    div.innerText=content;
    return div
}
myspace2k8.start();

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}