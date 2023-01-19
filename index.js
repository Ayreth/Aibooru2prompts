console.log('lol')

//const axios = require('axios');

const websiteURL = 'https://aibooru.online/posts/15057';

let visitedUrls = [];
let currentTab = 0;

function updateHistory() {
  const historyDiv = document.getElementById("history");
  historyDiv.innerHTML = "e";

  for (let i = 0; i < visitedUrls.length; i++) {
    const tab = document.createElement("div");
    tab.classList.add("tab");
    if (i === currentTab) {
      tab.classList.add("active");
    }
    tab.innerHTML = visitedUrls[i].url;
    tab.addEventListener("click", () => {
      currentTab = i;
      updateHistory();
    });
    historyDiv.appendChild(tab);
  }

  const currentUrl = visitedUrls[currentTab];
  document.getElementById("content").innerHTML = currentUrl.content;
}

const form = document.querySelector("form");
const urlField = document.getElementById("url-field");
const submitButton = document.getElementById("submit-button");

form.addEventListener("submit", e => {
  e.preventDefault();
  const websiteURL = urlField.value;
  axios.get(websiteURL)
  .then(response => {
    const html = response.data;
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const tagList = doc.getElementById("tag-list");
    const h3Elements = tagList.querySelectorAll("h3");
    const div = document.createElement("div");
    div.setAttribute("id", "output");
    const picture = doc.querySelector("picture");
    const img = picture.querySelector("img");
    let imgSrc = img.src;
    imgSrc = imgSrc.replace(/^(.*?)data\//, 'https://aibooru.online/data/');
    const imgPreview = document.createElement("img");
    imgPreview.setAttribute("src", imgSrc);
    imgPreview.setAttribute("alt", "Preview of the image");
    imgPreview.setAttribute("id", "img-preview");
    document.body.appendChild(imgPreview);
        console.log(imgSrc)

    h3Elements.forEach(h3 => {
        const h3Title = h3.innerHTML;
        const ul = h3.nextElementSibling;
        const liElements = ul.querySelectorAll("li");
        const dataTagNames = [];
        liElements.forEach(li => {
            if (li.hasAttribute("data-tag-name")) {
                dataTagNames.push(li.getAttribute("data-tag-name").replace(/_/g, " "));
            }
        });
        if (dataTagNames.length > 0) {
            const section = document.createElement("section");
            const h3Tag = document.createElement("h3");
            h3Tag.innerHTML = h3Title;
            h3Tag.classList.add("className1");
            section.appendChild(h3Tag);
            const pTag = document.createElement("p");
            pTag.innerHTML = dataTagNames.join(', ');
            pTag.classList.add("className2");
            section.appendChild(pTag);
            div.appendChild(section);
        }
    });
    document.body.appendChild(div);
})
.catch(error => {
  console.log(error);
});
});

urlField.addEventListener("keyup", e => {
if (e.keyCode === 13) {
  submitButton.click();
}
});