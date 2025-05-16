document.addEventListener('DOMContentLoaded', () => {
  const socket = io();

  socket.emit('request-products');

  socket.on('products', (products) => {
    const productsList = document.getElementById("productsList");
    productsList.innerHTML = '';

    products.forEach(product => {
      const li = document.createElement('li');
      li.innerHTML = `
        <strong>${product.title}</strong> - $${product.price}
        <button class="delete-btn" data-id="${product._id}">Eliminar</button>
      `;
      productsList.appendChild(li);
    });

    
    document.querySelectorAll('.delete-btn').forEach(button => {
      button.addEventListener('click', (e) => {
        const productId = e.target.getAttribute('data-id');
        socket.emit('delete-product', productId);
      });
    });
  });

 
  const form = document.getElementById('formNewProduct');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const newProduct = {
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        code: document.getElementById('code').value,
        price: parseFloat(document.getElementById('price').value),
        stock: parseInt(document.getElementById('stock').value),
        category: document.getElementById('category').value,
        thumbnail: document.getElementById('thumbnail').value || 'default.jpg'
      };

      socket.emit('new-product', newProduct);
      form.reset();
    });
  }

 
  socket.on('error', (error) => {
    console.error('Error del servidor:', error);
    alert(`Error: ${error.message}`);
  });
});