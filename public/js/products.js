document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.container');
  const cartId = container?.dataset.cartId;

  // 1. Manejar incremento/decremento de cantidades
  document.querySelectorAll('.quantity-minus').forEach(button => {
    button.addEventListener('click', (e) => {
      const productId = e.target.dataset.productId;
      const input = document.querySelector(`.quantity-input[data-product-id="${productId}"]`);
      if (parseInt(input.value) > 1) {
        input.value = parseInt(input.value) - 1;
      }
    });
  });

  document.querySelectorAll('.quantity-plus').forEach(button => {
    button.addEventListener('click', (e) => {
      const productId = e.target.dataset.productId;
      const input = document.querySelector(`.quantity-input[data-product-id="${productId}"]`);
      const maxStock = parseInt(input.max);
      const currentValue = parseInt(input.value);
      
      if (currentValue < maxStock) {
        input.value = currentValue + 1;
      } else {
        alert(`No hay suficiente stock. Máximo disponible: ${maxStock}`);
      }
    });
  });

  // 2. Validar input manual
  document.querySelectorAll('.quantity-input').forEach(input => {
    input.addEventListener('change', (e) => {
      const value = parseInt(e.target.value);
      const max = parseInt(e.target.max);
      const min = parseInt(e.target.min);
      
      if (isNaN(value) || value < min) {
        e.target.value = min;
      } else if (value > max) {
        e.target.value = max;
        alert(`Stock máximo: ${max} unidades`);
      }
    });
  });

  // 3. Agregar al carrito
  document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', async (e) => {
      if (!cartId) {
        alert('Primero debes crear un carrito');
        return;
      }

      const productId = e.target.dataset.productId;
      const quantityInput = document.querySelector(`.quantity-input[data-product-id="${productId}"]`);
      const quantity = parseInt(quantityInput.value);

      try {
        const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
          },
          body: JSON.stringify({ quantity })
        });

        const result = await response.json();
        
        if (result.status === 'success') {
          showAlert('success', `✅ ${quantity} unidad(es) agregada(s) al carrito`);
        } else {
          showAlert('error', `❌ Error: ${result.message || 'No se pudo agregar el producto'}`);
        }
      } catch (error) {
        showAlert('error', 'Error de conexión: ' + error.message);
      }
    });
  });

  // 4. Crear carrito (manteniendo tu implementación)
  document.getElementById('createCartBtn')?.addEventListener('click', async () => {
    try {
      const response = await fetch('/api/carts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      
      if (data.status === 'success') {
        if (container) container.dataset.cartId = data.payload._id;
        window.location.reload();
      } else {
        alert(data.message || "Error al crear el carrito");
      }
    } catch (error) {
      alert('Error al crear carrito: ' + error.message);
    }
  });

  // Helper para mostrar alertas
  function showAlert(type, message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} position-fixed bottom-0 end-0 m-3`;
    alertDiv.style.zIndex = '1000';
    alertDiv.style.minWidth = '300px';
    alertDiv.textContent = message;
    document.body.appendChild(alertDiv);
    
    setTimeout(() => alertDiv.remove(), 3000);
  }
});