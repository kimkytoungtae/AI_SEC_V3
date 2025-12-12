console.log("😂nlp_review running !!!");
let user_text, loader, commitbtn, resetbtn, res_contain;

async function startpage() {
  user_text = document.getElementById("user_text");
  loader = document.getElementById("loader");
  commitbtn = document.getElementById("commitbtn");
  resetbtn = document.getElementById("resetbtn");
  res_contain = document.getElementById("res_contain");
  add_Event();
}
function add_Event() {
  commitbtn.addEventListener("click", async () => {
    //서버통신
    const send_text = user_text.value;
    if (send_text.length < 10) {
      alert("10글자 이상 입력하셔야 합니다.");
      return 0;
    }
    loader.style.display = "block";
    const style_loader = ` style="position:fixed;top:48vh;left:48vw" `;
    const loader_html = `<img id="loader_img"${style_loader}
                          src="/static/img/ajax-loader.gif">`;
    loader.innerHTML = loader_html;

    const conn = await fetch("/movie_review", {
      method: "post",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ send_text }),
    });
    const pred_res = await conn.json();
    console.log(pred_res.predict);
    const icon_ = pred_res.predict.includes("긍정") ? "💚" : "💔";
    res_contain.innerHTML += `<p style='margin-bottom:1rem'>리뷰 : ${send_text} <br> ::: 
    ${icon_} &nbsp;&nbsp;&nbsp;
    ${pred_res.predict}</p>`;
    // let inHtml = "";
    loader.style.display = "none";
    user_text.value = "";
  });
  resetbtn.addEventListener("click", () => {
    user_text.value = "";
  });
}
