document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector ('.container');
    const cartId = container?.dataset.cartId;
  // 1. Crear carrito
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
         const container = document.querySelector('.container');
      if (container) container.dataset.cartId = data.payload._id;
        window.location.reload(); // Recarga para mostrar el botón "Ver Carrito"
      }else{ 
        alert (data.message || "Error al crear el carrito")
      }
    } catch (error) {
      alert('Error al crear carrito: ' + error.message);
    }
  });

  // 2. Agregar productos al carrito
  document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', async () => {
      
      
      if (!cartId) {
        alert ('Primero debes crear un carrito')
        return
      }

      const productId = button.dataset.productId;

      try {
        const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const result = await response.json();
        if (result.status === 'success') {
          alert('Producto agregado al carrito!');
        }
      } catch (error) {
        alert('Error: ' + error.message);
      }
    });
  });
});