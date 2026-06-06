let item = document.getElementById('item');
let category = document.getElementById('category');
let buy_price = document.getElementById('buy_price');
let sell_price = document.getElementById('sell_price');
let quantity = document.getElementById('quantity');
let profit = document.getElementById('profit');
let submit = document.getElementById('submit');
let searchInput = document.getElementById('search');
let buffer_array = [];
let mood = "create";
let tmpvar = null;
let floatingBtn = document.getElementById("floating-ai-btn");
let chatBox = document.getElementById("chat-box");
let apiInput = document.getElementById("API_KEY");
let startBtn = document.getElementById("start-chat-btn");
let chatControls = document.getElementById("chat-controls");
let userInput = document.getElementById("user-input");
let sendBtn = document.getElementById("send-btn");





//Load
function loadData() {
    try {
        buffer_array = JSON.parse(localStorage.getItem('product')) || [];
    } catch (e) {
        buffer_array = [];
    }
}
loadData();



//profit
function totalprofit() {
    if (buy_price.value && sell_price.value && quantity.value) {
        let result = (+sell_price.value - +buy_price.value) * +quantity.value;
        profit.innerHTML = result;
        profit.style.background = '#040';
    } else {
        profit.innerHTML = '0';
        profit.style.background = '#830000';
    }
}



//Save
function saveData() {
    localStorage.setItem('product', JSON.stringify(buffer_array));
}



//Clear inputs
function clearinputs() {
    item.value = '';
    category.value = '';
    buy_price.value = '';
    sell_price.value = '';
    quantity.value = '';
    profit.innerHTML = '0';
}



//Create/update
submit.onclick = function () {

    if (!item.value.trim()) return alert("Enter item name");

    const newitem = {
        item: item.value.trim(),
        category: category.value.trim(),
        buy_price: +buy_price.value,
        sell_price: +sell_price.value,
        quantity: +quantity.value
    };

    if (mood === "create") {

        let found = buffer_array.find(i => i.item === newitem.item);

        if (found) {
            found.quantity += newitem.quantity;
        } else {
            buffer_array.push(newitem);
        }

    } else {
        buffer_array[tmpvar] = newitem;
        submit.innerHTML = "اتمام";
        mood = "create";
        tmpvar = null;
    }

    saveData();
    clearinputs();
    showdata();
    profit.style.background = '#830000';
};



//Show data
function showdata(data = buffer_array) {

    let table = '';

    data.forEach((item, i) => {
        table += `
            <tr>
                <td>${i + 1}</td>
                <td>${item.item}</td>
                <td>${item.category}</td>
                <td>${item.buy_price}</td>
                <td>${item.sell_price}</td>
                <td>${item.quantity}</td>
                <td><button onclick="edititem(${i})">تعديل</button></td>
                <td><button onclick="deleteitem(${i})">حذف</button></td>
            </tr>
        `;
    });

    document.getElementById('tbody').innerHTML = table;
}

showdata();




//Delete
function deleteitem(i) {
    buffer_array.splice(i, 1);
    saveData();
    showdata();
}



//Edit
function edititem(i) {
    let data = buffer_array[i];

    item.value = data.item;
    category.value = data.category;
    buy_price.value = data.buy_price;
    sell_price.value = data.sell_price;
    quantity.value = data.quantity;

    totalprofit();

    submit.innerHTML = "تحديث";
    mood = "update";
    tmpvar = i;
}




//Search
function search() {
    let value = searchInput.value.toLowerCase();

    if (!value) {
        showdata();
        return;
    }

    let filtered = buffer_array.filter(item =>
        item.item.toLowerCase().includes(value)
    );

    showdata(filtered);
}
searchInput.addEventListener("keyup", search);







//AI AREA-----------------------------------------------------------------------------------


floatingBtn?.addEventListener("click", () => {
    chatBox.classList.toggle("hidden");
});

let apiKey = null;



// Initialize chat state
function initChatState() {
    chatControls.style.display = "none";
    startBtn.style.display = "block";
}

initChatState();


// Handle API key submission
startBtn.onclick = function () {
    const key = apiInput.value;

    if (!key) {
        alert("Please enter API key");
        return;
    }

    apiKey = key;

    // switch UI
    apiInput.style.display = "none";
    startBtn.style.display = "none";
    chatControls.style.display = "flex";

    addBotMessage("API key accepted. You can now chat.");
};



// Handle sending messages
sendBtn.onclick = async function () {
    const msg = userInput.value;
    if (!msg) return;

    addUserMessage(msg);
    userInput.value = "";

    const response = await callGemini(msg);
    addBotMessage(response);
};


function addUserMessage(text) {
    const msg = document.createElement("p");
    msg.className = "user-msg";
    msg.textContent = text;
    document.getElementById("chat-messages").appendChild(msg);
}

function addBotMessage(text) {
    const msg = document.createElement("div");
    msg.className = "bot-msg";

    msg.innerHTML = marked.parse(text); 

    document.getElementById("chat-messages").appendChild(msg);
}



// Call Gemini API
async function callGemini(message) {
    try {
        const res = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [{ text: message }]
                        }
                    ]
                })
            }
        );

        const data = await res.json();

        console.log("FULL GEMINI RESPONSE:", data);

        if (!res.ok || data.error) {
            return data?.error?.message || "API ERROR";
        }

        return data?.candidates?.[0]?.content?.parts?.[0]?.text
            || "EMPTY RESPONSE";

    } catch (err) {
        console.log(err);
        return "NETWORK ERROR";
    }
}
