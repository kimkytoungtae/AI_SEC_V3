console.log("xxxxxxxxxx");
let anal_btn;
let ele_coin_name;
let timegap;
let res_contain;
let closeBtn;
let loader;
async function get_coinname() {
  ele_coin_name = window.document.getElementById("coinname");
  timegap = document.getElementById("timegap");
  res_contain = document.getElementById("res_contain");
  closeBtn = document.getElementById("closeBtn");
  loader = document.getElementById("loader");
  const conn = await fetch("/coin_name");
  const coinnames = await conn.json();
  let inHtml = "";
  for (let i = 0; i < coinnames.eng_name.length; i++) {
    inHtml += `<option value="${coinnames.eng_name[i]}">${coinnames.han_name[i]}(${coinnames.eng_name[i]})</option>`;
  }
  ele_coin_name.innerHTML = inHtml;
  //console.log(JSON.stringify(coinnames));
  anal_btn = document.getElementById("anal_btn");
  addEvent();
}
function addEvent() {
  closeBtn.addEventListener("click", () => {
    res_contain.style.display = "none";
  });
  anal_btn.addEventListener("click", async function () {
    loader.style.display = "block";
    const style_loader = ` style="position:fixed;top:48vh;left:48vw"`;
    const loader_html = `<img src="/static/img/ajax-loader.gif">`;
    loader.innerHTML = loader_html;
    const coinname = ele_coin_name.value;
    const timegaps = timegap.value;
    const padding = await fetch("/user_data", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        coinname,
        timegaps,
      }),
    }).catch(() => {
      console.log("서버통신오류");
    });
    if (padding) {
      const info_data = await padding.json();
      let inHtml = "";
      let today_date = new Date();
      today_date.setDate(today_date.getDate() + 1);
      console.log(info_data);
      let today_str = today_date.toLocaleString("ko-kr");
      let ghtml = `<h2 style="display:inline; padding:1rem;color:blue"
     >${coinname}가격 예측 정보</h2>
      <p style="font-size:1.5rem; margin-bottom:1rem">최고가오차율(${
        parseInt(info_data["err_rate"]["high"] * 100 * 100) / 100
      }%)&nbsp;&nbsp;&nbsp;&nbsp;
      현재가오차율(${parseInt(info_data["err_rate"]["cur"] * 100 * 100) / 100}%)
      &nbsp;&nbsp;&nbsp;&nbsp;
      최저가오차율(${parseInt(info_data["err_rate"]["low"] * 100 * 100) / 100}%)
      </p>
      <div>
        <h2>훈련 결과 그래프</h2>
        <img style = 'width:10rem' src="/static/${info_data["graph"][0]}">
        <img style = 'width:10rem' src="/static/${info_data["graph"][1]}">
        </div>
      `;

      document.getElementById("anal_data").innerHTML = ghtml;
      for (let data of info_data["ypred"]) {
        //data[0] 현재가
        //data[1] 최고가
        //data[2] 최저가
        inHtml += `
  <div style="
    margin-bottom: 1rem;
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid #e0e0e0;
    box-shadow: 0 2px 6px rgba(0,0,0,0.1);
    background: #ffffff;
    font-family: 'Pretendard', sans-serif;
    font-size: 0.9rem;
  ">
    <div style="
      background: linear-gradient(90deg, #4caf50, #66bb6a);
      padding: 0.6rem 0.8rem;
      color: white;
      font-weight: 600;
    ">
      📅 ${today_str}
    </div>

    <div style="padding: 0.8rem 1rem;">
      <p style="margin: 0.3rem 0; color:#e53935;">
        🔺 <b>최고가 :</b> ${data[1].toLocaleString()}
      </p>

      <p style="margin: 0.3rem 0; color:#333;">
        📌 <b>현재가 :</b> ${data[0].toLocaleString()}
      </p>

      <p style="margin: 0.3rem 0; color:#1e88e5;">
        🔻 <b>최저가 :</b> ${data[2].toLocaleString()}
      </p>
    </div>
  </div>
`;
        today_date.setDate(today_date.getDate() + 1);
        today_str = today_date.toLocaleString("ko-kr");
      }
      loader.style.display = "none";
      document.getElementById("result").innerHTML = inHtml;
      res_contain.style.display = "block";
    }
  });
}
