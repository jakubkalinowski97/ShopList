window.onload = function() {


	let productForm = document.getElementById('newProductForm');
	let productsTable = document.getElementById('productsTable');
	let listOfProducts = [];
	if(JSON.parse(localStorage.getItem('data'))==null){
		listOfProducts = JSON.parse(localStorage.getItem('data'));
	}
//	listOfProducts.push({
//		name: 'Ser',
//		price: 12.50,
//		quantity: 1.5
//	});
//	listOfProducts.push({
//		name: 'Szynka',
//		price: 9.50,
//		quantity: 1
//	});
//	listOfProducts.push({
//		name: 'Chleb',
//		price: 2.30,
//		quantity: 1
//	});
	productForm.onsubmit = function (e) {
		e.preventDefault();
		const name = document.getElementById('name');
		const price = document.getElementById('price');
		const quantity = document.getElementById('quantity');
		if (name.value != '' && price.value >= 0 && quantity.value > 0) {
			let product = {
				name: name.value,
				price: price.value,
				quantity: quantity.value
			}
			listOfProducts.push(product);
			displayProducts();
			document.getElementById('name').value = '';
			document.getElementById('price').value = '';
			document.getElementById('quantity').value = '';
		}
	}

	function getAmount(){
		const amount = listOfProducts.reduce((total, el) => {
			return total + parseFloat(el.price*el.quantity);
		},0)
		document.getElementById('sumOfproducts').innerText = amount;
	}
	
	function displayProducts(){
		productsTable.querySelector('tbody').innerHTML = '';
		for(let i=0; i < listOfProducts.length; i++){
			addProduct(listOfProducts[i]);
		}
		getAmount();
	}
	
	function removeProduct(product){
		listOfProducts = listOfProducts.filter(el => {
			return el.name != product;
		})
		displayProducts();
		localStorage.setItem('data', JSON.stringify(listOfProducts));
	}
	
	function editProduct(id, product){
		id = id-1;
		listOfProducts[id] = product;
		var elem = document.querySelector('.container-form');
		elem.parentNode.removeChild(elem);
		displayProducts();
		localStorage.setItem('data', JSON.stringify(listOfProducts));
	}
	
	function displayForm(id, product){
		const editedProduct = product;
		const form = document.createElement('form');
		form.classList.add('edit-form');
		
		const name = document.createElement('input');
		name.value = editedProduct.name;
		
		const price = document.createElement('input');
		price.value = editedProduct.price;
		
		const quantity = document.createElement('input');
		quantity.value = editedProduct.quantity;
		
		const buttonSave = document.createElement('input');
		buttonSave.type = 'submit'
		buttonSave.value = 'Zapisz';
		buttonSave.classList.add('element-save');
		
		buttonSave.onclick = function (e) {
			e.preventDefault();
			if (name.value != '' && price.value >= 0 && quantity.value > 0) {
				let product = {
					name: name.value,
					price: price.value,
					quantity: quantity.value
				}
				editProduct(id, product);
			}
		}
		form.appendChild(buttonSave);
		form.appendChild(name);
		form.appendChild(price);
		form.appendChild(quantity);
		
		const container = document.createElement('div');
		container.classList.add('container-form');
		container.appendChild(form);
		container.appendChild(buttonSave);
		document.querySelector('.edit-product-form').appendChild(container);
	}
	
	function moveUp(id){
		id = id-1;
		if(id == 0)
			return;
		let tmp = listOfProducts[id-1];
		listOfProducts[id-1] = listOfProducts[id];
		listOfProducts[id] = tmp;
		displayProducts();
		localStorage.setItem('data', JSON.stringify(listOfProducts));
	}
	
	function moveDown(id){
		id = id-1;
		if(id == listOfProducts.length-1)
			return;
		let tmp = listOfProducts[id+1];
		listOfProducts[id+1] = listOfProducts[id];
		listOfProducts[id] = tmp;
		displayProducts();
		localStorage.setItem('data', JSON.stringify(listOfProducts));
	}
	
	
	function addProduct(product) {
		const table = productsTable.querySelector('tbody');
		const row = document.createElement('tr');
		row.classList.add('row');
		//creating columns
		const name = document.createElement('td')
		name.innerText = product.name;
		name.classList.add('name');
		
		const price = document.createElement('td');
		price.innerText = product.price;
		price.classList.add('price');

		const quantity = document.createElement('td');
		quantity.innerText = product.quantity;
		quantity.classList.add('quantity');

		const sum = document.createElement('td');
		sum.innerText = product.price * product.quantity;
		
		const index = document.createElement('td');
		index.innerText = listOfProducts.indexOf(product)+1;
		index.classList.add('id');
		const buttonDelete = document.createElement('button');
		buttonDelete.classList.add('element-delete');
		buttonDelete.innerHTML = '<i class="fas fa-times-circle"></i>';
		index.prepend(buttonDelete);
		
		const buttonEdit = document.createElement('button');
		buttonEdit.classList.add('element-edit');
		buttonEdit.innerHTML = '<i class="fas fa-pencil-alt"></i>';
		index.prepend(buttonEdit);
				
		const arrowUp = document.createElement('div');
		arrowUp.classList.add('arrow-up');
		arrowUp.innerHTML = '<i class="fas fa-arrow-up"></i>';
		
		const arrowDown = document.createElement('div');
		arrowDown.classList.add('arrow-down');
		arrowDown.innerHTML = '<i class="fas fa-arrow-down"></i>';
		
		const arrows = document.createElement('td');
		arrows.appendChild(arrowUp);
		arrows.appendChild(arrowDown);
		arrows.classList.add('arrows');
		
		
		row.appendChild(arrows);
		row.appendChild(index)
		row.appendChild(name);
		row.appendChild(quantity);
		row.appendChild(price);
		row.appendChild(sum);

		table.appendChild(row);
		localStorage.setItem('data', JSON.stringify(listOfProducts));
	}
	
	productsTable.addEventListener('click', function(e) {
        if (e.target.closest('.element-delete') !== null) {
            const product = e.target.closest('.row').querySelector('.name').innerText;
			removeProduct(product);
        }
    });
	
	productsTable.addEventListener('click', function(e){
		if (e.target.closest('.arrow-up') !== null) {
			const id = e.target.closest('.row').querySelector('.id').innerText;
			moveUp(id);
		}
	});
	
	productsTable.addEventListener('click', function(e){
		if (e.target.closest('.arrow-down') !== null) {
			const id = e.target.closest('.row').querySelector('.id').innerText;
			moveDown(id);
		}
	});
	
	productsTable.addEventListener('click', function(e){
		if(e.target.closest('.element-edit') !== null){
			let product = {};
			product.name = e.target.closest('.row').querySelector('.name').innerText;
			product.price = e.target.closest('.row').querySelector('.price').innerText;
			product.quantity = e.target.closest('.row').querySelector('.quantity').innerText;
			const id = e.target.closest('.row').querySelector('.id').innerText;
			displayForm(id,product);
		}
	})
	
	displayProducts();
	
	

}