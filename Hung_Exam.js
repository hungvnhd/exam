let input = document.querySelector("#user-input");
let suggestions;

function getData(url, fn) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        fn(undefined, JSON.parse(xhr.responseText));
      } else {
        fn(new Error(xhr.statusText), undefined);
      }
    }
  };
  xhr.open("GET", url, true);
  xhr.send();
}

input.addEventListener("keyup", () => {
  let userValue = input.value;
  let div1 = document.getElementById("suggestion");
  div1.innerHTML = "";

  getData(
    `https://en.wikipedia.org/w/api.php?origin=*&action=opensearch&limit=10&format=json&search=${userValue}`,
    (err, res) => {
      if (err) {
        console.log(err);
      } else {
        console.log(res);

        suggestions = res[1].filter((sug) =>
          sug.toLowerCase().startsWith(userValue)
        );
        console.log(res[1]);
        console.log(suggestions);

        suggestions.forEach((e) => {
          getData(
            `https://en.wikipedia.org/w/api.php?origin=*&action=query&prop=pageprops|pageimages&format=json&titles=${e}`,
            (err1, res1) => {
              if (err) {
                console.log(err1);
              } else {
                console.log(res1);
              }
              let id = Object.keys(res1.query.pages);
              console.log(Object.keys(res1.query.pages[id].pageprops));
              let des = "wikibase-shortdesc";

              let div = document.createElement("div");
              div.classList.add("suggestion-items");

              div.innerHTML = `
              <img src="${res1.query.pages[id].thumbnail.source}"
                alt="">
            <div style="padding-left:10px">
                <h4>${e}</h4>
                <div class="suggestion-description">${res1.query.pages[id].pageprops[des]}</div>
    
            </div>
            `;

              div1.appendChild(div);

              if (userValue === "") {
                div1.innerHTML = "";
              }
              div.onclick = () => {
                window.location.href = `https://en.wikipedia.org/wiki/${e}`;
              };
            }
          );
        });
      }
    }
  );

  console.log(suggestions);
});
