let item = document.getElementById('item');
let category = document.getElementById('category');
let buy_price = document.getElementById('buy_price');
let sell_price = document.getElementById('sell_price');
let quantity = document.getElementById('quantity');
let profit = document.getElementById('profit');
let submit = document.getElementById('submit');
let search = document.getElementById('search');
let searchbtn = document.getElementById('searchbtn');
let mood = "create" ;
let tmpvar;
//console.log(item,category,buy_price,sell_price,quantity,profit,submit,search,searchbtn);



//total price func
function totalprofit(){
    if(buy_price.value != '' && sell_price.value != '' && quantity.value != ''){
        let result = (+sell_price.value - +buy_price.value) * +quantity.value;
        profit.innerHTML = result;
        profit.style.background = '#040';
    }else{
        profit.innerHTML = '';
        profit.style.background = '#830000'
    }
}



//create product
//save local storage
let buffer_array;
if(localStorage.product != null){
    buffer_array = JSON.parse(localStorage.product)
}else{
    buffer_array = [];
}
submit.onclick = function () {
    const newitem = {
        item: item.value,
        category: category.value,
        buy_price: buy_price.value,
        sell_price: sell_price.value,
        quantity: quantity.value,
        profit: profit.innerHTML,
    };

    if (mood === "create") {
        let found = false;

        for (let i = 0; i < buffer_array.length; i++) {
            if (buffer_array[i].item === newitem.item) {
                buffer_array[i].quantity =
                    +buffer_array[i].quantity + +newitem.quantity;
                found = true;
                break;
            }
        }

        if (!found) {
            buffer_array.push(newitem);
        }

    } else {
        buffer_array[tmpvar] = newitem;
        submit.innerHTML = "إنشاء";
        mood = "create";
    }

    localStorage.setItem('product', JSON.stringify(buffer_array));
    clearinputs();
    showdata();
    profit.style.background = '#830000';
};
showdata();



//clear inputs
function clearinputs(){
    item.value = '';
    category.value = '';
    buy_price.value = '';
    sell_price.value = '';
    quantity.value = '';
    profit.innerHTML = '';
}



//read
function showdata(){
    let table = '';
    for(let i = 0; i < buffer_array.length; i++){
        table += `<tr>
                        <td>${i+1}</td>
                        <td>${buffer_array[i].item}</td>
                        <td>${buffer_array[i].category}</td>
                        <td>${buffer_array[i].buy_price}</td>
                        <td>${buffer_array[i].sell_price}</td>
                        <td>${buffer_array[i].quantity}</td>
                        <td><button onclick="edititem(${i})">تعديل</button></td>
                        <td><button onclick="deleteitem(${i})">حذف</button></td>
                        
                    </tr>`;
    }
    document.getElementById('tbody').innerHTML = table;
    
}



//delete
function deleteitem(i){
    buffer_array.splice(i,1);
    localStorage.product = JSON.stringify(buffer_array);
    showdata();
}



//update
function edititem(i){
    item.value = buffer_array[i].item;
    category.value = buffer_array[i].category;
    buy_price.value = buffer_array[i].buy_price;
    sell_price.value = buffer_array[i].sell_price;
    quantity.value = buffer_array[i].quantity;
    totalprofit();
    submit.innerHTML = "تحديث";
    mood = "update";
    tmpvar = i;
}

    





//search
search.onkeyup = function searchdata(){
    let value = search.value.toLowerCase();
    let table = '';

    for(let i = 0; i < buffer_array.length; i++){
        let itemName = buffer_array[i].item.toLowerCase();

        if(itemName.includes(value)){
            table += `<tr>
                        <td>${i+1}</td>
                        <td>${buffer_array[i].item}</td>
                        <td>${buffer_array[i].category}</td>
                        <td>${buffer_array[i].buy_price}</td>
                        <td>${buffer_array[i].sell_price}</td>
                        <td>${buffer_array[i].quantity}</td>
                        <td><button onclick="edititem(${i})">تعديل</button></td>
                        <td><button onclick="deleteitem(${i})">حذف</button></td>
                      </tr>`;
        }
    }
   
    if (value === "") {
        showdata();
    } else {
        document.getElementById('tbody').innerHTML = table;
    }

}

