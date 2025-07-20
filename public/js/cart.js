const container = document.querySelector('.container');
const cartId = container?.dataset.cartId;

function showAlert(type, message){
  const alertDiv = document.createElement ('div');
  alertDiv.className = `alert alert-${type} position fixed bottom-0 end-0 m-3`;
  alertDiv.style.zIndex = '1000';
  alertDiv.style.minWidth = '300px';
  alertDiv.textContent = message;
  document.body.appendChild(alertDiv);

  setTimeout(() => alertDiv.remove(), 3000)
}

async function addProductToCart(cartId, productId, quantity = 1) {
  try{
    const response = await fetch (`/api/carts/${cartId}/products/${productId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
      },
      body: JSON.stringify({quantity})
    });
 
    const result = await response.json();
    if (result.status === 'success') {
      alert(`${quantity} unidad(es) agregadas(s) al carrito`)
    }else{
      alert(`Error: ${result.message || 'No se pudo agregar el producto'}`)
    }
  }catch(error){
    alert('Error de conexion' + error.message)
  }
  
}

// Eliminar producto del carrito
document.querySelectorAll('.remove-from-cart').forEach(button => {
  button.addEventListener('click', async () => {
    const productId = button.dataset.productId;
    const cartId = container?.dataset.cartId;
    
    try {
      const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const result = await response.json();
      
      if (result.status === 'success') {
        window.location.reload(); // Recargar para ver cambios
      } else {
        alert(result.message || 'Error al eliminar producto');
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }
  });
});

document.getElementById('emptyCartBtn')?.addEventListener('click', async () => {
    if (!confirm('¿Estas seguro de vaciar el carrito? Todos los productos se eliminarán.'))
      return;
    try{
      const response = await fetch(`/api/carts/${cartId}/empty`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        }
      });
      const result = await response.json();

      if (result.status === 'success') {
        showAlert('success', 'Carrito eliminado correctamente');
        setTimeout(() => window.location.reload(), 1500)
      }else{
        showAlert('error', `Error: ${result.message || 'No se pudo vaciar el carrito'}`)
      }
    }catch(error){
      showAlert('error', 'Error de conexion: ' + error.message)
    }
  })

// Finalizar compra (opcional)
document.getElementById('checkoutBtn')?.addEventListener('click', () => {
  // Implementar lógica de checkout
});