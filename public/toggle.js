function toggleText() {
    var moreText = document.getElementById("moreText");
    var readMoreLink = document.getElementById("readMoreLink");

    if (moreText.style.display === "none") {
        moreText.style.display = "inline";
        readMoreLink.innerHTML = "Read Less";
    } else {
        moreText.style.display = "none";
        readMoreLink.innerHTML = "Read More";
    }
}
